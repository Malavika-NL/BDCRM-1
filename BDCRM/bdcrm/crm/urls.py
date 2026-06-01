from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from crm import views 

router = routers.DefaultRouter()
router.register(r'contacts', views.ContactViewSet, basename='contact')
router.register(r'leads', views.LeadViewSet)
router.register(r'activities', views.ActivityViewSet) # New
router.register(r'tasks', views.TaskViewSet)          # New
router.register(r'tags', views.TagViewSet)            # New
router.register(r'companies', views.CompanyViewSet)   # New
router.register(r'courses', views.CourseViewSet)
router.register(r'whatsapp-campaigns', views.WhatsAppCampaignViewSet, basename='whatsapp-campaign')
router.register(r'dashboard/smart_prompts', views.SmartDashboardViewSet, basename='smart-prompts')
router.register(r'agent/dump_leads', views.AgentIngestionViewSet, basename='agent-dump')
router.register(r'ai-logs', views.AIInteractionLogViewSet, basename='ai-logs')
router.register(r'ai', views.AILeadViewSet, basename='ai-lead')
router.register(r'verticals', views.VerticalViewSet)
router.register(r'regions', views.RegionViewSet)
router.register(r'ai-activity', views.AIActivityViewSet, basename='ai-activity')
router.register(r'ai-docs', views.AIDocumentViewSet, basename='ai-docs')
router.register(r'ai-chat', views.AIChatbotViewSet, basename='ai-chat')
router.register(r'ai-alerts', views.AIAlertViewSet, basename='ai-alerts')
router.register(r'ai-analytics', views.AIAnalyticsViewSet, basename='ai-analytics')
router.register(r'ai-prospector', views.AIProspectorViewSet, basename='ai-prospector')
router.register(r'product-lines', views.ProductLineViewSet)
router.register(r'bdm-targets', views.BDMTargetViewSet, basename='bdm-targets')
router.register(r'smart-sales-calls', views.SmartSalesCallViewSet, basename='smart-sales-calls')
router.register(r'campaign-workspace', views.CampaignWorkspaceViewSet, basename='campaign-workspace')
router.register(r'customer-categories', views.CustomerCategoryViewSet)
router.register(r'sales-channels', views.SalesChannelViewSet)
router.register(r'engagement-tools', views.EngagementToolViewSet)
router.register(r'activity-planners', views.ActivityPlannerViewSet, basename='activity-planners')
router.register(r'planner-member-plans', views.PlannerMemberPlanViewSet, basename='planner-member-plans')
router.register(r'planner-tasks', views.PlannerTaskViewSet, basename='planner-tasks')




urlpatterns = [
    path('api/run-free-campaign/', views.run_free_campaign, name='run_free_campaign'),
    path('api/run-agent/', views.trigger_agent, name='run_agent'),
    path('api/agent-status/', views.agent_status, name='agent_status'),
    path('api/run-free-campaign/', views.run_free_campaign, name='run_free_campaign'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
