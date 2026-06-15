from django.db.models.signals import post_save
from django.dispatch import receiver
from .contact_sync import send_contact_to_peer
from .models import Lead, Course, Enrollment, Contact


@receiver(post_save, sender=Contact)
def sync_contact_after_save(sender, instance, **kwargs):
    send_contact_to_peer(instance)

@receiver(post_save, sender=Lead)
def auto_enroll_workflow(sender, instance, created, **kwargs):
    """
    AUTOMATION:
    When a NEW Lead is saved (by AI or Form), this runs immediately.
    """
    if created:
        print(f"⚡ AUTOMATION TRIGGERED: New Lead '{instance.name}' detected.")
        
        # Logic: Find the first available Course to enroll them in.
        # (You can change this logic to find a specific course by title)
        default_course = Course.objects.first()
        
        if default_course:
            Enrollment.objects.create(lead=instance, course=default_course)
            print(f"✅ ACTION: Enrolled {instance.name} into '{default_course.title}'")
            
            # OPTIONAL: You could create an automated 'Task' here too
            # Task.objects.create(lead=instance, title="Follow up on Enrollment", ...)
        else:
            print("⚠️ No Course found to enroll the lead.")
            
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Lead, LeadBusinessMeta

@receiver(post_save, sender=Lead)
def auto_update_customer_lifecycle(sender, instance, created, **kwargs):
    """
    If a Lead is marked as 'WON', automatically move them to 'Current Customer'
    and log the date.
    """
    if not created and instance.status == 'won':
        # Get or Create the Meta profile
        meta, _ = LeadBusinessMeta.objects.get_or_create(lead=instance)
        
        # Only update if they aren't already a current customer
        if meta.lifecycle_type != 'current':
            meta.lifecycle_type = 'current'
            meta.last_purchase_date = timezone.now().date()
            meta.last_purchase_value = instance.value
            meta.notes += f"\n[System]: Converted to Current Customer on {timezone.now().date()}"
            meta.save()
            print(f"✅ Auto-Promoted {instance.name} to Current Customer.")
            
from .models import CampaignResponse, Task

@receiver(post_save, sender=CampaignResponse)
def auto_create_sales_task(sender, instance, created, **kwargs):
    """
    If a Campaign Response is 'Interested' or 'Demo Requested',
    create a high-priority Task for the Sales Rep.
    """
    if created and instance.response_type in ['interested', 'demo_requested', 'price_requested']:
        
        # Determine Priority
        priority = 'high' if instance.response_type == 'demo_requested' else 'medium'
        
        Task.objects.create(
            lead=instance.lead,
            title=f"🔥 Hot Lead: {instance.response_type.replace('_', ' ').title()}",
            description=f"Campaign: {instance.workspace.name}\nResponse: {instance.response_text}",
            due_date=timezone.now() + timezone.timedelta(hours=24), # Must act within 24 hours
            priority=priority,
            is_completed=False
        )
        print(f"✅ Created Sales Task for {instance.lead.name}")
