from rest_framework import serializers
from .models import ConsumptionPattern, Lead, Course, Module, Lesson, Activity, Region, Task, Tag, Company, Vertical

# --- NEW SERIALIZERS ---

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    # Read-only nested fields for the UI
    activities = ActivitySerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    tags_details = TagSerializer(source='tags', many=True, read_only=True)
    
    # Write-only field to accept Tag IDs
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)

    class Meta:
        model = Lead
        fields = '__all__'

# --- EXISTING LMS SERIALIZERS ---

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'target_vertical', 'target_region', 'modules', 'created_at']

class ConsumptionPatternSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    next_action_date = serializers.DateField(read_only=True)
    is_due = serializers.BooleanField(read_only=True)

    class Meta:
        model = ConsumptionPattern
        fields = ['id', 'product', 'product_name', 'frequency_days', 'last_purchase_date', 'next_action_date', 'is_due']

# Serializer for the Agent to use (Simpler input)
class AgentIngestionSerializer(serializers.ModelSerializer):
    """
    Allows AI Agents to send text (e.g. "Automotive") instead of IDs.
    """
    region = serializers.SlugRelatedField(slug_field='name', queryset=Region.objects.all(), required=False)
    vertical = serializers.SlugRelatedField(slug_field='name', queryset=Vertical.objects.all(), required=False)

    class Meta:
        model = Lead
        fields = ['name', 'email', 'company_name', 'region', 'vertical', 'source']
        
    def create(self, validated_data):
        # Handle the logic to link or create the Company object automatically
        company_name = validated_data.get('company_name')
        if company_name:
            # Check if company exists, if not create it (Simple version)
            Company.objects.get_or_create(name=company_name)
        return super().create(validated_data)
from .models import Campaign

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'
        

from .models import WhatsAppCampaign, WhatsAppMessage

class WhatsAppMessageSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    lead_phone = serializers.CharField(source='lead.phone', read_only=True)
    
    class Meta:
        model = WhatsAppMessage
        fields = '__all__'

class WhatsAppCampaignSerializer(serializers.ModelSerializer):
    messages = WhatsAppMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = WhatsAppCampaign
        fields = '__all__'
        read_only_fields = ['total_messages', 'sent_count', 'delivered_count', 'failed_count']

class WhatsAppCampaignCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    message_template = serializers.CharField()
    lead_ids = serializers.ListField(child=serializers.IntegerField())
    
    def create(self, validated_data):
        lead_ids = validated_data.pop('lead_ids')
        
        # Create campaign
        campaign = WhatsAppCampaign.objects.create(**validated_data)
        campaign.total_messages = len(lead_ids)
        campaign.save()
        
        # Create messages for each lead
        for lead_id in lead_ids:
            try:
                lead = Lead.objects.get(id=lead_id)
                # Personalize message
                message_text = validated_data['message_template']
                message_text = message_text.replace('{name}', lead.name)
                message_text = message_text.replace('{company}', lead.company)
                
                WhatsAppMessage.objects.create(
                    campaign=campaign,
                    lead=lead,
                    message_text=message_text,
                    status='pending'
                )
            except Lead.DoesNotExist:
                continue
        
        return campaign

class QuickSendSerializer(serializers.Serializer):
    phone = serializers.CharField()
    message = serializers.CharField()