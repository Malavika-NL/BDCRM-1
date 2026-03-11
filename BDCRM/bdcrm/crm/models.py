from django.db import models
from django.utils import timezone

class Vertical(models.Model):
    name = models.CharField(max_length=100) # e.g., Auto, Pharma
    def __str__(self): return self.name

class Region(models.Model):
    name = models.CharField(max_length=100) # e.g., APAC, EMEA
    def __str__(self): return self.name

class Industry(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Company(models.Model):
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    size = models.CharField(max_length=50, blank=True)
    region = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')

    def __str__(self):
        return self.name

class Campaign(models.Model):
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

class Lead(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('mql', 'Marketing Qualified (MQL)'),
        ('sql', 'Sales Qualified (SQL)'),
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

class AIInteractionLog(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='ai_logs')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, blank=True)
    interaction_type = models.CharField(max_length=50) # e.g., 'voice_call', 'whatsapp_bot'
    transcript = models.TextField(blank=True) # Speech to Text output
    ai_summary = models.TextField(blank=True)
    sentiment = models.CharField(max_length=20, blank=True)
    audio_url = models.URLField(blank=True) # Twilio/Asterisk recording link
    created_at = models.DateTimeField(auto_now_add=True)

class Activity(models.Model):
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

class Task(models.Model):
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


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_vertical = models.CharField(max_length=100, blank=True)
    target_region = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class Lesson(models.Model):
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

class ProductCategory(models.Model):
    name = models.CharField(max_length=100) # e.g., "Label", "Ribbon"
    def __str__(self): return self.name

class ConsumptionPattern(models.Model):
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


class Enrollment(models.Model):
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


class WhatsAppCampaign(models.Model):
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

class WhatsAppMessage(models.Model):
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