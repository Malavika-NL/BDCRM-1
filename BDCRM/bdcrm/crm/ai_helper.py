import anthropic
import json
from django.conf import settings

def get_ai_client():
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

def ask_ai(prompt, system_prompt="You are an expert Sales AI Assistant.", max_tokens=600):
    """Returns plain text from Claude."""
    try:
        client = get_ai_client()
        response = client.messages.create(
            model="claude-haiku-4-5-20251001", # Fast, cheap, and smart model
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )
        return {"success": True, "text": response.content[0].text}
    except Exception as e:
        return {"success": False, "error": str(e)}

def ask_ai_json(prompt, system_prompt="You are an AI that outputs ONLY valid JSON. No explanations, no markdown formatting. Just the raw JSON object."):
    """Forces Claude to return JSON and parses it securely."""
    result = ask_ai(prompt, system_prompt, max_tokens=800)
    
    if not result["success"]:
        return result
    
    try:
        text = result["text"].strip()
        # Clean up markdown code blocks if Claude adds them by accident
        if text.startswith("```json"): text = text[7:]
        elif text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        
        parsed_data = json.loads(text.strip())
        return {"success": True, "data": parsed_data}
    except json.JSONDecodeError:
        return {"success": False, "error": "AI response was not valid JSON.", "raw_text": result["text"]}