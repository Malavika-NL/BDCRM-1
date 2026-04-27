"""
Django management command to run the AI Agent.

Usage:
    python manage.py run_agent                    # Run once
    python manage.py run_agent --loop             # Run forever (every 2 min)
    python manage.py run_agent --loop --interval 300  # Every 5 minutes
"""

import time
from django.core.management.base import BaseCommand
from crm.ai_agent import CRMAgent


class Command(BaseCommand):
    help = 'Run the autonomous AI Agent'

    def add_arguments(self, parser):
        parser.add_argument(
            '--loop',
            action='store_true',
            help='Run continuously as a daemon'
        )
        parser.add_argument(
            '--interval',
            type=int,
            default=120,
            help='Seconds between cycles in loop mode (default: 120)'
        )

    def handle(self, *args, **options):

        if options['loop']:
            interval = options['interval']
            self.stdout.write(
                self.style.SUCCESS(
                    f"\n{'=' * 60}"
                    f"\n🤖 AI AGENT — DAEMON MODE"
                    f"\n   Interval: every {interval} seconds"
                    f"\n   Press Ctrl+C to stop"
                    f"\n{'=' * 60}\n"
                )
            )

            cycle = 0
            try:
                while True:
                    cycle += 1
                    self.stdout.write(
                        f"\n{'─' * 40}"
                        f"\n⏱  Cycle #{cycle} at {time.strftime('%H:%M:%S')}"
                    )

                    # Create a fresh agent each cycle
                    agent = CRMAgent()
                    actions = agent.run()

                    self.stdout.write(
                        f"\n   Cycle #{cycle} complete: "
                        f"{len(actions)} actions taken"
                    )
                    self.stdout.write(
                        f"\n⏳ Sleeping {interval} seconds...\n"
                    )
                    time.sleep(interval)

            except KeyboardInterrupt:
                self.stdout.write(
                    self.style.WARNING(
                        f"\n\n🛑 Agent stopped after {cycle} cycles.\n"
                    )
                )
        else:
            # Single run
            self.stdout.write(
                self.style.SUCCESS(
                    "\n🤖 AI AGENT — Single Execution\n"
                )
            )

            agent = CRMAgent()
            actions = agent.run()

            self.stdout.write(
                self.style.SUCCESS(
                    f"\n✅ Done. {len(actions)} actions taken.\n"
                )
            )