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


// import React, { useEffect, useState } from 'react';
// import {
//   DollarSign,
//   Users,
//   TrendingUp,
//   Clock,
//   Phone,
//   Mail,
//   Calendar,
//   FileText,
//   ArrowUp,
//   ArrowDown,
//   ChevronRight,
//   Plus,
//   Sparkles,
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Line,
//   CartesianGrid,
//   Area,
//   AreaChart,
// } from 'recharts';
// import { api } from '../Utils/api';
// import type { DashboardStats } from '../Utils/types';

// type ActivityItemType = {
//   id: number;
//   activity_type: string;
//   summary?: string;
//   created_at: string;
// };

// export const Dashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .getDashboardStats()
//       .then((data) => {
//         setStats(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading || !stats) {
//     return (
//       <div className="flex items-center justify-center h-full bg-slate-100">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-slate-500">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) =>
//     stats.status_distribution.find((s) => s.status === status)?.count || 0;

//   const wonCount = getStatusCount('won');
//   const contactedCount = getStatusCount('contacted');
//   const newCount = getStatusCount('new');

//   const pipelineData = [
//     { name: 'New', value: newCount, color: '#60a5fa' },
//     { name: 'Contacted', value: contactedCount, color: '#818cf8' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
//     { name: 'Won', value: wonCount, color: '#22c55e' },
//   ];

//   const weeklyData = [
//     { day: 'Mon', leads: 4, calls: 12 },
//     { day: 'Tue', leads: 7, calls: 18 },
//     { day: 'Wed', leads: 5, calls: 15 },
//     { day: 'Thu', leads: 9, calls: 22 },
//     { day: 'Fri', leads: 6, calls: 17 },
//     { day: 'Sat', leads: 3, calls: 10 },
//     { day: 'Sun', leads: 5, calls: 13 },
//   ];

//   const pieData = [
//     { name: 'New', value: getStatusCount('new'), color: '#38bdf8' },
//     { name: 'Contacted', value: getStatusCount('contacted'), color: '#6366f1' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
//     { name: 'Won', value: getStatusCount('won'), color: '#22c55e' },
//     { name: 'Lost', value: getStatusCount('lost'), color: '#f43f5e' },
//   ];

//   return (
//     <div className="min-h-full p-6 bg-gradient-to-br from-blue-100 via-white to-cyan-100 relative">
//       <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl" />
//       <div className="pointer-events-none absolute top-40 -right-24 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl" />
//       <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-56 bg-indigo-200/30 rounded-full blur-3xl" />

//       <div className="relative bg-white/75 backdrop-blur-md border border-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(37,99,235,0.15)] mb-6">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
//               <Sparkles size={14} />
//               Revenue Intelligence
//             </div>
//             <h1 className="text-3xl font-bold text-slate-900">Sales Performance Hub</h1>
//             <p className="text-slate-600 mt-1">Track pipeline health, conversions, and daily momentum.</p>
//           </div>
//           <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200">
//             <Plus size={18} />
//             Add Lead
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//         <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} gradient="from-blue-500 to-cyan-600" />
//         <StatCard title="Total Leads" value={stats.total_leads} change={8} icon={Users} gradient="from-blue-500 to-indigo-600" />
//         <StatCard title="Win Rate" value={`${stats.win_rate}%`} change={3.2} icon={TrendingUp} gradient="from-sky-500 to-blue-700" />
//         <StatCard title="Pending Leads" value={newCount} change={-2} icon={Clock} gradient="from-cyan-500 to-blue-600" />
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
//         <div className="xl:col-span-2 bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
//           <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline by Stage</h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={pipelineData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                 <Tooltip
//                   cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
//                   contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}
//                 />
//                 <Bar dataKey="value" radius={[10, 10, 0, 0]}>
//                   {pipelineData.map((entry) => (
//                     <Cell key={entry.name} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
//           <h2 className="text-lg font-semibold text-slate-900 mb-4">Conversion Snapshot</h2>
//           <div className="h-56 relative">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={82} stroke="none">
//                   {pieData.map((entry) => (
//                     <Cell key={entry.name} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <p className="text-3xl font-bold text-slate-900">{stats.win_rate}%</p>
//                 <p className="text-xs text-slate-500">Win Ratio</p>
//               </div>
//             </div>
//           </div>
//           <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
//             {pieData.map((item) => (
//               <LegendRow key={item.name} color={item.color} label={`${item.name} (${item.value})`} />
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
//           <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Leads vs Calls</h2>
//           <div className="h-60">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={weeklyData}>
//                 <defs>
//                   <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
//                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                 <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }} />
//                 <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="url(#leadFill)" strokeWidth={2.5} />
//                 <Line type="monotone" dataKey="calls" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-[0_8px_30px_rgba(30,64,175,0.12)]">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
//             <span className="text-xs text-slate-500">Last 5 updates</span>
//           </div>
//           <div className="space-y-3">
//             {stats.recent_activities.slice(0, 5).map((activity) => (
//               <ActivityItem key={activity.id} activity={activity} />
//             ))}
//             {stats.recent_activities.length === 0 && (
//               <p className="text-slate-400 text-center py-10">No recent activity</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({
//   title,
//   value,
//   change,
//   icon: Icon,
//   gradient,
// }: {
//   title: string;
//   value: string | number;
//   change: number;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   gradient: string;
// }) => (
//   <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-200/60 to-cyan-200/40 shadow-md">
//     <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border border-white">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-slate-500 mb-1">{title}</p>
//           <p className="text-2xl font-bold text-slate-900">{value}</p>
//         </div>
//         <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
//           <Icon size={18} className="text-white" />
//         </div>
//       </div>
//       <div className="mt-3 flex items-center gap-1.5">
//         {change >= 0 ? <ArrowUp size={14} className="text-emerald-500" /> : <ArrowDown size={14} className="text-rose-500" />}
//         <span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{Math.abs(change)}%</span>
//         <span className="text-sm text-slate-400">vs last month</span>
//       </div>
//     </div>
//   </div>
// );

// const LegendRow = ({ color, label }: { color: string; label: string }) => (
//   <div className="flex items-center gap-2">
//     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
//     <span className="text-slate-600">{label}</span>
//   </div>
// );

// const ActivityItem = ({ activity }: { activity: ActivityItemType }) => {
//   const icons: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; color: string }> = {
//     call: { icon: Phone, bg: 'bg-sky-100', color: 'text-sky-600' },
//     email: { icon: Mail, bg: 'bg-violet-100', color: 'text-violet-600' },
//     meeting: { icon: Calendar, bg: 'bg-emerald-100', color: 'text-emerald-600' },
//     note: { icon: FileText, bg: 'bg-amber-100', color: 'text-amber-600' },
//   };

//   const config = icons[activity.activity_type] || icons.note;
//   const Icon = config.icon;

//   return (
//     <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
//       <div className={`p-2.5 rounded-lg ${config.bg}`}>
//         <Icon size={15} className={config.color} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-slate-800 truncate">{activity.summary || activity.activity_type}</p>
//         <p className="text-xs text-slate-400">
//           {new Date(activity.created_at).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </p>
//       </div>
//       <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import {
//   DollarSign,
//   Users,
//   TrendingUp,
//   Clock,
//   Phone,
//   Mail,
//   Calendar,
//   FileText,
//   ArrowUp,
//   ArrowDown,
//   ChevronRight,
//   Plus,
//   Sparkles,
//   LayoutDashboard,
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Line,
//   CartesianGrid,
//   Area,
//   AreaChart,
// } from 'recharts';
// import { api } from '../Utils/api';
// import type { DashboardStats } from '../Utils/types';

// type ActivityItemType = {
//   id: number;
//   activity_type: string;
//   summary?: string;
//   created_at: string;
// };

// /* ─── Keyframes injected once ─────────────────────────── */
// const injectStyles = () => {
//   const id = 'dash-v2-styles';
//   if (document.getElementById(id)) return;
//   const s = document.createElement('style');
//   s.id = id;
//   s.textContent = `
//     @keyframes fadeInUp {
//       from { opacity:0; transform:translateY(10px); }
//       to   { opacity:1; transform:translateY(0);    }
//     }
//     @keyframes slideIn {
//       from { opacity:0; transform:translateX(-6px); }
//       to   { opacity:1; transform:translateX(0);    }
//     }
//     @keyframes spin { to { transform:rotate(360deg); } }
//     .dv2-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
//     .dv2-card:hover { transform:translateY(-2px); box-shadow:0 10px 24px -4px rgba(0,0,0,0.1); }
//     .dv2-stat { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor:pointer; }
//     .dv2-stat:hover { transform:translateY(-3px); box-shadow:0 14px 28px -6px rgba(0,0,0,0.12); }
//     .dv2-act  { transition: background 0.15s ease, transform 0.15s ease; cursor:pointer; }
//     .dv2-act:hover  { background:#f1f5f9 !important; transform:translateX(3px); }
//     .dv2-fadeinup { animation: fadeInUp 0.4s ease both; }
//     .dv2-slidein  { animation: slideIn  0.3s ease both; }
//   `;
//   document.head.appendChild(s);
// };

// /* ─── Custom Tooltip ──────────────────────────────────── */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-slate-900 rounded-xl px-4 py-2.5 shadow-xl border-0">
//       <p className="text-[10px] font-medium text-slate-400 mb-1">{label}</p>
//       {payload.map((e: any, i: number) => (
//         <p key={i} className="text-[13px] font-bold text-white m-0">
//           {e.value} {e.name || ''}
//         </p>
//       ))}
//     </div>
//   );
// };

// /* ─── Stat card gradient configs ─────────────────────── */
// const STAT_GRADIENTS: Record<string, { from: string; to: string; glow: string }> = {
//   revenue: { from: '#667eea', to: '#764ba2', glow: 'rgba(102,126,234,0.32)' },
//   leads:   { from: '#f093fb', to: '#f5576c', glow: 'rgba(240,147,251,0.32)' },
//   winRate: { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79,172,254,0.32)'  },
//   pending: { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67,233,123,0.32)'  },
// };

// /* ─── Stat Card ───────────────────────────────────────── */
// const StatCard = ({
//   title, value, change, icon: Icon, gradientKey, delay,
// }: {
//   title: string; value: string | number; change: number;
//   icon: React.ComponentType<{ size?: number }>;
//   gradientKey: string; delay: number;
// }) => {
//   const g = STAT_GRADIENTS[gradientKey];
//   const positive = change >= 0;
//   return (
//     <div
//       className="dv2-stat dv2-fadeinup bg-white rounded-xl border border-slate-200 overflow-hidden"
//       style={{ animationDelay: `${delay * 0.08}s` }}
//     >
//       {/* accent bar mirrors Pipeline's STATUS_CONFIG gradient bar */}
//       <div className="h-[3px] w-full" style={{ background: `linear-gradient(135deg,${g.from},${g.to})` }} />
//       <div className="p-4">
//         <div className="flex items-start justify-between mb-3">
//           <div>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
//             <p className="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{value}</p>
//           </div>
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
//             style={{
//               background: `linear-gradient(135deg,${g.from},${g.to})`,
//               boxShadow: `0 4px 12px ${g.glow}`,
//             }}
//           >
//             <Icon size={18} />
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
//             positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
//           }`}>
//             {positive
//               ? <ArrowUp size={10} strokeWidth={2.5} />
//               : <ArrowDown size={10} strokeWidth={2.5} />}
//             {Math.abs(change)}%
//           </span>
//           <span className="text-[10px] text-slate-400">vs last month</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Legend Row ──────────────────────────────────────── */
// const LegendRow = ({ color, label }: { color: string; label: string }) => (
//   <div className="flex items-center gap-1.5">
//     <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
//     <span className="text-[11px] text-slate-600 font-medium">{label}</span>
//   </div>
// );

// /* ─── Activity Item ───────────────────────────────────── */
// const ACTIVITY_CFG: Record<string, { icon: any; bg: string; text: string; accent: string; label: string }> = {
//   call:    { icon: Phone,    bg: 'bg-blue-50',    text: 'text-blue-600',    accent: '#3b82f6', label: 'Call'    },
//   email:   { icon: Mail,     bg: 'bg-violet-50',  text: 'text-violet-600',  accent: '#8b5cf6', label: 'Email'   },
//   meeting: { icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600', accent: '#10b981', label: 'Meeting' },
//   note:    { icon: FileText, bg: 'bg-amber-50',   text: 'text-amber-600',   accent: '#f59e0b', label: 'Note'    },
// };

// const ActivityItem = ({ activity, index }: { activity: ActivityItemType; index: number }) => {
//   const cfg = ACTIVITY_CFG[activity.activity_type] || ACTIVITY_CFG.note;
//   const IconComp = cfg.icon;
//   const timeStr = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   return (
//     <div
//       className="dv2-act dv2-slidein flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50/80 mb-1.5"
//       style={{ animationDelay: `${index * 0.05}s`, borderLeft: `3px solid ${cfg.accent}` }}
//     >
//       <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0`}>
//         <IconComp size={14} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
//           {cfg.label}
//         </span>
//         <p className="text-[12px] font-medium text-slate-800 truncate mt-0.5">
//           {activity.summary || activity.activity_type}
//         </p>
//       </div>
//       <p className="text-[11px] font-semibold text-slate-500 shrink-0">{timeStr}</p>
//       <ChevronRight size={13} className="text-slate-300 shrink-0" />
//     </div>
//   );
// };

// /* ═══════════════ MAIN DASHBOARD ═══════════════ */
// export const Dashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { injectStyles(); }, []);

//   useEffect(() => {
//     api
//       .getDashboardStats()
//       .then((data) => { setStats(data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading || !stats) {
//     return (
//       <div className="flex items-center justify-center h-full bg-[#f4f6fb]">
//         <div className="flex flex-col items-center bg-white rounded-2xl px-14 py-12 border border-slate-200 shadow-lg">
//           <div
//             className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-indigo-500 mb-4"
//             style={{ animation: 'spin 0.8s linear infinite' }}
//           />
//           <p className="text-[13px] font-bold text-slate-700 mb-0.5">Loading dashboard</p>
//           <p className="text-[11px] text-slate-400">Fetching your latest data…</p>
//         </div>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) =>
//     stats.status_distribution.find((s) => s.status === status)?.count || 0;

//   const wonCount       = getStatusCount('won');
//   const contactedCount = getStatusCount('contacted');
//   const newCount       = getStatusCount('new');

//   const pipelineData = [
//     { name: 'New',         value: newCount,                      color: '#3b82f6' },
//     { name: 'Contacted',   value: contactedCount,                color: '#6366f1' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
//     { name: 'Won',         value: wonCount,                      color: '#10b981' },
//   ];

//   const weeklyData = [
//     { day: 'Mon', leads: 4,  calls: 12 },
//     { day: 'Tue', leads: 7,  calls: 18 },
//     { day: 'Wed', leads: 5,  calls: 15 },
//     { day: 'Thu', leads: 9,  calls: 22 },
//     { day: 'Fri', leads: 6,  calls: 17 },
//     { day: 'Sat', leads: 3,  calls: 10 },
//     { day: 'Sun', leads: 5,  calls: 13 },
//   ];

//   const pieData = [
//     { name: 'New',         value: getStatusCount('new'),          color: '#3b82f6' },
//     { name: 'Contacted',   value: getStatusCount('contacted'),    color: '#6366f1' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'),  color: '#f59e0b' },
//     { name: 'Won',         value: getStatusCount('won'),          color: '#10b981' },
//     { name: 'Lost',        value: getStatusCount('lost'),         color: '#94a3b8' },
//   ];

//   return (
//     <div className="flex flex-col h-full bg-[#f4f6fb] overflow-hidden">

//       {/* ── BANNER — identical pattern to Pipeline ── */}
//       <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center gap-3 shrink-0">
//         <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//           <LayoutDashboard className="text-white" size={15} />
//         </div>
//         <div className="flex-1">
//           <h1 className="text-[18px] font-bold text-white leading-tight">Sales Performance Hub</h1>
//           <p className="text-[11px] text-indigo-200 mt-0.5">Track pipeline health, conversions, and daily momentum</p>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-indigo-200 px-2.5 py-1 rounded-md text-[11px] font-semibold">
//             <Sparkles size={11} /> Revenue Intelligence
//           </div> */}
//           <button className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors shadow-sm">
//             <Plus size={13} /> Add Lead
//           </button>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//           <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} gradientKey="revenue" delay={0} />
//           <StatCard title="Total Leads"   value={stats.total_leads}                         change={8}    icon={Users}       gradientKey="leads"   delay={1} />
//           <StatCard title="Win Rate"      value={`${stats.win_rate}%`}                      change={3.2}  icon={TrendingUp}  gradientKey="winRate" delay={2} />
//           <StatCard title="Pending Leads" value={newCount}                                  change={-2}   icon={Clock}       gradientKey="pending" delay={3} />
//         </div>

//         {/* ── CHARTS ROW 1 ── */}
//         <div className="flex gap-3 flex-wrap lg:flex-nowrap">

//           {/* Pipeline bar chart */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-xl border border-slate-200 p-4 flex-[2] min-w-[280px]"
//             style={{ animationDelay: '0.10s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2 h-2 rounded-full bg-indigo-500" />
//                   <h2 className="text-[13px] font-bold text-slate-800">Pipeline by Stage</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4">Lead distribution across pipeline</p>
//               </div>
//               <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">
//                 This Month
//               </span>
//             </div>
//             <div className="h-60">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={pipelineData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false}
//                     tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                     tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} />
//                   <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 } as any} />
//                   <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
//                     {pipelineData.map((entry) => (
//                       <Cell key={entry.name} fill={entry.color} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-100">
//               {pipelineData.map((item) => (
//                 <div key={item.name} className="flex items-center gap-1.5">
//                   <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
//                   <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
//                   <span className="text-[11px] font-bold text-slate-700">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Conversion donut */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[230px]"
//             style={{ animationDelay: '0.14s' }}
//           >
//             <div className="flex items-center gap-2 mb-0.5">
//               <span className="w-2 h-2 rounded-full bg-cyan-500" />
//               <h2 className="text-[13px] font-bold text-slate-800">Conversion Snapshot</h2>
//             </div>
//             <p className="text-[10px] text-slate-400 ml-4 mb-3">Leads by current status</p>
//             <div className="h-48 relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData} dataKey="value"
//                     innerRadius={56} outerRadius={74}
//                     stroke="none" startAngle={90} endAngle={-270} cornerRadius={3}
//                   >
//                     {pieData.map((entry) => (
//                       <Cell key={entry.name} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center">
//                   <p className="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{stats.win_rate}%</p>
//                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Win Ratio</p>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
//               {pieData.map((item) => (
//                 <LegendRow key={item.name} color={item.color} label={`${item.name} (${item.value})`} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── CHARTS ROW 2 ── */}
//         <div className="flex gap-3 flex-wrap lg:flex-nowrap">

//           {/* Weekly leads vs calls area chart */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[280px]"
//             style={{ animationDelay: '0.18s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2 h-2 rounded-full bg-pink-500" />
//                   <h2 className="text-[13px] font-bold text-slate-800">Weekly Leads vs Calls</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4">Activity volume per day</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Leads
//                 </span>
//                 <span className="flex items-center gap-1 text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2 py-0.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Calls
//                 </span>
//               </div>
//             </div>
//             <div className="h-52">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="leadFill2" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.18} />
//                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="day" axisLine={false} tickLine={false}
//                     tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                     tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone" dataKey="leads"
//                     stroke="#6366f1" fill="url(#leadFill2)" strokeWidth={2.5}
//                     dot={{ fill: '#fff', stroke: '#6366f1', strokeWidth: 2.5, r: 4 }}
//                     activeDot={{ r: 5.5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
//                   />
//                   <Line
//                     type="monotone" dataKey="calls"
//                     stroke="#7c3aed" strokeWidth={2}
//                     dot={{ r: 3, fill: '#7c3aed' }}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Recent activity */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[260px]"
//             style={{ animationDelay: '0.22s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2 h-2 rounded-full bg-amber-500" />
//                   <h2 className="text-[13px] font-bold text-slate-800">Recent Activity</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4">Last 5 updates</p>
//               </div>
//               <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
//                 View all <ChevronRight size={12} />
//               </button>
//             </div>
//             <div>
//               {stats.recent_activities.slice(0, 5).map((activity, i) => (
//                 <ActivityItem key={activity.id} activity={activity} index={i} />
//               ))}
//               {stats.recent_activities.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-10 text-center">
//                   <p className="text-[12px] font-bold text-slate-400">No recent activity</p>
//                   <p className="text-[10px] text-slate-300 mt-0.5">Changes will appear here</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>{/* end scrollable body */}
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import {
//   DollarSign,
//   Users,
//   TrendingUp,
//   Clock,
//   Phone,
//   Mail,
//   Calendar,
//   FileText,
//   ArrowUp,
//   ArrowDown,
//   ChevronRight,
//   Plus,
//   Sparkles,
//   LayoutDashboard,
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Line,
//   CartesianGrid,
//   Area,
//   AreaChart,
// } from 'recharts';
// import { api } from '../Utils/api';
// import type { DashboardStats } from '../Utils/types';

// type ActivityItemType = {
//   id: number;
//   activity_type: string;
//   summary?: string;
//   created_at: string;
// };

// /* ─── Keyframes injected once ─────────────────────────── */
// const injectStyles = () => {
//   const id = 'dash-v2-styles';
//   if (document.getElementById(id)) return;
//   const s = document.createElement('style');
//   s.id = id;
//   s.textContent = `
//     @keyframes fadeInUp {
//       from { opacity:0; transform:translateY(10px); }
//       to   { opacity:1; transform:translateY(0);    }
//     }
//     @keyframes slideIn {
//       from { opacity:0; transform:translateX(-6px); }
//       to   { opacity:1; transform:translateX(0);    }
//     }
//     @keyframes spin { to { transform:rotate(360deg); } }
//     .dv2-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
//     .dv2-card:hover { transform:translateY(-2px); box-shadow:0 10px 24px -4px rgba(0,0,0,0.1); }
//     .dv2-stat { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor:pointer; }
//     .dv2-stat:hover { transform:translateY(-3px); box-shadow:0 14px 28px -6px rgba(0,0,0,0.18); }
//     .dv2-act  { transition: background 0.15s ease, transform 0.15s ease; cursor:pointer; }
//     .dv2-act:hover  { background:#f1f5f9 !important; transform:translateX(3px); }
//     .dv2-fadeinup { animation: fadeInUp 0.4s ease both; }
//     .dv2-slidein  { animation: slideIn  0.3s ease both; }
//   `;
//   document.head.appendChild(s);
// };

// /* ─── Custom Tooltip ──────────────────────────────────── */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-slate-900 rounded-xl px-4 py-2.5 shadow-xl border-0">
//       <p className="text-[10px] font-medium text-slate-400 mb-1">{label}</p>
//       {payload.map((e: any, i: number) => (
//         <p key={i} className="text-[13px] font-bold text-white m-0">
//           {e.value} {e.name || ''}
//         </p>
//       ))}
//     </div>
//   );
// };

// /* ─── Stat card solid color configs ─────────────────────── */
// const STAT_COLORS: Record<string, {
//   bg: string; iconBg: string; iconColor: string; badge: string; badgeText: string;
// }> = {
//   revenue: { bg: '#4f46e5', iconBg: 'rgba(255,255,255,0.18)', iconColor: '#ffffff', badge: 'rgba(255,255,255,0.18)', badgeText: '#ffffff' },
//   leads:   { bg: '#0ea5e9', iconBg: 'rgba(255,255,255,0.18)', iconColor: '#ffffff', badge: 'rgba(255,255,255,0.18)', badgeText: '#ffffff' },
//   winRate: { bg: '#10b981', iconBg: 'rgba(255,255,255,0.18)', iconColor: '#ffffff', badge: 'rgba(255,255,255,0.18)', badgeText: '#ffffff' },
//   pending: { bg: '#f59e0b', iconBg: 'rgba(255,255,255,0.18)', iconColor: '#ffffff', badge: 'rgba(255,255,255,0.18)', badgeText: '#ffffff' },
// };

// /* ─── Stat Card ─────────────────────────────────────────
//    FIX: icon typed as React.ComponentType<{ size?: number }>
//    Color is applied via the wrapper div's style, not as a
//    prop on the icon itself — avoids the TS overload error.
// ──────────────────────────────────────────────────────── */
// const StatCard = ({
//   title, value, change, icon: Icon, gradientKey, delay,
// }: {
//   title: string;
//   value: string | number;
//   change: number;
//   icon: React.ComponentType<{ size?: number }>;   // ← no `color` here
//   gradientKey: string;
//   delay: number;
// }) => {
//   const c = STAT_COLORS[gradientKey];
//   const positive = change >= 0;

//   return (
//     <div
//       className="dv2-stat dv2-fadeinup rounded-2xl overflow-hidden"
//       style={{ animationDelay: `${delay * 0.08}s`, backgroundColor: c.bg }}
//     >
//       <div className="p-5">
//         {/* Top row: label + icon */}
//         <div className="flex items-start justify-between mb-4">
//           <p className="text-[11px] font-black text-white/70 uppercase tracking-widest leading-tight">{title}</p>
//           {/* FIX: color applied via style on the wrapper, not as a prop to the icon */}
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: c.iconBg, color: c.iconColor }}
//           >
//             <Icon size={18} />
//           </div>
//         </div>

//         {/* Value */}
//         <p className="text-[32px] font-black text-white leading-none tracking-tight mb-3">{value}</p>

//         {/* Change badge */}
//         <div
//           className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
//           style={{ backgroundColor: c.badge, color: c.badgeText }}
//         >
//           {positive
//             ? <ArrowUp size={10} strokeWidth={3} />
//             : <ArrowDown size={10} strokeWidth={3} />}
//           {Math.abs(change)}% vs last month
//         </div>
//       </div>

//       {/* Bottom accent strip */}
//       <div className="h-1 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
//     </div>
//   );
// };

// /* ─── Legend Row ──────────────────────────────────────── */
// const LegendRow = ({ color, label }: { color: string; label: string }) => (
//   <div className="flex items-center gap-1.5">
//     <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
//     <span className="text-[11px] text-slate-600 font-medium">{label}</span>
//   </div>
// );

// /* ─── Activity Item ───────────────────────────────────── */
// const ACTIVITY_CFG: Record<string, { icon: any; bg: string; text: string; accent: string; label: string }> = {
//   call:    { icon: Phone,    bg: 'bg-blue-50',    text: 'text-blue-600',    accent: '#3b82f6', label: 'Call'    },
//   email:   { icon: Mail,     bg: 'bg-violet-50',  text: 'text-violet-600',  accent: '#8b5cf6', label: 'Email'   },
//   meeting: { icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600', accent: '#10b981', label: 'Meeting' },
//   note:    { icon: FileText, bg: 'bg-amber-50',   text: 'text-amber-600',   accent: '#f59e0b', label: 'Note'    },
// };

// const ActivityItem = ({ activity, index }: { activity: ActivityItemType; index: number }) => {
//   const cfg      = ACTIVITY_CFG[activity.activity_type] || ACTIVITY_CFG.note;
//   const IconComp = cfg.icon;
//   const timeStr  = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   return (
//     <div
//       className="dv2-act dv2-slidein flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50/80 mb-1.5"
//       style={{ animationDelay: `${index * 0.05}s`, borderLeft: `3px solid ${cfg.accent}` }}
//     >
//       <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0`}>
//         <IconComp size={14} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
//           {cfg.label}
//         </span>
//         <p className="text-[12px] font-medium text-slate-800 truncate mt-0.5">
//           {activity.summary || activity.activity_type}
//         </p>
//       </div>
//       <p className="text-[11px] font-semibold text-slate-500 shrink-0">{timeStr}</p>
//       <ChevronRight size={13} className="text-slate-300 shrink-0" />
//     </div>
//   );
// };

// /* ═══════════════ MAIN DASHBOARD ═══════════════ */
// export const Dashboard = () => {
//   const [stats, setStats]   = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { injectStyles(); }, []);

//   useEffect(() => {
//     api
//       .getDashboardStats()
//       .then((data) => { setStats(data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading || !stats) {
//     return (
//       <div className="flex items-center justify-center h-full bg-[#f4f6fb]">
//         <div className="flex flex-col items-center bg-white rounded-2xl px-14 py-12 border border-slate-200 shadow-lg">
//           <div
//             className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-indigo-500 mb-4"
//             style={{ animation: 'spin 0.8s linear infinite' }}
//           />
//           <p className="text-[13px] font-bold text-slate-700 mb-0.5">Loading dashboard</p>
//           <p className="text-[11px] text-slate-400">Fetching your latest data…</p>
//         </div>
//       </div>
//     );
//   }

//   const getStatusCount = (status: string) =>
//     stats.status_distribution.find((s) => s.status === status)?.count || 0;

//   const wonCount       = getStatusCount('won');
//   const contactedCount = getStatusCount('contacted');
//   const newCount       = getStatusCount('new');

//   const pipelineData = [
//     { name: 'New',         value: newCount,                      color: '#3b82f6' },
//     { name: 'Contacted',   value: contactedCount,                color: '#6366f1' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
//     { name: 'Won',         value: wonCount,                      color: '#10b981' },
//   ];

//   const weeklyData = [
//     { day: 'Mon', leads: 4,  calls: 12 },
//     { day: 'Tue', leads: 7,  calls: 18 },
//     { day: 'Wed', leads: 5,  calls: 15 },
//     { day: 'Thu', leads: 9,  calls: 22 },
//     { day: 'Fri', leads: 6,  calls: 17 },
//     { day: 'Sat', leads: 3,  calls: 10 },
//     { day: 'Sun', leads: 5,  calls: 13 },
//   ];

//   const pieData = [
//     { name: 'New',         value: getStatusCount('new'),         color: '#3b82f6' },
//     { name: 'Contacted',   value: getStatusCount('contacted'),   color: '#6366f1' },
//     { name: 'Negotiation', value: getStatusCount('negotiation'), color: '#f59e0b' },
//     { name: 'Won',         value: getStatusCount('won'),         color: '#10b981' },
//     { name: 'Lost',        value: getStatusCount('lost'),        color: '#94a3b8' },
//   ];

//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       {/* ── BANNER ── */}
//       <div
//         className="shrink-0 mx-4 mt-4 mb-0 rounded-2xl overflow-hidden"
//         style={{
//           background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//           boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
//         }}
//       >
//         <div
//           className="px-6 py-5 flex items-center gap-4"
//           style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
//         >
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
//           >
//             <LayoutDashboard className="text-white" size={20} />
//           </div>

//           <div className="flex-1">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               Sales Performance Hub
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Track pipeline health, conversions, and daily momentum
//             </p>
//           </div>

//           <div className="flex items-center gap-2.5 shrink-0">
//             <div
//               className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-indigo-100"
//               style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
//             >
//               <Sparkles size={12} /> Revenue Intelligence
//             </div>
//             <button
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-black transition-all"
//               style={{ backgroundColor: '#ffffff', color: '#4f46e5', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
//               onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ede9fe')}
//               onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
//             >
//               <Plus size={14} /> Add Lead
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//           <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} gradientKey="revenue" delay={0} />
//           <StatCard title="Total Leads"   value={stats.total_leads}                         change={8}    icon={Users}      gradientKey="leads"   delay={1} />
//           <StatCard title="Win Rate"      value={`${stats.win_rate}%`}                      change={3.2}  icon={TrendingUp} gradientKey="winRate" delay={2} />
//           <StatCard title="Pending Leads" value={newCount}                                  change={-2}   icon={Clock}      gradientKey="pending" delay={3} />
//         </div>

//         {/* ── CHARTS ROW 1 ── */}
//         <div className="flex gap-3 flex-wrap lg:flex-nowrap">

//           {/* Pipeline bar chart */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-2xl border border-slate-200/80 p-5 flex-[2] min-w-[280px]"
//             style={{ animationDelay: '0.10s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
//                   <h2 className="text-[14px] font-black text-slate-800">Pipeline by Stage</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4.5">Lead distribution across pipeline</p>
//               </div>
//               <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1">
//                 This Month
//               </span>
//             </div>
//             <div className="h-56">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={pipelineData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false}
//                     tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                     tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} />
//                   <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 } as any} />
//                   <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
//                     {pipelineData.map((entry) => (
//                       <Cell key={entry.name} fill={entry.color} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-100">
//               {pipelineData.map((item) => (
//                 <div key={item.name} className="flex items-center gap-1.5">
//                   <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
//                   <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
//                   <span className="text-[12px] font-black text-slate-700">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Conversion donut */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-2xl border border-slate-200/80 p-5 flex-1 min-w-[230px]"
//             style={{ animationDelay: '0.14s' }}
//           >
//             <div className="flex items-center gap-2 mb-0.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
//               <h2 className="text-[14px] font-black text-slate-800">Conversion Snapshot</h2>
//             </div>
//             <p className="text-[10px] text-slate-400 ml-4.5 mb-3">Leads by current status</p>
//             <div className="h-48 relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData} dataKey="value"
//                     innerRadius={56} outerRadius={74}
//                     stroke="none" startAngle={90} endAngle={-270} cornerRadius={3}
//                   >
//                     {pieData.map((entry) => (
//                       <Cell key={entry.name} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center">
//                   <p className="text-[28px] font-black text-slate-900 leading-none tracking-tight">{stats.win_rate}%</p>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Win Ratio</p>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
//               {pieData.map((item) => (
//                 <LegendRow key={item.name} color={item.color} label={`${item.name} (${item.value})`} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── CHARTS ROW 2 ── */}
//         <div className="flex gap-3 flex-wrap lg:flex-nowrap">

//           {/* Weekly leads vs calls area chart */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-2xl border border-slate-200/80 p-5 flex-1 min-w-[280px]"
//             style={{ animationDelay: '0.18s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
//                   <h2 className="text-[14px] font-black text-slate-800">Weekly Leads vs Calls</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4.5">Activity volume per day</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Leads
//                 </span>
//                 <span className="flex items-center gap-1 text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2 py-0.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Calls
//                 </span>
//               </div>
//             </div>
//             <div className="h-52">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="leadFill2" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.18} />
//                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="day" axisLine={false} tickLine={false}
//                     tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                     tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone" dataKey="leads"
//                     stroke="#6366f1" fill="url(#leadFill2)" strokeWidth={2.5}
//                     dot={{ fill: '#fff', stroke: '#6366f1', strokeWidth: 2.5, r: 4 }}
//                     activeDot={{ r: 5.5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
//                   />
//                   <Line
//                     type="monotone" dataKey="calls"
//                     stroke="#7c3aed" strokeWidth={2}
//                     dot={{ r: 3, fill: '#7c3aed' }}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Recent activity */}
//           <div
//             className="dv2-card dv2-fadeinup bg-white rounded-2xl border border-slate-200/80 p-5 flex-1 min-w-[260px]"
//             style={{ animationDelay: '0.22s' }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
//                   <h2 className="text-[14px] font-black text-slate-800">Recent Activity</h2>
//                 </div>
//                 <p className="text-[10px] text-slate-400 ml-4.5">Last 5 updates</p>
//               </div>
//               <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg">
//                 View all <ChevronRight size={12} />
//               </button>
//             </div>
//             <div>
//               {stats.recent_activities.slice(0, 5).map((activity, i) => (
//                 <ActivityItem key={activity.id} activity={activity} index={i} />
//               ))}
//               {stats.recent_activities.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-10 text-center">
//                   <p className="text-[12px] font-bold text-slate-400">No recent activity</p>
//                   <p className="text-[10px] text-slate-300 mt-0.5">Changes will appear here</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>{/* end scrollable body */}
//     </div>
//   );
// };

// export default Dashboard;





import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, TrendingUp, Clock, Phone, Mail, Calendar,
  FileText, ArrowUp, ArrowDown, ChevronRight, Plus, Sparkles,
  LayoutDashboard, Target, Briefcase, Activity, Zap, CheckCircle2,
  AlertTriangle, BarChart2, Package, MessageCircle, BookOpen,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Line, CartesianGrid, Area, AreaChart,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { api } from '../Utils/api';
import type { DashboardStats } from '../Utils/types';

const API_BASE = '/api';

type ActivityItemType = {
  id: number; activity_type: string; summary?: string; created_at: string;
};

/* ─── Animated counter ──────────────────────────────── */
const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string }> = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now(); const duration = 900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
};

/* ─── Custom Tooltip ────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-2.5 shadow-xl" style={{ background:'#1e1b4b', border:'1px solid rgba(99,102,241,0.3)' }}>
      <p className="text-[10px] font-bold text-indigo-300 mb-1 uppercase tracking-wider">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="text-[13px] font-black text-white m-0">{e.value} {e.name || ''}</p>
      ))}
    </div>
  );
};

/* ─── Stat Card ─────────────────────────────────────── */
const StatCard = ({
  title, value, change, icon: Icon, gradient, delay, prefix = '', suffix = '', sub,
}: {
  title: string; value: number; change: number;
  icon: React.ComponentType<{ size?: number }>; gradient: string;
  delay: number; prefix?: string; suffix?: string; sub?: string;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay * 80); return () => clearTimeout(t); }, [delay]);
  const positive = change >= 0;
  return (
    <div className="stat-card relative overflow-hidden rounded-2xl p-5 text-white"
      style={{ background:gradient, boxShadow:'0 4px 20px rgba(0,0,0,0.12)', transition:'all .25s cubic-bezier(0.34,1.2,0.64,1)', opacity: visible ? 1:0, transform: visible ? 'translateY(0)':'translateY(20px)' }}>
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1   top-8  h-12 w-12 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest opacity-75 mb-2">{title}</p>
          <p className="text-[2rem] font-black leading-none tabular-nums mb-1.5">
            {visible ? <AnimatedNumber value={value} prefix={prefix} suffix={suffix} /> : `${prefix}0${suffix}`}
          </p>
          {sub && <p className="text-[11px] opacity-65 font-medium">{sub}</p>}
        </div>
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
      <div className="inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-lg bg-white/15 text-[11px] font-bold">
        {positive ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
        {Math.abs(change)}% vs last month
      </div>
    </div>
  );
};

/* ─── Mini Metric Chip ──────────────────────────────── */
const MiniChip = ({ label, value, bg, border, text }: { label:string; value:string|number; bg:string; border:string; text:string }) => (
  <div className="flex-1 px-3 py-2.5 rounded-xl" style={{ background:bg, border:`1.5px solid ${border}` }}>
    <p className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color:`${text}99` }}>{label}</p>
    <p className="text-[16px] font-black" style={{ color:text }}>{value}</p>
  </div>
);

/* ─── Section Header ────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle, iconBg, iconGlow, action }: {
  icon: React.ComponentType<{size?:number;className?:string}>; title:string; subtitle:string;
  iconBg:string; iconGlow:string; action?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background:iconBg, boxShadow:`0 4px 12px ${iconGlow}` }}>
      <Icon size={17} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-black text-slate-800 leading-tight">{title}</p>
      <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
    </div>
    {action}
  </div>
);

/* ─── Activity Item ─────────────────────────────────── */
const ACTIVITY_CFG: Record<string, { icon:any; bg:string; text:string; accent:string; label:string }> = {
  call:    { icon:Phone,    bg:'#eff6ff', text:'#2563eb', accent:'#3b82f6', label:'Call'    },
  email:   { icon:Mail,     bg:'#faf5ff', text:'#7e22ce', accent:'#8b5cf6', label:'Email'   },
  meeting: { icon:Calendar, bg:'#ecfdf5', text:'#065f46', accent:'#10b981', label:'Meeting' },
  note:    { icon:FileText, bg:'#fffbeb', text:'#b45309', accent:'#f59e0b', label:'Note'    },
};

const ActivityItem = ({ activity, index }: { activity:ActivityItemType; index:number }) => {
  const cfg = ACTIVITY_CFG[activity.activity_type] || ACTIVITY_CFG.note;
  const Icon = cfg.icon;
  const timeStr = new Date(activity.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  return (
    <div className="act-row flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 transition-all"
      style={{ background:'#f8fafc', borderLeft:`3px solid ${cfg.accent}`, border:`1.5px solid #f1f5f9`, borderLeftWidth:'3px', borderLeftColor:cfg.accent }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background:cfg.bg, color:cfg.text }}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background:cfg.bg, color:cfg.text }}>{cfg.label}</span>
        <p className="text-[12px] font-medium text-slate-800 truncate mt-0.5">
          {activity.summary || activity.activity_type}
        </p>
      </div>
      <p className="text-[11px] font-bold text-slate-400 shrink-0">{timeStr}</p>
    </div>
  );
};

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]         = useState<DashboardStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [bdmTargets, setBdmTargets] = useState<any[]>([]);
  const [campaigns, setCampaigns]   = useState<any[]>([]);
  const [tasks, setTasks]           = useState<any[]>([]);
  const [courses, setCourses]       = useState<any[]>([]);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Fetch additional data from models
    Promise.all([
      fetch(`${API_BASE}/bdm-targets/`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/campaign-workspace/`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/tasks/?completed=false`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/courses/`).then(r => r.json()).catch(() => []),
    ]).then(([bdm, camp, tsk, crs]) => {
      setBdmTargets(Array.isArray(bdm) ? bdm : []);
      setCampaigns(Array.isArray(camp) ? camp : []);
      setTasks(Array.isArray(tsk) ? tsk : []);
      setCourses(Array.isArray(crs) ? crs : []);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full"
        style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
        <div className="flex flex-col items-center bg-white rounded-2xl px-14 py-12"
          style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 8px 32px rgba(79,70,229,0.12)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
            <div className="w-6 h-6 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-[15px] font-black text-slate-700 mb-0.5">Loading dashboard</p>
          <p className="text-[12px] text-slate-400 font-medium">Fetching your latest data…</p>
        </div>
      </div>
    );
  }

  /* ── derived values ── */
  const getStatusCount = (status: string) =>
    stats.status_distribution.find(s => s.status === status)?.count || 0;

  const wonCount   = getStatusCount('won');
  const newCount   = getStatusCount('new');
  const lostCount  = getStatusCount('lost');

  const pipelineData = [
    { name:'New',         value:newCount,                      color:'#3b82f6' },
    { name:'Contacted',   value:getStatusCount('contacted'),   color:'#6366f1' },
    { name:'Negotiation', value:getStatusCount('negotiation'), color:'#f59e0b' },
    { name:'Won',         value:wonCount,                      color:'#10b981' },
    { name:'Lost',        value:lostCount,                     color:'#94a3b8' },
  ];

  const weeklyData = [
    { day:'Mon', leads:4,  calls:12 },
    { day:'Tue', leads:7,  calls:18 },
    { day:'Wed', leads:5,  calls:15 },
    { day:'Thu', leads:9,  calls:22 },
    { day:'Fri', leads:6,  calls:17 },
    { day:'Sat', leads:3,  calls:10 },
    { day:'Sun', leads:5,  calls:13 },
  ];

  const pieData = [
    { name:'New',         value:getStatusCount('new'),         color:'#3b82f6' },
    { name:'Contacted',   value:getStatusCount('contacted'),   color:'#6366f1' },
    { name:'Negotiation', value:getStatusCount('negotiation'), color:'#f59e0b' },
    { name:'Won',         value:wonCount,                      color:'#10b981' },
    { name:'Lost',        value:lostCount,                     color:'#94a3b8' },
  ];

  // BDM targets avg progress
  const avgBDMProgress = bdmTargets.length
    ? Math.round(bdmTargets.reduce((a, t) => a + (t.progress || 0), 0) / bdmTargets.length)
    : 0;

  // Campaign status breakdown
  const campDraft   = campaigns.filter(c => c.status === 'draft').length;
  const campReady   = campaigns.filter(c => c.status === 'ready').length;
  const campSent    = campaigns.filter(c => c.status === 'sent').length;
  const campData = [
    { name:'Draft',  value: campDraft || 0,  color:'#94a3b8' },
    { name:'Ready',  value: campReady || 0,  color:'#6366f1' },
    { name:'Sent',   value: campSent  || 0,  color:'#10b981' },
  ];

  // Task priority
  const highTasks   = tasks.filter(t => t.priority === 'high').length;
  const medTasks    = tasks.filter(t => t.priority === 'medium').length;
  const lowTasks    = tasks.filter(t => t.priority === 'low').length;
  const taskData = [
    { name:'High',   value:highTasks, fill:'#ef4444' },
    { name:'Medium', value:medTasks,  fill:'#f59e0b' },
    { name:'Low',    value:lowTasks,  fill:'#10b981' },
  ];

  // Overdue tasks
  const overdueCount = tasks.filter(t => new Date(t.due_date) < new Date() && !t.is_completed).length;

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
        .stat-card { transition:all .25s cubic-bezier(0.34,1.2,0.64,1); }
        .stat-card:hover { transform:translateY(-5px) scale(1.02); box-shadow:0 12px 32px rgba(0,0,0,0.18) !important; }
        .dash-card {
          transition:all .2s cubic-bezier(0.34,1.1,0.64,1);
          border-radius:18px; background:#ffffff;
        }
        .dash-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(79,70,229,0.1),0 2px 8px rgba(0,0,0,0.05) !important; }
        .act-row { transition:all .15s ease; }
        .act-row:hover { transform:translateX(3px); background:#f1f5f9 !important; }
        .progress-bar { transition:width 1s cubic-bezier(0.34,1.1,0.64,1); }
        .btn-add { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
        .btn-add:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 6px 20px rgba(255,255,255,0.25) !important; }
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
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">Sales Performance Hub</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">Track pipeline health, conversions, and daily momentum</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              className="btn-add flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-black transition-all"
              style={{ backgroundColor:'#ffffff', color:'#4f46e5', boxShadow:'0 4px 14px rgba(255,255,255,0.2)' }}
              onClick={() => navigate('/pipeline/new')}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor='#eef2ff'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor='#ffffff'}>
              <Plus size={14} /> Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── ROW 1: 4 Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 f2">
          <StatCard title="Total Revenue"  value={stats.total_value}  change={12.5} icon={DollarSign} gradient="linear-gradient(135deg,#4f46e5,#7c3aed)" delay={0} prefix="₹" sub="total pipeline value" />
          <StatCard title="Total Leads"    value={stats.total_leads}  change={8}    icon={Users}      gradient="linear-gradient(135deg,#0ea5e9,#0284c7)" delay={1} sub="in your CRM" />
          <StatCard title="Win Rate"       value={stats.win_rate}     change={3.2}  icon={TrendingUp} gradient="linear-gradient(135deg,#10b981,#0d9488)" delay={2} suffix="%" sub="conversion rate" />
          <StatCard title="Pending Leads"  value={newCount}           change={-2}   icon={Clock}      gradient="linear-gradient(135deg,#f59e0b,#f97316)" delay={3} sub="awaiting contact" />
        </div>

        {/* ── ROW 2: Quick Status Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 f2">
          {[
            { label:'BDM Targets',     value:bdmTargets.length,    icon:Target,      bg:'#eef2ff', border:'#c7d2fe', text:'#4338ca', glow:'rgba(79,70,229,0.2)',   grad:'linear-gradient(135deg,#4f46e5,#7c3aed)' },
            { label:'Campaigns',       value:campaigns.length,     icon:Zap,         bg:'#ecfdf5', border:'#a7f3d0', text:'#065f46', glow:'rgba(16,185,129,0.2)',  grad:'linear-gradient(135deg,#10b981,#0d9488)' },
            { label:'Open Tasks',      value:tasks.length,         icon:CheckCircle2,bg:'#fffbeb', border:'#fde68a', text:'#b45309', glow:'rgba(245,158,11,0.2)',  grad:'linear-gradient(135deg,#f59e0b,#f97316)' },
            { label:'Overdue Tasks',   value:overdueCount,         icon:AlertTriangle,bg:'#fff1f2',border:'#fecdd3', text:'#be123c', glow:'rgba(239,68,68,0.2)',   grad:'linear-gradient(135deg,#ef4444,#f43f5e)' },
          ].map(item => (
            <div key={item.label} className="dash-card flex items-center gap-4 px-5 py-4"
              style={{ border:`1.5px solid ${item.border}`, boxShadow:`0 4px 16px ${item.glow},0 1px 4px rgba(0,0,0,0.04)` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:item.grad, boxShadow:`0 4px 12px ${item.glow}` }}>
                <item.icon size={17} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider" style={{ color:`${item.text}99` }}>{item.label}</p>
                <p className="text-[22px] font-black leading-tight" style={{ color:item.text }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROW 3: Pipeline Bar + Conversion Donut ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 f3">

          {/* Pipeline by Stage — 2/3 width */}
          <div className="dash-card lg:col-span-2 p-5"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={BarChart2} title="Pipeline by Stage" subtitle="Lead distribution across pipeline"
              iconBg="linear-gradient(135deg,#4f46e5,#7c3aed)" iconGlow="rgba(79,70,229,0.35)"
              action={<span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background:'#eef2ff', color:'#4338ca', border:'1px solid #c7d2fe' }}>This Month</span>} />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} barCategoryGap="35%" margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'#64748b', fontSize:11, fontWeight:600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#94a3b8', fontSize:10 }} width={28} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(99,102,241,0.04)', radius:6 } as any} />
                  <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={48}>
                    {pipelineData.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 pt-3" style={{ borderTop:'1px solid #f1f5f9' }}>
              {pipelineData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background:item.color, boxShadow:`0 0 5px ${item.color}88` }} />
                  <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
                  <span className="text-[12px] font-black text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Donut — 1/3 width */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #cffafe', boxShadow:'0 4px 20px rgba(6,182,212,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={Activity} title="Conversion Snapshot" subtitle="Leads by current status"
              iconBg="linear-gradient(135deg,#06b6d4,#0284c7)" iconGlow="rgba(6,182,212,0.35)" />
            <div className="h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={68}
                    stroke="none" startAngle={90} endAngle={-270} cornerRadius={4}>
                    {pieData.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[26px] font-black text-slate-900 leading-none">{stats.win_rate}%</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Win Rate</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 pt-3" style={{ borderTop:'1px solid #f1f5f9' }}>
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background:item.color }} />
                    <span className="text-[12px] text-slate-500 font-medium">{item.name}</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 4: Area Chart + BDM Targets Progress ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 f4">

          {/* Weekly Leads vs Calls area */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #fce7f3', boxShadow:'0 4px 20px rgba(236,72,153,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={TrendingUp} title="Weekly Leads vs Calls" subtitle="Activity volume per day"
              iconBg="linear-gradient(135deg,#ec4899,#f43f5e)" iconGlow="rgba(236,72,153,0.35)"
              action={
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'#eef2ff', color:'#4338ca', border:'1px solid #c7d2fe' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Leads
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'#faf5ff', color:'#7e22ce', border:'1px solid #ddd6fe' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Calls
                  </span>
                </div>
              } />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top:4, right:8, left:-24, bottom:0 }}>
                  <defs>
                    <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill:'#64748b', fontSize:11, fontWeight:600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#94a3b8', fontSize:10 }} width={28} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" fill="url(#leadFill)" strokeWidth={2.5}
                    dot={{ fill:'#fff', stroke:'#6366f1', strokeWidth:2.5, r:4 }}
                    activeDot={{ r:5.5, fill:'#6366f1', stroke:'#fff', strokeWidth:2 }} />
                  <Line type="monotone" dataKey="calls" stroke="#7c3aed" strokeWidth={2}
                    dot={{ r:3, fill:'#7c3aed' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BDM Targets Progress */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #d1fae5', boxShadow:'0 4px 20px rgba(16,185,129,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={Target} title="BDM Targets Progress" subtitle={`${bdmTargets.length} active plans · avg ${avgBDMProgress}%`}
              iconBg="linear-gradient(135deg,#10b981,#0d9488)" iconGlow="rgba(16,185,129,0.35)"
              action={<span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0' }}>{avgBDMProgress}% avg</span>} />

            {bdmTargets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background:'linear-gradient(145deg,#f1f5f9,#e2e8f0)', border:'1.5px dashed #cbd5e1' }}>
                  <Target size={20} className="text-slate-300" />
                </div>
                <p className="text-[13px] font-black text-slate-400">No targets set yet</p>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Create your first BDM target plan</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-56 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {bdmTargets.slice(0, 5).map((t: any) => {
                  const progress = t.progress || 0;
                  const isGood   = progress >= 70;
                  const color    = progress >= 100 ? '#10b981' : progress >= 50 ? '#6366f1' : '#f59e0b';
                  return (
                    <div key={t.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[13px] font-black text-slate-700 truncate flex-1 mr-3">{t.name}</p>
                        <span className="text-[12px] font-black shrink-0" style={{ color }}>{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background:'#f1f5f9' }}>
                        <div className="h-full rounded-full progress-bar"
                          style={{ width:`${Math.min(progress,100)}%`, background:color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── ROW 5: Campaign Status + Task Priority + Activity ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 f5">

          {/* Campaign Workspace Status pie */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #ede9fe', boxShadow:'0 4px 20px rgba(124,58,237,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={Zap} title="Campaigns" subtitle={`${campaigns.length} total workspaces`}
              iconBg="linear-gradient(135deg,#7c3aed,#9333ea)" iconGlow="rgba(124,58,237,0.35)" />
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Zap size={24} className="text-slate-200 mb-2" />
                <p className="text-[12px] font-black text-slate-400">No campaigns yet</p>
              </div>
            ) : (
              <>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={campData} dataKey="value" innerRadius={38} outerRadius={54}
                        stroke="none" startAngle={90} endAngle={-270} cornerRadius={4}>
                        {campData.map(e => <Cell key={e.name} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {campData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background:item.color }} />
                        <span className="text-[12px] text-slate-500 font-medium">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-black text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Task Priority breakdown */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #fef3c7', boxShadow:'0 4px 20px rgba(245,158,11,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={CheckCircle2} title="Task Priority" subtitle={`${tasks.length} open · ${overdueCount} overdue`}
              iconBg="linear-gradient(135deg,#f59e0b,#f97316)" iconGlow="rgba(245,158,11,0.35)"
              action={overdueCount > 0
                ? <span className="text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse" style={{ background:'#fff1f2', color:'#be123c', border:'1px solid #fecdd3' }}>
                    {overdueCount} overdue
                  </span>
                : undefined} />
            <div className="space-y-3 mt-2">
              {taskData.map(item => {
                const total = tasks.length || 1;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background:item.fill }} />
                        <span className="text-[12px] font-black text-slate-600">{item.name} Priority</span>
                      </div>
                      <span className="text-[12px] font-black text-slate-700">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:'#f1f5f9' }}>
                      <div className="h-full rounded-full progress-bar" style={{ width:`${pct}%`, background:item.fill }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini chips */}
            <div className="flex gap-2 mt-4">
              <MiniChip label="Courses"  value={courses.length} bg="#eef2ff" border="#c7d2fe" text="#4338ca" />
              <MiniChip label="Won Leads" value={wonCount}      bg="#ecfdf5" border="#a7f3d0" text="#065f46" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dash-card p-5"
            style={{ border:'1.5px solid #fef3c7', boxShadow:'0 4px 20px rgba(245,158,11,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
            <SectionHeader icon={Activity} title="Recent Activity" subtitle={`Last ${Math.min(stats.recent_activities.length, 5)} updates`}
              iconBg="linear-gradient(135deg,#f59e0b,#f97316)" iconGlow="rgba(245,158,11,0.35)"
              action={
                <button className="flex items-center gap-1 text-[11px] font-black text-indigo-600 px-2.5 py-1 rounded-lg transition-all"
                  style={{ background:'#eef2ff', border:'1px solid #c7d2fe' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#e0e7ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#eef2ff'; }}>
                  View all <ChevronRight size={12} />
                </button>
              } />
            <div className="overflow-y-auto max-h-64 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {stats.recent_activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity size={24} className="text-slate-200 mb-2" />
                  <p className="text-[12px] font-black text-slate-400">No recent activity</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-0.5">Changes will appear here</p>
                </div>
              ) : (
                stats.recent_activities.slice(0, 6).map((activity, i) => (
                  <ActivityItem key={activity.id} activity={activity} index={i} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pb-4" />
      </div>
    </div>
  );
};

export default Dashboard;
