import json
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from django.conf import settings
from .ai_helper import ask_ai_json

from .models import (
    Lead, Activity, Task, AIInteractionLog,
    AILeadProfile, AIScoreSnapshot, AIActivityAnalysis,
    AIAlert, AIChatSession, AIDocument
)


def _call_claude(prompt, system_prompt="You are an expert CRM AI.",
                  max_tokens=1500, temperature=0.3):
    try:
        result = ask_ai_json(prompt=prompt, system_prompt=system_prompt)
        if result.get("success"):
            payload = result.get("data")
            return {"success": True, "data": payload, "raw": json.dumps(payload, default=str)}
        return {"success": False, "error": result.get("error", "AI call failed"), "data": None, "raw": ""}
    except Exception as e:
        return {"success": False, "error": str(e), "data": None, "raw": ""}


def _get_or_create_profile(lead):
    profile, _ = AILeadProfile.objects.get_or_create(lead=lead)
    return profile


class LeadScoringEngine:

    def score_lead(self, lead):
        signals = self._extract_signals(lead)
        rule_score = self._rule_score(signals)
        ai_result = self._ai_analysis(lead, signals, rule_score)

        if ai_result['success'] and ai_result['data']:
            ai_data = ai_result['data']
            final_score = (rule_score * 0.4) + (ai_data.get('ai_score', rule_score) * 0.6)
        else:
            final_score = rule_score
            ai_data = {}

        final_score = min(100, max(0, final_score))

        profile = _get_or_create_profile(lead)
        old_score = profile.score

        profile.score = round(final_score, 2)
        profile.conversion_probability = round(final_score / 100, 4)
        profile.priority_rank = (1 if final_score >= 80 else 2 if final_score >= 60 else 3 if final_score >= 40 else 4 if final_score >= 20 else 5)
        profile.churn_risk = ai_data.get('churn_risk', 0)
        profile.deal_risk_level = ai_data.get('risk_level', 'medium')
        profile.recommended_action = ai_data.get('recommended_action', '')
        profile.suggested_tags = ai_data.get('suggested_tags', [])
        profile.last_score_factors = signals
        profile.last_ai_response = ai_data
        profile.scored_at = timezone.now()
        profile.save()

        AIScoreSnapshot.objects.create(
            lead=lead, score=final_score,
            conversion_probability=final_score / 100,
            churn_risk=ai_data.get('churn_risk', 0),
            factors=signals
        )

        if old_score > 0 and abs(final_score - old_score) > 15:
            AIAlert.objects.create(
                alert_type='score_change', lead=lead,
                title=f'Score {"up" if final_score > old_score else "down"}: {lead.name}',
                description=f'{old_score:.0f} → {final_score:.0f}',
                priority='high' if abs(final_score - old_score) > 25 else 'medium',
                suggested_action=ai_data.get('recommended_action', ''),
                data={'old': old_score, 'new': final_score}
            )

        return {
            'lead_id': lead.id, 'lead_name': lead.name, 'company': lead.company,
            'final_score': round(final_score, 2), 'rule_score': round(rule_score, 2),
            'priority': profile.priority_rank, 'signals': signals,
            'ai_analysis': ai_data, 'score_change': round(final_score - old_score, 2),
        }

    def _extract_signals(self, lead):
        now = timezone.now()
        acts = lead.activities.all()
        tasks = lead.tasks.all()
        logs = lead.ai_logs.all()

        last = acts.first()
        days_silent = (now - last.created_at).days if last else 999
        r7 = acts.filter(created_at__gte=now - timedelta(days=7)).count()
        p7 = acts.filter(created_at__gte=now - timedelta(days=14), created_at__lt=now - timedelta(days=7)).count()

        total_t = tasks.count()
        done_t = tasks.filter(is_completed=True).count()

        sentiments = list(logs.exclude(sentiment='').values_list('sentiment', flat=True))

        return {
            'total_activities': acts.count(),
            'recent_30d': acts.filter(created_at__gte=now - timedelta(days=30)).count(),
            'recent_7d': r7, 'days_since_contact': days_silent,
            'calls': acts.filter(activity_type='call').count(),
            'emails': acts.filter(activity_type='email').count(),
            'meetings': acts.filter(activity_type='meeting').count(),
            'total_tasks': total_t, 'completed_tasks': done_t,
            'overdue_tasks': tasks.filter(is_completed=False, due_date__lt=now).count(),
            'completion_rate': (done_t / total_t * 100) if total_t > 0 else 0,
            'velocity': round((r7 - p7) / max(p7, 1), 2),
            'positive_sentiments': sentiments.count('positive'),
            'negative_sentiments': sentiments.count('negative'),
            'tags': list(lead.tags.values_list('name', flat=True)),
            'deal_value': float(lead.value or 0),
            'has_phone': bool(lead.phone), 'source': lead.source,
            'stage': lead.status,
            'days_in_pipeline': (now - lead.created_at).days,
        }

    def _rule_score(self, s):
        score = {'new': 5, 'mql': 12, 'sql': 20, 'negotiation': 25, 'won': 25, 'lost': 0}.get(s['stage'], 5)
        if s['days_since_contact'] <= 3: score += 20
        elif s['days_since_contact'] <= 7: score += 15
        elif s['days_since_contact'] <= 14: score += 10
        elif s['days_since_contact'] <= 30: score += 5
        score += min(15, s['recent_30d'] * 3)
        score += min(10, s['meetings'] * 5)
        if s['velocity'] > 0.5: score += 10
        elif s['velocity'] > 0: score += 5
        elif s['velocity'] < -0.5: score -= 5
        if s['deal_value'] > 100000: score += 10
        elif s['deal_value'] > 50000: score += 7
        elif s['deal_value'] > 10000: score += 5
        elif s['deal_value'] > 0: score += 3
        if s['has_phone']: score += 3
        score += max(-5, min(5, (s['positive_sentiments'] - s['negative_sentiments']) * 2))
        score -= s['overdue_tasks'] * 2
        return max(0, min(100, score))

    def _ai_analysis(self, lead, signals, rule_score):
        prompt = f"""Score this lead.
LEAD: {lead.name} | {lead.company} | {lead.status} | ${lead.value} | {lead.source}
SIGNALS: {json.dumps(signals, indent=2)}
Rule Score: {rule_score}/100

Return ONLY JSON:
{{"ai_score": <0-100>, "risk_level": "low/medium/high/critical", "churn_risk": <0-1.0>,
"recommended_action": "next step", "key_insight": "observation",
"suggested_tags": ["tag"], "strengths": ["s1","s2"], "risks": ["r1","r2"]}}"""
        return _call_claude(prompt, max_tokens=600, system_prompt="Sales analyst. ONLY valid JSON.")


class ChurnPredictionEngine:

    def predict(self, lead):
        risk = 0.0
        factors = []
        now = timezone.now()

        last = lead.activities.first()
        if last:
            d = (now - last.created_at).days
            if d > 60: risk += 0.30; factors.append({'factor': f'No contact {d}d', 'severity': 'critical', 'fix': 'Immediate outreach'})
            elif d > 30: risk += 0.20; factors.append({'factor': f'No contact {d}d', 'severity': 'high', 'fix': 'Call this week'})
            elif d > 14: risk += 0.10; factors.append({'factor': f'No contact {d}d', 'severity': 'medium', 'fix': 'Send email'})
        else:
            risk += 0.25; factors.append({'factor': 'Never contacted', 'severity': 'high', 'fix': 'First contact now'})

        r7 = lead.activities.filter(created_at__gte=now - timedelta(days=7)).count()
        p7 = lead.activities.filter(created_at__gte=now - timedelta(days=14), created_at__lt=now - timedelta(days=7)).count()
        if p7 > 0 and r7 == 0:
            risk += 0.20; factors.append({'factor': 'Activity dropped to zero', 'severity': 'high', 'fix': 'Call to understand why'})

        logs = lead.ai_logs.filter(created_at__gte=now - timedelta(days=30))
        neg = logs.filter(sentiment='negative').count()
        total = logs.count()
        if total > 0 and neg / total > 0.5:
            risk += 0.20; factors.append({'factor': f'{neg}/{total} negative', 'severity': 'critical', 'fix': 'Escalate'})

        overdue = lead.tasks.filter(is_completed=False, due_date__lt=now).count()
        if overdue > 2:
            risk += 0.15; factors.append({'factor': f'{overdue} overdue tasks', 'severity': 'high', 'fix': 'Complete tasks'})

        days_stuck = (now - lead.updated_at).days
        limit = {'new': 14, 'mql': 21, 'sql': 30, 'negotiation': 45}.get(lead.status, 30)
        if days_stuck > limit:
            risk += 0.15; factors.append({'factor': f'Stuck {days_stuck}d in {lead.status}', 'severity': 'high', 'fix': 'Advance or disqualify'})

        prob = min(1.0, risk)
        level = 'critical' if prob > 0.7 else 'high' if prob > 0.5 else 'medium' if prob > 0.3 else 'low'

        profile = _get_or_create_profile(lead)
        profile.churn_risk = prob
        profile.save(update_fields=['churn_risk'])

        if level in ['high', 'critical']:
            AIAlert.objects.create(
                alert_type='churn_risk', lead=lead, title=f'⚠️ Churn: {lead.name}',
                description=f'{prob:.0%} risk', priority=level,
                suggested_action=factors[0]['fix'] if factors else '', data={'factors': factors}
            )

        return {'lead_id': lead.id, 'lead_name': lead.name, 'churn_probability': round(prob, 4),
                'risk_level': level, 'risk_factors': factors, 'days_to_act': max(1, int((1 - prob) * 14))}


class ConversationIntelligence:

    def analyze_activity(self, activity):
        if not activity.description:
            return {"success": False, "error": "No content"}

        if AIActivityAnalysis.objects.filter(activity=activity).exists():
            existing = AIActivityAnalysis.objects.get(activity=activity)
            return {"success": True, "analysis": existing.full_analysis, "already_analyzed": True}

        prompt = f"""Analyze this interaction:
TYPE: {activity.activity_type} | SUMMARY: {activity.summary}
CONTENT: {activity.description}
LEAD: {activity.lead.name} at {activity.lead.company} | STAGE: {activity.lead.status}

Return ONLY JSON:
{{"sentiment_score": <-1 to 1>, "sentiment_label": "positive/negative/neutral",
"intent": "inquiry/interest/objection/buying/stalling/ghosting",
"urgency": "low/medium/high/critical", "buying_signals": ["s1"],
"objections": ["o1"], "competitor_mentions": ["name"],
"key_topics": ["t1"], "one_line_summary": "1 sentence",
"follow_up_needed": true, "follow_up_suggestion": "what to do", "follow_up_days": 3}}"""

        result = _call_claude(prompt, max_tokens=600, system_prompt="Sales analyst. ONLY valid JSON.")

        if result['success'] and result['data']:
            d = result['data']
            AIActivityAnalysis.objects.create(
                activity=activity, lead=activity.lead,
                sentiment_score=d.get('sentiment_score', 0),
                sentiment_label=d.get('sentiment_label', ''),
                intent=d.get('intent', ''), urgency=d.get('urgency', ''),
                key_topics=d.get('key_topics', []),
                buying_signals=d.get('buying_signals', []),
                objections=d.get('objections', []),
                competitor_mentions=d.get('competitor_mentions', []),
                one_line_summary=d.get('one_line_summary', ''),
                follow_up_needed=d.get('follow_up_needed', False),
                follow_up_suggestion=d.get('follow_up_suggestion', ''),
                follow_up_days=d.get('follow_up_days', 3),
                full_analysis=d,
            )

            comps = d.get('competitor_mentions', [])
            if comps:
                profile = _get_or_create_profile(activity.lead)
                profile.competitor_mentions = list(set((profile.competitor_mentions or []) + comps))
                profile.save(update_fields=['competitor_mentions'])
                AIAlert.objects.create(
                    alert_type='competitor_mention', lead=activity.lead,
                    title=f'Competitor: {", ".join(comps)}', description=d.get('one_line_summary', ''),
                    priority='medium', data={'competitors': comps}
                )

            if d.get('follow_up_needed'):
                Task.objects.create(
                    lead=activity.lead,
                    title=f'AI: {d.get("follow_up_suggestion", "Follow up")}',
                    description=f'From {activity.activity_type}: {d.get("one_line_summary", "")}',
                    due_date=timezone.now() + timedelta(days=d.get('follow_up_days', 3)),
                    priority='high' if d.get('urgency') in ['high', 'critical'] else 'medium'
                )

            return {"success": True, "analysis": d}
        return result

    def get_lead_intelligence(self, lead):
        acts = lead.activities.all()[:20]
        logs = lead.ai_logs.all()[:10]

        lines = []
        for a in acts:
            line = f"[{a.created_at.strftime('%Y-%m-%d')}] {a.activity_type}: {a.summary or a.description[:100]}"
            try:
                ana = a.ai_analysis
                line += f" | Sent:{ana.sentiment_score}, Intent:{ana.intent}"
            except AIActivityAnalysis.DoesNotExist:
                pass
            lines.append(line)
        for l in logs:
            lines.append(f"[{l.created_at.strftime('%Y-%m-%d')}] {l.interaction_type}: {l.ai_summary or l.transcript[:100]}")

        prompt = f"""Conversation intelligence report.
LEAD: {lead.name} at {lead.company} | {lead.status} | ${lead.value} | {(timezone.now() - lead.created_at).days}d

INTERACTIONS:
{chr(10).join(lines) if lines else "None"}

Return ONLY JSON:
{{"relationship_health": "strong/stable/weakening/at_risk", "relationship_score": <1-10>,
"executive_summary": "3 sentences", "sentiment_trend": "improving/stable/declining",
"all_buying_signals": ["s"], "all_objections": ["o"], "key_milestones": ["m"],
"stalled_reasons": ["r"], "win_strategy": "paragraph", "biggest_risk": "risk",
"competitor_threat": "none/low/medium/high",
"next_3_actions": [{{"action":"...", "channel":"call/email/meeting", "timing":"today/this_week/next_week"}}]}}"""

        return _call_claude(prompt, max_tokens=1200, temperature=0.4)

    def get_sentiment_timeline(self, lead):
        analyses = AIActivityAnalysis.objects.filter(lead=lead).order_by('created_at')
        timeline = [{'date': a.created_at.strftime('%Y-%m-%d'), 'type': a.activity.activity_type,
                      'sentiment': a.sentiment_score, 'intent': a.intent, 'summary': a.one_line_summary} for a in analyses]

        if len(timeline) >= 3:
            recent = sum(t['sentiment'] for t in timeline[-3:]) / 3
            older = sum(t['sentiment'] for t in timeline[:3]) / 3
            trend = 'improving' if recent > older + 0.1 else 'declining' if recent < older - 0.1 else 'stable'
        else:
            trend = 'insufficient_data'

        profile = _get_or_create_profile(lead)
        profile.sentiment_trend = trend
        profile.save(update_fields=['sentiment_trend'])

        return {'timeline': timeline, 'trend': trend,
                'current': timeline[-1]['sentiment'] if timeline else 0, 'data_points': len(timeline)}


class CRMChatbot:

    def chat(self, message, session_id='default'):
        session, _ = AIChatSession.objects.get_or_create(session_id=session_id)
        session.add_message('user', message)
        ctx = self._context()

        system = f"""You are an AI CRM Assistant with live data.
LIVE DATA:
{json.dumps(ctx, indent=2, default=str)}

HISTORY:
{json.dumps(session.messages[-10:], indent=2)}

Return ONLY JSON:
{{"response": "answer", "action_type": "info/insight/alert/suggestion",
"data_highlights": ["data"], "suggested_actions": [{{"action":"...", "priority":"high/medium/low"}}],
"follow_up_questions": ["q"]}}"""

        result = _call_claude(message, system_prompt=system, max_tokens=1500, temperature=0.5)
        if result['success'] and result['data']:
            assistant_text = (result['data'].get('response') or '').strip()
            if not assistant_text:
                assistant_text = "AI returned an empty response. Please try again."
                result['data']['response'] = assistant_text
            session.add_message('assistant', assistant_text)
            return result['data']

        fallback = (result.get('raw') or result.get('error') or 'AI is temporarily unavailable. Please check API configuration and retry.')
        session.add_message('assistant', fallback)
        return {'response': fallback, 'action_type': 'error'}

    def _context(self):
        now = timezone.now()
        leads = Lead.objects.all()
        top = list(AILeadProfile.objects.filter(score__gt=0).order_by('-score')[:10]
                   .values('lead__id', 'lead__name', 'lead__company', 'lead__status', 'lead__value', 'score', 'churn_risk'))
        at_risk = list(AILeadProfile.objects.filter(churn_risk__gte=0.5).order_by('-churn_risk')[:5]
                       .values('lead__id', 'lead__name', 'lead__company', 'churn_risk'))

        pipeline = {}
        for code, name in Lead.STATUS_CHOICES:
            s = leads.filter(status=code)
            pipeline[name] = {'count': s.count(), 'value': float(s.aggregate(t=Sum('value'))['t'] or 0)}

        closed = leads.filter(Q(status='won') | Q(status='lost')).count()
        won = leads.filter(status='won').count()
        return {
            'total_leads': leads.count(),
            'pipeline_value': float(leads.aggregate(t=Sum('value'))['t'] or 0),
            'pipeline_by_stage': pipeline, 'top_leads': top, 'at_risk': at_risk,
            'overdue_tasks': Task.objects.filter(is_completed=False, due_date__lt=now).count(),
            'unread_alerts': AIAlert.objects.filter(is_read=False).count(),
            'win_rate': round((won / closed * 100), 1) if closed > 0 else 0,
            'new_this_month': leads.filter(created_at__gte=now - timedelta(days=30)).count(),
        }


class RevenueForecastEngine:

    def forecast(self, months=3):
        leads = Lead.objects.all()
        monthly = {}
        for l in leads.filter(status='won'):
            k = l.updated_at.strftime('%Y-%m')
            monthly[k] = monthly.get(k, 0) + float(l.value)

        pipe = {}
        for code, name in Lead.STATUS_CHOICES:
            if code not in ['won', 'lost']:
                s = leads.filter(status=code)
                pipe[name] = {'count': s.count(), 'value': float(s.aggregate(t=Sum('value'))['t'] or 0)}

        weights = {'new': 0.05, 'mql': 0.15, 'sql': 0.35, 'negotiation': 0.65}
        weighted = sum(float(l.value) * weights.get(l.status, 0.1) for l in leads.exclude(status__in=['won', 'lost']))

        prompt = f"""Revenue forecast for {months} months.
HISTORICAL: {json.dumps(monthly)}
PIPELINE: {json.dumps(pipe)}
WEIGHTED: ${weighted:,.2f}

Return ONLY JSON:
{{"forecast": [{{"month":1,"predicted_revenue":<num>,"confidence":"low/medium/high","key_deals":["name"],"risk":"risk"}}],
"total_forecast":<total>, "trend":"growing/stable/declining",
"assumptions":["a1"], "actions_to_improve":["a1"]}}"""

        result = _call_claude(prompt, max_tokens=1000, temperature=0.4)
        if result['success'] and result['data']:
            result['data']['weighted_pipeline'] = round(weighted, 2)
        return result


class AnomalyDetectionEngine:

    def detect_all(self):
        return self._spikes() + self._ghosts() + self._stagnant()

    def _spikes(self):
        out = []
        now = timezone.now()
        for lead in Lead.objects.exclude(status__in=['won', 'lost']):
            recent = lead.activities.filter(created_at__gte=now - timedelta(days=3)).count()
            avg = lead.activities.count() / max(1, (now - lead.created_at).days / 3)
            if recent > avg * 3 and recent >= 3:
                out.append({'type': 'engagement_spike', 'lead_id': lead.id, 'lead_name': lead.name,
                            'company': lead.company, 'message': f'{recent} in 3d (avg:{avg:.1f})',
                            'action': 'Call NOW!', 'priority': 'critical'})
                AIAlert.objects.get_or_create(alert_type='engagement_spike', lead=lead, is_read=False,
                    defaults={'title': f'🔥 Spike: {lead.name}', 'description': f'{recent} in 3d',
                              'priority': 'critical', 'suggested_action': 'Call immediately'})
        return out

    def _ghosts(self):
        out = []
        now = timezone.now()
        for lead in Lead.objects.filter(value__gte=10000, status__in=['mql', 'sql', 'negotiation']):
            last = lead.activities.first()
            if last and (now - last.created_at).days >= 14:
                d = (now - last.created_at).days
                out.append({'type': 'ghost_lead', 'lead_id': lead.id, 'lead_name': lead.name,
                            'company': lead.company, 'value': float(lead.value), 'days_silent': d,
                            'message': f'${lead.value:,.0f} silent {d}d', 'action': 'Re-engage', 'priority': 'high'})
        return out

    def _stagnant(self):
        out = []
        now = timezone.now()
        for stage, mx in {'new': 14, 'mql': 21, 'sql': 30, 'negotiation': 45}.items():
            for lead in Lead.objects.filter(status=stage, updated_at__lt=now - timedelta(days=mx)):
                d = (now - lead.updated_at).days
                out.append({'type': 'stagnant_deal', 'lead_id': lead.id, 'lead_name': lead.name,
                            'company': lead.company, 'stage': stage, 'days_stuck': d,
                            'message': f'Stuck {d}d in {stage}', 'action': 'Advance or disqualify', 'priority': 'medium'})
        return out


class AIDocumentGenerator:

    def generate_proposal(self, lead, instructions=""):
        history = "\n".join([f"- {a.created_at.strftime('%Y-%m-%d')}: {a.activity_type} - {a.summary or a.description[:80]}" for a in lead.activities.all()[:10]])
        prompt = f"""Proposal for {lead.name} at {lead.company}. ${lead.value} | {lead.status}
History: {history or "None"} | Instructions: {instructions or "Standard"}

Return ONLY JSON:
{{"title":"title", "executive_summary":"2-3 sentences", "problem_statement":"problem",
"proposed_solution":"solution", "value_proposition":["b1","b2","b3"],
"scope_of_work":[{{"phase":"P1","description":"...","duration":"2w"}}],
"pricing":{{"total":"amt","breakdown":[{{"item":"..","cost":".."}}]}},
"timeline":"timeline", "why_us":["d1","d2"], "next_steps":["s1","s2"]}}"""

        result = _call_claude(prompt, max_tokens=2000, temperature=0.5)
        if result['success'] and result['data']:
            doc = AIDocument.objects.create(lead=lead, doc_type='proposal', title=result['data'].get('title', f'Proposal: {lead.company}'), content=result['data'])
            return {"success": True, "document_id": doc.id, "proposal": result['data']}
        return result

    def generate_battle_card(self, lead, competitors=None):
        profile = _get_or_create_profile(lead)
        all_c = list(set((competitors or []) + (profile.competitor_mentions or [])))
        prompt = f"""Battle card for {lead.company}. Competitors: {', '.join(all_c) if all_c else 'Unknown'}. ${lead.value}

Return ONLY JSON:
{{"our_strengths":["s1","s2"], "competitor_weaknesses":[{{"competitor":"name","weakness":"..","counter":".."}}],
"objection_handlers":[{{"objection":"..","response":"..","proof":".."}}],
"killer_questions":["q1"], "win_themes":["t1","t2"]}}"""

        result = _call_claude(prompt, max_tokens=1500, temperature=0.5)
        if result['success'] and result['data']:
            doc = AIDocument.objects.create(lead=lead, doc_type='battle_card', title=f'Battle Card: {lead.company}', content=result['data'])
            return {"success": True, "document_id": doc.id, "battle_card": result['data']}
        return result

    def generate_email_sequence(self, lead, num=5, goal="nurture"):
        prompt = f"""{num}-email sequence for {lead.name} at {lead.company}. Goal:{goal} | {lead.status} | ${lead.value}

Return ONLY JSON:
{{"sequence_name":"Name", "strategy":"Approach",
"emails":[{{"day":1,"subject":"Subject","body":"Email","goal":"Goal","cta":"CTA"}}]}}"""

        result = _call_claude(prompt, max_tokens=2500, temperature=0.6)
        if result['success'] and result['data']:
            doc = AIDocument.objects.create(lead=lead, doc_type='email_sequence', title=f'Sequence: {lead.company} ({goal})', content=result['data'])
            return {"success": True, "document_id": doc.id, "sequence": result['data']}
        return result


class DailyDigestGenerator:

    def generate(self):
        now = timezone.now()
        today = now.date()
        data = {
            'new_leads': Lead.objects.filter(created_at__date=today).count(),
            'activities_today': Activity.objects.filter(created_at__date=today).count(),
            'tasks_due': Task.objects.filter(due_date__date=today, is_completed=False).count(),
            'overdue': Task.objects.filter(due_date__lt=now, is_completed=False).count(),
            'hot_leads': AILeadProfile.objects.filter(score__gte=70).count(),
            'at_risk': AILeadProfile.objects.filter(churn_risk__gte=0.5).count(),
            'unread_alerts': AIAlert.objects.filter(is_read=False).count(),
            'pipeline': float(Lead.objects.exclude(status__in=['won', 'lost']).aggregate(t=Sum('value'))['t'] or 0),
            'won_today': Lead.objects.filter(status='won', updated_at__date=today).count(),
        }

        prompt = f"""Daily sales digest. DATA: {json.dumps(data)}

Return ONLY JSON:
{{"greeting":"greeting", "headline":"1 sentence", "top_priorities":[{{"priority":"..","why":"..","action":".."}}],
"wins":["win"], "warnings":["warning"], "pipeline_insight":"1 sentence",
"motivation":"closing line", "day_score":<1-10>}}"""

        return _call_claude(prompt, max_tokens=1000, temperature=0.6)
