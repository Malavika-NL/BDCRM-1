# crm/autonomous_agent.py
import json
from django.utils import timezone
from datetime import timedelta
from .models import Lead, Task, AIAlert, ConsumptionPattern, AIInteractionLog
from .services import send_whatsapp_message # Assuming your whatsapp function is here
from .ai_helper import ask_ai_json

class ChiefAIAgent:
    def __init__(self):
        self.now = timezone.now()

    def run_cycle(self):
        """The main function that runs every hour 24/7."""
        print(f"🤖 [System] Waking up AI Agent at {self.now}...")
        
        # 1. THE EYES: Gather Current System State
        context = self._gather_system_context()
        
        # If there's nothing to do, go back to sleep
        if not context['needs_attention']:
            print("💤 [System] Nothing to do. Going back to sleep.")
            return

        # 2. THE BRAIN: Ask Claude what to do
        decisions = self._ask_claude_for_decisions(context)

        # 3. THE HANDS: Execute the Actions
        if decisions:
            self._execute_actions(decisions)

    def _gather_system_context(self):
        """Pulls all pending issues, ghosted leads, and due orders."""
        context = {
            "needs_attention": False,
            "stale_leads": [],
            "due_consumptions": [],
            "overdue_tasks": []
        }

        # Find High Value Leads ignored for > 7 days
        seven_days_ago = self.now - timedelta(days=7)
        stale_leads = Lead.objects.filter(value__gte=10000, status__in=['mql', 'sql', 'negotiation'], updated_at__lt=seven_days_ago)[:5]
        for lead in stale_leads:
            context["stale_leads"].append({"id": lead.id, "name": lead.name, "company": lead.company, "value": float(lead.value), "status": lead.status})
            context["needs_attention"] = True

        # Find Reorders Due based on your PDCA notes
        due_patterns = ConsumptionPattern.objects.all()
        for p in due_patterns:
            if p.is_due():
                context["due_consumptions"].append({
                    "company_id": p.company.id, "company_name": p.company.name, 
                    "product": p.product.name, "days_overdue": (self.now.date() - p.next_action_date()).days
                })
                context["needs_attention"] = True

        return context

    def _ask_claude_for_decisions(self, context):
        """Feeds data to Claude and forces it to output functional JSON commands."""
        
        system_prompt = """You are the Autonomous Chief Revenue Officer AI. 
        Analyze the provided CRM data and decide on the best actions to take.
        
        You have 3 tools available to you:
        1. "create_task": Assigns a task to a human sales rep.
        2. "send_whatsapp": Directly sends a message to the lead/customer.
        3. "create_alert": Sends a notification to the manager's dashboard.
        
        You must output ONLY a raw JSON list of action objects."""

        user_prompt = f"""
        CURRENT SYSTEM STATE:
        {json.dumps(context, indent=2)}

        Decide what to do. Return ONLY a JSON array matching this exact format:
        [
            {{
                "tool": "create_task",
                "lead_id": 123,
                "title": "Call this guy",
                "description": "He is overdue for Ribbon reorder",
                "priority": "high"
            }},
            {{
                "tool": "send_whatsapp",
                "phone": "+919876543210",
                "message": "Hi [Name], running low on labels? Let me know!"
            }},
            {{
                "tool": "create_alert",
                "alert_type": "ghost_lead",
                "title": "High Value Deal Stalling",
                "description": "Company X has been quiet for 10 days."
            }}
        ]
        """

        result = ask_ai_json(user_prompt, system_prompt=system_prompt)
        if result["success"]:
            return result["data"]
        else:
            print("❌ AI Failed to decide:", result.get("error"))
            return []

    def _execute_actions(self, decisions):
        """Routes the AI's JSON output into actual Django ORM commands."""
        print(f"⚡ Executing {len(decisions)} autonomous actions...")
        
        for action in decisions:
            tool = action.get("tool")
            
            try:
                if tool == "create_task":
                    lead = Lead.objects.get(id=action['lead_id'])
                    Task.objects.create(
                        lead=lead,
                        title=action['title'],
                        description=action.get('description', ''),
                        priority=action.get('priority', 'medium'),
                        due_date=self.now + timedelta(days=1)
                    )
                    print(f"✅ Created Task for Lead ID {lead.id}")

                elif tool == "send_whatsapp":
                    # Warning: Make sure your AI has the lead's actual phone number
                    # Better approach: pass lead_id, fetch phone here, then send.
                    phone = action.get('phone')
                    msg = action.get('message')
                    if phone and msg:
                        send_whatsapp_message(phone, msg)
                        print(f"✅ Sent WhatsApp to {phone}")

                elif tool == "create_alert":
                    AIAlert.objects.create(
                        alert_type=action.get('alert_type', 'stagnant_deal'),
                        title=action['title'],
                        description=action['description'],
                        priority="high",
                        is_read=False
                    )
                    print(f"✅ Created System Alert: {action['title']}")
                    
            except Exception as e:
                print(f"❌ Failed to execute action {action}: {str(e)}")