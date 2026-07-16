from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("crm", "0021_wishlistentry")]

    operations = [
        migrations.AddField(
            model_name="contact",
            name="source_project",
            field=models.CharField(blank=True, default="", max_length=30),
        ),
        migrations.AddField(
            model_name="contact",
            name="source_contact_id",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="contact",
            name="source_owner_name",
            field=models.CharField(blank=True, default="", max_length=150),
        ),
        migrations.AddField(
            model_name="contact",
            name="source_owner_email",
            field=models.EmailField(blank=True, default="", max_length=254),
        ),
    ]
