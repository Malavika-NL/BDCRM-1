import os

import psycopg
from django.core.management.base import BaseCommand, CommandError

from crm.contact_sync import upsert_contact_from_common_payload


class Command(BaseCommand):
    help = "Import existing contacts from the SalesPie and Marketing CRM PostgreSQL databases."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            choices=["all", "salespie", "marketing"],
            default="all",
            help="Which external source to import from.",
        )

    def handle(self, *args, **options):
        source = options["source"]
        imported = 0

        if source in {"all", "salespie"}:
            imported += self._import_salespie_contacts()
        if source in {"all", "marketing"}:
            imported += self._import_marketing_contacts()

        self.stdout.write(self.style.SUCCESS(f"Imported or updated {imported} contacts."))

    def _connect(self, dbname):
        try:
            return psycopg.connect(
                host=os.getenv("DATABASE_HOST", "127.0.0.1"),
                port=int(os.getenv("DATABASE_PORT", "5432")),
                dbname=dbname,
                user=os.getenv("DATABASE_USER", "postgres"),
                password=os.getenv("DATABASE_PASSWORD", ""),
            )
        except psycopg.Error as exc:
            raise CommandError(f"Could not connect to PostgreSQL database '{dbname}': {exc}") from exc

    def _import_salespie_contacts(self):
        conn = self._connect(os.getenv("SALESPIE_DATABASE_NAME", "salespie"))
        imported = 0

        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        source_contact_id,
                        name,
                        email,
                        mobile_number,
                        company_name,
                        designation,
                        region,
                        location,
                        is_verified
                    FROM sales_marketingcrmcontact
                    WHERE COALESCE(is_verified, false) = true
                    ORDER BY id ASC
                    """
                )
                for row in cursor.fetchall():
                    payload = {
                        "name": row[1] or "",
                        "email": row[2] or "",
                        "mobile_number": row[3] or "",
                        "company_name": row[4] or "",
                        "designation": row[5] or "",
                        "region": row[6] or "",
                        "location": row[7] or "",
                        "is_verified": bool(row[8]),
                    }
                    contact, created = upsert_contact_from_common_payload(payload)
                    if not contact.created_by_name:
                        type(contact).objects.filter(pk=contact.pk).update(created_by_name="SalesPie Sync")
                        contact.created_by_name = "SalesPie Sync"
                    imported += 1
                    self.stdout.write(
                        f"SalesPie {'created' if created else 'updated'}: "
                        f"{contact.person_name or contact.company_name or contact.email or contact.phone}"
                    )
        finally:
            conn.close()

        return imported

    def _import_marketing_contacts(self):
        conn = self._connect(os.getenv("MARKETING_DATABASE_NAME", "email_campaign"))
        imported = 0

        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        person_name,
                        email,
                        phone,
                        company_name,
                        designation,
                        region,
                        location,
                        is_verified
                    FROM email_campaign_contact
                    ORDER BY id ASC
                    """
                )
                for row in cursor.fetchall():
                    payload = {
                        "name": row[0] or "",
                        "email": row[1] or "",
                        "mobile_number": row[2] or "",
                        "company_name": row[3] or "",
                        "designation": row[4] or "",
                        "region": row[5] or "",
                        "location": row[6] or "",
                        "is_verified": bool(row[7]),
                    }
                    contact, created = upsert_contact_from_common_payload(payload)
                    if not contact.created_by_name:
                        type(contact).objects.filter(pk=contact.pk).update(created_by_name="Marketing CRM Sync")
                        contact.created_by_name = "Marketing CRM Sync"
                    imported += 1
                    self.stdout.write(
                        f"Marketing {'created' if created else 'updated'}: "
                        f"{contact.person_name or contact.company_name or contact.email or contact.phone}"
                    )
        finally:
            conn.close()

        return imported
