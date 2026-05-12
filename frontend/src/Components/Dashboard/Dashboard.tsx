// import React, { useEffect, useState } from 'react';
// import { 
//   DollarSign, Users, TrendingUp, Clock, Phone, 
//   Mail, Calendar, FileText, ArrowUp, ArrowDown,
//   MoreHorizontal, Plus, Search, Bell, ChevronRight
// } from 'lucide-react';
// import { 
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, LineChart, Line
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
//       <div className="flex items-center justify-center h-full bg-gray-50">
//         <div className="text-center">
//           <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-500">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) => 
//     stats.status_distribution.find(s => s.status === status)?.count || 0;

//   const pipelineData = [
//     { name: 'New', value: getStatusCount('new') },
//     { name: 'Contacted', value: getStatusCount('contacted') },
//     { name: 'Negotiation', value: getStatusCount('negotiation') },
//     { name: 'Won', value: getStatusCount('won') },
//   ];

//   const weeklyData = [
//     { day: 'Mon', leads: 4 },
//     { day: 'Tue', leads: 7 },
//     { day: 'Wed', leads: 5 },
//     { day: 'Thu', leads: 9 },
//     { day: 'Fri', leads: 6 },
//     { day: 'Sat', leads: 3 },
//     { day: 'Sun', leads: 5 },
//   ];

//   const pieData = [
//     { name: 'Won', value: getStatusCount('won'), color: '#22c55e' },
//     { name: 'In Progress', value: stats.total_leads - getStatusCount('won'), color: '#e5e7eb' },
//   ];

//   return (
//     <div className="min-h-full bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, here's what's happening.</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
//           <Plus size={18} />
//           Add Lead
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <StatCard 
//           title="Total Revenue" 
//           value={`$${stats.total_value.toLocaleString()}`}
//           change={12.5}
//           icon={DollarSign}
//         />
//         <StatCard 
//           title="Total Leads" 
//           value={stats.total_leads}
//           change={8}
//           icon={Users}
//         />
//         <StatCard 
//           title="Win Rate" 
//           value={`${stats.win_rate}%`}
//           change={3.2}
//           icon={TrendingUp}
//         />
//         <StatCard 
//           title="Pending" 
//           value={getStatusCount('new')}
//           change={-2}
//           icon={Clock}
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Bar Chart */}
//         <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
//             <button className="text-gray-400 hover:text-gray-600">
//               <MoreHorizontal size={20} />
//             </button>
//           </div>
//           <div className="h-64 min-h-[256px]">
//             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
//               <BarChart data={pipelineData}>
//                 <XAxis 
//                   dataKey="name" 
//                   axisLine={false} 
//                   tickLine={false}
//                   tick={{ fill: '#6b7280', fontSize: 12 }}
//                 />
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false}
//                   tick={{ fill: '#9ca3af', fontSize: 12 }}
//                 />
//                 <Tooltip 
//                   contentStyle={{ 
//                     background: '#1f2937', 
//                     border: 'none', 
//                     borderRadius: '8px',
//                     color: 'white'
//                   }}
//                 />
//                 <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">Win Rate</h2>
//           <div className="h-48 min-h-[192px] relative">
//             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={70}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-gray-900">{stats.win_rate}%</p>
//                 <p className="text-xs text-gray-500">Won</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-center gap-6 mt-4">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-green-500" />
//               <span className="text-sm text-gray-600">Won ({getStatusCount('won')})</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-gray-200" />
//               <span className="text-sm text-gray-600">Other</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Weekly Trend */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Leads</h2>
//           <div className="h-48 min-h-[192px]">
//             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
//               <LineChart data={weeklyData}>
//                 <XAxis 
//                   dataKey="day" 
//                   axisLine={false} 
//                   tickLine={false}
//                   tick={{ fill: '#6b7280', fontSize: 12 }}
//                 />
//                 <YAxis hide />
//                 <Tooltip 
//                   contentStyle={{ 
//                     background: '#1f2937', 
//                     border: 'none', 
//                     borderRadius: '8px',
//                     color: 'white'
//                   }}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="leads" 
//                   stroke="#3b82f6" 
//                   strokeWidth={2}
//                   dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
//             <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
//               View all
//             </button>
//           </div>
//           <div className="space-y-4">
//             {stats.recent_activities.slice(0, 5).map((activity) => (
//               <ActivityItem key={activity.id} activity={activity} />
//             ))}
//             {stats.recent_activities.length === 0 && (
//               <p className="text-gray-400 text-center py-8">No recent activity</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Stat Card */
// const StatCard = ({ title, value, change, icon: Icon }: any) => (
//   <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-sm text-gray-500 mb-1">{title}</p>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//       </div>
//       <div className="p-2 bg-blue-50 rounded-lg">
//         <Icon size={20} className="text-blue-500" />
//       </div>
//     </div>
//     <div className="mt-3 flex items-center gap-1">
//       {change >= 0 ? (
//         <ArrowUp size={14} className="text-green-500" />
//       ) : (
//         <ArrowDown size={14} className="text-red-500" />
//       )}
//       <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//         {Math.abs(change)}%
//       </span>
//       <span className="text-sm text-gray-400 ml-1">vs last month</span>
//     </div>
//   </div>
// );

// /* Activity Item */
// const ActivityItem = ({ activity }: any) => {
//   const icons: Record<string, any> = {
//     call: { icon: Phone, bg: 'bg-blue-50', color: 'text-blue-500' },
//     email: { icon: Mail, bg: 'bg-purple-50', color: 'text-purple-500' },
//     meeting: { icon: Calendar, bg: 'bg-green-50', color: 'text-green-500' },
//     note: { icon: FileText, bg: 'bg-amber-50', color: 'text-amber-500' },
//   };
  
//   const config = icons[activity.activity_type] || icons.note;
//   const Icon = config.icon;

//   return (
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${config.bg}`}>
//         <Icon size={16} className={config.color} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-900 truncate">
//           {activity.summary || activity.activity_type}
//         </p>
//         <p className="text-xs text-gray-400">
//           {new Date(activity.created_at).toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })}
//         </p>
//       </div>
//       <ChevronRight size={16} className="text-gray-300" />
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import {
//   DollarSign, Users, TrendingUp, Clock, Phone,
//   Mail, Calendar, FileText, ArrowUp, ArrowDown,
//   MoreHorizontal, Plus, ChevronRight, LayoutDashboard,
//   Bell, Search, Activity,
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart,
// } from 'recharts';
// import { api } from '../Utils/api';
// import type { DashboardStats } from '../Utils/types';

// /* ─── Design tokens ─── */
// // Header: soft slate-blue that sits between the dark sidebar and white content
// const HEADER_BG      = '#f2f5fb';   // very light periwinkle
// const HEADER_BORDER  = '#d4ddf7';   // slightly deeper for the bottom rule
// const PAGE_BG        = '#e3e7f4';   // cool off-white page
// const CARD_BG        = '#ffffff';
// const CARD_BORDER    = '#e0e7f3';   // blue-tinted border — more visible than grey
// const CARD_SHADOW    = '0 2px 12px rgba(30,58,138,0.07)';

// /* ─── Stat card themes ─── */
// const CARD_THEMES = {
//   revenue: { bg: '#eff6ff', border: '#93c5fd', icon: '#1d4ed8', iconBg: '#dbeafe', text: '#1e40af', badge: '#bfdbfe', accentBar: '#3b82f6' },
//   leads:   { bg: '#f0fdf4', border: '#6ee7b7', icon: '#15803d', iconBg: '#bbf7d0', text: '#166534', badge: '#bbf7d0', accentBar: '#10b981' },
//   winRate: { bg: '#fdf4ff', border: '#d8b4fe', icon: '#7e22ce', iconBg: '#e9d5ff', text: '#6b21a8', badge: '#e9d5ff', accentBar: '#a855f7' },
//   pending: { bg: '#fff7ed', border: '#fca5a5', icon: '#c2410c', iconBg: '#fed7aa', text: '#9a3412', badge: '#fed7aa', accentBar: '#f97316' },
// };

// const BAR_COLORS  = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
// const PIE_COLORS  = ['#10b981', '#e2e8f0'];
// const LINE_COLOR  = '#3b82f6';

// const today = new Date().toLocaleDateString('en-US', {
//   weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
// });

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
//       <div style={s.loadingWrap}>
//         <div style={s.spinner} />
//         <p style={s.loadingText}>Loading dashboard…</p>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) =>
//     stats.status_distribution.find(st => st.status === status)?.count || 0;

//   const pipelineData = [
//     { name: 'New',         value: getStatusCount('new') },
//     { name: 'Contacted',   value: getStatusCount('contacted') },
//     { name: 'Negotiation', value: getStatusCount('negotiation') },
//     { name: 'Won',         value: getStatusCount('won') },
//   ];

//   const weeklyData = [
//     { day: 'Mon', leads: 4 }, { day: 'Tue', leads: 7 },
//     { day: 'Wed', leads: 5 }, { day: 'Thu', leads: 9 },
//     { day: 'Fri', leads: 6 }, { day: 'Sat', leads: 3 },
//     { day: 'Sun', leads: 5 },
//   ];

//   const pieData = [
//     { name: 'Won',         value: getStatusCount('won'),                     color: PIE_COLORS[0] },
//     { name: 'In Progress', value: Math.max(0, stats.total_leads - getStatusCount('won')), color: PIE_COLORS[1] },
//   ];

//   const CustomBar = (props: any) => {
//     const { x, y, width, height, index } = props;
//     return <rect x={x} y={y} width={width} height={height} fill={BAR_COLORS[index % BAR_COLORS.length]} rx={6} ry={6} />;
//   };

//   return (
//     <div style={s.page}>

//       {/* ══════════════ HEADER ══════════════ */}
//       <div style={s.header}>
//         {/* Left */}
//         <div>
//           <div style={s.breadcrumb}>
//             <LayoutDashboard size={12} color="#1342c4" />
//             <span style={s.breadcrumbMuted}>Overview</span>
//             <span style={s.breadcrumbSep}>/</span>
//             <span style={s.breadcrumbActive}>Dashboard</span>
//           </div>
//           <h1 style={s.h1}>DASHBOARD </h1>
//           <p style={s.subtitle}>{today}</p>
//         </div>

//         {/* Right */}
//         <div style={s.headerActions}>
//           <div style={s.searchBox}>
//             <Search size={14} color="#5d7dd4" />
//             <input placeholder="Search leads…" style={s.searchInput} />
//           </div>
//           <button style={s.bellBtn} aria-label="Notifications">
//             <Bell size={16} color="#5d7dd4" />
//             <span style={s.bellDot} />
//           </button>
//           <button style={s.addBtn}>
//             <Plus size={14} strokeWidth={2.5} />
//             <span>Add Lead</span>
//           </button>
//         </div>
//       </div>

//       {/* ══════════════ STAT CARDS ══════════════ */}
//       <div style={s.statsGrid}>
//         <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} theme={CARD_THEMES.revenue} />
//         <StatCard title="Total Leads"   value={stats.total_leads}                         change={8}    icon={Users}       theme={CARD_THEMES.leads} />
//         <StatCard title="Win Rate"      value={`${stats.win_rate}%`}                      change={3.2}  icon={TrendingUp}  theme={CARD_THEMES.winRate} />
//         <StatCard title="Pending"       value={getStatusCount('new')}                     change={-2}   icon={Clock}       theme={CARD_THEMES.pending} />
//       </div>

//       {/* ══════════════ CHARTS ROW ══════════════ */}
//       <div style={s.chartsRow}>

//         {/* Pipeline bar chart */}
//         <div style={{ ...s.card, flex: 2 }}>
//           <div style={s.cardHeader}>
//             <div>
//               <p style={s.cardTitle}>Pipeline Overview</p>
//               <p style={s.cardSub}>Leads by stage this month</p>
//             </div>
//             <button style={s.iconBtn}><MoreHorizontal size={16} color="#94a3b8" /></button>
//           </div>
//           <div style={{ marginTop: 16 }}>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={pipelineData} barCategoryGap="40%" margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
//                 <CartesianGrid vertical={false} stroke="#eef2ff" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} width={28} />
//                 <Tooltip
//                   cursor={{ fill: 'rgba(59,130,246,0.05)', radius: 6 }}
//                   contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 10, color: '#f8fafc', fontSize: 13, padding: '8px 14px' }}
//                 />
//                 <Bar dataKey="value" shape={<CustomBar />} maxBarSize={48} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={s.legendRow}>
//             {pipelineData.map((item, i) => (
//               <div key={item.name} style={s.legendItem}>
//                 <span style={{ ...s.legendDot, background: BAR_COLORS[i] }} />
//                 <span style={s.legendLabel}>{item.name}</span>
//                 <span style={s.legendCount}>{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Win rate donut */}
//         <div style={{ ...s.card, flex: 1, minWidth: 210 }}>
//           <div style={s.cardHeader}>
//             <div>
//               <p style={s.cardTitle}>Win Rate</p>
//               <p style={s.cardSub}>Closed vs open leads</p>
//             </div>
//           </div>
//           <div style={{ position: 'relative', height: 168, marginTop: 16 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData} cx="50%" cy="50%"
//                   innerRadius={54} outerRadius={72}
//                   dataKey="value" stroke="none"
//                   startAngle={90} endAngle={-270}
//                 >
//                   {pieData.map((entry, idx) => (
//                     <Cell key={idx} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div style={s.pieCenter}>
//               <p style={s.piePct}>{stats.win_rate}%</p>
//               <p style={s.pieLabel}>Won</p>
//             </div>
//           </div>
//           <div style={s.pieLegend}>
//             {pieData.map(p => (
//               <div key={p.name} style={s.legendItem}>
//                 <span style={{ ...s.legendDot, background: p.color }} />
//                 <span style={s.legendLabel}>{p.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ══════════════ BOTTOM ROW ══════════════ */}
//       <div style={s.bottomRow}>

//         {/* Weekly area chart */}
//         <div style={{ ...s.card, flex: 1 }}>
//           <div style={s.cardHeader}>
//             <div>
//               <p style={s.cardTitle}>Weekly Leads</p>
//               <p style={s.cardSub}>New leads added each day</p>
//             </div>
//             {/* Inline peak badge */}
//             <div style={s.peakBadge}>
//               <Activity size={11} color="#1d4ed8" />
//               <span style={s.peakText}>Peak: Thu</span>
//             </div>
//           </div>
//           <div style={{ marginTop: 16 }}>
//             <ResponsiveContainer width="100%" height={180}>
//               <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor={LINE_COLOR} stopOpacity={0.15} />
//                     <stop offset="95%" stopColor={LINE_COLOR} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid vertical={false} stroke="#eef2ff" />
//                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
//                 <YAxis hide />
//                 <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 10, color: '#f8fafc', fontSize: 13, padding: '8px 14px' }} />
//                 <Area
//                   type="monotone" dataKey="leads"
//                   stroke={LINE_COLOR} strokeWidth={2.5}
//                   fill="url(#leadsGrad)"
//                   dot={{ fill: '#fff', stroke: LINE_COLOR, strokeWidth: 2, r: 4 }}
//                   activeDot={{ r: 5, fill: LINE_COLOR }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent activity */}
//         <div style={{ ...s.card, flex: 1 }}>
//           <div style={s.cardHeader}>
//             <div>
//               <p style={s.cardTitle}>Recent Activity</p>
//               <p style={s.cardSub}>Latest interactions</p>
//             </div>
//             <button style={s.viewAllBtn}>View all →</button>
//           </div>
//           <div style={s.activityList}>
//             {stats.recent_activities.slice(0, 5).map(activity => (
//               <ActivityItem key={activity.id} activity={activity} />
//             ))}
//             {stats.recent_activities.length === 0 && (
//               <p style={s.emptyText}>No recent activity</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══ Stat Card ══ */
// const StatCard = ({ title, value, change, icon: Icon, theme }: any) => (
//   <div style={{
//     borderRadius: 16,
//     padding: '18px 20px',
//     boxSizing: 'border-box' as const,
//     background: theme.bg,
//     border: `1.5px solid ${theme.border}`,
//     boxShadow: '0 2px 8px rgba(30,58,138,0.06)',
//     position: 'relative' as const,
//     overflow: 'hidden' as const,
//   }}>
//     {/* Coloured top accent bar */}
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: theme.accentBar, borderRadius: '16px 16px 0 0' }} />
//     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
//       <div>
//         <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', margin: 0, color: theme.text, textTransform: 'uppercase' as const, opacity: 0.7 }}>{title}</p>
//         <p style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 0', lineHeight: 1, color: theme.icon }}>{value}</p>
//       </div>
//       <div style={{ borderRadius: 12, padding: 10, background: theme.iconBg, display: 'flex' }}>
//         <Icon size={20} color={theme.icon} />
//       </div>
//     </div>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//       <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: theme.badge, color: theme.text }}>
//         {change >= 0
//           ? <ArrowUp size={10} style={{ display: 'inline' }} />
//           : <ArrowDown size={10} style={{ display: 'inline' }} />}
//         {Math.abs(change)}%
//       </span>
//       <span style={{ fontSize: 11, color: '#94a3b8' }}>vs last month</span>
//     </div>
//   </div>
// );

// /* ══ Activity Item ══ */
// const ActivityItem = ({ activity }: any) => {
//   const cfg: Record<string, { icon: any; bg: string; color: string; accent: string }> = {
//     call:    { icon: Phone,     bg: '#eff6ff', color: '#2563eb', accent: '#3b82f6' },
//     email:   { icon: Mail,     bg: '#faf5ff', color: '#7c3aed', accent: '#a855f7' },
//     meeting: { icon: Calendar, bg: '#f0fdf4', color: '#16a34a', accent: '#22c55e' },
//     note:    { icon: FileText, bg: '#fffbeb', color: '#d97706', accent: '#f59e0b' },
//   };
//   const { icon: Icon, bg, color, accent } = cfg[activity.activity_type] || cfg.note;

//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: 10,
//       padding: '9px 10px 9px 12px',
//       borderRadius: 10,
//       borderLeft: `3px solid ${accent}`,
//       background: '#f8fafc',
//       cursor: 'pointer',
//       marginBottom: 6,
//     }}>
//       <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//         <Icon size={15} color={color} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', margin: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {activity.summary || activity.activity_type}
//         </p>
//         <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0' }}>
//           {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </div>
//       <ChevronRight size={14} color="#cbd5e1" />
//     </div>
//   );
// };

// /* ══════════════════════════════  STYLES  ══════════════════════════════ */
// const s: Record<string, React.CSSProperties> = {
//   page: {
//     minHeight: '100%',
//     overflowY: 'auto',
//     background: PAGE_BG,
//     padding: '0 0 52px',
//     boxSizing: 'border-box',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
//   },

//   loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 },
//   spinner:     { width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTop: '2.5px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
//   loadingText: { color: '#94a3b8', fontSize: 14, margin: 0 },

//   /* ── Header ── */
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap' as const,
//     gap: 16,
//     background: HEADER_BG,
//     borderBottom: `1.5px solid ${HEADER_BORDER}`,
//     padding: '18px 28px 18px',
//     marginBottom: 22,
//   },
//   breadcrumb:      { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 },
//   breadcrumbMuted: { fontSize: 12, color: '#2460e1' },
//   breadcrumbSep:   { fontSize: 12, color: '#2b64d6' },
//   breadcrumbActive:{ fontSize: 12, color: '#3b5bab', fontWeight: 600 },
//   h1:              { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.2px' },
//   subtitle:        { fontSize: 12, color: '#2661e0', marginTop: 3, marginBottom: 0 },

//   headerActions: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const },
//   searchBox: {
//     display: 'flex', alignItems: 'center', gap: 8,
//     background: '#ffffff',
//     border: `1.5px solid ${HEADER_BORDER}`,
//     borderRadius: 10, padding: '7px 12px',
//     boxShadow: '0 1px 3px rgba(30,58,138,0.06)',
//   },
//   searchInput: { background: 'none', border: 'none', outline: 'none', color: '#334155', fontSize: 13, width: 160 },
//   bellBtn: {
//     position: 'relative',
//     background: '#ffffff',
//     border: `1.5px solid ${HEADER_BORDER}`,
//     borderRadius: 10, padding: '8px 10px',
//     cursor: 'pointer', display: 'flex',
//     boxShadow: '0 1px 3px rgba(30,58,138,0.06)',
//   },
//   bellDot: { position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff' },
//   addBtn: {
//     display: 'flex', alignItems: 'center', gap: 6,
//     background: '#1e3a8a', color: '#fff',
//     border: 'none', borderRadius: 10,
//     padding: '9px 18px', fontSize: 13, fontWeight: 700,
//     cursor: 'pointer',
//     boxShadow: '0 2px 8px rgba(30,58,138,0.25)',
//   },

//   /* Stat cards */
//   statsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
//     gap: 14, padding: '0 28px', marginBottom: 16,
//   },

//   /* Content cards */
//   chartsRow: { display: 'flex', gap: 14, marginBottom: 14, padding: '0 28px', flexWrap: 'wrap' as const },
//   bottomRow: { display: 'flex', gap: 14, padding: '0 28px', flexWrap: 'wrap' as const },
//   card: {
//     background: CARD_BG,
//     borderRadius: 16,
//     padding: '18px 20px',
//     border: `1.5px solid ${CARD_BORDER}`,
//     boxShadow: CARD_SHADOW,
//     boxSizing: 'border-box' as const,
//     minWidth: 240,
//   },
//   cardHeader:  { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
//   cardTitle:   { fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 },
//   cardSub:     { fontSize: 12, color: '#94a3b8', margin: '2px 0 0' },
//   iconBtn:     { background: 'none', border: 'none', cursor: 'pointer', padding: 2 },
//   viewAllBtn:  { background: 'none', border: 'none', color: '#3b82f6', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' as const },

//   /* Peak badge in weekly chart */
//   peakBadge: { display: 'flex', alignItems: 'center', gap: 4, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '3px 9px' },
//   peakText:  { fontSize: 11, fontWeight: 600, color: '#1d4ed8' },

//   /* Legends */
//   legendRow:   { display: 'flex', gap: 14, flexWrap: 'wrap' as const, marginTop: 14, paddingTop: 12, borderTop: '1px solid #eef2ff' },
//   legendItem:  { display: 'flex', alignItems: 'center', gap: 5 },
//   legendDot:   { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
//   legendLabel: { fontSize: 12, color: '#64748b' },
//   legendCount: { fontSize: 12, fontWeight: 700, color: '#1e293b', marginLeft: 3 },

//   pieCenter: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
//   piePct:    { fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 },
//   pieLabel:  { fontSize: 11, color: '#94a3b8', margin: '2px 0 0' },
//   pieLegend: { display: 'flex', justifyContent: 'center', gap: 18, marginTop: 14, paddingTop: 12, borderTop: '1px solid #eef2ff' },

//   activityList: { display: 'flex', flexDirection: 'column' as const, gap: 0, marginTop: 14 },
//   emptyText:    { textAlign: 'center' as const, color: '#cbd5e1', fontSize: 13, padding: '24px 0', margin: 0 },
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import {
  DollarSign, Users, TrendingUp, Clock, Phone,
  Mail, Calendar, FileText, ArrowUp, ArrowDown,
  MoreHorizontal, Plus, ChevronRight, LayoutDashboard,
  Bell, Search, Activity, Filter, Download, RefreshCw,
  Zap, Target, Award,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Area, AreaChart,
} from 'recharts';
import { api } from '../Utils/api';
import type { DashboardStats } from '../Utils/types';

/* ─── Design System Tokens ─── */
const TOKENS = {
  primary: {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
    800: '#3730a3', 900: '#312e81',
  },
  neutral: {
    0: '#ffffff', 25: '#fcfcfd', 50: '#f8fafc', 100: '#f1f5f9',
    200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
    600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a',
    950: '#020617',
  },
  success: { light: '#ecfdf5', base: '#10b981', dark: '#065f46', border: '#a7f3d0' },
  warning: { light: '#fffbeb', base: '#f59e0b', dark: '#92400e', border: '#fde68a' },
  danger:  { light: '#fef2f2', base: '#ef4444', dark: '#991b1b', border: '#fecaca' },
  info:    { light: '#eff6ff', base: '#3b82f6', dark: '#1e40af', border: '#bfdbfe' },

  pageBg: '#f8fafc',
  headerBg: '#ffffff',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  headerBorder: '#e2e8f0',

  shadowXs: '0 1px 2px rgba(0,0,0,0.05)',
  shadowSm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  shadowXl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',

  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',

  radius: { sm: 6, md: 8, lg: 12, xl: 16, '2xl': 20, full: 9999 },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

/* ─── Stat card configs ─── */
const STAT_CONFIGS = {
  revenue: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#7c3aed',
  },
  leads: {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accentColor: '#ec4899',
  },
  winRate: {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accentColor: '#06b6d4',
  },
  pending: {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    accentColor: '#10b981',
  },
};

const CHART_COLORS = {
  bar: ['#6366f1', '#ec4899', '#06b6d4', '#10b981'],
  pie: ['#6366f1', '#e2e8f0'],
  line: '#6366f1',
  grid: '#f1f5f9',
};

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

/* ─── Inject global styles ─── */
const injectGlobalStyles = () => {
  const id = 'dashboard-global-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-8px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .dash-card {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dash-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -4px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.08);
    }
    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .stat-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 20px 40px -8px rgba(0,0,0,0.15);
    }
    .activity-item {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .activity-item:hover {
      background: #f1f5f9 !important;
      transform: translateX(4px);
    }
    .btn-primary {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:active {
      transform: translateY(0);
    }
    .btn-secondary {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-secondary:hover {
      background: #f1f5f9 !important;
      border-color: #cbd5e1 !important;
    }
    .search-input::placeholder {
      color: #94a3b8;
    }
    .search-input:focus {
      outline: none;
    }
    .icon-btn {
      transition: all 0.15s ease;
    }
    .icon-btn:hover {
      background: #f1f5f9 !important;
    }
    .view-all-btn {
      transition: all 0.15s ease;
    }
    .view-all-btn:hover {
      color: #4338ca !important;
    }
    .dashboard-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .dashboard-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .dashboard-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .dashboard-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    @media (max-width: 1200px) {
      .charts-row, .bottom-row {
        flex-direction: column !important;
      }
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .header-content {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .header-actions {
        width: 100%;
        justify-content: flex-start !important;
      }
    }
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
};

/* ─── Reusable tiny component for colored dots next to card titles ─── */
const TitleDot = ({ color }: { color: string }) => (
  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: TOKENS.neutral[900],
      border: 'none',
      borderRadius: TOKENS.radius.lg,
      padding: '10px 16px',
      boxShadow: TOKENS.shadowXl,
    }}>
      <p style={{ color: TOKENS.neutral[400], fontSize: 11, margin: '0 0 4px', fontWeight: 500, fontFamily: TOKENS.fontFamily }}>
        {label}
      </p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0, fontFamily: TOKENS.fontFamily }}>
          {entry.value} {entry.name || 'leads'}
        </p>
      ))}
    </div>
  );
};

/* ═══════════ MAIN DASHBOARD ═══════════ */
export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { injectGlobalStyles(); }, []);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => { setStats(data); setLoading(false); })
      .catch(console.error);
  }, []);

  if (loading || !stats) return <LoadingState />;

  const getStatusCount = (status: string) =>
    stats.status_distribution.find(st => st.status === status)?.count || 0;

  const pipelineData = [
    { name: 'New',         value: getStatusCount('new') },
    { name: 'Contacted',   value: getStatusCount('contacted') },
    { name: 'Negotiation', value: getStatusCount('negotiation') },
    { name: 'Won',         value: getStatusCount('won') },
  ];

  const weeklyData = [
    { day: 'Mon', leads: 4 }, { day: 'Tue', leads: 7 },
    { day: 'Wed', leads: 5 }, { day: 'Thu', leads: 9 },
    { day: 'Fri', leads: 6 }, { day: 'Sat', leads: 3 },
    { day: 'Sun', leads: 5 },
  ];

  const pieData = [
    { name: 'Won',         value: getStatusCount('won'),                                  color: CHART_COLORS.pie[0] },
    { name: 'In Progress', value: Math.max(0, stats.total_leads - getStatusCount('won')), color: CHART_COLORS.pie[1] },
  ];

  const totalWeeklyLeads = weeklyData.reduce((s, d) => s + d.leads, 0);
  const peakDay = weeklyData.reduce((mx, d) => (d.leads > mx.leads ? d : mx), weeklyData[0]);

  const CustomBar = (props: any) => {
    const { x, y, width, height, index } = props;
    return (
      <rect x={x} y={y} width={width} height={height}
        fill={CHART_COLORS.bar[index % CHART_COLORS.bar.length]}
        rx={6} ry={6}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      />
    );
  };

  return (
    <div style={S.page} className="dashboard-scroll">

      {/* ═══ HEADER ═══ */}
      <header style={S.header}>
        <div style={S.headerInner} className="header-content">
          <div>
            <div style={S.breadcrumb}>
              <div style={S.breadcrumbIconWrap}>
                <LayoutDashboard size={11} color={TOKENS.primary[600]} />
              </div>
              <span style={S.breadcrumbText}>Overview</span>
              <span style={S.breadcrumbDivider}>/</span>
              <span style={S.breadcrumbCurrent}>Dashboard</span>
            </div>
            <h1 style={S.pageTitle}>Dashboard</h1>
            <p style={S.pageSubtitle}>
              <Calendar size={12} color={TOKENS.neutral[400]} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              {today}
            </p>
          </div>

          <div style={S.headerActions} className="header-actions">
            <div style={S.searchWrapper}>
              <Search size={15} color={TOKENS.neutral[400]} />
              <input className="search-input" placeholder="Search leads, contacts..." style={S.searchInput} />
              <kbd style={S.searchKbd}>⌘K</kbd>
            </div>
            <button style={S.iconButton} className="icon-btn" aria-label="Refresh"><RefreshCw size={16} color={TOKENS.neutral[500]} /></button>
            <button style={S.iconButton} className="icon-btn" aria-label="Filter"><Filter size={16} color={TOKENS.neutral[500]} /></button>
            <button style={S.notifButton} className="icon-btn" aria-label="Notifications">
              <Bell size={16} color={TOKENS.neutral[500]} />
              <span style={S.notifDot} />
            </button>
            <div style={S.headerDivider} />
            <button style={S.exportBtn} className="btn-secondary"><Download size={14} /><span>Export</span></button>
            <button style={S.addLeadBtn} className="btn-primary"><Plus size={15} strokeWidth={2.5} /><span>Add Lead</span></button>
          </div>
        </div>
      </header>

      {/* ═══ INSIGHTS BAR ═══ */}
      <div style={S.insightsBar}>
        <div style={S.insightItem}><Zap size={13} color={TOKENS.warning.base} /><span style={S.insightText}><strong style={{ color: TOKENS.neutral[800] }}>3 leads</strong> need follow-up today</span></div>
        <div style={S.insightDivider} />
        <div style={S.insightItem}><Target size={13} color={TOKENS.success.base} /><span style={S.insightText}>Monthly target: <strong style={{ color: TOKENS.success.dark }}>78%</strong> achieved</span></div>
        <div style={S.insightDivider} />
        <div style={S.insightItem}><Award size={13} color={TOKENS.primary[500]} /><span style={S.insightText}>Win rate is <strong style={{ color: TOKENS.primary[700] }}>up 3.2%</strong> this month</span></div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div style={S.content}>
        <div style={S.statsGrid} className="stats-grid">
          <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} config={STAT_CONFIGS.revenue} delay={0} />
          <StatCard title="Total Leads"   value={stats.total_leads}                         change={8}    icon={Users}       config={STAT_CONFIGS.leads}   delay={1} />
          <StatCard title="Win Rate"      value={`${stats.win_rate}%`}                      change={3.2}  icon={TrendingUp}  config={STAT_CONFIGS.winRate} delay={2} />
          <StatCard title="Pending"       value={getStatusCount('new')}                     change={-2}   icon={Clock}       config={STAT_CONFIGS.pending} delay={3} />
        </div>

        {/* ═══ CHARTS ROW ═══ */}
        <div style={S.chartsRow} className="charts-row">

          {/* Pipeline bar chart */}
          <div style={{ ...S.card, flex: 2, minWidth: 340 }} className="dash-card">
            <div style={S.cardHeader}>
              <div>
                <div style={S.cardTitleRow}><TitleDot color="#6366f1" /><h3 style={S.cardTitle}>Pipeline Overview</h3></div>
                <p style={S.cardSubtitle}>Lead distribution by stage</p>
              </div>
              <div style={S.cardActions}>
                <span style={S.periodBadge}>This Month</span>
                <button style={S.moreBtn} className="icon-btn"><MoreHorizontal size={16} color={TOKENS.neutral[400]} /></button>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pipelineData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: TOKENS.neutral[500], fontSize: 12, fontFamily: TOKENS.fontFamily, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: TOKENS.neutral[400], fontSize: 11, fontFamily: TOKENS.fontFamily }} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 } as any} />
                  <Bar dataKey="value" shape={<CustomBar />} maxBarSize={52} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={S.legendRow}>
              {pipelineData.map((item, i) => (
                <div key={item.name} style={S.legendItem}>
                  <span style={{ ...S.legendDot, background: CHART_COLORS.bar[i] }} />
                  <span style={S.legendLabel}>{item.name}</span>
                  <span style={S.legendValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Win rate donut */}
          <div style={{ ...S.card, flex: 1, minWidth: 260 }} className="dash-card">
            <div style={S.cardHeader}>
              <div>
                <div style={S.cardTitleRow}><TitleDot color="#06b6d4" /><h3 style={S.cardTitle}>Win Rate</h3></div>
                <p style={S.cardSubtitle}>Closed vs open leads</p>
              </div>
            </div>
            <div style={{ position: 'relative', height: 190, marginTop: 12 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none" startAngle={90} endAngle={-270} cornerRadius={4}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={S.pieCenter}>
                <p style={S.piePct}>{stats.win_rate}%</p>
                <p style={S.pieLabel}>Won</p>
              </div>
            </div>
            <div style={S.pieLegend}>
              {pieData.map(p => (
                <div key={p.name} style={S.pieStatItem}>
                  <div style={{ ...S.pieStatDot, background: p.color }} />
                  <div>
                    <p style={S.pieStatLabel}>{p.name}</p>
                    <p style={S.pieStatValue}>{p.value} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW ═══ */}
        <div style={S.bottomRow} className="bottom-row">

          {/* Weekly area chart */}
          <div style={{ ...S.card, flex: 1, minWidth: 340 }} className="dash-card">
            <div style={S.cardHeader}>
              <div>
                <div style={S.cardTitleRow}><TitleDot color="#ec4899" /><h3 style={S.cardTitle}>Weekly Leads</h3></div>
                <p style={S.cardSubtitle}>New leads added each day</p>
              </div>
              <div style={S.cardActions}>
                <div style={S.metricBadge}><Activity size={12} color={TOKENS.primary[600]} /><span style={S.metricText}>Total: <strong>{totalWeeklyLeads}</strong></span></div>
                <div style={S.peakBadge}><TrendingUp size={12} color={TOKENS.success.dark} /><span style={S.peakText}>Peak: {peakDay.day}</span></div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.line} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={CHART_COLORS.line} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: TOKENS.neutral[500], fontSize: 12, fontFamily: TOKENS.fontFamily, fontWeight: 500 }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke={CHART_COLORS.line} strokeWidth={2.5} fill="url(#leadsGrad)"
                    dot={{ fill: '#fff', stroke: CHART_COLORS.line, strokeWidth: 2.5, r: 4.5 }}
                    activeDot={{ r: 6, fill: CHART_COLORS.line, stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={S.daySummary}>
              {weeklyData.map(d => (
                <div key={d.day} style={{
                  ...S.dayPill,
                  background: d.day === peakDay.day ? TOKENS.primary[50] : TOKENS.neutral[50],
                  borderColor: d.day === peakDay.day ? TOKENS.primary[200] : TOKENS.neutral[200],
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, fontFamily: TOKENS.fontFamily, letterSpacing: '0.02em', color: d.day === peakDay.day ? TOKENS.primary[700] : TOKENS.neutral[500] }}>{d.day}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, fontFamily: TOKENS.fontFamily, marginTop: 2, color: d.day === peakDay.day ? TOKENS.primary[700] : TOKENS.neutral[800] }}>{d.leads}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ ...S.card, flex: 1, minWidth: 320 }} className="dash-card">
            <div style={S.cardHeader}>
              <div>
                <div style={S.cardTitleRow}><TitleDot color="#f59e0b" /><h3 style={S.cardTitle}>Recent Activity</h3></div>
                <p style={S.cardSubtitle}>Latest interactions &amp; updates</p>
              </div>
              <button style={S.viewAllBtn} className="view-all-btn">View all<ChevronRight size={14} /></button>
            </div>
            <div style={S.activityList}>
              {stats.recent_activities.slice(0, 5).map((activity, idx) => (
                <ActivityItem key={activity.id} activity={activity} index={idx} />
              ))}
              {stats.recent_activities.length === 0 && (
                <div style={S.emptyState}>
                  <Activity size={32} color={TOKENS.neutral[300]} />
                  <p style={S.emptyTitle}>No recent activity</p>
                  <p style={S.emptyDesc}>Activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ Loading State ═══ */
const LoadingState = () => (
  <div style={S.loadingWrap}>
    <div style={S.loadingCard}>
      <div style={S.spinner} />
      <p style={S.loadingTitle}>Loading dashboard</p>
      <p style={S.loadingDesc}>Fetching your latest data…</p>
    </div>
  </div>
);

/* ═══ Stat Card ═══ */
const StatCard = ({ title, value, change, icon: Icon, config, delay }: any) => {
  const isPositive = change >= 0;
  return (
    <div className="stat-card" style={{
      borderRadius: TOKENS.radius.xl, padding: 0,
      background: TOKENS.cardBg, border: `1px solid ${TOKENS.cardBorder}`,
      boxShadow: TOKENS.shadowSm, overflow: 'hidden',
      animation: `fadeInUp 0.5s ease ${delay * 0.08}s both`,
    }}>
      <div style={{ height: 3, background: config.gradient }} />
      <div style={{ padding: '18px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: TOKENS.neutral[500], margin: 0, fontFamily: TOKENS.fontFamily }}>{title}</p>
            <p style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 0', lineHeight: 1, color: TOKENS.neutral[900], fontFamily: TOKENS.fontFamily, letterSpacing: '-0.5px' }}>{value}</p>
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: TOKENS.radius.lg, background: config.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${config.accentColor}30`,
          }}>
            <Icon size={20} color="#fff" strokeWidth={2} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700,
            padding: '3px 10px', borderRadius: TOKENS.radius.full,
            background: isPositive ? TOKENS.success.light : TOKENS.danger.light,
            color: isPositive ? TOKENS.success.dark : TOKENS.danger.dark, fontFamily: TOKENS.fontFamily,
          }}>
            {isPositive ? <ArrowUp size={11} strokeWidth={2.5} /> : <ArrowDown size={11} strokeWidth={2.5} />}
            {Math.abs(change)}%
          </span>
          <span style={{ fontSize: 11, color: TOKENS.neutral[400], fontFamily: TOKENS.fontFamily }}>vs last month</span>
        </div>
      </div>
    </div>
  );
};

/* ═══ Activity Item ═══ */
const ActivityItem = ({ activity, index }: any) => {
  const cfgMap: Record<string, { icon: any; bg: string; color: string; accent: string; label: string }> = {
    call:    { icon: Phone,    bg: '#eff6ff', color: '#2563eb', accent: '#3b82f6', label: 'Call' },
    email:   { icon: Mail,     bg: '#faf5ff', color: '#7c3aed', accent: '#8b5cf6', label: 'Email' },
    meeting: { icon: Calendar, bg: '#ecfdf5', color: '#059669', accent: '#10b981', label: 'Meeting' },
    note:    { icon: FileText, bg: '#fffbeb', color: '#d97706', accent: '#f59e0b', label: 'Note' },
  };
  const cfg = cfgMap[activity.activity_type] || cfgMap.note;
  const IconComp = cfg.icon;
  const timeStr = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(activity.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="activity-item" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: TOKENS.radius.lg,
      background: TOKENS.neutral[25], marginBottom: 6,
      borderLeft: `3px solid ${cfg.accent}`,
      animation: `slideIn 0.3s ease ${index * 0.05}s both`,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: TOKENS.radius.md, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <IconComp size={16} color={cfg.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em', color: cfg.color, background: cfg.bg, padding: '1px 6px', borderRadius: TOKENS.radius.sm, fontFamily: TOKENS.fontFamily }}>{cfg.label}</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: TOKENS.neutral[800], margin: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: TOKENS.fontFamily }}>
          {activity.summary || activity.activity_type}
        </p>
      </div>
      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: TOKENS.neutral[700], margin: 0, fontFamily: TOKENS.fontFamily }}>{timeStr}</p>
        <p style={{ fontSize: 10, color: TOKENS.neutral[400], margin: '2px 0 0', fontFamily: TOKENS.fontFamily }}>{dateStr}</p>
      </div>
      <ChevronRight size={14} color={TOKENS.neutral[300]} style={{ flexShrink: 0 }} />
    </div>
  );
};

/* ═══════════════════ STYLES ═══════════════════ */
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100%', overflowY: 'auto', background: TOKENS.pageBg, fontFamily: TOKENS.fontFamily, boxSizing: 'border-box' },

  loadingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: TOKENS.pageBg },
  loadingCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: TOKENS.radius.xl, padding: '48px 56px', boxShadow: TOKENS.shadowLg, border: `1px solid ${TOKENS.cardBorder}`, animation: 'scaleIn 0.3s ease' },
  spinner: { width: 36, height: 36, border: `3px solid ${TOKENS.neutral[200]}`, borderTop: `3px solid ${TOKENS.primary[500]}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16 },
  loadingTitle: { fontSize: 15, fontWeight: 700, color: TOKENS.neutral[800], margin: '0 0 4px', fontFamily: TOKENS.fontFamily },
  loadingDesc: { fontSize: 13, color: TOKENS.neutral[400], margin: 0, fontFamily: TOKENS.fontFamily },

  header: { background: TOKENS.headerBg, borderBottom: `1px solid ${TOKENS.headerBorder}`, position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)' },
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16, padding: '16px 28px', maxWidth: 1600, margin: '0 auto' },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  breadcrumbIconWrap: { width: 20, height: 20, borderRadius: TOKENS.radius.sm, background: TOKENS.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center' },
  breadcrumbText: { fontSize: 12, color: TOKENS.neutral[400], fontWeight: 500, fontFamily: TOKENS.fontFamily },
  breadcrumbDivider: { fontSize: 12, color: TOKENS.neutral[300] },
  breadcrumbCurrent: { fontSize: 12, color: TOKENS.primary[600], fontWeight: 600, fontFamily: TOKENS.fontFamily },

  pageTitle: { fontSize: 24, fontWeight: 800, color: TOKENS.neutral[900], margin: 0, letterSpacing: '-0.4px', fontFamily: TOKENS.fontFamily, lineHeight: 1.2 },
  pageSubtitle: { fontSize: 13, color: TOKENS.neutral[400], margin: '4px 0 0', fontFamily: TOKENS.fontFamily, display: 'flex', alignItems: 'center' },

  headerActions: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: 8, background: TOKENS.neutral[50], border: `1px solid ${TOKENS.neutral[200]}`, borderRadius: TOKENS.radius.lg, padding: '7px 12px' },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: TOKENS.neutral[700], fontSize: 13, width: 180, fontFamily: TOKENS.fontFamily, fontWeight: 400 },
  searchKbd: { fontSize: 10, fontWeight: 500, color: TOKENS.neutral[400], background: TOKENS.neutral[100], border: `1px solid ${TOKENS.neutral[200]}`, borderRadius: TOKENS.radius.sm, padding: '1px 5px', fontFamily: TOKENS.fontMono },

  iconButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: TOKENS.radius.lg, background: TOKENS.neutral[50], border: `1px solid ${TOKENS.neutral[200]}`, cursor: 'pointer', padding: 0 },
  notifButton: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: TOKENS.radius.lg, background: TOKENS.neutral[50], border: `1px solid ${TOKENS.neutral[200]}`, cursor: 'pointer', padding: 0 },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: TOKENS.danger.base, border: '2px solid #fff' },
  headerDivider: { width: 1, height: 28, background: TOKENS.neutral[200], margin: '0 4px' },
  exportBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: TOKENS.neutral[700], border: `1px solid ${TOKENS.neutral[200]}`, borderRadius: TOKENS.radius.lg, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: TOKENS.fontFamily },
  addLeadBtn: { display: 'flex', alignItems: 'center', gap: 6, background: TOKENS.primary[600], color: '#fff', border: 'none', borderRadius: TOKENS.radius.lg, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: TOKENS.fontFamily, boxShadow: `0 2px 8px ${TOKENS.primary[600]}40` },

  insightsBar: { display: 'flex', alignItems: 'center', gap: 16, padding: '10px 28px', margin: '16px 28px 16px', background: '#fff', border: `1px solid ${TOKENS.neutral[200]}`, borderRadius: TOKENS.radius.lg, boxShadow: TOKENS.shadowXs, flexWrap: 'wrap' as const, animation: 'fadeIn 0.4s ease' },
  insightItem: { display: 'flex', alignItems: 'center', gap: 6 },
  insightText: { fontSize: 12, color: TOKENS.neutral[500], fontFamily: TOKENS.fontFamily },
  insightDivider: { width: 1, height: 16, background: TOKENS.neutral[200] },

  content: { padding: '0 28px 52px', maxWidth: 1600, margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 },

  chartsRow: { display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' as const },
  bottomRow: { display: 'flex', gap: 16, flexWrap: 'wrap' as const },

  card: { background: TOKENS.cardBg, borderRadius: TOKENS.radius.xl, padding: '20px 22px', border: `1px solid ${TOKENS.cardBorder}`, boxShadow: TOKENS.shadowSm, boxSizing: 'border-box' as const, animation: 'fadeInUp 0.4s ease both' },
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: TOKENS.neutral[900], margin: 0, fontFamily: TOKENS.fontFamily },
  cardSubtitle: { fontSize: 12, color: TOKENS.neutral[400], margin: '2px 0 0', fontFamily: TOKENS.fontFamily, paddingLeft: 16 },
  cardActions: { display: 'flex', alignItems: 'center', gap: 8 },
  periodBadge: { fontSize: 11, fontWeight: 600, color: TOKENS.neutral[500], background: TOKENS.neutral[100], borderRadius: TOKENS.radius.full, padding: '3px 10px', fontFamily: TOKENS.fontFamily },
  moreBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: TOKENS.radius.sm },
  viewAllBtn: { display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', color: TOKENS.primary[500], fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: TOKENS.fontFamily, whiteSpace: 'nowrap' as const },

  metricBadge: { display: 'flex', alignItems: 'center', gap: 5, background: TOKENS.primary[50], border: `1px solid ${TOKENS.primary[200]}`, borderRadius: TOKENS.radius.full, padding: '3px 10px' },
  metricText: { fontSize: 11, color: TOKENS.primary[700], fontFamily: TOKENS.fontFamily },
  peakBadge: { display: 'flex', alignItems: 'center', gap: 5, background: TOKENS.success.light, border: `1px solid ${TOKENS.success.border}`, borderRadius: TOKENS.radius.full, padding: '3px 10px' },
  peakText: { fontSize: 11, fontWeight: 600, color: TOKENS.success.dark, fontFamily: TOKENS.fontFamily },

  legendRow: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${TOKENS.neutral[100]}` },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  legendLabel: { fontSize: 12, color: TOKENS.neutral[500], fontFamily: TOKENS.fontFamily, fontWeight: 500 },
  legendValue: { fontSize: 12, fontWeight: 700, color: TOKENS.neutral[800], marginLeft: 2, fontFamily: TOKENS.fontFamily },

  pieCenter: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  piePct: { fontSize: 28, fontWeight: 800, color: TOKENS.neutral[900], margin: 0, fontFamily: TOKENS.fontFamily, letterSpacing: '-0.5px' },
  pieLabel: { fontSize: 11, color: TOKENS.neutral[400], margin: '2px 0 0', fontWeight: 500, fontFamily: TOKENS.fontFamily, textTransform: 'uppercase', letterSpacing: '0.06em' },
  pieLegend: { display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${TOKENS.neutral[100]}` },
  pieStatItem: { display: 'flex', alignItems: 'center', gap: 8 },
  pieStatDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  pieStatLabel: { fontSize: 12, color: TOKENS.neutral[500], margin: 0, fontFamily: TOKENS.fontFamily, fontWeight: 500 },
  pieStatValue: { fontSize: 13, fontWeight: 700, color: TOKENS.neutral[800], margin: '1px 0 0', fontFamily: TOKENS.fontFamily },

  daySummary: { display: 'flex', gap: 6, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${TOKENS.neutral[100]}`, flexWrap: 'wrap' as const },
  dayPill: { flex: 1, minWidth: 38, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', borderRadius: TOKENS.radius.md, border: '1px solid' },

  activityList: { display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center' },
  emptyTitle: { fontSize: 14, fontWeight: 600, color: TOKENS.neutral[600], margin: '12px 0 4px', fontFamily: TOKENS.fontFamily },
  emptyDesc: { fontSize: 12, color: TOKENS.neutral[400], margin: 0, fontFamily: TOKENS.fontFamily },
};

export default Dashboard;