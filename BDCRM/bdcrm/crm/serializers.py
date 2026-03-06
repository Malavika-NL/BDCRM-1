from rest_framework import serializers
from .models import Lead, Course, Module, Lesson, Activity, Task, Tag, Company

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