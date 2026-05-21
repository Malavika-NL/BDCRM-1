import json
import re
import anthropic
import warnings
from django.conf import settings
from .ai_helper import ask_ai_json

# Suppress warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

try:
    from duckduckgo_search import DDGS
    DDG_AVAILABLE = True
except ImportError:
    DDG_AVAILABLE = False
    print("⚠️ Warning: duckduckgo-search not installed.")

def _call_claude(prompt, system_prompt="Recruiter AI.", max_tokens=1500):
    try:
        result = ask_ai_json(prompt=prompt, system_prompt=system_prompt)
        if result.get("success"):
            return result.get("data")
        print(f"AI Error: {result.get('error')}")
        return None
    except Exception as e:
        print(f"AI Error: {e}")
        return None

class AIProspectorEngine:
    
    def search(self, prompt, sources=None):
        if sources is None: sources = ['linkedin', 'naukri']
        
        print(f"🔎 Analyzing Prompt: {prompt}")

        # 1. AI Extracts Keywords
        criteria = _call_claude(
            f"""Extract key search terms from: "{prompt}"
            Return ONLY JSON: {{"job_title": "single main job title", "location": "city/region"}}""", 
            system_prompt="Output JSON only."
        )
        
        if not criteria:
            criteria = {'job_title': prompt, 'location': ''}

        job = criteria.get('job_title', '')
        loc = criteria.get('location', '')
        
        print(f"🤖 Keywords: {job} in {loc}")

        all_results = []
        
        # 2. Search DuckDuckGo (Simple Query)
        if DDG_AVAILABLE:
            try:
                # Use context manager (standard way)
                with DDGS() as ddgs:
                    
                    # LINKEDIN SEARCH
                    if 'linkedin' in sources:
                        # Simple query: site:linkedin.com/in/ Marketing Manager Kerala
                        query = f'site:linkedin.com/in/ {job} {loc}'
                        print(f"🌐 Searching LinkedIn: {query}")
                        
                        try:
                            # Fetch results
                            results = list(ddgs.text(query, max_results=10))
                            print(f"   -> Found {len(results)} raw results")
                            
                            for r in results:
                                # DEBUG: Print first result to check format
                                # print(f"DEBUG LINKEDIN: {r}") 
                                p = self._parse_result(r, 'linkedin')
                                if p: all_results.append(p)
                        except Exception as e:
                            print(f"❌ DDG LinkedIn Error: {e}")

                    # NAUKRI SEARCH
                    if 'naukri' in sources:
                        query = f'site:naukri.com {job} {loc}'
                        print(f"🌐 Searching Naukri: {query}")
                        
                        try:
                            results = list(ddgs.text(query, max_results=10))
                            print(f"   -> Found {len(results)} raw results")
                            
                            for r in results:
                                p = self._parse_result(r, 'naukri')
                                if p: all_results.append(p)
                        except Exception as e:
                            print(f"❌ DDG Naukri Error: {e}")

            except Exception as e:
                print(f"⚠️ DDG Fatal Error: {e}")

        # 3. Fallback / Response
        if not all_results:
            return {
                'success': True, 
                'results': [], 
                'message': 'No profiles found. Try removing location or being broader.'
            }

        # 4. Clean Data with AI
        print(f"✨ Cleaning {len(all_results)} profiles...")
        consolidated = _call_claude(
            f"""Clean these search results. Remove duplicates.
            RAW DATA: {json.dumps(all_results[:15])}
            
            Return ONLY JSON: {{
                "profiles": [
                    {{
                        "name": "Full Name",
                        "title": "Job Title",
                        "company": "Company",
                        "location": "Location",
                        "source": "LinkedIn/Naukri",
                        "profile_url": "url",
                        "relevance_reason": "why matches"
                    }}
                ]
            }}""",
            system_prompt="Data Cleaner. JSON Only."
        )

        final_results = consolidated.get('profiles', []) if consolidated else all_results

        return {
            'success': True,
            'results': final_results,
            'total': len(final_results)
        }

    def _parse_result(self, result, source):
        """Parses raw DDG result into a profile object"""
        title = result.get('title', '')
        snippet = result.get('body', '')
        url = result.get('href', '')

        name = "Unknown"
        job = "Detected Profile"
        company = "Unknown Company"

        # 1. Validation: Ensure URL matches source
        if source == 'linkedin' and 'linkedin.com' not in url: return None
        if source == 'naukri' and 'naukri.com' not in url: return None

        # 2. Parsing Title
        # LinkedIn: "Name - Title - Company | LinkedIn"
        # Naukri: "Name - Title - Company - Naukri"
        
        clean_title = title
        clean_title = clean_title.split(' | LinkedIn')[0].split(' - LinkedIn')[0]
        clean_title = clean_title.split(' - Naukri')[0].split(' | Naukri')[0]

        parts = clean_title.split(' - ')
        
        if len(parts) >= 1: name = parts[0].strip()
        if len(parts) >= 2: job = parts[1].strip()
        if len(parts) >= 3: company = parts[2].strip()

        # 3. Simple Object Return
        return {
            'name': name,
            'title': job,
            'company': company,
            'location': "Unknown", 
            'source': 'LinkedIn' if source == 'linkedin' else 'Naukri',
            'profile_url': url,
            'headline': snippet
        }
    
    def enrich_profile(self, url):
        return {'success': False, 'message': 'Not implemented'}
