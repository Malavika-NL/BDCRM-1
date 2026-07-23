from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Tag, UserProfile
from .tenancy import set_current_company_id


class BDCRMTenantIsolationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        set_current_company_id(1)
        nl = User.objects.create_user("nl-user", email="nl@example.com", password="Password123!")
        UserProfile.objects.create(user=nl, role="admin")
        Tag.objects.create(name="Priority")

        set_current_company_id(2)
        vbs = User.objects.create_user("vbs-user", email="vbs@example.com", password="Password123!")
        UserProfile.objects.create(user=vbs, role="admin")
        Tag.objects.create(name="Priority")

    def test_profiles_and_reference_data_are_company_scoped(self):
        set_current_company_id(1)
        self.assertEqual(UserProfile.objects.get().user.username, "nl-user")
        self.assertEqual(Tag.objects.get().name, "Priority")
        set_current_company_id(2)
        self.assertEqual(UserProfile.objects.get().user.username, "vbs-user")
        self.assertEqual(Tag.objects.get().name, "Priority")

    def test_portal_lookup_cannot_cross_company(self):
        headers = {"HTTP_X_PORTAL_SSO_SECRET": settings.COMPANY_PORTAL_SSO_SECRET}
        allowed = self.client.post(
            "/api/portal/company-account/",
            {"email": "nl@example.com", "company_id": 1},
            format="json",
            **headers,
        )
        blocked = self.client.post(
            "/api/portal/company-account/",
            {"email": "nl@example.com", "company_id": 2},
            format="json",
            **headers,
        )
        self.assertEqual(allowed.status_code, 200)
        self.assertEqual(blocked.status_code, 404)

