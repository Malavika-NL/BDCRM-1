from django.contrib import admin

from .models import (Activity, Industry, Lead, Industry, Course,AIScoreSnapshot,AIActivityAnalysis,AIAlert,AIChatSession,
Campaign, Task, Tag, Company, WhatsAppCampaign, ProductCategory,ConsumptionPattern,Enrollment,AILeadProfile,AIDocument,ProductLine,
CustomerCategory,
AIInteractionLog, Vertical, Region, AIDocument, ProductLine, BDMTarget, CampaignWorkspace)

# Register your models here.
admin.site.register(Lead)
admin.site.register(Activity)
admin.site.register(Industry)
admin.site.register(Course)
admin.site.register(Campaign)
admin.site.register(Task)
admin.site.register(Tag)
admin.site.register(Company)
admin.site.register(WhatsAppCampaign)
admin.site.register(AIInteractionLog)
admin.site.register(Vertical)
admin.site.register(Region)
admin.site.register(AIDocument)
admin.site.register(AIAlert)
admin.site.register(ProductLine)
admin.site.register(BDMTarget)
admin.site.register(CampaignWorkspace)
