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

import React, { useEffect, useState, useRef } from 'react';
import { 
  Target, Plus, TrendingUp, ClipboardCheck, 
  X, AlertTriangle, MapPin, Briefcase, Package, 
  ChevronRight, Calendar, DollarSign, Users, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
const AnimatedNumber: React.FC<{ value: number | string }> = ({ value }) => {
  const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start    = performance.now();
    const duration = 900;
    const tick     = (now: number) => {
      const p     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * numeric));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [numeric]);

  return <>{display}</>;
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number | string;
  gradient: string;
  icon: React.FC<any>;
  sub: string;
  delay: number;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, gradient, icon: Icon, sub, delay, prefix = '', suffix = '' }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const numeric = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md
        transition-all duration-500 ease-out ${gradient}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1  top-8  h-12 w-12 rounded-full bg-white/10" />
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

// ─── type helpers ─────────────────────────────────────────────────────────────
const getTypeAccent = (type: string) => {
  switch (type) {
    case 'region':   return 'from-blue-500 to-cyan-400';
    case 'vertical': return 'from-purple-500 to-fuchsia-400';
    case 'product':  return 'from-emerald-500 to-teal-400';
    default:         return 'from-indigo-500 to-violet-400';
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'region':   return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'vertical': return 'bg-purple-50 border-purple-200 text-purple-700';
    case 'product':  return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    default:         return 'bg-slate-50 border-slate-200 text-slate-600';
  }
};

// ─── REVIEW MODAL — all functions unchanged ───────────────────────────────────
const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
  const [reviewData, setReviewData] = useState({ 
    summary: '', findings: '', action_plan: '', review_date: new Date().toISOString().split('T')[0] 
  });

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* modal header — matches banner gradient */}
        <div
          className="p-6 flex justify-between items-center"
          style={{ background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)' }}
        >
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="text-white/80" /> PDCA Review
            </h3>
            <p className="text-indigo-200 text-sm mt-1">{target.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 bg-slate-50">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Performance Summary</label>
            <input
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
              placeholder="e.g. Missed Printer Target by 20%"
              value={reviewData.summary}
              onChange={e => setReviewData({...reviewData, summary: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Root Cause (Findings)</label>
            <textarea
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl h-24 resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
              placeholder="Why did this happen?"
              value={reviewData.findings}
              onChange={e => setReviewData({...reviewData, findings: e.target.value})}
            />
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-2xl" />
            <label className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Corrective Action Plan (Act)
            </label>
            <textarea
              className="w-full p-3.5 bg-white border border-amber-200 rounded-xl h-24 resize-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm"
              placeholder="Steps for next cycle..."
              value={reviewData.action_plan}
              onChange={e => setReviewData({...reviewData, action_plan: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(target.id, reviewData)}
            className="px-6 py-2.5 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
            style={{
              background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
              boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Save Review <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const BDMTargetsList = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard]                   = useState<any>(null);
  const [targets, setTargets]                       = useState<any[]>([]);
  const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);

  // ── all data functions unchanged ──
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
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    setActiveReviewTarget(null);
    alert("PDCA Cycle Updated Successfully!");
    loadData();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'region':   return <MapPin    size={18} className="text-blue-500"    />;
      case 'vertical': return <Briefcase size={18} className="text-purple-500"  />;
      case 'product':  return <Package   size={18} className="text-emerald-500" />;
      default:         return <Target    size={18} className="text-slate-500"   />;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      {/* ── keyframes ── */}
      <style>{`
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px) scale(0.99); }
          to   { opacity:1; transform:translateY(0px) scale(1); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          BANNER — exact same structure as Dashboard:
          shrink-0  mx-4  mt-4  rounded-2xl  overflow-hidden
          inline style: linear-gradient + boxShadow
          inner div: radial-gradient backgroundImage overlay
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        >
          {/* icon block — identical to Dashboard */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Target className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Business Targets (PDCA)
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Manage strategic goals across regions, verticals, and products.
            </p>
          </div>

          {/* white pill button — identical to Dashboard "Add Lead" */}
          <button
            onClick={() => navigate('/bdm-targets/new')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-black transition-all shrink-0"
            style={{
              backgroundColor: '#ffffff',
              color: '#4f46e5',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ede9fe')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <Plus size={14} /> Set New Target
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE BODY — same as Dashboard: flex-1 overflow-y-auto p-4 ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs — contained, won't affect layout */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {/* ── STAT CARDS ── */}
        {dashboard && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 anim-fade-2">
            <StatCard
              title="Active Plans"
              value={Number(dashboard.active_targets ?? 0)}
              gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
              icon={Activity}
              sub="ongoing"
              delay={0}
            />
            <StatCard
              title="Avg Progress"
              value={Number(dashboard.avg_progress ?? 0)}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              icon={TrendingUp}
              sub="completion"
              suffix="%"
              delay={80}
            />
            <StatCard
              title="Total Leads Goal"
              value={Number(dashboard.target_leads ?? 0)}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
              icon={Users}
              sub="across all targets"
              delay={160}
            />
            <StatCard
              title="Revenue Goal"
              value={Number(dashboard.target_revenue ?? 0)}
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              icon={DollarSign}
              sub="total target"
              prefix="$"
              delay={240}
            />
          </div>
        )}

        {/* ── SECTION LABEL ── */}
        {targets.length > 0 && (
          <div className="anim-fade-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              All Targets
              <span className="ml-1.5 normal-case font-normal tracking-normal text-slate-300">
                ({targets.length})
              </span>
            </p>
          </div>
        )}

        {/* ── TARGET CARDS ── */}
        <div className="space-y-4 anim-fade-3">

          {/* empty state */}
          {targets.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Target className="mx-auto text-indigo-300 mb-3" size={36} />
              <p className="text-sm font-semibold text-slate-600">No Targets Set Yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Create your first strategic goal to start tracking progress.
              </p>
              <button
                onClick={() => navigate('/bdm-targets/new')}
                className="text-white px-5 py-2 rounded-xl text-sm font-black inline-flex items-center gap-2 transition-all"
                style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}
              >
                <Plus size={14} /> Set First Target
              </button>
            </div>
          )}

          {targets.map((target) => {
            const progress     = target.progress || 0;
            const isCompleted  = progress >= 100;
            const progressGrad = isCompleted ? 'from-emerald-400 to-emerald-500' : 'from-indigo-500 to-violet-500';
            const typeAccent   = getTypeAccent(target.target_type);
            const typeBadge    = getTypeBadge(target.target_type);

            return (
              <div
                key={target.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm
                  hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 overflow-hidden group"
              >
                {/* type colour accent bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${typeAccent}`} />

                <div className="p-5">
                  {/* card header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        {getTypeIcon(target.target_type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                          {target.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {/* type badge */}
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${typeBadge}`}>
                            {getTypeIcon(target.target_type)}
                            <span className="capitalize">{target.target_type}</span>
                          </span>
                          {/* status badge */}
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                            target.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              target.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`} />
                            {target.status.toUpperCase()}
                          </span>
                          {/* date badge */}
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-50 border border-slate-100">
                            <Calendar size={11} />
                            {new Date(target.start_date).toLocaleDateString()} – {new Date(target.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PDCA review button */}
                    <button
                      onClick={() => setActiveReviewTarget(target)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                        bg-amber-50 border border-amber-200 text-amber-600
                        hover:bg-amber-100 transition-all shadow-sm shrink-0"
                    >
                      <ClipboardCheck size={14} /> PDCA Review
                    </button>
                  </div>

                  {/* progress bar */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Goal Completion</span>
                      <span className={`text-xl font-black ${isCompleted ? 'text-emerald-500' : 'text-indigo-600'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${progressGrad} transition-all duration-1000 relative`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      >
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                          <div className="absolute inset-0 bg-white/25 animate-[shimmer_2s_infinite] w-1/2 skew-x-[-20deg]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* metric chips */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Target Leads', value: target.target_leads.toLocaleString(),                       color: 'text-slate-700'   },
                      { label: 'Leads Won',    value: target.achieved_leads.toLocaleString(),                     color: 'text-emerald-600' },
                      { label: 'Revenue Goal', value: `$${parseFloat(target.target_revenue).toLocaleString()}`,   color: 'text-slate-700'   },
                      { label: 'Current Rev',  value: `$${parseFloat(target.achieved_revenue).toLocaleString()}`, color: 'text-emerald-600' },
                    ].map(chip => (
                      <div
                        key={chip.label}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{chip.label}</p>
                        <p className={`text-base font-black ${chip.color}`}>{chip.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>{/* end scrollable body */}

      <ReviewModal
        isOpen={!!activeReviewTarget}
        onClose={() => setActiveReviewTarget(null)}
        target={activeReviewTarget}
        onSubmit={submitReview}
      />
    </div>
  );
};

// ─── InfoCard kept for any other consumers — unchanged ────────────────────────
const InfoCard = ({ title, value, icon, color }: {
  title: string; value: string | number; icon: any; color: 'blue' | 'emerald' | 'purple' | 'amber';
}) => {
  const colorMap = {
    blue:    'from-blue-500    to-cyan-500    shadow-blue-500/20',
    emerald: 'from-emerald-500 to-teal-500    shadow-emerald-500/20',
    purple:  'from-purple-500  to-indigo-500  shadow-purple-500/20',
    amber:   'from-amber-500   to-orange-500  shadow-amber-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
      <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-semibold opacity-90 uppercase tracking-wider text-white">{title}</p>
          <h3 className="text-3xl font-black text-white mt-2">{value}</h3>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-white">{icon}</div>
      </div>
    </div>
  );
};

export default BDMTargetsList;