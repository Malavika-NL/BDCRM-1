import hmac
import logging
import threading

import requests
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import transaction
from django.db.models import Q

from django.utils import timezone

from .models import Contact, PlannerCallAssignment

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
    raw_status = (
        data.get("status")
        or data.get("contact_status")
        or data.get("call_status")
        or data.get("verification_status")
        or data.get("response_type")
        or ""
    )
    normalized_status = str(raw_status).strip().lower()
    inferred_verified = normalized_status in {
        "1",
        "true",
        "yes",
        "verified",
        "contacted",
        "completed",
        "done",
        "called",
    }
    return {
        "source_contact_id": str(data.get("source_contact_id") or data.get("contact_id") or ""),
        "source_project": str(data.get("source_project") or "").strip().lower(),
        "source_owner_name": (data.get("source_owner_name") or "").strip(),
        "source_owner_email": (data.get("source_owner_email") or "").strip().lower(),
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
        "remarks": (
            data.get("remarks")
            or data.get("remark")
            or data.get("notes")
            or data.get("description")
            or ""
        ).strip(),
        "is_verified": (
            raw_is_verified is True
            or str(raw_is_verified).strip().lower() in {"1", "true", "yes"}
            or inferred_verified
        ),
    }


def normalize_mobile_number(value):
    digits = "".join(ch for ch in (value or "") if ch.isdigit())
    if len(digits) > 10:
        digits = digits[-10:]
    return digits


def contact_to_common_payload(contact):
    origin_project = contact.source_project if contact.source_project in {"marketing_crm", "salespie", "bdcrm"} else "bdcrm"
    return {
        "name": contact.person_name or "",
        "email": (contact.email or "").strip().lower(),
        "mobile_number": contact.phone or "",
        "company_name": contact.company_name or "",
        "designation": contact.designation or "",
        "region": contact.region or "",
        "location": contact.location or "",
        "is_verified": bool(contact.is_verified),
        "status": "contacted" if contact.is_verified else "pending",
        "source_contact_id": contact.source_contact_id,
        "source_project": contact.source_project or "bdcrm",
        "source_owner_name": contact.source_owner_name,
        "source_owner_email": contact.source_owner_email,
        "origin_project": origin_project,
        "origin_contact_id": contact.source_contact_id or str(contact.pk),
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


def _is_sync_placeholder(name):
    return str(name or "").strip().lower() in {
        "salespie sync", "marketing crm sync", "marketing sync", "sync",
    }


def get_sync_assignment_target_urls():
    raw = getattr(settings, "CONTACT_ASSIGNMENT_SYNC_TARGET_URLS", "")
    if not raw:
        raw = ",".join(
            item.replace("/sync/contact/", "/sync/tele-assignment/")
            for item in get_contact_sync_target_urls()
        )
    return list(dict.fromkeys(item.strip() for item in raw.split(",") if item.strip()))


def upsert_contact_from_common_payload(data):
    assignment_id = data.get("bdcrm_assignment_id")
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
    source_project = payload["source_project"] or "peer"
    force_source_project = str(data.get("force_source_project") or "").strip().lower()
    # A contact has one origin for display and accountability.  When the same
    # person is later mirrored through another CRM, keep the CRM that first
    # supplied the contact instead of turning the label into an ambiguous
    # "both" value.
    if force_source_project:
        contact.source_project = force_source_project
    elif not contact.source_project or contact.source_project == "peer":
        contact.source_project = source_project
    elif contact.source_project == "both":
        # Repair rows created by the previous merge behaviour using the
        # concrete source of this incoming canonical record.
        contact.source_project = source_project
    contact.source_contact_id = payload["source_contact_id"]
    source_owner_name = payload["source_owner_name"]
    if (
        source_owner_name
        and not _is_sync_placeholder(source_owner_name)
        and source_owner_name not in contact.source_owner_name
    ):
        contact.source_owner_name = ", ".join(
            value for value in (contact.source_owner_name, source_owner_name) if value
        )
    if payload["source_owner_email"] and payload["source_owner_email"] not in contact.source_owner_email:
        contact.source_owner_email = ", ".join(
            value for value in (contact.source_owner_email, payload["source_owner_email"]) if value
        )
    if source_owner_name and not _is_sync_placeholder(source_owner_name):
        contact.created_by_name = source_owner_name
    if payload["is_verified"]:
        contact.is_verified = True

    with suppress_contact_sync():
        contact.save()

    if payload["is_verified"]:
        _mark_latest_assignment_contacted(
            contact, payload.get("remarks", ""), assignment_id
        )

    return contact, created


def _mark_latest_assignment_contacted(contact, remarks="", assignment_id=None):
    assignment = PlannerCallAssignment.objects.filter(id=assignment_id).select_related('planner_task').first() if assignment_id else None
    if not assignment:
        assignment = (
        PlannerCallAssignment.objects.select_related('planner_task')
        .filter(contact=contact, status__in=['pending', 'skipped'])
        .order_by('scheduled_date', 'sequence_number', 'id')
        .first()
        )
    if not assignment:
        return

    assignment.status = 'contacted'
    assignment.contacted_at = timezone.now()
    assignment.remarks = remarks or assignment.remarks or 'Synced as contacted from peer CRM.'
    assignment.save(update_fields=['status', 'contacted_at', 'remarks', 'updated_at'])

    planner_task = assignment.planner_task
    pending_count = planner_task.call_assignments.filter(status='pending').count()
    if pending_count == 0:
        planner_task.status = 'done'
    elif planner_task.call_assignments.filter(status='contacted').exists():
        planner_task.status = 'in_progress'
    else:
        planner_task.status = 'pending'
    planner_task.save(update_fields=['status', 'updated_at'])


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


def send_assignment_to_peer(contact, assigned_user, assignment=None, planner_name=""):
    """Mirror a BDCRM planner assignment into Marketing CRM."""
    urls = get_sync_assignment_target_urls()
    token = getattr(settings, "CONTACT_SYNC_API_TOKEN", "")
    if not urls or not token or not assigned_user or not assigned_user.email:
        return
    payload = {
        # These identifiers make the operation idempotent in Marketing CRM and
        # let it reconcile a retry with the same BDCRM planner row.
        "source_contact_id": str(contact.pk),
        "source_project": "bdcrm",
        "assigned_user_email": assigned_user.email,
        "assigned_user_name": assigned_user.get_full_name() or assigned_user.username,
        "assigned_user_username": assigned_user.username,
        "person_name": contact.person_name or "",
        "company_name": contact.company_name or "",
        "email": contact.email or "",
        "phone": contact.phone or "",
        "designation": contact.designation or "",
        "region": contact.region or "",
        "location": contact.location or "",
        "is_verified": bool(contact.is_verified),
        "bdcrm_assignment_id": getattr(assignment, "id", None),
        "bdcrm_planner_name": planner_name,
        "scheduled_date": (
            getattr(assignment, "scheduled_date", None).isoformat()
            if getattr(assignment, "scheduled_date", None) else None
        ),
    }

    def _post_assignment():
        for target_url in urls:
            try:
                response = requests.post(
                    target_url, json=payload,
                    headers={"X-Contact-Sync-Token": token, "X-Contact-Sync-Source": "bdcrm"},
                    timeout=getattr(settings, "CONTACT_SYNC_TIMEOUT_SECONDS", 5),
                )
                response.raise_for_status()
                logger.info(
                    "Assignment %s synced to %s for %s",
                    payload["bdcrm_assignment_id"], target_url, assigned_user.email,
                )
            except requests.RequestException as exc:
                logger.warning("Assignment sync to %s failed for contact %s: %s", target_url, contact.pk, exc)
    # Assignment sync is auxiliary; a CRM/network failure must never make the
    # BDCRM planner save fail with HTTP 500.
    try:
        transaction.on_commit(_post_assignment)
    except Exception as exc:
        logger.warning("Could not queue assignment sync for contact %s: %s", contact.pk, exc)


def delete_assignment_from_peer(assignment_id, contact=None, planner_name="", purge_legacy=False):
    urls = get_sync_assignment_target_urls()
    token = getattr(settings, "CONTACT_SYNC_API_TOKEN", "")
    if not urls or not token:
        return
    def _delete():
        for target_url in urls:
            try:
                requests.post(target_url, json={"deleted": True, "bdcrm_assignment_id": assignment_id,
                                                "email": getattr(contact, "email", ""), "phone": getattr(contact, "phone", ""),
                                                "bdcrm_planner_name": planner_name, "purge_legacy": purge_legacy},
                              headers={"X-Contact-Sync-Token": token},
                              timeout=getattr(settings, "CONTACT_SYNC_TIMEOUT_SECONDS", 5)).raise_for_status()
            except requests.RequestException as exc:
                logger.warning("Assignment delete sync to %s failed for %s: %s", target_url, assignment_id, exc)
    transaction.on_commit(_delete)
