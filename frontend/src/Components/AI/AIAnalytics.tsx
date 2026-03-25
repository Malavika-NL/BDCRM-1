import React, { useEffect, useState } from 'react';
import {
  TrendingUp, AlertTriangle, Loader2, DollarSign,
  Target, Zap, BarChart3, ShieldAlert, Clock, Ghost, Activity
} from 'lucide-react';
import { api } from '../Utils/api';

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Running AI analysis...</p>
        </div>
      </div>
    );
  }

  const anomalyIcons: Record<string, { icon: any; color: string; bg: string }> = {
    engagement_spike: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    ghost_lead: { icon: Ghost, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    stagnant_deal: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
          <BarChart3 size={32} className="text-indigo-600" /> AI Analytics
        </h2>
        <p className="text-slate-500 mt-1">Pipeline intelligence, revenue forecasts, and anomaly detection.</p>
      </header>

      {/* KPI Cards */}
      {pipeline && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Active Leads" value={pipeline.summary.total_active} icon={Target} theme="blue" />
          <StatCard
            label="Pipeline Value"
            value={`$${pipeline.summary.pipeline_value >= 1000 ? (pipeline.summary.pipeline_value / 1000).toFixed(0) + 'k' : pipeline.summary.pipeline_value.toLocaleString()}`}
            icon={DollarSign}
            theme="emerald"
          />
          <StatCard label="Win Rate" value={`${pipeline.summary.win_rate}%`} icon={TrendingUp} theme="indigo" />
          <StatCard label="At Risk" value={pipeline.summary.at_risk.toString()} icon={ShieldAlert} theme="red" />
          <StatCard
            label="Anomalies"
            value={anomalies ? anomalies.total.toString() : '0'}
            icon={AlertTriangle}
            theme="amber"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Revenue Forecast */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" /> Revenue Forecast (3 Months)
          </h3>

          {forecast ? (
            <div>
              {/* Total */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-black text-emerald-600">
                  ${forecast.total_forecast >= 1000 ? (forecast.total_forecast / 1000).toFixed(0) + 'k' : forecast.total_forecast?.toLocaleString()}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  forecast.trend === 'growing' ? 'bg-emerald-100 text-emerald-700' :
                  forecast.trend === 'declining' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {forecast.trend?.toUpperCase()}
                </span>
              </div>

              {/* Monthly Bars */}
              <div className="space-y-4">
                {forecast.forecast?.map((f: any) => (
                  <div key={f.month} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-500 w-20">Month {f.month}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (f.predicted_revenue / (forecast.total_forecast || 1)) * 100 * 3)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-20 text-right">
                      ${f.predicted_revenue >= 1000 ? (f.predicted_revenue / 1000).toFixed(0) + 'k' : f.predicted_revenue}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
                      f.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {f.confidence}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions to Improve */}
              {forecast.actions_to_improve && forecast.actions_to_improve.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-2">How to improve</p>
                  <ul className="space-y-1">
                    {forecast.actions_to_improve.map((a: string, i: number) => (
                      <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">→</span>{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weighted Pipeline */}
              {forecast.weighted_pipeline && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Weighted Pipeline</p>
                  <p className="text-lg font-black text-slate-700 mt-1">
                    ${forecast.weighted_pipeline.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400">No forecast data available. Score your leads first.</p>
            </div>
          )}
        </div>

        {/* Right Column: Top Opportunities + At Risk */}
        {pipeline && (
          <div className="space-y-6">
            {/* Top Opportunities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target size={18} className="text-emerald-600" /> Top Opportunities
              </h3>
              <div className="space-y-3">
                {pipeline.top_opportunities && pipeline.top_opportunities.length > 0 ? (
                  pipeline.top_opportunities.map((lead: any) => (
                    <div key={lead.lead__id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{lead.lead__name}</p>
                        <p className="text-xs text-slate-500">
                          {lead.lead__company} • ${parseFloat(lead.lead__value).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600">{lead.score?.toFixed(0)}</span>
                        <p className="text-[10px] text-slate-400 uppercase">{lead.lead__status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">Score leads to see top opportunities</p>
                )}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" /> Needs Attention
              </h3>
              <div className="space-y-3">
                {pipeline.needs_attention && pipeline.needs_attention.length > 0 ? (
                  pipeline.needs_attention.map((lead: any) => (
                    <div key={lead.lead__id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{lead.lead__name}</p>
                        <p className="text-xs text-slate-500">
                          {lead.lead__company} • ${parseFloat(lead.lead__value).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        {(lead.churn_risk * 100).toFixed(0)}% risk
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">No at-risk leads detected</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anomalies Section */}
      {anomalies && anomalies.anomalies && anomalies.anomalies.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Detected Anomalies
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600">{anomalies.total} total</span>
              {anomalies.critical > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg">
                  {anomalies.critical} critical
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anomalies.anomalies.map((a: any, i: number) => {
              const config = anomalyIcons[a.type] || anomalyIcons.stagnant_deal;
              const Icon = config.icon;

              return (
                <div key={i} className={`p-4 rounded-xl border ${config.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={config.color} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {a.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto ${
                      a.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      a.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{a.lead_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.company}</p>
                  <p className="text-xs text-slate-600 mt-2">{a.message}</p>
                  <p className="text-xs text-indigo-600 mt-2 font-medium">→ {a.action}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pipeline Breakdown */}
      {pipeline && pipeline.pipeline && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm mt-8">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" /> Pipeline Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(pipeline.pipeline).map(([key, data]: [string, any]) => (
              <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{data.name}</p>
                <p className="text-2xl font-black text-slate-800">{data.count}</p>
                <p className="text-xs text-slate-500 mt-1">
                  ${data.value >= 1000 ? (data.value / 1000).toFixed(0) + 'k' : data.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Stat Card Component --- */
const StatCard = ({ label, value, icon: Icon, theme }: { label: string; value: string | number; icon: any; theme: string }) => {
  const themes: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
  };
  const t = themes[theme] || themes.blue;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl ${t} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  );
};