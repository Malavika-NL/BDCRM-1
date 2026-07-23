from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("crm", "0025_alter_contact_tenant_company_id"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE contacts
                    ADD COLUMN IF NOT EXISTS tenant_id bigint;
                UPDATE contacts SET tenant_id = 1 WHERE tenant_id IS NULL;
                ALTER TABLE contacts ALTER COLUMN tenant_id SET DEFAULT 1;
                ALTER TABLE contacts ALTER COLUMN tenant_id SET NOT NULL;
                CREATE INDEX IF NOT EXISTS contacts_tenant_id_idx
                    ON contacts (tenant_id);
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
