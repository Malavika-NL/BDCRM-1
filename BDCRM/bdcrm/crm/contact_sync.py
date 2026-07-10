import hmac
import logging
import threading

import requests
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import transaction
from django.db.models import Q

from .models import Contact

logger = logging.getLogger(__name__)
_sync_state = threading.local()


COMMON_CONTACT_FIELDS = (
    "name",
    "email",
    "mobile_number",
    "company_name",
    "designation",
    "region",
    "location",
)
SYNC_TOKEN_HEADER = "HTTP_X_CONTACT_SYNC_TOKEN"


def contact_sync_suppressed():
    return bool(getattr(_sync_state, "suppressed", False))


class suppress_contact_sync:
    def __enter__(self):
        self.previous = contact_sync_suppressed()
        _sync_state.suppressed = True

    def __exit__(self, exc_type, exc, traceback):
        _sync_state.suppressed = self.previous


def normalize_contact_payload(data):
    raw_is_verified = data.get("is_verified", False)
    return {
        "name": (data.get("name") or data.get("person_name") or "").strip(),
        "email": (data.get("email") or "").strip().lower(),
        "mobile_number": (
            data.get("mobile_number")
            or data.get("mobile")
            or data.get("phone")
            or ""
        ).strip(),
        "company_name": (data.get("company_name") or data.get("company") or "").strip(),
        "designation": (data.get("designation") or "").strip(),
        "region": (data.get("region") or "").strip(),
        "location": (data.get("location") or "").strip(),
        "is_verified": raw_is_verified is True or str(raw_is_verified).strip().lower() in {"1", "true", "yes"},
    }


def normalize_mobile_number(value):
    digits = "".join(ch for ch in (value or "") if ch.isdigit())
    if len(digits) > 10:
        digits = digits[-10:]
    return digits


def contact_to_common_payload(contact):
    return {
        "name": contact.person_name or "",
        "email": (contact.email or "").strip().lower(),
        "mobile_number": contact.phone or "",
        "company_name": contact.company_name or "",
        "designation": contact.designation or "",
        "region": contact.region or "",
        "location": contact.location or "",
    }


def get_contact_sync_target_urls():
    urls = []
    raw_values = [
        getattr(settings, "CONTACT_SYNC_TARGET_URL", ""),
        getattr(settings, "CONTACT_SYNC_TARGET_URLS", ""),
    ]
    for raw_value in raw_values:
        urls.extend(item.strip() for item in raw_value.split(",") if item.strip())
    return list(dict.fromkeys(urls))


def validate_sync_token(request):
    expected = getattr(settings, "CONTACT_SYNC_API_TOKEN", "")
    if not expected:
        return False

    provided = (
        request.META.get(SYNC_TOKEN_HEADER)
        or request.META.get("HTTP_AUTHORIZATION", "").removeprefix("Bearer ").strip()
    )
    return bool(provided) and hmac.compare_digest(provided, expected)


def find_matching_contact(payload):
    query = Q()
    if payload["email"]:
        query |= Q(email__iexact=payload["email"])

    if not query:
        contact = None
    else:
        contact = Contact.objects.filter(query).order_by("id").first()

    if contact:
        return contact

    normalized_mobile = normalize_mobile_number(payload["mobile_number"])
    if not normalized_mobile:
        return None

    for candidate in Contact.objects.exclude(phone__isnull=True).exclude(phone="").order_by("id"):
        if normalize_mobile_number(candidate.phone) == normalized_mobile:
            return candidate

    return None


def get_sync_created_by_name():
    User = get_user_model()
    user = (
        User.objects.filter(Q(is_superuser=True) | Q(is_staff=True))
        .order_by("id")
        .first()
        or User.objects.order_by("id").first()
    )
    if not user:
        return ""
    return user.get_full_name() or user.username


def upsert_contact_from_common_payload(data):
    payload = normalize_contact_payload(data)
    if not payload["email"] and not payload["mobile_number"]:
        raise ValueError("Either email or mobile_number is required.")

    contact = find_matching_contact(payload)
    created = contact is None
    if created:
        contact = Contact()
        contact.created_by_name = get_sync_created_by_name()
    elif not contact.created_by_name:
        contact.created_by_name = get_sync_created_by_name()

    contact.person_name = payload["name"]
    contact.email = payload["email"] or None
    contact.phone = payload["mobile_number"] or None
    contact.company_name = payload["company_name"]
    contact.designation = payload["designation"]
    contact.region = payload["region"]
    contact.location = payload["location"]
    if payload["is_verified"]:
        contact.is_verified = True

    with suppress_contact_sync():
        contact.save()

    return contact, created


def send_contact_to_peer(contact):
    if contact_sync_suppressed():
        return

    target_urls = get_contact_sync_target_urls()
    token = getattr(settings, "CONTACT_SYNC_API_TOKEN", "")
    if not target_urls or not token:
        logger.info("Contact sync skipped because target URL or API token is not configured.")
        return

    payload = contact_to_common_payload(contact)
    if not payload["email"] and not payload["mobile_number"]:
        logger.info("Contact sync skipped for contact %s without email/mobile.", contact.pk)
        return

    def _post_after_commit():
        for target_url in target_urls:
            try:
                response = requests.post(
                    target_url,
                    json=payload,
                    headers={
                        "X-Contact-Sync-Token": token,
                        "X-Contact-Sync-Source": getattr(settings, "CONTACT_SYNC_SOURCE", ""),
                    },
                    timeout=getattr(settings, "CONTACT_SYNC_TIMEOUT_SECONDS", 5),
                )
                response.raise_for_status()
            except requests.RequestException as exc:
                logger.warning("Contact sync to %s failed for contact %s: %s", target_url, contact.pk, exc)

    transaction.on_commit(_post_after_commit)
