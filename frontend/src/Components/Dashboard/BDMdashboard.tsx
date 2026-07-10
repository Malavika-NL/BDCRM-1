// import React, { useEffect, useState } from 'react';
// import { Target, MapPin, Building, Crosshair, Users, Activity, Tag as TagIcon, Loader2 } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { Lead } from '../Utils/types';

// export const BDMDashboard = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Load real leads to calculate stats
//   useEffect(() => {
//     api.getLeads().then((data) => {
//       setLeads(data);
//       setLoading(false);
//     });
//   }, []);

//   // --- 1. DYNAMIC CALCULATIONS ---
  
//   // Calculate Vertical Distribution
//   const verticalStats = React.useMemo(() => {
//     const stats: Record<string, number> = {};
//     leads.forEach(l => {
//       const vName = l.vertical?.name || 'Unassigned';
//       stats[vName] = (stats[vName] || 0) + 1;
//     });
//     // Convert to array and sort
//     return Object.entries(stats)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count);
//   }, [leads]);

//   // Calculate Region Distribution
//   const regionStats = React.useMemo(() => {
//     const stats: Record<string, number> = {};
//     leads.forEach(l => {
//       const rName = l.region_rel?.name || 'Unassigned';
//       stats[rName] = (stats[rName] || 0) + 1;
//     });
//     return Object.entries(stats).map(([name, count]) => ({ name, count }));
//   }, [leads]);

//   // Calculate Lead Stages (MQL/SQL)
//   const segmentStats = React.useMemo(() => {
//     const mql = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
//     const sql = leads.filter(l => l.status === 'negotiation' || l.status === 'won').length;
//     return { mql, sql };
//   }, [leads]);

//   if (loading) {
//     return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;
//   }

//   // Colors for charts
//   const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-purple-500'];

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
//       <header className="mb-8">
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
//           <Target size={32} className="text-blue-600" /> BDM Core Intelligence
//         </h2>
//         <p className="text-slate-500 mt-1">Live breakdown of Verticals, Regions, and Segments.</p>
//       </header>

//       {/* PDCA Steps */}
//       <div className="grid grid-cols-4 gap-4 mb-8">
//         {[
//           { l: 'P', name: 'Plan', desc: 'Set Targets', c: 'text-blue-600 bg-blue-50 border-blue-200' },
//           { l: 'D', name: 'Do', desc: 'Campaigns', c: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
//           { l: 'C', name: 'Check', desc: 'Gap Analysis', c: 'text-amber-600 bg-amber-50 border-amber-200' },
//           { l: 'A', name: 'Act', desc: 'Review & Fix', c: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
//         ].map(step => (
//           <div key={step.l} className={`p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center transition hover:-translate-y-1 ${step.c}`}>
//              <h1 className="text-5xl font-black mb-3 opacity-90">{step.l}</h1>
//              <p className="font-bold text-sm uppercase tracking-wider">{step.name}</p>
//              <p className="text-xs mt-1 opacity-80">{step.desc}</p>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* VERTICAL PERFORMANCE (Dynamic) */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
//             <Building size={18} className="text-slate-400"/> Vertical Penetration
//           </h3>
//           <div className="space-y-6">
//             {verticalStats.length === 0 ? (
//               <p className="text-sm text-slate-400">No data available. Add leads with verticals.</p>
//             ) : (
//               verticalStats.map((v, index) => {
//                 const percentage = Math.round((v.count / leads.length) * 100);
//                 return (
//                   <div key={v.name}>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="font-semibold text-slate-700">{v.name}</span>
//                       <span className="text-slate-500">{v.count} Leads ({percentage}%)</span>
//                     </div>
//                     <div className="w-full bg-slate-100 rounded-full h-3">
//                       <div 
//                         className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-1000`} 
//                         style={{ width: `${percentage}%` }} 
//                       />
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         {/* REGIONAL & SEGMENT BREAKDOWN (Dynamic) */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
//              <Crosshair size={18} className="text-slate-400"/> Market Classifications
//            </h3>
           
//            <div className="grid grid-cols-2 gap-4">
//               {/* Region Stats */}
//               <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
//                 <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><MapPin size={14}/> Top Regions</p>
//                 {regionStats.slice(0, 3).map(r => (
//                   <div key={r.name} className="flex justify-between items-center mb-3">
//                     <span className="text-sm font-medium text-slate-700">{r.name}</span>
//                     <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg">{r.count}</span>
//                   </div>
//                 ))}
//                 {regionStats.length === 0 && <p className="text-xs text-slate-400">No regions found</p>}
//               </div>

//               {/* Segment Stats */}
//               <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
//                 <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><Users size={14}/> Pipeline Stage</p>
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="text-sm font-medium text-slate-700">MQL (New)</span>
//                   <span className="flex items-center gap-2 text-xs font-bold">
//                     {segmentStats.mql} <span className="w-2 h-2 rounded-full bg-indigo-400"/>
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="text-sm font-medium text-slate-700">SQL (Active)</span>
//                   <span className="flex items-center gap-2 text-xs font-bold">
//                     {segmentStats.sql} <span className="w-2 h-2 rounded-full bg-blue-500"/>
//                   </span>
//                 </div>
//               </div>
//            </div>
           
//            {/* Cross-Sell Alert */}
//            <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
//               <p className="text-xs font-bold text-indigo-500 uppercase mb-3 flex items-center gap-1">
//                 <TagIcon size={14}/> Cross-Sell Opportunities
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 <span className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">
//                   Printers Sold: {leads.filter(l => l.value && parseFloat(l.value) > 10000).length}
//                 </span>
//                 <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">
//                   White Space Analysis Active
//                 </span>
//               </div>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import {
//   Target, MapPin, Building, Crosshair, Users, Activity,
//   Tag as TagIcon, Loader2, TrendingUp, BarChart2, Layers,
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { Lead } from '../Utils/types';

// export const BDMDashboard = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.getLeads().then((data) => {
//       setLeads(data);
//       setLoading(false);
//     });
//   }, []);

//   /* ── all original memos untouched ── */
//   const verticalStats = React.useMemo(() => {
//     const stats: Record<string, number> = {};
//     leads.forEach(l => {
//       const vName = l.vertical?.name || 'Unassigned';
//       stats[vName] = (stats[vName] || 0) + 1;
//     });
//     return Object.entries(stats)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count);
//   }, [leads]);

//   const regionStats = React.useMemo(() => {
//     const stats: Record<string, number> = {};
//     leads.forEach(l => {
//       const rName = l.region_rel?.name || 'Unassigned';
//       stats[rName] = (stats[rName] || 0) + 1;
//     });
//     return Object.entries(stats).map(([name, count]) => ({ name, count }));
//   }, [leads]);

//   const segmentStats = React.useMemo(() => {
//     const mql = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
//     const sql = leads.filter(l => l.status === 'negotiation' || l.status === 'won').length;
//     return { mql, sql };
//   }, [leads]);

//   /* ── loading ── */
//   if (loading) {
//     return (
//       <div className="h-full bg-[#f0f2f8] flex flex-col items-center justify-center gap-3">
//         <Loader2 className="animate-spin text-indigo-500" size={28} />
//         <p className="text-[13px] font-medium text-slate-400">Loading intelligence…</p>
//       </div>
//     );
//   }

//   const barColors = [
//     'bg-gradient-to-r from-indigo-500 to-violet-500',
//     'bg-gradient-to-r from-violet-500 to-purple-500',
//     'bg-gradient-to-r from-blue-500 to-cyan-400',
//     'bg-gradient-to-r from-amber-400 to-orange-400',
//     'bg-gradient-to-r from-emerald-500 to-teal-400',
//   ];

//   const pdcaSteps = [
//     {
//       l: 'P', name: 'Plan', desc: 'Set Targets',
//       gradient: 'from-indigo-500 to-violet-600',
//       shadow: 'shadow-indigo-400/40',
//       iconBg: 'bg-white/15',
//     },
//     {
//       l: 'D', name: 'Do', desc: 'Campaigns',
//       gradient: 'from-emerald-400 to-teal-600',
//       shadow: 'shadow-emerald-400/40',
//       iconBg: 'bg-white/15',
//     },
//     {
//       l: 'C', name: 'Check', desc: 'Gap Analysis',
//       gradient: 'from-sky-400 to-blue-600',
//       shadow: 'shadow-sky-400/40',
//       iconBg: 'bg-white/15',
//     },
//     {
//       l: 'A', name: 'Act', desc: 'Review & Fix',
//       gradient: 'from-amber-400 to-orange-500',
//       shadow: 'shadow-amber-400/40',
//       iconBg: 'bg-white/15',
//     },
//   ];

//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px) scale(0.99); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px) translateX(0px); }
//           50%     { transform: translateY(-10px) translateX(6px); }
//         }
//         @keyframes growBar {
//           from { width: 0%; }
//         }
//         .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//         .anim-fade-4 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.35s; }
//         .bar-grow    { animation: growBar .8s ease-out forwards; animation-delay:.4s; }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           BANNER — identical to WorkflowMonitor
//       ══════════════════════════════════════════════════ */}
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
//             backgroundImage:
//               'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
//           }}
//         >
//           {/* icon block */}
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
//               BDM Core Intelligence
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Live breakdown of Verticals, Regions, and Pipeline Segments.
//             </p>
//           </div>

//           {/* live leads badge */}
//           <div
//             className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.12)',
//               border: '1px solid rgba(255,255,255,0.18)',
//             }}
//           >
//             <Activity size={14} className="text-indigo-200" />
//             <span className="text-[12px] font-black text-indigo-100">{leads.length} Leads Live</span>
//           </div>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           SCROLLABLE BODY
//       ══════════════════════════════════════════════════ */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* section label */}
//         <div className="flex items-center gap-3 anim-fade-2">
//           <div className="w-1 h-4 bg-indigo-500 rounded-full" />
//           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//             PDCA Framework Overview
//           </p>
//         </div>

//         {/* ── PDCA Cards ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-fade-2">
//           {pdcaSteps.map((step, i) => (
//             <div
//               key={step.l}
//               className={`bg-gradient-to-br ${step.gradient} ${step.shadow} rounded-2xl p-5
//                 flex flex-col shadow-lg transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden relative`}
//             >
//               {/* subtle top bar shimmer */}
//               <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />

//               <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 shrink-0`}
//                 style={{ backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
//                 <span className="text-[22px] font-black text-white leading-none">{step.l}</span>
//               </div>
//               <p className="text-[13px] font-black text-white uppercase tracking-wide leading-tight">
//                 {step.name}
//               </p>
//               <p className="text-[11px] text-white/75 mt-1 font-medium">{step.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* section label */}
//         <div className="flex items-center gap-3 anim-fade-3">
//           <div className="w-1 h-4 bg-violet-500 rounded-full" />
//           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//             Analytics & Market Breakdown
//           </p>
//         </div>

//         {/* ── Charts grid ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-fade-4 pb-4">

//           {/* VERTICAL PENETRATION */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
//             {/* top accent bar */}
//             <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

//             <div className="px-5 pt-4 pb-4 border-b border-slate-100">
//               <div className="flex items-start gap-3">
//                 <div className="w-1 self-stretch rounded-full bg-indigo-500 shrink-0" />
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
//                   <Building size={14} className="text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[14px] font-black text-slate-800 leading-tight">Vertical Penetration</h3>
//                   <p className="text-[11px] text-slate-400 mt-0.5">Lead distribution by industry vertical</p>
//                 </div>
//                 <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 shrink-0">
//                   {verticalStats.length} verticals
//                 </span>
//               </div>
//             </div>

//             <div className="p-5 space-y-4">
//               {verticalStats.length === 0 ? (
//                 <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-xl">
//                   <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 bg-indigo-50 text-indigo-500">
//                     <BarChart2 size={16} />
//                   </div>
//                   <p className="text-[12px] font-black text-slate-500">No data yet</p>
//                   <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Add leads with verticals.</p>
//                 </div>
//               ) : (
//                 verticalStats.map((v, index) => {
//                   const percentage = Math.round((v.count / leads.length) * 100);
//                   return (
//                     <div key={v.name}>
//                       <div className="flex justify-between items-center mb-2">
//                         <div className="flex items-center gap-2">
//                           <span className={`w-2 h-2 rounded-full ${barColors[index % barColors.length].replace('bg-gradient-to-r ', '')}`} />
//                           <span className="text-[13px] font-semibold text-slate-700">{v.name}</span>
//                         </div>
//                         <span className="text-[11px] font-black bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-lg">
//                           {v.count} · {percentage}%
//                         </span>
//                       </div>
//                       <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
//                         <div
//                           className={`${barColors[index % barColors.length]} h-2 rounded-full bar-grow`}
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* MARKET CLASSIFICATIONS */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
//             {/* top accent bar */}
//             <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

//             <div className="px-5 pt-4 pb-4 border-b border-slate-100">
//               <div className="flex items-start gap-3">
//                 <div className="w-1 self-stretch rounded-full bg-violet-500 shrink-0" />
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
//                   <Crosshair size={14} className="text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[14px] font-black text-slate-800 leading-tight">Market Classifications</h3>
//                   <p className="text-[11px] text-slate-400 mt-0.5">Regions, pipeline stages & cross-sell signals</p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-5 space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

//                 {/* Region Stats */}
//                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-indigo-100 transition-all">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
//                     <MapPin size={10} /> Top Regions
//                   </p>
//                   {regionStats.length === 0 ? (
//                     <p className="text-[11px] text-slate-400">No regions found</p>
//                   ) : (
//                     regionStats.slice(0, 3).map((r, i) => (
//                       <div key={r.name} className="flex justify-between items-center mb-2.5 group">
//                         <div className="flex items-center gap-2">
//                           <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-black text-white shrink-0">
//                             {i + 1}
//                           </span>
//                           <span className="text-[12px] font-semibold text-slate-700">{r.name}</span>
//                         </div>
//                         <span className="text-[11px] font-black bg-white border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg">
//                           {r.count}
//                         </span>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Segment Stats */}
//                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-violet-100 transition-all">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
//                     <Users size={10} /> Pipeline Stage
//                   </p>
//                   <div className="flex justify-between items-center mb-2.5">
//                     <span className="text-[12px] font-semibold text-slate-700">MQL (New)</span>
//                     <span className="flex items-center gap-2 text-[11px] font-black text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-lg">
//                       {segmentStats.mql}
//                       <span className="w-2 h-2 rounded-full bg-violet-500" />
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-[12px] font-semibold text-slate-700">SQL (Active)</span>
//                     <span className="flex items-center gap-2 text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
//                       {segmentStats.sql}
//                       <span className="w-2 h-2 rounded-full bg-indigo-500" />
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Cross-Sell Alert */}
//               <div className="rounded-xl overflow-hidden border border-indigo-100">
//                 <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
//                 <div className="p-4 bg-gradient-to-r from-indigo-50/60 to-violet-50/60">
//                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
//                     <TagIcon size={10} /> Cross-Sell Opportunities
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     <span className="px-3 py-1.5 bg-white text-slate-600 rounded-xl text-[11px] font-bold border border-slate-200 shadow-sm">
//                       Printers Sold: {leads.filter(l => l.value && parseFloat(l.value) > 10000).length}
//                     </span>
//                     <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-[11px] font-black shadow-sm">
//                       White Space Analysis Active
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };






import React, { useEffect, useState } from 'react';
import {
  Target, MapPin, Building, Crosshair, Users, Activity,
  Tag as TagIcon, Loader2, TrendingUp, BarChart2, Layers,
  DollarSign, CheckCircle2, XCircle, Zap, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie,
} from 'recharts';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

/* ─── Custom Tooltip ────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl"
      style={{ background:'#1e1b4b', border:'1px solid rgba(99,102,241,0.3)' }}>
      <p className="text-[10px] font-bold text-indigo-300 mb-0.5 uppercase tracking-wider">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="text-[13px] font-black text-white m-0">{e.value} {e.name || ''}</p>
      ))}
    </div>
  );
};

/* ─── SectionHead: gradient icon pill (no vertical line) ── */
const SectionHead = ({
  icon: Icon, title, subtitle, iconBg, iconGlow, badge,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string; subtitle: string; iconBg: string; iconGlow: string; badge?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: iconBg, boxShadow: `0 4px 14px ${iconGlow}` }}>
      <Icon size={17} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-[15px] font-black text-slate-800 leading-tight">{title}</h3>
      <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
    </div>
    {badge}
  </div>
);

export const BDMDashboard = () => {
  const [leads, setLeads]   = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeads().then(data => { setLeads(data); setLoading(false); });
  }, []);

  /* ── all original memos untouched ── */
  const verticalStats = React.useMemo(() => {
    const stats: Record<string, { count: number; revenue: number }> = {};
    leads.forEach(l => {
      const vName = (l as any).vertical?.name || 'Unassigned';
      if (!stats[vName]) stats[vName] = { count: 0, revenue: 0 };
      stats[vName].count++;
      stats[vName].revenue += parseFloat((l as any).value || '0');
    });
    return Object.entries(stats)
      .map(([name, d]) => ({ name, count: d.count, revenue: Math.round(d.revenue) }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const regionStats = React.useMemo(() => {
    const stats: Record<string, { count: number; won: number; lost: number }> = {};
    leads.forEach(l => {
      const rName = (l as any).region_rel?.name || 'Unassigned';
      if (!stats[rName]) stats[rName] = { count: 0, won: 0, lost: 0 };
      stats[rName].count++;
      if (l.status === 'won')  stats[rName].won++;
      if (l.status === 'lost') stats[rName].lost++;
    });
    return Object.entries(stats)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const segmentStats = React.useMemo(() => {
    const mql = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
    const sql = leads.filter(l => l.status === 'negotiation' || l.status === 'won').length;
    return { mql, sql };
  }, [leads]);

  // NEW: Lead source breakdown
  const sourceStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach(l => {
      const src = (l as any).source || 'other';
      stats[src] = (stats[src] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  // NEW: Top value leads
  const topLeads = React.useMemo(() => {
    return [...leads]
      .sort((a, b) => parseFloat((b as any).value || '0') - parseFloat((a as any).value || '0'))
      .slice(0, 5);
  }, [leads]);

  // NEW: Derived KPIs
  const totalRevenue = leads.reduce((a, l) => a + parseFloat((l as any).value || '0'), 0);
  const wonRevenue   = leads.filter(l => l.status === 'won').reduce((a, l) => a + parseFloat((l as any).value || '0'), 0);
  const wonCount     = leads.filter(l => l.status === 'won').length;
  const lostCount    = leads.filter(l => l.status === 'lost').length;
  const winRate      = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

  /* ── loading ── */
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
        <div className="flex flex-col items-center bg-white rounded-2xl px-12 py-10"
          style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 8px 32px rgba(79,70,229,0.12)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
            <div className="w-6 h-6 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-[15px] font-black text-slate-700 mb-0.5">Loading intelligence…</p>
          <p className="text-[12px] text-slate-400 font-medium">Crunching your pipeline data</p>
        </div>
      </div>
    );
  }

  const SOURCE_COLORS = ['#4f46e5','#10b981','#f59e0b','#3b82f6','#9333ea','#ef4444'];

  const VERTICAL_COLORS = [
    'linear-gradient(90deg,#4f46e5,#7c3aed)',
    'linear-gradient(90deg,#7c3aed,#9333ea)',
    'linear-gradient(90deg,#3b82f6,#06b6d4)',
    'linear-gradient(90deg,#f59e0b,#f97316)',
    'linear-gradient(90deg,#10b981,#0d9488)',
    'linear-gradient(90deg,#ef4444,#f43f5e)',
  ];

  const PDCA_STEPS = [
    { l:'P', name:'Plan',  desc:'Set Targets',  grad:'linear-gradient(135deg,#4f46e5,#7c3aed)', glow:'rgba(79,70,229,0.4)'  },
    { l:'D', name:'Do',    desc:'Campaigns',    grad:'linear-gradient(135deg,#10b981,#0d9488)', glow:'rgba(16,185,129,0.4)' },
    { l:'C', name:'Check', desc:'Gap Analysis', grad:'linear-gradient(135deg,#0ea5e9,#0284c7)', glow:'rgba(14,165,233,0.4)' },
    { l:'A', name:'Act',   desc:'Review & Fix', grad:'linear-gradient(135deg,#f59e0b,#f97316)', glow:'rgba(245,158,11,0.4)' },
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
        @keyframes growBar {
          from { width:0%; }
        }
        .anim-blob { animation:floatBlob 7s ease-in-out infinite; }
        .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .12s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .20s }
        .f4 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .28s }
        .f5 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .36s }
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }
        .bar-grow { animation:growBar .9s cubic-bezier(0.34,1.1,0.64,1) forwards; animation-delay:.4s; }

        /* dash cards */
        .bdm-card {
          background:#ffffff; border-radius:18px;
          transition:all .25s cubic-bezier(0.34,1.1,0.64,1);
        }
        .bdm-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(79,70,229,0.1),0 2px 8px rgba(0,0,0,0.05) !important; }

        /* PDCA card */
        .pdca-card { transition:all .25s cubic-bezier(0.34,1.2,0.64,1); }
        .pdca-card:hover { transform:translateY(-5px) scale(1.02); }

        /* top lead row */
        .lead-row { transition:all .15s ease; }
        .lead-row:hover { transform:translateX(3px); background:#f8fafc !important; }
      `}</style>

      {/* blobs */}
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
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">BD Core Intelligence</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Live breakdown of Verticals, Regions, and Pipeline Segments.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 flex-wrap shrink-0">
            {[
              { label:'Leads Live', value:leads.length,       color:'rgba(255,255,255,0.12)' },
              { label:'Win Rate',   value:`${winRate}%`,      color:'rgba(16,185,129,0.28)'  },
              { label:'Pipeline',   value:`$${(totalRevenue/1000).toFixed(0)}k`, color:'rgba(255,255,255,0.12)' },
            ].map(k => (
              <div key={k.label} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black text-white"
                style={{ backgroundColor:k.color, border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
                <span className="text-white/60">{k.label}</span>
                <span>{k.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── ROW 1: KPI mini cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 f2">
          {[
            { label:'Total Pipeline',  value:`$${totalRevenue.toLocaleString()}`, icon:DollarSign,   bg:'linear-gradient(135deg,#4f46e5,#7c3aed)', glow:'rgba(79,70,229,0.3)',   border:'#e0e7ff' },
            { label:'Won Revenue',     value:`$${wonRevenue.toLocaleString()}`,   icon:TrendingUp,   bg:'linear-gradient(135deg,#10b981,#0d9488)', glow:'rgba(16,185,129,0.3)',  border:'#d1fae5' },
            { label:'Won Leads',       value:`${wonCount} leads`,                 icon:CheckCircle2, bg:'linear-gradient(135deg,#3b82f6,#0284c7)', glow:'rgba(59,130,246,0.3)',  border:'#dbeafe' },
            { label:'Lost Leads',      value:`${lostCount} leads`,                icon:XCircle,      bg:'linear-gradient(135deg,#f43f5e,#ef4444)', glow:'rgba(244,63,94,0.3)',   border:'#fecdd3' },
          ].map(item => (
            <div key={item.label} className="bdm-card flex items-center gap-4 px-4 py-4"
              style={{ border:`1.5px solid ${item.border}`, boxShadow:`0 4px 16px ${item.glow},0 1px 4px rgba(0,0,0,0.04)` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:item.bg, boxShadow:`0 4px 12px ${item.glow}` }}>
                <item.icon size={17} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 truncate">{item.label}</p>
                <p className="text-[18px] font-black text-slate-800 leading-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROW 2: PDCA Cards ── */}
        <div className="f2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
              <Layers size={17} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-black text-slate-800">PDCA Framework Overview</p>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">Plan · Do · Check · Act cycle</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PDCA_STEPS.map(step => (
              <div key={step.l} className="pdca-card rounded-2xl p-5 flex flex-col relative overflow-hidden cursor-default"
                style={{ background:step.grad, boxShadow:`0 8px 24px ${step.glow}` }}>
                <div className="shimmer-overlay" />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0 relative z-10"
                  style={{ backgroundColor:'rgba(255,255,255,0.18)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.25)' }}>
                  <span className="text-[22px] font-black text-white leading-none">{step.l}</span>
                </div>
                <p className="text-[13px] font-black text-white uppercase tracking-wide leading-tight relative z-10">{step.name}</p>
                <p className="text-[11px] text-white/70 mt-1 font-medium relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: Vertical Penetration + Revenue by Vertical ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 f3">

          {/* Vertical Penetration — bar chart (upgraded from plain bars) */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
            <div className="p-5">
              <SectionHead icon={Building} title="Vertical Penetration" subtitle="Lead count by industry vertical"
                iconBg="linear-gradient(135deg,#4f46e5,#7c3aed)" iconGlow="rgba(79,70,229,0.35)"
                badge={<span className="text-[11px] font-black px-2.5 py-1 rounded-full"
                  style={{ background:'#eef2ff', color:'#4338ca', border:'1px solid #c7d2fe' }}>
                  {verticalStats.length} verticals
                </span>} />
              {verticalStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background:'linear-gradient(145deg,#f1f5f9,#e2e8f0)', border:'1.5px dashed #cbd5e1' }}>
                    <BarChart2 size={20} className="text-slate-300" />
                  </div>
                  <p className="text-[13px] font-black text-slate-400">No vertical data yet</p>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">Add leads with verticals to see breakdown.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {verticalStats.map((v, i) => {
                    const pct = Math.round((v.count / leads.length) * 100);
                    return (
                      <div key={v.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: VERTICAL_COLORS[i % VERTICAL_COLORS.length].split(',')[2]?.split(')')[0] || '#6366f1' }} />
                            <span className="text-[13px] font-black text-slate-700">{v.name}</span>
                          </div>
                          <span className="text-[11px] font-black px-2.5 py-1 rounded-lg"
                            style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', color:'#475569' }}>
                            {v.count} · {pct}%
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'#f1f5f9' }}>
                          <div className="h-full rounded-full bar-grow"
                            style={{ width:`${pct}%`, background:VERTICAL_COLORS[i % VERTICAL_COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Revenue by Vertical — recharts BarChart (NEW) */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #d1fae5', boxShadow:'0 4px 20px rgba(16,185,129,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#10b981,#0d9488)' }} />
            <div className="p-5">
              <SectionHead icon={DollarSign} title="Revenue by Vertical" subtitle="Pipeline value distribution"
                iconBg="linear-gradient(135deg,#10b981,#0d9488)" iconGlow="rgba(16,185,129,0.35)" />
              {verticalStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background:'linear-gradient(145deg,#f1f5f9,#e2e8f0)', border:'1.5px dashed #cbd5e1' }}>
                    <DollarSign size={20} className="text-slate-300" />
                  </div>
                  <p className="text-[13px] font-black text-slate-400">No revenue data yet</p>
                </div>
              ) : (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={208}>
                    <BarChart data={verticalStats.slice(0,6)} barCategoryGap="30%"
                      margin={{ top:4, right:4, left:-20, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false}
                        tick={{ fill:'#64748b', fontSize:10, fontWeight:600 }}
                        tickFormatter={v => v.length > 8 ? v.slice(0,8)+'…' : v} />
                      <YAxis axisLine={false} tickLine={false}
                        tick={{ fill:'#94a3b8', fontSize:10 }} width={32}
                        tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
                      <Tooltip content={<CustomTooltip />}
                        cursor={{ fill:'rgba(16,185,129,0.04)', radius:6 } as any} />
                      <Bar dataKey="revenue" radius={[8,8,0,0]} maxBarSize={40}>
                        {verticalStats.slice(0,6).map((_,i) => (
                          <Cell key={i} fill={['#10b981','#0d9488','#6366f1','#f59e0b','#3b82f6','#ef4444'][i % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 4: Region + Source Pie + Top Leads ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 f4">

          {/* Region breakdown — won/lost per region (NEW) */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #ede9fe', boxShadow:'0 4px 20px rgba(124,58,237,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#7c3aed,#9333ea)' }} />
            <div className="p-5">
              <SectionHead icon={MapPin} title="Region Analysis" subtitle="Won vs Lost per region"
                iconBg="linear-gradient(135deg,#7c3aed,#9333ea)" iconGlow="rgba(124,58,237,0.35)" />
              {regionStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin size={24} className="text-slate-200 mb-2" />
                  <p className="text-[12px] font-black text-slate-400">No region data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {regionStats.slice(0, 5).map((r, i) => {
                    const wonPct = r.count ? Math.round((r.won / r.count) * 100) : 0;
                    return (
                      <div key={r.name} className="p-3 rounded-xl"
                        style={{ background:'#f8fafc', border:'1.5px solid #f1f5f9' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
                              style={{ background:'linear-gradient(135deg,#7c3aed,#9333ea)' }}>{i + 1}</span>
                            <span className="text-[13px] font-black text-slate-700">{r.name}</span>
                          </div>
                          <span className="text-[11px] font-black text-violet-700 px-2 py-0.5 rounded-lg"
                            style={{ background:'#f5f3ff', border:'1px solid #ddd6fe' }}>{r.count} leads</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 size={11} /> {r.won} won
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-500">
                            <XCircle size={11} /> {r.lost} lost
                          </div>
                          <span className="ml-auto text-[11px] font-black"
                            style={{ color: wonPct >= 50 ? '#10b981' : '#f59e0b' }}>{wonPct}% win</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lead Source Breakdown (NEW) */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #dbeafe', boxShadow:'0 4px 20px rgba(59,130,246,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#3b82f6,#06b6d4)' }} />
            <div className="p-5">
              <SectionHead icon={Zap} title="Lead Sources" subtitle="Where your leads come from"
                iconBg="linear-gradient(135deg,#3b82f6,#0284c7)" iconGlow="rgba(59,130,246,0.35)" />
              {sourceStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Zap size={24} className="text-slate-200 mb-2" />
                  <p className="text-[12px] font-black text-slate-400">No source data</p>
                </div>
              ) : (
                <>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
                      <PieChart>
                        <Pie data={sourceStats} dataKey="value" innerRadius={42} outerRadius={60}
                          stroke="none" startAngle={90} endAngle={-270} cornerRadius={4}>
                          {sourceStats.map((_, i) => (
                            <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {sourceStats.map((s, i) => {
                      const pct = leads.length ? Math.round((s.value / leads.length) * 100) : 0;
                      return (
                        <div key={s.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0"
                              style={{ background:SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                            <span className="text-[12px] font-medium text-slate-600 capitalize">{s.name}</span>
                          </div>
                          <span className="text-[12px] font-black text-slate-700">{s.value} · {pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top Value Leads (NEW) */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #fef3c7', boxShadow:'0 4px 20px rgba(245,158,11,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f59e0b,#f97316)' }} />
            <div className="p-5">
              <SectionHead icon={TrendingUp} title="Top Value Leads" subtitle="Highest pipeline opportunities"
                iconBg="linear-gradient(135deg,#f59e0b,#f97316)" iconGlow="rgba(245,158,11,0.35)" />
              {topLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp size={24} className="text-slate-200 mb-2" />
                  <p className="text-[12px] font-black text-slate-400">No leads yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {topLeads.map((lead, i) => {
                    const STATUS_COLORS: Record<string, string> = {
                      new:'#3b82f6', contacted:'#6366f1', negotiation:'#f59e0b', won:'#10b981', lost:'#94a3b8',
                    };
                    const initials = lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <div key={lead.id}
                        className="lead-row flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background:'#f8fafc', border:'1.5px solid #f1f5f9' }}>
                        <span className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0"
                          style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)' }}>{i + 1}</span>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
                          style={{ background:`linear-gradient(135deg,${STATUS_COLORS[lead.status] || '#6366f1'},${STATUS_COLORS[lead.status] || '#7c3aed'})` }}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black text-slate-800 truncate">{lead.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate">{lead.company}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-black text-amber-600">${parseFloat((lead as any).value).toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-medium capitalize">{lead.status}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 5: Pipeline Segments + Cross-Sell ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 f5">

          {/* Pipeline Segment — MQL / SQL */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #ede9fe', boxShadow:'0 4px 20px rgba(124,58,237,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#9333ea,#d946ef)' }} />
            <div className="p-5">
              <SectionHead icon={Users} title="Pipeline Segments" subtitle="MQL vs SQL lead classification"
                iconBg="linear-gradient(135deg,#9333ea,#d946ef)" iconGlow="rgba(147,51,234,0.35)" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:'MQL (Marketing Qualified)', value:segmentStats.mql, desc:'New + Contacted', bg:'#faf5ff', border:'#ddd6fe', text:'#7e22ce', dot:'#9333ea' },
                  { label:'SQL (Sales Qualified)',      value:segmentStats.sql, desc:'Negotiation + Won', bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca', dot:'#6366f1' },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl"
                    style={{ background:s.bg, border:`1.5px solid ${s.border}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background:s.dot }} />
                      <p className="text-[11px] font-black uppercase tracking-wider" style={{ color:s.text }}>{s.label}</p>
                    </div>
                    <p className="text-[32px] font-black leading-none mb-1" style={{ color:s.text }}>{s.value}</p>
                    <p className="text-[11px] font-medium text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-3 rounded-full overflow-hidden" style={{ background:'#f1f5f9' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width:`${leads.length ? Math.round((segmentStats.sql/leads.length)*100) : 0}%`,
                    background:'linear-gradient(90deg,#9333ea,#6366f1)',
                  }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] font-bold text-purple-500">MQL {segmentStats.mql}</span>
                <span className="text-[10px] font-bold text-indigo-500">SQL {segmentStats.sql}</span>
              </div>
            </div>
          </div>

          {/* Cross-Sell Opportunities */}
          <div className="bdm-card overflow-hidden"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
            <div className="p-5">
              <SectionHead icon={TagIcon} title="Cross-Sell Opportunities" subtitle="White-space analysis signals"
                iconBg="linear-gradient(135deg,#4f46e5,#7c3aed)" iconGlow="rgba(79,70,229,0.35)" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label:'High Value',    value:leads.filter(l => parseFloat((l as any).value||'0') > 10000).length, bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca' },
                  { label:'Won Accounts',  value:wonCount,    bg:'#ecfdf5', border:'#a7f3d0', text:'#065f46' },
                  { label:'Active Region', value:regionStats.filter(r => r.count > 0).length, bg:'#faf5ff', border:'#ddd6fe', text:'#7e22ce' },
                  { label:'Verticals',     value:verticalStats.filter(v => v.count > 0).length, bg:'#fffbeb', border:'#fde68a', text:'#b45309' },
                ].map(c => (
                  <div key={c.label} className="p-3 rounded-xl text-center"
                    style={{ background:c.bg, border:`1.5px solid ${c.border}` }}>
                    <p className="text-[22px] font-black" style={{ color:c.text }}>{c.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider" style={{ color:`${c.text}99` }}>{c.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', border:'1.5px solid #c7d2fe' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 3px 8px rgba(79,70,229,0.3)' }}>
                  <ArrowUpRight size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-black text-indigo-700">White Space Analysis Active</p>
                  <p className="text-[11px] text-indigo-500 font-medium">Cross-sell signals detected across pipeline</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-4" />
      </div>
    </div>
  );
};
