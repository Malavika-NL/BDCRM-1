from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("crm", "0016_contact_created_by"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    "ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_by_name varchar(150) NOT NULL DEFAULT '';",
                    "ALTER TABLE contacts DROP COLUMN IF EXISTS created_by_name;",
                ),
            ],
            state_operations=[
                migrations.RemoveField(
                    model_name="contact",
                    name="created_by",
                ),
                migrations.AddField(
                    model_name="contact",
                    name="created_by_name",
                    field=models.CharField(blank=True, default="", max_length=150),
                ),
            ],
        ),
    ]
