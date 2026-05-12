import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { api } from '../Utils/api';
import type { DashboardStats } from '../Utils/types';

type ActivityItemType = {
  id: number;
  activity_type: string;
  summary?: string;
  created_at: string;
};

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusCount = (status: string) =>
    stats.status_distribution.find((s) => s.status === status)?.count || 0;

  const wonCount = getStatusCount('won');
  const contactedCount = getStatusCount('contacted');
  const newCount = getStatusCount('new');

  const pipelineData = [
    { name: 'New', value: newCount, color: '#60a5fa' },
    { name: 'Contacted', value: contactedCount, color: '#818cf8' },
    { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
    { name: 'Won', value: wonCount, color: '#22c55e' },
  ];

  const weeklyData = [
    { day: 'Mon', leads: 4, calls: 12 },
    { day: 'Tue', leads: 7, calls: 18 },
    { day: 'Wed', leads: 5, calls: 15 },
    { day: 'Thu', leads: 9, calls: 22 },
    { day: 'Fri', leads: 6, calls: 17 },
    { day: 'Sat', leads: 3, calls: 10 },
    { day: 'Sun', leads: 5, calls: 13 },
  ];

  const pieData = [
    { name: 'New', value: getStatusCount('new'), color: '#38bdf8' },
    { name: 'Contacted', value: getStatusCount('contacted'), color: '#6366f1' },
    { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
    { name: 'Won', value: getStatusCount('won'), color: '#22c55e' },
    { name: 'Lost', value: getStatusCount('lost'), color: '#f43f5e' },
  ];

  return (
    <div className="min-h-full p-6 bg-gradient-to-br from-blue-100 via-white to-cyan-100 relative">
      <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-56 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="relative bg-white/75 backdrop-blur-md border border-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(37,99,235,0.15)] mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
              <Sparkles size={14} />
              Revenue Intelligence
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Sales Performance Hub</h1>
            <p className="text-slate-600 mt-1">Track pipeline health, conversions, and daily momentum.</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200">
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} gradient="from-blue-500 to-cyan-600" />
        <StatCard title="Total Leads" value={stats.total_leads} change={8} icon={Users} gradient="from-blue-500 to-indigo-600" />
        <StatCard title="Win Rate" value={`${stats.win_rate}%`} change={3.2} icon={TrendingUp} gradient="from-sky-500 to-blue-700" />
        <StatCard title="Pending Leads" value={newCount} change={-2} icon={Clock} gradient="from-cyan-500 to-blue-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline by Stage</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {pipelineData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Conversion Snapshot</h2>
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={82} stroke="none">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">{stats.win_rate}%</p>
                <p className="text-xs text-slate-500">Win Ratio</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {pieData.map((item) => (
              <LegendRow key={item.name} color={item.color} label={`${item.name} (${item.value})`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Leads vs Calls</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }} />
                <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="url(#leadFill)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="calls" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <span className="text-xs text-slate-500">Last 5 updates</span>
          </div>
          <div className="space-y-3">
            {stats.recent_activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            {stats.recent_activities.length === 0 && (
              <p className="text-slate-400 text-center py-10">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
}) => (
  <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-200/60 to-cyan-200/40 shadow-md">
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border border-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {change >= 0 ? <ArrowUp size={14} className="text-emerald-500" /> : <ArrowDown size={14} className="text-rose-500" />}
        <span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{Math.abs(change)}%</span>
        <span className="text-sm text-slate-400">vs last month</span>
      </div>
    </div>
  </div>
);

const LegendRow = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-slate-600">{label}</span>
  </div>
);

const ActivityItem = ({ activity }: { activity: ActivityItemType }) => {
  const icons: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; color: string }> = {
    call: { icon: Phone, bg: 'bg-sky-100', color: 'text-sky-600' },
    email: { icon: Mail, bg: 'bg-violet-100', color: 'text-violet-600' },
    meeting: { icon: Calendar, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    note: { icon: FileText, bg: 'bg-amber-100', color: 'text-amber-600' },
  };

  const config = icons[activity.activity_type] || icons.note;
  const Icon = config.icon;

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className={`p-2.5 rounded-lg ${config.bg}`}>
        <Icon size={15} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{activity.summary || activity.activity_type}</p>
        <p className="text-xs text-slate-400">
          {new Date(activity.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
    </div>
  );
};

export default Dashboard;
