"""Tenant context for BDCRM.

The company is taken only from the signed portal JWT.  Browser headers and
query parameters must never select a tenant.
"""
from contextvars import ContextVar

from django.db import models
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


NL_COMPANY_ID = 1
_company_id = ContextVar('bdcrm_company_id', default=NL_COMPANY_ID)


def current_company_id():
    value = _company_id.get()
    if value is None:
        raise AuthenticationFailed('Company context has not been established.')
    try:
        value = int(value)
    except (TypeError, ValueError) as exc:
        raise AuthenticationFailed('Invalid company context.') from exc
    if value < 1:
        raise AuthenticationFailed('Invalid company context.')
    return value


def set_current_company_id(value):
    _company_id.set(int(value))
    return current_company_id()


class CurrentCompanyId(models.Expression):
    output_field = models.PositiveBigIntegerField()

    def as_sql(self, compiler, connection):
        return '%s', [current_company_id()]


class TenantManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(tenant_company_id=CurrentCompanyId())


class TenantModel(models.Model):
    tenant_company_id = models.PositiveBigIntegerField(
        default=current_company_id, db_index=True, editable=False,
    )
    objects = TenantManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.tenant_company_id = current_company_id()
        return super().save(*args, **kwargs)


class CompanyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None
        user, token = result
        try:
            request.company_id = set_current_company_id(token.get('company_id'))
        except (AuthenticationFailed, TypeError, ValueError) as exc:
            raise AuthenticationFailed('Token is missing a valid company context.') from exc
        return user, token


class CompanyContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        marker = _company_id.set(None)
        try:
            return self.get_response(request)
        finally:
            _company_id.reset(marker)
