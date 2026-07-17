from rest_framework import viewsets, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.db import OperationalError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
import os
import requests
import re
import json
from django.conf import settings
from django.utils import timezone
import requests # Make sure this is at the top of views.py
from datetime import date
import calendar
from datetime import timedelta
from .ai_helper import ask_ai, ask_ai_json
from .models import (
    ProductLine, CustomerCategory, SalesChannel, EngagementTool,
    LeadBusinessMeta, BDMTarget, BDMReview, CampaignWorkspace, CampaignResponse,
    ActivityPlanner, PlannerMemberPlan, PlannerTask, PlannerCallAssignment, AccountTargetCompany, AccountTargetPIC
)

from .serializers import (
    ProductLineSerializer, CustomerCategorySerializer, SalesChannelSerializer,
    EngagementToolSerializer, LeadBusinessMetaSerializer,
    BDMTargetSerializer, BDMReviewSerializer,
    CampaignWorkspaceSerializer, CampaignResponseSerializer,
    CampaignWorkspaceGenerateSerializer, ActivityPlannerSerializer,
    PlannerMemberPlanSerializer, PlannerTaskSerializer, PlannerCallAssignmentSerializer, AccountTargetCompanySerializer, ActivityPlannerOptionSerializer,
    AccountTargetRegistrationSerializer, WishlistEntrySerializer
)
from .models import (AILeadProfile, Lead, Contact, Course, Activity, Task, Tag, Company, Vertical, Region, Industry, Campaign, AIInteractionLog,
                     ConsumptionPattern, ProductCategory, Enrollment, AILeadProfile, AIScoreSnapshot, AIActivityAnalysis,
    AIAlert, AIChatSession, AIDocument, WishlistEntry)
from .serializers import (
    LeadSerializer, CourseSerializer, ActivitySerializer,    AILeadProfileSerializer, AIScoreSnapshotSerializer, AIActivityAnalysisSerializer,
    AIAlertSerializer, AIDocumentSerializer, AIChatInputSerializer,
    TaskSerializer, TagSerializer, CompanySerializer, ContactSerializer, AIInteractionLogSerializer,
    ConsumptionPatternSerializer, AgentIngestionSerializer
)
from .serializers import LoginSerializer, ChangePasswordSerializer, UserCreateSerializer, UserMeSerializer, UserUpdateSerializer
from .ai_engine import (
    LeadScoringEngine, ChurnPredictionEngine, ConversationIntelligence,
    CRMChatbot, RevenueForecastEngine, AIDocumentGenerator,
    AnomalyDetectionEngine, DailyDigestGenerator, _call_claude
)
from .contact_sync import (
    COMMON_CONTACT_FIELDS,
    find_matching_contact,
    normalize_contact_payload,
    upsert_contact_from_common_payload,
    validate_sync_token,
    send_assignment_to_peer,
    delete_assignment_from_peer,
)
from django.conf import settings


def _token_payload_for_user(user: User):
    profile = getattr(user, "profile", None)
    role = profile.role if profile else ("admin" if user.is_staff else "employee")
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserMeSerializer(user).data,
        "role": role,
    }


def _is_admin(user):
    request_role = getattr(getattr(user, "profile", None), "role", None)
    return bool(user and (user.is_superuser or user.is_staff or request_role == "admin"))


def _is_telemarketing_user(user):
    if not user or not getattr(user, "is_active", False):
        return False
    profile = getattr(user, "profile", None)
    if not profile:
        return False
    searchable = f"{profile.designation or ''} {profile.department or ''}".lower()
    keywords = ("telemarketing", "tele-calling", "telecalling", "tele caller", "telecaller")
    if any(keyword in searchable for keyword in keywords):
        return True
    return getattr(profile, "role", "") == "employee" and not searchable.strip()


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get("username", "").strip()
        email = serializer.validated_data.get("email", "").strip().lower()
        password = serializer.validated_data["password"]
        user = None
        inactive_user = None

        try:
            if username:
                user = authenticate(username=username, password=password)
            elif email:
                email_users = User.objects.filter(email__iexact=email).order_by("id")
                for candidate in email_users:
                    if not candidate.is_active:
                        inactive_user = candidate
                        continue
                    if candidate.check_password(password):
                        user = candidate
                        break

            if not user and username:
                username_users = User.objects.filter(username__iexact=username).order_by("id")
                for candidate in username_users:
                    if not candidate.is_active:
                        inactive_user = candidate
                        continue
                    if candidate.check_password(password):
                        user = candidate
                        break
        except OperationalError:
            return Response(
                {"detail": "Database is not initialized. Run migrations first: python manage.py migrate"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if not user and inactive_user:
            return Response({"detail": "Account is inactive. Contact admin."}, status=status.HTTP_403_FORBIDDEN)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(_token_payload_for_user(user), status=status.HTTP_200_OK)


class RefreshAuthTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CreateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can create users."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserMeSerializer(user).data, status=status.HTTP_201_CREATED)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"user": request.user})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response(UserMeSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def bootstrap_admin_profile(request):
    from .models import UserProfile

    if request.user.is_superuser or request.user.is_staff:
        UserProfile.objects.get_or_create(user=request.user, defaults={"role": "admin"})
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def list_users(request):
    if not _is_admin(request.user):
        return Response({"detail": "Only admin can view users."}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all().order_by('-date_joined')
    return Response(UserMeSerializer(users, many=True).data)


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, user_id):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can edit users."}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserUpdateSerializer(
            data=request.data,
            context={"user_instance": user},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(user, serializer.validated_data)
        return Response(UserMeSerializer(user).data, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can delete users."}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.pk == request.user.pk:
            return Response({"detail": "You cannot delete your own account."}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["person_name", "company_name", "email", "phone", "address", "region", "vertical"]
    ordering_fields = ["created_at", "updated_at", "person_name", "company_name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        project = (self.request.query_params.get("project") or "all").strip().lower()
        project_sources = {
            "marketing_crm": ["marketing_crm", "both"],
            "salespie": ["salespie", "both"],
            "both": ["both"],
        }
        if project in project_sources:
            queryset = queryset.filter(source_project__in=project_sources[project])
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, "is_authenticated", False):
            serializer.save(created_by_name=user.get_full_name() or user.username)
        else:
            serializer.save()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if data.get("name") and not data.get("person_name"):
            data["person_name"] = data.get("name")

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        contact = find_matching_contact({
            "email": validated.get("email") or "",
            "mobile_number": validated.get("phone") or "",
        })
        if contact:
            update_serializer = self.get_serializer(contact, data=validated, partial=True)
            update_serializer.is_valid(raise_exception=True)
            if not contact.created_by_name and getattr(request.user, "is_authenticated", False):
                update_serializer.save(created_by_name=request.user.get_full_name() or request.user.username)
            else:
                self.perform_update(update_serializer)
            return Response(update_serializer.data, status=status.HTTP_200_OK)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContactSyncView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        if not validate_sync_token(request):
            return Response(
                {"error": "Invalid or missing contact sync token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        origin_project = (
            request.data.get("origin_project")
            or request.data.get("source_project")
            or request.headers.get("X-Contact-Sync-Source", "")
        )
        # Accept legacy peer keys, while persisting one source vocabulary for
        # the Contacts page filters and badges.
        origin_project = {
            "marketing": "marketing_crm",
            "marketingcrm": "marketing_crm",
            "sales_pie": "salespie",
        }.get(str(origin_project).strip().lower(), str(origin_project).strip().lower())
        payload = normalize_contact_payload({
            **request.data,
            "source_project": origin_project,
            "source_contact_id": request.data.get("origin_contact_id") or request.data.get("source_contact_id"),
        })
        # Keep planner metadata that is not part of the common contact
        # schema. It identifies the exact BDCRM call assignment to mark
        # contacted after a Marketing CRM verification.
        payload["bdcrm_assignment_id"] = request.data.get("bdcrm_assignment_id")
        payload.update({
            "contact_status": request.data.get("contact_status") or request.data.get("status"),
            "lead_status": request.data.get("lead_status"),
            "lead_type": request.data.get("lead_type"),
            "interested_categories": request.data.get("interested_categories") or [],
            "next_action": request.data.get("next_action") or "",
            "next_follow_up_at": request.data.get("next_follow_up_at"),
            "updated_by_name": request.data.get("updated_by_name") or "",
            "updated_by_email": request.data.get("updated_by_email") or "",
            "remarks": request.data.get("remarks") or "",
        })
        if not payload["email"] and not payload["mobile_number"]:
            return Response(
                {"error": "Either email or mobile_number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            contact, created = upsert_contact_from_common_payload(payload)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                "status": "created" if created else "updated",
                "contact_id": contact.id,
                "contact": {field: payload[field] for field in COMMON_CONTACT_FIELDS},
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by("-created_at")
    serializer_class = LeadSerializer
    
    # Enable Search and Sorting
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'company', 'email', 'tags__name']
    ordering_fields = ['value', 'created_at', 'status']

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        leads = Lead.objects.all()
        
        # --- CALCULATE WON LEADS AND REVENUE ---
        won_leads = leads.filter(status='won')
        won_count = won_leads.count()
        current_revenue = won_leads.aggregate(total=Sum('value'))['total'] or 0
        total_value = leads.aggregate(total=Sum('value'))['total'] or 0
        
        # Win Rate Calculation
        closed_deals = leads.filter(Q(status='won') | Q(status='lost')).count()
        win_rate = (won_count / closed_deals * 100) if closed_deals > 0 else 0

        # Status Counts and Activities
        status_counts = leads.values('status').annotate(count=Count('status'))
        recent_activities = Activity.objects.all().order_by('-created_at')[:5]
        activity_data = ActivitySerializer(recent_activities, many=True).data

        return Response({
            "won_count": won_count,
            "current_revenue": current_revenue,
            "total_value": total_value,
            "total_leads": leads.count(),
            "win_rate": round(win_rate, 1),
            "status_distribution": status_counts,
            "recent_activities": activity_data
        })

    @action(detail=True, methods=["post"])
    def generate_ai_prompt(self, request, pk=None):
        lead = self.get_object()
        custom_prompt = request.data.get("custom_prompt", "")

        system_prompt = "You are an expert Business Development Sales Agent."

        user_prompt = f"""
        Write a highly personalized outreach message for a lead.
        Lead Name: {lead.name}
        Company: {lead.company}
        Current Pipeline Stage: {lead.status}
        Potential Deal Value: ${lead.value}
        """

        if custom_prompt:
            user_prompt += f"\n\nSPECIFIC INSTRUCTIONS FROM THE USER:\n{custom_prompt}"
        else:
            user_prompt += "\n\nIf 'new', write a cold email. If 'negotiation', write a closing push. Keep it under 100 words."

        try:
            result = ask_ai(user_prompt, system_prompt=system_prompt, max_tokens=500)
            if not result.get("success"):
                return Response({"error": result.get("error", "AI generation failed")}, status=500)
            ai_message = result.get("text", "")
            return Response({"generated_text": ai_message})

        except Exception as e:
            print("CLAUDE ERROR:", repr(e))
            return Response({"error": str(e)}, status=500)
    # =====================================================================
    # NEW AI FEATURES START HERE (Paste these inside LeadViewSet)
    # =====================================================================

    @action(detail=True, methods=["post", "get"])
    def ai_score(self, request, pk=None):
        """AI analyzes the lead and outputs a probability score (0-100)"""
        lead = self.get_object()
        
        activity_count = lead.activities.count()
        task_count = lead.tasks.count()
        tag_names = list(lead.tags.values_list('name', flat=True))
        days_old = (timezone.now() - lead.created_at).days
        
        prompt = f"""
        Score this sales lead from 0 to 100 based on likelihood to close.

        DATA:
        - Name: {lead.name}
        - Company: {lead.company}
        - Email: {lead.email}
        - Phone: {"Yes" if lead.phone else "No"}
        - Source: {lead.source}
        - Stage: {lead.status}
        - Deal Value: ${lead.value}
        - Tags: {', '.join(tag_names) if tag_names else 'None'}
        - Activities logged: {activity_count}
        - Tasks created: {task_count}
        - Days in Pipeline: {days_old}

        Return ONLY a JSON object:
        {{
            "score": <number 0-100>,
            "confidence": "low/medium/high",
            "reason": "One sentence explaining the score",
            "strengths": ["List of 2 positive signals"],
            "weaknesses": ["List of 2 risk factors"]
        }}
        """
        result = ask_ai_json(prompt)
        
        if result["success"]:
            return Response({"lead_id": lead.id, "scoring": result["data"]})
        return Response({"error": result["error"]}, status=500)


    @action(detail=True, methods=["post"])
    def ai_write(self, request, pk=None):
        """Generates a perfectly customized Email/WhatsApp/LinkedIn message."""
        lead = self.get_object()
        
        msg_type = request.data.get("type", "email") # email, whatsapp, linkedin
        tone = request.data.get("tone", "professional")
        purpose = request.data.get("purpose", "introduction")
        
        # Grab the 3 most recent activities for context
        recent_acts = lead.activities.all()[:3]
        act_history = "\n".join([f"- {a.activity_type}: {a.summary or a.description[:50]}" for a in recent_acts])
        
        prompt = f"""
        Write a {tone} {msg_type} message for {lead.name} at {lead.company}.
        Deal Value: ${lead.value} | Current Stage: {lead.status}
        
        Past interactions:
        {act_history if act_history else "No past interactions."}

        PURPOSE OF MESSAGE: {purpose}
        
        RULES:
        - Format for {msg_type} (WhatsApp = short & casual, Email = subject line required)
        - Use their first name
        - Include a clear call to action (e.g., a meeting or quick reply)
        
        Return ONLY a JSON object:
        {{
            "subject": "Subject line (leave empty if WhatsApp/LinkedIn)",
            "message": "The complete message text"
        }}
        """
        result = ask_ai_json(prompt)
        
        if result["success"]:
            return Response({"lead_id": lead.id, "content": result["data"]})
        return Response({"error": result["error"]}, status=500)


    @action(detail=True, methods=["get"])
    def ai_summary(self, request, pk=None):
        """Creates a 30-second executive briefing on the lead."""
        lead = self.get_object()
        
        activities = "\n".join([f"- {a.created_at.date()}: {a.description[:80]}" for a in lead.activities.all()[:5]])
        tasks = "\n".join([f"- {t.title} (Due: {t.due_date.date()})" for t in lead.tasks.filter(is_completed=False)[:3]])
        
        prompt = f"""
        Provide a concise sales briefing for this lead.
        
        LEAD: {lead.name} ({lead.company}) - Stage: {lead.status} - Value: ${lead.value}
        
        RECENT ACTIVITY:
        {activities if activities else "None"}
        
        PENDING TASKS:
        {tasks if tasks else "None"}

        Return ONLY a JSON object:
        {{
            "one_line_summary": "1 sentence executive summary",
            "current_situation": "2 sentences explaining exactly where this deal stands",
            "risk_level": "Low/Medium/High",
            "recommended_talking_points": ["Point 1", "Point 2"]
        }}
        """
        result = ask_ai_json(prompt)
        
        if result["success"]:
            return Response({"lead_id": lead.id, "summary": result["data"]})
        return Response({"error": result["error"]}, status=500)


    @action(detail=True, methods=["get"])
    def ai_next_action(self, request, pk=None):
        """Acts as a digital sales manager telling the rep what to do today."""
        lead = self.get_object()
        
        last_act = lead.activities.first()
        days_since_contact = (timezone.now() - last_act.created_at).days if last_act else "Never contacted"
        
        prompt = f"""
        Act as a Sales Manager. Tell me the absolute best NEXT ACTION to take with this lead.
        
        LEAD: {lead.name} at {lead.company} | Stage: {lead.status}
        Days since last contact: {days_since_contact}
        Last Note: {last_act.description if last_act else 'None'}
        
        Return ONLY a JSON object:
        {{
            "priority": "DO_NOW/SCHEDULE/WAIT",
            "action": "Exactly what to do in 1 sentence",
            "channel": "Call/Email/WhatsApp",
            "reason": "Why this is the best move",
            "script_opener": "One sentence to start the conversation"
        }}
        """
        result = ask_ai_json(prompt)
        
        if result["success"]:
            return Response({"lead_id": lead.id, "next_action": result["data"]})
        return Response({"error": result["error"]}, status=500)
    
    @action(detail=True, methods=["get"])
    def generate_ai_playbook(self, request, pk=None):
        """AI generates a complete, custom multi-step sales playbook for this specific lead."""
        lead = self.get_object()
        
        prompt = f"""
        Act as an elite VP of Sales. Create a highly specific, 3-step sales playbook to close this exact deal.
        
        LEAD DATA:
        - Name: {lead.name}
        - Company: {lead.company}
        - Stage: {lead.status}
        - Deal Value: ${lead.value}
        
        Return ONLY a JSON object exactly matching this structure:
        {{
            "playbook_title": "Name of this strategy",
            "strategy_overview": "One sentence explaining the psychology of why this will work.",
            "steps": [
                {{
                    "day": 1,
                    "action_type": "Email / LinkedIn / Call",
                    "goal": "What we are trying to achieve",
                    "exact_script": "The actual word-for-word script/email the rep should use"
                }},
                {{
                    "day": 3,
                    "action_type": "Follow up",
                    "goal": "...",
                    "exact_script": "..."
                }},
                {{
                    "day": 7,
                    "action_type": "Close",
                    "goal": "...",
                    "exact_script": "..."
                }}
            ]
        }}
        """
        result = ask_ai_json(prompt)
        
        if result["success"]:
            return Response({"lead_id": lead.id, "playbook": result["data"]})
        return Response({"error": result["error"]}, status=500)


    @action(detail=False, methods=["post"])
    def ai_bulk_message(self, request):
        """Takes 1 generic message and rewrites it perfectly for N different leads."""
        lead_ids = request.data.get("lead_ids", [])
        base_message = request.data.get("base_message", "")
        channel = request.data.get("channel", "whatsapp")
        
        if not lead_ids or not base_message:
            return Response({"error": "Provide lead_ids array and base_message"}, status=400)
            
        leads = Lead.objects.filter(id__in=lead_ids[:20]) # Limit to 20 for API safety
        results = []
        
        for lead in leads:
            prompt = f"""
            Rewrite this generic message specifically for this person.
            
            GENERIC MESSAGE: "{base_message}"
            
            PERSON: {lead.name}
            COMPANY: {lead.company}
            STAGE: {lead.status}
            CHANNEL: {channel}
            
            RULES: Keep the core offer/intent. Add their name. Reference their company naturally. 
            Make it sound human. If channel is WhatsApp, keep it under 40 words.
            """
            
            ai_res = ask_ai(prompt)
            
            if ai_res["success"]:
                results.append({
                    "lead_id": lead.id,
                    "name": lead.name,
                    "phone": lead.phone,
                    "personalized_message": ai_res["text"].strip('"')
                })
            else:
                # FIX: Actually return the error so the frontend can display it!
                results.append({
                    "lead_id": lead.id,
                    "name": lead.name,
                    "phone": lead.phone,
                    "personalized_message": f"❌ AI Error: {ai_res.get('error', 'Check your API Key')}"
                })
                
        return Response({
            "base_message": base_message,
            "success_count": len(results),
            "messages": results
        })

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by("-created_at")
    serializer_class = ActivitySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['description', 'summary']

from .serializers import VerticalSerializer, RegionSerializer

class VerticalViewSet(viewsets.ModelViewSet):
    queryset = Vertical.objects.all()
    serializer_class = VerticalSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("due_date")
    serializer_class = TaskSerializer
    
    # Allow filtering tasks by completion status: /api/tasks/?is_completed=true
    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('is_completed')
        if status is not None:
            is_true = status.lower() == 'true'
            queryset = queryset.filter(is_completed=is_true)
        return queryset

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'industry']


class WishlistEntryViewSet(viewsets.ModelViewSet):
    queryset = WishlistEntry.objects.select_related("created_by").all()
    serializer_class = WishlistEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]
    filter_backends = [filters.SearchFilter]
    search_fields = ["company_name", "location", "created_by__username", "created_by__email"]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if not _is_admin(user):
            queryset = queryset.filter(created_by=user)

        created_by = (self.request.query_params.get("created_by") or "").strip()
        if created_by and _is_admin(user):
            queryset = queryset.filter(created_by_id=created_by)

        company_name = (self.request.query_params.get("company_name") or "").strip()
        if company_name:
            queryset = queryset.filter(company_name__icontains=company_name)

        region = (self.request.query_params.get("region") or "").strip()
        if region:
            queryset = queryset.filter(location__icontains=region)

        date_from = (self.request.query_params.get("date_from") or "").strip()
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)

        date_to = (self.request.query_params.get("date_to") or "").strip()
        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user if getattr(self.request.user, "is_authenticated", False) else None
        serializer.save(created_by=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company_name = serializer.validated_data["company_name"]
        location = serializer.validated_data["location"]
        force_create = str(request.data.get("force_create", "")).strip().lower() in {"1", "true", "yes", "y"}

        duplicates = WishlistEntry.objects.select_related("created_by").filter(
            company_name__iexact=company_name,
            location__iexact=location,
        ).order_by("-created_at", "-id")

        if duplicates.exists() and not force_create:
            preview = duplicates[:3]
            return Response(
                {
                    "detail": "This company name and location already exist in the wishlist.",
                    "duplicate_count": duplicates.count(),
                    "duplicates": WishlistEntrySerializer(preview, many=True).data,
                    "requires_confirmation": True,
                },
                status=status.HTTP_409_CONFLICT,
            )

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AccountTargetCompanyViewSet(viewsets.ModelViewSet):
    queryset = AccountTargetCompany.objects.all().prefetch_related("pics__created_by", "created_by")
    serializer_class = AccountTargetCompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "location", "region", "pics__pic_name", "pics__phone_number", "pics__created_by__username"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not getattr(request.user, "is_authenticated", False):
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = AccountTargetRegistrationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        company = result["company"]
        return Response(AccountTargetCompanySerializer(company).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="ownership-summary")
    def ownership_summary(self, request):
        queryset = self.get_queryset()
        owners = {}

        for company in queryset:
            owner = getattr(company, "created_by", None)
            owner_key = owner.id if owner else "unknown"
            if owner_key not in owners:
                owners[owner_key] = {
                    "user": {
                        "id": owner.id if owner else None,
                        "name": owner.get_full_name() or owner.username if owner else "Unknown owner",
                        "username": owner.username if owner else "",
                        "email": owner.email if owner else "",
                    },
                    "company_count": 0,
                    "total_pics": 0,
                    "companies": [],
                }

            owners[owner_key]["company_count"] += 1
            owners[owner_key]["total_pics"] += company.pics.count()
            owners[owner_key]["companies"].append({
                "id": company.id,
                "name": company.name,
                "location": company.location,
                "region": company.region,
                "total_pics": company.pics.count(),
                "created_at": company.created_at,
                "pics": [
                    {
                        "id": pic.id,
                        "pic_name": pic.pic_name,
                        "phone_number": pic.phone_number,
                        "created_at": pic.created_at,
                        "created_by_info": {
                            "id": pic.created_by.id,
                            "name": pic.created_by.get_full_name() or pic.created_by.username,
                            "username": pic.created_by.username,
                            "email": pic.created_by.email,
                        } if getattr(pic, "created_by", None) else None,
                    }
                    for pic in company.pics.all()
                ],
            })

        summary = sorted(
            owners.values(),
            key=lambda item: (-item["company_count"], item["user"]["name"].lower()),
        )
        return Response(summary, status=status.HTTP_200_OK)

import json
import re
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Module, Lesson
from .serializers import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("-created_at")
    serializer_class = CourseSerializer

    @action(detail=False, methods=["post"])
    def generate_ai(self, request):
        prompt_text = request.data.get("prompt", "")
        
        system_prompt = "You are an elite Sales Trainer. You MUST output ONLY raw, valid JSON. Do not include markdown formatting like ```json. Do not include any greeting or explanation."
        
        user_prompt = f"""
        The user wants a new Sales Playbook based on this request: "{prompt_text}".
        
        Generate a complete training course curriculum. 
        Create 2 modules. Inside each module, create 2 text-based lessons (sales scripts or instruction texts).
        
        Return ONLY a JSON object with this exact structure:
        {{
            "title": "Professional Name of the Playbook",
            "description": "Short summary of what this teaches",
            "target_vertical": "E.g. SaaS, Real Estate, Automotive",
            "modules": [
                {{
                    "title": "Name of Module",
                    "lessons": [
                        {{
                            "title": "Name of Lesson",
                            "content": "The actual full text, word-for-word script, or detailed instructions."
                        }}
                    ]
                }}
            ]
        }}
        """
        
        try:
            result = ask_ai(user_prompt, system_prompt=system_prompt, max_tokens=2500)
            if not result.get("success"):
                return Response({"error": result.get("error", "AI playbook generation failed")}, status=500)
            ai_text = result.get("text", "")
            
            # Clean up JSON formatting so Python doesn't crash
            ai_text = re.sub(r'^```json\s*', '', ai_text)
            ai_text = re.sub(r'```$', '', ai_text)
            ai_text = ai_text.strip()
            
            data = json.loads(ai_text)
            
            # Save to Database
            course = Course.objects.create(
                title=data.get("title", "AI Generated Playbook"),
                description=data.get("description", ""),
                target_vertical=data.get("target_vertical", "General"),
                target_region="Global"
            )
            
            modules = data.get("modules", [])
            for m_idx, mod_data in enumerate(modules):
                module = Module.objects.create(
                    course=course,
                    title=mod_data.get("title", f"Module {m_idx+1}"),
                    order=m_idx
                )
                
                lessons = mod_data.get("lessons", [])
                for l_idx, les_data in enumerate(lessons):
                    Lesson.objects.create(
                        module=module,
                        title=les_data.get("title", f"Lesson {l_idx+1}"),
                        content=les_data.get("content", ""),
                        lesson_type='script',
                        order=l_idx
                    )
                    
            return Response({"success": True, "course_id": course.id})

        except json.JSONDecodeError as e:
            print("--- JSON PARSE ERROR ---", str(e))
            print("AI Output:", ai_text)
            return Response({"error": "AI failed to format JSON correctly."}, status=500)
            
        except Exception as e:
            print("--- SYSTEM ERROR ---", str(e))
            return Response({"error": str(e)}, status=500)

# --- 1. AGENT API (For your Scrapers) ---
class AgentIngestionViewSet(viewsets.ViewSet):
    """
    Endpoint: POST /api/agent/dump_leads/
    Your AI Scraper sends JSON here. The Signal in signals.py will 
    automatically trigger the Course Enrollment.
    """
    @action(detail=False, methods=['post'])
    def dump_leads(self, request):
        serializer = AgentIngestionSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save() # Triggers auto_enroll_workflow signal!
            return Response({"status": "Leads Saved & Automation Started"}, status=201)
        return Response(serializer.errors, status=400)

# --- 2. SMART DASHBOARD (Consumption Logic) ---
class SmartDashboardViewSet(viewsets.ViewSet):
    """
    Endpoint: GET /api/dashboard/smart_prompts/
    Shows companies that need a refill based on frequency.
    """
    def list(self, request):
        today = date.today()
        patterns = ConsumptionPattern.objects.select_related('company', 'product').all()
        
        alerts = []
        for p in patterns:
            if p.is_due():
                alerts.append({
                    "company": p.company.name,
                    "product": p.product.name,
                    "days_overdue": (today - p.next_action_date()).days,
                    "last_purchase": p.last_purchase_date
                })
                
        return Response({
            "date": today,
            "alerts": alerts
        })

# crm/views.py - Update WhatsAppCampaignViewSet

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import WhatsAppCampaign, WhatsAppMessage, Lead, AIInteractionLog
from .serializers import (
    WhatsAppCampaignSerializer, 
    WhatsAppCampaignCreateSerializer,
    QuickSendSerializer
)
from .services import send_whatsapp_message

class WhatsAppCampaignViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppCampaign.objects.all().order_by("-created_at")
    serializer_class = WhatsAppCampaignSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action in ['create', 'create_and_prepare']:
            return WhatsAppCampaignCreateSerializer
        return WhatsAppCampaignSerializer

    def create(self, request, *args, **kwargs):
        """
        Standard POST /api/whatsapp-campaigns/
        """
        serializer = WhatsAppCampaignCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        campaign = serializer.save()
        
        return Response(
            WhatsAppCampaignSerializer(campaign).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def create_and_prepare(self, request):
        """
        POST /api/whatsapp-campaigns/create_and_prepare/
        Body: {
            "name": "Campaign Name",
            "message_template": "Hi {name}...",
            "lead_ids": [1, 2, 3]
        }
        """
        serializer = WhatsAppCampaignCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        campaign = serializer.save()
        
        return Response(
            WhatsAppCampaignSerializer(campaign).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def quick_send(self, request):
        """
        POST /api/whatsapp-campaigns/quick_send/
        Body: {"phone": "+1234567890", "message": "Hello"}
        """
        serializer = QuickSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone = serializer.validated_data['phone']
        message = serializer.validated_data['message']
        
        result = send_whatsapp_message(phone, message)
        
        if result['success']:
            return Response({
                "success": True,
                "message": "Message sent successfully",
                "message_id": result.get('message_id')
            })
        else:
            return Response({
                "success": False,
                "error": result['error']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """
        POST /api/whatsapp-campaigns/{id}/send/
        Sends all pending messages in the campaign
        """
        campaign = self.get_object()
        
        if campaign.status not in ['draft', 'pending']:
            return Response({
                "error": "Campaign already sent or in progress"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        campaign.status = 'sending'
        campaign.save()
        
        messages = WhatsAppMessage.objects.filter(
            campaign=campaign,
            status='pending'
        )
        
        success_count = 0
        failed_count = 0
        
        for msg in messages:
            if not msg.lead.phone:
                msg.status = 'failed'
                msg.error_message = 'No phone number'
                msg.save()
                failed_count += 1
                continue
            
            result = send_whatsapp_message(
                msg.lead.phone,
                msg.message_text
            )
            
            if result['success']:
                msg.status = 'sent'
                msg.message_id = result.get('message_id')
                msg.sent_at = timezone.now()
                success_count += 1
                
                # Log to AI Interaction
                AIInteractionLog.objects.create(
                    lead=msg.lead,
                    campaign=None,
                    interaction_type='whatsapp_campaign',
                    transcript=f"Campaign: {campaign.name}\nMessage: {msg.message_text}",
                    sentiment='neutral'
                )
            else:
                msg.status = 'failed'
                msg.error_message = result['error']
                failed_count += 1
                
                # Log failed attempt
                AIInteractionLog.objects.create(
                    lead=msg.lead,
                    campaign=None,
                    interaction_type='whatsapp_campaign',
                    transcript=f"FAILED - Campaign: {campaign.name}",
                    ai_summary=f"Error: {result['error']}",
                    sentiment='negative'
                )
            
            msg.save()
        
        # Update campaign stats
        campaign.sent_count = success_count
        campaign.failed_count = failed_count
        campaign.delivered_count = success_count  # Will be updated by webhooks
        campaign.status = 'completed'
        campaign.save()
        
        return Response({
            "message": "Campaign sending completed",
            "total": messages.count(),
            "sent": success_count,
            "failed": failed_count
        })

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        GET /api/whatsapp-campaigns/{id}/stats/
        """
        campaign = self.get_object()
        messages = campaign.messages.all()
        
        return Response({
            "total": messages.count(),
            "pending": messages.filter(status='pending').count(),
            "sent": messages.filter(status='sent').count(),
            "delivered": messages.filter(status='delivered').count(),
            "failed": messages.filter(status='failed').count(),
        })

class AIInteractionLogViewSet(viewsets.ModelViewSet):
    # Get the 50 most recent logs so the terminal doesn't crash
    queryset = AIInteractionLog.objects.all().order_by('-created_at')[:50]
    serializer_class = AIInteractionLogSerializer

class AILeadViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='score/(?P<lead_id>[^/.]+)')
    def score_lead(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(LeadScoringEngine().score_lead(lead))

    @action(detail=False, methods=['post'])
    def score_bulk(self, request):
        ids = request.data.get('lead_ids', [])
        engine = LeadScoringEngine()
        qs = Lead.objects.filter(id__in=ids) if ids else Lead.objects.exclude(status__in=['won', 'lost'])
        results = []
        for lead in qs:
            try: results.append(engine.score_lead(lead))
            except Exception as e: results.append({'lead_id': lead.id, 'error': str(e)})
        return Response({'scored': len(results), 'results': results})

    @action(detail=False, methods=['get'], url_path='churn/(?P<lead_id>[^/.]+)')
    def churn_risk(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(ChurnPredictionEngine().predict(lead))

    @action(detail=False, methods=['get'])
    def churn_report(self, request):
        engine = ChurnPredictionEngine()
        results = []
        for lead in Lead.objects.filter(status__in=['mql', 'sql', 'negotiation']):
            try: results.append(engine.predict(lead))
            except Exception as e: results.append({'lead_id': lead.id, 'error': str(e)})
        results.sort(key=lambda x: x.get('churn_probability', 0), reverse=True)
        return Response({'analyzed': len(results), 'high_risk': len([r for r in results if r.get('risk_level') in ['high', 'critical']]), 'results': results})

    @action(detail=False, methods=['get'], url_path='intelligence/(?P<lead_id>[^/.]+)')
    def conversation_intelligence(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        result = ConversationIntelligence().get_lead_intelligence(lead)
        if result['success'] and result['data']:
            return Response({'lead_id': lead.id, 'intelligence': result['data']})
        return Response({'error': result.get('error', 'Failed')}, status=500)

    @action(detail=False, methods=['get'], url_path='sentiment/(?P<lead_id>[^/.]+)')
    def sentiment_timeline(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(ConversationIntelligence().get_sentiment_timeline(lead))

    @action(detail=False, methods=['get'], url_path='profile/(?P<lead_id>[^/.]+)')
    def get_profile(self, request, lead_id=None):
        try:
            profile = AILeadProfile.objects.select_related('lead').get(lead_id=lead_id)
            return Response(AILeadProfileSerializer(profile).data)
        except AILeadProfile.DoesNotExist:
            return Response({'message': 'Score this lead first'}, status=404)

    @action(detail=False, methods=['get'], url_path='score_history/(?P<lead_id>[^/.]+)')
    def score_history(self, request, lead_id=None):
        return Response(AIScoreSnapshotSerializer(AIScoreSnapshot.objects.filter(lead_id=lead_id)[:30], many=True).data)

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        return Response(AILeadProfileSerializer(AILeadProfile.objects.select_related('lead').order_by('-score')[:20], many=True).data)

    @action(detail=False, methods=['post'])
    def search(self, request):
        query = request.data.get('query', '')
        if not query: return Response({"error": "Query required"}, status=400)
        prompt = f"""Convert to Django ORM. QUERY: "{query}"
FIELDS: name, email, company, status (new/mql/sql/negotiation/won/lost), source, value, created_at, vertical__name, region_rel__name, tags__name
Return ONLY JSON: {{"filters": {{}}, "order_by": ["-created_at"], "interpretation": "English", "limit": 20}}"""
        result = _call_claude(prompt, max_tokens=500, system_prompt="Django ORM expert. ONLY JSON.")
        if result['success'] and result['data']:
            try:
                f = result['data'].get('filters', {})
                qs = Lead.objects.filter(**f).order_by(*result['data'].get('order_by', ['-created_at']))[:result['data'].get('limit', 20)]
                return Response({'interpretation': result['data'].get('interpretation', ''), 'filters': f, 'count': qs.count(), 'results': LeadSerializer(qs, many=True).data})
            except Exception as e:
                return Response({'error': str(e)}, status=400)
        return Response({'error': 'Parse failed'}, status=500)


class AIActivityViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='analyze/(?P<activity_id>[^/.]+)')
    def analyze(self, request, activity_id=None):
        try: activity = Activity.objects.get(id=activity_id)
        except Activity.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(ConversationIntelligence().analyze_activity(activity))

    @action(detail=False, methods=['get'], url_path='for_lead/(?P<lead_id>[^/.]+)')
    def for_lead(self, request, lead_id=None):
        return Response(AIActivityAnalysisSerializer(AIActivityAnalysis.objects.filter(lead_id=lead_id), many=True).data)


class AIDocumentViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='proposal/(?P<lead_id>[^/.]+)')
    def proposal(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(AIDocumentGenerator().generate_proposal(lead, request.data.get('instructions', '')))

    @action(detail=False, methods=['post'], url_path='battle_card/(?P<lead_id>[^/.]+)')
    def battle_card(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(AIDocumentGenerator().generate_battle_card(lead, request.data.get('competitors', [])))

    @action(detail=False, methods=['post'], url_path='email_sequence/(?P<lead_id>[^/.]+)')
    def email_sequence(self, request, lead_id=None):
        try: lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist: return Response({'error': 'Not found'}, status=404)
        return Response(AIDocumentGenerator().generate_email_sequence(lead, request.data.get('num_emails', 5), request.data.get('goal', 'nurture')))

    @action(detail=False, methods=['get'], url_path='for_lead/(?P<lead_id>[^/.]+)')
    def for_lead(self, request, lead_id=None):
        return Response(AIDocumentSerializer(AIDocument.objects.filter(lead_id=lead_id), many=True).data)

    @action(detail=False, methods=['get'])
    def all_docs(self, request):
        qs = AIDocument.objects.all()
        t = request.query_params.get('type')
        if t: qs = qs.filter(doc_type=t)
        return Response(AIDocumentSerializer(qs[:50], many=True).data)


class AIChatbotViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def chat(self, request):
        ser = AIChatInputSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        return Response(CRMChatbot().chat(ser.validated_data['message'], ser.validated_data.get('session_id', 'default')))

    @action(detail=False, methods=['get'])
    def history(self, request):
        sid = request.query_params.get('session_id', 'default')
        try:
            s = AIChatSession.objects.get(session_id=sid)
            return Response({'session_id': sid, 'messages': s.messages})
        except AIChatSession.DoesNotExist:
            return Response({'messages': []})

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        AIChatSession.objects.filter(session_id=request.query_params.get('session_id', 'default')).delete()
        return Response({'status': 'cleared'})


class AIAlertViewSet(viewsets.ModelViewSet):
    queryset = AIAlert.objects.all()
    serializer_class = AIAlertSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        qs = super().get_queryset()
        r = self.request.query_params.get('is_read')
        if r is not None: qs = qs.filter(is_read=r.lower() == 'true')
        t = self.request.query_params.get('type')
        if t: qs = qs.filter(alert_type=t)
        p = self.request.query_params.get('priority')
        if p: qs = qs.filter(priority=p)
        return qs

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        a = self.get_object(); a.is_read = True; a.save()
        return Response({'status': 'read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        AIAlert.objects.filter(is_read=False).update(is_read=True)
        return Response({'status': 'done'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = AIAlert.objects.filter(is_read=False).count()
        by_type = {}
        for i in AIAlert.objects.filter(is_read=False).values('alert_type').annotate(c=Count('id')):
            by_type[i['alert_type']] = i['c']
        return Response({'unread': count, 'by_type': by_type})


class AIAnalyticsViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def revenue_forecast(self, request):
        result = RevenueForecastEngine().forecast(int(request.query_params.get('months', 3)))
        if result['success'] and result['data']: return Response(result['data'])
        return Response({'error': result.get('error', 'Failed')}, status=500)

    @action(detail=False, methods=['get'])
    def anomalies(self, request):
        data = AnomalyDetectionEngine().detect_all()
        return Response({'total': len(data), 'critical': len([a for a in data if a['priority'] == 'critical']), 'anomalies': data})

    @action(detail=False, methods=['get'])
    def daily_digest(self, request):
        result = DailyDigestGenerator().generate()
        if result['success'] and result['data']: return Response(result['data'])
        return Response({'raw': result.get('raw', 'Error')})

    @action(detail=False, methods=['get'])
    def pipeline_intelligence(self, request):
        leads = Lead.objects.all()
        active = leads.exclude(status__in=['won', 'lost'])
        closed = leads.filter(Q(status='won') | Q(status='lost')).count()
        won = leads.filter(status='won').count()
        pipeline = {}
        for code, name in Lead.STATUS_CHOICES:
            s = leads.filter(status=code)
            pipeline[code] = {'name': name, 'count': s.count(), 'value': float(s.aggregate(t=Sum('value'))['t'] or 0)}
        return Response({
            'pipeline': pipeline,
            'summary': {'total_active': active.count(), 'pipeline_value': float(active.aggregate(t=Sum('value'))['t'] or 0), 'win_rate': round((won / closed * 100), 1) if closed > 0 else 0, 'at_risk': AILeadProfile.objects.filter(churn_risk__gte=0.5).count()},
            'top_opportunities': list(AILeadProfile.objects.filter(score__gte=60).select_related('lead').order_by('-score')[:5].values('lead__id', 'lead__name', 'lead__company', 'lead__value', 'score', 'lead__status')),
            'needs_attention': list(AILeadProfile.objects.filter(churn_risk__gte=0.5).select_related('lead').order_by('-churn_risk')[:5].values('lead__id', 'lead__name', 'lead__company', 'lead__value', 'churn_risk', 'lead__status')),
        })
from .ai_prospector import AIProspectorEngine # <--- Make sure this matches file name


# ══════════════════════════════════════════════════════
# NEW AI PROSPECTOR VIEWSET
# ══════════════════════════════════════════════════════

from .ai_prospector import AIProspectorEngine
from .models import Lead, Company

class AIProspectorViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def search(self, request):
        prompt = request.data.get('prompt', '')
        sources = request.data.get('sources', ['linkedin', 'naukri'])
        
        if not prompt: return Response({'error': 'Prompt required'}, status=400)
        
        engine = AIProspectorEngine()
        data = engine.search(prompt, sources)
        return Response(data)

    @action(detail=False, methods=['post'])
    def import_lead(self, request):
        data = request.data
        company_name = data.get('company') or 'Unknown'
        name = data.get('name') or 'Unknown'
        
        comp, _ = Company.objects.get_or_create(name=company_name)
        
        lead = Lead.objects.create(
            name=name,
            company=company_name,
            related_company=comp,
            source=data.get('source', 'AI Search').lower(),
            status='new',
            email='', # We can't get email from public search
            phone=''
        )
        return Response({'success': True, 'message': f'Imported {name}'})
# =========================
# NEW VIEWSETS
# Add at the bottom of views.py
# =========================

class ProductLineViewSet(viewsets.ModelViewSet):
    queryset = ProductLine.objects.all().order_by('name')
    serializer_class = ProductLineSerializer


class CustomerCategoryViewSet(viewsets.ModelViewSet):
    queryset = CustomerCategory.objects.all().order_by('name')
    serializer_class = CustomerCategorySerializer


class SalesChannelViewSet(viewsets.ModelViewSet):
    queryset = SalesChannel.objects.all().order_by('name')
    serializer_class = SalesChannelSerializer


class EngagementToolViewSet(viewsets.ModelViewSet):
    queryset = EngagementTool.objects.all().order_by('name')
    serializer_class = EngagementToolSerializer


class LeadBusinessMetaViewSet(viewsets.ModelViewSet):
    queryset = LeadBusinessMeta.objects.all().select_related('lead')
    serializer_class = LeadBusinessMetaSerializer


class BDMTargetViewSet(viewsets.ModelViewSet):
    queryset = BDMTarget.objects.all().order_by('-created_at')
    serializer_class = BDMTargetSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'status']

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        targets = BDMTarget.objects.all()
        active = targets.filter(status='active')
        completed = targets.filter(status='completed')

        total_target_leads = sum(t.target_leads for t in targets)
        total_achieved_leads = sum(t.achieved_leads for t in targets)
        total_target_revenue = sum(float(t.target_revenue) for t in targets)
        total_achieved_revenue = sum(float(t.achieved_revenue) for t in targets)

        return Response({
            'total_targets': targets.count(),
            'active_targets': active.count(),
            'completed_targets': completed.count(),
            'target_leads': total_target_leads,
            'achieved_leads': total_achieved_leads,
            'target_revenue': total_target_revenue,
            'achieved_revenue': total_achieved_revenue,
            'avg_progress': round(sum(t.progress_percentage() for t in targets) / targets.count(), 2) if targets.count() > 0 else 0,
            'targets': BDMTargetSerializer(targets[:10], many=True).data
        })

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        target = self.get_object()
        serializer = BDMReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(target=target)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['get'])
    def review_summary(self, request):
        reviews = BDMReview.objects.all().order_by('-created_at')[:20]
        return Response(BDMReviewSerializer(reviews, many=True).data)


class SmartSalesCallViewSet(viewsets.ViewSet):
    """
    Smart call dashboard based on:
    - overdue follow ups
    - activity recency
    - consumption patterns
    - value
    - AI prompts
    """

    @action(detail=False, methods=['get'])
    def today_calls(self, request):
        leads = Lead.objects.all().prefetch_related('activities', 'tasks')

        result = []
        for lead in leads:
            last_activity = lead.activities.first()
            days_since = (timezone.now() - last_activity.created_at).days if last_activity else 999
            overdue_tasks = lead.tasks.filter(is_completed=False, due_date__lt=timezone.now()).count()

            company = lead.related_company
            due_patterns = []
            if company:
                due_patterns = list(company.patterns.all())

            reorder_due = any(p.is_due() for p in due_patterns) if due_patterns else False

            # Priority logic
            score = 0
            if overdue_tasks > 0:
                score += 30
            if days_since > 7:
                score += 20
            if reorder_due:
                score += 25
            if float(lead.value) > 50000:
                score += 15
            elif float(lead.value) > 10000:
                score += 10

            if score > 0:
                ai_prompt = self._generate_call_prompt(lead, reorder_due, days_since)
                result.append({
                    'lead_id': lead.id,
                    'name': lead.name,
                    'company': lead.company,
                    'phone': lead.phone,
                    'value': float(lead.value),
                    'status': lead.status,
                    'days_since_last_contact': days_since,
                    'overdue_tasks': overdue_tasks,
                    'reorder_due': reorder_due,
                    'priority_score': score,
                    'call_prompt': ai_prompt,
                    'last_activity': last_activity.description if last_activity else '',
                })

        result = sorted(result, key=lambda x: x['priority_score'], reverse=True)
        return Response(result)

    @action(detail=False, methods=['get'])
    def consumption_patterns(self, request):
        patterns = ConsumptionPattern.objects.select_related('company', 'product').all()
        data = []
        for p in patterns:
            data.append({
                'company': p.company.name,
                'product': p.product.name,
                'last_purchase_date': p.last_purchase_date,
                'frequency_days': p.frequency_days,
                'next_action_date': p.next_action_date(),
                'is_due': p.is_due(),
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        patterns = ConsumptionPattern.objects.all()
        total_due = sum(1 for p in patterns if p.is_due())
        total_patterns = patterns.count()

        leads = Lead.objects.all()
        active_calls = leads.filter(tasks__is_completed=False).distinct().count()

        return Response({
            'total_consumption_patterns': total_patterns,
            'due_for_followup': total_due,
            'active_call_leads': active_calls,
            'high_value_leads': leads.filter(value__gte=50000).count(),
            'stale_leads': sum(
                1 for lead in leads
                if not lead.activities.first() or (timezone.now() - lead.activities.first().created_at).days > 7
            )
        })

    @action(detail=False, methods=['get'])
    def gap_analysis(self, request):
        """
        Finds Current Customers who bought Product A but NOT Product B.
        Example: Bought 'Printer' but no 'Ribbon'.
        """
    # 1. Get all companies that bought Printers
        printer_buyers = Company.objects.filter(patterns__product__name__icontains="Printer")
    
    # 2. Filter those who do NOT have a Ribbon pattern
        opportunities = []
        for comp in printer_buyers:
            has_ribbon = comp.patterns.filter(product__name__icontains="Ribbon").exists()
            if not has_ribbon:
                opportunities.append({
                    "company": comp.name,
                    "gap": "Has Printer, Needs Ribbon",
                    "action": "Pitch Consumables"
                })
            
        return Response(opportunities)

    def _generate_call_prompt(self, lead, reorder_due=False, days_since=0):
        prompt = f"""
        Prepare a short call prompt for this customer:
        Name: {lead.name}
        Company: {lead.company}
        Status: {lead.status}
        Deal Value: ${lead.value}
        Days Since Last Contact: {days_since}
        Reorder Due: {reorder_due}

        Return ONLY JSON:
        {{
            "opening_line": "short opener",
            "objective": "main objective",
            "talking_points": ["point1", "point2"],
            "closing_line": "soft close"
        }}
        """
        result = ask_ai_json(prompt)
        if result.get("success"):
            return result["data"]

        return {
            "opening_line": f"Hi {lead.name}, just checking in from {lead.company} side.",
            "objective": "Follow up on current opportunity",
            "talking_points": ["Understand current requirement", "Check interest level"],
            "closing_line": "Would you be open for a short demo or next step?"
        }


class CampaignWorkspaceViewSet(viewsets.ModelViewSet):
    queryset = CampaignWorkspace.objects.all().order_by('-created_at')
    serializer_class = CampaignWorkspaceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'brand_name', 'content_theme', 'status']

    @action(detail=False, methods=['post'])
    def generate_content(self, request):
        serializer = CampaignWorkspaceGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        prompt = f"""
        Create a campaign draft.

        Campaign Name: {data['name']}
        Brand: {data.get('brand_name', '')}
        Theme: {data.get('content_theme', '')}
        Target Description: {data.get('target_description', '')}
        Channel: {data.get('selected_channel', 'whatsapp')}
        User Prompt: {data.get('prompt', '')}

        Return ONLY JSON:
        {{
            "subject": "subject line",
            "content": "campaign message body",
            "cta": "call to action",
            "audience_hint": "best target audience"
        }}
        """

        ai_result = ask_ai_json(prompt)

        workspace = CampaignWorkspace.objects.create(
            name=data['name'],
            brand_name=data.get('brand_name', ''),
            content_theme=data.get('content_theme', ''),
            target_description=data.get('target_description', ''),
            selected_channel=data.get('selected_channel', 'whatsapp'),
            selected_vertical_id=data.get('selected_vertical'),
            selected_region_id=data.get('selected_region'),
            selected_product_line_id=data.get('selected_product_line'),
            prompt_used=data.get('prompt', ''),
            generated_subject=ai_result.get('data', {}).get('subject', ''),
            generated_content=ai_result.get('data', {}).get('content', ''),
            status='ready' if ai_result.get('success') else 'draft',
        )

        return Response(CampaignWorkspaceSerializer(workspace).data, status=201)

    @action(detail=True, methods=['post'])
    def add_response(self, request, pk=None):
        workspace = self.get_object()
        serializer = CampaignResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(workspace=workspace)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        responses = CampaignResponse.objects.all()

        summary = {}
        for choice, _ in CampaignResponse.RESPONSE_CHOICES:
            summary[choice] = responses.filter(response_type=choice).count()

        return Response({
            'total_workspaces': CampaignWorkspace.objects.count(),
            'ready_campaigns': CampaignWorkspace.objects.filter(status='ready').count(),
            'sent_campaigns': CampaignWorkspace.objects.filter(status='sent').count(),
            'responses': summary
        })


class ActivityPlannerViewSet(viewsets.ModelViewSet):
    queryset = ActivityPlanner.objects.all().order_by('-year', '-month', '-created_at')
    serializer_class = ActivityPlannerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'member_plans__member_name', 'member_plans__workspace_name']

    def get_serializer_class(self):
        # The list is only used to populate the planner selector. Returning
        # nested member plans/contacts here made every page load serialize the
        # entire planner history before the overview request could start.
        if self.action == 'list' and self.request.query_params.get('summary') == 'true':
            return ActivityPlannerOptionSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        if _is_admin(self.request.user):
            return queryset
        return queryset.filter(member_plans__user=self.request.user).distinct()

    def perform_create(self, serializer):
        if not _is_admin(self.request.user):
            raise PermissionDenied("Only admin can create activity planners.")
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if not _is_admin(self.request.user):
            raise PermissionDenied("Only admin can update activity planners.")
        serializer.save()

    def perform_destroy(self, instance):
        if not _is_admin(self.request.user):
            raise PermissionDenied("Only admin can delete activity planners.")

        # Deleting a planner must also release its contacts.  Otherwise they
        # retain a telemarketing owner and cannot be allocated by the next plan.
        assignment_contact_ids = list(
            PlannerCallAssignment.objects.filter(member_plan__planner=instance)
            .values_list('contact_id', flat=True)
            .distinct()
        )
        planner_assignments = PlannerCallAssignment.objects.filter(member_plan__planner=instance).select_related('contact')
        for assignment in planner_assignments:
            delete_assignment_from_peer(
                assignment.id,
                assignment.contact,
                planner_name=instance.name,
                purge_legacy=True,
            )
        # Also purge when the planner has no current local assignments but
        # Marketing CRM still contains legacy mirrored rows.
        if not planner_assignments.exists():
            delete_assignment_from_peer(0, planner_name=instance.name, purge_legacy=True)
        if assignment_contact_ids:
            Contact.objects.filter(id__in=assignment_contact_ids).update(
                telemarketing_owner=None,
                telemarketing_assigned_at=None,
                is_verified=False,
            )
        instance.delete()

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        planners = self.get_queryset()
        member_plans = PlannerMemberPlan.objects.filter(planner__in=planners)
        tasks = PlannerTask.objects.filter(member_plan__in=member_plans)
        return Response({
            "total_planners": planners.count(),
            "active_planners": planners.filter(status='active').count(),
            "members": member_plans.count(),
            "pending_tasks": tasks.filter(status='pending').count(),
            "done_tasks": tasks.filter(status='done').count(),
            "planners": ActivityPlannerSerializer(planners[:8], many=True).data
        })

    @action(detail=True, methods=['post'])
    def assign_members(self, request, pk=None):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can assign planner members."}, status=status.HTTP_403_FORBIDDEN)
        planner = self.get_object()
        member_data = request.data.get('members', [])
        requested_user_ids = [item.get('user') for item in member_data if item.get('user')]
        eligible_users = {
            user.id: user
            for user in User.objects.filter(id__in=requested_user_ids, is_active=True).select_related('profile')
        }
        invalid_user_names = []
        for item in member_data:
            user_id = item.get('user')
            if not user_id:
                continue
            user = eligible_users.get(user_id)
            if not user or not _is_telemarketing_user(user):
                invalid_user_names.append(item.get('member_name') or f"User {user_id}")
        if invalid_user_names:
            return Response(
                {
                    "detail": "Only active telemarketing users can receive planner contacts.",
                    "invalid_users": invalid_user_names,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        planner.member_plans.all().delete()
        for item in member_data:
            member_plan = PlannerMemberPlan.objects.create(
                planner=planner,
                user_id=item.get('user'),
                member_name=item.get('member_name', 'Member'),
                workspace_name=item.get('workspace_name', f"{item.get('member_name', 'Member')} Workspace"),
                monthly_calls_target=item.get('monthly_calls_target', 0),
                monthly_whatsapp_target=item.get('monthly_whatsapp_target', 0),
                monthly_email_target=item.get('monthly_email_target', 0),
                monthly_linkedin_target=item.get('monthly_linkedin_target', 0),
                calls_weightage=item.get('calls_weightage', 25),
                whatsapp_weightage=item.get('whatsapp_weightage', 25),
                email_weightage=item.get('email_weightage', 25),
                linkedin_weightage=item.get('linkedin_weightage', 25),
                assigned_by=request.user if request.user and request.user.is_authenticated else None,
            )
            self._generate_member_tasks(member_plan)
        assignment_summary = self._rebuild_contact_assignments(planner)
        return Response(
            {
                "planner_id": planner.id,
                "planner_name": planner.name,
                "members_count": planner.member_plans.count(),
                **assignment_summary,
            },
            status=201,
        )

    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can regenerate planner tasks."}, status=status.HTTP_403_FORBIDDEN)
        planner = self.get_object()
        for member in planner.member_plans.all():
            member.tasks.all().delete()
            self._generate_member_tasks(member)
        self._rebuild_contact_assignments(planner)
        return Response({"success": True, "message": "Planner tasks regenerated"})

    @action(detail=True, methods=['post'])
    def assign_contacts(self, request, pk=None):
        if not _is_admin(request.user):
            return Response({"detail": "Only admin can assign contacts."}, status=status.HTTP_403_FORBIDDEN)
        planner = self.get_object()
        summary = self._rebuild_contact_assignments(planner)
        return Response(summary, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def assignment_overview(self, request, pk=None):
        planner = self.get_object()
        if not _is_admin(request.user):
            planner = ActivityPlanner.objects.filter(member_plans__user=request.user, pk=planner.pk).distinct().first()
            if not planner:
                return Response({"detail": "You do not have access to this planner."}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.now().date()
        planner_user_ids = list(
            planner.member_plans.exclude(user_id__isnull=True).values_list('user_id', flat=True)
        )
        overview = []
        for member in planner.member_plans.select_related('user').all():
            assignments = member.call_assignments.select_related('contact', 'planner_task').all()
            contacted_history = assignments.filter(status='contacted').order_by('-contacted_at', '-updated_at', '-id')
            # A Marketing CRM response can be Follow Up or Not Connected, so
            # it must be visible to the BDCRM admin even though it is not a
            # completed call yet.
            response_history = assignments.filter(
                Q(status='contacted') | Q(remarks__startswith='Marketing CRM update by ')
            ).order_by('-updated_at', '-id')
            # A call is counted once per planner assignment when the Marketing
            # CRM user has submitted any outcome.  Not Connected responses keep
            # the assignment pending for follow-up, but they are still calls
            # made and must be counted separately for the administrator.
            responded_assignments = assignments.filter(
                Q(status='contacted') | Q(remarks__startswith='Marketing CRM update by ')
            )
            not_connected_assignments = responded_assignments.filter(
                remarks__icontains='Call outcome: Not Connected'
            )
            overview.append({
                "member_plan_id": member.id,
                "user_id": member.user_id,
                "member_name": member.member_name,
                "workspace_name": member.workspace_name,
                "monthly_calls_target": member.monthly_calls_target,
                "assigned_contacts": assignments.count(),
                "contacted_contacts": contacted_history.count(),
                "calls_made": responded_assignments.count(),
                "not_connected_calls": not_connected_assignments.count(),
                "marketing_response_count": response_history.count(),
                "today_assigned": assignments.filter(scheduled_date=today).count(),
                "today_done": assignments.filter(status='contacted', contacted_at__date=today).count(),
                "today_calls_made": responded_assignments.filter(updated_at__date=today).count(),
                "today_not_connected_calls": not_connected_assignments.filter(updated_at__date=today).count(),
                "today_pending": assignments.filter(scheduled_date=today, status='pending').count(),
                "next_scheduled_date": assignments.filter(status='pending').order_by('scheduled_date', 'sequence_number').values_list('scheduled_date', flat=True).first(),
                "assignments": [
                    {
                        "assignment_id": assignment.id,
                        "contact_id": assignment.contact_id,
                        "person_name": assignment.contact.person_name or assignment.contact.company_name or "",
                        "company_name": assignment.contact.company_name or "",
                        "phone": assignment.contact.phone or "",
                        "region": assignment.contact.region or "",
                        "vertical": assignment.contact.vertical or "",
                        "location": assignment.contact.location or "",
                        "scheduled_date": assignment.scheduled_date,
                        "status": assignment.status,
                        "contacted_at": assignment.contacted_at,
                        "remarks": assignment.remarks,
                        "is_verified": assignment.status == 'contacted',
                    }
                    for assignment in assignments.order_by('scheduled_date', 'sequence_number', 'id')
                ],
                "contacted_history": [
                    {
                        "assignment_id": assignment.id,
                        "contact_id": assignment.contact_id,
                        "person_name": assignment.contact.person_name or assignment.contact.company_name or "",
                        "company_name": assignment.contact.company_name or "",
                        "phone": assignment.contact.phone or "",
                        "region": assignment.contact.region or "",
                        "scheduled_date": assignment.scheduled_date,
                        "contacted_at": assignment.contacted_at,
                        "remarks": assignment.remarks,
                    }
                    for assignment in contacted_history
                ],
                "response_history": [
                    {
                        "assignment_id": assignment.id,
                        "contact_id": assignment.contact_id,
                        "person_name": assignment.contact.person_name or assignment.contact.company_name or "",
                        "company_name": assignment.contact.company_name or "",
                        "phone": assignment.contact.phone or "",
                        "region": assignment.contact.region or "",
                        "scheduled_date": assignment.scheduled_date,
                        "status": assignment.status,
                        "contacted_at": assignment.contacted_at,
                        "updated_at": assignment.updated_at,
                        "remarks": assignment.remarks,
                    }
                    for assignment in response_history
                ],
            })

        return Response({
            "planner_id": planner.id,
            "planner_name": planner.name,
            "month": planner.month,
            "year": planner.year,
            "members": overview,
            "available_contacts": self._planner_contacts(planner).filter(
                Q(telemarketing_owner__isnull=True) | Q(telemarketing_owner_id__in=planner_user_ids)
            ).count(),
        }, status=status.HTTP_200_OK)

    def _planner_contacts(self, planner):
        """Return only the source selected for this planner.

        Contacts shared by both systems remain available in either source queue,
        but only once within a planner.
        """
        source_project = (planner.source_project or 'all').lower()
        sources = {
            'marketing_crm': ['marketing_crm', 'both'],
            'salespie': ['salespie', 'both'],
            'both': ['both'],
        }.get(source_project)
        return Contact.objects.filter(source_project__in=sources) if sources else Contact.objects.all()

    def _channel_distribution(self, total, weight, slots):
        if total <= 0 or weight <= 0 or slots <= 0:
            return [0] * slots
        weighted_total = round(total * (weight / 100.0))
        base = weighted_total // slots
        rem = weighted_total % slots
        return [base + (1 if i < rem else 0) for i in range(slots)]

    def _working_weekend_dates(self, planner):
        try:
            notes = json.loads(planner.notes or "{}")
        except (TypeError, ValueError):
            return set()
        dates = notes.get("working_weekend_dates", [])
        return {item for item in dates if isinstance(item, str)}

    def _is_working_day(self, day, working_weekend_dates):
        if day.weekday() < 5:
            return True
        return day.isoformat() in working_weekend_dates

    def _generate_member_tasks(self, member_plan):
        month = member_plan.planner.month
        year = member_plan.planner.year
        working_weekend_dates = self._working_weekend_dates(member_plan.planner)
        _, num_days = calendar.monthrange(year, month)
        days = [
            day
            for day in (date(year, month, d) for d in range(1, num_days + 1))
            if self._is_working_day(day, working_weekend_dates)
        ]
        week_map = {}
        for day in days:
            week_num = ((day.day - 1) // 7) + 1
            week_map.setdefault(week_num, []).append(day)

        channels = [
            ("calls", member_plan.monthly_calls_target, member_plan.calls_weightage),
            ("whatsapp", member_plan.monthly_whatsapp_target, member_plan.whatsapp_weightage),
            ("email", member_plan.monthly_email_target, member_plan.email_weightage),
            ("linkedin", member_plan.monthly_linkedin_target, member_plan.linkedin_weightage),
        ]

        for channel, monthly_target, weight in channels:
            weekly_counts = self._channel_distribution(monthly_target, weight, len(week_map.keys()))
            for idx, week_number in enumerate(sorted(week_map.keys())):
                weekly_target = weekly_counts[idx]
                PlannerTask.objects.create(
                    member_plan=member_plan,
                    period_type='weekly',
                    week_number=week_number,
                    channel=channel,
                    target_count=weekly_target,
                    title=f"Week {week_number}: {channel.title()} target {weekly_target}",
                    created_by_admin=True,
                )
                week_days = week_map[week_number]
                daily_counts = self._channel_distribution(weekly_target, 100, len(week_days))
                for d_idx, task_day in enumerate(week_days):
                    daily_target = daily_counts[d_idx]
                    PlannerTask.objects.create(
                        member_plan=member_plan,
                        period_type='daily',
                        week_number=week_number,
                        task_date=task_day,
                        channel=channel,
                        target_count=daily_target,
                        title=f"{task_day.strftime('%d %b')}: {channel.title()} {daily_target}",
                        created_by_admin=True,
                    )

    def _rebuild_contact_assignments(self, planner):
        existing_assignments = list(
            PlannerCallAssignment.objects.filter(member_plan__planner=planner)
            .select_related('contact', 'assigned_user')
            .order_by('scheduled_date', 'sequence_number', 'id')
        )
        existing_contacts_by_user = {}
        for assignment in existing_assignments:
            if assignment.assigned_user_id:
                existing_contacts_by_user.setdefault(assignment.assigned_user_id, [])
                if assignment.contact_id not in existing_contacts_by_user[assignment.assigned_user_id]:
                    existing_contacts_by_user[assignment.assigned_user_id].append(assignment.contact_id)

        # Rebuilding creates new planner-assignment IDs. Remove every old
        # mirror from Marketing CRM first; otherwise the new IDs would create
        # duplicate call-queue rows for the same contact after a regenerate.
        for assignment in existing_assignments:
            delete_assignment_from_peer(
                assignment.id,
                assignment.contact,
                planner_name=planner.name,
            )
        PlannerCallAssignment.objects.filter(member_plan__planner=planner).delete()
        assigned_total = 0
        member_summaries = []
        assigned_in_planner = set()

        member_plans = list(planner.member_plans.select_related('user').all().order_by('member_name', 'id'))
        planner_user_ids = [member.user_id for member in member_plans if member.user_id]

        owned_contacts_by_user = {}
        if planner_user_ids:
            owned_contacts = list(
                self._planner_contacts(planner).filter(telemarketing_owner_id__in=planner_user_ids)
                .order_by('telemarketing_assigned_at', 'created_at', 'id')
            )
            for contact in owned_contacts:
                owned_contacts_by_user.setdefault(contact.telemarketing_owner_id, []).append(contact)

        member_required_counts = {}
        reserved_contacts_by_user = {}
        for member in member_plans:
            daily_call_tasks = list(
                member.tasks.filter(
                    period_type='daily',
                    channel='calls',
                    target_count__gt=0,
                ).order_by('task_date', 'id')
            )
            required_contacts = sum(task.target_count for task in daily_call_tasks)
            member_required_counts[member.id] = {
                'required_contacts': required_contacts,
                'daily_call_tasks': daily_call_tasks,
            }
            if not member.user_id:
                reserved_contacts_by_user[member.user_id] = []
                continue
            owned_for_member = owned_contacts_by_user.get(member.user_id, [])
            reserved_contacts_by_user[member.user_id] = owned_for_member[:required_contacts]

        unowned_contacts = list(
            self._planner_contacts(planner).filter(telemarketing_owner__isnull=True)
            .distinct()
            .order_by('created_at', 'id')
        )

        for member in member_plans:
            daily_call_tasks = member_required_counts[member.id]['daily_call_tasks']
            required_contacts = member_required_counts[member.id]['required_contacts']
            preferred_contact_ids = existing_contacts_by_user.get(member.user_id, [])
            reserved_contacts = list(reserved_contacts_by_user.get(member.user_id, []))
            reserved_by_id = {contact.id: contact for contact in reserved_contacts}
            preferred_contacts = [
                reserved_by_id[contact_id]
                for contact_id in preferred_contact_ids
                if contact_id in reserved_by_id
            ]
            preferred_contacts.extend(
                contact for contact in reserved_contacts
                if contact.id not in preferred_contact_ids
            )

            needed_contacts = max(required_contacts - len(preferred_contacts), 0)
            fresh_contacts = []
            if needed_contacts > 0:
                take_unowned = unowned_contacts[:needed_contacts]
                unowned_contacts = unowned_contacts[len(take_unowned):]
                fresh_contacts.extend(take_unowned)
                needed_contacts -= len(take_unowned)

            if member.user_id and fresh_contacts:
                now = timezone.now()
                fresh_contact_ids = [contact.id for contact in fresh_contacts]
                Contact.objects.filter(id__in=fresh_contact_ids).update(
                    telemarketing_owner=member.user,
                    telemarketing_assigned_at=now,
                    updated_at=now,
                )
                fresh_contacts = list(
                    Contact.objects.filter(id__in=fresh_contact_ids).order_by('telemarketing_assigned_at', 'id')
                )

            member_contacts = preferred_contacts + fresh_contacts
            contact_index = 0
            member_assigned = 0
            for task in daily_call_tasks:
                for seq in range(1, task.target_count + 1):
                    if contact_index >= len(member_contacts):
                        break
                    contact = member_contacts[contact_index]
                    contact_index += 1
                    if contact.id in assigned_in_planner:
                        continue
                    planner_assignment = PlannerCallAssignment.objects.create(
                        member_plan=member,
                        planner_task=task,
                        contact=contact,
                        assigned_user=member.user,
                        sequence_number=seq,
                        scheduled_date=task.task_date,
                    )
                    send_assignment_to_peer(contact, member.user, planner_assignment, planner.name)
                    assigned_in_planner.add(contact.id)
                    assigned_total += 1
                    member_assigned += 1
                if contact_index >= len(member_contacts):
                    break

            member_summaries.append({
                "member_plan_id": member.id,
                "member_name": member.member_name,
                "monthly_calls_target": member.monthly_calls_target,
                "assigned_contacts": member_assigned,
            })

        return {
            "planner_id": planner.id,
            "assigned_contacts": assigned_total,
            "remaining_unassigned_contacts": self._planner_contacts(planner).filter(telemarketing_owner__isnull=True).count(),
            "members": member_summaries,
        }

class PlannerMemberPlanViewSet(viewsets.ModelViewSet):
    queryset = PlannerMemberPlan.objects.all().order_by('-created_at')
    serializer_class = PlannerMemberPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if _is_admin(self.request.user):
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_update(self, serializer):
        if not _is_admin(self.request.user):
            raise PermissionDenied("Only admin can update member plans.")
        member_plan = serializer.save()
        if any(
            f in serializer.validated_data for f in [
                'monthly_calls_target', 'monthly_whatsapp_target', 'monthly_email_target',
                'monthly_linkedin_target', 'calls_weightage', 'whatsapp_weightage',
                'email_weightage', 'linkedin_weightage'
            ]
        ):
            member_plan.tasks.all().delete()
            ActivityPlannerViewSet()._generate_member_tasks(member_plan)
            ActivityPlannerViewSet()._rebuild_contact_assignments(member_plan.planner)


class PlannerTaskViewSet(viewsets.ModelViewSet):
    queryset = PlannerTask.objects.all().order_by('task_date', 'week_number')
    serializer_class = PlannerTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if _is_admin(self.request.user):
            return queryset
        return queryset.filter(member_plan__user=self.request.user)


class PlannerCallAssignmentViewSet(viewsets.ModelViewSet):
    queryset = PlannerCallAssignment.objects.select_related('contact', 'assigned_user', 'member_plan', 'planner_task').all()
    serializer_class = PlannerCallAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        if _is_admin(self.request.user):
            planner_id = self.request.query_params.get('planner')
            if planner_id:
                queryset = queryset.filter(member_plan__planner_id=planner_id)
            return queryset
        return queryset.filter(assigned_user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_queue(self, request):
        today = timezone.now().date()
        all_user_assignments = self.get_queryset()
        base = all_user_assignments.filter(status='pending')
        today_qs = base.filter(scheduled_date=today).order_by('sequence_number', 'id')
        queue_qs = today_qs if today_qs.exists() else base.order_by('scheduled_date', 'sequence_number', 'id')
        next_assignment = queue_qs.first()

        today_total = all_user_assignments.filter(scheduled_date=today).count()
        today_done = all_user_assignments.filter(status='contacted', contacted_at__date=today).count()
        contacted_today = all_user_assignments.filter(
            status='contacted',
            contacted_at__date=today,
        ).order_by('-contacted_at', '-updated_at', '-id')
        contacted_history = all_user_assignments.filter(
            status='contacted',
        ).order_by('-contacted_at', '-updated_at', '-id')

        return Response({
            "today": str(today),
            "today_total": today_total,
            "today_done": today_done,
            "today_remaining": max(today_total - today_done, 0),
            "next_assignment": PlannerCallAssignmentSerializer(next_assignment).data if next_assignment else None,
            "contacted_today": PlannerCallAssignmentSerializer(contacted_today, many=True).data,
            "contacted_history": PlannerCallAssignmentSerializer(contacted_history, many=True).data,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def submit_remark(self, request, pk=None):
        assignment = self.get_object()
        if not _is_admin(request.user) and assignment.assigned_user_id != request.user.id:
            return Response({"detail": "You do not have access to this assignment."}, status=status.HTTP_403_FORBIDDEN)

        remarks = (request.data.get('remarks') or '').strip()
        status_value = request.data.get('status') or 'contacted'
        if status_value not in {'contacted', 'skipped'}:
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        assignment.remarks = remarks
        assignment.status = status_value
        assignment.contacted_at = timezone.now() if status_value == 'contacted' else None
        assignment.save(update_fields=['remarks', 'status', 'contacted_at', 'updated_at'])

        if status_value == 'contacted':
            contact = assignment.contact
            if not contact.is_verified:
                contact.is_verified = True
                contact.save(update_fields=['is_verified', 'updated_at'])

        planner_task = assignment.planner_task
        pending_count = planner_task.call_assignments.filter(status='pending').count()
        if pending_count == 0:
            planner_task.status = 'done'
        elif planner_task.call_assignments.filter(status='contacted').exists():
            planner_task.status = 'in_progress'
        else:
            planner_task.status = 'pending'
        planner_task.save(update_fields=['status', 'updated_at'])

        if status_value == 'contacted' and remarks:
            linked_lead = Lead.objects.filter(phone=assignment.contact.phone).order_by('-created_at').first()
            if linked_lead is None:
                linked_lead = Lead.objects.order_by('id').first()
            if linked_lead is not None:
                Activity.objects.create(
                    lead=linked_lead,
                    activity_type='note',
                    summary=f"Planner call remark for {assignment.contact.person_name or assignment.contact.company_name or 'Contact'}",
                    description=remarks,
                )

        return Response(PlannerCallAssignmentSerializer(assignment).data, status=status.HTTP_200_OK)


import time
from django.http import JsonResponse

# ... existing imports ...

@api_view(['POST'])
def run_free_campaign(request):
    """
    Automates WhatsApp Web on the HOST machine.
    WARNING: Do not touch mouse/keyboard while this runs.
    """
    try:
        import pywhatkit
        import keyboard
        # 1. Get data from React
        data = request.data
        campaign_name = data.get('name', 'Free Campaign')
        message_template = data.get('message_template', '')
        lead_ids = data.get('lead_ids', [])

        if not lead_ids:
            return JsonResponse({'error': 'No leads selected'}, status=400)

        # 2. Filter Leads
        leads = Lead.objects.filter(id__in=lead_ids)
        
        results = []
        
        # 3. Loop through leads and automate
        for index, lead in enumerate(leads):
            if not lead.phone:
                continue

            # Personalize message using your Claude logic or simple replace
            msg = message_template.replace('{name}', lead.name).replace('{company}', lead.company)
            
            # Clean phone (Must have Country Code, e.g., +91...)
            phone = lead.phone.replace(' ', '').replace('-', '')
            if not phone.startswith('+'):
                phone = '+' + phone

            print(f"👉 Sending to {lead.name} ({phone})...")

            # === THE MAGIC PART (pywhatkit) ===
            try:
                # This opens web.whatsapp.com, waits 15s, types message
                # wait_time=15 (seconds to wait for page load)
                # tab_close=True (close tab after sending)
                pywhatkit.sendwhatmsg_instantly(
                    phone_no=phone, 
                    message=msg, 
                    wait_time=10, 
                    tab_close=True, 
                    close_time=3
                )
                
                # PyWhatKit sometimes types but doesn't hit Enter. 
                # We force press Enter just in case.
                time.sleep(2)
                keyboard.press_and_release('enter')
                
                results.append({'lead': lead.name, 'status': 'Sent'})
                
                # SAFETY DELAY (Prevents Ban)
                time.sleep(5) 

            except Exception as e:
                print(f"❌ Failed for {lead.name}: {str(e)}")
                results.append({'lead': lead.name, 'status': 'Failed'})

        return JsonResponse({'status': 'Campaign Completed', 'details': results})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
# ═══════════════════════════════════════════════════════
#  AI AGENT TRIGGER ENDPOINT
# ═══════════════════════════════════════════════════════

import threading
from .ai_agent import CRMAgent

@api_view(['POST'])
def trigger_agent(request):
    """
    POST /api/run-agent/
    Triggers the AI Agent from the React frontend.
    Runs in a background thread so the API responds immediately.
    """
    def _run_agent():
        try:
            agent = CRMAgent()
            agent.run()
        except Exception as e:
            print(f"❌ Agent error: {e}")

    # Start in background thread
    thread = threading.Thread(target=_run_agent, daemon=True)
    thread.start()

    return JsonResponse({
        "status": "started",
        "message": "AI Agent started in background. Check your Django terminal for live output."
    })


@api_view(['GET'])
def agent_status(request):
    """
    GET /api/agent-status/
    Returns basic status info.
    """
    from .models import Activity, AIAlert
    now = timezone.now()

    # Count recent agent actions
    agent_actions_24h = Activity.objects.filter(
        summary__icontains='🤖',
        created_at__gte=now - timedelta(hours=24)
    ).count()

    # Recent agent activities
    recent = Activity.objects.filter(
        summary__icontains='🤖'
    ).order_by('-created_at')[:20]

    recent_list = []
    for a in recent:
        recent_list.append({
            "id": a.id,
            "lead": a.lead.name if a.lead else "Unknown",
            "company": a.lead.company if a.lead else "",
            "summary": a.summary,
            "description": a.description[:100],
            "created_at": a.created_at.isoformat(),
        })

    return JsonResponse({
        "agent_actions_24h": agent_actions_24h,
        "recent_actions": recent_list,
    })
