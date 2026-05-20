// import React, { useEffect, useState } from 'react';
// import {
//   TrendingUp, AlertTriangle, Loader2, DollarSign,
//   Target, Zap, BarChart3, ShieldAlert, Clock, Ghost, Activity
// } from 'lucide-react';
// import { api } from '../Utils/api';

// export const AIAnalytics: React.FC = () => {
//   const [forecast, setForecast] = useState<any>(null);
//   const [anomalies, setAnomalies] = useState<any>(null);
//   const [pipeline, setPipeline] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       api.aiRevenueForecast(3).catch(() => null),
//       api.aiAnomalies().catch(() => null),
//       api.aiPipelineIntelligence().catch(() => null),
//     ]).then(([f, a, p]) => {
//       setForecast(f);
//       setAnomalies(a);
//       setPipeline(p);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
//           <p className="text-slate-500 font-medium">Running AI analysis...</p>
//         </div>
//       </div>
//     );
//   }

//   const anomalyIcons: Record<string, { icon: any; color: string; bg: string }> = {
//     engagement_spike: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
//     ghost_lead: { icon: Ghost, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
//     stagnant_deal: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
//       {/* Header */}
//       <header className="mb-8">
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
//           <BarChart3 size={32} className="text-indigo-600" /> AI Analytics
//         </h2>
//         <p className="text-slate-500 mt-1">Pipeline intelligence, revenue forecasts, and anomaly detection.</p>
//       </header>

//       {/* KPI Cards */}
//       {pipeline && (
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
//           <StatCard label="Active Leads" value={pipeline.summary.total_active} icon={Target} theme="blue" />
//           <StatCard
//             label="Pipeline Value"
//             value={`$${pipeline.summary.pipeline_value >= 1000 ? (pipeline.summary.pipeline_value / 1000).toFixed(0) + 'k' : pipeline.summary.pipeline_value.toLocaleString()}`}
//             icon={DollarSign}
//             theme="emerald"
//           />
//           <StatCard label="Win Rate" value={`${pipeline.summary.win_rate}%`} icon={TrendingUp} theme="indigo" />
//           <StatCard label="At Risk" value={pipeline.summary.at_risk.toString()} icon={ShieldAlert} theme="red" />
//           <StatCard
//             label="Anomalies"
//             value={anomalies ? anomalies.total.toString() : '0'}
//             icon={AlertTriangle}
//             theme="amber"
//           />
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

//         {/* Revenue Forecast */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
//           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
//             <TrendingUp size={18} className="text-emerald-600" /> Revenue Forecast (3 Months)
//           </h3>

//           {forecast ? (
//             <div>
//               {/* Total */}
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="text-3xl font-black text-emerald-600">
//                   ${forecast.total_forecast >= 1000 ? (forecast.total_forecast / 1000).toFixed(0) + 'k' : forecast.total_forecast?.toLocaleString()}
//                 </span>
//                 <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
//                   forecast.trend === 'growing' ? 'bg-emerald-100 text-emerald-700' :
//                   forecast.trend === 'declining' ? 'bg-red-100 text-red-700' :
//                   'bg-slate-100 text-slate-600'
//                 }`}>
//                   {forecast.trend?.toUpperCase()}
//                 </span>
//               </div>

//               {/* Monthly Bars */}
//               <div className="space-y-4">
//                 {forecast.forecast?.map((f: any) => (
//                   <div key={f.month} className="flex items-center gap-4">
//                     <span className="text-sm font-bold text-slate-500 w-20">Month {f.month}</span>
//                     <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
//                       <div
//                         className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
//                         style={{ width: `${Math.min(100, (f.predicted_revenue / (forecast.total_forecast || 1)) * 100 * 3)}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-bold text-slate-700 w-20 text-right">
//                       ${f.predicted_revenue >= 1000 ? (f.predicted_revenue / 1000).toFixed(0) + 'k' : f.predicted_revenue}
//                     </span>
//                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
//                       f.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
//                       f.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
//                       'bg-red-100 text-red-700'
//                     }`}>
//                       {f.confidence}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Actions to Improve */}
//               {forecast.actions_to_improve && forecast.actions_to_improve.length > 0 && (
//                 <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
//                   <p className="text-xs font-bold text-blue-600 uppercase mb-2">How to improve</p>
//                   <ul className="space-y-1">
//                     {forecast.actions_to_improve.map((a: string, i: number) => (
//                       <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
//                         <span className="text-blue-400 mt-0.5">→</span>{a}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Weighted Pipeline */}
//               {forecast.weighted_pipeline && (
//                 <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
//                   <p className="text-xs font-bold text-slate-400 uppercase">Weighted Pipeline</p>
//                   <p className="text-lg font-black text-slate-700 mt-1">
//                     ${forecast.weighted_pipeline.toLocaleString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-10">
//               <p className="text-slate-400">No forecast data available. Score your leads first.</p>
//             </div>
//           )}
//         </div>

//         {/* Right Column: Top Opportunities + At Risk */}
//         {pipeline && (
//           <div className="space-y-6">
//             {/* Top Opportunities */}
//             <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
//               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
//                 <Target size={18} className="text-emerald-600" /> Top Opportunities
//               </h3>
//               <div className="space-y-3">
//                 {pipeline.top_opportunities && pipeline.top_opportunities.length > 0 ? (
//                   pipeline.top_opportunities.map((lead: any) => (
//                     <div key={lead.lead__id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{lead.lead__name}</p>
//                         <p className="text-xs text-slate-500">
//                           {lead.lead__company} • ${parseFloat(lead.lead__value).toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-lg font-black text-emerald-600">{lead.score?.toFixed(0)}</span>
//                         <p className="text-[10px] text-slate-400 uppercase">{lead.lead__status}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-slate-400 text-center py-6">Score leads to see top opportunities</p>
//                 )}
//               </div>
//             </div>

//             {/* Needs Attention */}
//             <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
//               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
//                 <ShieldAlert size={18} className="text-red-500" /> Needs Attention
//               </h3>
//               <div className="space-y-3">
//                 {pipeline.needs_attention && pipeline.needs_attention.length > 0 ? (
//                   pipeline.needs_attention.map((lead: any) => (
//                     <div key={lead.lead__id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100">
//                       <div>
//                         <p className="text-sm font-bold text-slate-800">{lead.lead__name}</p>
//                         <p className="text-xs text-slate-500">
//                           {lead.lead__company} • ${parseFloat(lead.lead__value).toLocaleString()}
//                         </p>
//                       </div>
//                       <span className="text-sm font-bold text-red-600">
//                         {(lead.churn_risk * 100).toFixed(0)}% risk
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-slate-400 text-center py-6">No at-risk leads detected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Anomalies Section */}
//       {anomalies && anomalies.anomalies && anomalies.anomalies.length > 0 && (
//         <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="font-bold text-slate-800 flex items-center gap-2">
//               <AlertTriangle size={18} className="text-amber-500" /> Detected Anomalies
//             </h3>
//             <div className="flex items-center gap-3">
//               <span className="text-sm font-bold text-slate-600">{anomalies.total} total</span>
//               {anomalies.critical > 0 && (
//                 <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg">
//                   {anomalies.critical} critical
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {anomalies.anomalies.map((a: any, i: number) => {
//               const config = anomalyIcons[a.type] || anomalyIcons.stagnant_deal;
//               const Icon = config.icon;

//               return (
//                 <div key={i} className={`p-4 rounded-xl border ${config.bg}`}>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Icon size={16} className={config.color} />
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       {a.type.replace(/_/g, ' ')}
//                     </span>
//                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto ${
//                       a.priority === 'critical' ? 'bg-red-100 text-red-700' :
//                       a.priority === 'high' ? 'bg-orange-100 text-orange-700' :
//                       'bg-amber-100 text-amber-700'
//                     }`}>
//                       {a.priority}
//                     </span>
//                   </div>
//                   <p className="text-sm font-bold text-slate-800">{a.lead_name}</p>
//                   <p className="text-xs text-slate-500 mt-0.5">{a.company}</p>
//                   <p className="text-xs text-slate-600 mt-2">{a.message}</p>
//                   <p className="text-xs text-indigo-600 mt-2 font-medium">→ {a.action}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Pipeline Breakdown */}
//       {pipeline && pipeline.pipeline && (
//         <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm mt-8">
//           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
//             <Activity size={18} className="text-indigo-600" /> Pipeline Breakdown
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {Object.entries(pipeline.pipeline).map(([key, data]: [string, any]) => (
//               <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
//                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{data.name}</p>
//                 <p className="text-2xl font-black text-slate-800">{data.count}</p>
//                 <p className="text-xs text-slate-500 mt-1">
//                   ${data.value >= 1000 ? (data.value / 1000).toFixed(0) + 'k' : data.value.toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* --- Stat Card Component --- */
// const StatCard = ({ label, value, icon: Icon, theme }: { label: string; value: string | number; icon: any; theme: string }) => {
//   const themes: Record<string, string> = {
//     blue: 'text-blue-600 bg-blue-50',
//     emerald: 'text-emerald-600 bg-emerald-50',
//     indigo: 'text-indigo-600 bg-indigo-50',
//     amber: 'text-amber-600 bg-amber-50',
//     red: 'text-red-600 bg-red-50',
//   };
//   const t = themes[theme] || themes.blue;

//   return (
//     <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
//       <div className={`w-10 h-10 rounded-xl ${t} flex items-center justify-center mb-3`}>
//         <Icon size={20} />
//       </div>
//       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
//       <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
//     </div>
//   );
// };


import React, { useEffect, useState, useRef } from 'react';
import {
  TrendingUp, AlertTriangle, Loader2, DollarSign,
  Target, Zap, BarChart3, ShieldAlert, Clock, Ghost, Activity,
  Sparkles, ArrowUp, ArrowDown, ChevronRight
} from 'lucide-react';
import { api } from '../Utils/api';

/* ─────────────────────────────────────────────────────────
   All original functions are untouched — only UI updated
───────────────────────────────────────────────────────── */

export const AIAnalytics: React.FC = () => {
  const [forecast, setForecast] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.aiRevenueForecast(3).catch(() => null),
      api.aiAnomalies().catch(() => null),
      api.aiPipelineIntelligence().catch(() => null),
    ]).then(([f, a, p]) => {
      setForecast(f);
      setAnomalies(a);
      setPipeline(p);
      setLoading(false);
    });
  }, []);

  /* ── anomaly icon map — unchanged ── */
  const anomalyIcons: Record<string, { icon: any; color: string; bg: string }> = {
    engagement_spike: { icon: Zap,           color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200'  },
    ghost_lead:       { icon: Ghost,          color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200'  },
    stagnant_deal:    { icon: Clock,          color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-200'   },
  };

  /* ── loading screen ── */
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden font-sans">
        <style>{STYLES}</style>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden w-72">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <div className="p-10 flex flex-col items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <span className="pulse-ring absolute inset-0 rounded-full" />
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg relative z-10">
                  <BarChart3 size={20} className="text-white" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[14px] font-black text-slate-700">Running AI analysis…</p>
                <p className="text-[12px] text-slate-400 mt-1 font-medium">Processing pipeline intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── derived values ── */
  const totalAnomalies   = anomalies?.total ?? 0;
  const criticalAnomalies = anomalies?.critical ?? 0;

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden font-sans">
      <style>{STYLES}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

      {/* ══════════════════════════════════════════════════
          BANNER — identical pattern to AIProspector
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        {/* top section */}
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <BarChart3 className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">AI Analytics</h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Pipeline intelligence, revenue forecasts, and anomaly detection
            </p>
          </div>

          {/* quick-stat pills — shown when data is loaded */}
          {pipeline && (
            <div className="hidden sm:flex items-center gap-2 flex-wrap shrink-0">
              {[
                { label: 'Active',     value: pipeline.summary.total_active,                                                          color: 'rgba(255,255,255,0.12)' },
                { label: 'Win Rate',   value: `${pipeline.summary.win_rate}%`,                                                        color: 'rgba(16,185,129,0.25)'  },
                { label: 'At Risk',    value: pipeline.summary.at_risk,                                                               color: 'rgba(239,68,68,0.25)'   },
                { label: 'Anomalies', value: totalAnomalies,                                                                          color: 'rgba(255,255,255,0.12)' },
              ].map(k => (
                <div
                  key={k.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-white"
                  style={{ backgroundColor: k.color, border: '1px solid rgba(255,255,255,0.18)' }}
                >
                  <span className="text-white/60">{k.label}</span>
                  <span>{k.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* bottom stat-strip — pipeline value summary row */}
        
      </div>

      {/* ══════════════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* ── KPI STAT CARDS ── */}
        {pipeline && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 anim-fade-2">
            <SolidStatCard label="Active Leads"   value={pipeline.summary.total_active}  icon={Target}        gradient="bg-gradient-to-br from-indigo-500 to-violet-600"  sub="ongoing"            delay={0}   />
            <SolidStatCard
              label="Pipeline Value"
              value={pipeline.summary.pipeline_value >= 1000 ? (pipeline.summary.pipeline_value / 1000).toFixed(0) : pipeline.summary.pipeline_value}
              icon={DollarSign}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              sub="total value"
              prefix="$"
              suffix={pipeline.summary.pipeline_value >= 1000 ? 'k' : ''}
              delay={80}
            />
            <SolidStatCard label="Win Rate"       value={pipeline.summary.win_rate}      icon={TrendingUp}    gradient="bg-gradient-to-br from-blue-500 to-cyan-600"       sub="conversion"          delay={160} suffix="%" />
            <SolidStatCard label="At Risk"         value={pipeline.summary.at_risk}        icon={ShieldAlert}   gradient="bg-gradient-to-br from-red-500 to-rose-600"        sub="need attention"      delay={240} />
            <SolidStatCard
              label="Anomalies"
              value={anomalies ? anomalies.total : 0}
              icon={AlertTriangle}
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              sub="detected"
              delay={320}
            />
          </div>
        )}

        {/* ── ROW 1: Revenue Forecast + Top Opportunities side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-fade-2">

          {/* Revenue Forecast */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="p-5">
              <SectionHeader icon={TrendingUp} iconGradient="from-emerald-500 to-teal-500" title="Revenue Forecast" subtitle="3-month AI projection" accentColor="bg-emerald-500" />

              {forecast ? (
                <div>
                  {/* Total + trend badge */}
                  <div className="flex items-center gap-3 mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-0.5">Total Forecast</p>
                      <p className="text-[28px] font-black text-emerald-700 leading-none">
                        ${forecast.total_forecast >= 1000 ? (forecast.total_forecast / 1000).toFixed(0) + 'k' : forecast.total_forecast?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black border ${
                      forecast.trend === 'growing'   ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      forecast.trend === 'declining' ? 'bg-red-100    text-red-700    border-red-200'    :
                                                       'bg-slate-100  text-slate-600  border-slate-200'
                    }`}>
                      {forecast.trend === 'growing' ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                      {forecast.trend?.toUpperCase()}
                    </span>
                  </div>

                  {/* Monthly bars */}
                  <div className="space-y-3">
                    {forecast.forecast?.map((f: any, i: number) => (
                      <div key={f.month} className="flex items-center gap-3" style={{ animationDelay: `${i * 80}ms` }}>
                        <span className="text-[11px] font-black text-slate-500 w-16 shrink-0">Month {f.month}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, (f.predicted_revenue / (forecast.total_forecast || 1)) * 100 * 3)}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-black text-slate-700 w-16 text-right shrink-0">
                          ${f.predicted_revenue >= 1000 ? (f.predicted_revenue / 1000).toFixed(0) + 'k' : f.predicted_revenue}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0 ${
                          f.confidence === 'high'   ? 'bg-emerald-100 text-emerald-700' :
                          f.confidence === 'medium' ? 'bg-amber-100   text-amber-700'   :
                                                       'bg-red-100    text-red-700'
                        }`}>
                          {f.confidence}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions to improve */}
                  {forecast.actions_to_improve?.length > 0 && (
                    <div className="mt-5 rounded-xl overflow-hidden">
                      <div className="h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                      <div className="bg-blue-50 border border-blue-100 border-t-0 px-4 py-3">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-2">How to Improve</p>
                        <ul className="space-y-1.5">
                          {forecast.actions_to_improve.map((a: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-blue-800 font-medium">
                              <ChevronRight size={12} className="text-blue-400 mt-0.5 shrink-0" />{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Weighted pipeline */}
                  {forecast.weighted_pipeline && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Weighted Pipeline</p>
                      <p className="text-[16px] font-black text-slate-700">${forecast.weighted_pipeline.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <EmptySlate message="No forecast data available." sub="Score your leads first." />
              )}
            </div>
          </div>

          {/* Right column: Top Opportunities + Needs Attention stacked */}
          {pipeline && (
            <div className="flex flex-col gap-4">

              {/* Top Opportunities */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover flex-1">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="p-5">
                  <SectionHeader icon={Target} iconGradient="from-indigo-500 to-violet-600" title="Top Opportunities" subtitle="Highest-scored leads" accentColor="bg-indigo-500" />
                  <div className="space-y-2 mt-1">
                    {pipeline.top_opportunities?.length > 0 ? (
                      pipeline.top_opportunities.map((lead: any, i: number) => (
                        <div
                          key={lead.lead__id}
                          className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 card-hover"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                              {lead.lead__name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-black text-slate-800 truncate">{lead.lead__name}</p>
                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                {lead.lead__company} · ${parseFloat(lead.lead__value).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-[18px] font-black text-indigo-600 leading-none">{lead.score?.toFixed(0)}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">{lead.lead__status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptySlate message="Score leads to see top opportunities" />
                    )}
                  </div>
                </div>
              </div>

              {/* Needs Attention */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover flex-1">
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />
                <div className="p-5">
                  <SectionHeader icon={ShieldAlert} iconGradient="from-red-500 to-rose-600" title="Needs Attention" subtitle="High churn risk leads" accentColor="bg-red-500" />
                  <div className="space-y-2 mt-1">
                    {pipeline.needs_attention?.length > 0 ? (
                      pipeline.needs_attention.map((lead: any, i: number) => (
                        <div
                          key={lead.lead__id}
                          className="flex items-center justify-between p-3 bg-red-50/60 rounded-xl border border-red-100 card-hover"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                              {lead.lead__name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-black text-slate-800 truncate">{lead.lead__name}</p>
                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                {lead.lead__company} · ${parseFloat(lead.lead__value).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-[16px] font-black text-red-600 leading-none">
                              {(lead.churn_risk * 100).toFixed(0)}%
                            </p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Risk</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptySlate message="No at-risk leads detected" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── ROW 2: Anomalies + Pipeline Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 anim-fade-3">

          {/* Anomalies — wider */}
          {anomalies?.anomalies?.length > 0 && (
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover">
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <SectionHeader icon={AlertTriangle} iconGradient="from-amber-400 to-orange-500" title="Detected Anomalies" subtitle="AI-flagged pipeline events" accentColor="bg-amber-400" />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                      {anomalies.total} total
                    </span>
                    {criticalAnomalies > 0 && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-red-50 text-red-700 border border-red-200">
                        {criticalAnomalies} critical
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {anomalies.anomalies.map((a: any, i: number) => {
                    const cfg  = anomalyIcons[a.type] || anomalyIcons.stagnant_deal;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={i}
                        className={`rounded-xl border overflow-hidden ${cfg.bg} card-hover`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={cfg.color} />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                {a.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0 ${
                              a.priority === 'critical' ? 'bg-red-100    text-red-700'    :
                              a.priority === 'high'     ? 'bg-orange-100 text-orange-700' :
                                                          'bg-amber-100  text-amber-700'
                            }`}>
                              {a.priority}
                            </span>
                          </div>
                          <p className="text-[12px] font-black text-slate-800">{a.lead_name}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{a.company}</p>
                          <p className="text-[11px] text-slate-600 mt-1.5">{a.message}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <ChevronRight size={11} className="text-indigo-400" />
                            <p className="text-[11px] text-indigo-600 font-black">{a.action}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Pipeline Breakdown — narrower */}
          {pipeline?.pipeline && (
            <div className={`${anomalies?.anomalies?.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5'} bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden card-hover`}>
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />
              <div className="p-5">
                <SectionHeader icon={Activity} iconGradient="from-indigo-500 to-blue-600" title="Pipeline Breakdown" subtitle="Leads by stage" accentColor="bg-indigo-500" />

                <div className="space-y-2 mt-1">
                  {Object.entries(pipeline.pipeline).map(([key, data]: [string, any], i: number) => {
                    const stageColors: Record<string, string> = {
                      new:         '#3b82f6',
                      contacted:   '#6366f1',
                      negotiation: '#f59e0b',
                      won:         '#10b981',
                      lost:        '#94a3b8',
                    };
                    const color = stageColors[key] || '#6366f1';
                    const maxCount = Math.max(...Object.values(pipeline.pipeline).map((d: any) => d.count), 1);
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-wide">{data.name}</p>
                            <p className="text-[11px] font-black text-slate-700">{data.count}</p>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.round((data.count / maxCount) * 100)}%`, backgroundColor: color }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                            ${data.value >= 1000 ? (data.value / 1000).toFixed(0) + 'k' : data.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pb-2" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────────────────── */

/* ── AnimatedNumber — same RAF easing as BDMTargetsList ── */
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start    = performance.now();
    const duration = 900;
    const tick     = (now: number) => {
      const p     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{display}</>;
};

/* ── StatCard — exact BDM design: decorative circles, frosted icon, animated counter ── */
const SolidStatCard = ({
  label, value, icon: Icon, gradient, delay, prefix = '', suffix = '', sub,
}: {
  label: string; value: string | number; icon: any;
  gradient: string; delay: number; prefix?: string; suffix?: string; sub?: string;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const raw     = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const numeric = isNaN(raw) ? 0 : raw;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md  ${gradient}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      {/* decorative circles — exact BDM pattern */}
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1   top-8  h-12 w-12 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 mb-1.5">{label}</p>
          <p className="text-[2rem] font-black leading-none tabular-nums">
            {prefix}{visible ? <AnimatedNumber value={numeric} /> : 0}{suffix}
          </p>
          {sub && <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>}
        </div>
        {/* frosted icon box — exact BDM pattern */}
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

const SectionHeader = ({
  icon: Icon, iconGradient, title, subtitle, accentColor,
}: { icon: any; iconGradient: string; title: string; subtitle: string; accentColor: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-1 h-6 rounded-full shrink-0 ${accentColor}`} />
    <div className={`p-2 rounded-xl bg-gradient-to-br ${iconGradient} shadow-sm shrink-0`}>
      <Icon size={13} className="text-white" />
    </div>
    <div>
      <p className="text-[13px] font-black text-slate-800 leading-tight">{title}</p>
      <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const EmptySlate = ({ message, sub }: { message: string; sub?: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
      <BarChart3 size={18} className="text-slate-300" />
    </div>
    <p className="text-[12px] font-black text-slate-400">{message}</p>
    {sub && <p className="text-[10px] text-slate-300 mt-0.5 font-medium">{sub}</p>}
  </div>
);

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes floatBlob {
    0%,100% { transform: translateY(0px)   translateX(0px); }
    50%     { transform: translateY(-10px) translateX(6px); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.6); opacity: 0;  }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: .6; }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%);  }
  }
  .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
  .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay: .05s; }
  .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay: .15s; }
  .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay: .28s; }
  .pulse-ring::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(99,102,241,0.4);
    animation: pulseRing 1.5s ease-out infinite;
  }
  .card-hover { transition: all .2s ease; }
  .card-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -4px rgba(79,70,229,0.12); }
  .stat-shimmer { position:relative; overflow:hidden; }
  .stat-shimmer::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
    animation: shimmer 2.2s ease-in-out infinite;
  }
`;