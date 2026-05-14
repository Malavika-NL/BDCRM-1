import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Factory,
  Package,
  Loader2,
  DollarSign,
  CheckCircle2,
  Target,
  Clock3,
  Gauge,
  ShieldCheck,
  CircleDashed,
  ClipboardCheck,
  Building2,
  UserRound,
} from 'lucide-react';
import { api } from '../Utils/api';
import type { LeadStatus } from '../Utils/types';

const statusFlow: { id: LeadStatus; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

export const AddDealPage = () => {
  const navigate = useNavigate();
  const [verticals, setVerticals] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    status: 'new' as LeadStatus,
    source: 'cold_outreach',
    vertical: '',
    region_rel: '',
    product_interest: '',
  });

  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('Schedule discovery call');
  const [probability, setProbability] = useState(40);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeline, setTimeline] = useState('This month');
  const [decisionMaker, setDecisionMaker] = useState('');
  const [decisionRole, setDecisionRole] = useState('');
  const [decisionDate, setDecisionDate] = useState('');
  const [dealNeed, setDealNeed] = useState('');
  const [budgetConfirmed, setBudgetConfirmed] = useState(false);
  const [authorityConfirmed, setAuthorityConfirmed] = useState(false);
  const [timelineConfirmed, setTimelineConfirmed] = useState(false);
  const [competitor, setCompetitor] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [riskNotes, setRiskNotes] = useState('');
  const [actionOne, setActionOne] = useState('Discovery call');
  const [actionTwo, setActionTwo] = useState('Share proposal');
  const [actionThree, setActionThree] = useState('Commercial discussion');

  useEffect(() => {
    setLoadingConfig(true);
    Promise.all([
      api.getVerticals().catch(() => []),
      api.getRegions().catch(() => []),
      api.getProductLines().catch(() => []),
    ]).then(([vData, rData, pData]) => {
      setVerticals(vData);
      setRegions(rData);
      setProducts(pData);
      setFormData(prev => ({
        ...prev,
        vertical: vData[0]?.id || '',
        region_rel: rData[0]?.id || '',
        product_interest: pData[0]?.id || '',
      }));
      setLoadingConfig(false);
    });
  }, []);

  const completion = useMemo(() => {
    const checks = [
      !!formData.name,
      !!formData.company,
      !!formData.email,
      !!formData.value,
      !!formData.vertical,
      !!formData.region_rel,
      !!formData.product_interest,
      !!nextAction,
      !!timeline,
      !!decisionMaker,
      !!decisionRole,
      !!dealNeed,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [formData, nextAction, timeline, decisionMaker, decisionRole, dealNeed]);

  const valueNumber = Number(formData.value || 0);
  const expectedValue = Math.round(valueNumber * (probability / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.createLead(formData);
      navigate('/pipeline');
    } catch {
      setError('Failed to create deal. Please check fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const sectionCard =
    'rounded-3xl border border-blue-100/80 bg-white/90 backdrop-blur-sm shadow-[0_20px_40px_-24px_rgba(30,64,175,0.45)] p-5 md:p-6 animate-[liftIn_600ms_ease-out]';

  return (
    <div className="min-h-full overflow-y-auto bg-[radial-gradient(1200px_500px_at_90%_-20%,#bfdbfe_0%,transparent_70%),radial-gradient(900px_420px_at_0%_0%,#dbeafe_0%,transparent_65%),linear-gradient(160deg,#f8fbff_0%,#eef5ff_45%,#f8fbff_100%)] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="relative overflow-hidden rounded-[28px] border border-blue-200/70 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_70px_-30px_rgba(37,99,235,0.55)] animate-[fadeIn_450ms_ease-out]">
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-blue-200/70" />
          <div className="absolute right-20 top-20 h-16 w-16 rounded-full bg-blue-100/80" />

          <button
            onClick={() => navigate('/pipeline')}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={14} />
            Pipeline
          </button>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-500">Deal Builder</p>
              <h1 className="text-3xl md:text-5xl leading-tight font-black text-blue-800">Add New Deal</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">A complete workspace to qualify, structure, and launch a strong deal into pipeline.</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-4">
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider text-slate-500">
                <span>Completion</span>
                <span className="text-blue-700">{completion}%</span>
              </div>
              <div className="mt-2 h-2.5 bg-blue-50 rounded-full overflow-hidden">
                <div className="h-full bg-[linear-gradient(90deg,#0ea5e9,#1d4ed8)] transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-blue-50 py-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Value</p>
                  <p className="text-sm font-black text-blue-700">${valueNumber ? valueNumber.toLocaleString() : '0'}</p>
                </div>
                <div className="rounded-xl bg-blue-50 py-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Win%</p>
                  <p className="text-sm font-black text-blue-700">{probability}%</p>
                </div>
                <div className="rounded-xl bg-blue-50 py-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Priority</p>
                  <p className="text-sm font-black text-blue-700">{priority}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {loadingConfig ? (
          <div className="bg-white rounded-3xl border border-blue-100 p-16 flex flex-col items-center text-slate-500 shadow-sm">
            <Loader2 className="animate-spin mb-2" size={30} />
            Loading form details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-6">
              <section className={sectionCard}>
                {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Core Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Contact Name</label>
                    <div className="inputWrap"><UserRound size={15} className="icon" /><input required type="text" className="input pad" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  </div>
                  <div>
                    <label className="label">Company</label>
                    <div className="inputWrap"><Building2 size={15} className="icon" /><input required type="text" className="input pad" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} /></div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input required type="email" className="input" placeholder="john@acme.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" className="input" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </section>

              <section className={sectionCard}>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="labelMini"><Factory size={11} /> Vertical</label>
                    <select className="input" value={formData.vertical} onChange={e => setFormData({ ...formData, vertical: e.target.value })}>
                      <option value="">Select...</option>
                      {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="labelMini"><MapPin size={11} /> Region</label>
                    <select className="input" value={formData.region_rel} onChange={e => setFormData({ ...formData, region_rel: e.target.value })}>
                      <option value="">Select...</option>
                      {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="labelMini"><Package size={11} /> Product</label>
                    <select className="input" value={formData.product_interest} onChange={e => setFormData({ ...formData, product_interest: e.target.value })}>
                      <option value="">Select...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section className={sectionCard}>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Deal Intelligence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Deal Value ($)</label>
                    <div className="inputWrap"><DollarSign size={15} className="icon" /><input required type="number" className="input pad" placeholder="50000" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} /></div>
                  </div>
                  <div>
                    <label className="label">Stage</label>
                    <select className="input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>{statusFlow.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                  </div>
                  <div>
                    <label className="label">Source</label>
                    <select className="input" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                      <option value="cold_outreach">Cold Call</option><option value="linkedin">LinkedIn</option><option value="referral">Referral</option><option value="website">Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Win Probability ({probability}%)</label>
                    <input type="range" min={5} max={95} step={5} value={probability} onChange={e => setProbability(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer mt-3" />
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select className="input" value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
                  </div>
                  <div>
                    <label className="label">Timeline</label>
                    <select className="input" value={timeline} onChange={e => setTimeline(e.target.value)}><option>This week</option><option>This month</option><option>Next quarter</option><option>Long-term</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="label">Next Action</label>
                    <input type="text" className="input" value={nextAction} onChange={e => setNextAction(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Internal Notes</label>
                    <input type="text" className="input" value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className={sectionCard}>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Stakeholder & Decision</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="label">Decision Maker</label><input className="input" value={decisionMaker} onChange={e => setDecisionMaker(e.target.value)} /></div>
                  <div><label className="label">Role / Title</label><input className="input" value={decisionRole} onChange={e => setDecisionRole(e.target.value)} /></div>
                  <div><label className="label">Expected Decision Date</label><input type="date" className="input" value={decisionDate} onChange={e => setDecisionDate(e.target.value)} /></div>
                  <div><label className="label">Core Need</label><input className="input" value={dealNeed} onChange={e => setDealNeed(e.target.value)} placeholder="Main pain point" /></div>
                </div>
              </section>

              <section className={sectionCard}>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Qualification & Risk</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="chip"><input type="checkbox" checked={budgetConfirmed} onChange={e => setBudgetConfirmed(e.target.checked)} className="accent-blue-600" /> Budget Confirmed</label>
                  <label className="chip"><input type="checkbox" checked={authorityConfirmed} onChange={e => setAuthorityConfirmed(e.target.checked)} className="accent-blue-600" /> Authority Confirmed</label>
                  <label className="chip"><input type="checkbox" checked={timelineConfirmed} onChange={e => setTimelineConfirmed(e.target.checked)} className="accent-blue-600" /> Timeline Confirmed</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div><label className="label">Competitor</label><input className="input" value={competitor} onChange={e => setCompetitor(e.target.value)} /></div>
                  <div>
                    <label className="label">Risk Level</label>
                    <select className="input" value={riskLevel} onChange={e => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
                  </div>
                  <div className="md:col-span-2"><label className="label">Risk Notes</label><textarea rows={3} className="input resize-none" value={riskNotes} onChange={e => setRiskNotes(e.target.value)} /></div>
                </div>
              </section>

              <section className={sectionCard}>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Execution Plan</h3>
                <div className="space-y-3">
                  <input className="input" value={actionOne} onChange={e => setActionOne(e.target.value)} />
                  <input className="input" value={actionTwo} onChange={e => setActionTwo(e.target.value)} />
                  <input className="input" value={actionThree} onChange={e => setActionThree(e.target.value)} />
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3 pb-2">
                <button type="button" onClick={() => navigate('/pipeline')} className="px-5 py-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-7 py-3 rounded-xl bg-[linear-gradient(90deg,#2563eb,#1d4ed8)] text-white font-black hover:shadow-lg hover:shadow-blue-300/45 transition-all disabled:opacity-70 inline-flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Creating...' : 'Create Deal'}
                </button>
              </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-6 h-fit animate-[fadeIn_500ms_ease-out]">
              <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-[0_20px_36px_-26px_rgba(37,99,235,.6)]">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Deal Snapshot</p>
                <p className="text-2xl font-black text-blue-800 mt-2">{formData.company || 'Your company'}</p>
                <p className="text-sm text-slate-500">{formData.name || 'Primary contact'}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="box"><Gauge size={14} className="text-blue-700" /><p>{probability}%</p><span>Probability</span></div>
                  <div className="box"><Target size={14} className="text-blue-700" /><p>${expectedValue.toLocaleString()}</p><span>Expected</span></div>
                </div>
                <div className="mt-3 boxWide"><Clock3 size={14} className="text-blue-700" /><div><p>{timeline}</p><span>Timeline</span></div></div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Readiness</p>
                <div className="space-y-2 text-sm">
                  {[
                    ['Contact details', !!formData.name && !!formData.email, <UserRound size={14} key="u" />],
                    ['Company and value', !!formData.company && !!formData.value, <Building2 size={14} key="b" />],
                    ['Classification', !!formData.vertical && !!formData.region_rel, <ClipboardCheck size={14} key="c" />],
                    ['Next action', !!nextAction, <CircleDashed size={14} key="d" />],
                  ].map(([label, ok, icon]) => (
                    <div key={label as string} className="item">
                      <span className="inline-flex items-center gap-2 text-slate-600">{icon as React.ReactNode}{label as string}</span>
                      <CheckCircle2 size={16} className={ok ? 'text-emerald-500' : 'text-slate-300'} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-[linear-gradient(160deg,#eff6ff,#ffffff)] p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Deal Guidance</p>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {priority === 'high'
                    ? 'High-priority motion: schedule decision-maker call within 24 hours and share a concise, ROI-led proposal.'
                    : 'Keep momentum: lock next action, confirm authority, and close timeline gaps before negotiation.'}
                </p>
                <div className="mt-3 rounded-xl border border-blue-100 bg-white/80 px-3 py-2 inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                  <ShieldCheck size={14} />
                  Risk: {riskLevel}
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes liftIn { from { opacity: 0; transform: translateY(14px) scale(.99);} to { opacity: 1; transform: translateY(0) scale(1);} }

        .label { display:block; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#64748b; margin-bottom:6px; }
        .labelMini { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#64748b; margin-bottom:6px; }
        .input {
          width:100%; padding:11px 12px; border:1px solid #dbeafe; border-radius:12px; background:#fff;
          color:#0f172a; outline:none; transition:all .22s ease;
        }
        .input:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,.12); }
        .inputWrap { position:relative; }
        .icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; }
        .pad { padding-left:34px; }
        .chip { display:flex; align-items:center; gap:8px; border:1px solid #dbeafe; background:#f8fbff; border-radius:12px; padding:10px 12px; font-weight:700; color:#334155; }
        .box { border:1px solid #dbeafe; border-radius:12px; background:#f8fbff; padding:10px; }
        .box p { font-size:14px; font-weight:900; color:#1d4ed8; margin-top:4px; }
        .box span { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; font-weight:800; }
        .boxWide { border:1px solid #dbeafe; border-radius:12px; background:#f8fbff; padding:10px; display:flex; gap:8px; align-items:center; }
        .boxWide p { font-size:14px; font-weight:900; color:#1d4ed8; }
        .boxWide span { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; font-weight:800; }
        .item { display:flex; align-items:center; justify-content:space-between; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc; padding:9px 10px; }
      `}</style>
    </div>
  );
};

export default AddDealPage;
