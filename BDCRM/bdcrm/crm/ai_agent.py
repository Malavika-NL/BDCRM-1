"""
Autonomous AI Agent using Claude Tool Use.

Claude reads your CRM data, decides what to do,
and calls your functions automatically.

Nothing is hardcoded. Claude makes all decisions.

Usage:
    python manage.py run_agent
    python manage.py run_agent --loop
    python manage.py run_agent --loop --interval 300
"""

import json
import time
import logging
from datetime import timedelta

import anthropic
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, Sum, Count

from .models import (
    Lead, Activity, Task, Company, Tag,
    AILeadProfile, AIAlert, AIInteractionLog,
    ConsumptionPattern, BDMTarget
)
from .services import send_whatsapp_message

logger = logging.getLogger('ai_agent')


# ═══════════════════════════════════════════════════════
#  TOOLS — Functions that Claude can call
# ═══════════════════════════════════════════════════════

TOOLS = [
    {
        "name": "send_whatsapp",
        "description": (
            "Send a WhatsApp message to a lead. "
            "Use this for intros, follow-ups, thank-yous, "
            "reorder reminders, or any outreach."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {
                    "type": "integer",
                    "description": "The ID of the lead to message"
                },
                "message": {
                    "type": "string",
                    "description": "The message text to send. Keep under 50 words."
                },
                "purpose": {
                    "type": "string",
                    "description": (
                        "Why you are sending this. "
                        "Options: intro, followup, thankyou, reorder, rescue, general"
                    )
                }
            },
            "required": ["lead_id", "message", "purpose"]
        }
    },
    {
        "name": "create_task",
        "description": (
            "Create a follow-up task for a lead. "
            "Use when a lead needs attention or a specific action."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {
                    "type": "integer",
                    "description": "The lead ID"
                },
                "title": {
                    "type": "string",
                    "description": "Short task title (under 10 words)"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "Task priority level"
                },
                "due_in_hours": {
                    "type": "integer",
                    "description": "Hours from now when this task is due"
                }
            },
            "required": ["lead_id", "title", "priority", "due_in_hours"]
        }
    },
    {
        "name": "update_lead_status",
        "description": (
            "Move a lead to a different pipeline stage. "
            "Only do this when there is clear evidence to justify the move."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {
                    "type": "integer",
                    "description": "The lead ID"
                },
                "new_status": {
                    "type": "string",
                    "enum": ["new", "contacted", "negotiation", "won", "lost"],
                    "description": "The new pipeline stage"
                },
                "reason": {
                    "type": "string",
                    "description": "Why you are making this change"
                }
            },
            "required": ["lead_id", "new_status", "reason"]
        }
    },
    {
        "name": "create_alert",
        "description": (
            "Create an alert for the sales team to see in their dashboard. "
            "Use for churn risk, hot leads, anomalies, or important observations."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {
                    "type": "integer",
                    "description": "The lead ID. Use 0 if this is a general alert."
                },
                "title": {
                    "type": "string",
                    "description": "Short alert title"
                },
                "description": {
                    "type": "string",
                    "description": "What happened and why it matters"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high", "critical"],
                    "description": "How urgent this alert is"
                },
                "suggested_action": {
                    "type": "string",
                    "description": "What the sales team should do about this"
                }
            },
            "required": ["title", "description", "priority"]
        }
    },
    {
        "name": "log_activity",
        "description": (
            "Log a note or observation on a lead's activity timeline. "
            "Use to record your analysis or reasoning."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {
                    "type": "integer",
                    "description": "The lead ID"
                },
                "activity_type": {
                    "type": "string",
                    "enum": ["call", "email", "meeting", "note"],
                    "description": "Type of activity"
                },
                "summary": {
                    "type": "string",
                    "description": "Short one-line summary"
                },
                "description": {
                    "type": "string",
                    "description": "Detailed note or observation"
                }
            },
            "required": ["lead_id", "activity_type", "summary", "description"]
        }
    },
    {
        "name": "do_nothing",
        "description": (
            "Call this ONLY when you have reviewed everything "
            "and there is genuinely nothing more to do right now. "
            "This signals the end of your cycle."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "reason": {
                    "type": "string",
                    "description": "Brief explanation of why no more actions are needed"
                }
            },
            "required": ["reason"]
        }
    }
]


# ═══════════════════════════════════════════════════════
#  TOOL EXECUTION — What actually happens when Claude
#                    decides to call a function
# ═══════════════════════════════════════════════════════

def execute_tool(tool_name, tool_input):
    """
    Claude says: "call send_whatsapp with {lead_id: 3, message: 'Hi...'}"
    This function actually performs that action in your database.
    """
    try:
        if tool_name == "send_whatsapp":
            return _exec_send_whatsapp(tool_input)

        elif tool_name == "create_task":
            return _exec_create_task(tool_input)

        elif tool_name == "update_lead_status":
            return _exec_update_status(tool_input)

        elif tool_name == "create_alert":
            return _exec_create_alert(tool_input)

        elif tool_name == "log_activity":
            return _exec_log_activity(tool_input)

        elif tool_name == "do_nothing":
            return {
                "status": "ok",
                "message": tool_input.get("reason", "Nothing to do")
            }

        else:
            return {"error": f"Unknown tool: {tool_name}"}

    except Exception as e:
        logger.error(f"Tool execution error: {tool_name} - {e}")
        return {"error": str(e)}


def _exec_send_whatsapp(params):
    """Send a WhatsApp message to a lead."""
    lead_id = params["lead_id"]
    message = params["message"]
    purpose = params.get("purpose", "outreach")

    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return {"error": f"Lead {lead_id} not found"}

    if not lead.phone:
        return {"error": f"Lead '{lead.name}' has no phone number"}

    # Clean the phone number
    phone = str(lead.phone).strip()
    if not phone:
        return {"error": f"Lead '{lead.name}' has empty phone number"}

    # Send the actual message
    result = send_whatsapp_message(phone, message)

    if result.get("success"):
        # Record in activity timeline
        Activity.objects.create(
            lead=lead,
            activity_type='email',
            summary=f'🤖 Agent: {purpose}',
            description=f'[AI Agent] {message}'
        )

        # Record in AI interaction log
        AIInteractionLog.objects.create(
            lead=lead,
            interaction_type=f'agent_{purpose}',
            transcript=message,
            ai_summary=f'Autonomous {purpose} message sent by AI Agent',
            sentiment='neutral'
        )

        return {
            "status": "sent",
            "lead": lead.name,
            "purpose": purpose,
            "message_preview": message[:60]
        }
    else:
        return {
            "error": f"WhatsApp send failed: {result.get('error', 'Unknown error')}",
            "lead": lead.name
        }


def _exec_create_task(params):
    """Create a task for a lead."""
    try:
        lead = Lead.objects.get(id=params["lead_id"])
    except Lead.DoesNotExist:
        return {"error": f"Lead {params['lead_id']} not found"}

    due_hours = params.get("due_in_hours", 24)

    task = Task.objects.create(
        lead=lead,
        title=f"🤖 {params['title']}",
        description="Auto-created by AI Agent based on CRM analysis.",
        due_date=timezone.now() + timedelta(hours=due_hours),
        priority=params.get("priority", "medium")
    )

    return {
        "status": "created",
        "task_id": task.id,
        "lead": lead.name,
        "title": params['title'],
        "due_in_hours": due_hours
    }


def _exec_update_status(params):
    """Move a lead to a new pipeline stage."""
    try:
        lead = Lead.objects.get(id=params["lead_id"])
    except Lead.DoesNotExist:
        return {"error": f"Lead {params['lead_id']} not found"}

    old_status = lead.status
    new_status = params["new_status"]
    reason = params.get("reason", "AI Agent decision")

    # Safety: Don't allow moving to same status
    if old_status == new_status:
        return {
            "status": "skipped",
            "reason": f"Lead is already in '{old_status}'"
        }

    # Update the lead
    lead.status = new_status
    lead.save()

    # Log the change
    Activity.objects.create(
        lead=lead,
        activity_type='note',
        summary=f'🤖 Pipeline: {old_status} → {new_status}',
        description=f'[AI Agent] {reason}'
    )

    return {
        "status": "updated",
        "lead": lead.name,
        "from": old_status,
        "to": new_status,
        "reason": reason
    }


def _exec_create_alert(params):
    """Create an alert visible in the dashboard."""
    lead = None
    lead_id = params.get("lead_id", 0)

    if lead_id and lead_id > 0:
        try:
            lead = Lead.objects.get(id=lead_id)
        except Lead.DoesNotExist:
            lead = None

    alert = AIAlert.objects.create(
        alert_type='score_change',
        lead=lead,
        title=params["title"],
        description=params["description"],
        priority=params.get("priority", "medium"),
        suggested_action=params.get("suggested_action", "")
    )

    return {
        "status": "created",
        "alert_id": alert.id,
        "title": params["title"],
        "priority": params.get("priority", "medium")
    }


def _exec_log_activity(params):
    """Log a note on a lead's timeline."""
    try:
        lead = Lead.objects.get(id=params["lead_id"])
    except Lead.DoesNotExist:
        return {"error": f"Lead {params['lead_id']} not found"}

    Activity.objects.create(
        lead=lead,
        activity_type=params.get("activity_type", "note"),
        summary=params.get("summary", "🤖 Agent Note"),
        description=params.get("description", "")
    )

    return {
        "status": "logged",
        "lead": lead.name,
        "type": params.get("activity_type", "note")
    }


# ═══════════════════════════════════════════════════════
#  CRM SNAPSHOT — Reads your entire database into text
#                  so Claude can understand it
# ═══════════════════════════════════════════════════════

def build_crm_snapshot():
    """
    Reads your entire CRM and builds a JSON summary.
    This is what Claude sees when it starts thinking.
    """
    now = timezone.now()

    # ── Collect all active leads with their data ──
    leads_data = []

    active_leads = Lead.objects.exclude(
        status__in=['won', 'lost']
    ).order_by('-created_at')[:50]

    for lead in active_leads:
        # Last activity info
        last_activity = lead.activities.first()
        if last_activity:
            days_silent = (now - last_activity.created_at).days
            last_activity_desc = (
                f"{last_activity.activity_type}: "
                f"{last_activity.summary or last_activity.description[:60]} "
                f"({last_activity.created_at.strftime('%b %d')})"
            )
        else:
            days_silent = 999
            last_activity_desc = "No activities ever"

        # Task info
        pending_tasks = lead.tasks.filter(is_completed=False).count()
        overdue_tasks = lead.tasks.filter(
            is_completed=False,
            due_date__lt=now
        ).count()

        # AI profile
        profile = AILeadProfile.objects.filter(lead=lead).first()
        ai_score = profile.score if profile else 0
        churn_risk = profile.churn_risk if profile else 0

        # Recent activities (last 3)
        recent_acts = []
        for a in lead.activities.all()[:3]:
            recent_acts.append(
                f"{a.activity_type}: "
                f"{a.summary or a.description[:50]} "
                f"({a.created_at.strftime('%b %d')})"
            )

        # Check if agent already acted on this lead today
        agent_actions_today = Activity.objects.filter(
            lead=lead,
            summary__icontains='🤖',
            created_at__gte=now - timedelta(hours=24)
        ).count()

        leads_data.append({
            "id": lead.id,
            "name": lead.name,
            "company": lead.company,
            "phone": lead.phone if lead.phone else "NO_PHONE",
            "email": lead.email,
            "status": lead.status,
            "value": float(lead.value),
            "source": lead.source,
            "days_in_pipeline": (now - lead.created_at).days,
            "days_since_last_contact": days_silent,
            "total_activities": lead.activities.count(),
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
            "ai_score": ai_score,
            "churn_risk": round(churn_risk, 2),
            "last_activity": last_activity_desc,
            "recent_activities": recent_acts,
            "agent_actions_last_24h": agent_actions_today,
        })

    # ── Consumption / Reorder Alerts ──
    reorder_alerts = []
    try:
        for p in ConsumptionPattern.objects.select_related('company', 'product').all():
            if p.is_due():
                # Find a lead connected to this company
                connected_lead = Lead.objects.filter(
                    related_company=p.company
                ).exclude(phone='').exclude(phone__isnull=True).first()

                reorder_alerts.append({
                    "company": p.company.name,
                    "product": p.product.name,
                    "last_purchase": str(p.last_purchase_date),
                    "days_overdue": (now.date() - p.next_action_date()).days,
                    "connected_lead_id": connected_lead.id if connected_lead else None,
                    "connected_lead_name": connected_lead.name if connected_lead else "No lead found",
                    "connected_lead_phone": connected_lead.phone if connected_lead else "NO_PHONE",
                })
    except Exception as e:
        logger.error(f"Error reading consumption patterns: {e}")

    # ── BDM Targets ──
    targets = []
    try:
        for t in BDMTarget.objects.filter(status='active'):
            targets.append({
                "name": t.name,
                "type": t.target_type,
                "progress_percent": t.progress_percentage(),
                "target_leads": t.target_leads,
                "achieved_leads": t.achieved_leads,
                "target_revenue": float(t.target_revenue),
                "achieved_revenue": float(t.achieved_revenue),
            })
    except Exception as e:
        logger.error(f"Error reading BDM targets: {e}")

    # ── Overall CRM Stats ──
    all_leads = Lead.objects.all()
    pipeline_value = float(
        all_leads.exclude(status__in=['won', 'lost']).aggregate(
            total=Sum('value')
        )['total'] or 0
    )
    total_overdue = Task.objects.filter(
        is_completed=False,
        due_date__lt=now
    ).count()

    # ── Build the final snapshot ──
    snapshot = {
        "current_time": now.strftime("%Y-%m-%d %H:%M"),
        "overall_summary": {
            "total_active_leads": len(leads_data),
            "total_pipeline_value": pipeline_value,
            "total_overdue_tasks": total_overdue,
            "total_reorder_alerts": len(reorder_alerts),
            "total_active_bdm_targets": len(targets),
        },
        "leads": leads_data,
        "reorder_alerts": reorder_alerts,
        "bdm_targets": targets,
    }

    return json.dumps(snapshot, indent=2, default=str)


# ═══════════════════════════════════════════════════════
#  THE AGENT — Main class that runs the loop
# ═══════════════════════════════════════════════════════

SYSTEM_PROMPT = """You are an autonomous AI Sales Agent managing a B2B CRM system.

YOUR JOB:
You will receive a complete snapshot of the CRM database.
Analyze every single lead and take the RIGHT actions using the tools provided.
You are the ONLY person working. The sales team relies on you.

DECISION RULES:

1. NEW LEADS (status='new', 0 activities, has phone):
   → Send a warm WhatsApp intro message
   → Change status to 'contacted'

2. STALE LEADS (days_since_last_contact > 5, has phone):
   → Send a follow-up WhatsApp message
   → Create a follow-up task

3. LEADS WITH NO PENDING TASKS (pending_tasks = 0, days_since_last_contact > 3):
   → Create an appropriate task

4. HIGH CHURN RISK (churn_risk > 0.5):
   → Create a critical alert
   → If has phone, send a rescue message
   → Create an urgent task

5. PIPELINE ADVANCEMENT:
   → new → contacted: When total_activities >= 1
   → contacted → negotiation: When ai_score >= 60 AND total_activities >= 5
   → NEVER auto-move to 'won' or 'lost'

6. REORDER ALERTS:
   → If connected_lead has a phone, send a reorder reminder
   → Create a task to follow up

7. OVERDUE TASKS (overdue_tasks > 0):
   → Create an alert about the overdue situation

SAFETY RULES:
- Do NOT act on leads where agent_actions_last_24h > 0 (already handled today)
- Do NOT send messages to leads where phone = "NO_PHONE"
- Keep all WhatsApp messages under 40 words
- Messages must sound human and warm, never robotic
- Do NOT move leads to 'won' or 'lost' — only create alerts

WHEN DONE:
After reviewing ALL leads and taking all needed actions, call do_nothing.
"""


class CRMAgent:
    """
    The main AI Agent class.

    How it works:
    1. Reads your entire CRM database
    2. Sends it to Claude along with a list of tools (functions)
    3. Claude analyzes and decides which tools to call
    4. Agent executes those tool calls
    5. Feeds results back to Claude
    6. Claude decides next action (or stops)
    7. Repeat until Claude calls do_nothing
    """

    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=settings.ANTHROPIC_API_KEY
        )
        self.model = "claude-haiku-4-5-20251001"
        self.max_actions = 20       # Safety: max actions per cycle
        self.actions_taken = []     # Log of everything done

    def run(self):
        """
        Main entry point. Runs one complete agent cycle.
        Returns a list of all actions taken.
        """
        print("\n🤖 AI AGENT STARTING")
        print("=" * 60)

        # ── Step 1: Read the CRM ──
        print("\n📖 Reading CRM database...")
        snapshot = build_crm_snapshot()

        # Parse to show summary
        try:
            data = json.loads(snapshot)
            summary = data.get("overall_summary", {})
            print(f"   Active Leads:    {summary.get('total_active_leads', 0)}")
            print(f"   Pipeline Value:  ${summary.get('total_pipeline_value', 0):,.0f}")
            print(f"   Overdue Tasks:   {summary.get('total_overdue_tasks', 0)}")
            print(f"   Reorder Alerts:  {summary.get('total_reorder_alerts', 0)}")
        except Exception:
            print("   Data loaded.")

        # ── Step 2: Build the initial message ──
        messages = [
            {
                "role": "user",
                "content": (
                    "Here is the current state of our CRM. "
                    "Analyze every lead and take all necessary actions.\n\n"
                    f"{snapshot}\n\n"
                    "Go through each lead systematically. "
                    "Take action where needed. "
                    "When you are completely done, call do_nothing."
                )
            }
        ]

        # ── Step 3: Agent loop ──
        action_count = 0

        while action_count < self.max_actions:
            print(f"\n🧠 Claude is thinking... (action {action_count + 1}/{self.max_actions})")

            try:
                # Call Claude with tools
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=4096,
                    system=SYSTEM_PROMPT,
                    tools=TOOLS,
                    messages=messages
                )
            except anthropic.APIError as e:
                print(f"\n❌ Claude API Error: {e}")
                break
            except Exception as e:
                print(f"\n❌ Unexpected Error: {e}")
                break

            # ── Check what Claude wants to do ──

            if response.stop_reason == "tool_use":
                # Claude wants to call one or more tools
                tool_results = []

                for block in response.content:
                    if block.type == "tool_use":
                        tool_name = block.name
                        tool_input = block.input
                        tool_id = block.id

                        # Check for the stop signal
                        if tool_name == "do_nothing":
                            reason = tool_input.get("reason", "Cycle complete")
                            print(f"\n✅ Agent finished: {reason}")
                            self._print_summary()
                            return self.actions_taken

                        # Execute the tool
                        input_preview = json.dumps(tool_input, default=str)
                        if len(input_preview) > 120:
                            input_preview = input_preview[:120] + "..."
                        print(f"   🔧 {tool_name}({input_preview})")

                        result = execute_tool(tool_name, tool_input)

                        result_preview = json.dumps(result, default=str)
                        if len(result_preview) > 100:
                            result_preview = result_preview[:100] + "..."
                        
                        status_icon = "✓" if result.get("status") else "✗"
                        print(f"      {status_icon} {result_preview}")

                        # Record the action
                        self.actions_taken.append({
                            "tool": tool_name,
                            "input": tool_input,
                            "result": result,
                        })
                        action_count += 1

                        # Prepare the result to send back to Claude
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_id,
                            "content": json.dumps(result, default=str)
                        })

                # Feed the results back to Claude
                # so it can decide what to do next
                messages.append({
                    "role": "assistant",
                    "content": response.content
                })
                messages.append({
                    "role": "user",
                    "content": tool_results
                })

            elif response.stop_reason == "end_turn":
                # Claude finished with a text response (no more tools)
                text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        text = block.text
                        break

                if text:
                    print(f"\n💬 Agent says: {text[:300]}")
                else:
                    print("\n✅ Agent completed.")
                break

            else:
                # Unexpected stop reason
                print(f"\n⚠️ Unexpected stop_reason: {response.stop_reason}")
                break

        # If we hit max_actions, print warning
        if action_count >= self.max_actions:
            print(f"\n⚠️ Reached max actions limit ({self.max_actions})")

        self._print_summary()
        return self.actions_taken

    def _print_summary(self):
        """Print a summary of everything the agent did."""
        print("\n" + "=" * 60)
        print(f"📊 AGENT CYCLE SUMMARY")
        print(f"   Total actions: {len(self.actions_taken)}")

        if not self.actions_taken:
            print("   No actions were needed.")
            print("=" * 60)
            return

        # Count by tool type
        counts = {}
        for action in self.actions_taken:
            tool = action["tool"]
            counts[tool] = counts.get(tool, 0) + 1

        print("\n   Breakdown:")
        for tool_name, count in sorted(counts.items()):
            print(f"   • {tool_name}: {count}")

        # Show errors if any
        errors = [
            a for a in self.actions_taken
            if a.get("result", {}).get("error")
        ]
        if errors:
            print(f"\n   ⚠️ Errors: {len(errors)}")
            for err in errors:
                print(f"      • {err['tool']}: {err['result']['error'][:80]}")

        print("=" * 60)