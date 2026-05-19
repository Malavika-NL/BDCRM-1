// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Plus, Search, Building2, Columns3, List, LayoutGrid,
//   RefreshCw, Briefcase, ChevronDown, Check,
//   Zap, Phone, MessageSquare, CheckCircle2, XCircle,
//   BarChart3, X, TrendingUp, DollarSign, Target,
//   Clock, ArrowUpRight, SlidersHorizontal,
//   Activity, Calendar, Tag
// } from 'lucide-react';
// import { STATUS_LABELS, type Lead, STATUS_ORDER, type LeadStatus } from '../Utils/types';
// import { api } from '../Utils/api';
// import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';

// /* ─── STATUS CONFIG ──────────────────────────────────── */
// const STATUS_CONFIG: Record<string, {
//   color: string; bg: string; text: string;
//   icon: React.ReactNode; gradient: string; hex: string;
// }> = {
//   new:         { color: 'bg-blue-500',    bg: 'bg-blue-100',    text: 'text-blue-700',    icon: <Zap size={14} />,          gradient: 'from-blue-500 to-blue-600',      hex: '#3b82f6' },
//   contacted:   { color: 'bg-indigo-500',  bg: 'bg-indigo-100',  text: 'text-indigo-700',  icon: <Phone size={14} />,        gradient: 'from-indigo-500 to-indigo-600',  hex: '#6366f1' },
//   negotiation: { color: 'bg-amber-500',   bg: 'bg-amber-100',   text: 'text-amber-700',   icon: <MessageSquare size={14} />,gradient: 'from-amber-500 to-amber-600',    hex: '#f59e0b' },
//   won:         { color: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 size={14} />, gradient: 'from-emerald-500 to-emerald-600',hex: '#10b981' },
//   lost:        { color: 'bg-gray-400',    bg: 'bg-gray-100',    text: 'text-gray-600',    icon: <XCircle size={14} />,      gradient: 'from-gray-400 to-gray-500',      hex: '#9ca3af' },
// };
// const getCfg = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.new;

// /* ─── ACTIVITY HELPERS ───────────────────────────────── */
// type ActivityEntry = { id: number; leadId: number; action: string; from?: string; to?: string; ts: number };

// const timeAgo = (ts: number) => {
//   const s = Math.floor((Date.now() - ts) / 1000);
//   if (s < 60) return 'just now';
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// };

// // Helper to format backend activities for the sidebar
// const formatBackendActivity = (a: any): ActivityEntry => {
//   let action = a.summary || a.activity_type;
//   let from, to;

//   // Detect status change to render the custom colored badges in the UI
//   if (a.summary && a.summary.includes('Stage updated:')) {
//     const parts = a.summary.replace('Stage updated: ', '').split(' → ');
//     if (parts.length === 2) {
//       from = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[0]);
//       to = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[1]);
//       if (from && to) {
//         action = 'status_change';
//       }
//     }
//   }

//   return {
//     id: a.id,
//     leadId: a.lead,
//     action,
//     from,
//     to,
//     ts: new Date(a.created_at).getTime()
//   };
// };

// /* ─── ANALYTICS PANEL ────────────────────────────────── */
// const AnalyticsPanel = ({ leads, onClose }: { leads: Lead[]; onClose: () => void }) => {
//   const total = leads.length || 1;
//   const totalVal = leads.reduce((a, l) => a + parseFloat(l.value), 0);
//   const wonLeads = leads.filter(l => l.status === 'won');
//   const wonVal = wonLeads.reduce((a, l) => a + parseFloat(l.value), 0);
//   const winRate = Math.round((wonLeads.length / total) * 100);
//   const avgDeal = totalVal / total;

//   return (
//     <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//         <div className="flex items-center gap-2">
//           <BarChart3 size={16} className="text-blue-600" />
//           <span className="font-semibold text-gray-900 text-sm">Analytics</span>
//         </div>
//         <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
//           <X size={16} />
//         </button>
//       </div>

//       <div className="p-5 space-y-5">
//         {/* KPI Cards */}
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { label: 'Total Deals', value: leads.length, icon: <Briefcase size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' },
//             { label: 'Win Rate', value: `${winRate}%`, icon: <Target size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//             { label: 'Pipeline', value: `$${(totalVal / 1000).toFixed(0)}k`, icon: <DollarSign size={14} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
//             { label: 'Avg Deal', value: `$${(avgDeal / 1000).toFixed(0)}k`, icon: <TrendingUp size={14} />, color: 'text-amber-600', bg: 'bg-amber-50' },
//           ].map(k => (
//             <div key={k.label} className="bg-gray-50 rounded-xl p-3">
//               <div className={`w-7 h-7 rounded-lg ${k.bg} ${k.color} flex items-center justify-center mb-2`}>{k.icon}</div>
//               <p className="text-xs text-gray-500 mb-0.5">{k.label}</p>
//               <p className="text-lg font-bold text-gray-900">{k.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Stage Breakdown */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stage Breakdown</p>
//           <div className="space-y-2.5">
//             {STATUS_ORDER.map(status => {
//               const count = leads.filter(l => l.status === status).length;
//               const val = leads.filter(l => l.status === status).reduce((a, l) => a + parseFloat(l.value), 0);
//               const pct = Math.round((count / total) * 100);
//               const cfg = getCfg(status);
//               return (
//                 <div key={status}>
//                   <div className="flex items-center justify-between mb-1">
//                     <div className="flex items-center gap-1.5">
//                       <span className={`${cfg.color} w-2 h-2 rounded-full inline-block`} />
//                       <span className="text-xs font-medium text-gray-700">{STATUS_LABELS[status]}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-gray-400">{count} deals</span>
//                       <span className="text-xs font-semibold text-gray-700">${(val / 1000).toFixed(0)}k</span>
//                     </div>
//                   </div>
//                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div className={`h-full ${cfg.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Won vs Lost */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Won vs Lost Value</p>
//           <div className="flex gap-2">
//             <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
//               <p className="text-xs text-emerald-600 font-medium mb-1">Won</p>
//               <p className="text-base font-bold text-emerald-700">${(wonVal / 1000).toFixed(0)}k</p>
//               <p className="text-xs text-emerald-500">{wonLeads.length} deals</p>
//             </div>
//             <div className="flex-1 bg-red-50 rounded-xl p-3 border border-red-100">
//               <p className="text-xs text-red-500 font-medium mb-1">Lost</p>
//               <p className="text-base font-bold text-red-600">
//                 ${(leads.filter(l => l.status === 'lost').reduce((a, l) => a + parseFloat(l.value), 0) / 1000).toFixed(0)}k
//               </p>
//               <p className="text-xs text-red-400">{leads.filter(l => l.status === 'lost').length} deals</p>
//             </div>
//           </div>
//         </div>

//         {/* Top deals */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Deals by Value</p>
//           <div className="space-y-2">
//             {[...leads].sort((a, b) => parseFloat(b.value) - parseFloat(a.value)).slice(0, 4).map(lead => {
//               const cfg = getCfg(lead.status);
//               return (
//                 <div key={lead.id} className="flex items-center gap-2.5">
//                   <div className={`w-7 h-7 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-xs font-bold shrink-0`}>
//                     {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-medium text-gray-900 truncate">{lead.name}</p>
//                     <p className="text-[10px] text-gray-400 truncate">{lead.company}</p>
//                   </div>
//                   <span className="text-xs font-bold text-gray-700 shrink-0">${parseFloat(lead.value).toLocaleString()}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── ACTIVITY FEED ──────────────────────────────────── */
// const ActivityFeed = ({ activities, leads, onClose }: {
//   activities: ActivityEntry[]; leads: Lead[]; onClose: () => void;
// }) => {
//   const getName = (id: number) => leads.find(l => l.id === id)?.name ?? 'Unknown';
//   return (
//     <div className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
//       <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//         <div className="flex items-center gap-2">
//           <Activity size={16} className="text-indigo-600" />
//           <span className="font-semibold text-gray-900 text-sm">Activity</span>
//           {activities.length > 0 && (
//             <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">{activities.length}</span>
//           )}
//         </div>
//         <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
//           <X size={16} />
//         </button>
//       </div>

//       <div className="flex-1 p-4">
//         {activities.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <Activity size={32} className="text-gray-200 mb-3" />
//             <p className="text-sm font-medium text-gray-400">No activity yet</p>
//             <p className="text-xs text-gray-300 mt-1">Changes will appear here</p>
//           </div>
//         ) : (
//           <div className="relative">
//             <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-100" />
//             <div className="space-y-4">
//               {/* Note: the backend handles sorting by -created_at, so no need to reverse */}
//               {activities.map(a => {
//                 const fromCfg = a.from ? getCfg(a.from) : null;
//                 const toCfg = a.to ? getCfg(a.to) : null;
//                 return (
//                   <div key={a.id} className="flex gap-3 relative">
//                     <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center shrink-0 z-10">
//                       <ArrowUpRight size={10} className="text-indigo-600" />
//                     </div>
//                     <div className="flex-1 min-w-0 pt-0.5">
//                       <p className="text-xs font-semibold text-gray-800 truncate">{getName(a.leadId)}</p>
//                       {a.action === 'status_change' && fromCfg && toCfg ? (
//                         <div className="flex items-center gap-1 mt-1 flex-wrap">
//                           <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${fromCfg.bg} ${fromCfg.text}`}>
//                             {STATUS_LABELS[a.from as LeadStatus]}
//                           </span>
//                           <span className="text-[10px] text-gray-400">→</span>
//                           <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${toCfg.bg} ${toCfg.text}`}>
//                             {STATUS_LABELS[a.to as LeadStatus]}
//                           </span>
//                         </div>
//                       ) : (
//                         <p className="text-[10px] text-gray-500 mt-0.5">{a.action}</p>
//                       )}
//                       <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
//                         <Clock size={8} />{timeAgo(a.ts)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ─── STATUS DROPDOWN ────────────────────────────────── */
// const StatusDropdown = ({ currentStatus, leadId, onChangeStatus }: {
//   currentStatus: LeadStatus; leadId: number;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const config = getCfg(currentStatus);
//   return (
//     <div className="relative">
//       <button
//         onClick={e => { e.stopPropagation(); setIsOpen(o => !o); }}
//         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.text} hover:opacity-80 transition-all`}
//       >
//         {config.icon}
//         {STATUS_LABELS[currentStatus]}
//         <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
//           <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
//             <div className="px-3 py-2 border-b border-gray-100">
//               <p className="text-xs font-semibold text-gray-400 uppercase">Change to</p>
//             </div>
//             {STATUS_ORDER.map(status => {
//               const sc = getCfg(status);
//               const isActive = status === currentStatus;
//               return (
//                 <button key={status}
//                   onClick={e => { e.stopPropagation(); onChangeStatus(leadId, status); setIsOpen(false); }}
//                   disabled={isActive}
//                   className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <div className={`w-7 h-7 rounded-lg ${sc.bg} ${sc.text} flex items-center justify-center`}>{sc.icon}</div>
//                   <span className="text-sm font-medium text-gray-700">{STATUS_LABELS[status]}</span>
//                   {isActive && <Check size={14} className="ml-auto text-green-500" />}
//                 </button>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// /* ─── FILTER BAR ─────────────────────────────────────── */
// type Filters = { status: LeadStatus | ''; minValue: string; maxValue: string; sortBy: string };
// const FilterBar = ({ filters, onChange, onReset, leads }: {
//   filters: Filters; onChange: (f: Partial<Filters>) => void;
//   onReset: () => void; leads: Lead[];
// }) => {
//   const active = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
//   return (
//     <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 border-b border-blue-100">
//       <Filter size={14} className="text-blue-500 shrink-0" />
//       <span className="text-xs font-semibold text-blue-600 mr-1">Filters</span>

//       {/* Status filter */}
//       <select
//         value={filters.status}
//         onChange={e => onChange({ status: e.target.value as LeadStatus | '' })}
//         className="text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-blue-400"
//       >
//         <option value="">All Stages</option>
//         {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
//       </select>

//       {/* Min value */}
//       <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-1.5">
//         <DollarSign size={11} className="text-gray-400" />
//         <input
//           type="number" placeholder="Min value"
//           value={filters.minValue}
//           onChange={e => onChange({ minValue: e.target.value })}
//           className="w-20 text-xs outline-none text-gray-700"
//         />
//       </div>

//       {/* Max value */}
//       <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-1.5">
//         <DollarSign size={11} className="text-gray-400" />
//         <input
//           type="number" placeholder="Max value"
//           value={filters.maxValue}
//           onChange={e => onChange({ maxValue: e.target.value })}
//           className="w-20 text-xs outline-none text-gray-700"
//         />
//       </div>

//       {/* Sort */}
//       <select
//         value={filters.sortBy}
//         onChange={e => onChange({ sortBy: e.target.value })}
//         className="text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-blue-400"
//       >
//         <option value="newest">Newest first</option>
//         <option value="oldest">Oldest first</option>
//         <option value="value_high">Value: High → Low</option>
//         <option value="value_low">Value: Low → High</option>
//         <option value="name">Name A–Z</option>
//       </select>

//       <span className="text-xs text-blue-500 font-medium ml-1">{leads.length} result{leads.length !== 1 ? 's' : ''}</span>

//       {active && (
//         <button onClick={onReset} className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
//           <X size={12} />Reset
//         </button>
//       )}
//     </div>
//   );
// };

// /* ─── LEAD CARD (with drag) ──────────────────────────── */
// const LeadCard = ({ lead, onSelect, onChangeStatus, onDragStart }: {
//   lead: Lead; onSelect: () => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
//   onDragStart?: (e: React.DragEvent, lead: Lead) => void;
// }) => {
//   const cfg = getCfg(lead.status);
//   const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//   return (
//     <div
//       draggable
//       onDragStart={e => onDragStart?.(e, lead)}
//       onClick={onSelect}
//       className="bg-white rounded-xl border border-blue-100 p-3 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-blue-300 transition-all duration-200 select-none hover:-translate-y-0.5"
//     >
//       <div className="flex items-start gap-3 mb-3">
//         <div className={`w-10 h-10 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-sm font-bold shrink-0`}>
//           {initials}
//         </div>
//         <div className="min-w-0 flex-1">
//           <h4 className="font-semibold text-gray-900 text-sm truncate">{lead.name}</h4>
//           <p className="text-xs text-gray-500 truncate flex items-center gap-1">
//             <Building2 size={10} />{lead.company}
//           </p>
//         </div>
//       </div>
//       <div className="mb-3" onClick={e => e.stopPropagation()}>
//         <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//       </div>
//       <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//         <span className="text-sm font-bold text-gray-900">${parseFloat(lead.value).toLocaleString()}</span>
//         <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</span>
//       </div>
//     </div>
//   );
// };

// /* ─── BOARD VIEW (drag & drop) ───────────────────────── */
// const BoardView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => {
//   const [dragOver, setDragOver] = useState<string | null>(null);
//   const dragLead = useRef<Lead | null>(null);

//   const handleDragStart = (e: React.DragEvent, lead: Lead) => {
//     dragLead.current = lead;
//     e.dataTransfer.effectAllowed = 'move';
//   };
//   const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
//     e.preventDefault();
//     if (dragLead.current && dragLead.current.status !== status) {
//       onChangeStatus(dragLead.current.id, status);
//     }
//     dragLead.current = null;
//     setDragOver(null);
//   };

//   return (
//     <div className="flex h-full overflow-x-auto p-4 gap-4 custom-scrollbar">
//       {STATUS_ORDER.map(status => {
//         const statusLeads = leads.filter(l => l.status === status);
//         const cfg = getCfg(status);
//         const isOver = dragOver === status;
//         const colTotal = statusLeads.reduce((a, l) => a + parseFloat(l.value), 0);

//         return (
//           <div key={status}
//             onDragOver={e => { e.preventDefault(); setDragOver(status); }}
//             onDragLeave={() => setDragOver(null)}
//             onDrop={e => handleDrop(e, status as LeadStatus)}
//             className={`flex flex-col w-[300px] rounded-2xl shrink-0 h-full transition-all duration-150 border ${isOver ? 'bg-blue-50 ring-2 ring-blue-300 ring-offset-1 border-blue-300' : 'bg-white/80 border-blue-100'}`}
//           >
//             {/* Column header */}
//             <div className="p-3 border-b border-blue-100 bg-white/80 backdrop-blur-sm rounded-t-2xl">
//               <div className="flex items-center gap-2">
//                 <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white`}>
//                   {cfg.icon}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-semibold text-gray-800 text-sm">{STATUS_LABELS[status]}</h3>
//                     <span className="text-xs bg-white text-gray-500 font-semibold px-1.5 py-0.5 rounded-full border border-gray-200">{statusLeads.length}</span>
//                   </div>
//                   {colTotal > 0 && <p className="text-xs text-gray-400">${colTotal.toLocaleString()}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Drop zone hint */}
//             {isOver && (
//               <div className="mx-2 mt-2 border-2 border-dashed border-blue-300 rounded-lg p-3 text-center text-xs text-blue-500 font-medium bg-blue-50/50">
//                 Drop here → {STATUS_LABELS[status]}
//               </div>
//             )}

//             <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
//               {statusLeads.map(lead => (
//                 <LeadCard key={lead.id} lead={lead}
//                   onSelect={() => onSelect(lead)}
//                   onChangeStatus={onChangeStatus}
//                   onDragStart={handleDragStart}
//                 />
//               ))}
//               {statusLeads.length === 0 && !isOver && (
//                 <div className="flex items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
//                   <p className="text-sm">No deals</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ─── LIST VIEW ──────────────────────────────────────── */
// const ListView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => (
//   <div className="h-full overflow-auto custom-scrollbar">
//     <table className="w-full">
//       <thead className="bg-blue-50/80 backdrop-blur-sm sticky top-0 z-10">
//         <tr className="border-b border-gray-200">
//           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Deal</th>
//           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
//           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
//           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
//           <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-blue-50 bg-white">
//         {leads.map(lead => {
//           const cfg = getCfg(lead.status);
//           const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//           return (
//             <tr key={lead.id} onClick={() => onSelect(lead)} className="hover:bg-blue-50/60 cursor-pointer transition-colors">
//               <td className="px-4 py-3">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-xs font-bold`}>{initials}</div>
//                   <span className="font-medium text-gray-900">{lead.name}</span>
//                 </div>
//               </td>
//               <td className="px-4 py-3 text-gray-600">{lead.company}</td>
//               <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
//                 <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//               </td>
//               <td className="px-4 py-3 font-semibold text-gray-900">${parseFloat(lead.value).toLocaleString()}</td>
//               <td className="px-4 py-3 text-gray-500 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// );

// /* ─── GRID VIEW ──────────────────────────────────────── */
// const GridView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 overflow-y-auto h-full custom-scrollbar">
//     {leads.map(lead => {
//       const cfg = getCfg(lead.status);
//       const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//       return (
//         <div key={lead.id} onClick={() => onSelect(lead)}
//           className="bg-white rounded-2xl border border-blue-100 p-5 cursor-pointer hover:shadow-xl hover:shadow-blue-100 transition-all duration-200 hover:-translate-y-1">
//           <div className="flex items-start justify-between mb-4">
//             <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-bold`}>
//               {initials}
//             </div>
//           </div>
//           <h3 className="font-bold text-gray-900 text-lg mb-1">{lead.name}</h3>
//           <p className="text-sm text-gray-500 mb-3">{lead.company}</p>
//           <div className="mb-4" onClick={e => e.stopPropagation()}>
//             <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//           </div>
//           <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//             <p className="text-xl font-bold text-gray-900">${parseFloat(lead.value).toLocaleString()}</p>
//             <p className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</p>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// );

// /* ─── MAIN PIPELINE ──────────────────────────────────── */
// const DEFAULT_FILTERS: Filters = { status: '', minValue: '', maxValue: '', sortBy: 'newest' };

// export const Pipeline = () => {
//   const navigate = useNavigate();
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [search, setSearch] = useState('');
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [view, setView] = useState<'board' | 'list' | 'grid'>('board');
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showAnalytics, setShowAnalytics] = useState(false);
//   const [showActivity, setShowActivity] = useState(false);
//   const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
//   const [activities, setActivities] = useState<ActivityEntry[]>([]);
//   const [quickStage, setQuickStage] = useState<LeadStatus | ''>('');

//   // 🔥 CORE FIX: Fetch both Leads and Activities from Django backend
//   const fetchAllData = async () => {
//     setIsRefreshing(true);
//     try {
//       const [leadsData, actsData] = await Promise.all([
//         api.getLeads(search),
//         api.getActivities()
//       ]);
      
//       setLeads(leadsData);

//       // Map backend activities to frontend format so they persist on reload
//       const mappedActs = actsData.map(formatBackendActivity);
//       setActivities(mappedActs);

//     } catch(e) {
//       console.error("Failed to fetch pipeline data:", e);
//     }
//     setIsRefreshing(false);
//   };

//   useEffect(() => {
//     const t = setTimeout(fetchAllData, 300);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     const savedView = localStorage.getItem('pipeline_view_mode') as 'board' | 'list' | 'grid' | null;
//     if (savedView && ['board', 'list', 'grid'].includes(savedView)) {
//       setView(savedView);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('pipeline_view_mode', view);
//   }, [view]);

//   // 🔥 CORE FIX: Save activity permanently and re-fetch from database
//   const handleChangeStatus = async (leadId: number, newStatus: LeadStatus) => {
//     try {
//       const lead = leads.find(l => l.id === leadId);
//       const oldStatus = lead?.status;
      
//       if (!oldStatus || oldStatus === newStatus) return;

//       // 1. Optimistic UI Update (Instant feedback)
//       setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

//       // 2. Update status in Database
//       await api.updateLeadStatus(leadId, newStatus);
      
//       // 3. Save the activity permanently to the database
//       await api.createActivity({
//         lead: leadId,
//         activity_type: 'note',
//         summary: `Stage updated: ${STATUS_LABELS[oldStatus as LeadStatus]} → ${STATUS_LABELS[newStatus]}`,
//         description: `Pipeline stage moved from ${STATUS_LABELS[oldStatus as LeadStatus]} to ${STATUS_LABELS[newStatus]}.`
//       });

//       // 4. Fetch the freshly saved activities from the backend
//       const updatedActsData = await api.getActivities();
//       setActivities(updatedActsData.map(formatBackendActivity));

//     } catch (e) {
//       console.error('Failed to update status:', e);
//       // Optional: If it failed, re-fetch to revert optimistic update
//       fetchAllData();
//     }
//   };

//   const updateFilters = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

//   // Apply search + filters + sort
//   const filtered = leads
//     .filter(l => {
//       const q = search.toLowerCase();
//       if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q)) return false;
//       if (filters.status && l.status !== filters.status) return false;
//       if (quickStage && l.status !== quickStage) return false;
//       const val = parseFloat(l.value);
//       if (filters.minValue && val < parseFloat(filters.minValue)) return false;
//       if (filters.maxValue && val > parseFloat(filters.maxValue)) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       if (filters.sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
//       if (filters.sortBy === 'value_high') return parseFloat(b.value) - parseFloat(a.value);
//       if (filters.sortBy === 'value_low') return parseFloat(a.value) - parseFloat(b.value);
//       if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
//       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
//     });

//   const hasActiveFilters = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
//   const totalValue = leads.reduce((acc, l) => acc + parseFloat(l.value), 0);
//   const wonCount = leads.filter(l => l.status === 'won').length;
//   const openCount = leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
//   const lostValue = leads.filter(l => l.status === 'lost').reduce((acc, l) => acc + parseFloat(l.value), 0);
//   const winRate = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

//   return (
//     <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_right,#dbeafe_0,#eff6ff_35%,#f8fafc_100%)] overflow-hidden">

//       {/* ── HEADER ── */}
//       <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 px-6 py-4 shrink-0 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pipeline Command Center</h1>
//             <p className="text-sm text-slate-500">
//               Drag cards to move • {filtered.length} of {leads.length} deals
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={fetchAllData}
//               className={`p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
//               <RefreshCw size={18} />
//             </button>
//             {/* Analytics toggle */}
//             <button onClick={() => { setShowAnalytics(v => !v); setShowActivity(false); }}
//               className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showAnalytics ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-blue-50'}`}>
//               <BarChart3 size={16} />
//               Analytics
//             </button>
//             {/* Activity toggle */}
//             <button onClick={() => { setShowActivity(v => !v); setShowAnalytics(false); }}
//               className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${showActivity ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-indigo-50'}`}>
//               <Activity size={16} />
//               Activity
//               {activities.length > 0 && !showActivity && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//                   {activities.length > 9 ? '9+' : activities.length}
//                 </span>
//               )}
//             </button>
//             <button onClick={() => navigate('/pipeline/new')}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
//               <Plus size={16} />
//               Add Deal
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 animate-[fadeIn_.35s_ease]">
//           <div className="rounded-2xl border border-blue-100 bg-white p-3">
//             <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1"><Briefcase size={12} /> Total Deals</p>
//             <p className="text-2xl font-black text-slate-900 mt-1">{leads.length}</p>
//           </div>
//           <div className="rounded-2xl border border-indigo-100 bg-white p-3">
//             <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1"><Calendar size={12} /> Open Deals</p>
//             <p className="text-2xl font-black text-indigo-700 mt-1">{openCount}</p>
//           </div>
//           <div className="rounded-2xl border border-emerald-100 bg-white p-3">
//             <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1"><Target size={12} /> Win Rate</p>
//             <p className="text-2xl font-black text-emerald-700 mt-1">{winRate}%</p>
//           </div>
//           <div className="rounded-2xl border border-blue-100 bg-white p-3">
//             <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1"><DollarSign size={12} /> Pipeline Value</p>
//             <p className="text-2xl font-black text-blue-700 mt-1">${(totalValue / 1000).toFixed(0)}k</p>
//           </div>
//         </div>

//         {/* Toolbar */}
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="text" placeholder="Search deals..."
//                 className="w-64 pl-9 pr-4 py-2 bg-white border border-blue-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                 value={search} onChange={e => setSearch(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => setShowFilters(v => !v)}
//               className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${showFilters || hasActiveFilters
//                 ? 'bg-blue-50 text-blue-700 border-blue-200'
//                 : 'text-slate-600 border-blue-100 hover:bg-blue-50'}`}>
//               <SlidersHorizontal size={15} />
//               Filter
//               {hasActiveFilters && (
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//               )}
//             </button>
//             <button
//               onClick={() => setQuickStage('')}
//               className={`text-xs px-2.5 py-2 rounded-lg border transition-all ${quickStage === '' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-blue-100 hover:bg-indigo-50'}`}
//             >
//               All
//             </button>
//             {STATUS_ORDER.map(status => {
//               const cfg = getCfg(status);
//               const count = leads.filter(l => l.status === status).length;
//               return (
//                 <button
//                   key={status}
//                   onClick={() => setQuickStage(prev => prev === status ? '' : status)}
//                   className={`text-xs px-2.5 py-2 rounded-lg border flex items-center gap-1.5 transition-all ${quickStage === status ? `${cfg.bg} ${cfg.text} border-transparent` : 'bg-white border-blue-100 text-slate-600 hover:bg-blue-50'}`}
//                 >
//                   <Tag size={11} />
//                   {STATUS_LABELS[status]} ({count})
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex items-center bg-white border border-blue-100 rounded-lg p-1 shadow-sm">
//             {(['board', 'list', 'grid'] as const).map((v, i) => {
//               const icons = [<Columns3 size={16} />, <List size={16} />, <LayoutGrid size={16} />];
//               return (
//                 <button key={v} onClick={() => setView(v)}
//                   className={`p-2 rounded-md transition-all ${view === v ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-blue-50'}`}>
//                   {icons[i]}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       {/* ── FILTER BAR ── */}
//       {showFilters && (
//         <FilterBar
//           filters={filters}
//           onChange={updateFilters}
//           onReset={() => setFilters(DEFAULT_FILTERS)}
//           leads={filtered}
//         />
//       )}

//       {/* ── MAIN CONTENT (board + side panels) ── */}
//       <div className="flex flex-1 overflow-hidden animate-[fadeIn_.35s_ease]">
//         <div className="flex-1 overflow-hidden">
//           {filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <Briefcase size={48} className="text-gray-300 mb-4" />
//               <p className="text-gray-500 font-medium">No deals found</p>
//               <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
//               <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); }}
//                 className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
//                 Clear filters
//               </button>
//               <div className="mt-3 text-xs text-slate-400">
//                 Lost Value: ${lostValue.toLocaleString()}
//               </div>
//             </div>
//           ) : view === 'board' ? (
//             <BoardView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           ) : view === 'list' ? (
//             <ListView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           ) : (
//             <GridView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           )}
//         </div>

//         {/* ── SIDE PANELS ── */}
//         {showAnalytics && (
//           <AnalyticsPanel leads={leads} onClose={() => setShowAnalytics(false)} />
//         )}
//         {showActivity && (
//           <ActivityFeed activities={activities} leads={leads} onClose={() => setShowActivity(false)} />
//         )}
//       </div>

//       {/* ── MODALS ── */}
//       <LeadDetailDrawer
//         lead={selectedLead}
//         isOpen={!!selectedLead}
//         onClose={() => setSelectedLead(null)}
//         onUpdate={fetchAllData}
//       />
//     </div>
//   );
// };

// export default Pipeline;


// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Plus, Search, Building2, Columns3, List, LayoutGrid,
//   RefreshCw, Briefcase, ChevronDown, Check,
//   Zap, Phone, MessageSquare, CheckCircle2, XCircle,
//   BarChart3, X, TrendingUp, DollarSign, Target,
//   Clock, ArrowUpRight, SlidersHorizontal,
//   Activity, Calendar, Tag, Filter
// } from 'lucide-react';
// import { STATUS_LABELS, type Lead, STATUS_ORDER, type LeadStatus } from '../Utils/types';
// import { api } from '../Utils/api';
// import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';

// /* ─── STATUS CONFIG ──────────────────────────────────── */
// const STATUS_CONFIG: Record<string, {
//   color: string; bg: string; text: string;
//   icon: React.ReactNode; gradient: string; hex: string;
// }> = {
//   new:         { color: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: <Zap size={11} />,           gradient: 'from-blue-500 to-blue-600',      hex: '#3b82f6' },
//   contacted:   { color: 'bg-indigo-500',  bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: <Phone size={11} />,         gradient: 'from-indigo-500 to-indigo-600',  hex: '#6366f1' },
//   negotiation: { color: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700',   icon: <MessageSquare size={11} />, gradient: 'from-amber-500 to-amber-600',    hex: '#f59e0b' },
//   won:         { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={11} />,  gradient: 'from-emerald-500 to-emerald-600',hex: '#10b981' },
//   lost:        { color: 'bg-slate-400',   bg: 'bg-slate-100',  text: 'text-slate-600',   icon: <XCircle size={11} />,       gradient: 'from-slate-400 to-slate-500',    hex: '#94a3b8' },
// };
// const getCfg = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.new;

// /* ─── ACTIVITY HELPERS ───────────────────────────────── */
// type ActivityEntry = { id: number; leadId: number; action: string; from?: string; to?: string; ts: number };

// const timeAgo = (ts: number) => {
//   const s = Math.floor((Date.now() - ts) / 1000);
//   if (s < 60) return 'just now';
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// };

// const formatBackendActivity = (a: any): ActivityEntry => {
//   let action = a.summary || a.activity_type;
//   let from, to;
//   if (a.summary && a.summary.includes('Stage updated:')) {
//     const parts = a.summary.replace('Stage updated: ', '').split(' → ');
//     if (parts.length === 2) {
//       from = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[0]);
//       to   = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[1]);
//       if (from && to) action = 'status_change';
//     }
//   }
//   return { id: a.id, leadId: a.lead, action, from, to, ts: new Date(a.created_at).getTime() };
// };

// /* ─── ANALYTICS PANEL ────────────────────────────────── */
// const AnalyticsPanel = ({ leads, onClose }: { leads: Lead[]; onClose: () => void }) => {
//   const total    = leads.length || 1;
//   const totalVal = leads.reduce((a, l) => a + parseFloat(l.value), 0);
//   const wonLeads = leads.filter(l => l.status === 'won');
//   const wonVal   = wonLeads.reduce((a, l) => a + parseFloat(l.value), 0);
//   const winRate  = Math.round((wonLeads.length / total) * 100);
//   const avgDeal  = totalVal / total;

//   return (
//     <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
//       <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0">
//         <div className="flex items-center gap-2">
//           <BarChart3 size={13} className="text-indigo-600" />
//           <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Analytics</span>
//         </div>
//         <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
//           <X size={13} />
//         </button>
//       </div>

//       <div className="p-3 space-y-4 overflow-y-auto">
//         <div className="grid grid-cols-2 gap-2">
//           {[
//             { label: 'Deals',    value: leads.length,                      icon: <Briefcase size={11} />, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
//             { label: 'Win Rate', value: `${winRate}%`,                     icon: <Target size={11} />,    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
//             { label: 'Pipeline', value: `$${(totalVal/1000).toFixed(0)}k`, icon: <DollarSign size={11} />,color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100' },
//             { label: 'Avg Deal', value: `$${(avgDeal/1000).toFixed(0)}k`,  icon: <TrendingUp size={11} />,color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
//           ].map(k => (
//             <div key={k.label} className={`rounded-lg p-2.5 border ${k.bg} ${k.border}`}>
//               <div className={`w-5 h-5 rounded-md bg-white ${k.color} flex items-center justify-center mb-1.5 shadow-sm`}>{k.icon}</div>
//               <p className="text-[10px] text-slate-500 font-medium">{k.label}</p>
//               <p className="text-[14px] font-bold text-slate-800">{k.value}</p>
//             </div>
//           ))}
//         </div>

//         <div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stage Breakdown</p>
//           <div className="space-y-2">
//             {STATUS_ORDER.map(status => {
//               const count = leads.filter(l => l.status === status).length;
//               const val   = leads.filter(l => l.status === status).reduce((a, l) => a + parseFloat(l.value), 0);
//               const pct   = Math.round((count / total) * 100);
//               const cfg   = getCfg(status);
//               return (
//                 <div key={status}>
//                   <div className="flex items-center justify-between mb-0.5">
//                     <div className="flex items-center gap-1.5">
//                       <span className={`${cfg.color} w-1.5 h-1.5 rounded-full inline-block`} />
//                       <span className="text-[11px] font-semibold text-slate-700">{STATUS_LABELS[status]}</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-[10px] text-slate-400">{count}</span>
//                       <span className="text-[11px] font-bold text-slate-600">${(val/1000).toFixed(0)}k</span>
//                     </div>
//                   </div>
//                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
//                     <div className={`h-full ${cfg.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Won vs Lost</p>
//           <div className="flex gap-2">
//             <div className="flex-1 bg-emerald-50 rounded-lg p-2 border border-emerald-100">
//               <p className="text-[10px] text-emerald-600 font-semibold">Won</p>
//               <p className="text-[13px] font-bold text-emerald-700">${(wonVal/1000).toFixed(0)}k</p>
//               <p className="text-[10px] text-emerald-500">{wonLeads.length} deals</p>
//             </div>
//             <div className="flex-1 bg-red-50 rounded-lg p-2 border border-red-100">
//               <p className="text-[10px] text-red-500 font-semibold">Lost</p>
//               <p className="text-[13px] font-bold text-red-600">
//                 ${(leads.filter(l=>l.status==='lost').reduce((a,l)=>a+parseFloat(l.value),0)/1000).toFixed(0)}k
//               </p>
//               <p className="text-[10px] text-red-400">{leads.filter(l=>l.status==='lost').length} deals</p>
//             </div>
//           </div>
//         </div>

//         <div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Top Deals</p>
//           <div className="space-y-1.5">
//             {[...leads].sort((a,b)=>parseFloat(b.value)-parseFloat(a.value)).slice(0,4).map(lead => {
//               const cfg = getCfg(lead.status);
//               return (
//                 <div key={lead.id} className="flex items-center gap-2 py-1 border-b border-slate-50 last:border-0">
//                   <div className={`w-6 h-6 rounded-md ${cfg.bg} ${cfg.text} flex items-center justify-center text-[9px] font-bold shrink-0`}>
//                     {lead.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[11px] font-semibold text-slate-800 truncate">{lead.name}</p>
//                     <p className="text-[10px] text-slate-400 truncate">{lead.company}</p>
//                   </div>
//                   <span className="text-[11px] font-bold text-slate-700 shrink-0">${parseFloat(lead.value).toLocaleString()}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── ACTIVITY FEED ──────────────────────────────────── */
// const ActivityFeed = ({ activities, leads, onClose }: {
//   activities: ActivityEntry[]; leads: Lead[]; onClose: () => void;
// }) => {
//   const getName = (id: number) => leads.find(l => l.id === id)?.name ?? 'Unknown';
//   return (
//     <div className="w-56 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
//       <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50 shrink-0">
//         <div className="flex items-center gap-2">
//           <Activity size={13} className="text-indigo-600" />
//           <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Activity</span>
//           {activities.length > 0 && (
//             <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">{activities.length}</span>
//           )}
//         </div>
//         <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
//           <X size={13} />
//         </button>
//       </div>
//       <div className="flex-1 p-3 overflow-y-auto">
//         {activities.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-8 text-center">
//             <Activity size={20} className="text-slate-200 mb-2" />
//             <p className="text-[11px] font-semibold text-slate-400">No activity yet</p>
//             <p className="text-[10px] text-slate-300 mt-0.5">Changes appear here</p>
//           </div>
//         ) : (
//           <div className="relative">
//             <div className="absolute left-2.5 top-0 bottom-0 w-px bg-slate-100" />
//             <div className="space-y-3">
//               {activities.map(a => {
//                 const fromCfg = a.from ? getCfg(a.from) : null;
//                 const toCfg   = a.to   ? getCfg(a.to)   : null;
//                 return (
//                   <div key={a.id} className="flex gap-2 relative">
//                     <div className="w-5 h-5 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center shrink-0 z-10">
//                       <ArrowUpRight size={8} className="text-indigo-600" />
//                     </div>
//                     <div className="flex-1 min-w-0 pt-0.5">
//                       <p className="text-[11px] font-bold text-slate-800 truncate">{getName(a.leadId)}</p>
//                       {a.action === 'status_change' && fromCfg && toCfg ? (
//                         <div className="flex items-center gap-1 mt-0.5 flex-wrap">
//                           <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${fromCfg.bg} ${fromCfg.text}`}>{STATUS_LABELS[a.from as LeadStatus]}</span>
//                           <span className="text-[9px] text-slate-400">→</span>
//                           <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${toCfg.bg} ${toCfg.text}`}>{STATUS_LABELS[a.to as LeadStatus]}</span>
//                         </div>
//                       ) : (
//                         <p className="text-[10px] text-slate-500 mt-0.5 truncate">{a.action}</p>
//                       )}
//                       <p className="text-[9px] text-slate-300 mt-0.5 flex items-center gap-1">
//                         <Clock size={7} />{timeAgo(a.ts)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ─── STATUS DROPDOWN ────────────────────────────────── */
// const StatusDropdown = ({ currentStatus, leadId, onChangeStatus }: {
//   currentStatus: LeadStatus; leadId: number;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const config = getCfg(currentStatus);
//   return (
//     <div className="relative">
//       <button
//         onClick={e => { e.stopPropagation(); setIsOpen(o => !o); }}
//         className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${config.bg} ${config.text} hover:opacity-80 transition-all`}
//       >
//         {config.icon}
//         {STATUS_LABELS[currentStatus]}
//         <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
//           <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
//             <div className="px-3 py-1.5 border-b border-slate-100">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move to stage</p>
//             </div>
//             {STATUS_ORDER.map(status => {
//               const sc = getCfg(status);
//               const isActive = status === currentStatus;
//               return (
//                 <button key={status}
//                   onClick={e => { e.stopPropagation(); onChangeStatus(leadId, status); setIsOpen(false); }}
//                   disabled={isActive}
//                   className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <div className={`w-5 h-5 rounded-md ${sc.bg} ${sc.text} flex items-center justify-center shrink-0`}>{sc.icon}</div>
//                   <span className="text-[11px] font-medium text-slate-700">{STATUS_LABELS[status]}</span>
//                   {isActive && <Check size={10} className="ml-auto text-emerald-500" />}
//                 </button>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// /* ─── FILTER BAR ─────────────────────────────────────── */
// type Filters = { status: LeadStatus | ''; minValue: string; maxValue: string; sortBy: string };
// const FilterBar = ({ filters, onChange, onReset, leads }: {
//   filters: Filters; onChange: (f: Partial<Filters>) => void;
//   onReset: () => void; leads: Lead[];
// }) => {
//   const active = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
//   const selectCls = "text-[11px] border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400";
//   return (
//     <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50/60 border-b border-indigo-100 flex-wrap shrink-0">
//       <div className="flex items-center gap-1.5 mr-1">
//         <Filter size={11} className="text-indigo-500" />
//         <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">Filters</span>
//       </div>
//       <select value={filters.status} onChange={e => onChange({ status: e.target.value as LeadStatus | '' })} className={selectCls}>
//         <option value="">All Stages</option>
//         {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
//       </select>
//       <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1">
//         <DollarSign size={9} className="text-slate-400" />
//         <input type="number" placeholder="Min" value={filters.minValue} onChange={e => onChange({ minValue: e.target.value })}
//           className="w-14 text-[11px] outline-none text-slate-700" />
//       </div>
//       <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1">
//         <DollarSign size={9} className="text-slate-400" />
//         <input type="number" placeholder="Max" value={filters.maxValue} onChange={e => onChange({ maxValue: e.target.value })}
//           className="w-14 text-[11px] outline-none text-slate-700" />
//       </div>
//       <select value={filters.sortBy} onChange={e => onChange({ sortBy: e.target.value })} className={selectCls}>
//         <option value="newest">Newest first</option>
//         <option value="oldest">Oldest first</option>
//         <option value="value_high">Value: High → Low</option>
//         <option value="value_low">Value: Low → High</option>
//         <option value="name">Name A–Z</option>
//       </select>
//       <span className="text-[10px] text-indigo-500 font-semibold ml-1">{leads.length} result{leads.length !== 1 ? 's' : ''}</span>
//       {active && (
//         <button onClick={onReset} className="ml-auto flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold">
//           <X size={10} /> Reset
//         </button>
//       )}
//     </div>
//   );
// };

// /* ─── LEAD CARD ──────────────────────────────────────── */
// const LeadCard = ({ lead, onSelect, onChangeStatus, onDragStart }: {
//   lead: Lead; onSelect: () => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
//   onDragStart?: (e: React.DragEvent, lead: Lead) => void;
// }) => {
//   const cfg      = getCfg(lead.status);
//   const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//   return (
//     <div
//       draggable
//       onDragStart={e => onDragStart?.(e, lead)}
//       onClick={onSelect}
//       className="bg-white rounded-lg border border-slate-200 p-2.5 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 transition-all select-none group"
//     >
//       <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${cfg.gradient} mb-2 opacity-50 group-hover:opacity-100 transition-opacity`} />
//       <div className="flex items-start gap-2 mb-2">
//         <div className={`w-7 h-7 rounded-md ${cfg.bg} ${cfg.text} flex items-center justify-center text-[10px] font-bold shrink-0`}>
//           {initials}
//         </div>
//         <div className="min-w-0 flex-1">
//           <h4 className="font-bold text-slate-800 text-[12px] truncate leading-tight">{lead.name}</h4>
//           <p className="text-[10px] text-slate-500 truncate flex items-center gap-0.5 mt-0.5">
//             <Building2 size={8} />{lead.company}
//           </p>
//         </div>
//       </div>
//       <div className="mb-2" onClick={e => e.stopPropagation()}>
//         <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//       </div>
//       <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
//         <span className="text-[12px] font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</span>
//         <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
//           <Calendar size={8} />{new Date(lead.created_at).toLocaleDateString()}
//         </span>
//       </div>
//     </div>
//   );
// };

// /* ─── BOARD VIEW — grid layout, no horizontal scroll ─── */
// const BoardView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => {
//   const [dragOver, setDragOver] = useState<string | null>(null);
//   const dragLead = useRef<Lead | null>(null);

//   const handleDragStart = (e: React.DragEvent, lead: Lead) => {
//     dragLead.current = lead;
//     e.dataTransfer.effectAllowed = 'move';
//   };
//   const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
//     e.preventDefault();
//     if (dragLead.current && dragLead.current.status !== status) {
//       onChangeStatus(dragLead.current.id, status);
//     }
//     dragLead.current = null;
//     setDragOver(null);
//   };

//   return (
//     /* CSS grid: all columns equal width, contained within parent — no overflow-x */
//     <div
//       className="h-full p-3 gap-2"
//       style={{ display: 'grid', gridTemplateColumns: `repeat(${STATUS_ORDER.length}, minmax(0, 1fr))` }}
//     >
//       {STATUS_ORDER.map(status => {
//         const statusLeads = leads.filter(l => l.status === status);
//         const cfg         = getCfg(status);
//         const isOver      = dragOver === status;
//         const colTotal    = statusLeads.reduce((a, l) => a + parseFloat(l.value), 0);

//         return (
//           <div key={status}
//             onDragOver={e => { e.preventDefault(); setDragOver(status); }}
//             onDragLeave={() => setDragOver(null)}
//             onDrop={e => handleDrop(e, status as LeadStatus)}
//             className={`flex flex-col rounded-xl h-full min-h-0 transition-all duration-150 border ${
//               isOver
//                 ? 'ring-2 ring-indigo-400 ring-offset-1 bg-indigo-50/60 border-indigo-200'
//                 : 'bg-slate-100/70 border-slate-200/60'
//             }`}
//           >
//             {/* Column header */}
//             <div className="px-2.5 py-2 border-b border-slate-200/60 shrink-0">
//               <div className="flex items-center gap-1.5">
//                 <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}>
//                   {cfg.icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-1">
//                     <h3 className="font-bold text-slate-700 text-[11px] truncate">{STATUS_LABELS[status]}</h3>
//                     <span className="text-[9px] bg-white text-slate-500 font-bold px-1 py-0.5 rounded-full border border-slate-200 shadow-sm shrink-0">
//                       {statusLeads.length}
//                     </span>
//                   </div>
//                   {colTotal > 0 && (
//                     <p className="text-[9px] text-slate-400 font-medium">${colTotal.toLocaleString()}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {isOver && (
//               <div className="mx-2 mt-1.5 border-2 border-dashed border-indigo-300 rounded-lg p-1.5 text-center text-[10px] text-indigo-500 font-semibold bg-indigo-50/50 shrink-0">
//                 Drop here
//               </div>
//             )}

//             <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 min-h-0">
//               {statusLeads.map(lead => (
//                 <LeadCard key={lead.id} lead={lead}
//                   onSelect={() => onSelect(lead)}
//                   onChangeStatus={onChangeStatus}
//                   onDragStart={handleDragStart}
//                 />
//               ))}
//               {statusLeads.length === 0 && !isOver && (
//                 <div className="flex items-center justify-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
//                   <p className="text-[11px] font-medium">No deals</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ─── LIST VIEW ──────────────────────────────────────── */
// const ListView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => (
//   <div className="h-full overflow-auto">
//     <table className="w-full">
//       <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
//         <tr>
//           {['Deal', 'Company', 'Status', 'Value', 'Created'].map(h => (
//             <th key={h} className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-slate-100 bg-white">
//         {leads.map(lead => {
//           const cfg      = getCfg(lead.status);
//           const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//           return (
//             <tr key={lead.id} onClick={() => onSelect(lead)} className="hover:bg-slate-50/80 cursor-pointer transition-colors">
//               <td className="px-4 py-2">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-7 h-7 rounded-md ${cfg.bg} ${cfg.text} flex items-center justify-center text-[10px] font-bold`}>{initials}</div>
//                   <span className="text-[12px] font-semibold text-slate-800">{lead.name}</span>
//                 </div>
//               </td>
//               <td className="px-4 py-2 text-[11px] text-slate-500">{lead.company}</td>
//               <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
//                 <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//               </td>
//               <td className="px-4 py-2 text-[12px] font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</td>
//               <td className="px-4 py-2 text-[10px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// );

// /* ─── GRID VIEW ──────────────────────────────────────── */
// const GridView = ({ leads, onSelect, onChangeStatus }: {
//   leads: Lead[]; onSelect: (l: Lead) => void;
//   onChangeStatus: (id: number, s: LeadStatus) => void;
// }) => (
//   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3 overflow-y-auto h-full content-start">
//     {leads.map(lead => {
//       const cfg      = getCfg(lead.status);
//       const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
//       return (
//         <div key={lead.id} onClick={() => onSelect(lead)}
//           className="bg-white rounded-xl border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group">
//           <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${cfg.gradient} mb-3 opacity-50 group-hover:opacity-100 transition-opacity`} />
//           <div className="flex items-start gap-2 mb-2.5">
//             <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-bold text-[11px] shadow-sm shrink-0`}>
//               {initials}
//             </div>
//             <div className="min-w-0 flex-1">
//               <h3 className="font-bold text-slate-800 text-[12px] truncate">{lead.name}</h3>
//               <p className="text-[10px] text-slate-500 truncate">{lead.company}</p>
//             </div>
//           </div>
//           <div className="mb-2.5" onClick={e => e.stopPropagation()}>
//             <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
//           </div>
//           <div className="flex items-center justify-between pt-2 border-t border-slate-100">
//             <p className="text-[13px] font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</p>
//             <p className="text-[9px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</p>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// );

// /* ─── MAIN PIPELINE ──────────────────────────────────── */
// const DEFAULT_FILTERS: Filters = { status: '', minValue: '', maxValue: '', sortBy: 'newest' };

// export const Pipeline = () => {
//   const navigate = useNavigate();
//   const [leads, setLeads]                   = useState<Lead[]>([]);
//   const [search, setSearch]                 = useState('');
//   const [selectedLead, setSelectedLead]     = useState<Lead | null>(null);
//   const [view, setView]                     = useState<'board' | 'list' | 'grid'>('board');
//   const [isRefreshing, setIsRefreshing]     = useState(false);
//   const [showFilters, setShowFilters]       = useState(false);
//   const [showAnalytics, setShowAnalytics]   = useState(false);
//   const [showActivity, setShowActivity]     = useState(false);
//   const [filters, setFilters]               = useState<Filters>(DEFAULT_FILTERS);
//   const [activities, setActivities]         = useState<ActivityEntry[]>([]);
//   const [quickStage, setQuickStage]         = useState<LeadStatus | ''>('');

//   /* ── fetch ── */
//   const fetchAllData = async () => {
//     setIsRefreshing(true);
//     try {
//       const [leadsData, actsData] = await Promise.all([
//         api.getLeads(search),
//         api.getActivities()
//       ]);
//       setLeads(leadsData);
//       setActivities(actsData.map(formatBackendActivity));
//     } catch(e) {
//       console.error("Failed to fetch pipeline data:", e);
//     }
//     setIsRefreshing(false);
//   };

//   useEffect(() => {
//     const t = setTimeout(fetchAllData, 300);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     const savedView = localStorage.getItem('pipeline_view_mode') as 'board' | 'list' | 'grid' | null;
//     if (savedView && ['board', 'list', 'grid'].includes(savedView)) setView(savedView);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('pipeline_view_mode', view);
//   }, [view]);

//   /* ── status change ── */
//   const handleChangeStatus = async (leadId: number, newStatus: LeadStatus) => {
//     try {
//       const lead      = leads.find(l => l.id === leadId);
//       const oldStatus = lead?.status;
//       if (!oldStatus || oldStatus === newStatus) return;
//       setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
//       await api.updateLeadStatus(leadId, newStatus);
//       await api.createActivity({
//         lead: leadId,
//         activity_type: 'note',
//         summary: `Stage updated: ${STATUS_LABELS[oldStatus as LeadStatus]} → ${STATUS_LABELS[newStatus]}`,
//         description: `Pipeline stage moved from ${STATUS_LABELS[oldStatus as LeadStatus]} to ${STATUS_LABELS[newStatus]}.`
//       });
//       const updatedActsData = await api.getActivities();
//       setActivities(updatedActsData.map(formatBackendActivity));
//     } catch (e) {
//       console.error('Failed to update status:', e);
//       fetchAllData();
//     }
//   };

//   const updateFilters = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

//   /* ── filtering / sorting ── */
//   const filtered = leads
//     .filter(l => {
//       const q = search.toLowerCase();
//       if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q)) return false;
//       if (filters.status && l.status !== filters.status) return false;
//       if (quickStage && l.status !== quickStage) return false;
//       const val = parseFloat(l.value);
//       if (filters.minValue && val < parseFloat(filters.minValue)) return false;
//       if (filters.maxValue && val > parseFloat(filters.maxValue)) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       if (filters.sortBy === 'oldest')     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
//       if (filters.sortBy === 'value_high') return parseFloat(b.value) - parseFloat(a.value);
//       if (filters.sortBy === 'value_low')  return parseFloat(a.value) - parseFloat(b.value);
//       if (filters.sortBy === 'name')       return a.name.localeCompare(b.name);
//       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//     });

//   /* ── derived stats ── */
//   const hasActiveFilters = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
//   const totalValue = leads.reduce((acc, l) => acc + parseFloat(l.value), 0);
//   const wonCount   = leads.filter(l => l.status === 'won').length;
//   const openCount  = leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
//   const lostValue  = leads.filter(l => l.status === 'lost').reduce((acc, l) => acc + parseFloat(l.value), 0);
//   const winRate    = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

//   return (
//     <div className="flex flex-col h-full bg-[#f4f6fb] overflow-hidden">

//       {/* ── PAGE BANNER ── */}
//       <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-5 flex items-center gap-3 shrink-0">
//         <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
//           <Briefcase className="text-white" size={14} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <h1 className="text-[16px] font-bold text-white leading-tight">Pipeline Command Center</h1>
//           <p className="text-[10px] text-indigo-200 mt-0.5">{filtered.length} of {leads.length} deals · Drag cards between stages</p>
//         </div>

//         {/* Inline KPI chips */}
//         <div className="hidden lg:flex items-center gap-1.5 mr-2">
//           {[
//             { label: 'Open',     value: openCount,                            cls: 'bg-white/10 text-white' },
//             { label: 'Won',      value: `${winRate}%`,                        cls: 'bg-emerald-500/30 text-emerald-100' },
//             { label: 'Pipeline', value: `$${(totalValue/1000).toFixed(0)}k`,  cls: 'bg-white/10 text-white' },
//           ].map(k => (
//             <div key={k.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold ${k.cls}`}>
//               <span className="opacity-70">{k.label}</span>
//               <span className="font-bold">{k.value}</span>
//             </div>
//           ))}
//         </div>

//         {/* Action buttons */}
//         <div className="flex items-center gap-1.5 shrink-0">
//           <button onClick={fetchAllData}
//             className={`p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
//             <RefreshCw size={13} />
//           </button>
//           <button onClick={() => { setShowAnalytics(v => !v); setShowActivity(false); }}
//             className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[14px] font-semibold transition-all ${showAnalytics ? 'bg-white text-indigo-700' : 'bg-white/10 text-white hover:bg-white/20'}`}>
//             <BarChart3 size={12} /> Analytics
//           </button>
//           <button onClick={() => { setShowActivity(v => !v); setShowAnalytics(false); }}
//             className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[14px] font-semibold transition-all relative ${showActivity ? 'bg-white text-indigo-700' : 'bg-white/10 text-white hover:bg-white/20'}`}>
//             <Activity size={12} /> Activity
//             {activities.length > 0 && !showActivity && (
//               <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
//                 {activities.length > 9 ? '9+' : activities.length}
//               </span>
//             )}
//           </button>
//           <button onClick={() => navigate('/pipeline/new')}
//             className="flex items-center gap-1 bg-white text-indigo-700 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md text-[14px] font-bold transition-colors shadow-sm">
//             <Plus size={12} /> Add Deal
//           </button>
//         </div>
//       </div>

//       {/* ── TOOLBAR ── */}
//       <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between gap-3 shrink-0 flex-wrap">
//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
//             <input
//               type="text" placeholder="Search deals…"
//               className="w-44 pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[12px] outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 transition-all"
//               value={search} onChange={e => setSearch(e.target.value)}
//             />
//           </div>

//           {/* Filter toggle */}
//           <button onClick={() => setShowFilters(v => !v)}
//             className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
//               showFilters || hasActiveFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
//             }`}>
//             <SlidersHorizontal size={11} /> Filter
//             {hasActiveFilters && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
//           </button>

//           {/* Quick-stage pills */}
//           <button onClick={() => setQuickStage('')}
//             className={`text-[10px] px-2 py-1 rounded-md border font-semibold transition-all ${quickStage === '' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
//             All
//           </button>
//           {STATUS_ORDER.map(status => {
//             const cfg   = getCfg(status);
//             const count = leads.filter(l => l.status === status).length;
//             return (
//               <button key={status}
//                 onClick={() => setQuickStage(prev => prev === status ? '' : status)}
//                 className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 font-semibold transition-all ${
//                   quickStage === status ? `${cfg.bg} ${cfg.text} border-transparent` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}>
//                 <Tag size={9} />
//                 {STATUS_LABELS[status]} ({count})
//               </button>
//             );
//           })}
//         </div>

//         {/* View toggle */}
//         <div className="flex items-center bg-slate-100 rounded-md p-0.5 shrink-0">
//           {(['board', 'list', 'grid'] as const).map((v, i) => {
//             const icons  = [<Columns3 size={13} />, <List size={13} />, <LayoutGrid size={13} />];
//             const labels = ['Board', 'List', 'Grid'];
//             return (
//               <button key={v} onClick={() => setView(v)} title={labels[i]}
//                 className={`p-1.5 rounded-md transition-all ${view === v ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
//                 {icons[i]}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── FILTER BAR ── */}
//       {showFilters && (
//         <FilterBar filters={filters} onChange={updateFilters} onReset={() => setFilters(DEFAULT_FILTERS)} leads={filtered} />
//       )}

//       {/* ── MAIN CONTENT + SIDE PANELS ── */}
//       <div className="flex flex-1 overflow-hidden min-h-0">
//         <div className="flex-1 overflow-hidden min-w-0">
//           {filtered.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
//                 <Briefcase size={20} className="text-slate-300" />
//               </div>
//               <p className="text-[13px] font-bold text-slate-500">No deals found</p>
//               <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search or filters</p>
//               <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); setQuickStage(''); }}
//                 className="mt-3 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold">
//                 Clear filters
//               </button>
//               {lostValue > 0 && (
//                 <p className="mt-2 text-[10px] text-slate-400">Lost Value: ${lostValue.toLocaleString()}</p>
//               )}
//             </div>
//           ) : view === 'board' ? (
//             <BoardView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           ) : view === 'list' ? (
//             <ListView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           ) : (
//             <GridView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
//           )}
//         </div>

//         {showAnalytics && <AnalyticsPanel leads={leads} onClose={() => setShowAnalytics(false)} />}
//         {showActivity  && <ActivityFeed  activities={activities} leads={leads} onClose={() => setShowActivity(false)} />}
//       </div>

//       {/* ── DRAWER ── */}
//       <LeadDetailDrawer
//         lead={selectedLead}
//         isOpen={!!selectedLead}
//         onClose={() => setSelectedLead(null)}
//         onUpdate={fetchAllData}
//       />
//     </div>
//   );
// };

// export default Pipeline;


import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Building2, Columns3, List, LayoutGrid,
  RefreshCw, Briefcase, ChevronDown, Check,
  Zap, Phone, MessageSquare, CheckCircle2, XCircle,
  BarChart3, X, TrendingUp, DollarSign, Target,
  Clock, ArrowUpRight, SlidersHorizontal,
  Activity, Calendar, Tag, Filter
} from 'lucide-react';
import { STATUS_LABELS, type Lead, STATUS_ORDER, type LeadStatus } from '../Utils/types';
import { api } from '../Utils/api';
import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';

/* ─── STATUS CONFIG ──────────────────────────────────── */
const STATUS_CONFIG: Record<string, {
  color: string; bg: string; text: string;
  icon: React.ReactNode; gradient: string; hex: string;
}> = {
  new:         { color: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: <Zap size={11} />,           gradient: 'from-blue-500 to-blue-600',      hex: '#3b82f6' },
  contacted:   { color: 'bg-indigo-500',  bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: <Phone size={11} />,         gradient: 'from-indigo-500 to-indigo-600',  hex: '#6366f1' },
  negotiation: { color: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700',   icon: <MessageSquare size={11} />, gradient: 'from-amber-500 to-amber-600',    hex: '#f59e0b' },
  won:         { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={11} />,  gradient: 'from-emerald-500 to-emerald-600',hex: '#10b981' },
  lost:        { color: 'bg-slate-400',   bg: 'bg-slate-100',  text: 'text-slate-600',   icon: <XCircle size={11} />,       gradient: 'from-slate-400 to-slate-500',    hex: '#94a3b8' },
};
const getCfg = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.new;

/* ─── ACTIVITY HELPERS ───────────────────────────────── */
type ActivityEntry = { id: number; leadId: number; action: string; from?: string; to?: string; ts: number };

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const formatBackendActivity = (a: any): ActivityEntry => {
  let action = a.summary || a.activity_type;
  let from, to;
  if (a.summary && a.summary.includes('Stage updated:')) {
    const parts = a.summary.replace('Stage updated: ', '').split(' → ');
    if (parts.length === 2) {
      from = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[0]);
      to   = Object.keys(STATUS_LABELS).find(k => STATUS_LABELS[k as LeadStatus] === parts[1]);
      if (from && to) action = 'status_change';
    }
  }
  return { id: a.id, leadId: a.lead, action, from, to, ts: new Date(a.created_at).getTime() };
};

/* ─── ANALYTICS PANEL ────────────────────────────────── */
const AnalyticsPanel = ({ leads, onClose }: { leads: Lead[]; onClose: () => void }) => {
  const total    = leads.length || 1;
  const totalVal = leads.reduce((a, l) => a + parseFloat(l.value), 0);
  const wonLeads = leads.filter(l => l.status === 'won');
  const wonVal   = wonLeads.reduce((a, l) => a + parseFloat(l.value), 0);
  const winRate  = Math.round((wonLeads.length / total) * 100);
  const avgDeal  = totalVal / total;

  return (
    <div className="w-64 bg-white border-l border-slate-200/80 flex flex-col shrink-0 overflow-hidden shadow-sm">
      {/* Panel header — ConfigCard style */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 shrink-0" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
            <BarChart3 size={12} className="text-white" />
          </div>
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Analytics</span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
          <X size={13} />
        </button>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Deals',    value: leads.length,                      icon: <Briefcase size={11} />, gradient: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    text: 'text-blue-600' },
            { label: 'Win Rate', value: `${winRate}%`,                     icon: <Target size={11} />,    gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
            { label: 'Pipeline', value: `$${(totalVal/1000).toFixed(0)}k`, icon: <DollarSign size={11} />,gradient: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50',  border: 'border-indigo-100',  text: 'text-indigo-600' },
            { label: 'Avg Deal', value: `$${(avgDeal/1000).toFixed(0)}k`,  icon: <TrendingUp size={11} />,gradient: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-600' },
          ].map(k => (
            <div key={k.label} className={`rounded-xl p-2.5 border ${k.bg} ${k.border} hover:shadow-sm transition-all`}>
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${k.gradient} flex items-center justify-center mb-1.5 shadow-sm`}>
                <span className="text-white">{k.icon}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{k.label}</p>
              <p className="text-[14px] font-black text-slate-800">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Stage breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Stage Breakdown</p>
          </div>
          <div className="space-y-2">
            {STATUS_ORDER.map(status => {
              const count = leads.filter(l => l.status === status).length;
              const val   = leads.filter(l => l.status === status).reduce((a, l) => a + parseFloat(l.value), 0);
              const pct   = Math.round((count / total) * 100);
              const cfg   = getCfg(status);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`${cfg.color} w-1.5 h-1.5 rounded-full inline-block`} />
                      <span className="text-[11px] font-semibold text-slate-700">{STATUS_LABELS[status]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{count}</span>
                      <span className="text-[11px] font-black text-slate-600">${(val/1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cfg.gradient} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Won vs Lost */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Won vs Lost</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-black">Won</p>
              <p className="text-[13px] font-black text-emerald-700">${(wonVal/1000).toFixed(0)}k</p>
              <p className="text-[10px] text-emerald-500">{wonLeads.length} deals</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-xl p-2.5 border border-red-100">
              <p className="text-[10px] text-red-500 font-black">Lost</p>
              <p className="text-[13px] font-black text-red-600">
                ${(leads.filter(l=>l.status==='lost').reduce((a,l)=>a+parseFloat(l.value),0)/1000).toFixed(0)}k
              </p>
              <p className="text-[10px] text-red-400">{leads.filter(l=>l.status==='lost').length} deals</p>
            </div>
          </div>
        </div>

        {/* Top Deals */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-amber-400 rounded-full" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Top Deals</p>
          </div>
          <div className="space-y-1.5">
            {[...leads].sort((a,b)=>parseFloat(b.value)-parseFloat(a.value)).slice(0,4).map((lead, i) => {
              const cfg = getCfg(lead.status);
              return (
                <div key={lead.id} className="flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <span className={`w-5 h-5 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{lead.company}</p>
                  </div>
                  <span className="text-[11px] font-black text-slate-700 shrink-0">${parseFloat(lead.value).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── ACTIVITY FEED ──────────────────────────────────── */
const ActivityFeed = ({ activities, leads, onClose }: {
  activities: ActivityEntry[]; leads: Lead[]; onClose: () => void;
}) => {
  const getName = (id: number) => leads.find(l => l.id === id)?.name ?? 'Unknown';
  return (
    <div className="w-56 bg-white border-l border-slate-200/80 flex flex-col shrink-0 overflow-hidden shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 shrink-0" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
            <Activity size={12} className="text-white" />
          </div>
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Activity</span>
          {activities.length > 0 && (
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-1.5 py-0.5 rounded-full">{activities.length}</span>
          )}
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
          <X size={13} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-xl mt-2">
            <Activity size={20} className="text-slate-200 mb-2" />
            <p className="text-[11px] font-black text-slate-400">No activity yet</p>
            <p className="text-[10px] text-slate-300 mt-0.5 font-medium">Changes appear here</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-indigo-100" />
            <div className="space-y-3">
              {activities.map(a => {
                const fromCfg = a.from ? getCfg(a.from) : null;
                const toCfg   = a.to   ? getCfg(a.to)   : null;
                return (
                  <div key={a.id} className="flex gap-2 relative">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <ArrowUpRight size={8} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[11px] font-black text-slate-800 truncate">{getName(a.leadId)}</p>
                      {a.action === 'status_change' && fromCfg && toCfg ? (
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg ${fromCfg.bg} ${fromCfg.text}`}>{STATUS_LABELS[a.from as LeadStatus]}</span>
                          <span className="text-[9px] text-slate-400">→</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg ${toCfg.bg} ${toCfg.text}`}>{STATUS_LABELS[a.to as LeadStatus]}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{a.action}</p>
                      )}
                      <p className="text-[9px] text-slate-300 mt-0.5 flex items-center gap-1 font-medium">
                        <Clock size={7} />{timeAgo(a.ts)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── STATUS DROPDOWN ────────────────────────────────── */
const StatusDropdown = ({ currentStatus, leadId, onChangeStatus }: {
  currentStatus: LeadStatus; leadId: number;
  onChangeStatus: (id: number, s: LeadStatus) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = getCfg(currentStatus);
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setIsOpen(o => !o); }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${config.bg} ${config.text} hover:opacity-80 transition-all border border-transparent hover:border-current/20`}
      >
        {config.icon}
        {STATUS_LABELS[currentStatus]}
        <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-2xl shadow-lg border border-slate-200/80 py-1.5 z-50 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Move to stage</p>
            </div>
            {STATUS_ORDER.map(status => {
              const sc = getCfg(status);
              const isActive = status === currentStatus;
              return (
                <button key={status}
                  onClick={e => { e.stopPropagation(); onChangeStatus(leadId, status); setIsOpen(false); }}
                  disabled={isActive}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${sc.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white">{sc.icon}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">{STATUS_LABELS[status]}</span>
                  {isActive && <Check size={10} className="ml-auto text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── FILTER BAR ─────────────────────────────────────── */
type Filters = { status: LeadStatus | ''; minValue: string; maxValue: string; sortBy: string };
const FilterBar = ({ filters, onChange, onReset, leads }: {
  filters: Filters; onChange: (f: Partial<Filters>) => void;
  onReset: () => void; leads: Lead[];
}) => {
  const active = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
  const selectCls = "text-[11px] border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 font-medium transition-all";
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-100 flex-wrap shrink-0 shadow-sm">
      <div className="flex items-center gap-1.5 mr-1">
        <div className="p-1 rounded-lg bg-indigo-50">
          <Filter size={10} className="text-indigo-500" />
        </div>
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Filters</span>
      </div>
      <select value={filters.status} onChange={e => onChange({ status: e.target.value as LeadStatus | '' })} className={selectCls}>
        <option value="">All Stages</option>
        {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
        <DollarSign size={9} className="text-slate-400" />
        <input type="number" placeholder="Min" value={filters.minValue} onChange={e => onChange({ minValue: e.target.value })}
          className="w-14 text-[11px] outline-none text-slate-700 bg-transparent font-medium" />
      </div>
      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
        <DollarSign size={9} className="text-slate-400" />
        <input type="number" placeholder="Max" value={filters.maxValue} onChange={e => onChange({ maxValue: e.target.value })}
          className="w-14 text-[11px] outline-none text-slate-700 bg-transparent font-medium" />
      </div>
      <select value={filters.sortBy} onChange={e => onChange({ sortBy: e.target.value })} className={selectCls}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="value_high">Value: High → Low</option>
        <option value="value_low">Value: Low → High</option>
        <option value="name">Name A–Z</option>
      </select>
      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 ml-1">
        {leads.length} result{leads.length !== 1 ? 's' : ''}
      </span>
      {active && (
        <button onClick={onReset} className="ml-auto flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-black hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors">
          <X size={10} /> Reset
        </button>
      )}
    </div>
  );
};

/* ─── LEAD CARD ──────────────────────────────────────── */
const LeadCard = ({ lead, onSelect, onChangeStatus, onDragStart }: {
  lead: Lead; onSelect: () => void;
  onChangeStatus: (id: number, s: LeadStatus) => void;
  onDragStart?: (e: React.DragEvent, lead: Lead) => void;
}) => {
  const cfg      = getCfg(lead.status);
  const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, lead)}
      onClick={onSelect}
      className="bg-white rounded-2xl border border-slate-200/80 p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 transition-all select-none group overflow-hidden"
    >
      {/* top accent bar */}
      <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${cfg.gradient} mb-2.5 opacity-60 group-hover:opacity-100 transition-opacity`} />
      <div className="flex items-start gap-2 mb-2.5">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-black text-slate-800 text-[12px] truncate leading-tight">{lead.name}</h4>
          <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5 mt-0.5 font-medium">
            <Building2 size={8} />{lead.company}
          </p>
        </div>
      </div>
      <div className="mb-2.5" onClick={e => e.stopPropagation()}>
        <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[13px] font-black text-slate-800">${parseFloat(lead.value).toLocaleString()}</span>
        <span className="text-[9px] text-slate-400 flex items-center gap-0.5 font-medium">
          <Calendar size={8} />{new Date(lead.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

/* ─── BOARD VIEW ─────────────────────────────────────── */
const BoardView = ({ leads, onSelect, onChangeStatus }: {
  leads: Lead[]; onSelect: (l: Lead) => void;
  onChangeStatus: (id: number, s: LeadStatus) => void;
}) => {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragLead = useRef<Lead | null>(null);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    dragLead.current = lead;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (dragLead.current && dragLead.current.status !== status) {
      onChangeStatus(dragLead.current.id, status);
    }
    dragLead.current = null;
    setDragOver(null);
  };

  return (
    <div
      className="h-full p-3 gap-2.5"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${STATUS_ORDER.length}, minmax(0, 1fr))` }}
    >
      {STATUS_ORDER.map(status => {
        const statusLeads = leads.filter(l => l.status === status);
        const cfg         = getCfg(status);
        const isOver      = dragOver === status;
        const colTotal    = statusLeads.reduce((a, l) => a + parseFloat(l.value), 0);

        return (
          <div key={status}
            onDragOver={e => { e.preventDefault(); setDragOver(status); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, status as LeadStatus)}
            className={`flex flex-col rounded-2xl h-full min-h-0 transition-all duration-150 border overflow-hidden ${
              isOver
                ? 'ring-2 ring-indigo-400 ring-offset-1 bg-indigo-50/60 border-indigo-200'
                : 'bg-slate-100/60 border-slate-200/60'
            }`}
          >
            {/* Column top accent */}
            <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient} shrink-0`} />

            {/* Column header */}
            <div className="px-3 py-2.5 border-b border-slate-200/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-slate-700 text-[11px] truncate">{STATUS_LABELS[status]}</h3>
                    <span className="text-[9px] bg-white text-slate-500 font-black px-1.5 py-0.5 rounded-full border border-slate-200 shadow-sm shrink-0">
                      {statusLeads.length}
                    </span>
                  </div>
                  {colTotal > 0 && (
                    <p className="text-[9px] text-slate-400 font-medium">${colTotal.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            {isOver && (
              <div className="mx-2 mt-1.5 border-2 border-dashed border-indigo-300 rounded-xl p-1.5 text-center text-[10px] text-indigo-500 font-black bg-indigo-50/50 shrink-0">
                Drop here
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0 custom-scrollbar">
              {statusLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead}
                  onSelect={() => onSelect(lead)}
                  onChangeStatus={onChangeStatus}
                  onDragStart={handleDragStart}
                />
              ))}
              {statusLeads.length === 0 && !isOver && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white/40">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} opacity-20 flex items-center justify-center mb-1.5`}>
                    {cfg.icon}
                  </div>
                  <p className="text-[11px] font-black text-slate-400">No deals</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── LIST VIEW ──────────────────────────────────────── */
const ListView = ({ leads, onSelect, onChangeStatus }: {
  leads: Lead[]; onSelect: (l: Lead) => void;
  onChangeStatus: (id: number, s: LeadStatus) => void;
}) => (
  <div className="h-full overflow-auto custom-scrollbar">
    <table className="w-full">
      <thead className="bg-white sticky top-0 border-b border-slate-100 z-10 shadow-sm">
        <tr>
          {['Deal', 'Company', 'Status', 'Value', 'Created'].map(h => (
            <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {leads.map(lead => {
          const cfg      = getCfg(lead.status);
          const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          return (
            <tr key={lead.id} onClick={() => onSelect(lead)} className="hover:bg-indigo-50/30 cursor-pointer transition-colors group">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>{initials}</div>
                  <span className="text-[12px] font-black text-slate-800">{lead.name}</span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-[11px] text-slate-500 font-medium">{lead.company}</td>
              <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
              </td>
              <td className="px-4 py-2.5 text-[12px] font-black text-slate-800">${parseFloat(lead.value).toLocaleString()}</td>
              <td className="px-4 py-2.5 text-[10px] text-slate-400 font-medium">{new Date(lead.created_at).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/* ─── GRID VIEW ──────────────────────────────────────── */
const GridView = ({ leads, onSelect, onChangeStatus }: {
  leads: Lead[]; onSelect: (l: Lead) => void;
  onChangeStatus: (id: number, s: LeadStatus) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3 overflow-y-auto h-full content-start custom-scrollbar">
    {leads.map(lead => {
      const cfg      = getCfg(lead.status);
      const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      return (
        <div key={lead.id} onClick={() => onSelect(lead)}
          className="bg-white rounded-2xl border border-slate-200/80 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden">
          <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />
          <div className="p-3">
            <div className="flex items-start gap-2 mb-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-black text-[11px] shadow-sm shrink-0`}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-slate-800 text-[12px] truncate">{lead.name}</h3>
                <p className="text-[10px] text-slate-400 truncate font-medium">{lead.company}</p>
              </div>
            </div>
            <div className="mb-2.5" onClick={e => e.stopPropagation()}>
              <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-[13px] font-black text-slate-800">${parseFloat(lead.value).toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-medium">{new Date(lead.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── MAIN PIPELINE ──────────────────────────────────── */
const DEFAULT_FILTERS: Filters = { status: '', minValue: '', maxValue: '', sortBy: 'newest' };

export const Pipeline = () => {
  const navigate = useNavigate();
  const [leads, setLeads]                   = useState<Lead[]>([]);
  const [search, setSearch]                 = useState('');
  const [selectedLead, setSelectedLead]     = useState<Lead | null>(null);
  const [view, setView]                     = useState<'board' | 'list' | 'grid'>('board');
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [showFilters, setShowFilters]       = useState(false);
  const [showAnalytics, setShowAnalytics]   = useState(false);
  const [showActivity, setShowActivity]     = useState(false);
  const [filters, setFilters]               = useState<Filters>(DEFAULT_FILTERS);
  const [activities, setActivities]         = useState<ActivityEntry[]>([]);
  const [quickStage, setQuickStage]         = useState<LeadStatus | ''>('');

  /* ── fetch ── */
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [leadsData, actsData] = await Promise.all([
        api.getLeads(search),
        api.getActivities()
      ]);
      setLeads(leadsData);
      setActivities(actsData.map(formatBackendActivity));
    } catch(e) {
      console.error("Failed to fetch pipeline data:", e);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchAllData, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const savedView = localStorage.getItem('pipeline_view_mode') as 'board' | 'list' | 'grid' | null;
    if (savedView && ['board', 'list', 'grid'].includes(savedView)) setView(savedView);
  }, []);

  useEffect(() => {
    localStorage.setItem('pipeline_view_mode', view);
  }, [view]);

  /* ── status change ── */
  const handleChangeStatus = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const lead      = leads.find(l => l.id === leadId);
      const oldStatus = lead?.status;
      if (!oldStatus || oldStatus === newStatus) return;
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      await api.updateLeadStatus(leadId, newStatus);
      await api.createActivity({
        lead: leadId,
        activity_type: 'note',
        summary: `Stage updated: ${STATUS_LABELS[oldStatus as LeadStatus]} → ${STATUS_LABELS[newStatus]}`,
        description: `Pipeline stage moved from ${STATUS_LABELS[oldStatus as LeadStatus]} to ${STATUS_LABELS[newStatus]}.`
      });
      const updatedActsData = await api.getActivities();
      setActivities(updatedActsData.map(formatBackendActivity));
    } catch (e) {
      console.error('Failed to update status:', e);
      fetchAllData();
    }
  };

  const updateFilters = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

  /* ── filtering / sorting ── */
  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase();
      if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q)) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (quickStage && l.status !== quickStage) return false;
      const val = parseFloat(l.value);
      if (filters.minValue && val < parseFloat(filters.minValue)) return false;
      if (filters.maxValue && val > parseFloat(filters.maxValue)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'oldest')     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (filters.sortBy === 'value_high') return parseFloat(b.value) - parseFloat(a.value);
      if (filters.sortBy === 'value_low')  return parseFloat(a.value) - parseFloat(b.value);
      if (filters.sortBy === 'name')       return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  /* ── derived stats ── */
  const hasActiveFilters = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';
  const totalValue = leads.reduce((acc, l) => acc + parseFloat(l.value), 0);
  const wonCount   = leads.filter(l => l.status === 'won').length;
  const openCount  = leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
  const lostValue  = leads.filter(l => l.status === 'lost').reduce((acc, l) => acc + parseFloat(l.value), 0);
  const winRate    = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

      {/* ══════════════════════════════════════════════════
          BANNER — WorkflowMonitor style
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        >
          {/* icon block */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Briefcase className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Pipeline Command Center
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              {filtered.length} of {leads.length} deals · Drag cards between stages
            </p>
          </div>

          {/* KPI chips */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { label: 'Open',     value: openCount,                           gradient: 'rgba(255,255,255,0.12)' },
              { label: 'Won',      value: `${winRate}%`,                       gradient: 'rgba(16,185,129,0.25)' },
              { label: 'Pipeline', value: `$${(totalValue/1000).toFixed(0)}k`, gradient: 'rgba(255,255,255,0.12)' },
            ].map(k => (
              <div key={k.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-white"
                style={{ backgroundColor: k.gradient, border: '1px solid rgba(255,255,255,0.18)' }}>
                <span className="text-white/60">{k.label}</span>
                <span>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={fetchAllData}
              className={`p-2.5 rounded-xl text-white/70 hover:text-white transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <RefreshCw size={14} />
            </button>
            <button onClick={() => { setShowAnalytics(v => !v); setShowActivity(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black transition-all ${
                showAnalytics ? 'bg-white text-indigo-700 shadow-sm' : 'text-white hover:text-white'
              }`}
              style={!showAnalytics ? { backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' } : {}}>
              <BarChart3 size={13} /> Analytics
            </button>
            <button onClick={() => { setShowActivity(v => !v); setShowAnalytics(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black transition-all relative ${
                showActivity ? 'bg-white text-indigo-700 shadow-sm' : 'text-white'
              }`}
              style={!showActivity ? { backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' } : {}}>
              <Activity size={13} /> Activity
              {activities.length > 0 && !showActivity && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {activities.length > 9 ? '9+' : activities.length}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/pipeline/new')}
              className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-xl text-[12px] font-black transition-all shadow-sm active:scale-95">
              <Plus size={13} /> Add Deal
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TOOLBAR
      ══════════════════════════════════════════════════ */}
      <div className="mx-4 mt-3 anim-fade-2">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-slate-200 to-slate-100" />
          <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <input
                  type="text" placeholder="Search deals…"
                  className="w-44 pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 focus:bg-white transition-all"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Filter toggle */}
              <button onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black border transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}>
                <SlidersHorizontal size={11} /> Filter
                {hasActiveFilters && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
              </button>

              {/* Quick-stage pills */}
              <div className="flex items-center gap-1 flex-wrap">
                <button onClick={() => setQuickStage('')}
                  className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-black transition-all ${
                    quickStage === ''
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}>
                  All
                </button>
                {STATUS_ORDER.map(status => {
                  const cfg   = getCfg(status);
                  const count = leads.filter(l => l.status === status).length;
                  return (
                    <button key={status}
                      onClick={() => setQuickStage(prev => prev === status ? '' : status)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-xl border flex items-center gap-1 font-black transition-all ${
                        quickStage === status
                          ? `${cfg.bg} ${cfg.text} border-transparent shadow-sm`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}>
                      <Tag size={9} />
                      {STATUS_LABELS[status]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
              {(['board', 'list', 'grid'] as const).map((v, i) => {
                const icons  = [<Columns3 size={13} />, <List size={13} />, <LayoutGrid size={13} />];
                const labels = ['Board', 'List', 'Grid'];
                return (
                  <button key={v} onClick={() => setView(v)} title={labels[i]}
                    className={`p-2 rounded-lg transition-all ${
                      view === v
                        ? 'bg-white shadow-sm text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}>
                    {icons[i]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      {showFilters && (
        <div className="mx-4 mt-2">
          <FilterBar filters={filters} onChange={updateFilters} onReset={() => setFilters(DEFAULT_FILTERS)} leads={filtered} />
        </div>
      )}

      {/* ── MAIN CONTENT + SIDE PANELS ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 mt-3 mx-4 mb-4 gap-3 anim-fade-3">
        <div className="flex-1 overflow-hidden min-w-0 rounded-2xl">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                <Briefcase size={22} className="text-slate-300" />
              </div>
              <p className="text-[13px] font-black text-slate-500">No deals found</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Try adjusting your search or filters</p>
              <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); setQuickStage(''); }}
                className="mt-3 text-[11px] text-indigo-600 hover:text-indigo-800 font-black bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
                Clear filters
              </button>
              {lostValue > 0 && (
                <p className="mt-2 text-[10px] text-slate-400 font-medium">Lost Value: ${lostValue.toLocaleString()}</p>
              )}
            </div>
          ) : view === 'board' ? (
            <BoardView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
          ) : view === 'list' ? (
            <div className="h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <ListView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
            </div>
          ) : (
            <GridView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
          )}
        </div>

        {showAnalytics && <AnalyticsPanel leads={leads} onClose={() => setShowAnalytics(false)} />}
        {showActivity  && <ActivityFeed  activities={activities} leads={leads} onClose={() => setShowActivity(false)} />}
      </div>

      {/* ── DRAWER ── */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={fetchAllData}
      />
    </div>
  );
};

export default Pipeline;