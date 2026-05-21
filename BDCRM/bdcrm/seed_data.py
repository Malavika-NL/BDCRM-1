from datetime import timedelta

from django.utils import timezone

from crm.models import Activity, AIAlert, Company, Lead, Region, Tag, Task, Vertical


def run():
    vertical_auto, _ = Vertical.objects.get_or_create(name="Automobile")
    vertical_pharma, _ = Vertical.objects.get_or_create(name="Pharma")
    region_south, _ = Region.objects.get_or_create(name="South")
    region_west, _ = Region.objects.get_or_create(name="West")

    hot_tag, _ = Tag.objects.get_or_create(name="Hot Lead", defaults={"color": "#ef4444"})
    followup_tag, _ = Tag.objects.get_or_create(name="Follow Up", defaults={"color": "#f59e0b"})
    enterprise_tag, _ = Tag.objects.get_or_create(name="Enterprise", defaults={"color": "#3b82f6"})

    companies = [
        {"name": "Apex Motors Pvt Ltd", "industry": "Automobile", "region": "South", "website": "https://apexmotors.example.com"},
        {"name": "Zenith Pharma Labs", "industry": "Pharma", "region": "West", "website": "https://zenithpharma.example.com"},
        {"name": "Nova Packaging Industries", "industry": "Manufacturing", "region": "South", "website": "https://novapack.example.com"},
        {"name": "Orbit Retail Systems", "industry": "Retail", "region": "West", "website": "https://orbitretail.example.com"},
    ]
    company_objs = {}
    for c in companies:
        obj, _ = Company.objects.get_or_create(name=c["name"], defaults=c)
        company_objs[c["name"]] = obj

    leads_data = [
        {
            "name": "Rohan Iyer",
            "email": "rohan.iyer@apexmotors.com",
            "phone": "+919811110001",
            "company": "Apex Motors Pvt Ltd",
            "source": "linkedin",
            "status": "contacted",
            "value": "175000.00",
            "vertical": vertical_auto,
            "region_rel": region_south,
            "tags": [hot_tag, enterprise_tag],
        },
        {
            "name": "Priya Menon",
            "email": "priya.menon@zenithpharma.com",
            "phone": "+919811110002",
            "company": "Zenith Pharma Labs",
            "source": "referral",
            "status": "negotiation",
            "value": "260000.00",
            "vertical": vertical_pharma,
            "region_rel": region_west,
            "tags": [hot_tag],
        },
        {
            "name": "Vikram Das",
            "email": "vikram.das@novapack.com",
            "phone": "+919811110003",
            "company": "Nova Packaging Industries",
            "source": "website",
            "status": "new",
            "value": "92000.00",
            "vertical": vertical_auto,
            "region_rel": region_south,
            "tags": [followup_tag],
        },
        {
            "name": "Anita Sharma",
            "email": "anita.sharma@orbitretail.com",
            "phone": "+919811110004",
            "company": "Orbit Retail Systems",
            "source": "cold_outreach",
            "status": "contacted",
            "value": "64000.00",
            "vertical": vertical_pharma,
            "region_rel": region_west,
            "tags": [followup_tag],
        },
    ]

    seeded_leads = []
    for ld in leads_data:
        lead, created = Lead.objects.get_or_create(
            email=ld["email"],
            defaults={
                "name": ld["name"],
                "phone": ld["phone"],
                "company": ld["company"],
                "related_company": company_objs[ld["company"]],
                "source": ld["source"],
                "status": ld["status"],
                "value": ld["value"],
                "vertical": ld["vertical"],
                "region_rel": ld["region_rel"],
            },
        )
        if not created:
            lead.name = ld["name"]
            lead.phone = ld["phone"]
            lead.company = ld["company"]
            lead.related_company = company_objs[ld["company"]]
            lead.source = ld["source"]
            lead.status = ld["status"]
            lead.value = ld["value"]
            lead.vertical = ld["vertical"]
            lead.region_rel = ld["region_rel"]
            lead.save()
        lead.tags.set(ld["tags"])
        seeded_leads.append(lead)

    now = timezone.now()
    for i, lead in enumerate(seeded_leads, start=1):
        Activity.objects.get_or_create(
            lead=lead,
            activity_type="call",
            summary="Intro call completed",
            defaults={"description": f"Initial qualification call done with {lead.name}. Budget and timeline discussed."},
        )
        Activity.objects.get_or_create(
            lead=lead,
            activity_type="email",
            summary="Proposal shared",
            defaults={"description": f"Shared product deck and pricing proposal with {lead.company}."},
        )
        Task.objects.get_or_create(
            lead=lead,
            title="Follow-up call",
            defaults={
                "description": f"Follow up with {lead.name} for decision update.",
                "due_date": now + timedelta(days=i),
                "priority": "high" if lead.status in ["negotiation", "contacted"] else "medium",
                "is_completed": False,
            },
        )

    alerts_seed = [
        ("ghost_lead", seeded_leads[0], "No response in last 4 days", "Lead has gone silent after proposal. Re-engage today.", "high"),
        ("score_change", seeded_leads[1], "Lead score increased to 82", "Recent meeting improved close probability significantly.", "medium"),
        ("follow_up_overdue", seeded_leads[2], "Follow-up task overdue", "Pending follow-up task is overdue by 1 day.", "high"),
        ("engagement_spike", seeded_leads[3], "Engagement spike detected", "Lead opened proposal twice in the last 24 hours.", "low"),
    ]
    for alert_type, lead, title, desc, priority in alerts_seed:
        AIAlert.objects.get_or_create(
            alert_type=alert_type,
            lead=lead,
            title=title,
            defaults={
                "description": desc,
                "priority": priority,
                "is_read": False,
                "is_actioned": False,
                "suggested_action": "Review lead and take next action",
                "data": {"seeded": True},
            },
        )

    print("Seed complete")
    print("Companies:", Company.objects.count())
    print("Leads:", Lead.objects.count())
    print("Activities:", Activity.objects.count())
    print("Tasks:", Task.objects.count())
    print("Unread AI Alerts:", AIAlert.objects.filter(is_read=False).count())


run()
