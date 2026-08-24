from django.db import migrations


def ensure_contact_created_by_column(apps, schema_editor):
    """Repair databases where migration history was recorded without this column."""
    Contact = apps.get_model('crm', 'Contact')
    table_name = Contact._meta.db_table
    existing_columns = {
        column.name for column in schema_editor.connection.introspection.get_table_description(
            schema_editor.connection.cursor(), table_name
        )
    }
    if 'created_by_id' not in existing_columns:
        schema_editor.add_field(Contact, Contact._meta.get_field('created_by'))


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0024_planner_scheduled_time'),
    ]

    operations = [
        migrations.RunPython(ensure_contact_created_by_column, migrations.RunPython.noop),
    ]
