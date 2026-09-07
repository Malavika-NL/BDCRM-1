"""Read-only, company-scoped dashboard feed for SalesPie."""
from datetime import timedelta

from django.conf import settings
from django.core import signing
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Activity, BDMTarget, CampaignWorkspace, Course, Lead, Task
from .tenancy import set_current_company_id


class SalesPieDashboardView(APIView):
    # A short-lived server signature authenticates this dedicated read-only feed.
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        secret = settings.BDCRM_DASHBOARD_SECRET
        if not secret:
            return Response({'detail': 'Dashboard connection is not configured.'}, status=503)
        try:
            claims = signing.loads(
                request.headers.get('X-SalesPie-Dashboard-Token', ''),
                key=secret, salt='salespie.bdcrm.dashboard.v1', max_age=60,
            )
            company_id = claims.get('company_id')
            if type(company_id) is not int or company_id < 1:
                raise ValueError('Invalid company')
        except (signing.BadSignature, ValueError, TypeError, AttributeError):
            return Response({'detail': 'Invalid dashboard credentials.'}, status=403)
        set_current_company_id(company_id)
        return Response(self.dashboard_data(), headers={'Cache-Control': 'no-store'})

    @staticmethod
    def dashboard_data():
        leads = Lead.objects.all()
        totals = leads.aggregate(
            total_leads=Count('id'), total_value=Sum('value'),
            won_count=Count('id', filter=Q(status='won')),
            closed_count=Count('id', filter=Q(status__in=['won', 'lost'])),
            current_revenue=Sum('value', filter=Q(status='won')),
        )
        closed = totals.pop('closed_count')
        totals['total_value'] = totals['total_value'] or 0
        totals['current_revenue'] = totals['current_revenue'] or 0
        totals['win_rate'] = round(totals['won_count'] / closed * 100, 1) if closed else 0
        totals['status_distribution'] = list(
            leads.order_by().values('status').annotate(count=Count('id')),
        )
        totals['recent_activities'] = list(
            Activity.objects.order_by('-created_at').values(
                'id', 'activity_type', 'summary', 'created_at',
            )[:5],
        )
        tasks = Task.objects.filter(is_completed=False)
        totals['tasks'] = {
            'total': tasks.count(),
            'overdue': tasks.filter(due_date__lt=timezone.now()).count(),
            'priorities': list(tasks.order_by().values('priority').annotate(count=Count('id'))),
        }
        totals['campaigns'] = list(
            CampaignWorkspace.objects.order_by().values('status').annotate(count=Count('id')),
        )
        targets = list(BDMTarget.objects.only(
            'id', 'name', 'status', 'target_revenue', 'achieved_revenue',
            'target_leads', 'achieved_leads',
        ).order_by('-created_at'))
        totals['targets'] = {
            'total': len(targets),
            'average_progress': round(sum(t.progress_percentage() for t in targets) / len(targets), 1) if targets else 0,
            'recent': [
                {'id': t.id, 'name': t.name, 'status': t.status, 'progress': t.progress_percentage()}
                for t in targets[:5]
            ],
        }
        totals['courses'] = Course.objects.count()
        today = timezone.localdate()
        start = today - timedelta(days=6)
        lead_days = dict(leads.filter(created_at__date__gte=start).order_by()
                         .annotate(day=TruncDate('created_at')).values('day')
                         .annotate(count=Count('id')).values_list('day', 'count'))
        call_days = dict(Activity.objects.filter(activity_type='call', created_at__date__gte=start)
                         .order_by().annotate(day=TruncDate('created_at')).values('day')
                         .annotate(count=Count('id')).values_list('day', 'count'))
        totals['weekly_activity'] = [
            {'date': day.isoformat(), 'leads': lead_days.get(day, 0), 'calls': call_days.get(day, 0)}
            for day in (start + timedelta(days=i) for i in range(7))
        ]
        totals['updated_at'] = timezone.now().isoformat()
        return totals
