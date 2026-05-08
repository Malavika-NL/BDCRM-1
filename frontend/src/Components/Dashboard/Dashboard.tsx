import React, { useEffect, useState } from 'react';
import { 
  DollarSign, Users, TrendingUp, Clock, Phone, 
  Mail, Calendar, FileText, ArrowUp, ArrowDown,
  MoreHorizontal, Plus, Search, Bell, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { api } from '../Utils/api';
import type { DashboardStats } from '../Utils/types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => { setStats(data); setLoading(false); })
      .catch(console.error);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusCount = (status: string) => 
    stats.status_distribution.find(s => s.status === status)?.count || 0;

  const pipelineData = [
    { name: 'New', value: getStatusCount('new') },
    { name: 'Contacted', value: getStatusCount('contacted') },
    { name: 'Negotiation', value: getStatusCount('negotiation') },
    { name: 'Won', value: getStatusCount('won') },
  ];

  const weeklyData = [
    { day: 'Mon', leads: 4 },
    { day: 'Tue', leads: 7 },
    { day: 'Wed', leads: 5 },
    { day: 'Thu', leads: 9 },
    { day: 'Fri', leads: 6 },
    { day: 'Sat', leads: 3 },
    { day: 'Sun', leads: 5 },
  ];

  const pieData = [
    { name: 'Won', value: getStatusCount('won'), color: '#22c55e' },
    { name: 'In Progress', value: stats.total_leads - getStatusCount('won'), color: '#e5e7eb' },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.total_value.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
        />
        <StatCard 
          title="Total Leads" 
          value={stats.total_leads}
          change={8}
          icon={Users}
        />
        <StatCard 
          title="Win Rate" 
          value={`${stats.win_rate}%`}
          change={3.2}
          icon={TrendingUp}
        />
        <StatCard 
          title="Pending" 
          value={getStatusCount('new')}
          change={-2}
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-64 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <BarChart data={pipelineData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Win Rate</h2>
          <div className="h-48 min-h-[192px] relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.win_rate}%</p>
                <p className="text-xs text-gray-500">Won</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Won ({getStatusCount('won')})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-sm text-gray-600">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Leads</h2>
          <div className="h-48 min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
              <LineChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {stats.recent_activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            {stats.recent_activities.length === 0 && (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Stat Card */
const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon size={20} className="text-blue-500" />
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1">
      {change >= 0 ? (
        <ArrowUp size={14} className="text-green-500" />
      ) : (
        <ArrowDown size={14} className="text-red-500" />
      )}
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {Math.abs(change)}%
      </span>
      <span className="text-sm text-gray-400 ml-1">vs last month</span>
    </div>
  </div>
);

/* Activity Item */
const ActivityItem = ({ activity }: any) => {
  const icons: Record<string, any> = {
    call: { icon: Phone, bg: 'bg-blue-50', color: 'text-blue-500' },
    email: { icon: Mail, bg: 'bg-purple-50', color: 'text-purple-500' },
    meeting: { icon: Calendar, bg: 'bg-green-50', color: 'text-green-500' },
    note: { icon: FileText, bg: 'bg-amber-50', color: 'text-amber-500' },
  };
  
  const config = icons[activity.activity_type] || icons.note;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <Icon size={16} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.summary || activity.activity_type}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(activity.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );
};

export default Dashboard;
