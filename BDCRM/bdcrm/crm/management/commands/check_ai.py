from django.conf import settings
from django.core.management.base import BaseCommand

from crm.ai_helper import ask_ai, get_ai_provider


class Command(BaseCommand):
    help = "Check configured AI provider and test a small generation."

    def handle(self, *args, **options):
        provider = get_ai_provider()
        self.stdout.write(f"Provider: {provider}")

        if provider == "none":
            self.stderr.write(
                self.style.ERROR(
                    "No AI provider configured. Set ANTHROPIC_API_KEY or GOOGLE_API_KEY in BDCRM/bdcrm/.env"
                )
            )
            return

        if provider == "anthropic":
            self.stdout.write(f"Model: {getattr(settings, 'ANTHROPIC_MODEL', '')}")
        else:
            self.stdout.write(f"Model: {getattr(settings, 'GEMINI_MODEL', '')}")

        result = ask_ai("Reply with exactly OK", system_prompt="You are strict. Reply only OK.", max_tokens=16)
        if result.get("success"):
            self.stdout.write(self.style.SUCCESS(f"AI OK via {result.get('provider')}: {result.get('text', '').strip()}"))
        else:
            self.stderr.write(self.style.ERROR(f"AI check failed: {result.get('error')}"))
