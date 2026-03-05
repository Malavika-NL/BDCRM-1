from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import os
import anthropic

from .models import Lead, Course
from .serializers import LeadSerializer, CourseSerializer

# Set your key (better: put it in environment instead of hardcoding)
os.environ["ANTHROPIC_API_KEY"] = "my ai key"
client = anthropic.Anthropic()

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by("-created_at")
    serializer_class = LeadSerializer

    @action(detail=True, methods=["post"])
    def generate_ai_prompt(self, request, pk=None):
        lead = self.get_object()
        custom_prompt = request.data.get("custom_prompt", "")

        system_prompt = "You are an expert Business Development Sales Agent."

        user_prompt = f"""
        Write a highly personalized outreach message for a lead.
        Lead Name: {lead.name}
        Company: {lead.company}
        Current Pipeline Stage: {lead.status}
        Potential Deal Value: ${lead.value}
        """

        if custom_prompt:
            user_prompt += f"\n\nSPECIFIC INSTRUCTIONS FROM THE USER:\n{custom_prompt}"
        else:
            user_prompt += "\n\nIf 'new', write a cold email. If 'contacted' or 'negotiation', write a follow-up. Keep it under 100 words."

        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",  # from your models list
                max_tokens=500,
                temperature=0.7,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )
            ai_message = response.content[0].text
            return Response({"generated_text": ai_message})

        except Exception as e:
            print("CLAUDE ERROR:", repr(e))
            return Response({"error": str(e)}, status=500)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("-created_at")
    serializer_class = CourseSerializer