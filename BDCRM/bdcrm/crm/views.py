import os
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from openai import OpenAI
from .models import Lead, Course
from .serializers import LeadSerializer, CourseSerializer

# PUT YOUR BRAND NEW OPENAI KEY HERE
os.environ["OPENAI_API_KEY"] = "sk-your-new-api-key-goes-here" 
client = OpenAI()

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by('-created_at')
    serializer_class = LeadSerializer

    @action(detail=True, methods=['post'])
    def generate_ai_prompt(self, request, pk=None):
        lead = self.get_object()
        custom_prompt = request.data.get('custom_prompt', '')
        
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
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
            )
            ai_message = response.choices[0].message.content
            return Response({"generated_text": ai_message})
        except Exception as e:
            # THIS PRINTS THE EXACT REASON OPENAI CRASHED TO YOUR TERMINAL
            print("\n" + "="*40)
            print("🚨 OPENAI ERROR DETECTED 🚨")
            print(str(e))
            print("="*40 + "\n")
            return Response({"error": str(e)}, status=500)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer