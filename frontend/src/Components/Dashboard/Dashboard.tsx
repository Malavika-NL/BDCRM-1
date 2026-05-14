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

/* ─── Chart palette (indigo/pink/cyan/emerald — mirrors Pipeline STATUS_CONFIG) ─── */
const CHART_COLORS = {
  bar:  ['#6366f1', '#ec4899', '#06b6d4', '#10b981'],
  pie:  ['#6366f1', '#e2e8f0'],
  line: '#6366f1',
  grid: '#f1f5f9',
};

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

/* ─── Inject animation keyframes once ─── */
const injectGlobalStyles = () => {
  const id = 'dash-pipeline-styles';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes slideIn {
      from { opacity:0; transform:translateX(-6px); }
      to   { opacity:1; transform:translateX(0);    }
    }
    @keyframes spin { to { transform:rotate(360deg); } }
    .dash-fadeinup { animation: fadeInUp 0.4s ease both; }
    .dash-slidein  { animation: slideIn  0.3s ease both; }
    .stat-card { transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1); cursor:pointer; }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -4px rgba(0,0,0,0.12); }
    .dash-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .dash-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -4px rgba(0,0,0,0.1); }
    .activity-item { transition: background 0.15s ease, transform 0.15s ease; cursor:pointer; }
    .activity-item:hover { background: #f1f5f9 !important; transform: translateX(3px); }
  `;
  document.head.appendChild(s);
};

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 rounded-xl px-4 py-2.5 shadow-xl">
      <p className="text-[11px] font-medium text-slate-400 mb-1">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="text-[14px] font-bold text-white m-0">{e.value} {e.name || 'leads'}</p>
      ))}
    </div>
  );
};

/* ─── Rounded bar shape ─── */
const RoundedBar = (props: any) => {
  const { x, y, width, height, index } = props;
  return (
    <rect x={x} y={y} width={width} height={height}
      fill={CHART_COLORS.bar[index % CHART_COLORS.bar.length]}
      rx={5} ry={5}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
    />
  );
};

/* ═══════════════ STAT CARD ═══════════════ */
const STAT_GRADIENTS: Record<string, { from: string; to: string; shadow: string }> = {
  revenue: { from: '#667eea', to: '#764ba2', shadow: 'rgba(102,126,234,0.35)' },
  leads:   { from: '#f093fb', to: '#f5576c', shadow: 'rgba(240,147,251,0.35)' },
  winRate: { from: '#4facfe', to: '#00f2fe', shadow: 'rgba(79,172,254,0.35)' },
  pending: { from: '#43e97b', to: '#38f9d7', shadow: 'rgba(67,233,123,0.35)' },
};

const StatCard = ({ title, value, change, icon: Icon, gradientKey, delay }: {
  title: string; value: string | number; change: number;
  icon: any; gradientKey: string; delay: number;
}) => {
  const g = STAT_GRADIENTS[gradientKey];
  const positive = change >= 0;
  return (
    <div className="stat-card bg-white rounded-xl border border-slate-200 overflow-hidden dash-fadeinup"
      style={{ animationDelay: `${delay * 0.08}s` }}>
      {/* top accent bar */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
            <p className="text-[28px] font-bold text-slate-900 leading-none tracking-tight">{value}</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: `0 4px 12px ${g.shadow}` }}>
            <Icon size={18} color="#fff" strokeWidth={2} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {positive ? <ArrowUp size={10} strokeWidth={2.5} /> : <ArrowDown size={10} strokeWidth={2.5} />}
            {Math.abs(change)}%
          </span>
          <span className="text-[10px] text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ ACTIVITY ITEM ═══════════════ */
const ACTIVITY_CFG: Record<string, { icon: any; bg: string; text: string; accent: string; label: string }> = {
  call:    { icon: Phone,    bg: 'bg-blue-50',    text: 'text-blue-600',    accent: '#3b82f6', label: 'Call'    },
  email:   { icon: Mail,     bg: 'bg-violet-50',  text: 'text-violet-600',  accent: '#8b5cf6', label: 'Email'   },
  meeting: { icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600', accent: '#10b981', label: 'Meeting' },
  note:    { icon: FileText, bg: 'bg-amber-50',   text: 'text-amber-600',   accent: '#f59e0b', label: 'Note'    },
};

const ActivityItem = ({ activity, index }: { activity: any; index: number }) => {
  const cfg = ACTIVITY_CFG[activity.activity_type] || ACTIVITY_CFG.note;
  const IconComp = cfg.icon;
  const timeStr = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(activity.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });
  return (
    <div className="activity-item flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50/80 mb-1.5 dash-slidein"
      style={{ animationDelay: `${index * 0.05}s`, borderLeft: `3px solid ${cfg.accent}` }}>
      <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0`}>
        <IconComp size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
        <p className="text-[12px] font-medium text-slate-800 truncate mt-0.5">
          {activity.summary || activity.activity_type}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] font-semibold text-slate-700">{timeStr}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{dateStr}</p>
      </div>
      <ChevronRight size={13} className="text-slate-300 shrink-0" />
    </div>
  );
};

/* ═══════════════ LOADING STATE ═══════════════ */
const LoadingState = () => (
  <div className="flex items-center justify-center h-full bg-[#f4f6fb]">
    <div className="flex flex-col items-center bg-white rounded-2xl px-14 py-12 border border-slate-200 shadow-lg">
      <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-indigo-500 mb-4"
        style={{ animation: 'spin 0.8s linear infinite' }} />
      <p className="text-[14px] font-bold text-slate-700 mb-0.5">Loading dashboard</p>
      <p className="text-[11px] text-slate-400">Fetching your latest data…</p>
    </div>
  </div>
);

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
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
    { name: 'Won',         value: getStatusCount('won'),                                   color: CHART_COLORS.pie[0] },
    { name: 'In Progress', value: Math.max(0, stats.total_leads - getStatusCount('won')),  color: CHART_COLORS.pie[1] },
  ];

  const totalWeeklyLeads = weeklyData.reduce((s, d) => s + d.leads, 0);
  const peakDay = weeklyData.reduce((mx, d) => d.leads > mx.leads ? d : mx, weeklyData[0]);

  return (
    <div className="flex flex-col h-full bg-[#f4f6fb] overflow-hidden">

      {/* ══ BANNER (matches Pipeline header exactly) ══ */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <LayoutDashboard className="text-white" size={15} />
        </div>
        <div className="flex-1">
          <h1 className="text-[16px] font-bold text-white leading-tight">Dashboard</h1>
          <p className="text-[11px] text-indigo-200 mt-0.5 flex items-center gap-1.5">
            <Calendar size={10} />{today}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <RefreshCw size={14} />
          </button>
          <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors">
            <Download size={13} /> Export
          </button>
          <button className="relative p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full" />
          </button>
          <button className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors shadow-sm">
            <Plus size={13} /> Add Lead
          </button>
        </div>
      </div>

      {/* ══ TOOLBAR (mirrors Pipeline toolbar) ══ */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text" placeholder="Search leads, contacts…"
            className="w-56 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[12px] outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* ══ INSIGHTS BAR ══ */}
      <div className="bg-indigo-50/60 border-b border-indigo-100 px-5 py-2 flex items-center gap-4 flex-wrap shrink-0">
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-amber-500" />
          <span className="text-[11px] text-slate-600"><strong className="text-slate-800 font-bold">3 leads</strong> need follow-up today</span>
        </div>
        <span className="w-px h-3.5 bg-indigo-200" />
        <div className="flex items-center gap-1.5">
          <Target size={12} className="text-emerald-500" />
          <span className="text-[11px] text-slate-600">Monthly target: <strong className="text-emerald-700 font-bold">78%</strong> achieved</span>
        </div>
        <span className="w-px h-3.5 bg-indigo-200" />
        <div className="flex items-center gap-1.5">
          <Award size={12} className="text-indigo-500" />
          <span className="text-[11px] text-slate-600">Win rate is <strong className="text-indigo-700 font-bold">up 3.2%</strong> this month</span>
        </div>
      </div>

      {/* ══ SCROLLABLE BODY ══ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total Revenue" value={`$${stats.total_value.toLocaleString()}`} change={12.5} icon={DollarSign} gradientKey="revenue" delay={0} />
          <StatCard title="Total Leads"   value={stats.total_leads}                         change={8}    icon={Users}       gradientKey="leads"   delay={1} />
          <StatCard title="Win Rate"      value={`${stats.win_rate}%`}                      change={3.2}  icon={TrendingUp}  gradientKey="winRate" delay={2} />
          <StatCard title="Pending"       value={getStatusCount('new')}                     change={-2}   icon={Clock}       gradientKey="pending" delay={3} />
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">

          {/* Pipeline bar chart */}
          <div className="dash-card bg-white rounded-xl border border-slate-200 p-4 flex-[2] min-w-[300px] dash-fadeinup" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <h3 className="text-[13px] font-bold text-slate-800">Pipeline Overview</h3>
                </div>
                <p className="text-[10px] text-slate-400 ml-4">Lead distribution by stage</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">This Month</span>
                <button className="p-1 hover:bg-slate-100 rounded-md transition-colors"><MoreHorizontal size={14} className="text-slate-400" /></button>
              </div>
            </div>

            <div className="mt-3">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={pipelineData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 } as any} />
                  <Bar dataKey="value" shape={<RoundedBar />} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-100">
              {pipelineData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS.bar[i] }} />
                  <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
                  <span className="text-[11px] font-bold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Win-rate donut */}
          <div className="dash-card bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[240px] dash-fadeinup" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <h3 className="text-[13px] font-bold text-slate-800">Win Rate</h3>
            </div>
            <p className="text-[10px] text-slate-400 ml-4 mb-3">Closed vs open leads</p>

            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={56} outerRadius={74}
                    dataKey="value" stroke="none" startAngle={90} endAngle={-270} cornerRadius={4}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{stats.win_rate}%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Won</p>
              </div>
            </div>

            <div className="flex justify-center gap-5 mt-3 pt-3 border-t border-slate-100">
              {pieData.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">{p.name}</p>
                    <p className="text-[12px] font-bold text-slate-700">{p.value} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">

          {/* Weekly area chart */}
          <div className="dash-card bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[300px] dash-fadeinup" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <h3 className="text-[13px] font-bold text-slate-800">Weekly Leads</h3>
                </div>
                <p className="text-[10px] text-slate-400 ml-4">New leads added each day</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Activity size={10} /> Total: <strong>{totalWeeklyLeads}</strong>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <TrendingUp size={10} /> Peak: {peakDay.day}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.line} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={CHART_COLORS.line} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke={CHART_COLORS.line} strokeWidth={2.5}
                    fill="url(#leadsGrad)"
                    dot={{ fill: '#fff', stroke: CHART_COLORS.line, strokeWidth: 2.5, r: 4 }}
                    activeDot={{ r: 5.5, fill: CHART_COLORS.line, stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Day pills */}
            <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-100 flex-wrap">
              {weeklyData.map(d => {
                const isPeak = d.day === peakDay.day;
                return (
                  <div key={d.day} className={`flex-1 min-w-[36px] flex flex-col items-center py-1.5 rounded-md border ${
                    isPeak ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${isPeak ? 'text-indigo-600' : 'text-slate-500'}`}>{d.day}</span>
                    <span className={`text-[13px] font-bold mt-0.5 ${isPeak ? 'text-indigo-700' : 'text-slate-800'}`}>{d.leads}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="dash-card bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[280px] dash-fadeinup" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h3 className="text-[13px] font-bold text-slate-800">Recent Activity</h3>
                </div>
                <p className="text-[10px] text-slate-400 ml-4">Latest interactions &amp; updates</p>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>

            <div>
              {stats.recent_activities.slice(0, 5).map((a, i) => (
                <ActivityItem key={a.id} activity={a} index={i} />
              ))}
              {stats.recent_activities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Activity size={24} className="text-slate-200 mb-2" />
                  <p className="text-[12px] font-bold text-slate-400">No recent activity</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">Changes will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>{/* end scrollable body */}
    </div>
  );
};

export default Dashboard;