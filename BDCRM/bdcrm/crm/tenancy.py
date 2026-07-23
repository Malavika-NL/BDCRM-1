from contextvars import ContextVar

from django.db import models
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


NL_COMPANY_ID = 1
_company_id = ContextVar("bdcrm_company_id", default=NL_COMPANY_ID)


def get_current_company_id():
    return int(_company_id.get())


def set_current_company_id(company_id):
    try:
        company_id = int(company_id)
    except (TypeError, ValueError):
        raise AuthenticationFailed("Invalid company context.")
    if company_id < 1:
        raise AuthenticationFailed("Invalid company context.")
    _company_id.set(company_id)
    return company_id


class CurrentCompanyId(models.Expression):
    output_field = models.PositiveBigIntegerField()

    def as_sql(self, compiler, connection):
        return "%s", [get_current_company_id()]


class CompanyQuerySet(models.QuerySet):
    def update(self, **kwargs):
        kwargs.pop("tenant_company_id", None)
        return super().update(**kwargs)

    def bulk_create(self, objs, *args, **kwargs):
        company_id = get_current_company_id()
        for obj in objs:
            obj.tenant_company_id = company_id
        return super().bulk_create(objs, *args, **kwargs)


class CompanyManager(models.Manager.from_queryset(CompanyQuerySet)):
    def get_queryset(self):
        return super().get_queryset().filter(tenant_company_id=CurrentCompanyId())


class TenantModel(models.Model):
    tenant_company_id = models.PositiveBigIntegerField(default=get_current_company_id, db_index=True, editable=False)
    objects = CompanyManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.tenant_company_id = get_current_company_id()
        return super().save(*args, **kwargs)


class CompanyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None
        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        company_id = set_current_company_id(validated_token.get("company_id"))
        user = self.get_user(validated_token)
        try:
            profile_company_id = int(user.profile.tenant_company_id)
        except (AttributeError, TypeError, ValueError):
            raise AuthenticationFailed("This account has no company assignment.")
        if profile_company_id != company_id:
            raise AuthenticationFailed("This account does not belong to the selected company.")
        return user, validated_token


class CompanyContextMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = _company_id.set(NL_COMPANY_ID)
        header_company_id = request.headers.get("X-Company-ID")
        if header_company_id:
            set_current_company_id(header_company_id)
        try:
            return self.get_response(request)
        finally:
            _company_id.reset(token)
