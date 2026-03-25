// import React, { useEffect, useState } from 'react';
// import { 
//   DollarSign, Briefcase, TrendingUp, AlertCircle, Phone, 
//   Mail, Calendar, StickyNote, ArrowUpRight, ArrowDownRight, 
//   Activity, Sparkles, Target, Zap, BarChart3, PieChart as PieChartIcon
// } from 'lucide-react';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
//   PieChart, Pie
// } from 'recharts';
// import { api } from '../Utils/api';
// import type { DashboardStats } from '../Utils/types';

// export const Dashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.getDashboardStats()
//       .then(data => { setStats(data); setLoading(false); })
//       .catch(console.error);
//   }, []);

//   if (loading || !stats) {
//     return (
//       <div className="relative p-8 h-full flex flex-col items-center justify-center bg-[#FAFAFA] overflow-hidden">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
//         <div className="relative flex flex-col items-center z-10">
//           <div className="w-16 h-16 relative flex items-center justify-center">
//             <div className="absolute inset-0 border-4 border-slate-100 rounded-2xl"></div>
//             <div className="absolute inset-0 border-4 border-blue-600 rounded-2xl border-t-transparent animate-spin"></div>
//             <Sparkles className="text-blue-600 animate-pulse" size={24} />
//           </div>
//           <h3 className="text-lg font-bold text-slate-800 mt-6">Analyzing Pipeline</h3>
//           <p className="text-slate-500 font-medium text-sm mt-1">Crunching the latest numbers...</p>
//         </div>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) => stats.status_distribution.find(s => s.status === status)?.count || 0;

//   // Chart Data Preparation
//   const pipelineData = [
//     { name: 'New', Leads: getStatusCount('new'), color: '#3b82f6' },        // Blue
//     { name: 'Contacted', Leads: getStatusCount('contacted'), color: '#8b5cf6' },  // Violet
//     { name: 'Negotiation', Leads: getStatusCount('negotiation'), color: '#f59e0b' },// Amber
//     { name: 'Won', Leads: getStatusCount('won'), color: '#10b981' },        // Emerald
//   ];

//   const winRateData = [
//     { name: 'Won', value: parseFloat(stats.win_rate.toString()), color: '#10b981' },
//     { name: 'Lost/Open', value: 100 - parseFloat(stats.win_rate.toString()), color: '#f1f5f9' },
//   ];

//   const activityIcons: Record<string, any> = {
//     call: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
//     email: { icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
//     meeting: { icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
//     note: { icon: StickyNote, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
//   };

//   return (
//     <div className="relative p-6 md:p-10 space-y-8 h-full overflow-y-auto bg-[#FAFAFA] custom-scrollbar">
//       {/* Ambient Backgrounds */}
//       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
//       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-400/10 blur-[120px] pointer-events-none" />

//       {/* Header */}
//       <header className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
//         <div className="space-y-1">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-xs font-bold tracking-wide uppercase mb-2">
//             <Target size={14} /> Analytics Overview
//           </div>
//           <h2 className="text-4xl font-black tracking-tight text-slate-900">
//             Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Metrics</span>
//           </h2>
//         </div>
//         <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-sm">
//           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//           <p className="text-sm font-semibold text-slate-700">
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
//           </p>
//         </div>
//       </header>

//       {/* KPI Cards */}
//       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//         <KPICard title="Pipeline Value" value={`$${stats.total_value.toLocaleString()}`} icon={DollarSign} theme="blue" trend="+12.5%" trendUp={true} />
//         <KPICard title="Total Leads" value={stats.total_leads.toString()} icon={Briefcase} theme="indigo" trend="+8 new" trendUp={true} />
//         <KPICard title="Win Rate" value={`${stats.win_rate}%`} icon={TrendingUp} theme="emerald" trend="+3.2%" trendUp={true} />
//         <KPICard title="New Leads" value={getStatusCount('new').toString()} icon={AlertCircle} theme="amber" trend="Action needed" trendUp={false} />
//       </div>

//       {/* Charts Section */}
//       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Main Bar Chart */}
//         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-500 flex flex-col">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-1">Pipeline Distribution</h3>
//               <p className="text-sm font-medium text-slate-500">Volume of leads across current stages.</p>
//             </div>
//             <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">
//               <BarChart3 size={20} />
//             </div>
//           </div>
          
//           <div className="flex-1 min-h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
//                 <XAxis 
//                   dataKey="name" 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
//                   dy={10} 
//                 />
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
//                 />
//                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
//                 <Bar dataKey="Leads" radius={[8, 8, 8, 8]} barSize={48}>
//                   {pipelineData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Donut Chart / Win Rate Details */}
//         <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-500 flex flex-col items-center text-center">
//           <div className="w-full flex justify-between items-center mb-2">
//             <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Win Ratio</h3>
//             <PieChartIcon size={20} className="text-slate-400" />
//           </div>
          
//           <div className="relative w-full h-[220px] mt-4 flex justify-center items-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={winRateData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={70}
//                   outerRadius={90}
//                   paddingAngle={5}
//                   dataKey="value"
//                   stroke="none"
//                   cornerRadius={8}
//                 >
//                   {winRateData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//               </PieChart>
//             </ResponsiveContainer>
            
//             {/* Center Text inside Donut */}
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <span className="text-3xl font-black text-slate-900">{stats.win_rate}%</span>
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Won</span>
//             </div>
//           </div>

//           <div className="mt-6 w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
//             <div className="text-left">
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Closed</p>
//               <p className="text-xl font-black text-emerald-600">{getStatusCount('won')}</p>
//             </div>
//             <div className="h-8 w-px bg-slate-200" />
//             <div className="text-right">
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Pipeline</p>
//               <p className="text-xl font-black text-blue-600">{stats.total_leads - getStatusCount('won')}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Activity Timeline */}
//       <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-6">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-1">Team Activity</h3>
//             <p className="text-sm font-medium text-slate-500">Live feed of interactions and updates.</p>
//           </div>
//           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
//             <Zap size={20} className="fill-indigo-600/20" />
//           </div>
//         </div>

//         <div className="relative">
//           {stats.recent_activities.length > 0 && (
//             <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent z-0" />
//           )}

//           <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
//             {stats.recent_activities.map((act) => {
//               const config = activityIcons[act.activity_type] || activityIcons.note;
//               const IconComp = config.icon;
//               return (
//                 <div key={act.id} className="relative z-10 flex gap-5 items-start group cursor-default">
//                   <div className={`relative flex items-center justify-center w-11 h-11 rounded-2xl ${config.bg} border border-white shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md ring-4 ring-white`}>
//                     <IconComp size={18} className={config.color} />
//                   </div>
//                   <div className="flex-1 min-w-0 pt-1 group-hover:translate-x-1 transition-transform duration-300">
//                     <div className="flex items-center gap-3 mb-1.5">
//                       <p className="text-sm font-bold text-slate-800 truncate">{act.summary || act.activity_type}</p>
//                       <span className="text-[11px] font-bold tracking-wider text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg shrink-0">
//                         {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 font-medium">{act.description}</p>
//                   </div>
//                 </div>
//               );
//             })}
//             {stats.recent_activities.length === 0 && (
//               <div className="text-center py-10 flex flex-col items-center">
//                 <Activity className="text-slate-300 mb-3" size={32} />
//                 <p className="font-bold text-slate-700">No activities yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --- Custom Recharts Tooltip for a Glassmorphism Look --- */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-xl shadow-slate-200/50">
//         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label || payload[0].name}</p>
//         <div className="flex items-center gap-3">
//           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color || payload[0].fill }} />
//           <p className="text-2xl font-black text-slate-800 tracking-tight">
//             {payload[0].value} <span className="text-sm font-medium text-slate-500">Leads</span>
//           </p>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// /* --- Bento KPI Card --- */
// const KPICard = ({ title, value, icon: Icon, theme, trend, trendUp }: any) => {
//   const themes: Record<string, any> = {
//     blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-white', iconRing: 'ring-blue-100' },
//     indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-white', iconRing: 'ring-indigo-100' },
//     emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-white', iconRing: 'ring-emerald-100' },
//     amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-white', iconRing: 'ring-amber-100' },
//   };
//   const t = themes[theme] || themes.blue;

//   return (
//     <div className={`relative bg-white/80 backdrop-blur-xl rounded-[28px] p-7 border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group overflow-hidden`}>
//       <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 ${t.text}`}>
//         <Icon size={120} strokeWidth={1.5} />
//       </div>
//       <div className="relative z-10 flex flex-col h-full justify-between gap-6">
//         <div className="flex justify-between items-start">
//           <div className={`p-3.5 rounded-2xl ${t.iconBg} ${t.text} ring-1 ${t.iconRing} shadow-sm`}>
//             <Icon size={24} strokeWidth={2.5} />
//           </div>
//           <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm border ${trendUp ? 'bg-emerald-50 border-emerald-100/50 text-emerald-700' : 'bg-rose-50 border-rose-100/50 text-rose-700'}`}>
//             {trendUp ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
//             {trend}
//           </div>
//         </div>
//         <div>
//           <p className="text-sm font-bold text-slate-500 mb-1.5 tracking-wide">{title}</p>
//           <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
//         </div>
//       </div>
//     </div>
//   );
// };

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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
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
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
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