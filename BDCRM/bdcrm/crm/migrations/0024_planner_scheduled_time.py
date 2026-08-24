from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('crm', '0023_activityplanner_source_project')]

    operations = [
        migrations.AddField(model_name='plannertask', name='scheduled_time', field=models.TimeField(default='09:00')),
        migrations.AddField(model_name='plannercallassignment', name='scheduled_time', field=models.TimeField(default='09:00')),
    ]
