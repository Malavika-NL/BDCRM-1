// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   MapPin,
//   Factory,
//   Package,
//   Loader2,
//   DollarSign,
//   CheckCircle2,
//   Target,
//   Clock3,
//   Gauge,
//   ShieldCheck,
//   CircleDashed,
//   ClipboardCheck,
//   Building2,
//   UserRound,
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { LeadStatus } from '../Utils/types';

// const statusFlow: { id: LeadStatus; label: string }[] = [
//   { id: 'new', label: 'New' },
//   { id: 'contacted', label: 'Contacted' },
//   { id: 'negotiation', label: 'Negotiation' },
//   { id: 'won', label: 'Won' },
//   { id: 'lost', label: 'Lost' },
// ];

// export const AddDealPage = () => {
//   const navigate = useNavigate();
//   const [verticals, setVerticals] = useState<any[]>([]);
//   const [regions, setRegions] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loadingConfig, setLoadingConfig] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     phone: '',
//     value: '',
//     status: 'new' as LeadStatus,
//     source: 'cold_outreach',
//     vertical: '',
//     region_rel: '',
//     product_interest: '',
//   });

//   const [notes, setNotes] = useState('');
//   const [nextAction, setNextAction] = useState('Schedule discovery call');
//   const [probability, setProbability] = useState(40);
//   const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
//   const [timeline, setTimeline] = useState('This month');
//   const [decisionMaker, setDecisionMaker] = useState('');
//   const [decisionRole, setDecisionRole] = useState('');
//   const [decisionDate, setDecisionDate] = useState('');
//   const [dealNeed, setDealNeed] = useState('');
//   const [budgetConfirmed, setBudgetConfirmed] = useState(false);
//   const [authorityConfirmed, setAuthorityConfirmed] = useState(false);
//   const [timelineConfirmed, setTimelineConfirmed] = useState(false);
//   const [competitor, setCompetitor] = useState('');
//   const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
//   const [riskNotes, setRiskNotes] = useState('');
//   const [actionOne, setActionOne] = useState('Discovery call');
//   const [actionTwo, setActionTwo] = useState('Share proposal');
//   const [actionThree, setActionThree] = useState('Commercial discussion');

//   useEffect(() => {
//     setLoadingConfig(true);
//     Promise.all([
//       api.getVerticals().catch(() => []),
//       api.getRegions().catch(() => []),
//       api.getProductLines().catch(() => []),
//     ]).then(([vData, rData, pData]) => {
//       setVerticals(vData);
//       setRegions(rData);
//       setProducts(pData);
//       setFormData(prev => ({
//         ...prev,
//         vertical: vData[0]?.id || '',
//         region_rel: rData[0]?.id || '',
//         product_interest: pData[0]?.id || '',
//       }));
//       setLoadingConfig(false);
//     });
//   }, []);

//   const completion = useMemo(() => {
//     const checks = [
//       !!formData.name,
//       !!formData.company,
//       !!formData.email,
//       !!formData.value,
//       !!formData.vertical,
//       !!formData.region_rel,
//       !!formData.product_interest,
//       !!nextAction,
//       !!timeline,
//       !!decisionMaker,
//       !!decisionRole,
//       !!dealNeed,
//     ];
//     const done = checks.filter(Boolean).length;
//     return Math.round((done / checks.length) * 100);
//   }, [formData, nextAction, timeline, decisionMaker, decisionRole, dealNeed]);

//   const valueNumber = Number(formData.value || 0);
//   const expectedValue = Math.round(valueNumber * (probability / 100));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       await api.createLead(formData);
//       navigate('/pipeline');
//     } catch {
//       setError('Failed to create deal. Please check fields and try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const sectionCard =
//     'rounded-3xl border border-blue-100/80 bg-white/90 backdrop-blur-sm shadow-[0_20px_40px_-24px_rgba(30,64,175,0.45)] p-5 md:p-6 animate-[liftIn_600ms_ease-out]';

//   return (
//     <div className="min-h-full overflow-y-auto bg-[radial-gradient(1200px_500px_at_90%_-20%,#bfdbfe_0%,transparent_70%),radial-gradient(900px_420px_at_0%_0%,#dbeafe_0%,transparent_65%),linear-gradient(160deg,#f8fbff_0%,#eef5ff_45%,#f8fbff_100%)] p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <header className="relative overflow-hidden rounded-[28px] border border-blue-200/70 bg-white/85 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_70px_-30px_rgba(37,99,235,0.55)] animate-[fadeIn_450ms_ease-out]">
//           <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-blue-200/70" />
//           <div className="absolute right-20 top-20 h-16 w-16 rounded-full bg-blue-100/80" />

//           <button
//             onClick={() => navigate('/pipeline')}
//             className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 hover:bg-blue-50 transition-colors"
//           >
//             <ArrowLeft size={14} />
//             Pipeline
//           </button>

//           <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-end">
//             <div>
//               <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-500">Deal Builder</p>
//               <h1 className="text-3xl md:text-5xl leading-tight font-black text-blue-800">Add New Deal</h1>
//               <p className="text-slate-600 mt-2 max-w-2xl">A complete workspace to qualify, structure, and launch a strong deal into pipeline.</p>
//             </div>
//             <div className="rounded-2xl border border-blue-100 bg-white p-4">
//               <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider text-slate-500">
//                 <span>Completion</span>
//                 <span className="text-blue-700">{completion}%</span>
//               </div>
//               <div className="mt-2 h-2.5 bg-blue-50 rounded-full overflow-hidden">
//                 <div className="h-full bg-[linear-gradient(90deg,#0ea5e9,#1d4ed8)] transition-all duration-500" style={{ width: `${completion}%` }} />
//               </div>
//               <div className="mt-3 grid grid-cols-3 gap-2 text-center">
//                 <div className="rounded-xl bg-blue-50 py-2">
//                   <p className="text-[10px] font-bold text-slate-500 uppercase">Value</p>
//                   <p className="text-sm font-black text-blue-700">${valueNumber ? valueNumber.toLocaleString() : '0'}</p>
//                 </div>
//                 <div className="rounded-xl bg-blue-50 py-2">
//                   <p className="text-[10px] font-bold text-slate-500 uppercase">Win%</p>
//                   <p className="text-sm font-black text-blue-700">{probability}%</p>
//                 </div>
//                 <div className="rounded-xl bg-blue-50 py-2">
//                   <p className="text-[10px] font-bold text-slate-500 uppercase">Priority</p>
//                   <p className="text-sm font-black text-blue-700">{priority}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {loadingConfig ? (
//           <div className="bg-white rounded-3xl border border-blue-100 p-16 flex flex-col items-center text-slate-500 shadow-sm">
//             <Loader2 className="animate-spin mb-2" size={30} />
//             Loading form details...
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
//             <div className="space-y-6">
//               <section className={sectionCard}>
//                 {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Core Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label">Contact Name</label>
//                     <div className="inputWrap"><UserRound size={15} className="icon" /><input required type="text" className="input pad" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
//                   </div>
//                   <div>
//                     <label className="label">Company</label>
//                     <div className="inputWrap"><Building2 size={15} className="icon" /><input required type="text" className="input pad" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} /></div>
//                   </div>
//                   <div>
//                     <label className="label">Email</label>
//                     <input required type="email" className="input" placeholder="john@acme.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
//                   </div>
//                   <div>
//                     <label className="label">Phone</label>
//                     <input type="tel" className="input" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
//                   </div>
//                 </div>
//               </section>

//               <section className={sectionCard}>
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Classification</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="labelMini"><Factory size={11} /> Vertical</label>
//                     <select className="input" value={formData.vertical} onChange={e => setFormData({ ...formData, vertical: e.target.value })}>
//                       <option value="">Select...</option>
//                       {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="labelMini"><MapPin size={11} /> Region</label>
//                     <select className="input" value={formData.region_rel} onChange={e => setFormData({ ...formData, region_rel: e.target.value })}>
//                       <option value="">Select...</option>
//                       {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="labelMini"><Package size={11} /> Product</label>
//                     <select className="input" value={formData.product_interest} onChange={e => setFormData({ ...formData, product_interest: e.target.value })}>
//                       <option value="">Select...</option>
//                       {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                     </select>
//                   </div>
//                 </div>
//               </section>

//               <section className={sectionCard}>
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Deal Intelligence</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="label">Deal Value ($)</label>
//                     <div className="inputWrap"><DollarSign size={15} className="icon" /><input required type="number" className="input pad" placeholder="50000" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} /></div>
//                   </div>
//                   <div>
//                     <label className="label">Stage</label>
//                     <select className="input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>{statusFlow.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
//                   </div>
//                   <div>
//                     <label className="label">Source</label>
//                     <select className="input" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
//                       <option value="cold_outreach">Cold Call</option><option value="linkedin">LinkedIn</option><option value="referral">Referral</option><option value="website">Website</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="label">Win Probability ({probability}%)</label>
//                     <input type="range" min={5} max={95} step={5} value={probability} onChange={e => setProbability(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer mt-3" />
//                   </div>
//                   <div>
//                     <label className="label">Priority</label>
//                     <select className="input" value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
//                   </div>
//                   <div>
//                     <label className="label">Timeline</label>
//                     <select className="input" value={timeline} onChange={e => setTimeline(e.target.value)}><option>This week</option><option>This month</option><option>Next quarter</option><option>Long-term</option></select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="label">Next Action</label>
//                     <input type="text" className="input" value={nextAction} onChange={e => setNextAction(e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="label">Internal Notes</label>
//                     <input type="text" className="input" value={notes} onChange={e => setNotes(e.target.value)} />
//                   </div>
//                 </div>
//               </section>

//               <section className={sectionCard}>
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Stakeholder & Decision</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div><label className="label">Decision Maker</label><input className="input" value={decisionMaker} onChange={e => setDecisionMaker(e.target.value)} /></div>
//                   <div><label className="label">Role / Title</label><input className="input" value={decisionRole} onChange={e => setDecisionRole(e.target.value)} /></div>
//                   <div><label className="label">Expected Decision Date</label><input type="date" className="input" value={decisionDate} onChange={e => setDecisionDate(e.target.value)} /></div>
//                   <div><label className="label">Core Need</label><input className="input" value={dealNeed} onChange={e => setDealNeed(e.target.value)} placeholder="Main pain point" /></div>
//                 </div>
//               </section>

//               <section className={sectionCard}>
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Qualification & Risk</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <label className="chip"><input type="checkbox" checked={budgetConfirmed} onChange={e => setBudgetConfirmed(e.target.checked)} className="accent-blue-600" /> Budget Confirmed</label>
//                   <label className="chip"><input type="checkbox" checked={authorityConfirmed} onChange={e => setAuthorityConfirmed(e.target.checked)} className="accent-blue-600" /> Authority Confirmed</label>
//                   <label className="chip"><input type="checkbox" checked={timelineConfirmed} onChange={e => setTimelineConfirmed(e.target.checked)} className="accent-blue-600" /> Timeline Confirmed</label>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                   <div><label className="label">Competitor</label><input className="input" value={competitor} onChange={e => setCompetitor(e.target.value)} /></div>
//                   <div>
//                     <label className="label">Risk Level</label>
//                     <select className="input" value={riskLevel} onChange={e => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
//                   </div>
//                   <div className="md:col-span-2"><label className="label">Risk Notes</label><textarea rows={3} className="input resize-none" value={riskNotes} onChange={e => setRiskNotes(e.target.value)} /></div>
//                 </div>
//               </section>

//               <section className={sectionCard}>
//                 <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.12em] mb-4">Execution Plan</h3>
//                 <div className="space-y-3">
//                   <input className="input" value={actionOne} onChange={e => setActionOne(e.target.value)} />
//                   <input className="input" value={actionTwo} onChange={e => setActionTwo(e.target.value)} />
//                   <input className="input" value={actionThree} onChange={e => setActionThree(e.target.value)} />
//                 </div>
//               </section>

//               <div className="flex flex-wrap items-center gap-3 pb-2">
//                 <button type="button" onClick={() => navigate('/pipeline')} className="px-5 py-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold transition-colors">Cancel</button>
//                 <button type="submit" disabled={saving} className="px-7 py-3 rounded-xl bg-[linear-gradient(90deg,#2563eb,#1d4ed8)] text-white font-black hover:shadow-lg hover:shadow-blue-300/45 transition-all disabled:opacity-70 inline-flex items-center gap-2">
//                   {saving && <Loader2 size={16} className="animate-spin" />}
//                   {saving ? 'Creating...' : 'Create Deal'}
//                 </button>
//               </div>
//             </div>

//             <aside className="space-y-4 xl:sticky xl:top-6 h-fit animate-[fadeIn_500ms_ease-out]">
//               <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-[0_20px_36px_-26px_rgba(37,99,235,.6)]">
//                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Deal Snapshot</p>
//                 <p className="text-2xl font-black text-blue-800 mt-2">{formData.company || 'Your company'}</p>
//                 <p className="text-sm text-slate-500">{formData.name || 'Primary contact'}</p>
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <div className="box"><Gauge size={14} className="text-blue-700" /><p>{probability}%</p><span>Probability</span></div>
//                   <div className="box"><Target size={14} className="text-blue-700" /><p>${expectedValue.toLocaleString()}</p><span>Expected</span></div>
//                 </div>
//                 <div className="mt-3 boxWide"><Clock3 size={14} className="text-blue-700" /><div><p>{timeline}</p><span>Timeline</span></div></div>
//               </div>

//               <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
//                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Readiness</p>
//                 <div className="space-y-2 text-sm">
//                   {[
//                     ['Contact details', !!formData.name && !!formData.email, <UserRound size={14} key="u" />],
//                     ['Company and value', !!formData.company && !!formData.value, <Building2 size={14} key="b" />],
//                     ['Classification', !!formData.vertical && !!formData.region_rel, <ClipboardCheck size={14} key="c" />],
//                     ['Next action', !!nextAction, <CircleDashed size={14} key="d" />],
//                   ].map(([label, ok, icon]) => (
//                     <div key={label as string} className="item">
//                       <span className="inline-flex items-center gap-2 text-slate-600">{icon as React.ReactNode}{label as string}</span>
//                       <CheckCircle2 size={16} className={ok ? 'text-emerald-500' : 'text-slate-300'} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="rounded-3xl border border-blue-100 bg-[linear-gradient(160deg,#eff6ff,#ffffff)] p-5 shadow-sm">
//                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Deal Guidance</p>
//                 <p className="text-sm text-slate-700 mt-2 leading-relaxed">
//                   {priority === 'high'
//                     ? 'High-priority motion: schedule decision-maker call within 24 hours and share a concise, ROI-led proposal.'
//                     : 'Keep momentum: lock next action, confirm authority, and close timeline gaps before negotiation.'}
//                 </p>
//                 <div className="mt-3 rounded-xl border border-blue-100 bg-white/80 px-3 py-2 inline-flex items-center gap-2 text-xs font-bold text-blue-700">
//                   <ShieldCheck size={14} />
//                   Risk: {riskLevel}
//                 </div>
//               </div>
//             </aside>
//           </form>
//         )}
//       </div>

//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
//         @keyframes liftIn { from { opacity: 0; transform: translateY(14px) scale(.99);} to { opacity: 1; transform: translateY(0) scale(1);} }

//         .label { display:block; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#64748b; margin-bottom:6px; }
//         .labelMini { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#64748b; margin-bottom:6px; }
//         .input {
//           width:100%; padding:11px 12px; border:1px solid #dbeafe; border-radius:12px; background:#fff;
//           color:#0f172a; outline:none; transition:all .22s ease;
//         }
//         .input:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,.12); }
//         .inputWrap { position:relative; }
//         .icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; }
//         .pad { padding-left:34px; }
//         .chip { display:flex; align-items:center; gap:8px; border:1px solid #dbeafe; background:#f8fbff; border-radius:12px; padding:10px 12px; font-weight:700; color:#334155; }
//         .box { border:1px solid #dbeafe; border-radius:12px; background:#f8fbff; padding:10px; }
//         .box p { font-size:14px; font-weight:900; color:#1d4ed8; margin-top:4px; }
//         .box span { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; font-weight:800; }
//         .boxWide { border:1px solid #dbeafe; border-radius:12px; background:#f8fbff; padding:10px; display:flex; gap:8px; align-items:center; }
//         .boxWide p { font-size:14px; font-weight:900; color:#1d4ed8; }
//         .boxWide span { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; font-weight:800; }
//         .item { display:flex; align-items:center; justify-content:space-between; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc; padding:9px 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default AddDealPage;


// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   MapPin,
//   Factory,
//   Package,
//   Loader2,
//   DollarSign,
//   CheckCircle2,
//   Target,
//   Clock3,
//   Gauge,
//   ShieldCheck,
//   CircleDashed,
//   ClipboardCheck,
//   Building2,
//   UserRound,
//   Briefcase,
//   AlertTriangle,
//   ListChecks,
//   Users,
//   ChevronDown,
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { LeadStatus } from '../Utils/types';

// const statusFlow: { id: LeadStatus; label: string }[] = [
//   { id: 'new',         label: 'New' },
//   { id: 'contacted',   label: 'Contacted' },
//   { id: 'negotiation', label: 'Negotiation' },
//   { id: 'won',         label: 'Won' },
//   { id: 'lost',        label: 'Lost' },
// ];

// /* ── shared classes ── */
// const labelCls = 'block text-[11px] font-semibold text-slate-500 mb-1.5';
// const inputCls = 'w-full px-3 py-2 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 transition-all';
// const selectCls = 'w-full px-3 py-2 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-md appearance-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 transition-all';

// /* ── Section heading — matches Account Workspace style ── */
// const SectionHeading = ({ label }: { label: string }) => (
//   <div className="flex items-center gap-3 mb-5">
//     <div className="w-[3px] h-5 bg-indigo-500 rounded-full shrink-0" />
//     <h2 className="text-[14px] font-bold text-slate-700">{label}</h2>
//   </div>
// );

// /* ── Section block — white card with border, no coloured bg ── */
// const SectionBlock = ({ children }: { children: React.ReactNode }) => (
//   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
//     {children}
//   </div>
// );

// /* ── Sidebar mini card ── */
// const SideCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 ${className}`}>
//     {children}
//   </div>
// );

// const SideHeader = ({ icon, label, iconColor = 'text-indigo-600' }: { icon: React.ReactNode; label: string; iconColor?: string }) => (
//   <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
//     <span className={iconColor}>{icon}</span>
//     <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
//   </div>
// );

// /* ── Select wrapper with chevron ── */
// const SelectField = ({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//   <div className="relative">
//     <select className={`${selectCls} ${className} pr-8`} {...props} />
//     <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//   </div>
// );

// export const AddDealPage = () => {
//   const navigate = useNavigate();
//   const [verticals,     setVerticals]     = useState<any[]>([]);
//   const [regions,       setRegions]       = useState<any[]>([]);
//   const [products,      setProducts]      = useState<any[]>([]);
//   const [loadingConfig, setLoadingConfig] = useState(true);
//   const [saving,        setSaving]        = useState(false);
//   const [error,         setError]         = useState('');

//   const [formData, setFormData] = useState({
//     name:             '',
//     company:          '',
//     email:            '',
//     phone:            '',
//     value:            '',
//     status:           'new' as LeadStatus,
//     source:           'cold_outreach',
//     vertical:         '',
//     region_rel:       '',
//     product_interest: '',
//   });

//   const [notes,              setNotes]              = useState('');
//   const [nextAction,         setNextAction]         = useState('Schedule discovery call');
//   const [probability,        setProbability]        = useState(40);
//   const [priority,           setPriority]           = useState<'low' | 'medium' | 'high'>('medium');
//   const [timeline,           setTimeline]           = useState('This month');
//   const [decisionMaker,      setDecisionMaker]      = useState('');
//   const [decisionRole,       setDecisionRole]       = useState('');
//   const [decisionDate,       setDecisionDate]       = useState('');
//   const [dealNeed,           setDealNeed]           = useState('');
//   const [budgetConfirmed,    setBudgetConfirmed]    = useState(false);
//   const [authorityConfirmed, setAuthorityConfirmed] = useState(false);
//   const [timelineConfirmed,  setTimelineConfirmed]  = useState(false);
//   const [competitor,         setCompetitor]         = useState('');
//   const [riskLevel,          setRiskLevel]          = useState<'low' | 'medium' | 'high'>('medium');
//   const [riskNotes,          setRiskNotes]          = useState('');
//   const [actionOne,          setActionOne]          = useState('Discovery call');
//   const [actionTwo,          setActionTwo]          = useState('Share proposal');
//   const [actionThree,        setActionThree]        = useState('Commercial discussion');

//   useEffect(() => {
//     setLoadingConfig(true);
//     Promise.all([
//       api.getVerticals().catch(() => []),
//       api.getRegions().catch(() => []),
//       api.getProductLines().catch(() => []),
//     ]).then(([vData, rData, pData]) => {
//       setVerticals(vData);
//       setRegions(rData);
//       setProducts(pData);
//       setFormData(prev => ({
//         ...prev,
//         vertical:         vData[0]?.id || '',
//         region_rel:       rData[0]?.id || '',
//         product_interest: pData[0]?.id || '',
//       }));
//       setLoadingConfig(false);
//     });
//   }, []);

//   const completion = useMemo(() => {
//     const checks = [
//       !!formData.name, !!formData.company, !!formData.email, !!formData.value,
//       !!formData.vertical, !!formData.region_rel, !!formData.product_interest,
//       !!nextAction, !!timeline, !!decisionMaker, !!decisionRole, !!dealNeed,
//     ];
//     return Math.round((checks.filter(Boolean).length / checks.length) * 100);
//   }, [formData, nextAction, timeline, decisionMaker, decisionRole, dealNeed]);

//   const valueNumber   = Number(formData.value || 0);
//   const expectedValue = Math.round(valueNumber * (probability / 100));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       await api.createLead(formData);
//       navigate('/pipeline');
//     } catch {
//       setError('Failed to create deal. Please check fields and try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const riskColor = riskLevel === 'high'
//     ? 'text-red-600 bg-red-50 border-red-200'
//     : riskLevel === 'medium'
//     ? 'text-amber-600 bg-amber-50 border-amber-200'
//     : 'text-emerald-600 bg-emerald-50 border-emerald-200';

//   return (
//     <div className="h-full overflow-y-auto bg-[#f4f6fb]">

//       {/* ── PAGE BANNER ── */}
//       <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center gap-3 shrink-0">
//         <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
//           <Briefcase className="text-white" size={15} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <h1 className="text-[14px] font-bold text-white leading-tight">Deal Builder</h1>
//           <p className="text-[11px] text-indigo-200 mt-0.5">Qualify, structure and launch a new deal into pipeline</p>
//         </div>
//         <button
//           onClick={() => navigate('/pipeline')}
//           className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-md transition-colors"
//         >
//           <ArrowLeft size={13} /> Back to Pipeline
//         </button>
//       </div>

//       {/* ── COMPLETION BAR ── */}
//       <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-5 shrink-0">
//         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Completion</span>
//         <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
//             style={{ width: `${completion}%` }}
//           />
//         </div>
//         <span className="text-[12px] font-bold text-indigo-600 shrink-0">{completion}%</span>
//         <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-slate-200">
//           {[
//             { label: 'Value',    value: `$${valueNumber ? valueNumber.toLocaleString() : '0'}` },
//             { label: 'Win%',     value: `${probability}%` },
//             { label: 'Priority', value: priority },
//           ].map(k => (
//             <div key={k.label} className="text-center">
//               <p className="text-[9px] text-slate-400 font-bold uppercase">{k.label}</p>
//               <p className="text-[12px] font-bold text-indigo-700">{k.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       {loadingConfig ? (
//         <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
//           <Loader2 className="animate-spin text-indigo-500" size={28} />
//           <p className="text-[13px] font-medium">Loading form details…</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-5 items-start">

//           {/* ══ LEFT COLUMN ══ */}
//           <div className="space-y-5 min-w-0">

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 rounded-xl flex items-center gap-2.5">
//                 <AlertTriangle size={14} /> {error}
//               </div>
//             )}

//             {/* 1 · Core Details */}
//             <SectionBlock>
//               <SectionHeading label="1. Core Details" />
//               <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//                 <div>
//                   <label className={labelCls}>Contact Name <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <UserRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <input required type="text" className={inputCls + ' pl-9'} placeholder="John Smith"
//                       value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Company <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <input required type="text" className={inputCls + ' pl-9'} placeholder="Acme Corp"
//                       value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Email <span className="text-red-500">*</span></label>
//                   <input required type="email" className={inputCls} placeholder="john@acme.com"
//                     value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Phone</label>
//                   <input type="tel" className={inputCls} placeholder="+91 ..."
//                     value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
//                 </div>
//               </div>
//             </SectionBlock>

//             {/* 2 · Classification */}
//             <SectionBlock>
//               <SectionHeading label="2. Classification" />
//               <div className="grid grid-cols-3 gap-x-6 gap-y-4">
//                 <div>
//                   <label className={labelCls + ' flex items-center gap-1.5'}><Factory size={11} /> Vertical</label>
//                   <SelectField value={formData.vertical} onChange={e => setFormData({ ...formData, vertical: e.target.value })}>
//                     <option value="">Select…</option>
//                     {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
//                   </SelectField>
//                 </div>
//                 <div>
//                   <label className={labelCls + ' flex items-center gap-1.5'}><MapPin size={11} /> Region</label>
//                   <SelectField value={formData.region_rel} onChange={e => setFormData({ ...formData, region_rel: e.target.value })}>
//                     <option value="">Select…</option>
//                     {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
//                   </SelectField>
//                 </div>
//                 <div>
//                   <label className={labelCls + ' flex items-center gap-1.5'}><Package size={11} /> Product</label>
//                   <SelectField value={formData.product_interest} onChange={e => setFormData({ ...formData, product_interest: e.target.value })}>
//                     <option value="">Select…</option>
//                     {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                   </SelectField>
//                 </div>
//               </div>
//             </SectionBlock>

//             {/* 3 · Deal Intelligence */}
//             <SectionBlock>
//               <SectionHeading label="3. Deal Intelligence" />
//               <div className="grid grid-cols-3 gap-x-6 gap-y-4">
//                 <div>
//                   <label className={labelCls}>Deal Value ($) <span className="text-red-500">*</span></label>
//                   <div className="relative">
//                     <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     <input required type="number" className={inputCls + ' pl-9'} placeholder="50000"
//                       value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Stage</label>
//                   <SelectField value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>
//                     {statusFlow.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
//                   </SelectField>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Source</label>
//                   <SelectField value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
//                     <option value="cold_outreach">Cold Call</option>
//                     <option value="linkedin">LinkedIn</option>
//                     <option value="referral">Referral</option>
//                     <option value="website">Website</option>
//                   </SelectField>
//                 </div>

//                 {/* Probability slider — full width */}
//                 <div className="col-span-3">
//                   <label className={labelCls}>Win Probability — <span className="text-indigo-600 font-bold">{probability}%</span></label>
//                   <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3">
//                     <input type="range" min={5} max={95} step={5} value={probability}
//                       onChange={e => setProbability(Number(e.target.value))}
//                       className="w-full accent-indigo-600 cursor-pointer" />
//                     <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
//                       <span>5%</span><span>50%</span><span>95%</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelCls}>Priority</label>
//                   <SelectField value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </SelectField>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Timeline</label>
//                   <SelectField value={timeline} onChange={e => setTimeline(e.target.value)}>
//                     <option>This week</option>
//                     <option>This month</option>
//                     <option>Next quarter</option>
//                     <option>Long-term</option>
//                   </SelectField>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Next Action</label>
//                   <input type="text" className={inputCls} value={nextAction} onChange={e => setNextAction(e.target.value)} />
//                 </div>

//                 <div className="col-span-3">
//                   <label className={labelCls}>Internal Notes</label>
//                   <input type="text" className={inputCls} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any internal context…" />
//                 </div>
//               </div>
//             </SectionBlock>

//             {/* 4 · Stakeholder & Decision */}
//             <SectionBlock>
//               <SectionHeading label="4. Stakeholder & Decision" />
//               <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//                 <div>
//                   <label className={labelCls}>Decision Maker</label>
//                   <input className={inputCls} value={decisionMaker} onChange={e => setDecisionMaker(e.target.value)} placeholder="Name" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Role / Title</label>
//                   <input className={inputCls} value={decisionRole} onChange={e => setDecisionRole(e.target.value)} placeholder="CTO, VP Sales…" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Expected Decision Date</label>
//                   <input type="date" className={inputCls} value={decisionDate} onChange={e => setDecisionDate(e.target.value)} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Core Need</label>
//                   <input className={inputCls} value={dealNeed} onChange={e => setDealNeed(e.target.value)} placeholder="Main pain point" />
//                 </div>
//               </div>
//             </SectionBlock>

//             {/* 5 · Qualification & Risk */}
//             <SectionBlock>
//               <SectionHeading label="5. Qualification & Risk" />
//               {/* BANT */}
//               <div className="grid grid-cols-3 gap-3 mb-5">
//                 {[
//                   { label: 'Budget Confirmed',   state: budgetConfirmed,    set: setBudgetConfirmed },
//                   { label: 'Authority Confirmed', state: authorityConfirmed, set: setAuthorityConfirmed },
//                   { label: 'Timeline Confirmed',  state: timelineConfirmed,  set: setTimelineConfirmed },
//                 ].map(({ label, state, set }) => (
//                   <label key={label}
//                     className={`flex items-center gap-2.5 border rounded-lg px-4 py-3 cursor-pointer transition-all text-[12px] font-semibold select-none ${
//                       state
//                         ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
//                         : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
//                     }`}>
//                     <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="accent-emerald-600 w-3.5 h-3.5" />
//                     {label}
//                   </label>
//                 ))}
//               </div>

//               <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//                 <div>
//                   <label className={labelCls}>Competitor</label>
//                   <input className={inputCls} value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder="Main competitor" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Risk Level</label>
//                   <SelectField value={riskLevel} onChange={e => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </SelectField>
//                 </div>
//                 <div className="col-span-2">
//                   <label className={labelCls}>Risk Notes</label>
//                   <textarea rows={3} className={inputCls + ' resize-none'} value={riskNotes} onChange={e => setRiskNotes(e.target.value)} />
//                 </div>
//               </div>
//             </SectionBlock>

//             {/* 6 · Execution Plan */}
//             <SectionBlock>
//               <SectionHeading label="6. Execution Plan" />
//               <div className="space-y-3">
//                 {[
//                   { label: 'Step 1', value: actionOne,   set: setActionOne },
//                   { label: 'Step 2', value: actionTwo,   set: setActionTwo },
//                   { label: 'Step 3', value: actionThree, set: setActionThree },
//                 ].map(({ label, value, set }, idx) => (
//                   <div key={label} className="flex items-center gap-3">
//                     <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-[11px] font-bold shrink-0">
//                       {idx + 1}
//                     </div>
//                     <input className={`${inputCls} flex-1`} value={value} onChange={e => set(e.target.value)} />
//                   </div>
//                 ))}
//               </div>
//             </SectionBlock>

//             {/* ── Action Buttons ── */}
//             <div className="flex items-center gap-3 pt-2 pb-6">
//               <button type="button" onClick={() => navigate('/pipeline')}
//                 className="px-5 py-2.5 text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" disabled={saving}
//                 className={`px-6 py-2.5 text-[12px] font-bold rounded-lg flex items-center gap-2 transition-all ${
//                   saving
//                     ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white shadow-sm shadow-indigo-500/30'
//                 }`}>
//                 {saving && <Loader2 size={13} className="animate-spin" />}
//                 {saving ? 'Creating…' : 'Create Deal'}
//               </button>
//             </div>
//           </div>

//           {/* ══ RIGHT SIDEBAR ══ */}
//           <aside className="space-y-4 xl:sticky xl:top-4 h-fit">

//             {/* Deal Snapshot */}
//             <SideCard>
//               <SideHeader icon={<Gauge size={14} />} label="Deal Snapshot" />
//               <p className="text-[15px] font-bold text-slate-800 truncate">{formData.company || 'Your company'}</p>
//               <p className="text-[12px] text-slate-500 mb-4">{formData.name || 'Primary contact'}</p>

//               <div className="grid grid-cols-2 gap-2.5 mb-3">
//                 <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
//                   <Gauge size={12} className="text-indigo-500 mb-1.5" />
//                   <p className="text-[10px] text-slate-500 font-medium mb-0.5">Probability</p>
//                   <p className="text-[15px] font-bold text-indigo-700">{probability}%</p>
//                 </div>
//                 <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
//                   <Target size={12} className="text-indigo-500 mb-1.5" />
//                   <p className="text-[10px] text-slate-500 font-medium mb-0.5">Expected</p>
//                   <p className="text-[15px] font-bold text-indigo-700">${expectedValue.toLocaleString()}</p>
//                 </div>
//               </div>

//               <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
//                 <Clock3 size={14} className="text-indigo-500 shrink-0" />
//                 <div>
//                   <p className="text-[10px] text-slate-400 font-medium">Timeline</p>
//                   <p className="text-[13px] font-bold text-slate-700">{timeline}</p>
//                 </div>
//               </div>
//             </SideCard>

//             {/* Readiness */}
//             <SideCard>
//               <SideHeader icon={<ClipboardCheck size={14} />} label="Readiness" iconColor="text-emerald-600" />
//               <div className="space-y-2">
//                 {[
//                   { label: 'Contact details',   ok: !!formData.name && !!formData.email,         icon: <UserRound size={12} /> },
//                   { label: 'Company and value', ok: !!formData.company && !!formData.value,       icon: <Building2 size={12} /> },
//                   { label: 'Classification',    ok: !!formData.vertical && !!formData.region_rel, icon: <ClipboardCheck size={12} /> },
//                   { label: 'Next action',       ok: !!nextAction,                                 icon: <CircleDashed size={12} /> },
//                 ].map(({ label, ok, icon }) => (
//                   <div key={label} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-[12px] font-semibold transition-all ${
//                     ok
//                       ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
//                       : 'bg-slate-50 border-slate-200 text-slate-500'
//                   }`}>
//                     <span className="flex items-center gap-2">{icon}{label}</span>
//                     <CheckCircle2 size={14} className={ok ? 'text-emerald-500' : 'text-slate-300'} />
//                   </div>
//                 ))}
//               </div>
//             </SideCard>

//             {/* Deal Guidance */}
//             <SideCard className="bg-gradient-to-br from-indigo-50/60 to-violet-50/60 border-indigo-100">
//               <SideHeader icon={<ShieldCheck size={14} />} label="Deal Guidance" iconColor="text-violet-600" />
//               <p className="text-[12px] text-slate-600 leading-relaxed">
//                 {priority === 'high'
//                   ? 'High-priority motion: schedule decision-maker call within 24 hours and share a concise, ROI-led proposal.'
//                   : 'Keep momentum: lock next action, confirm authority, and close timeline gaps before negotiation.'}
//               </p>
//               <div className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-bold ${riskColor}`}>
//                 <ShieldCheck size={13} /> Risk: {riskLevel}
//               </div>
//             </SideCard>

//           </aside>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AddDealPage;


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
  Briefcase,
  AlertTriangle,
  Users,
  ChevronDown,
} from 'lucide-react';
import { api } from '../Utils/api';
import type { LeadStatus } from '../Utils/types';

const statusFlow: { id: LeadStatus; label: string }[] = [
  { id: 'new',         label: 'New'         },
  { id: 'contacted',   label: 'Contacted'   },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won',         label: 'Won'         },
  { id: 'lost',        label: 'Lost'        },
];

// ─── shared field classes — BDMTargetCreate style ────────────────────────────
const labelCls  = 'block text-xs font-black text-slate-500 uppercase tracking-widest mb-2';
const inputCls  = 'w-full px-4 py-3.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all';
const selectCls = 'w-full px-4 py-3.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all pr-9';

// ─── SectionHead — exact BDMTargetCreate pattern ─────────────────────────────
const SectionHead = ({
  icon: Icon,
  title,
  subtitle,
  accentColor = 'bg-indigo-500',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  accentColor?: string;
}) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
    <div className={`w-1 self-stretch rounded-full ${accentColor} shrink-0`} />
    <div className="flex items-center gap-2.5">
      <Icon className="text-slate-400 shrink-0" size={16} />
      <div>
        <h3 className="text-[14px] font-black text-slate-800">{title}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  </div>
);

// ─── SectionCard — white card with top accent bar ─────────────────────────────
const SectionCard = ({
  children,
  topGradient = 'from-indigo-500 to-violet-500',
}: {
  children: React.ReactNode;
  topGradient?: string;
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
    <div className={`h-1 w-full bg-gradient-to-r ${topGradient} rounded-t-2xl`} />
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

// ─── SelectField — with chevron ───────────────────────────────────────────────
const SelectField = ({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select className={`${selectCls} ${className}`} {...props} />
    <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

// ─── Sidebar card ─────────────────────────────────────────────────────────────
const SideCard = ({
  children,
  topGradient = 'from-indigo-500 to-violet-500',
  className = '',
}: {
  children: React.ReactNode;
  topGradient?: string;
  className?: string;
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden ${className}`}>
    <div className={`h-1 w-full bg-gradient-to-r ${topGradient}`} />
    <div className="p-5">{children}</div>
  </div>
);

// ─── Sidebar section head ─────────────────────────────────────────────────────
const SideHead = ({
  icon,
  label,
  accentColor = 'bg-indigo-500',
}: {
  icon: React.ReactNode;
  label: string;
  accentColor?: string;
}) => (
  <div className="flex items-start gap-3 pb-3 mb-4 border-b border-slate-100">
    <div className={`w-1 self-stretch rounded-full ${accentColor} shrink-0`} />
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const AddDealPage = () => {
  const navigate = useNavigate();
  const [verticals,     setVerticals]     = useState<any[]>([]);
  const [regions,       setRegions]       = useState<any[]>([]);
  const [products,      setProducts]      = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');

  const [formData, setFormData] = useState({
    name:             '',
    company:          '',
    email:            '',
    phone:            '',
    value:            '',
    status:           'new' as LeadStatus,
    source:           'cold_outreach',
    vertical:         '',
    region_rel:       '',
    product_interest: '',
  });

  const [notes,              setNotes]              = useState('');
  const [nextAction,         setNextAction]         = useState('Schedule discovery call');
  const [probability,        setProbability]        = useState(40);
  const [priority,           setPriority]           = useState<'low' | 'medium' | 'high'>('medium');
  const [timeline,           setTimeline]           = useState('This month');
  const [decisionMaker,      setDecisionMaker]      = useState('');
  const [decisionRole,       setDecisionRole]       = useState('');
  const [decisionDate,       setDecisionDate]       = useState('');
  const [dealNeed,           setDealNeed]           = useState('');
  const [budgetConfirmed,    setBudgetConfirmed]    = useState(false);
  const [authorityConfirmed, setAuthorityConfirmed] = useState(false);
  const [timelineConfirmed,  setTimelineConfirmed]  = useState(false);
  const [competitor,         setCompetitor]         = useState('');
  const [riskLevel,          setRiskLevel]          = useState<'low' | 'medium' | 'high'>('medium');
  const [riskNotes,          setRiskNotes]          = useState('');
  const [actionOne,          setActionOne]          = useState('Discovery call');
  const [actionTwo,          setActionTwo]          = useState('Share proposal');
  const [actionThree,        setActionThree]        = useState('Commercial discussion');

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
        vertical:         vData[0]?.id || '',
        region_rel:       rData[0]?.id || '',
        product_interest: pData[0]?.id || '',
      }));
      setLoadingConfig(false);
    });
  }, []);

  const completion = useMemo(() => {
    const checks = [
      !!formData.name, !!formData.company, !!formData.email, !!formData.value,
      !!formData.vertical, !!formData.region_rel, !!formData.product_interest,
      !!nextAction, !!timeline, !!decisionMaker, !!decisionRole, !!dealNeed,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData, nextAction, timeline, decisionMaker, decisionRole, dealNeed]);

  const valueNumber   = Number(formData.value || 0);
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

  const riskColor = riskLevel === 'high'
    ? 'text-red-600 bg-red-50 border-red-200'
    : riskLevel === 'medium'
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px) scale(0.99); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — identical structure to BDMTargetCreate
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow:  '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          {/* back button */}
          <button
            onClick={() => navigate('/pipeline')}
            className="flex items-center gap-1.5 text-indigo-200 hover:text-white text-xs font-semibold
              bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all shrink-0"
          >
            <ArrowLeft size={14} /> Back to Pipeline
          </button>

          {/* icon block */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Briefcase className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">Deal Builder</h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Qualify, structure and launch a new deal into pipeline.
            </p>
          </div>

          {/* completion pill */}
          <div
            className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Completion</span>
              <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
            <span className="text-[16px] font-black text-white">{completion}%</span>
          </div>

          {/* KPI pills */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {[
              { label: 'Value',    value: `$${valueNumber ? valueNumber.toLocaleString() : '0'}` },
              { label: 'Win %',    value: `${probability}%` },
              { label: 'Priority', value: priority },
            ].map(k => (
              <div
                key={k.label}
                className="text-center px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-[9px] text-indigo-300 font-black uppercase tracking-widest">{k.label}</p>
                <p className="text-[13px] font-black text-white capitalize">{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {loadingConfig ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[13px] font-medium text-slate-400">Loading form details…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-4 items-start mt-1">

            {/* ══ LEFT COLUMN ══ */}
            <div className="space-y-4 min-w-0">

              {/* error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3.5 rounded-2xl flex items-center gap-2.5 font-medium">
                  <AlertTriangle size={14} className="shrink-0" /> {error}
                </div>
              )}

              {/* ── 1. Core Details ── */}
              <SectionCard topGradient="from-indigo-500 to-violet-500" >
                <SectionHead
                  icon={UserRound}
                  title="1. Core Details"
                  subtitle="Primary contact and company information."
                  accentColor="bg-indigo-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Contact Name <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <UserRound size={14} className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
                      <input required type="text" className={inputCls + ' pl-11'} placeholder="John Smith"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Company <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
                      <input required type="text" className={inputCls + ' pl-11'} placeholder="Acme Corp"
                        value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Email <span className="text-rose-400">*</span></label>
                    <input required type="email" className={inputCls} placeholder="john@acme.com"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Phone</label>
                    <input type="tel" className={inputCls} placeholder="+91 …"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </SectionCard>

              {/* ── 2. Classification ── */}
              <SectionCard topGradient="from-emerald-500 to-teal-400">
                <SectionHead
                  icon={Factory}
                  title="2. Classification"
                  subtitle="Assign vertical, region and product focus."
                  accentColor="bg-emerald-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                  <div className="space-y-2">
                    <label className={labelCls + ' flex items-center gap-1.5'}><Factory size={11} /> Vertical</label>
                    <SelectField value={formData.vertical} onChange={e => setFormData({ ...formData, vertical: e.target.value })}>
                      <option value="">Select…</option>
                      {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </SelectField>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls + ' flex items-center gap-1.5'}><MapPin size={11} /> Region</label>
                    <SelectField value={formData.region_rel} onChange={e => setFormData({ ...formData, region_rel: e.target.value })}>
                      <option value="">Select…</option>
                      {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </SelectField>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls + ' flex items-center gap-1.5'}><Package size={11} /> Product</label>
                    <SelectField value={formData.product_interest} onChange={e => setFormData({ ...formData, product_interest: e.target.value })}>
                      <option value="">Select…</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </SelectField>
                  </div>
                </div>
              </SectionCard>

              {/* ── 3. Deal Intelligence ── */}
              <SectionCard topGradient="from-blue-500 to-cyan-400">
                <SectionHead
                  icon={Gauge}
                  title="3. Deal Intelligence"
                  subtitle="Value, stage, probability and deal timeline."
                  accentColor="bg-blue-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Deal Value ($) <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
                      <input required type="number" className={inputCls + ' pl-11'} placeholder="50000"
                        value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Stage</label>
                    <SelectField value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>
                      {statusFlow.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </SelectField>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Source</label>
                    <SelectField value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                      <option value="cold_outreach">Cold Call</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="website">Website</option>
                    </SelectField>
                  </div>

                  {/* Probability slider — full width */}
                  <div className="sm:col-span-3 space-y-2">
                    <label className={labelCls}>
                      Win Probability —{' '}
                      <span className="text-indigo-600 normal-case font-black">{probability}%</span>
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                      <input type="range" min={5} max={95} step={5} value={probability}
                        onChange={e => setProbability(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-black">
                        <span>5%</span><span>50%</span><span>95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Priority</label>
                    <SelectField value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </SelectField>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Timeline</label>
                    <SelectField value={timeline} onChange={e => setTimeline(e.target.value)}>
                      <option>This week</option>
                      <option>This month</option>
                      <option>Next quarter</option>
                      <option>Long-term</option>
                    </SelectField>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Next Action</label>
                    <input type="text" className={inputCls} value={nextAction} onChange={e => setNextAction(e.target.value)} />
                  </div>

                  <div className="sm:col-span-3 space-y-2">
                    <label className={labelCls}>Internal Notes</label>
                    <input type="text" className={inputCls} value={notes}
                      onChange={e => setNotes(e.target.value)} placeholder="Any internal context…" />
                  </div>
                </div>
              </SectionCard>

              {/* ── 4. Stakeholder & Decision ── */}
              <SectionCard topGradient="from-violet-500 to-purple-400">
                <SectionHead
                  icon={Users}
                  title="4. Stakeholder & Decision"
                  subtitle="Who decides, when, and what's the core need."
                  accentColor="bg-violet-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="space-y-2">
                    <label className={labelCls}>Decision Maker</label>
                    <input className={inputCls} value={decisionMaker}
                      onChange={e => setDecisionMaker(e.target.value)} placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Role / Title</label>
                    <input className={inputCls} value={decisionRole}
                      onChange={e => setDecisionRole(e.target.value)} placeholder="CTO, VP Sales…" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Expected Decision Date</label>
                    <input type="date" className={inputCls} value={decisionDate}
                      onChange={e => setDecisionDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Core Need</label>
                    <input className={inputCls} value={dealNeed}
                      onChange={e => setDealNeed(e.target.value)} placeholder="Main pain point" />
                  </div>
                </div>
              </SectionCard>

              {/* ── 5. Qualification & Risk ── */}
              <SectionCard topGradient="from-amber-400 to-orange-400">
                <SectionHead
                  icon={ShieldCheck}
                  title="5. Qualification & Risk"
                  subtitle="BANT checklist, competitors and risk assessment."
                  accentColor="bg-amber-400"
                />
                {/* BANT toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 mb-5">
                  {[
                    { label: 'Budget Confirmed',   state: budgetConfirmed,    set: setBudgetConfirmed },
                    { label: 'Authority Confirmed', state: authorityConfirmed, set: setAuthorityConfirmed },
                    { label: 'Timeline Confirmed',  state: timelineConfirmed,  set: setTimelineConfirmed },
                  ].map(({ label, state, set }) => (
                    <label
                      key={label}
                      className={`flex items-center gap-2.5 border-2 rounded-xl px-4 py-3.5 cursor-pointer
                        transition-all text-[12px] font-black select-none ${
                        state
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <input type="checkbox" checked={state}
                        onChange={e => set(e.target.checked)} className="accent-emerald-600 w-3.5 h-3.5" />
                      {label}
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelCls}>Competitor</label>
                    <input className={inputCls} value={competitor}
                      onChange={e => setCompetitor(e.target.value)} placeholder="Main competitor" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Risk Level</label>
                    <SelectField value={riskLevel}
                      onChange={e => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </SelectField>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className={labelCls}>Risk Notes</label>
                    <textarea rows={3} className={inputCls + ' resize-none min-h-[80px]'}
                      value={riskNotes} onChange={e => setRiskNotes(e.target.value)} />
                  </div>
                </div>
              </SectionCard>

              {/* ── 6. Execution Plan ── */}
              <SectionCard topGradient="from-rose-500 to-pink-400">
                <SectionHead
                  icon={ClipboardCheck}
                  title="6. Execution Plan"
                  subtitle="Lay out the three key steps to close this deal."
                  accentColor="bg-rose-500"
                />
                <div className="space-y-3 mt-5">
                  {[
                    { label: 'Step 1', value: actionOne,   set: setActionOne },
                    { label: 'Step 2', value: actionTwo,   set: setActionTwo },
                    { label: 'Step 3', value: actionThree, set: setActionThree },
                  ].map(({ label, value, set }, idx) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
                        style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)' }}
                      >
                        {idx + 1}
                      </div>
                      <input className={`${inputCls} flex-1`} value={value}
                        onChange={e => set(e.target.value)} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* ── Footer actions ── */}
              <div className="flex items-center justify-end gap-3 pt-1 pb-6">
                <button
                  type="button"
                  onClick={() => navigate('/pipeline')}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-500
                    bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3 text-white rounded-xl text-sm font-black
                    flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
                    boxShadow:  '0 4px 18px rgba(79,70,229,0.40)',
                  }}
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Creating…' : 'Create Deal'}
                </button>
              </div>
            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <aside className="space-y-4 xl:sticky xl:top-4 h-fit anim-fade-3">

              {/* Deal Snapshot */}
              <SideCard topGradient="from-indigo-500 to-violet-500">
                <SideHead icon={<Gauge size={14} />} label="Deal Snapshot" accentColor="bg-indigo-500" />
                <p className="text-[15px] font-black text-slate-800 truncate">
                  {formData.company || 'Your company'}
                </p>
                <p className="text-[12px] text-slate-400 mb-4 font-medium">
                  {formData.name || 'Primary contact'}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
                    <Gauge size={13} className="text-indigo-400 mb-1.5" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Probability</p>
                    <p className="text-[16px] font-black text-indigo-700">{probability}%</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
                    <Target size={13} className="text-indigo-400 mb-1.5" />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Expected</p>
                    <p className="text-[16px] font-black text-indigo-700">${expectedValue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Clock3 size={14} className="text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Timeline</p>
                    <p className="text-[13px] font-black text-slate-700">{timeline}</p>
                  </div>
                </div>
              </SideCard>

              {/* Readiness */}
              <SideCard topGradient="from-emerald-500 to-teal-400">
                <SideHead icon={<ClipboardCheck size={14} />} label="Readiness" accentColor="bg-emerald-500" />
                <div className="space-y-2">
                  {[
                    { label: 'Contact details',   ok: !!formData.name && !!formData.email,         icon: <UserRound size={12} /> },
                    { label: 'Company and value', ok: !!formData.company && !!formData.value,       icon: <Building2 size={12} /> },
                    { label: 'Classification',    ok: !!formData.vertical && !!formData.region_rel, icon: <ClipboardCheck size={12} /> },
                    { label: 'Next action',       ok: !!nextAction,                                 icon: <CircleDashed size={12} /> },
                  ].map(({ label, ok, icon }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border
                        text-[12px] font-black transition-all ${
                        ok
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">{icon}{label}</span>
                      <CheckCircle2 size={14} className={ok ? 'text-emerald-500' : 'text-slate-200'} />
                    </div>
                  ))}
                </div>
              </SideCard>

              {/* Deal Guidance */}
              <SideCard topGradient="from-violet-500 to-purple-400">
                <SideHead icon={<ShieldCheck size={14} />} label="Deal Guidance" accentColor="bg-violet-500" />
                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                  {priority === 'high'
                    ? 'High-priority motion: schedule decision-maker call within 24 hours and share a concise, ROI-led proposal.'
                    : 'Keep momentum: lock next action, confirm authority, and close timeline gaps before negotiation.'}
                </p>
                <div className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-black ${riskColor}`}>
                  <ShieldCheck size={13} /> Risk: {riskLevel}
                </div>
              </SideCard>

            </aside>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDealPage;