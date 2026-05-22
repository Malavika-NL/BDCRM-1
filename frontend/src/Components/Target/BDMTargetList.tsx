// import React, { useEffect, useState } from 'react';
// import { 
//   Target, Plus, TrendingUp, BarChart3, ClipboardCheck, 
//   X, AlertTriangle, MapPin, Briefcase, Package, 
//   ChevronRight, Calendar, DollarSign, Users, Activity
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// // --- REVIEW MODAL COMPONENT (Remains Unchanged) ---
// const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
//   const [reviewData, setReviewData] = useState({ 
//     summary: '', findings: '', action_plan: '', review_date: new Date().toISOString().split('T')[0] 
//   });

//   if (!isOpen || !target) return null;

//   return (
//     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//       <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
//         <div className="bg-slate-900 p-6 flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-white flex items-center gap-2">
//               <ClipboardCheck className="text-amber-400"/> PDCA Review
//             </h3>
//             <p className="text-slate-400 text-sm mt-1">{target.name}</p>
//           </div>
//           <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 transition-colors"><X size={20} /></button>
//         </div>
        
//         <div className="p-6 space-y-5 bg-slate-50">
//           <div className="space-y-1.5">
//              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Performance Summary</label>
//              <input className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. Missed Printer Target by 20%" value={reviewData.summary} onChange={e => setReviewData({...reviewData, summary: e.target.value})} />
//           </div>
//           <div className="space-y-1.5">
//              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Root Cause (Findings)</label>
//              <textarea className="w-full p-3.5 bg-white border border-slate-200 rounded-xl h-24 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Why did this happen?" value={reviewData.findings} onChange={e => setReviewData({...reviewData, findings: e.target.value})} />
//           </div>
//           <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm relative overflow-hidden">
//              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
//              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={14}/> Corrective Action Plan (Act)</label>
//              <textarea className="w-full p-3.5 bg-white border border-amber-200 rounded-xl h-24 resize-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm" placeholder="Steps for next cycle..." value={reviewData.action_plan} onChange={e => setReviewData({...reviewData, action_plan: e.target.value})} />
//           </div>
//         </div>

//         <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
//           <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
//           <button onClick={() => onSubmit(target.id, reviewData)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all">Save Review <ChevronRight size={16} /></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const BDMTargetsList = () => {
//   const navigate = useNavigate(); // ADDED HOOK
//   const [dashboard, setDashboard] = useState<any>(null);
//   const [targets, setTargets] = useState<any[]>([]);
//   const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);

//   const loadData = async () => {
//     try {
//       const dashRes = await fetch(`${API_BASE}/bdm-targets/dashboard/`);
//       setDashboard(await dashRes.json());
//       const listRes = await fetch(`${API_BASE}/bdm-targets/`);
//       setTargets(await listRes.json());
//     } catch(e) { console.error(e); }
//   };

//   useEffect(() => { loadData(); }, []);

//   const submitReview = async (id: number, data: any) => {
//     await fetch(`${API_BASE}/bdm-targets/${id}/add_review/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
//     setActiveReviewTarget(null);
//     alert("PDCA Cycle Updated Successfully!");
//     loadData();
//   };

//   const getTypeIcon = (type: string) => {
//     switch(type) {
//       case 'region': return <MapPin size={18} className="text-blue-500" />;
//       case 'vertical': return <Briefcase size={18} className="text-purple-500" />;
//       case 'product': return <Package size={18} className="text-emerald-500" />;
//       default: return <Target size={18} className="text-slate-500" />;
//     }
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
//       {/* PREMIUM HEADER */}
//       <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl shadow-slate-900/10 shrink-0">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
//         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
//         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="flex items-center gap-5">
//             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
//               <Target className="text-blue-400" size={32} />
//             </div>
//             <div>
//               <h2 className="text-3xl font-black text-white tracking-tight">Business Targets (PDCA)</h2>
//               <p className="text-slate-400 mt-1 text-lg">Manage strategic goals across regions, verticals, and products.</p>
//             </div>
//           </div>
          
//           {/* UPDATED BUTTON: Now Navigates to new page */}
//           <button 
//             onClick={() => navigate('/bdm-targets/new')} 
//             className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30"
//           >
//             <Plus size={18} /> Set New Target
//           </button>
//         </div>
//       </div>

//       {/* DASHBOARD STATS */}
//       {dashboard && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//           <InfoCard title="Active Plans" value={dashboard.active_targets} icon={<Activity size={24} />} color="blue" />
//           <InfoCard title="Avg Target Progress" value={`${dashboard.avg_progress}%`} icon={<TrendingUp size={24} />} color="emerald" />
//           <InfoCard title="Total Leads Goal" value={dashboard.target_leads.toLocaleString()} icon={<Users size={24} />} color="purple" />
//           <InfoCard title="Total Revenue Goal" value={`$${(dashboard.target_revenue).toLocaleString()}`} icon={<DollarSign size={24} />} color="amber" />
//         </div>
//       )}

//       {/* TARGET LIST */}
//       <div className="space-y-5">
//         {targets.length === 0 && (
//           <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-3xl">
//             <Target className="mx-auto text-slate-300 mb-4" size={48} />
//             <h3 className="text-xl font-bold text-slate-700">No Targets Set Yet</h3>
//             <p className="text-slate-500 mt-2 mb-6">Create your first strategic goal to start tracking progress.</p>
//             <button onClick={() => navigate('/bdm-targets/new')} className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20">Set First Target</button>
//           </div>
//         )}

//         {targets.map((target) => {
//           const progress = target.progress || 0;
//           const isCompleted = progress >= 100;
//           const progressColor = isCompleted ? 'from-emerald-400 to-emerald-500' : 'from-blue-500 to-indigo-500';

//           return (
//             <div key={target.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
//               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
//                     {getTypeIcon(target.target_type)}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-slate-800 text-xl leading-tight group-hover:text-blue-600 transition-colors">{target.name}</h3>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
//                         {getTypeIcon(target.target_type)} {target.target_type}
//                       </span>
//                       <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${target.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
//                         {target.status}
//                       </span>
//                       <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
//                         <Calendar size={12}/> {new Date(target.start_date).toLocaleDateString()} - {new Date(target.end_date).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <button 
//                   onClick={() => setActiveReviewTarget(target)} 
//                   className="bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
//                 >
//                   <ClipboardCheck size={16}/> PDCA Review
//                 </button>
//               </div>

//               <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-5">
//                  <div className="flex justify-between items-end mb-2">
//                    <span className="text-sm font-bold text-slate-700">Goal Completion</span>
//                    <span className={`text-xl font-black ${isCompleted ? 'text-emerald-500' : 'text-blue-600'}`}>{progress}%</span>
//                  </div>
//                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
//                    <div className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 relative`} style={{ width: `${Math.min(progress, 100)}%` }}>
//                       <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
//                    </div>
//                  </div>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
//                   <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Target Leads</span> 
//                   <span className="text-lg font-black text-slate-700">{target.target_leads.toLocaleString()}</span>
//                 </div>
//                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
//                   <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Leads Won</span> 
//                   <span className="text-lg font-black text-emerald-600">{target.achieved_leads.toLocaleString()}</span>
//                 </div>
//                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
//                   <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Revenue Goal</span> 
//                   <span className="text-lg font-black text-slate-700">${parseFloat(target.target_revenue).toLocaleString()}</span>
//                 </div>
//                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
//                   <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Current Rev</span> 
//                   <span className="text-lg font-black text-emerald-600">${parseFloat(target.achieved_revenue).toLocaleString()}</span>
//                 </div>
//               </div>

//             </div>
//           );
//         })}
//       </div>

//       <ReviewModal isOpen={!!activeReviewTarget} onClose={() => setActiveReviewTarget(null)} target={activeReviewTarget} onSubmit={submitReview} />
//     </div>
//   );
// };

// const InfoCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: 'blue' | 'emerald' | 'purple' | 'amber' }) => {
//   const colorMap = {
//     blue: 'from-blue-500 to-cyan-500 shadow-blue-500/20 text-blue-50',
//     emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-50',
//     purple: 'from-purple-500 to-indigo-500 shadow-purple-500/20 text-purple-50',
//     amber: 'from-amber-500 to-orange-500 shadow-amber-500/20 text-amber-50',
//   };

//   return (
//     <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
//       <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
//       <div className="flex justify-between items-start relative z-10">
//         <div><p className="text-sm font-semibold opacity-90 uppercase tracking-wider">{title}</p><h3 className="text-3xl font-black text-white mt-2">{value}</h3></div>
//         <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-white">{icon}</div>
//       </div>
//     </div>
//   );
// };

// export default BDMTargetsList;

// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   Target, Plus, TrendingUp, ClipboardCheck, 
//   X, AlertTriangle, MapPin, Briefcase, Package, 
//   ChevronRight, Calendar, DollarSign, Users, Activity
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// // ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
// const AnimatedNumber: React.FC<{ value: number | string }> = ({ value }) => {
//   const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
//   const [display, setDisplay] = useState(0);
//   const raf = useRef<number | null>(null);

//   useEffect(() => {
//     const start    = performance.now();
//     const duration = 900;
//     const tick     = (now: number) => {
//       const p     = Math.min((now - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - p, 3);
//       setDisplay(Math.round(eased * numeric));
//       if (p < 1) raf.current = requestAnimationFrame(tick);
//     };
//     raf.current = requestAnimationFrame(tick);
//     return () => { if (raf.current) cancelAnimationFrame(raf.current); };
//   }, [numeric]);

//   return <>{display}</>;
// };

// // ─── STAT CARD ───────────────────────────────────────────────────────────────
// interface StatCardProps {
//   title: string;
//   value: number | string;
//   gradient: string;
//   icon: React.FC<any>;
//   sub: string;
//   delay: number;
//   prefix?: string;
//   suffix?: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, gradient, icon: Icon, sub, delay, prefix = '', suffix = '' }) => {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setVisible(true), delay);
//     return () => clearTimeout(t);
//   }, [delay]);

//   const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

//   return (
//     <div
//       className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md
//         transition-all duration-500 ease-out ${gradient}
//         ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
//     >
//       <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
//       <div className="absolute -right-1  top-8  h-12 w-12 rounded-full bg-white/10" />
//       <div className="relative flex items-start justify-between gap-2">
//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 mb-1.5">{title}</p>
//           <p className="text-[2rem] font-black leading-none tabular-nums">
//             {prefix}{visible ? <AnimatedNumber value={numeric} /> : 0}{suffix}
//           </p>
//           <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>
//         </div>
//         <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
//           <Icon size={17} strokeWidth={2.5} />
//         </span>
//       </div>
//     </div>
//   );
// };

// // ─── type helpers ─────────────────────────────────────────────────────────────
// const getTypeAccent = (type: string) => {
//   switch (type) {
//     case 'region':   return 'from-blue-500 to-cyan-400';
//     case 'vertical': return 'from-purple-500 to-fuchsia-400';
//     case 'product':  return 'from-emerald-500 to-teal-400';
//     default:         return 'from-indigo-500 to-violet-400';
//   }
// };

// const getTypeBadge = (type: string) => {
//   switch (type) {
//     case 'region':   return 'bg-blue-50 border-blue-200 text-blue-700';
//     case 'vertical': return 'bg-purple-50 border-purple-200 text-purple-700';
//     case 'product':  return 'bg-emerald-50 border-emerald-200 text-emerald-700';
//     default:         return 'bg-slate-50 border-slate-200 text-slate-600';
//   }
// };

// // ─── REVIEW MODAL — all functions unchanged ───────────────────────────────────
// const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
//   const [reviewData, setReviewData] = useState({ 
//     summary: '', findings: '', action_plan: '', review_date: new Date().toISOString().split('T')[0] 
//   });

//   if (!isOpen || !target) return null;

//   return (
//     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//       <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
//         {/* modal header — matches banner gradient */}
//         <div
//           className="p-6 flex justify-between items-center"
//           style={{ background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)' }}
//         >
//           <div>
//             <h3 className="text-xl font-bold text-white flex items-center gap-2">
//               <ClipboardCheck className="text-white/80" /> PDCA Review
//             </h3>
//             <p className="text-indigo-200 text-sm mt-1">{target.name}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-5 bg-slate-50">
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Performance Summary</label>
//             <input
//               className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
//               placeholder="e.g. Missed Printer Target by 20%"
//               value={reviewData.summary}
//               onChange={e => setReviewData({...reviewData, summary: e.target.value})}
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Root Cause (Findings)</label>
//             <textarea
//               className="w-full p-3.5 bg-white border border-slate-200 rounded-xl h-24 resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
//               placeholder="Why did this happen?"
//               value={reviewData.findings}
//               onChange={e => setReviewData({...reviewData, findings: e.target.value})}
//             />
//           </div>
//           <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-2xl" />
//             <label className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
//               <AlertTriangle size={14} /> Corrective Action Plan (Act)
//             </label>
//             <textarea
//               className="w-full p-3.5 bg-white border border-amber-200 rounded-xl h-24 resize-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm"
//               placeholder="Steps for next cycle..."
//               value={reviewData.action_plan}
//               onChange={e => setReviewData({...reviewData, action_plan: e.target.value})}
//             />
//           </div>
//         </div>

//         <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSubmit(target.id, reviewData)}
//             className="px-6 py-2.5 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
//             style={{
//               background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//               boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
//             }}
//             onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
//             onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//           >
//             Save Review <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export const BDMTargetsList = () => {
//   const navigate = useNavigate();
//   const [dashboard, setDashboard]                   = useState<any>(null);
//   const [targets, setTargets]                       = useState<any[]>([]);
//   const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);

//   // ── all data functions unchanged ──
//   const loadData = async () => {
//     try {
//       const dashRes = await fetch(`${API_BASE}/bdm-targets/dashboard/`);
//       setDashboard(await dashRes.json());
//       const listRes = await fetch(`${API_BASE}/bdm-targets/`);
//       setTargets(await listRes.json());
//     } catch(e) { console.error(e); }
//   };

//   useEffect(() => { loadData(); }, []);

//   const submitReview = async (id: number, data: any) => {
//     await fetch(`${API_BASE}/bdm-targets/${id}/add_review/`, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(data),
//     });
//     setActiveReviewTarget(null);
//     alert("PDCA Cycle Updated Successfully!");
//     loadData();
//   };

//   const getTypeIcon = (type: string) => {
//     switch(type) {
//       case 'region':   return <MapPin    size={18} className="text-blue-500"    />;
//       case 'vertical': return <Briefcase size={18} className="text-purple-500"  />;
//       case 'product':  return <Package   size={18} className="text-emerald-500" />;
//       default:         return <Target    size={18} className="text-slate-500"   />;
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       {/* ── keyframes ── */}
//       <style>{`
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px) translateX(0px); }
//           50%      { transform: translateY(-10px) translateX(6px); }
//         }
//         @keyframes fadeUp {
//           from { opacity:0; transform:translateY(16px) scale(0.99); }
//           to   { opacity:1; transform:translateY(0px) scale(1); }
//         }
//         @keyframes shimmer {
//           0%   { transform: translateX(-100%); }
//           100% { transform: translateX(200%); }
//         }
//         .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//       `}</style>

//       {/* ══════════════════════════════════════════════════════════════════
//           BANNER — exact same structure as Dashboard:
//           shrink-0  mx-4  mt-4  rounded-2xl  overflow-hidden
//           inline style: linear-gradient + boxShadow
//           inner div: radial-gradient backgroundImage overlay
//       ══════════════════════════════════════════════════════════════════ */}
//       <div
//         className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
//         style={{
//           background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//           boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
//         }}
//       >
//         <div
//           className="px-6 py-5 flex items-center gap-4 flex-wrap"
//           style={{
//             backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
//           }}
//         >
//           {/* icon block — identical to Dashboard */}
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(4px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//             }}
//           >
//             <Target className="text-white" size={20} />
//           </div>

//           {/* text */}
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               Business Targets (PDCA)
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Manage strategic goals across regions, verticals, and products.
//             </p>
//           </div>

//           {/* white pill button — identical to Dashboard "Add Lead" */}
//           <button
//             onClick={() => navigate('/bdm-targets/new')}
//             className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-black transition-all shrink-0"
//             style={{
//               backgroundColor: '#ffffff',
//               color: '#4f46e5',
//               boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
//             }}
//             onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ede9fe')}
//             onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
//           >
//             <Plus size={14} /> Set New Target
//           </button>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY — same as Dashboard: flex-1 overflow-y-auto p-4 ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs — contained, won't affect layout */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* ── STAT CARDS ── */}
//         {dashboard && (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 anim-fade-2">
//             <StatCard
//               title="Active Plans"
//               value={Number(dashboard.active_targets ?? 0)}
//               gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
//               icon={Activity}
//               sub="ongoing"
//               delay={0}
//             />
//             <StatCard
//               title="Avg Progress"
//               value={Number(dashboard.avg_progress ?? 0)}
//               gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
//               icon={TrendingUp}
//               sub="completion"
//               suffix="%"
//               delay={80}
//             />
//             <StatCard
//               title="Total Leads Goal"
//               value={Number(dashboard.target_leads ?? 0)}
//               gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
//               icon={Users}
//               sub="across all targets"
//               delay={160}
//             />
//             <StatCard
//               title="Revenue Goal"
//               value={Number(dashboard.target_revenue ?? 0)}
//               gradient="bg-gradient-to-br from-amber-400 to-orange-500"
//               icon={DollarSign}
//               sub="total target"
//               prefix="$"
//               delay={240}
//             />
//           </div>
//         )}

//         {/* ── SECTION LABEL ── */}
//         {targets.length > 0 && (
//           <div className="anim-fade-3">
//             <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
//               All Targets
//               <span className="ml-1.5 normal-case font-normal tracking-normal text-slate-300">
//                 ({targets.length})
//               </span>
//             </p>
//           </div>
//         )}

//         {/* ── TARGET CARDS ── */}
//         <div className="space-y-4 anim-fade-3">

//           {/* empty state */}
//           {targets.length === 0 && (
//             <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <Target className="mx-auto text-indigo-300 mb-3" size={36} />
//               <p className="text-sm font-semibold text-slate-600">No Targets Set Yet</p>
//               <p className="text-xs text-slate-400 mt-1 mb-4">
//                 Create your first strategic goal to start tracking progress.
//               </p>
//               <button
//                 onClick={() => navigate('/bdm-targets/new')}
//                 className="text-white px-5 py-2 rounded-xl text-sm font-black inline-flex items-center gap-2 transition-all"
//                 style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}
//               >
//                 <Plus size={14} /> Set First Target
//               </button>
//             </div>
//           )}

//           {targets.map((target) => {
//             const progress     = target.progress || 0;
//             const isCompleted  = progress >= 100;
//             const progressGrad = isCompleted ? 'from-emerald-400 to-emerald-500' : 'from-indigo-500 to-violet-500';
//             const typeAccent   = getTypeAccent(target.target_type);
//             const typeBadge    = getTypeBadge(target.target_type);

//             return (
//               <div
//                 key={target.id}
//                 className="bg-white rounded-2xl border border-slate-200/80 shadow-sm
//                   hover:shadow-lg hover:-translate-y-0.5
//                   transition-all duration-300 overflow-hidden group"
//               >
//                 {/* type colour accent bar */}
//                 <div className={`h-1.5 w-full bg-gradient-to-r ${typeAccent}`} />

//                 <div className="p-5">
//                   {/* card header */}
//                   <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-5">
//                     <div className="flex items-start gap-4">
//                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
//                         {getTypeIcon(target.target_type)}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
//                           {target.name}
//                         </h3>
//                         <div className="flex flex-wrap gap-1.5 mt-2">
//                           {/* type badge */}
//                           <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${typeBadge}`}>
//                             {getTypeIcon(target.target_type)}
//                             <span className="capitalize">{target.target_type}</span>
//                           </span>
//                           {/* status badge */}
//                           <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
//                             target.status === 'active'
//                               ? 'bg-emerald-100 text-emerald-700'
//                               : 'bg-slate-100 text-slate-500'
//                           }`}>
//                             <span className={`h-1.5 w-1.5 rounded-full ${
//                               target.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
//                             }`} />
//                             {target.status.toUpperCase()}
//                           </span>
//                           {/* date badge */}
//                           <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-50 border border-slate-100">
//                             <Calendar size={11} />
//                             {new Date(target.start_date).toLocaleDateString()} – {new Date(target.end_date).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* PDCA review button */}
//                     <button
//                       onClick={() => setActiveReviewTarget(target)}
//                       className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
//                         bg-amber-50 border border-amber-200 text-amber-600
//                         hover:bg-amber-100 transition-all shadow-sm shrink-0"
//                     >
//                       <ClipboardCheck size={14} /> PDCA Review
//                     </button>
//                   </div>

//                   {/* progress bar */}
//                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
//                     <div className="flex justify-between items-end mb-2">
//                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Goal Completion</span>
//                       <span className={`text-xl font-black ${isCompleted ? 'text-emerald-500' : 'text-indigo-600'}`}>
//                         {progress}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
//                       <div
//                         className={`h-full rounded-full bg-gradient-to-r ${progressGrad} transition-all duration-1000 relative`}
//                         style={{ width: `${Math.min(progress, 100)}%` }}
//                       >
//                         <div className="absolute inset-0 overflow-hidden rounded-full">
//                           <div className="absolute inset-0 bg-white/25 animate-[shimmer_2s_infinite] w-1/2 skew-x-[-20deg]" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* metric chips */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {[
//                       { label: 'Target Leads', value: target.target_leads.toLocaleString(),                       color: 'text-slate-700'   },
//                       { label: 'Leads Won',    value: target.achieved_leads.toLocaleString(),                     color: 'text-emerald-600' },
//                       { label: 'Revenue Goal', value: `$${parseFloat(target.target_revenue).toLocaleString()}`,   color: 'text-slate-700'   },
//                       { label: 'Current Rev',  value: `$${parseFloat(target.achieved_revenue).toLocaleString()}`, color: 'text-emerald-600' },
//                     ].map(chip => (
//                       <div
//                         key={chip.label}
//                         className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
//                       >
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{chip.label}</p>
//                         <p className={`text-base font-black ${chip.color}`}>{chip.value}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>{/* end scrollable body */}

//       <ReviewModal
//         isOpen={!!activeReviewTarget}
//         onClose={() => setActiveReviewTarget(null)}
//         target={activeReviewTarget}
//         onSubmit={submitReview}
//       />
//     </div>
//   );
// };

// // ─── InfoCard kept for any other consumers — unchanged ────────────────────────
// const InfoCard = ({ title, value, icon, color }: {
//   title: string; value: string | number; icon: any; color: 'blue' | 'emerald' | 'purple' | 'amber';
// }) => {
//   const colorMap = {
//     blue:    'from-blue-500    to-cyan-500    shadow-blue-500/20',
//     emerald: 'from-emerald-500 to-teal-500    shadow-emerald-500/20',
//     purple:  'from-purple-500  to-indigo-500  shadow-purple-500/20',
//     amber:   'from-amber-500   to-orange-500  shadow-amber-500/20',
//   };
//   return (
//     <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
//       <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
//       <div className="flex justify-between items-start relative z-10">
//         <div>
//           <p className="text-sm font-semibold opacity-90 uppercase tracking-wider text-white">{title}</p>
//           <h3 className="text-3xl font-black text-white mt-2">{value}</h3>
//         </div>
//         <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-white">{icon}</div>
//       </div>
//     </div>
//   );
// };

// export default BDMTargetsList;




import React, { useEffect, useState, useRef } from 'react';
import {
  Target, Plus, TrendingUp, ClipboardCheck,
  X, AlertTriangle, MapPin, Briefcase, Package,
  ChevronRight, Calendar, DollarSign, Users, Activity,
  ChevronDown, ChevronUp, Pencil, Trash2, LayoutGrid, List,
  Network, Wrench, Layers, CheckCircle2, Clock, BarChart2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

/* ─── ANIMATED COUNTER ─────────────────────────────────────── */
const AnimatedNumber: React.FC<{ value: number | string }> = ({ value }) => {
  const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now(); const duration = 900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * numeric));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [numeric]);
  return <>{display}</>;
};

/* ─── STAT CARD ─────────────────────────────────────────────── */
interface StatCardProps {
  title: string; value: number | string; gradient: string;
  icon: React.FC<any>; sub: string; delay: number; prefix?: string; suffix?: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, gradient, icon: Icon, sub, delay, prefix = '', suffix = '' }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md transition-all duration-500 ease-out stat-card ${gradient} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1   top-8  h-12 w-12 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 mb-1.5">{title}</p>
          <p className="text-[2rem] font-black leading-none tabular-nums">
            {prefix}{visible ? <AnimatedNumber value={numeric} /> : 0}{suffix}
          </p>
          <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>
        </div>
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

/* ─── TYPE HELPERS ──────────────────────────────────────────── */
const TYPE_CONFIG: Record<string, { gradient: string; badge: string; badgeBorder: string; badgeText: string; icon: React.ReactNode }> = {
  region:            { gradient:'linear-gradient(90deg,#3b82f6,#06b6d4)',   badge:'#eff6ff', badgeBorder:'#bfdbfe', badgeText:'#2563eb', icon:<MapPin    size={13}/> },
  vertical:          { gradient:'linear-gradient(90deg,#9333ea,#d946ef)',   badge:'#faf5ff', badgeBorder:'#ddd6fe', badgeText:'#7e22ce', icon:<Briefcase size={13}/> },
  product:           { gradient:'linear-gradient(90deg,#10b981,#0d9488)',   badge:'#ecfdf5', badgeBorder:'#a7f3d0', badgeText:'#065f46', icon:<Package   size={13}/> },
  customer_category: { gradient:'linear-gradient(90deg,#f97316,#ef4444)',   badge:'#fff7ed', badgeBorder:'#fed7aa', badgeText:'#9a3412', icon:<Users     size={13}/> },
  sales_channel:     { gradient:'linear-gradient(90deg,#f59e0b,#f97316)',   badge:'#fffbeb', badgeBorder:'#fde68a', badgeText:'#b45309', icon:<Network   size={13}/> },
  engagement_tool:   { gradient:'linear-gradient(90deg,#f43f5e,#e11d48)',   badge:'#fff1f2', badgeBorder:'#fecdd3', badgeText:'#be123c', icon:<Wrench    size={13}/> },
};
const getTypeCfg = (t: string) => TYPE_CONFIG[t] || { gradient:'linear-gradient(90deg,#6366f1,#7c3aed)', badge:'#eef2ff', badgeBorder:'#c7d2fe', badgeText:'#4338ca', icon:<Layers size={13}/> };

const STATUS_CONFIG: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  active:    { bg:'#ecfdf5', border:'#a7f3d0', text:'#065f46', dot:'#10b981' },
  pending:   { bg:'#fffbeb', border:'#fde68a', text:'#b45309', dot:'#f59e0b' },
  completed: { bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca', dot:'#6366f1' },
  paused:    { bg:'#f8fafc', border:'#e2e8f0', text:'#475569', dot:'#94a3b8' },
};
const getStatusCfg = (s: string) => STATUS_CONFIG[s?.toLowerCase()] || STATUS_CONFIG.pending;

/* ─── REVIEW MODAL — all functions unchanged ────────────────── */
const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
  const [reviewData, setReviewData] = useState({
    summary: '', findings: '', action_plan: '', review_date: new Date().toISOString().split('T')[0]
  });
  if (!isOpen || !target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
      style={{ backgroundColor:'rgba(10,8,30,0.65)', backdropFilter:'blur(8px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden modal-anim"
        style={{ boxShadow:'0 24px 64px rgba(79,70,229,0.28),0 8px 24px rgba(0,0,0,0.14)', border:'1.5px solid rgba(99,102,241,0.2)' }}>
        <div className="px-6 py-5 flex items-center gap-4 relative overflow-hidden"
          style={{ background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)' }}>
          <div className="shimmer-overlay" />
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <ClipboardCheck size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <h3 className="text-[17px] font-black text-white">PDCA Review</h3>
            <p className="text-[12px] text-indigo-200 font-medium truncate mt-0.5">{target.name}</p>
          </div>
          <button onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all"
            style={{ border:'1px solid rgba(255,255,255,0.18)' }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4" style={{ background:'linear-gradient(180deg,#fafbff,#f8fafc)' }}>
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Performance Summary</label>
            <input className="w-full px-4 py-3 bg-white rounded-xl text-[13px] font-medium text-slate-700 outline-none transition-all"
              style={{ border:'1.5px solid #e2e8f0' }}
              placeholder="e.g. Missed Printer Target by 20%"
              value={reviewData.summary} onChange={e => setReviewData({...reviewData, summary: e.target.value})}
              onFocus={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(99,102,241,0.12)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow=''; }} />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Root Cause (Findings)</label>
            <textarea className="w-full px-4 py-3 bg-white rounded-xl text-[13px] font-medium text-slate-700 outline-none resize-none transition-all" rows={3}
              style={{ border:'1.5px solid #e2e8f0' }}
              placeholder="Why did this happen?"
              value={reviewData.findings} onChange={e => setReviewData({...reviewData, findings: e.target.value})}
              onFocus={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(99,102,241,0.12)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow=''; }} />
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background:'#fffbeb', border:'1.5px solid #fde68a' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f59e0b,#f97316)' }} />
            <div className="p-4">
              <label className="text-[11px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} /> Corrective Action Plan (Act)
              </label>
              <textarea className="w-full px-4 py-3 bg-white rounded-xl text-[13px] font-medium text-slate-700 outline-none resize-none transition-all" rows={3}
                style={{ border:'1.5px solid #fde68a' }}
                placeholder="Steps for next cycle..."
                value={reviewData.action_plan} onChange={e => setReviewData({...reviewData, action_plan: e.target.value})}
                onFocus={e => { e.currentTarget.style.borderColor='#f59e0b'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(245,158,11,0.12)'; }}
                onBlur={e =>  { e.currentTarget.style.borderColor='#fde68a'; e.currentTarget.style.boxShadow=''; }} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 flex justify-end gap-3 bg-white" style={{ borderTop:'1.5px solid #eef2ff' }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13px] font-black text-slate-600 bg-white transition-all"
            style={{ border:'1.5px solid #e2e8f0' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#f8fafc'; (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#ffffff'; (e.currentTarget as HTMLButtonElement).style.transform=''; }}>
            Cancel
          </button>
          <button onClick={() => onSubmit(target.id, reviewData)}
            className="px-6 py-2.5 text-white rounded-xl text-[13px] font-black flex items-center gap-2 transition-all"
            style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 24px rgba(79,70,229,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; (e.currentTarget as HTMLButtonElement).style.boxShadow='0 4px 14px rgba(79,70,229,0.35)'; }}>
            Save Review <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── DELETE CONFIRM MODAL ──────────────────────────────────── */
const DeleteModal = ({ isOpen, onClose, target, onConfirm }: any) => {
  if (!isOpen || !target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
      style={{ backgroundColor:'rgba(10,8,30,0.65)', backdropFilter:'blur(8px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden modal-anim"
        style={{ boxShadow:'0 24px 64px rgba(239,68,68,0.2),0 8px 24px rgba(0,0,0,0.14)', border:'1.5px solid #fecdd3' }}>
        <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#ef4444,#f43f5e)' }} />
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background:'#fff1f2', border:'1.5px solid #fecdd3' }}>
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h3 className="text-[17px] font-black text-slate-800 mb-1">Delete Target?</h3>
          <p className="text-[13px] text-slate-400 font-medium mb-1">This will permanently delete</p>
          <p className="text-[14px] font-black text-slate-700 mb-5">"{target.name}"</p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-black text-slate-600 bg-white transition-all"
              style={{ border:'1.5px solid #e2e8f0' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#f8fafc'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background=''; }}>
              Cancel
            </button>
            <button onClick={() => onConfirm(target.id)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-black text-white transition-all"
              style={{ background:'linear-gradient(135deg,#ef4444,#f43f5e)', boxShadow:'0 4px 14px rgba(239,68,68,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export const BDMTargetsList = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard]                   = useState<any>(null);
  const [targets, setTargets]                       = useState<any[]>([]);
  const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget]             = useState<any>(null);
  const [expandedRows, setExpandedRows]             = useState<Set<number>>(new Set());
  const [viewMode, setViewMode]                     = useState<'table' | 'card'>('table');

  const loadData = async () => {
    try {
      const dashRes = await fetch(`${API_BASE}/bdm-targets/dashboard/`);
      setDashboard(await dashRes.json());
      const listRes = await fetch(`${API_BASE}/bdm-targets/`);
      setTargets(await listRes.json());
    } catch(e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, []);

  const submitReview = async (id: number, data: any) => {
    await fetch(`${API_BASE}/bdm-targets/${id}/add_review/`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data),
    });
    setActiveReviewTarget(null);
    alert("PDCA Cycle Updated Successfully!");
    loadData();
  };

  const confirmDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/bdm-targets/${id}/`, { method:'DELETE' });
      setDeleteTarget(null);
      loadData();
    } catch(e) { console.error(e); alert('Delete failed'); }
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const TABLE_HEADERS = [
    { label:'',           color:'text-slate-300',  w:'w-10'  },
    { label:'Plan Name',  color:'text-blue-200',   w:'w-auto'},
    { label:'Type',       color:'text-violet-200', w:'w-32'  },
    { label:'Status',     color:'text-emerald-200',w:'w-28'  },
    { label:'Progress',   color:'text-amber-200',  w:'w-36'  },
    { label:'Timeline',   color:'text-cyan-200',   w:'w-40'  },
    { label:'Leads',      color:'text-pink-200',   w:'w-28'  },
    { label:'Revenue',    color:'text-indigo-200', w:'w-32'  },
    { label:'Actions',    color:'text-slate-300',  w:'w-32'  },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes floatBlob {
          0%,100% { transform:translateY(0) translateX(0); }
          50%     { transform:translateY(-12px) translateX(6px); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes expandDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .anim-blob   { animation:floatBlob 7s ease-in-out infinite; }
        .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
        .modal-anim   { animation:modalIn .28s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .overlay-anim { animation:overlayIn .2s ease forwards; }
        .expand-anim  { animation:expandDown .2s ease forwards; }
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }
        .stat-card { transition:all .25s cubic-bezier(0.34,1.2,0.64,1); }
        .stat-card:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,0.18) !important; }

        /* table rows */
        .trow { transition:all .15s ease; }
        .trow:hover { background:linear-gradient(90deg,#eef2ff,#f5f3ff); }

        /* action btns */
        .act-btn { transition:all .15s ease; }
        .act-btn:hover { transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,0,0,0.1); }
        .act-btn:active { transform:scale(0.95); }

        /* card hover */
        .target-card { transition:all .2s cubic-bezier(0.34,1.1,0.64,1); }
        .target-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(79,70,229,0.12),0 2px 8px rgba(0,0,0,0.06) !important; }

        /* view toggle */
        .view-btn { transition:all .15s ease; }
        .view-btn:hover { transform:translateY(-1px); }

        /* add button */
        .btn-add { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
        .btn-add:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 6px 20px rgba(255,255,255,0.25) !important; }
        .btn-add:active { transform:scale(0.97); }
      `}</style>

      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay:'3s' }} />

      {/* ══ BANNER ══ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative f1"
        style={{
          background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
          boxShadow:'0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
        }}>
        <div className="shimmer-overlay" />
        <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
          style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <Target className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">Business Targets (PDCA)</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Manage strategic goals across regions, verticals, and products.
            </p>
          </div>
          {targets.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
              <BarChart2 size={14} className="text-indigo-200" />
              <span className="text-[13px] font-black text-indigo-100">{targets.length} plan{targets.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <button onClick={() => navigate('/bdm-targets/new')}
            className="btn-add flex items-center gap-2 px-4 py-2.5 rounded-xl text-[15px] font-black transition-all shrink-0 mr-4"
            style={{ backgroundColor:'#ffffff', color:'#4f46e5', boxShadow:'0 4px 14px rgba(255,255,255,0.2)' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor='#eef2ff'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor='#ffffff'}>
            <Plus size={14} /> Set New Target
          </button>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── STAT CARDS ── */}
        {dashboard && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 f2">
            <StatCard title="Active Plans"    value={Number(dashboard.active_targets ?? 0)}  gradient="bg-gradient-to-br from-indigo-500 to-violet-600"  icon={Activity}   sub="ongoing"           delay={0}   />
            <StatCard title="Avg Progress"    value={Number(dashboard.avg_progress   ?? 0)}  gradient="bg-gradient-to-br from-emerald-500 to-teal-600"   icon={TrendingUp} sub="completion"        delay={80}  suffix="%" />
            <StatCard title="Total Leads Goal"value={Number(dashboard.target_leads   ?? 0)}  gradient="bg-gradient-to-br from-blue-500 to-cyan-600"      icon={Users}      sub="across all targets"delay={160} />
            <StatCard title="Revenue Goal"    value={Number(dashboard.target_revenue ?? 0)}  gradient="bg-gradient-to-br from-amber-400 to-orange-500"   icon={DollarSign} sub="total target"      delay={240} prefix="$" />
          </div>
        )}

        {/* ── TOOLBAR ── */}
        {targets.length > 0 && (
          <div className="flex items-center justify-between f3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 rounded-full" style={{ background:'linear-gradient(180deg,#4f46e5,#7c3aed)' }} />
              <p className="text-[15px] font-black text-slate-700">All Targets</p>
              <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background:'#eef2ff', color:'#4338ca', border:'1px solid #c7d2fe' }}>
                {targets.length}
              </span>
            </div>
            {/* view toggle */}
            <div className="flex items-center p-1 rounded-xl gap-1"
              style={{ background:'#f1f5f9', border:'1px solid #e2e8f0' }}>
              {([['table', <List size={15}/>], ['card', <LayoutGrid size={15}/>]] as const).map(([mode, icon]) => (
                <button key={mode} onClick={() => setViewMode(mode as 'table'|'card')}
                  className="view-btn px-3 py-2 rounded-lg text-[12px] font-black flex items-center gap-1.5 capitalize"
                  style={viewMode === mode
                    ? { background:'#ffffff', color:'#4f46e5', boxShadow:'0 2px 8px rgba(79,70,229,0.15)', border:'1px solid #c7d2fe' }
                    : { color:'#94a3b8' }}>
                  {icon} {mode === 'table' ? 'Table' : 'Cards'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════ TABLE VIEW ════ */}
        {viewMode === 'table' && targets.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden f3"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 24px rgba(79,70,229,0.08),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background:'linear-gradient(90deg,#1e1b4b 0%,#312e81 20%,#4f46e5 55%,#7c3aed 100%)' }}>
                    {TABLE_HEADERS.map(h => (
                      <th key={h.label} className={`px-4 py-4 text-left text-[11px] font-black ${h.color} uppercase tracking-widest whitespace-nowrap ${h.w}`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {targets.map((target, idx) => {
                    const tc       = getTypeCfg(target.target_type);
                    const sc       = getStatusCfg(target.status);
                    const progress = target.progress || 0;
                    const isExpanded = expandedRows.has(target.id);
                    const ROW_ACCENTS = ['border-l-blue-400','border-l-violet-400','border-l-emerald-400','border-l-amber-400','border-l-rose-400','border-l-cyan-400'];
                    return (
                      <React.Fragment key={target.id}>
                        <tr className={`trow border-l-[4px] ${ROW_ACCENTS[idx % ROW_ACCENTS.length]} cursor-pointer`}
                          style={{ borderBottom:'1px solid #f1f5f9' }}>

                          {/* expand toggle */}
                          <td className="px-4 py-3.5">
                            <button onClick={() => toggleRow(target.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={isExpanded
                                ? { background:'#eef2ff', color:'#4f46e5', border:'1.5px solid #c7d2fe' }
                                : { background:'#f8fafc', color:'#94a3b8', border:'1.5px solid #e2e8f0' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='#c7d2fe'; (e.currentTarget as HTMLButtonElement).style.color='#4f46e5'; }}
                              onMouseLeave={e => { if (!isExpanded) { (e.currentTarget as HTMLButtonElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.color='#94a3b8'; } }}>
                              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          </td>

                          {/* name */}
                          <td className="px-4 py-3.5">
                            <p className="text-[14px] font-black text-slate-800 leading-snug">{target.name}</p>
                          </td>

                          {/* type */}
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black w-fit"
                              style={{ background:tc.badge, border:`1.5px solid ${tc.badgeBorder}`, color:tc.badgeText }}>
                              {tc.icon}
                              <span className="capitalize">{target.target_type?.replace('_',' ')}</span>
                            </span>
                          </td>

                          {/* status */}
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black w-fit"
                              style={{ background:sc.bg, border:`1.5px solid ${sc.border}`, color:sc.text }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background:sc.dot }} />
                              {target.status?.toUpperCase()}
                            </span>
                          </td>

                          {/* progress */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'#f1f5f9', minWidth:'60px' }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width:`${Math.min(progress,100)}%`, background: progress >= 100 ? 'linear-gradient(90deg,#10b981,#0d9488)' : 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                              </div>
                              <span className="text-[12px] font-black text-slate-700 shrink-0">{progress}%</span>
                            </div>
                          </td>

                          {/* timeline */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                              <Calendar size={12} className="text-slate-400 shrink-0" />
                              {new Date(target.start_date).toLocaleDateString()} – {new Date(target.end_date).toLocaleDateString()}
                            </div>
                          </td>

                          {/* leads */}
                          <td className="px-4 py-3.5">
                            <p className="text-[13px] font-black text-slate-700">{target.target_leads}</p>
                            <p className="text-[10px] text-emerald-500 font-bold">{target.achieved_leads} won</p>
                          </td>

                          {/* revenue */}
                          <td className="px-4 py-3.5">
                            <p className="text-[13px] font-black text-slate-700">${parseFloat(target.target_revenue).toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-500 font-bold">${parseFloat(target.achieved_revenue).toLocaleString()} achieved</p>
                          </td>

                          {/* actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setActiveReviewTarget(target)}
                                className="act-btn flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-black"
                                style={{ background:'#fffbeb', border:'1.5px solid #fde68a', color:'#b45309' }}
                                title="PDCA Review">
                                <ClipboardCheck size={12} /> Review
                              </button>
                              <button onClick={() => navigate(`/bdm-targets/${target.id}/edit`)}
                                className="act-btn w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe', color:'#4338ca' }}
                                title="Edit">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setDeleteTarget(target)}
                                className="act-btn w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background:'#fff1f2', border:'1.5px solid #fecdd3', color:'#be123c' }}
                                title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ── EXPANDED ROW ── */}
                        {isExpanded && (
                          <tr style={{ borderBottom:'1px solid #f1f5f9', background:'linear-gradient(90deg,#fafbff,#f5f3ff)' }}>
                            <td colSpan={9} className="px-6 py-4">
                              <div className="expand-anim grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                  { label:'Target Leads',  value:target.target_leads.toLocaleString(),                      icon:<Users size={13}/>,      bg:'#eff6ff', border:'#bfdbfe', text:'#2563eb' },
                                  { label:'Leads Won',     value:target.achieved_leads.toLocaleString(),                    icon:<CheckCircle2 size={13}/>, bg:'#ecfdf5', border:'#a7f3d0', text:'#065f46' },
                                  { label:'Revenue Goal',  value:`$${parseFloat(target.target_revenue).toLocaleString()}`,  icon:<DollarSign size={13}/>,  bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca' },
                                  { label:'Current Rev',   value:`$${parseFloat(target.achieved_revenue).toLocaleString()}`,icon:<TrendingUp size={13}/>,  bg:'#fffbeb', border:'#fde68a', text:'#b45309' },
                                ].map(chip => (
                                  <div key={chip.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                    style={{ background:chip.bg, border:`1.5px solid ${chip.border}` }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                      style={{ background:`${chip.border}44` }}>
                                      <span style={{ color:chip.text }}>{chip.icon}</span>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color:`${chip.text}99` }}>{chip.label}</p>
                                      <p className="text-[15px] font-black" style={{ color:chip.text }}>{chip.value}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {target.notes && (
                                <div className="mt-3 px-4 py-3 rounded-xl text-[12px] text-slate-600 font-medium"
                                  style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                                  <span className="font-black text-slate-500 text-[11px] uppercase tracking-wider">Notes: </span>{target.notes}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ CARD VIEW ════ */}
        {viewMode === 'card' && (
          <div className="space-y-4 f3">
            {targets.map((target) => {
              const tc       = getTypeCfg(target.target_type);
              const sc       = getStatusCfg(target.status);
              const progress = target.progress || 0;
              return (
                <div key={target.id}
                  className="target-card bg-white rounded-2xl overflow-hidden"
                  style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="h-[3px] w-full" style={{ background:tc.gradient }} />
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background:tc.badge, border:`1.5px solid ${tc.badgeBorder}` }}>
                          <span style={{ color:tc.badgeText }}>{React.cloneElement(tc.icon as React.ReactElement, { size:18 })}</span>
                        </div>
                        <div>
                          <h3 className="text-[16px] font-black text-slate-800 leading-tight">{target.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black"
                              style={{ background:tc.badge, border:`1.5px solid ${tc.badgeBorder}`, color:tc.badgeText }}>
                              {tc.icon} <span className="capitalize">{target.target_type?.replace('_',' ')}</span>
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black"
                              style={{ background:sc.bg, border:`1.5px solid ${sc.border}`, color:sc.text }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background:sc.dot }} />
                              {target.status?.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500"
                              style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                              <Calendar size={11} />
                              {new Date(target.start_date).toLocaleDateString()} – {new Date(target.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setActiveReviewTarget(target)}
                          className="act-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black"
                          style={{ background:'#fffbeb', border:'1.5px solid #fde68a', color:'#b45309' }}>
                          <ClipboardCheck size={13} /> PDCA Review
                        </button>
                        <button onClick={() => navigate(`/bdm-targets/${target.id}/edit`)}
                          className="act-btn w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe', color:'#4338ca' }}
                          title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(target)}
                          className="act-btn w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background:'#fff1f2', border:'1.5px solid #fecdd3', color:'#be123c' }}
                          title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* progress */}
                    <div className="px-4 py-3 rounded-xl mb-4" style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Goal Completion</span>
                        <span className="text-[18px] font-black" style={{ color: progress >= 100 ? '#10b981' : '#4f46e5' }}>{progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'#e2e8f0' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width:`${Math.min(progress,100)}%`, background: progress >= 100 ? 'linear-gradient(90deg,#10b981,#0d9488)' : 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                      </div>
                    </div>

                    {/* metric chips */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label:'Target Leads', value:target.target_leads.toLocaleString(),                      bg:'#eff6ff', border:'#bfdbfe', text:'#2563eb' },
                        { label:'Leads Won',    value:target.achieved_leads.toLocaleString(),                    bg:'#ecfdf5', border:'#a7f3d0', text:'#065f46' },
                        { label:'Revenue Goal', value:`$${parseFloat(target.target_revenue).toLocaleString()}`,  bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca' },
                        { label:'Current Rev',  value:`$${parseFloat(target.achieved_revenue).toLocaleString()}`,bg:'#fffbeb', border:'#fde68a', text:'#b45309' },
                      ].map(chip => (
                        <div key={chip.label} className="p-3 rounded-xl" style={{ background:chip.bg, border:`1.5px solid ${chip.border}` }}>
                          <p className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color:`${chip.text}99` }}>{chip.label}</p>
                          <p className="text-[15px] font-black" style={{ color:chip.text }}>{chip.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {targets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl f3"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background:'linear-gradient(145deg,#f1f5f9,#e2e8f0)', border:'1.5px dashed #cbd5e1' }}>
              <Target size={26} className="text-slate-300" />
            </div>
            <p className="text-[15px] font-black text-slate-500">No Targets Set Yet</p>
            <p className="text-[13px] text-slate-400 mt-1 mb-5 font-medium">Create your first strategic goal to start tracking progress.</p>
            <button onClick={() => navigate('/bdm-targets/new')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black text-white transition-all"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; }}>
              <Plus size={14} /> Set First Target
            </button>
          </div>
        )}

        <div className="pb-4" />
      </div>

      <ReviewModal isOpen={!!activeReviewTarget} onClose={() => setActiveReviewTarget(null)} target={activeReviewTarget} onSubmit={submitReview} />
      <DeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} target={deleteTarget} onConfirm={confirmDelete} />
    </div>
  );
};

export default BDMTargetsList;
