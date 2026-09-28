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
  const [forecast, setForecast]   = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [pipeline, setPipeline]   = useState<any>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.aiRevenueForecast(3).catch(() => null),
      api.aiAnomalies().catch(() => null),
      api.aiPipelineIntelligence().catch(() => null),
    ]).then(([f, a, p]) => {
      setForecast(f); setAnomalies(a); setPipeline(p); setLoading(false);
    });
  }, []);

  const anomalyIcons: Record<string, { icon: any; color: string; bg: string; border: string; glow: string }> = {
    engagement_spike: { icon: Zap,       color:'text-orange-600', bg:'#fff7ed', border:'#fed7aa', glow:'rgba(249,115,22,0.12)' },
    ghost_lead:       { icon: Ghost,     color:'text-purple-600', bg:'#faf5ff', border:'#ddd6fe', glow:'rgba(147,51,234,0.12)' },
    stagnant_deal:    { icon: Clock,     color:'text-amber-600',  bg:'#fffbeb', border:'#fde68a', glow:'rgba(245,158,11,0.12)' },
  };

  const totalAnomalies    = anomalies?.total ?? 0;
  const criticalAnomalies = anomalies?.critical ?? 0;

  /* ── loading ── */
  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden font-sans"
        style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
        <style>{STYLES}</style>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white overflow-hidden"
            style={{ borderRadius:'18px', border:'1.5px solid #e0e7ff', boxShadow:'0 8px 32px rgba(79,70,229,0.12)', width:'300px' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
            <div className="p-10 flex flex-col items-center gap-5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <span className="pulse-ring absolute inset-0 rounded-full" />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
                  <BarChart3 size={22} className="text-white animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-black text-slate-700">Running AI analysis…</p>
                <p className="text-[13px] text-slate-400 mt-1 font-medium">Processing pipeline intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans"
      style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
      <style>{STYLES}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay:'3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative anim-fade-1"
        style={{
          background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
          boxShadow:'0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
        }}>
        <div className="shimmer-overlay" />
        <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
          style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <BarChart3 className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">AI Analytics</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Pipeline intelligence, revenue forecasts, and anomaly detection
            </p>
          </div>
          {pipeline && (
            <div className="hidden sm:flex items-center gap-2 flex-wrap shrink-0">
              {[
                { label:'Active',    value:pipeline.summary.total_active,  color:'rgba(255,255,255,0.12)' },
                { label:'Win Rate',  value:`${pipeline.summary.win_rate}%`,color:'rgba(16,185,129,0.28)'  },
                { label:'At Risk',   value:pipeline.summary.at_risk,       color:'rgba(239,68,68,0.28)'   },
                { label:'Anomalies', value:totalAnomalies,                  color:'rgba(255,255,255,0.12)' },
              ].map(k => (
                <div key={k.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black text-white"
                  style={{ backgroundColor:k.color, border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
                  <span className="text-white/60">{k.label}</span>
                  <span>{k.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── KPI STAT CARDS ── */}
        {pipeline && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 anim-fade-2">
            <SolidStatCard label="Active Leads"   value={pipeline.summary.total_active}  icon={Target}      gradient="from-indigo-500 to-violet-600"  sub="ongoing"       delay={0}   />
            <SolidStatCard
              label="Pipeline Value"
              value={pipeline.summary.pipeline_value >= 1000 ? (pipeline.summary.pipeline_value / 1000).toFixed(0) : pipeline.summary.pipeline_value}
              icon={DollarSign} gradient="from-emerald-500 to-teal-600" sub="total value" prefix="$"
              suffix={pipeline.summary.pipeline_value >= 1000 ? 'k' : ''} delay={80} />
            <SolidStatCard label="Win Rate"     value={pipeline.summary.win_rate}   icon={TrendingUp}  gradient="from-blue-500 to-cyan-600"      sub="conversion"    delay={160} suffix="%" />
            <SolidStatCard label="At Risk"      value={pipeline.summary.at_risk}    icon={ShieldAlert} gradient="from-red-500 to-rose-600"        sub="need attention"delay={240} />
            <SolidStatCard label="Anomalies"    value={anomalies ? anomalies.total : 0} icon={AlertTriangle} gradient="from-amber-400 to-orange-500" sub="detected"  delay={320} />
          </div>
        )}

        {/* ── ROW 1: Revenue Forecast + Top Opportunities ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 anim-fade-2">

          {/* Revenue Forecast */}
          <div className="bg-white card-lift overflow-hidden"
            style={{ borderRadius:'18px', border:'1.5px solid #d1fae5', boxShadow:'0 4px 20px rgba(16,185,129,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#10b981,#0d9488)' }} />
            <div className="p-5">
              <SectionHeader icon={TrendingUp} iconGradient="from-emerald-500 to-teal-500" title="Revenue Forecast" subtitle="3-month AI projection" />

              {forecast ? (
                <div>
                  <div className="flex items-center gap-3 mb-5 p-4 rounded-xl"
                    style={{ background:'#ecfdf5', border:'1.5px solid #a7f3d0' }}>
                    <div>
                      <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-0.5">Total Forecast</p>
                      <p className="text-[28px] font-black text-emerald-700 leading-none">
                        ${forecast.total_forecast >= 1000 ? (forecast.total_forecast / 1000).toFixed(0) + 'k' : forecast.total_forecast?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black ${
                      forecast.trend === 'growing'   ? 'text-emerald-700' :
                      forecast.trend === 'declining' ? 'text-red-700'     : 'text-slate-600'
                    }`}
                      style={forecast.trend === 'growing'
                        ? { background:'#d1fae5', border:'1.5px solid #a7f3d0' }
                        : forecast.trend === 'declining'
                          ? { background:'#fee2e2', border:'1.5px solid #fca5a5' }
                          : { background:'#f1f5f9', border:'1.5px solid #e2e8f0' }}>
                      {forecast.trend === 'growing' ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                      {forecast.trend?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {forecast.forecast?.map((f: any, i: number) => (
                      <div key={f.month} className="flex items-center gap-3" style={{ animationDelay:`${i * 80}ms` }}>
                        <span className="text-[12px] font-black text-slate-500 w-16 shrink-0">Month {f.month}</span>
                        <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ background:'#f1f5f9' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width:`${Math.min(100,(f.predicted_revenue/(forecast.total_forecast||1))*100*3)}%`, background:'linear-gradient(90deg,#10b981,#0d9488)' }} />
                        </div>
                        <span className="text-[12px] font-black text-slate-700 w-16 text-right shrink-0">
                          ${f.predicted_revenue >= 1000 ? (f.predicted_revenue/1000).toFixed(0)+'k' : f.predicted_revenue}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg shrink-0 ${
                          f.confidence === 'high'   ? 'text-emerald-700' :
                          f.confidence === 'medium' ? 'text-amber-700'   : 'text-red-700'
                        }`}
                          style={f.confidence === 'high'
                            ? { background:'#d1fae5', border:'1px solid #a7f3d0' }
                            : f.confidence === 'medium'
                              ? { background:'#fef3c7', border:'1px solid #fde68a' }
                              : { background:'#fee2e2', border:'1px solid #fca5a5' }}>
                          {f.confidence}
                        </span>
                      </div>
                    ))}
                  </div>

                  {forecast.actions_to_improve?.length > 0 && (
                    <div className="mt-5 rounded-xl overflow-hidden">
                      <div className="h-[2px] w-full" style={{ background:'linear-gradient(90deg,#3b82f6,#6366f1)' }} />
                      <div className="px-4 py-3" style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderTop:'none' }}>
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-2">How to Improve</p>
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

                  {forecast.weighted_pipeline && (
                    <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl"
                      style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
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

          {/* Right column: Top Opportunities + Needs Attention */}
          {pipeline && (
            <div className="flex flex-col gap-4">

              <div className="bg-white card-lift overflow-hidden flex-1"
                style={{ borderRadius:'18px', border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                <div className="p-5">
                  <SectionHeader icon={Target} iconGradient="from-indigo-500 to-violet-600" title="Top Opportunities" subtitle="Highest-scored leads" />
                  <div className="space-y-2 mt-1">
                    {pipeline.top_opportunities?.length > 0 ? (
                      pipeline.top_opportunities.map((lead: any, i: number) => (
                        <div key={lead.lead__id}
                          className="opp-row flex items-center justify-between p-3 rounded-xl"
                          style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe', animationDelay:`${i*60}ms` }}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
                              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 10px rgba(79,70,229,0.3)' }}>
                              {lead.lead__name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-black text-slate-800 truncate">{lead.lead__name}</p>
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {lead.lead__company} · ${parseFloat(lead.lead__value).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-[20px] font-black text-indigo-600 leading-none">{lead.score?.toFixed(0)}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{lead.lead__status}</p>
                          </div>
                        </div>
                      ))
                    ) : <EmptySlate message="Score leads to see top opportunities" />}
                  </div>
                </div>
              </div>

              <div className="bg-white card-lift overflow-hidden flex-1"
                style={{ borderRadius:'18px', border:'1.5px solid #ffe4e6', boxShadow:'0 4px 20px rgba(239,68,68,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f43f5e,#ec4899)' }} />
                <div className="p-5">
                  <SectionHeader icon={ShieldAlert} iconGradient="from-red-500 to-rose-600" title="Needs Attention" subtitle="High churn risk leads" />
                  <div className="space-y-2 mt-1">
                    {pipeline.needs_attention?.length > 0 ? (
                      pipeline.needs_attention.map((lead: any, i: number) => (
                        <div key={lead.lead__id}
                          className="opp-row flex items-center justify-between p-3 rounded-xl"
                          style={{ background:'#fff1f2', border:'1.5px solid #fecdd3', animationDelay:`${i*60}ms` }}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
                              style={{ background:'linear-gradient(135deg,#f43f5e,#ec4899)', boxShadow:'0 4px 10px rgba(244,63,94,0.3)' }}>
                              {lead.lead__name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-black text-slate-800 truncate">{lead.lead__name}</p>
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {lead.lead__company} · ${parseFloat(lead.lead__value).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-[20px] font-black text-red-600 leading-none">{(lead.churn_risk*100).toFixed(0)}%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Risk</p>
                          </div>
                        </div>
                      ))
                    ) : <EmptySlate message="No at-risk leads detected" />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── ROW 2: Anomalies + Pipeline Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 anim-fade-3">

          {anomalies?.anomalies?.length > 0 && (
            <div className="lg:col-span-3 bg-white card-lift overflow-hidden"
              style={{ borderRadius:'18px', border:'1.5px solid #fef3c7', boxShadow:'0 4px 20px rgba(245,158,11,0.08),0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f59e0b,#f97316)' }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <SectionHeader icon={AlertTriangle} iconGradient="from-amber-400 to-orange-500" title="Detected Anomalies" subtitle="AI-flagged pipeline events" />
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-black"
                      style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', color:'#475569' }}>
                      {anomalies.total} total
                    </span>
                    {criticalAnomalies > 0 && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-black"
                        style={{ background:'#fff1f2', border:'1.5px solid #fecdd3', color:'#be123c' }}>
                        {criticalAnomalies} critical
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  {anomalies.anomalies.map((a: any, i: number) => {
                    const cfg  = anomalyIcons[a.type] || anomalyIcons.stagnant_deal;
                    const AIcon = cfg.icon;
                    return (
                      <div key={i}
                        className="anomaly-row rounded-xl overflow-hidden"
                        style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}`, animationDelay:`${i*50}ms` }}>
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <AIcon size={15} className={cfg.color} />
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                {a.type.replace(/_/g,' ')}
                              </span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg shrink-0 ${
                              a.priority === 'critical' ? 'text-red-700'    :
                              a.priority === 'high'     ? 'text-orange-700' : 'text-amber-700'
                            }`}
                              style={a.priority === 'critical'
                                ? { background:'#fee2e2', border:'1px solid #fca5a5' }
                                : a.priority === 'high'
                                  ? { background:'#ffedd5', border:'1px solid #fdba74' }
                                  : { background:'#fef3c7', border:'1px solid #fde68a' }}>
                              {a.priority}
                            </span>
                          </div>
                          <p className="text-[13px] font-black text-slate-800">{a.lead_name}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{a.company}</p>
                          <p className="text-[12px] text-slate-600 mt-1.5 leading-snug">{a.message}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <ChevronRight size={12} className="text-indigo-400" />
                            <p className="text-[12px] text-indigo-600 font-black">{a.action}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {pipeline?.pipeline && (
            <div className={`${anomalies?.anomalies?.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5'} bg-white card-lift overflow-hidden`}
              style={{ borderRadius:'18px', border:'1.5px solid #dbeafe', boxShadow:'0 4px 20px rgba(59,130,246,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#3b82f6)' }} />
              <div className="p-5">
                <SectionHeader icon={Activity} iconGradient="from-indigo-500 to-blue-600" title="Pipeline Breakdown" subtitle="Leads by stage" />
                <div className="space-y-2 mt-1">
                  {Object.entries(pipeline.pipeline).map(([key, data]: [string, any], i: number) => {
                    const stageColors: Record<string, string> = {
                      new:'#3b82f6', contacted:'#6366f1', negotiation:'#f59e0b', won:'#10b981', lost:'#94a3b8',
                    };
                    const color = stageColors[key] || '#6366f1';
                    const maxCount = Math.max(...Object.values(pipeline.pipeline).map((d: any) => d.count), 1);
                    return (
                      <div key={key}
                        className="pipeline-row flex items-center gap-3 p-3 rounded-xl"
                        style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', animationDelay:`${i*60}ms` }}>
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor:color, boxShadow:`0 0 6px ${color}88` }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-wide">{data.name}</p>
                            <p className="text-[12px] font-black text-slate-700">{data.count}</p>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background:'#e2e8f0' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width:`${Math.round((data.count/maxCount)*100)}%`, backgroundColor:color }} />
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">
                            ${data.value >= 1000 ? (data.value/1000).toFixed(0)+'k' : data.value.toLocaleString()}
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

        <div className="pb-4" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   SHARED UI COMPONENTS — logic untouched
───────────────────────────────────────────────────────── */

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now(); const duration = 900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{display}</>;
};

const SolidStatCard = ({
  label, value, icon: Icon, gradient, delay, prefix = '', suffix = '', sub,
}: {
  label: string; value: string | number; icon: any;
  gradient: string; delay: number; prefix?: string; suffix?: string; sub?: string;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const raw = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const numeric = isNaN(raw) ? 0 : raw;
  return (
    <div className={`stat-card relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transition:'all 0.35s cubic-bezier(0.34,1.1,0.64,1)', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
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
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

const SectionHeader = ({
  icon: Icon, iconGradient, title, subtitle,
}: { icon: any; iconGradient: string; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${iconGradient}`}
      style={{ boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
      <Icon size={17} className="text-white" />
    </div>
    <div>
      <p className="text-[15px] font-black text-slate-800 leading-tight">{title}</p>
      <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const EmptySlate = ({ message, sub }: { message: string; sub?: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
      style={{ background:'linear-gradient(145deg,#f8fafc,#f1f5f9)', border:'1.5px dashed #e2e8f0' }}>
      <BarChart3 size={20} className="text-slate-300" />
    </div>
    <p className="text-[13px] font-black text-slate-400">{message}</p>
    {sub && <p className="text-[11px] text-slate-300 mt-0.5 font-medium">{sub}</p>}
  </div>
);

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */
const STYLES = `
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
  @keyframes pulseRing {
    0%   { transform:scale(1);   opacity:.5; }
    100% { transform:scale(1.7); opacity:0; }
  }
  .anim-blob   { animation:floatBlob 7s ease-in-out infinite; }
  .anim-fade-1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
  .anim-fade-2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
  .anim-fade-3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .28s }
  .shimmer-overlay {
    position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
    background-size:200% 100%;
    animation:shimmer 4s ease-in-out infinite;
  }
  .pulse-ring::after {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:rgba(99,102,241,0.4);
    animation:pulseRing 1.5s ease-out infinite;
  }

  /* card lift */
  .card-lift { transition:all .25s cubic-bezier(0.34,1.1,0.64,1); }
  .card-lift:hover { transform:translateY(-4px) scale(1.005); }

  /* stat card hover */
  .stat-card { transition:all .25s cubic-bezier(0.34,1.2,0.64,1) !important; }
  .stat-card:hover { transform:translateY(-5px) scale(1.02) !important; box-shadow:0 12px 32px rgba(0,0,0,0.18) !important; }

  /* opportunity/risk rows */
  .opp-row { transition:all .18s ease; }
  .opp-row:hover { transform:translateX(3px); box-shadow:0 4px 12px rgba(0,0,0,0.06); }

  /* anomaly rows */
  .anomaly-row { transition:all .18s ease; }
  .anomaly-row:hover { transform:translateX(3px); box-shadow:0 4px 14px rgba(0,0,0,0.08); }

  /* pipeline rows */
  .pipeline-row { transition:all .18s ease; }
  .pipeline-row:hover { transform:translateX(3px); border-color:#c7d2fe !important; }
`;