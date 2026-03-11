from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
import os
import anthropic

from .models import Lead, Course, Activity, Task, Tag, Company
from .serializers import (
    LeadSerializer, CourseSerializer, ActivitySerializer, 
    TaskSerializer, TagSerializer, CompanySerializer
)

# Anthropic Setup
os.environ["ANTHROPIC_API_KEY"] = "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"
client = anthropic.Anthropic()

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by("-created_at")
    serializer_class = LeadSerializer
    
    # Enable Search and Sorting
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'company', 'email', 'tags__name']
    ordering_fields = ['value', 'created_at', 'status']

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Custom endpoint to get aggregated CRM data for charts
        GET /api/leads/dashboard_stats/
        """
        leads = Lead.objects.all()
        
        # 1. Pipeline Total
        total_value = leads.aggregate(Sum('value'))['value__sum'] or 0
        
        # 2. Status Counts (for Funnel Chart)
        status_counts = leads.values('status').annotate(count=Count('status'))
        
        # 3. Recent Activity Feed
        recent_activities = Activity.objects.all().order_by('-created_at')[:5]
        activity_data = ActivitySerializer(recent_activities, many=True).data

        # 4. Win Rate Calculation
        closed_deals = leads.filter(Q(status='won') | Q(status='lost')).count()
        won_deals = leads.filter(status='won').count()
        win_rate = (won_deals / closed_deals * 100) if closed_deals > 0 else 0

        return Response({
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
            response = client.messages.create(
                model="claude-haiku-4-5-20251001", # Using a standard stable model ID
                max_tokens=500,
                temperature=0.7,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )
            ai_message = response.content[0].text
            return Response({"generated_text": ai_message})

        except Exception as e:
            print("CLAUDE ERROR:", repr(e))
            return Response({"error": str(e)}, status=500)


# --- NEW VIEWSETS ---

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by("-created_at")
    serializer_class = ActivitySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['description', 'summary']

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

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("-created_at")
    serializer_class = CourseSerializer

from .models import ConsumptionPattern, ProductCategory, Enrollment
from .serializers import ConsumptionPatternSerializer, AgentIngestionSerializer
from datetime import date

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