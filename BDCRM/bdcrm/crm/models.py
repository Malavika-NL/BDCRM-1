from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from .tenancy import TenantModel


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("employee", "Employee"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    phone_number = models.CharField(max_length=20, blank=True, default="")
    designation = models.CharField(max_length=120, blank=True, default="")
    department = models.CharField(max_length=120, blank=True, default="")
    address = models.TextField(blank=True, default="")

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Vertical(TenantModel):
    name = models.CharField(max_length=100) # e.g., Auto, Pharma
    def __str__(self): return self.name

class Region(TenantModel):
    name = models.CharField(max_length=100) # e.g., APAC, EMEA
    def __str__(self): return self.name

class Industry(TenantModel):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Company(TenantModel):
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    size = models.CharField(max_length=50, blank=True)
    region = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tag(TenantModel):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')

    def __str__(self):
        return self.name

class Campaign(TenantModel):
    TYPE_CHOICES = [
        ('whatsapp', 'WhatsApp Campaign'),
        ('email', 'Email Sequence'),
        ('auto_call', 'AI Auto-Calling'),
        ('web', 'Website Scraping/Inbound'),
    ]
    name = models.CharField(max_length=200)
    campaign_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    target_leads = models.IntegerField(default=0) # For PDCA Targets
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return self.name

class Lead(TenantModel):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('negotiation', 'Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]
    
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('linkedin', 'LinkedIn'),
        ('cold_outreach', 'Cold Outreach'),
        ('event', 'Event'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100) 
    related_company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    phone = models.CharField(max_length=20, blank=True)

    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='other')
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    tags = models.ManyToManyField(Tag, blank=True, related_name='leads')
    vertical = models.ForeignKey(Vertical, null=True, blank=True, on_delete=models.SET_NULL)
    region_rel = models.ForeignKey(Region, null=True, blank=True, on_delete=models.SET_NULL)
    industry_rel = models.ForeignKey(Industry, null=True, blank=True, on_delete=models.SET_NULL)
    campaign = models.ForeignKey(Campaign, null=True, blank=True, on_delete=models.SET_NULL, related_name='leads')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company} - {self.name}"

class AIInteractionLog(TenantModel):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='ai_logs')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, blank=True)
    interaction_type = models.CharField(max_length=50) # e.g., 'voice_call', 'whatsapp_bot'
    transcript = models.TextField(blank=True) # Speech to Text output
    ai_summary = models.TextField(blank=True)
    sentiment = models.CharField(max_length=20, blank=True)
    audio_url = models.URLField(blank=True) # Twilio/Asterisk recording link
    created_at = models.DateTimeField(auto_now_add=True)

class Activity(TenantModel):
    TYPE_CHOICES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note', 'Note'),
    ]
    lead = models.ForeignKey(Lead, related_name='activities', on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    summary = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class Task(TenantModel):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    lead = models.ForeignKey(Lead, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']


class Course(TenantModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_vertical = models.CharField(max_length=100, blank=True)
    target_region = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(TenantModel):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class Lesson(TenantModel):
    TYPE_CHOICES = [
        ('script', 'Sales Script / Prompt'),
        ('video', 'Training Video'),
        ('task', 'Action Item'),
    ]
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    lesson_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='script')
    video_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class ProductCategory(TenantModel):
    name = models.CharField(max_length=100) # e.g., "Label", "Ribbon"
    def __str__(self): return self.name

class ConsumptionPattern(TenantModel):
    """
    Tracks when a Company needs to re-order.
    """
    # We link this to your existing Company model
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='patterns')
    product = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    
    frequency_days = models.IntegerField(help_text="Days between orders (e.g. 30)")
    last_purchase_date = models.DateField()
    
    # Logic to calculate next date
    def next_action_date(self):
        return self.last_purchase_date + timezone.timedelta(days=self.frequency_days)

    def is_due(self):
        return timezone.now().date() >= self.next_action_date()


class Enrollment(TenantModel):
    """
    Links your existing 'Lead' to your existing 'Course'.
    Tracks progress automatically.
    """
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='STARTED') # STARTED, COMPLETED

    def __str__(self):
        return f"{self.lead.name} -> {self.course.title}"


class WhatsAppCampaign(TenantModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('sending', 'Sending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    name = models.CharField(max_length=200)
    message_template = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_messages = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    delivered_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class WhatsAppMessage(TenantModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
        ('failed', 'Failed'),
    ]
    
    campaign = models.ForeignKey(WhatsAppCampaign, on_delete=models.CASCADE, related_name='messages')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    message_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message_id = models.CharField(max_length=200, blank=True, null=True)
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.campaign.name} - {self.lead.name}"
  

class AILeadProfile(TenantModel):
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='ai_profile')

    score = models.FloatField(default=0.0)
    conversion_probability = models.FloatField(default=0.0)
    priority_rank = models.IntegerField(default=5)

    churn_risk = models.FloatField(default=0.0)
    deal_risk_level = models.CharField(max_length=20, blank=True, default='unknown')

    sentiment_trend = models.CharField(max_length=20, blank=True)
    engagement_velocity = models.FloatField(default=0.0)
    recommended_action = models.TextField(blank=True)
    competitor_mentions = models.JSONField(default=list, blank=True)
    suggested_tags = models.JSONField(default=list, blank=True)
    best_contact_time = models.JSONField(default=dict, blank=True)

    last_score_factors = models.JSONField(default=dict, blank=True)
    last_ai_response = models.JSONField(default=dict, blank=True)

    scored_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"AI: {self.lead.name} ({self.score})"


class AIScoreSnapshot(TenantModel):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='ai_score_history')
    score = models.FloatField()
    conversion_probability = models.FloatField(default=0.0)
    churn_risk = models.FloatField(default=0.0)
    factors = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class AIActivityAnalysis(TenantModel):
    activity = models.OneToOneField(Activity, on_delete=models.CASCADE, related_name='ai_analysis')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='ai_activity_analyses')

    sentiment_score = models.FloatField(default=0.0)
    sentiment_label = models.CharField(max_length=20, blank=True)
    intent = models.CharField(max_length=100, blank=True)
    urgency = models.CharField(max_length=20, blank=True)
    key_topics = models.JSONField(default=list, blank=True)
    buying_signals = models.JSONField(default=list, blank=True)
    objections = models.JSONField(default=list, blank=True)
    competitor_mentions = models.JSONField(default=list, blank=True)
    one_line_summary = models.TextField(blank=True)
    follow_up_needed = models.BooleanField(default=False)
    follow_up_suggestion = models.TextField(blank=True)
    follow_up_days = models.IntegerField(default=3)
    full_analysis = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis: {self.lead.name}"


class AIAlert(TenantModel):
    ALERT_TYPES = [
        ('churn_risk', 'Churn Risk'),
        ('engagement_spike', 'Engagement Spike'),
        ('score_change', 'Score Change'),
        ('competitor_mention', 'Competitor Mentioned'),
        ('ghost_lead', 'Ghost Lead'),
        ('stagnant_deal', 'Stagnant Deal'),
        ('follow_up_overdue', 'Follow-up Overdue'),
    ]

    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='ai_alerts')
    title = models.CharField(max_length=300)
    description = models.TextField()
    priority = models.CharField(max_length=20, default='medium')
    is_read = models.BooleanField(default=False)
    is_actioned = models.BooleanField(default=False)
    suggested_action = models.TextField(blank=True)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.priority}] {self.title}"


class AIChatSession(TenantModel):
    session_id = models.CharField(max_length=100, unique=True)
    messages = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_message(self, role, content):
        self.messages.append({"role": role, "content": content})
        if len(self.messages) > 20:
            self.messages = self.messages[-20:]
        self.save()

    def __str__(self):
        return f"Chat: {self.session_id}"


class AIDocument(TenantModel):
    DOC_TYPES = [
        ('proposal', 'Business Proposal'),
        ('email_sequence', 'Email Sequence'),
        ('battle_card', 'Battle Card'),
        ('meeting_brief', 'Meeting Brief'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True, related_name='ai_documents')
    doc_type = models.CharField(max_length=30, choices=DOC_TYPES)
    title = models.CharField(max_length=300)
    content = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.doc_type}] {self.title}"
    
# =========================
# BDM / Sales Dashboard Models
# Add at the bottom of models.py
# =========================

class ProductLine(TenantModel):
    name = models.CharField(max_length=100, unique=True)  # e.g. RFID, WMS, Label
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CustomerCategory(TenantModel):
    name = models.CharField(max_length=100, unique=True)  # Key Accounts, Existing Accounts...
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class SalesChannel(TenantModel):
    name = models.CharField(max_length=100, unique=True)  # Direct Customer, Dealer
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class EngagementTool(TenantModel):
    name = models.CharField(max_length=100, unique=True)  # WhatsApp, Email, LinkedIn...
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class LeadBusinessMeta(TenantModel):
    """
    Extra business dimensions for an existing Lead without changing your Lead model.
    """
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='business_meta')
    customer_category = models.ForeignKey(CustomerCategory, null=True, blank=True, on_delete=models.SET_NULL)
    sales_channel = models.ForeignKey(SalesChannel, null=True, blank=True, on_delete=models.SET_NULL)
    product_lines = models.ManyToManyField(ProductLine, blank=True, related_name='lead_business_metas')
    engagement_tools = models.ManyToManyField(EngagementTool, blank=True, related_name='lead_business_metas')
    lifecycle_type = models.CharField(
        max_length=50,
        default='target',
        choices=[
            ('target', 'Target Customer'),
            ('current', 'Current Customer'),
            ('repeat', 'Repeat Customer'),
            ('dormant', 'Dormant Customer'),
        ]
    )
    last_purchase_date = models.DateField(null=True, blank=True)
    last_purchase_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    purchase_frequency_days = models.IntegerField(default=0)
    conversion_probability = models.FloatField(default=0.0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Business Meta - {self.lead.name}"


class BDMTarget(TenantModel):
    """
    Management target setting module
    """
    TARGET_TYPE_CHOICES = [
        ('region', 'Region'),
        ('vertical', 'Vertical'),
        ('product', 'Product'),
        ('customer_category', 'Customer Category'),
        ('sales_channel', 'Sales Channel'),
        ('engagement_tool', 'Engagement Tool'),
    ]

    name = models.CharField(max_length=200)
    target_type = models.CharField(max_length=50, choices=TARGET_TYPE_CHOICES)
    vertical = models.ForeignKey(Vertical, null=True, blank=True, on_delete=models.SET_NULL)
    region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.SET_NULL)
    product_line = models.ForeignKey(ProductLine, null=True, blank=True, on_delete=models.SET_NULL)
    customer_category = models.ForeignKey(CustomerCategory, null=True, blank=True, on_delete=models.SET_NULL)
    sales_channel = models.ForeignKey(SalesChannel, null=True, blank=True, on_delete=models.SET_NULL)
    engagement_tool = models.ForeignKey(EngagementTool, null=True, blank=True, on_delete=models.SET_NULL)
    campaign = models.ForeignKey(Campaign, null=True, blank=True, on_delete=models.SET_NULL)
    
    target_leads = models.IntegerField(default=0)
    target_revenue = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    achieved_leads = models.IntegerField(default=0)
    achieved_revenue = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50, default='active')
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def progress_percentage(self):
        if self.target_revenue and float(self.target_revenue) > 0:
            return round((float(self.achieved_revenue) / float(self.target_revenue)) * 100, 2)
        if self.target_leads > 0:
            return round((self.achieved_leads / self.target_leads) * 100, 2)
        return 0

    def __str__(self):
        return self.name


class BDMReview(TenantModel):
    """
    Review / PDCA logs against target
    """
    target = models.ForeignKey(BDMTarget, on_delete=models.CASCADE, related_name='reviews')
    review_date = models.DateField()
    summary = models.TextField()
    findings = models.TextField(blank=True)
    action_items = models.TextField(blank=True)
    score = models.FloatField(default=0.0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review - {self.target.name} - {self.review_date}"


class CampaignWorkspace(TenantModel):
    """
    Unified campaign builder workspace
    """
    name = models.CharField(max_length=200)
    brand_name = models.CharField(max_length=200, blank=True)
    content_theme = models.CharField(max_length=200, blank=True)
    target_description = models.TextField(blank=True)
    selected_channel = models.CharField(max_length=50, default='whatsapp')
    selected_vertical = models.ForeignKey(Vertical, null=True, blank=True, on_delete=models.SET_NULL)
    selected_region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.SET_NULL)
    selected_product_line = models.ForeignKey(ProductLine, null=True, blank=True, on_delete=models.SET_NULL)
    prompt_used = models.TextField(blank=True)
    generated_subject = models.CharField(max_length=255, blank=True)
    generated_content = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='draft')  # draft/ready/sent/archived
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CampaignResponse(TenantModel):
    """
    Response categorization for campaign interactions
    """
    RESPONSE_CHOICES = [
        ('interested', 'Interested'),
        ('demo_requested', 'Demo Requested'),
        ('price_requested', 'Price Requested'),
        ('follow_up_later', 'Follow Up Later'),
        ('not_interested', 'Not Interested'),
        ('invalid_lead', 'Invalid Lead'),
        ('competitor', 'Competitor Mentioned'),
        ('no_response', 'No Response'),
    ]

    workspace = models.ForeignKey(CampaignWorkspace, on_delete=models.CASCADE, related_name='responses')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='campaign_responses')
    response_type = models.CharField(max_length=50, choices=RESPONSE_CHOICES)
    response_text = models.TextField(blank=True)
    ai_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead.name} - {self.response_type}"


class Contact(TenantModel):
    region = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, default="")
    vertical = models.CharField(max_length=100, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, default="")
    person_name = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    telemarketing_owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='telemarketing_assigned_contacts',
    )
    telemarketing_assigned_at = models.DateTimeField(null=True, blank=True)
    # The actual BDCRM account that manually created this contact.  Keep the
    # existing name snapshot for legacy/imported rows, but use this relation
    # for accurate creator attribution going forward.
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='created_contacts',
    )
    created_by_name = models.CharField(max_length=150, blank=True, default="")
    source_project = models.CharField(max_length=30, blank=True, default="")
    source_contact_id = models.CharField(max_length=100, blank=True, default="")
    source_owner_name = models.CharField(max_length=150, blank=True, default="")
    source_owner_email = models.EmailField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contacts"

class MarketingAsset(TenantModel):
    ASSET_TYPES = [
        ('brochure', 'Company Profile/Brochure'),
        ('demo', 'Product Demo Video'),
        ('price_list', 'Price List'),
        ('image', 'Creative Image'),
    ]
    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES)
    file = models.FileField(upload_to='marketing_assets/') # Requires Pillow/boto3 if using S3
    whatsapp_media_id = models.CharField(max_length=100, blank=True, help_text="ID for fast sending via WhatsApp API")
    
    associated_vertical = models.ForeignKey(Vertical, null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self): return self.name


class ActivityPlanner(TenantModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]

    name = models.CharField(max_length=200)
    month = models.PositiveSmallIntegerField()
    year = models.PositiveSmallIntegerField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='created_activity_plans',
    )
    role_mode = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')
    # Limits the contacts this planner is allowed to allocate.  Keeping this on
    # the planner (rather than only in the UI) prevents a later rebuild from
    # silently mixing contacts from the two source CRMs.
    source_project = models.CharField(max_length=30, default='all')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-month', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.month}/{self.year})"


class PlannerMemberPlan(TenantModel):
    planner = models.ForeignKey(ActivityPlanner, on_delete=models.CASCADE, related_name='member_plans')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='activity_member_plans',
    )
    member_name = models.CharField(max_length=150)
    workspace_name = models.CharField(max_length=200)

    monthly_calls_target = models.PositiveIntegerField(default=0)
    monthly_whatsapp_target = models.PositiveIntegerField(default=0)
    monthly_email_target = models.PositiveIntegerField(default=0)
    monthly_linkedin_target = models.PositiveIntegerField(default=0)

    calls_weightage = models.PositiveSmallIntegerField(default=25)
    whatsapp_weightage = models.PositiveSmallIntegerField(default=25)
    email_weightage = models.PositiveSmallIntegerField(default=25)
    linkedin_weightage = models.PositiveSmallIntegerField(default=25)

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_activity_member_plans',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['member_name']

    def __str__(self):
        return f"{self.member_name} - {self.workspace_name}"


class PlannerTask(TenantModel):
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('daily', 'Daily'),
    ]
    CHANNEL_CHOICES = [
        ('calls', 'Calls'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('linkedin', 'LinkedIn'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    member_plan = models.ForeignKey(PlannerMemberPlan, on_delete=models.CASCADE, related_name='tasks')
    period_type = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    week_number = models.PositiveSmallIntegerField(default=1)
    task_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(default='09:00')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    target_count = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_by_admin = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['week_number', 'task_date', 'channel']

    def __str__(self):
        return f"{self.member_plan.member_name} - {self.channel} ({self.period_type})"


class PlannerCallAssignment(TenantModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('skipped', 'Skipped'),
    ]

    member_plan = models.ForeignKey(PlannerMemberPlan, on_delete=models.CASCADE, related_name='call_assignments')
    planner_task = models.ForeignKey(
        PlannerTask,
        on_delete=models.CASCADE,
        related_name='call_assignments',
        limit_choices_to={'period_type': 'daily', 'channel': 'calls'},
    )
    contact = models.ForeignKey('Contact', on_delete=models.CASCADE, related_name='planner_call_assignments')
    assigned_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='planner_call_assignments',
    )
    sequence_number = models.PositiveIntegerField(default=1)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField(default='09:00')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    remarks = models.TextField(blank=True, default='')
    contacted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_date', 'sequence_number', 'id']
        constraints = [
            models.UniqueConstraint(fields=['planner_task', 'contact'], name='uniq_planner_task_contact_assignment'),
            models.UniqueConstraint(fields=['member_plan', 'contact'], name='uniq_member_plan_contact_assignment'),
        ]

    def __str__(self):
        return f"{self.member_plan.member_name} -> {self.contact} ({self.scheduled_date})"


class AccountTargetCompany(TenantModel):
    name = models.CharField(max_length=255, unique=True)
    normalized_name = models.CharField(max_length=255, unique=True, editable=False)
    location = models.CharField(max_length=255, blank=True, default="")
    region = models.CharField(max_length=100, blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="created_account_target_companies",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        self.name = (self.name or "").strip()
        self.normalized_name = self.name.casefold()
        self.location = (self.location or "").strip()
        self.region = (self.region or "").strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class AccountTargetPIC(TenantModel):
    company = models.ForeignKey(AccountTargetCompany, on_delete=models.CASCADE, related_name="pics")
    pic_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="account_target_pics",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["pic_name", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["company", "phone_number"],
                name="unique_account_target_pic_phone_per_company",
            ),
        ]

    def save(self, *args, **kwargs):
        self.pic_name = (self.pic_name or "").strip()
        self.phone_number = (self.phone_number or "").strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.company.name} - {self.pic_name}"


class WishlistEntry(TenantModel):
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="wishlist_entries",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def save(self, *args, **kwargs):
        self.company_name = (self.company_name or "").strip()
        self.location = (self.location or "").strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.company_name} ({self.location})"
