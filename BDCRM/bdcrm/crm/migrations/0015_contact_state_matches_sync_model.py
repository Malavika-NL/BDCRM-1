from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("crm", "0014_restore_contacts_table"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.RemoveField(
                    model_name="contact",
                    name="name",
                ),
                migrations.AddField(
                    model_name="contact",
                    name="company_name",
                    field=models.CharField(blank=True, default="", max_length=255),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="designation",
                    field=models.CharField(blank=True, max_length=255, null=True),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="is_verified",
                    field=models.BooleanField(default=False),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="location",
                    field=models.CharField(blank=True, default="", max_length=100),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="person_name",
                    field=models.CharField(blank=True, max_length=255, null=True),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="region",
                    field=models.CharField(blank=True, max_length=100, null=True),
                ),
                migrations.AddField(
                    model_name="contact",
                    name="vertical",
                    field=models.CharField(blank=True, max_length=100, null=True),
                ),
            ],
        ),
    ]
