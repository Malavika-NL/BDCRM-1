from unittest.mock import patch

from django.core import signing
from django.test import SimpleTestCase, override_settings
from rest_framework.test import APIRequestFactory

from .salespie_dashboard import SalesPieDashboardView
from .tenancy import current_company_id


@override_settings(BDCRM_DASHBOARD_SECRET='dashboard-test-secret')
class SalesPieDashboardTests(SimpleTestCase):
    def token(self, company=2, **kwargs):
        return signing.dumps({'company_id': company}, key=kwargs.get('key', 'dashboard-test-secret'),
                             salt=kwargs.get('salt', 'salespie.bdcrm.dashboard.v1'))

    def get(self, token=''):
        request = APIRequestFactory().get('/?company_id=999', HTTP_X_COMPANY_ID='999',
                                         HTTP_X_SALESPIE_DASHBOARD_TOKEN=token)
        return SalesPieDashboardView.as_view()(request)

    def test_missing_invalid_and_wrong_purpose_signatures_are_rejected(self):
        for token in ['', 'bad', self.token(key='wrong'), self.token(salt='other-purpose')]:
            with self.subTest(token_type=token[:5]):
                self.assertEqual(self.get(token).status_code, 403)

    def test_expired_signature_is_rejected(self):
        with patch('django.core.signing.time.time', return_value=1000):
            token = self.token()
        with patch('django.core.signing.time.time', return_value=1061):
            self.assertEqual(self.get(token).status_code, 403)

    def test_invalid_company_claims_are_rejected(self):
        for company in [None, True, 0, -1, '2']:
            self.assertEqual(self.get(self.token(company)).status_code, 403)

    def test_only_signed_company_selects_data(self):
        with patch.object(SalesPieDashboardView, 'dashboard_data',
                          side_effect=lambda: {'company': current_company_id()}):
            for company in [1, 2]:
                response = self.get(self.token(company))
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.data, {'company': company})
                self.assertEqual(response['Cache-Control'], 'no-store')

    def test_feed_is_read_only(self):
        request = APIRequestFactory().post('/', {}, HTTP_X_SALESPIE_DASHBOARD_TOKEN=self.token())
        self.assertEqual(SalesPieDashboardView.as_view()(request).status_code, 405)
