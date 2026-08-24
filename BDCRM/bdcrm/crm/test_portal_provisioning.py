from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import UserProfile

SSO_SECRET = 'test-portal-secret'


@override_settings(PORTAL_SSO_SHARED_SECRET=SSO_SECRET)
class CompanyPortalAccountViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('company_portal_account')

    def _post(self, payload, secret=SSO_SECRET, company_header='1'):
        headers = {}
        if secret is not None:
            headers['HTTP_X_PORTAL_SSO_SECRET'] = secret
        if company_header is not None:
            headers['HTTP_X_COMPANY_ID'] = company_header
        return self.client.post(self.url, payload, format='json', **headers)

    # --- credential gate ---

    def test_missing_secret_is_rejected(self):
        response = self._post({'email': 'a@example.com', 'company_id': 1}, secret=None)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_wrong_secret_is_rejected(self):
        response = self._post({'email': 'a@example.com', 'company_id': 1}, secret='wrong')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_missing_company_context_is_rejected(self):
        response = self._post({'email': 'a@example.com'}, company_header=None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- company_id mismatch ---

    def test_company_id_mismatch_between_body_and_header_is_rejected(self):
        response = self._post(
            {'email': 'a@example.com', 'company_id': 2, 'provision': True, 'role': 'employee'},
            company_header='1',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_company_id_matching_as_int_and_string_is_accepted(self):
        response = self._post(
            {'email': 'match@example.com', 'company_id': '1', 'provision': True, 'role': 'employee'},
            company_header='1',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # --- role rejection ---

    def test_invalid_role_rejected_on_create(self):
        response = self._post({'email': 'bad-role@example.com', 'provision': True, 'role': 'superadmin'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email__iexact='bad-role@example.com').exists())

    def test_invalid_role_rejected_on_update(self):
        user = User.objects.create_user(username='existing1', email='existing1@example.com')
        response = self._post({'email': 'existing1@example.com', 'provision': True, 'role': 'nope'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertFalse(user.is_staff)

    # --- provision x active matrix ---

    def test_provision_true_creates_new_account(self):
        response = self._post({
            'email': 'new.user@example.com', 'provision': True, 'active': True,
            'role': 'employee', 'first_name': 'New', 'last_name': 'User', 'phone': '111',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['created'])
        self.assertTrue(data['is_active'])
        user = User.objects.get(pk=int(data['external_user_id']))
        self.assertEqual(user.first_name, 'New')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.has_usable_password())
        self.assertEqual(user.profile.role, 'employee')
        self.assertEqual(user.profile.phone_number, '111')

    def test_not_found_and_provision_false_does_not_create(self):
        response = self._post({'email': 'ghost@example.com', 'provision': False})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(User.objects.filter(email__iexact='ghost@example.com').exists())

    def test_active_false_with_no_existing_user_returns_404_without_creating(self):
        response = self._post({
            'email': 'neveractivate@example.com', 'provision': True, 'active': False, 'role': 'employee',
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(User.objects.filter(email__iexact='neveractivate@example.com').exists())

    def test_found_provision_true_reactivates_and_updates_without_duplicating(self):
        user = User.objects.create_user(username='dormant', email='dormant@example.com', is_active=False)
        UserProfile.objects.create(user=user, role='employee')
        response = self._post({
            'email': 'dormant@example.com', 'provision': True, 'role': 'admin',
            'first_name': 'Dora', 'last_name': 'Mant', 'phone': '222',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertFalse(data['created'])
        self.assertEqual(data['external_user_id'], str(user.pk))
        self.assertEqual(User.objects.filter(email__iexact='dormant@example.com').count(), 1)
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertEqual(user.first_name, 'Dora')
        self.assertTrue(user.is_staff)
        self.assertEqual(user.profile.role, 'admin')
        self.assertEqual(user.profile.phone_number, '222')

    def test_found_active_false_deactivates_even_when_provision_true(self):
        user = User.objects.create_user(username='revokeme', email='revoke@example.com', is_active=True)
        UserProfile.objects.create(user=user, role='employee')
        response = self._post({
            'email': 'revoke@example.com', 'provision': True, 'active': False, 'role': 'admin',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertFalse(user.is_active)
        # Deactivation wins: role must NOT have been touched by the same call.
        self.assertEqual(user.profile.role, 'employee')
        self.assertFalse(user.is_staff)

    def test_found_no_provision_no_active_is_a_pure_lookup(self):
        user = User.objects.create_user(username='lookuponly', email='lookup@example.com')
        response = self._post({'email': 'lookup@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['external_user_id'], str(user.pk))
        self.assertFalse(data['created'])

    # --- username dedup / sanitisation ---

    def test_username_collision_gets_deduped(self):
        User.objects.create_user(username='sameuser', email='other@somewhere.com')
        response = self._post({'email': 'sameuser@example.com', 'provision': True, 'role': 'employee'})
        data = response.json()
        self.assertNotEqual(data['username'], 'sameuser')
        self.assertTrue(User.objects.filter(username=data['username']).exists())

    def test_empty_local_part_falls_back_to_portal_company_username(self):
        response = self._post({
            'email': '+@example.com', 'provision': True, 'role': 'employee',
            'portal_username': 'marketing-42',
        }, company_header='7')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['username'].startswith('portal-7-marketing-42'))

    def test_fallback_username_dedup_uses_same_suffix_convention(self):
        User.objects.create_user(username='portal-7-marketing-42', email='taken@somewhere.com')
        response = self._post({
            'email': '+@example.com', 'provision': True, 'role': 'employee',
            'portal_username': 'marketing-42',
        }, company_header='7')
        data = response.json()
        self.assertEqual(data['username'], 'portal-7-marketing-42_1')

    # --- promote / demote is_staff ---

    def test_promote_to_admin_sets_is_staff(self):
        user = User.objects.create_user(username='promote', email='promote@example.com')
        UserProfile.objects.create(user=user, role='employee')
        self._post({'email': 'promote@example.com', 'provision': True, 'role': 'admin'})
        user.refresh_from_db()
        self.assertTrue(user.is_staff)

    def test_demote_to_employee_clears_is_staff(self):
        user = User.objects.create_user(username='demote', email='demote@example.com', is_staff=True)
        UserProfile.objects.create(user=user, role='admin')
        self._post({'email': 'demote@example.com', 'provision': True, 'role': 'employee'})
        user.refresh_from_db()
        self.assertFalse(user.is_staff)

    # --- superuser guards ---

    def test_superuser_is_staff_never_touched(self):
        user = User.objects.create_user(
            username='root', email='root@example.com', is_staff=True, is_superuser=True,
        )
        UserProfile.objects.create(user=user, role='admin')
        self._post({'email': 'root@example.com', 'provision': True, 'role': 'employee'})
        user.refresh_from_db()
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.profile.role, 'employee')

    def test_superuser_deactivation_is_blocked(self):
        user = User.objects.create_user(
            username='superroot', email='superroot@example.com',
            is_staff=True, is_superuser=True, is_active=True,
        )
        UserProfile.objects.create(user=user, role='admin')
        response = self._post({
            'email': 'superroot@example.com', 'provision': True, 'active': False, 'role': 'employee',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['is_active'])
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_superuser)
