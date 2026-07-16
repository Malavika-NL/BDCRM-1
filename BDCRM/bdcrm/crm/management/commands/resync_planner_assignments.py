from django.core.management.base import BaseCommand, CommandError

from crm.contact_sync import send_assignment_to_peer
from crm.models import ActivityPlanner, PlannerCallAssignment


class Command(BaseCommand):
    help = "Re-send existing BDCRM planner assignments to Marketing CRM."

    def add_arguments(self, parser):
        parser.add_argument("--planner-id", type=int, help="Sync only one planner.")
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report how many assignments would be sent without posting them.",
        )

    def handle(self, *args, **options):
        assignments = PlannerCallAssignment.objects.select_related(
            "contact", "assigned_user", "member_plan__planner"
        ).order_by("id")
        planner_id = options.get("planner_id")
        if planner_id:
            if not ActivityPlanner.objects.filter(pk=planner_id).exists():
                raise CommandError(f"Planner {planner_id} does not exist.")
            assignments = assignments.filter(member_plan__planner_id=planner_id)

        assignments = list(assignments)
        if options["dry_run"]:
            self.stdout.write(f"Would sync {len(assignments)} planner assignments.")
            return

        synced = 0
        skipped = 0
        for assignment in assignments:
            if not assignment.assigned_user_id or not assignment.assigned_user.email:
                skipped += 1
                continue
            send_assignment_to_peer(
                assignment.contact,
                assignment.assigned_user,
                assignment,
                assignment.member_plan.planner.name,
            )
            synced += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Queued {synced} planner assignments for Marketing CRM; skipped {skipped} without a user email."
            )
        )
