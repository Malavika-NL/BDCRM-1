// import React, { useEffect, useState } from 'react';
// import { Plus, ArrowRight, Search, Building2, Calendar, DollarSign, MoreVertical } from 'lucide-react';
// import { STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
// import { api } from '../Utils/api';
// import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';
// import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

// const STATUS_CONFIG: Record<string, { dot: string; badge: string; text: string; border: string }> = {
//   new: { dot: 'bg-blue-500', badge: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
//   mql: { dot: 'bg-indigo-500', badge: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
//   sql: { dot: 'bg-purple-500', badge: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
//   negotiation: { dot: 'bg-amber-500', badge: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
//   won: { dot: 'bg-emerald-500', badge: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
//   lost: { dot: 'bg-rose-500', badge: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
// };

// export const Pipeline = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [search, setSearch] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

//   const fetchLeads = async () => { api.getLeads(search).then(setLeads); };
  
//   useEffect(() => { 
//     const timer = setTimeout(fetchLeads, 300); 
//     return () => clearTimeout(timer); 
//   }, [search]);

//   const advanceStage = async (e: React.MouseEvent, lead: Lead) => {
//     e.stopPropagation();
//     const idx = STATUS_ORDER.indexOf(lead.status);
//     if (idx < STATUS_ORDER.length - 1) { 
//       await api.updateLeadStatus(lead.id, STATUS_ORDER[idx + 1]); 
//       fetchLeads(); 
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
//       {/* Top Header Section */}
//       <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Deal Pipeline</h2>
//           <p className="text-sm text-slate-500 mt-1 font-medium">Manage your active deals and track progress.</p>
//         </div>
        
//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <div className="relative group flex-1 md:w-72">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search leads, companies..." 
//               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//             />
//           </div>
//           <button 
//             onClick={() => setIsAddModalOpen(true)} 
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
//           >
//             <Plus size={16} /> Add Deal
//           </button>
//         </div>
//       </header>

//       {/* Kanban Board Container */}
//       <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
//         <div className="flex gap-5 h-full min-w-max pb-4">
          
//           {STATUS_ORDER.map((status) => {
//             const statusLeads = leads.filter(l => l.status === status);
//             const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

//             return (
//               <div key={status} className="flex flex-col w-[320px] bg-slate-100/70 rounded-xl border border-slate-200/80 shrink-0 h-full max-h-full">
                
//                 {/* Column Header */}
//                 <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-100 rounded-t-xl shrink-0">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
//                       <h3 className="font-semibold text-slate-700 text-sm tracking-wide">
//                         {STATUS_LABELS[status]}
//                       </h3>
//                     </div>
//                     <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
//                       {statusLeads.length}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Column Body / Cards List */}
//                 <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
//                   {statusLeads.map(lead => (
//                     <div 
//                       key={lead.id} 
//                       onClick={() => setSelectedLead(lead)} 
//                       className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer group transition-all duration-200 relative"
//                     >
//                       {/* Top Row: Company & Menu */}
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex items-center gap-1.5 text-slate-500">
//                           <Building2 size={14} />
//                           <span className="text-xs font-medium truncate max-w-[180px]">{lead.company}</span>
//                         </div>
//                         <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors">
//                           <MoreVertical size={16} />
//                         </button>
//                       </div>

//                       {/* Lead Name */}
//                       <h4 className="font-bold text-slate-800 text-base mb-3 leading-snug">
//                         {lead.name}
//                       </h4>

//                       {/* Value Tag */}
//                       <div className="flex items-center gap-1.5 mb-4">
//                         <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${config.badge} ${config.text} border ${config.border}`}>
//                           <DollarSign size={12} strokeWidth={3} />
//                           <span className="text-xs font-bold">
//                             {parseFloat(lead.value).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Bottom Row: Date & Action */}
//                       <div className="flex items-center justify-between pt-3 border-t border-slate-100">
//                         <div className="flex items-center gap-1.5 text-slate-400">
//                           <Calendar size={12} />
//                           <span className="text-[11px] font-medium">
//                             {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                           </span>
//                         </div>
                        
//                         {/* Static, visible Advance button */}
//                         {status !== 'lost' && status !== 'won' && (
//                           <button 
//                             onClick={(e) => advanceStage(e, lead)} 
//                             className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-blue-200 transition-colors"
//                           >
//                             Advance <ArrowRight size={12} strokeWidth={2.5} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {/* Empty State */}
//                   {statusLeads.length === 0 && (
//                     <div className="p-4 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400 mt-2">
//                       <span className="text-sm font-medium">No leads in this stage</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <AddLeadModal 
//         isOpen={isAddModalOpen} 
//         onClose={() => setIsAddModalOpen(false)} 
//         onSubmit={async (d:any) => { await api.createLead(d); fetchLeads(); }} 
//       />
//       <LeadDetailDrawer 
//         lead={selectedLead} 
//         isOpen={!!selectedLead} 
//         onClose={() => setSelectedLead(null)} 
//         onUpdate={() => { 
//           fetchLeads(); 
//           if(selectedLead) api.getLead(selectedLead.id).then(setSelectedLead); 
//         }} 
//       />
//     </div>
//   );
// };

import React, { useEffect, useState, useRef } from 'react';
import {
  Plus, Search, Building2, Columns3, List, LayoutGrid,
  RefreshCw, Briefcase, ChevronDown, Check,
  Zap, Phone, MessageSquare, CheckCircle2, XCircle,
  BarChart3, X, TrendingUp, DollarSign, Target,
  Clock, ArrowUpRight, Filter, SlidersHorizontal,
  Activity, Calendar, Tag
} from 'lucide-react';
import { STATUS_LABELS, type Lead, STATUS_ORDER, type LeadStatus } from '../Utils/types';
import { api } from '../Utils/api';
import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';
import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

/* ─── STATUS CONFIG ──────────────────────────────────── */
const STATUS_CONFIG: Record<string, {
  color: string; bg: string; text: string;
  icon: React.ReactNode; gradient: string; hex: string;
}> = {
  new:         { color: 'bg-blue-500',    bg: 'bg-blue-100',    text: 'text-blue-700',    icon: <Zap size={14} />,          gradient: 'from-blue-500 to-blue-600',      hex: '#3b82f6' },
  contacted:   { color: 'bg-indigo-500',  bg: 'bg-indigo-100',  text: 'text-indigo-700',  icon: <Phone size={14} />,        gradient: 'from-indigo-500 to-indigo-600',  hex: '#6366f1' },
  negotiation: { color: 'bg-amber-500',   bg: 'bg-amber-100',   text: 'text-amber-700',   icon: <MessageSquare size={14} />,gradient: 'from-amber-500 to-amber-600',    hex: '#f59e0b' },
  won:         { color: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 size={14} />, gradient: 'from-emerald-500 to-emerald-600',hex: '#10b981' },
  lost:        { color: 'bg-gray-400',    bg: 'bg-gray-100',    text: 'text-gray-600',    icon: <XCircle size={14} />,      gradient: 'from-gray-400 to-gray-500',      hex: '#9ca3af' },
};
const getCfg = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.new;

/* ─── ACTIVITY HELPERS ───────────────────────────────── */
type ActivityEntry = { id: number; leadId: number; action: string; from?: string; to?: string; ts: number };
let activityCounter = 0;
const makeActivity = (leadId: number, action: string, from?: string, to?: string): ActivityEntry => ({
  id: ++activityCounter, leadId, action, from, to, ts: Date.now(),
});
const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

/* ─── ANALYTICS PANEL ────────────────────────────────── */
const AnalyticsPanel = ({ leads, onClose }: { leads: Lead[]; onClose: () => void }) => {
  const total = leads.length || 1;
  const totalVal = leads.reduce((a, l) => a + parseFloat(l.value), 0);
  const wonLeads = leads.filter(l => l.status === 'won');
  const wonVal = wonLeads.reduce((a, l) => a + parseFloat(l.value), 0);
  const winRate = Math.round((wonLeads.length / total) * 100);
  const avgDeal = totalVal / total;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-900 text-sm">Analytics</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Deals', value: leads.length, icon: <Briefcase size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Win Rate', value: `${winRate}%`, icon: <Target size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pipeline', value: `$${(totalVal / 1000).toFixed(0)}k`, icon: <DollarSign size={14} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Avg Deal', value: `$${(avgDeal / 1000).toFixed(0)}k`, icon: <TrendingUp size={14} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(k => (
            <div key={k.label} className="bg-gray-50 rounded-xl p-3">
              <div className={`w-7 h-7 rounded-lg ${k.bg} ${k.color} flex items-center justify-center mb-2`}>{k.icon}</div>
              <p className="text-xs text-gray-500 mb-0.5">{k.label}</p>
              <p className="text-lg font-bold text-gray-900">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Stage Breakdown */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stage Breakdown</p>
          <div className="space-y-2.5">
            {STATUS_ORDER.map(status => {
              const count = leads.filter(l => l.status === status).length;
              const val = leads.filter(l => l.status === status).reduce((a, l) => a + parseFloat(l.value), 0);
              const pct = Math.round((count / total) * 100);
              const cfg = getCfg(status);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`${cfg.color} w-2 h-2 rounded-full inline-block`} />
                      <span className="text-xs font-medium text-gray-700">{STATUS_LABELS[status]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{count} deals</span>
                      <span className="text-xs font-semibold text-gray-700">${(val / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cfg.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Won vs Lost */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Won vs Lost Value</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium mb-1">Won</p>
              <p className="text-base font-bold text-emerald-700">${(wonVal / 1000).toFixed(0)}k</p>
              <p className="text-xs text-emerald-500">{wonLeads.length} deals</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-xl p-3 border border-red-100">
              <p className="text-xs text-red-500 font-medium mb-1">Lost</p>
              <p className="text-base font-bold text-red-600">
                ${(leads.filter(l => l.status === 'lost').reduce((a, l) => a + parseFloat(l.value), 0) / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-red-400">{leads.filter(l => l.status === 'lost').length} deals</p>
            </div>
          </div>
        </div>

        {/* Top deals */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Deals by Value</p>
          <div className="space-y-2">
            {[...leads].sort((a, b) => parseFloat(b.value) - parseFloat(a.value)).slice(0, 4).map(lead => {
              const cfg = getCfg(lead.status);
              return (
                <div key={lead.id} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{lead.company}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-700 shrink-0">${parseFloat(lead.value).toLocaleString()}</span>
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
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-indigo-600" />
          <span className="font-semibold text-gray-900 text-sm">Activity</span>
          {activities.length > 0 && (
            <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">{activities.length}</span>
          )}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 p-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity size={32} className="text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">No activity yet</p>
            <p className="text-xs text-gray-300 mt-1">Changes will appear here</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4">
              {[...activities].reverse().map(a => {
                const fromCfg = a.from ? getCfg(a.from) : null;
                const toCfg = a.to ? getCfg(a.to) : null;
                return (
                  <div key={a.id} className="flex gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center shrink-0 z-10">
                      <ArrowUpRight size={10} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs font-semibold text-gray-800 truncate">{getName(a.leadId)}</p>
                      {a.action === 'status_change' && fromCfg && toCfg ? (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${fromCfg.bg} ${fromCfg.text}`}>
                            {STATUS_LABELS[a.from as LeadStatus]}
                          </span>
                          <span className="text-[10px] text-gray-400">→</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${toCfg.bg} ${toCfg.text}`}>
                            {STATUS_LABELS[a.to as LeadStatus]}
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500 mt-0.5">{a.action}</p>
                      )}
                      <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                        <Clock size={8} />{timeAgo(a.ts)}
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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.text} hover:opacity-80 transition-all`}
      >
        {config.icon}
        {STATUS_LABELS[currentStatus]}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">Change to</p>
            </div>
            {STATUS_ORDER.map(status => {
              const sc = getCfg(status);
              const isActive = status === currentStatus;
              return (
                <button key={status}
                  onClick={e => { e.stopPropagation(); onChangeStatus(leadId, status); setIsOpen(false); }}
                  disabled={isActive}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`w-7 h-7 rounded-lg ${sc.bg} ${sc.text} flex items-center justify-center`}>{sc.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{STATUS_LABELS[status]}</span>
                  {isActive && <Check size={14} className="ml-auto text-green-500" />}
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
  return (
    <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 border-b border-blue-100">
      <Filter size={14} className="text-blue-500 shrink-0" />
      <span className="text-xs font-semibold text-blue-600 mr-1">Filters</span>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={e => onChange({ status: e.target.value as LeadStatus | '' })}
        className="text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">All Stages</option>
        {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>

      {/* Min value */}
      <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-1.5">
        <DollarSign size={11} className="text-gray-400" />
        <input
          type="number" placeholder="Min value"
          value={filters.minValue}
          onChange={e => onChange({ minValue: e.target.value })}
          className="w-20 text-xs outline-none text-gray-700"
        />
      </div>

      {/* Max value */}
      <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-1.5">
        <DollarSign size={11} className="text-gray-400" />
        <input
          type="number" placeholder="Max value"
          value={filters.maxValue}
          onChange={e => onChange({ maxValue: e.target.value })}
          className="w-20 text-xs outline-none text-gray-700"
        />
      </div>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={e => onChange({ sortBy: e.target.value })}
        className="text-xs border border-blue-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="value_high">Value: High → Low</option>
        <option value="value_low">Value: Low → High</option>
        <option value="name">Name A–Z</option>
      </select>

      <span className="text-xs text-blue-500 font-medium ml-1">{leads.length} result{leads.length !== 1 ? 's' : ''}</span>

      {active && (
        <button onClick={onReset} className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
          <X size={12} />Reset
        </button>
      )}
    </div>
  );
};

/* ─── LEAD CARD (with drag) ──────────────────────────── */
const LeadCard = ({ lead, onSelect, onChangeStatus, onDragStart }: {
  lead: Lead; onSelect: () => void;
  onChangeStatus: (id: number, s: LeadStatus) => void;
  onDragStart?: (e: React.DragEvent, lead: Lead) => void;
}) => {
  const cfg = getCfg(lead.status);
  const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, lead)}
      onClick={onSelect}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 transition-all select-none"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-sm font-bold shrink-0`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{lead.name}</h4>
          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
            <Building2 size={10} />{lead.company}
          </p>
        </div>
      </div>
      <div className="mb-3" onClick={e => e.stopPropagation()}>
        <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-900">${parseFloat(lead.value).toLocaleString()}</span>
        <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

/* ─── BOARD VIEW (drag & drop) ───────────────────────── */
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
    <div className="flex h-full overflow-x-auto p-4 gap-4">
      {STATUS_ORDER.map(status => {
        const statusLeads = leads.filter(l => l.status === status);
        const cfg = getCfg(status);
        const isOver = dragOver === status;
        const colTotal = statusLeads.reduce((a, l) => a + parseFloat(l.value), 0);

        return (
          <div key={status}
            onDragOver={e => { e.preventDefault(); setDragOver(status); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, status as LeadStatus)}
            className={`flex flex-col w-[300px] rounded-xl shrink-0 h-full transition-all duration-150 ${isOver ? 'bg-blue-50 ring-2 ring-blue-300 ring-offset-1' : 'bg-gray-100'}`}
          >
            {/* Column header */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white`}>
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{STATUS_LABELS[status]}</h3>
                    <span className="text-xs bg-white text-gray-500 font-semibold px-1.5 py-0.5 rounded-full border border-gray-200">{statusLeads.length}</span>
                  </div>
                  {colTotal > 0 && <p className="text-xs text-gray-400">${colTotal.toLocaleString()}</p>}
                </div>
              </div>
            </div>

            {/* Drop zone hint */}
            {isOver && (
              <div className="mx-2 mt-2 border-2 border-dashed border-blue-300 rounded-lg p-3 text-center text-xs text-blue-500 font-medium bg-blue-50/50">
                Drop here → {STATUS_LABELS[status]}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {statusLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead}
                  onSelect={() => onSelect(lead)}
                  onChangeStatus={onChangeStatus}
                  onDragStart={handleDragStart}
                />
              ))}
              {statusLeads.length === 0 && !isOver && (
                <div className="flex items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm">No deals</p>
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
  <div className="h-full overflow-auto">
    <table className="w-full">
      <thead className="bg-gray-50 sticky top-0">
        <tr className="border-b border-gray-200">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Deal</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {leads.map(lead => {
          const cfg = getCfg(lead.status);
          const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          return (
            <tr key={lead.id} onClick={() => onSelect(lead)} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.text} flex items-center justify-center text-xs font-bold`}>{initials}</div>
                  <span className="font-medium text-gray-900">{lead.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{lead.company}</td>
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">${parseFloat(lead.value).toLocaleString()}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 overflow-y-auto h-full">
    {leads.map(lead => {
      const cfg = getCfg(lead.status);
      const initials = lead.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      return (
        <div key={lead.id} onClick={() => onSelect(lead)}
          className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-bold`}>
              {initials}
            </div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{lead.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{lead.company}</p>
          <div className="mb-4" onClick={e => e.stopPropagation()}>
            <StatusDropdown currentStatus={lead.status} leadId={lead.id} onChangeStatus={onChangeStatus} />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xl font-bold text-gray-900">${parseFloat(lead.value).toLocaleString()}</p>
            <p className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── MAIN PIPELINE ──────────────────────────────────── */
const DEFAULT_FILTERS: Filters = { status: '', minValue: '', maxValue: '', sortBy: 'newest' };

export const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [view, setView] = useState<'board' | 'list' | 'grid'>('board');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  const fetchLeads = async () => {
    setIsRefreshing(true);
    const data = await api.getLeads(search);
    setLeads(data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleChangeStatus = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      const oldStatus = lead?.status;
      await api.updateLeadStatus(leadId, newStatus);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      // Log activity
      if (oldStatus && oldStatus !== newStatus) {
        setActivities(prev => [...prev, makeActivity(leadId, 'status_change', oldStatus, newStatus)]);
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const updateFilters = (patch: Partial<Filters>) => setFilters(f => ({ ...f, ...patch }));

  // Apply search + filters + sort
  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase();
      if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q)) return false;
      if (filters.status && l.status !== filters.status) return false;
      const val = parseFloat(l.value);
      if (filters.minValue && val < parseFloat(filters.minValue)) return false;
      if (filters.maxValue && val > parseFloat(filters.maxValue)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (filters.sortBy === 'value_high') return parseFloat(b.value) - parseFloat(a.value);
      if (filters.sortBy === 'value_low') return parseFloat(a.value) - parseFloat(b.value);
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
    });

  const hasActiveFilters = filters.status || filters.minValue || filters.maxValue || filters.sortBy !== 'newest';

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
            <p className="text-sm text-gray-500">
              Drag cards to move • {filtered.length} of {leads.length} deals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLeads}
              className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg ${isRefreshing ? 'animate-spin' : ''}`}>
              <RefreshCw size={18} />
            </button>
            {/* Analytics toggle */}
            <button onClick={() => { setShowAnalytics(v => !v); setShowActivity(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showAnalytics ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <BarChart3 size={16} />
              Analytics
            </button>
            {/* Activity toggle */}
            <button onClick={() => { setShowActivity(v => !v); setShowAnalytics(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${showActivity ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Activity size={16} />
              Activity
              {activities.length > 0 && !showActivity && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activities.length > 9 ? '9+' : activities.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus size={16} />
              Add Deal
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text" placeholder="Search deals..."
                className="w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${showFilters || hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              <SlidersHorizontal size={15} />
              Filter
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['board', 'list', 'grid'] as const).map((v, i) => {
              const icons = [<Columns3 size={16} />, <List size={16} />, <LayoutGrid size={16} />];
              return (
                <button key={v} onClick={() => setView(v)}
                  className={`p-2 rounded-md ${view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                  {icons[i]}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── FILTER BAR ── */}
      {showFilters && (
        <FilterBar
          filters={filters}
          onChange={updateFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          leads={filtered}
        />
      )}

      {/* ── MAIN CONTENT (board + side panels) ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Briefcase size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No deals found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
              <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); }}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Clear filters
              </button>
            </div>
          ) : view === 'board' ? (
            <BoardView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
          ) : view === 'list' ? (
            <ListView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
          ) : (
            <GridView leads={filtered} onSelect={setSelectedLead} onChangeStatus={handleChangeStatus} />
          )}
        </div>

        {/* ── SIDE PANELS ── */}
        {showAnalytics && (
          <AnalyticsPanel leads={leads} onClose={() => setShowAnalytics(false)} />
        )}
        {showActivity && (
          <ActivityFeed activities={activities} leads={leads} onClose={() => setShowActivity(false)} />
        )}
      </div>

      {/* ── MODALS ── */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (d: any) => {
          await api.createLead(d);
          fetchLeads();
          setActivities(prev => [...prev, makeActivity(0, 'Deal created')]);
        }}
      />
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={fetchLeads}
      />
    </div>
  );
};

export default Pipeline;
