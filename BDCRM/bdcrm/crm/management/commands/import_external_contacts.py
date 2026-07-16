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
        parser.add_argument(
            "--verified-only",
            action="store_true",
            help="Import only contacts verified in their source CRM.",
        )

    def handle(self, *args, **options):
        source = options["source"]
        imported = 0

        if source in {"all", "salespie"}:
            imported += self._import_salespie_contacts(options["verified_only"])
        if source in {"all", "marketing"}:
            imported += self._import_marketing_contacts(options["verified_only"])

        self.stdout.write(self.style.SUCCESS(f"Imported or updated {imported} contacts."))

    def _connect(self, dbname, prefix):
        try:
            return psycopg.connect(
                host=os.getenv(f"{prefix}_DATABASE_HOST", os.getenv("DATABASE_HOST", "127.0.0.1")),
                port=int(os.getenv(f"{prefix}_DATABASE_PORT", os.getenv("DATABASE_PORT", "5432"))),
                dbname=dbname,
                user=os.getenv(f"{prefix}_DATABASE_USER", os.getenv("DATABASE_USER", "postgres")),
                password=os.getenv(f"{prefix}_DATABASE_PASSWORD", os.getenv("DATABASE_PASSWORD", "")),
            )
        except psycopg.Error as exc:
            raise CommandError(f"Could not connect to PostgreSQL database '{dbname}': {exc}") from exc

    def _import_salespie_contacts(self, verified_only=False):
        conn = self._connect(
            os.getenv("SALESPIE_DATABASE_NAME", "Salespie_Original"),
            "SALESPIE",
        )
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
                    {where_clause}
                    ORDER BY id ASC
                    """.format(where_clause="WHERE is_verified = TRUE" if verified_only else "")
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
                        "source_project": "salespie",
                        "source_contact_id": row[0] or "",
                        "source_owner_name": "SalesPie Sync",
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

        # Native SalesPie account data is verified business data.  It was not
        # included by the old importer, which only read SalesPie's mirror of
        # Marketing CRM contacts.
        imported += self._import_salespie_native_contacts(verified_only)
        return imported

    def _import_salespie_native_contacts(self, verified_only=False):
        conn = self._connect(
            os.getenv("SALESPIE_DATABASE_NAME", "Salespie_Original"),
            "SALESPIE",
        )
        imported = 0

        try:
            with conn.cursor() as cursor:
                # Each account's PIC is a contact in its own right.
                cursor.execute(
                    """
                    SELECT
                        account.id, account.pic, account.email_id,
                        account.mobile_number, account.account_name,
                        account.designation, account.region, account.location,
                        account.address, account.vertical,
                        TRIM(CONCAT_WS(' ', owner.first_name, owner.last_name)),
                        owner.username, owner.email
                    FROM sales_addaccountdata AS account
                    LEFT JOIN sales_user AS owner ON owner.id = account.user_id
                    WHERE COALESCE(account.pic, '') <> ''
                      AND (COALESCE(account.email_id, '') <> ''
                           OR COALESCE(account.mobile_number, '') <> '')
                    ORDER BY account.id ASC
                    """
                )
                account_rows = cursor.fetchall()

                cursor.execute(
                    """
                    SELECT
                        contact.id, contact.name, contact.email_id,
                        contact.mobile_no, account.account_name,
                        contact.designation, account.region, account.location,
                        account.address, account.vertical,
                        TRIM(CONCAT_WS(' ', owner.first_name, owner.last_name)),
                        owner.username, owner.email
                    FROM sales_contact AS contact
                    INNER JOIN sales_addaccountdata AS account
                      ON account.id = contact.add_account_data_id
                    LEFT JOIN sales_user AS owner ON owner.id = account.user_id
                    WHERE COALESCE(contact.name, '') <> ''
                      AND (COALESCE(contact.email_id, '') <> ''
                           OR COALESCE(contact.mobile_no, '') <> '')
                    ORDER BY contact.id ASC
                    """
                )
                pic_rows = cursor.fetchall()

                for prefix, rows in (("account", account_rows), ("contact", pic_rows)):
                    for row in rows:
                        owner_name = row[10] or row[11] or row[12] or "SalesPie"
                        contact, created = upsert_contact_from_common_payload({
                            "name": row[1] or "",
                            "email": row[2] or "",
                            "mobile_number": row[3] or "",
                            "company_name": row[4] or "",
                            "designation": row[5] or "",
                            "region": row[6] or "",
                            "location": row[7] or "",
                            "is_verified": True,
                            "source_project": "salespie",
                            # Native SalesPie accounts are authoritative even
                            # when their contact was already mirrored into
                            # Marketing CRM.
                            "force_source_project": "salespie",
                            "source_contact_id": f"salespie-{prefix}-{row[0]}",
                            "source_owner_name": owner_name,
                            "source_owner_email": row[12] or "",
                        })
                        if not contact.created_by_name:
                            type(contact).objects.filter(pk=contact.pk).update(created_by_name=owner_name)
                        imported += 1
                        self.stdout.write(
                            f"SalesPie {'created' if created else 'updated'}: "
                            f"{contact.person_name or contact.company_name or contact.email or contact.phone}"
                        )
        finally:
            conn.close()

        return imported

    def _import_marketing_contacts(self, verified_only=False):
        conn = self._connect(
            os.getenv("MARKETING_DATABASE_NAME", "email_campaign"),
            "MARKETING",
        )
        imported = 0

        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        contact.id,
                        contact.person_name,
                        contact.email,
                        contact.phone,
                        contact.company_name,
                        contact.designation,
                        contact.region,
                        contact.location,
                        contact.is_verified,
                        TRIM(CONCAT_WS(' ', creator."firstName", creator."lastName")),
                        creator.email
                    FROM email_campaign_contact AS contact
                    LEFT JOIN email_campaign_user AS creator
                      ON creator.id = contact.created_by_id
                    {where_clause}
                    ORDER BY contact.id ASC
                    """.format(where_clause="WHERE is_verified = TRUE" if verified_only else "")
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
                        "source_project": "marketing_crm",
                        "source_contact_id": str(row[0]),
                        "source_owner_name": row[9] or row[10] or "Marketing CRM",
                        "source_owner_email": row[10] or "",
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
