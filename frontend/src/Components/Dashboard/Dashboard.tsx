import React, { useEffect, useState } from 'react';
import { DollarSign, Briefcase, TrendingUp, AlertCircle, Phone, Mail, Calendar, StickyNote, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../Utils/api';
import type { DashboardStats } from '../Utils/types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats().then(data => { setStats(data); setLoading(false); }).catch(console.error);
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const getStatusCount = (status: string) => stats.status_distribution.find(s => s.status === status)?.count || 0;

  const statusColors: Record<string, string> = {
    new: 'from-blue-500 to-cyan-500',
    contacted: 'from-indigo-500 to-purple-500',
    negotiation: 'from-amber-500 to-orange-500',
    won: 'from-emerald-500 to-green-500',
  };

  const activityIcons: Record<string, any> = {
    call: { icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
    email: { icon: Mail, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
    meeting: { icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
    note: { icon: StickyNote, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Executive Dashboard</h2>
          <p className="text-slate-500 mt-1">Welcome back! Here's your pipeline at a glance.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Pipeline Value"
          value={`$${stats.total_value.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-blue-500 to-indigo-600"
          trend="+12.5%"
          trendUp={true}
        />
        <KPICard
          title="Total Leads"
          value={stats.total_leads.toString()}
          icon={Briefcase}
          gradient="from-violet-500 to-purple-600"
          trend="+8"
          trendUp={true}
        />
        <KPICard
          title="Win Rate"
          value={`${stats.win_rate}%`}
          icon={TrendingUp}
          gradient="from-emerald-500 to-green-600"
          trend="+3.2%"
          trendUp={true}
        />
        <KPICard
          title="New Leads"
          value={getStatusCount('new').toString()}
          icon={AlertCircle}
          gradient="from-amber-500 to-orange-600"
          trend="Needs action"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Pipeline Funnel</h3>
              <p className="text-xs text-slate-500 mt-1">Distribution of leads across stages</p>
            </div>
          </div>
          <div className="space-y-5">
            {['new', 'contacted', 'negotiation', 'won'].map((status) => {
              const count = getStatusCount(status);
              const percentage = stats.total_leads > 0 ? (count / stats.total_leads) * 100 : 0;
              const barWidth = Math.max(percentage, 8);

              return (
                <div key={status} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusColors[status]}`} />
                      <span className="capitalize font-semibold text-slate-700">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">{count} leads</span>
                      <span className="text-slate-400 text-xs">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden group-hover:h-4 transition-all">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${statusColors[status]} transition-all duration-1000 ease-out shadow-sm`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/50 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-1">Latest team interactions</p>
          </div>
          <div className="space-y-5 overflow-y-auto flex-1 max-h-[350px] custom-scrollbar pr-1">
            {stats.recent_activities.map((act) => {
              const config = activityIcons[act.activity_type] || activityIcons.note;
              const IconComp = config.icon;
              return (
                <div key={act.id} className="flex gap-3 items-start group hover:bg-slate-50 p-2 -mx-2 rounded-xl transition">
                  <div className={`p-2.5 rounded-xl border ${config.bg} shrink-0`}>
                    <IconComp size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{act.summary || act.activity_type}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{act.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(act.created_at).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
            {stats.recent_activities.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <StickyNote className="mx-auto mb-3 opacity-30" size={40} />
                <p className="font-medium">No activities yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Premium KPI Card */
const KPICard = ({ title, value, icon: Icon, gradient, trend, trendUp }: any) => (
  <div className="relative bg-white rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-200/50 p-6 overflow-hidden group hover:shadow-md transition-all duration-300">
    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br opacity-[0.07] rounded-full group-hover:opacity-[0.12] transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);