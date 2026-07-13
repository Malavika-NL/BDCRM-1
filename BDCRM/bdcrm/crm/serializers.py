import re

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import AIActivityAnalysis, AIAlert, AIDocument, AILeadProfile, AIScoreSnapshot, ConsumptionPattern, Lead, Contact, Course, Module, Lesson, Activity, Region, Task, Tag, Company, Vertical, UserProfile, AccountTargetCompany, AccountTargetPIC, WishlistEntry

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


class ContactSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    created_by_info = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = [
            "id",
            "name",
            "person_name",
            "company_name",
            "designation",
            "email",
            "phone",
            "address",
            "region",
            "location",
            "vertical",
            "is_verified",
            "telemarketing_owner",
            "telemarketing_assigned_at",
            "created_by_name",
            "created_by_info",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "telemarketing_owner",
            "telemarketing_assigned_at",
            "created_by_name",
            "created_by_info",
            "created_at",
            "updated_at",
        ]

    def get_name(self, obj):
        return obj.person_name or obj.company_name or ""

    def get_created_by_info(self, obj):
        name = getattr(obj, "created_by_name", "")
        if not name:
            return None
        return {
            "id": None,
            "name": name,
            "username": name,
            "email": "",
        }

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip().lower()
        phone = (attrs.get("phone") or "").strip()

        if self.instance is not None:
            email = email or (self.instance.email or "").strip().lower()
            phone = phone or (self.instance.phone or "").strip()

        if not email and not phone:
            raise serializers.ValidationError("Either email or phone is required.")

        attrs["email"] = email or None
        attrs["phone"] = phone or None
        return attrs

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

from .models import AIInteractionLog

class AIInteractionLogSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = AIInteractionLog
        fields = '__all__'
        
class AILeadProfileSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    lead_company = serializers.CharField(source='lead.company', read_only=True)
    lead_status = serializers.CharField(source='lead.status', read_only=True)
    lead_value = serializers.CharField(source='lead.value', read_only=True)

    class Meta:
        model = AILeadProfile
        fields = '__all__'


class AIScoreSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIScoreSnapshot
        fields = '__all__'


class AIActivityAnalysisSerializer(serializers.ModelSerializer):
    activity_type = serializers.CharField(source='activity.activity_type', read_only=True)
    activity_summary = serializers.CharField(source='activity.summary', read_only=True)
    lead_name = serializers.CharField(source='lead.name', read_only=True)

    class Meta:
        model = AIActivityAnalysis
        fields = '__all__'


class AIAlertSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True, default='')
    lead_company = serializers.CharField(source='lead.company', read_only=True, default='')

    class Meta:
        model = AIAlert
        fields = '__all__'


class AIDocumentSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True, default='')

    class Meta:
        model = AIDocument
        fields = '__all__'


class AIChatInputSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    session_id = serializers.CharField(max_length=100, required=False, default='default')

# =========================
# Add at the bottom of serializers.py
# =========================

from .models import (
    ProductLine, CustomerCategory, SalesChannel, EngagementTool,
    LeadBusinessMeta, BDMTarget, BDMReview, CampaignWorkspace, CampaignResponse,
    ActivityPlanner, PlannerMemberPlan, PlannerTask, PlannerCallAssignment
)


class ProductLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLine
        fields = '__all__'


class CustomerCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCategory
        fields = '__all__'


class SalesChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesChannel
        fields = '__all__'


class EngagementToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementTool
        fields = '__all__'


class LeadBusinessMetaSerializer(serializers.ModelSerializer):
    product_lines_details = ProductLineSerializer(source='product_lines', many=True, read_only=True)
    engagement_tools_details = EngagementToolSerializer(source='engagement_tools', many=True, read_only=True)

    class Meta:
        model = LeadBusinessMeta
        fields = '__all__'


class BDMReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = BDMReview
        fields = '__all__'


class BDMTargetSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    reviews = BDMReviewSerializer(many=True, read_only=True)

    class Meta:
        model = BDMTarget
        fields = '__all__'

    def get_progress(self, obj):
        return obj.progress_percentage()


class CampaignResponseSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    lead_company = serializers.CharField(source='lead.company', read_only=True)

    class Meta:
        model = CampaignResponse
        fields = '__all__'


class CampaignWorkspaceSerializer(serializers.ModelSerializer):
    responses = CampaignResponseSerializer(many=True, read_only=True)

    class Meta:
        model = CampaignWorkspace
        fields = '__all__'


class CampaignWorkspaceGenerateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    brand_name = serializers.CharField(required=False, allow_blank=True)
    content_theme = serializers.CharField(required=False, allow_blank=True)
    target_description = serializers.CharField(required=False, allow_blank=True)
    selected_channel = serializers.CharField(default='whatsapp')
    selected_vertical = serializers.IntegerField(required=False)
    selected_region = serializers.IntegerField(required=False)
    selected_product_line = serializers.IntegerField(required=False)
    prompt = serializers.CharField()
    
from rest_framework import serializers
from .models import Vertical, Region, ProductLine

class VerticalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vertical
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'


class PlannerTaskSerializer(serializers.ModelSerializer):
    assigned_contacts_count = serializers.SerializerMethodField()
    contacted_contacts_count = serializers.SerializerMethodField()
    assignments = serializers.SerializerMethodField()

    class Meta:
        model = PlannerTask
        fields = '__all__'

    def _task_assignments(self, obj):
        if obj.channel != 'calls':
            return PlannerCallAssignment.objects.none()
        if obj.period_type == 'daily':
            assignments = obj.call_assignments.select_related('contact', 'assigned_user').all()
        else:
            assignments = obj.member_plan.call_assignments.select_related('contact', 'assigned_user').filter(
                planner_task__week_number=obj.week_number
            )
        return assignments.order_by('scheduled_date', 'sequence_number', 'id')

    def get_assigned_contacts_count(self, obj):
        return self._task_assignments(obj).count()

    def get_contacted_contacts_count(self, obj):
        return self._task_assignments(obj).filter(status='contacted').count()

    def get_assignments(self, obj):
        return PlannerCallAssignmentSerializer(self._task_assignments(obj), many=True).data


class PlannerCallAssignmentSerializer(serializers.ModelSerializer):
    contact_detail = ContactSerializer(source='contact', read_only=True)
    assigned_user_name = serializers.SerializerMethodField()

    class Meta:
        model = PlannerCallAssignment
        fields = '__all__'

    def get_assigned_user_name(self, obj):
        user = getattr(obj, 'assigned_user', None)
        if not user:
            return ''
        return user.get_full_name() or user.username


class PlannerMemberPlanSerializer(serializers.ModelSerializer):
    tasks = PlannerTaskSerializer(many=True, read_only=True)
    call_assignments = PlannerCallAssignmentSerializer(many=True, read_only=True)

    class Meta:
        model = PlannerMemberPlan
        fields = '__all__'


class ActivityPlannerSerializer(serializers.ModelSerializer):
    member_plans = PlannerMemberPlanSerializer(many=True, read_only=True)

    class Meta:
        model = ActivityPlanner
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username", "").strip()
        email = attrs.get("email", "").strip()
        if not username and not email:
            raise serializers.ValidationError("Provide username or email.")
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, min_length=6, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, min_length=6, trim_whitespace=False)

    def validate_current_password(self, value):
        user = self.context.get("user")
        if user and not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        user = self.context.get("user")
        new_password = attrs.get("new_password", "")
        confirm_password = attrs.get("confirm_password", "")

        if new_password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})

        if user and user.check_password(new_password):
            raise serializers.ValidationError({"new_password": "New password must be different from current password."})

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"new_password": list(exc.messages)})

        return attrs


class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=["admin", "employee"], default="employee")
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    designation = serializers.CharField(required=False, allow_blank=True, max_length=120)
    department = serializers.CharField(required=False, allow_blank=True, max_length=120)
    address = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False, default=True)

    def validate_username(self, value):
        if not value:
            return value
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        email = value.strip()
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("Email already exists.")
        return email

    def create(self, validated_data):
        from .models import UserProfile

        role = validated_data.pop("role", "employee")
        password = validated_data.pop("password")
        username = (validated_data.pop("username", "") or "").strip()
        email = validated_data.get("email", "").strip().lower()
        phone_number = validated_data.pop("phone_number", "")
        designation = validated_data.pop("designation", "")
        department = validated_data.pop("department", "")
        address = validated_data.pop("address", "")
        is_active = validated_data.pop("is_active", True)
        validated_data["email"] = email
        validated_data["username"] = username or self._generate_username_from_email(email)

        user = User.objects.create_user(password=password, **validated_data)
        user.is_active = is_active
        user.save(update_fields=["is_active"])
        UserProfile.objects.create(user=user, role=role)
        profile = user.profile
        profile.phone_number = phone_number
        profile.designation = designation
        profile.department = department
        profile.address = address
        profile.save(update_fields=["phone_number", "designation", "department", "address"])
        return user

    def _generate_username_from_email(self, email: str) -> str:
        local_part = email.split("@", 1)[0] if email else ""
        base = re.sub(r"[^A-Za-z0-9._-]+", "", local_part).strip("._-") or "user"
        candidate = base[:150]
        suffix = 1

        while User.objects.filter(username__iexact=candidate).exists():
            suffix_str = str(suffix)
            candidate = f"{base[: max(1, 150 - len(suffix_str) - 1)]}_{suffix_str}"
            suffix += 1

        return candidate


class UserMeSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "role",
            "phone_number",
            "designation",
            "department",
            "address",
        ]

    def get_role(self, obj):
        profile = getattr(obj, "profile", None)
        if profile:
            return profile.role
        return "admin" if obj.is_staff else "employee"

    def get_phone_number(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.phone_number if profile else ""

    def get_designation(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.designation if profile else ""

    def get_department(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.department if profile else ""

    def get_address(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.address if profile else ""


class UserUpdateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=["admin", "employee"], default="employee")
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    designation = serializers.CharField(required=False, allow_blank=True, max_length=120)
    department = serializers.CharField(required=False, allow_blank=True, max_length=120)
    address = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    def validate_email(self, value):
        email = value.strip().lower()
        user = self.context.get("user_instance")
        existing = User.objects.filter(email__iexact=email)
        if user is not None:
            existing = existing.exclude(pk=user.pk)
        if existing.exists():
            raise serializers.ValidationError("Email already exists.")
        return email

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        password = validated_data.pop("password", "")
        phone_number = validated_data.pop("phone_number", None)
        designation = validated_data.pop("designation", None)
        department = validated_data.pop("department", None)
        address = validated_data.pop("address", None)

        for field in ["email", "first_name", "last_name", "is_active"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        update_fields = [field for field in ["email", "first_name", "last_name", "is_active"] if field in validated_data]
        if password:
            instance.set_password(password)
            update_fields.append("password")
        if update_fields:
            instance.save(update_fields=update_fields)

        profile, _ = UserProfile.objects.get_or_create(
            user=instance,
            defaults={"role": "admin" if instance.is_staff else "employee"},
        )
        profile_fields = []
        if role is not None and profile.role != role:
            profile.role = role
            profile_fields.append("role")
        if phone_number is not None and profile.phone_number != phone_number:
            profile.phone_number = phone_number
            profile_fields.append("phone_number")
        if designation is not None and profile.designation != designation:
            profile.designation = designation
            profile_fields.append("designation")
        if department is not None and profile.department != department:
            profile.department = department
            profile_fields.append("department")
        if address is not None and profile.address != address:
            profile.address = address
            profile_fields.append("address")
        if profile_fields:
            profile.save(update_fields=profile_fields)

        desired_admin = role == "admin"
        auth_fields = []
        if instance.is_staff != desired_admin:
            instance.is_staff = desired_admin
            auth_fields.append("is_staff")
        if instance.is_superuser != desired_admin:
            instance.is_superuser = desired_admin
            auth_fields.append("is_superuser")
        if auth_fields:
            instance.save(update_fields=auth_fields)

        return instance


class AccountTargetPICSerializer(serializers.ModelSerializer):
    created_by_info = serializers.SerializerMethodField()

    class Meta:
        model = AccountTargetPIC
        fields = [
            "id",
            "pic_name",
            "phone_number",
            "created_at",
            "updated_at",
            "created_by_info",
        ]

    def get_created_by_info(self, obj):
        user = getattr(obj, "created_by", None)
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "username": user.username,
            "email": user.email,
        }


class AccountTargetCompanySerializer(serializers.ModelSerializer):
    pics = AccountTargetPICSerializer(many=True, read_only=True)
    created_by_info = serializers.SerializerMethodField()
    total_pics = serializers.SerializerMethodField()

    class Meta:
        model = AccountTargetCompany
        fields = [
            "id",
            "name",
            "location",
            "region",
            "created_at",
            "updated_at",
            "created_by_info",
            "total_pics",
            "pics",
        ]

    def get_created_by_info(self, obj):
        user = getattr(obj, "created_by", None)
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "username": user.username,
            "email": user.email,
        }

    def get_total_pics(self, obj):
        return obj.pics.count()


class AccountTargetRegistrationSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=255)
    pic_name = serializers.CharField(max_length=255)
    location = serializers.CharField(required=False, allow_blank=True, max_length=255)
    region = serializers.CharField(required=False, allow_blank=True, max_length=100)
    phone_number = serializers.CharField(max_length=50)

    def validate_company_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Company name is required.")
        return cleaned

    def validate_pic_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("PIC name is required.")
        return cleaned

    def validate_phone_number(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Phone number is required.")
        return cleaned

    def create(self, validated_data):
        user = self.context["request"].user
        company_name = validated_data["company_name"]
        location = (validated_data.get("location") or "").strip()
        region = (validated_data.get("region") or "").strip()

        company, created = AccountTargetCompany.objects.get_or_create(
            normalized_name=company_name.casefold(),
            defaults={
                "name": company_name,
                "location": location,
                "region": region,
                "created_by": user if getattr(user, "is_authenticated", False) else None,
            },
        )

        company_fields = []
        if not company.location and location:
            company.location = location
            company_fields.append("location")
        if not company.region and region:
            company.region = region
            company_fields.append("region")
        if company_fields:
            company.save(update_fields=company_fields)

        pic, pic_created = AccountTargetPIC.objects.get_or_create(
            company=company,
            phone_number=validated_data["phone_number"],
            defaults={
                "pic_name": validated_data["pic_name"],
                "created_by": user if getattr(user, "is_authenticated", False) else None,
            },
        )

        if not pic_created:
            raise serializers.ValidationError({
                "phone_number": "This phone number is already registered for the selected company.",
            })

        self.context["company_instance"] = company
        self.context["pic_instance"] = pic
        self.context["created_company"] = created
        return {"company": company, "pic": pic, "created_company": created}


class WishlistEntrySerializer(serializers.ModelSerializer):
    created_by_info = serializers.SerializerMethodField()

    class Meta:
        model = WishlistEntry
        fields = [
            "id",
            "company_name",
            "location",
            "created_at",
            "updated_at",
            "created_by_info",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by_info"]

    def get_created_by_info(self, obj):
        user = getattr(obj, "created_by", None)
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "username": user.username,
            "email": user.email,
        }

    def validate_company_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Company name is required.")
        return cleaned

    def validate_location(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Location is required.")
        return cleaned
