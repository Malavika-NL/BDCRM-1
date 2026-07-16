from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("crm", "0022_contact_sync_metadata")]

    operations = [
        migrations.AddField(
            model_name="activityplanner",
            name="source_project",
            field=models.CharField(default="all", max_length=30),
        ),
    ]
