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

import React, { useEffect, useState } from 'react';
import {
  Target, MapPin, Building, Crosshair, Users, Activity,
  Tag as TagIcon, Loader2, TrendingUp, BarChart2, Layers,
} from 'lucide-react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

export const BDMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeads().then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  /* ── all original memos untouched ── */
  const verticalStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach(l => {
      const vName = l.vertical?.name || 'Unassigned';
      stats[vName] = (stats[vName] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const regionStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach(l => {
      const rName = l.region_rel?.name || 'Unassigned';
      stats[rName] = (stats[rName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [leads]);

  const segmentStats = React.useMemo(() => {
    const mql = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
    const sql = leads.filter(l => l.status === 'negotiation' || l.status === 'won').length;
    return { mql, sql };
  }, [leads]);

  /* ── loading ── */
  if (loading) {
    return (
      <div className="h-full bg-[#f0f2f8] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <p className="text-[13px] font-medium text-slate-400">Loading intelligence…</p>
      </div>
    );
  }

  const barColors = [
    'bg-gradient-to-r from-indigo-500 to-violet-500',
    'bg-gradient-to-r from-violet-500 to-purple-500',
    'bg-gradient-to-r from-blue-500 to-cyan-400',
    'bg-gradient-to-r from-amber-400 to-orange-400',
    'bg-gradient-to-r from-emerald-500 to-teal-400',
  ];

  const pdcaSteps = [
    {
      l: 'P', name: 'Plan', desc: 'Set Targets',
      gradient: 'from-indigo-500 to-violet-600',
      shadow: 'shadow-indigo-400/40',
      iconBg: 'bg-white/15',
    },
    {
      l: 'D', name: 'Do', desc: 'Campaigns',
      gradient: 'from-emerald-400 to-teal-600',
      shadow: 'shadow-emerald-400/40',
      iconBg: 'bg-white/15',
    },
    {
      l: 'C', name: 'Check', desc: 'Gap Analysis',
      gradient: 'from-sky-400 to-blue-600',
      shadow: 'shadow-sky-400/40',
      iconBg: 'bg-white/15',
    },
    {
      l: 'A', name: 'Act', desc: 'Review & Fix',
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-amber-400/40',
      iconBg: 'bg-white/15',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes growBar {
          from { width: 0%; }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
        .anim-fade-4 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.35s; }
        .bar-grow    { animation: growBar .8s ease-out forwards; animation-delay:.4s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — identical to WorkflowMonitor
      ══════════════════════════════════════════════════ */}
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
            backgroundImage:
              'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        >
          {/* icon block */}
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
              BDM Core Intelligence
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Live breakdown of Verticals, Regions, and Pipeline Segments.
            </p>
          </div>

          {/* live leads badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Activity size={14} className="text-indigo-200" />
            <span className="text-[12px] font-black text-indigo-100">{leads.length} Leads Live</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {/* section label */}
        <div className="flex items-center gap-3 anim-fade-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            PDCA Framework Overview
          </p>
        </div>

        {/* ── PDCA Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-fade-2">
          {pdcaSteps.map((step, i) => (
            <div
              key={step.l}
              className={`bg-gradient-to-br ${step.gradient} ${step.shadow} rounded-2xl p-5
                flex flex-col shadow-lg transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden relative`}
            >
              {/* subtle top bar shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />

              <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 shrink-0`}
                style={{ backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="text-[22px] font-black text-white leading-none">{step.l}</span>
              </div>
              <p className="text-[13px] font-black text-white uppercase tracking-wide leading-tight">
                {step.name}
              </p>
              <p className="text-[11px] text-white/75 mt-1 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* section label */}
        <div className="flex items-center gap-3 anim-fade-3">
          <div className="w-1 h-4 bg-violet-500 rounded-full" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Analytics & Market Breakdown
          </p>
        </div>

        {/* ── Charts grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-fade-4 pb-4">

          {/* VERTICAL PENETRATION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

            <div className="px-5 pt-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full bg-indigo-500 shrink-0" />
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                  <Building size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-black text-slate-800 leading-tight">Vertical Penetration</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Lead distribution by industry vertical</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 shrink-0">
                  {verticalStats.length} verticals
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {verticalStats.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 bg-indigo-50 text-indigo-500">
                    <BarChart2 size={16} />
                  </div>
                  <p className="text-[12px] font-black text-slate-500">No data yet</p>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Add leads with verticals.</p>
                </div>
              ) : (
                verticalStats.map((v, index) => {
                  const percentage = Math.round((v.count / leads.length) * 100);
                  return (
                    <div key={v.name}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${barColors[index % barColors.length].replace('bg-gradient-to-r ', '')}`} />
                          <span className="text-[13px] font-semibold text-slate-700">{v.name}</span>
                        </div>
                        <span className="text-[11px] font-black bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-lg">
                          {v.count} · {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${barColors[index % barColors.length]} h-2 rounded-full bar-grow`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MARKET CLASSIFICATIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

            <div className="px-5 pt-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full bg-violet-500 shrink-0" />
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
                  <Crosshair size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-black text-slate-800 leading-tight">Market Classifications</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Regions, pipeline stages & cross-sell signals</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Region Stats */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <MapPin size={10} /> Top Regions
                  </p>
                  {regionStats.length === 0 ? (
                    <p className="text-[11px] text-slate-400">No regions found</p>
                  ) : (
                    regionStats.slice(0, 3).map((r, i) => (
                      <div key={r.name} className="flex justify-between items-center mb-2.5 group">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-[12px] font-semibold text-slate-700">{r.name}</span>
                        </div>
                        <span className="text-[11px] font-black bg-white border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg">
                          {r.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Segment Stats */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-violet-100 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Users size={10} /> Pipeline Stage
                  </p>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[12px] font-semibold text-slate-700">MQL (New)</span>
                    <span className="flex items-center gap-2 text-[11px] font-black text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-lg">
                      {segmentStats.mql}
                      <span className="w-2 h-2 rounded-full bg-violet-500" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold text-slate-700">SQL (Active)</span>
                    <span className="flex items-center gap-2 text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                      {segmentStats.sql}
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Cross-Sell Alert */}
              <div className="rounded-xl overflow-hidden border border-indigo-100">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="p-4 bg-gradient-to-r from-indigo-50/60 to-violet-50/60">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <TagIcon size={10} /> Cross-Sell Opportunities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white text-slate-600 rounded-xl text-[11px] font-bold border border-slate-200 shadow-sm">
                      Printers Sold: {leads.filter(l => l.value && parseFloat(l.value) > 10000).length}
                    </span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-[11px] font-black shadow-sm">
                      White Space Analysis Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};