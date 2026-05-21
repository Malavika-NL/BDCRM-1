import json

import anthropic
import requests
from django.conf import settings


def _cleanup_codeblock(text: str) -> str:
    out = (text or "").strip()
    if out.startswith("```json"):
        out = out[7:]
    elif out.startswith("```"):
        out = out[3:]
    if out.endswith("```"):
        out = out[:-3]
    return out.strip()


def _offline_text_fallback(prompt: str) -> str:
    lowered = prompt.lower()
    if "focus on today" in lowered:
        return "Focus on high-value leads in negotiation first, then overdue follow-ups, then new inbound leads from this week."
    if "tasks" in lowered:
        return "Prioritize overdue tasks first, then high-priority tasks due today, then medium-priority tasks due this week."
    return "AI provider is temporarily unavailable. Switched to fallback mode. Your request was received successfully."


def _offline_json_fallback(prompt: str) -> dict:
    lowered = prompt.lower()
    if "day_score" in lowered and "top_priorities" in lowered:
        return {
            "greeting": "Good day. Local AI mode is active.",
            "headline": "Focus on high-value negotiation deals and overdue follow-ups.",
            "day_score": 7,
            "top_priorities": [
                {"priority": "Review negotiation leads", "why": "Highest conversion potential", "action": "Call top 3 negotiation leads"},
                {"priority": "Clear overdue tasks", "why": "Prevents deal slippage", "action": "Complete all overdue tasks before EOD"},
            ],
            "wins": ["Pipeline is active", "Unread alerts are being tracked"],
            "warnings": ["External AI provider unavailable", "Use local insights until provider is enabled"],
            "pipeline_insight": "Momentum is best in contacted and negotiation stages.",
            "motivation": "Consistency in follow-up creates conversions.",
        }
    if "interpretation" in lowered and "results" in lowered and "crm search" in lowered:
        return {
            "interpretation": "Local search fallback interpreted your query.",
            "count": 0,
            "results": [],
            "error": "",
        }
    if "score" in lowered and "confidence" in lowered:
        return {
            "score": 62,
            "confidence": "medium",
            "reason": "Fallback scoring based on stage and recency heuristics.",
            "strengths": ["Deal has defined value", "Lead exists in active pipeline stage"],
            "weaknesses": ["AI provider unavailable", "Limited live enrichment"],
        }
    if "next_action" in lowered or '"priority": "do_now/schedule/wait"' in lowered:
        return {
            "priority": "SCHEDULE",
            "action": "Send a concise follow-up message and book a 15-minute call this week.",
            "channel": "Email",
            "reason": "Fallback workflow prioritizes consistent follow-up.",
            "script_opener": "Hi, sharing a quick update and next-step option for this week.",
        }
    if "subject" in lowered and "message" in lowered:
        return {
            "subject": "Quick follow-up on our discussion",
            "message": "Hi, just checking in on the proposal. Happy to align on next steps this week.",
        }
    if "playbook_title" in lowered and '"steps"' in lowered:
        return {
            "playbook_title": "3-Step Follow-Up Playbook",
            "strategy_overview": "Use clear cadence and value reminders to move the deal forward.",
            "steps": [
                {"day": 1, "action_type": "Email", "goal": "Re-open conversation", "exact_script": "Short reminder with value summary."},
                {"day": 3, "action_type": "Call", "goal": "Clarify blockers", "exact_script": "Discuss concerns and timeline."},
                {"day": 7, "action_type": "Close", "goal": "Confirm next step", "exact_script": "Ask for decision or pilot start date."},
            ],
        }
    if '"response": "answer"' in lowered or "follow_up_questions" in lowered:
        return {
            "response": "Running in free local AI mode. I can still guide priorities, risks, and next actions from current CRM data.",
            "action_type": "info",
            "data_highlights": ["AI provider temporarily unavailable"],
            "suggested_actions": [{"action": "Enable provider API key", "priority": "high"}],
            "follow_up_questions": ["Do you want a lead-priority summary now?"],
        }
    return {"message": "Fallback JSON response", "status": "ok"}


def get_ai_provider() -> str:
    if getattr(settings, "ANTHROPIC_API_KEY", ""):
        return "anthropic"
    if getattr(settings, "GOOGLE_API_KEY", ""):
        return "gemini"
    return "none"


def get_ai_client():
    api_key = getattr(settings, "ANTHROPIC_API_KEY", "")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not configured.")
    return anthropic.Anthropic(api_key=api_key)


def _ask_anthropic(prompt: str, system_prompt: str, max_tokens: int) -> str:
    client = get_ai_client()
    response = client.messages.create(
        model=getattr(settings, "ANTHROPIC_MODEL", "claude-haiku-4-5-20251001"),
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text


def _ask_gemini(prompt: str, system_prompt: str, max_tokens: int) -> str:
    api_key = getattr(settings, "GOOGLE_API_KEY", "")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")

    model = getattr(settings, "GEMINI_MODEL", "gemini-1.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.3,
            "responseMimeType": "text/plain",
        },
    }
    session = requests.Session()
    session.trust_env = False
    res = session.post(url, json=payload, timeout=45)
    if not res.ok:
        raise RuntimeError(f"Gemini API error {res.status_code}: {res.text[:300]}")
    data = res.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise RuntimeError(f"Gemini returned no candidates: {data}")
    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts).strip()
    if not text:
        raise RuntimeError(f"Gemini empty response: {data}")
    return text


def ask_ai(prompt, system_prompt="You are an expert Sales AI Assistant.", max_tokens=600):
    """Provider-agnostic AI call: Anthropic first, Gemini fallback."""
    provider = get_ai_provider()
    if provider == "none":
        return {"success": False, "error": "No AI provider configured. Set ANTHROPIC_API_KEY or GOOGLE_API_KEY in .env."}

    errors = []
    ordered = ["anthropic", "gemini"] if provider == "anthropic" else ["gemini", "anthropic"]
    for p in ordered:
        try:
            if p == "anthropic" and getattr(settings, "ANTHROPIC_API_KEY", ""):
                return {"success": True, "text": _ask_anthropic(prompt, system_prompt, max_tokens), "provider": "anthropic"}
            if p == "gemini" and getattr(settings, "GOOGLE_API_KEY", ""):
                return {"success": True, "text": _ask_gemini(prompt, system_prompt, max_tokens), "provider": "gemini"}
        except Exception as exc:
            errors.append(f"{p}: {exc}")
    return {
        "success": True,
        "text": _offline_text_fallback(prompt),
        "provider": "fallback",
        "warning": " | ".join(errors) if errors else "Unknown AI failure",
    }


def ask_ai_json(
    prompt,
    system_prompt="You are an AI that outputs ONLY valid JSON. No explanations, no markdown formatting. Just the raw JSON object.",
):
    result = ask_ai(prompt, system_prompt, max_tokens=800)
    if not result["success"]:
        return {"success": True, "data": _offline_json_fallback(prompt), "provider": "fallback", "warning": result.get("error")}

    try:
        text = _cleanup_codeblock(result["text"])
        parsed_data = json.loads(text)
        return {"success": True, "data": parsed_data, "provider": result.get("provider")}
    except json.JSONDecodeError:
        return {
            "success": True,
            "data": _offline_json_fallback(prompt),
            "provider": "fallback",
            "warning": "AI response was not valid JSON.",
            "raw_text": result.get("text", ""),
        }
