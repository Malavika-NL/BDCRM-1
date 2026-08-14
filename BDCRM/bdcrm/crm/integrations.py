import hmac
import logging

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from crm.models import WishlistEntry

log = logging.getLogger(__name__)

WISHLIST_TOKEN_HEADER = "HTTP_X_WISHLIST_SYNC_TOKEN"


def _token_ok(request) -> bool:
    expected = getattr(settings, "WISHLIST_SYNC_API_TOKEN", "")
    if not expected:
        return False
    provided = (
        request.META.get(WISHLIST_TOKEN_HEADER)
        or request.META.get("HTTP_AUTHORIZATION", "").removeprefix("Bearer ").strip()
    )
    return bool(provided) and hmac.compare_digest(provided, expected)


class WishlistSyncView(APIView):
    """Read-only wishlist feed for TalentAI. Token-authenticated, no user session."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        if not _token_ok(request):
            return Response({"detail": "invalid token"}, status=status.HTTP_403_FORBIDDEN)

        entries = (
            WishlistEntry.objects
            .select_related("created_by")
            .order_by("id")
        )

        payload = [
            {
                "id": e.id,
                "company_name": e.company_name,
                "location": e.location,
                "created_by_email": getattr(e.created_by, "email", "") or "",
                "created_by_name": (
                    (e.created_by.get_full_name() or "").strip()
                    or getattr(e.created_by, "username", "")
                    if e.created_by else ""
                ),
                "created_at": e.created_at.isoformat(),
                "updated_at": e.updated_at.isoformat(),
            }
            for e in entries
        ]

        return Response({"count": len(payload), "results": payload})
