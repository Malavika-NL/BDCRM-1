from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead, Course, Enrollment

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