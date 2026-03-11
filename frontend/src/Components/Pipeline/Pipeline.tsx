// import React, { useEffect, useState } from 'react';
// import { Plus, ArrowRight, Search } from 'lucide-react';
// import { STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
// import { api } from '../Utils/api';
// import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';
// import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

// const STATUS_COLORS: Record<string, string> = {
//   new: 'bg-blue-400', mql: 'bg-indigo-500', sql: 'bg-purple-500',
//   negotiation: 'bg-amber-400', won: 'bg-emerald-500', lost: 'bg-red-400',
// };

// export const Pipeline = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [search, setSearch] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

//   const fetchLeads = async () => { api.getLeads(search).then(setLeads); };
//   useEffect(() => { const timer = setTimeout(fetchLeads, 300); return () => clearTimeout(timer); }, [search]);

//   const advanceStage = async (e: React.MouseEvent, lead: Lead) => {
//     e.stopPropagation();
//     const idx = STATUS_ORDER.indexOf(lead.status);
//     if (idx < STATUS_ORDER.length - 1) { await api.updateLeadStatus(lead.id, STATUS_ORDER[idx + 1]); fetchLeads(); }
//   };

//   return (
//     <div className="p-8 h-full flex flex-col overflow-hidden relative">
//       <header className="flex justify-between items-center mb-6 shrink-0">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Deal Pipeline</h2>
//           <p className="text-slate-500 mt-1">Track MQLs to SQLs to Close.</p>
//         </div>
//         <div className="flex gap-3">
//           <div className="relative group">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
//             <input type="text" placeholder="Search..." className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
//           </div>
//           <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-indigo-700 transition">
//             <Plus size={18} /> Add Deal
//           </button>
//         </div>
//       </header>

//       <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
//         <div className="flex gap-5 h-full min-w-[1600px]">
//           {STATUS_ORDER.map((status) => {
//             const statusLeads = leads.filter(l => l.status === status);
//             return (
//               <div key={status} className="flex-1 flex flex-col min-w-[260px] rounded-2xl bg-white/60 border border-slate-200/60 shadow-sm">
//                 <div className="p-4 rounded-t-2xl relative overflow-hidden">
//                   <div className={`absolute top-0 left-0 right-0 h-1.5 ${STATUS_COLORS[status]}`} />
//                   <div className="flex justify-between items-center mt-1">
//                     <h3 className="font-bold text-slate-700 text-sm">{STATUS_LABELS[status]}</h3>
//                     <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-lg font-bold border border-slate-200">{statusLeads.length}</span>
//                   </div>
//                 </div>

//                 <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
//                   {statusLeads.map(lead => (
//                     <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md cursor-pointer group transition-all">
//                       <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
//                       <p className="text-xs text-slate-500 mb-3 truncate">{lead.company}</p>
//                       <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3"><p className="text-sm font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</p></div>
//                       <div className="flex items-center justify-between border-t border-slate-50 pt-2">
//                         <span className="text-[10px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
//                         {status !== 'lost' && status !== 'won' && (
//                           <button onClick={(e) => advanceStage(e, lead)} className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-bold hover:bg-indigo-100 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">Advance <ArrowRight size={10}/></button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={async (d:any) => { await api.createLead(d); fetchLeads(); }} />
//       <LeadDetailDrawer lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} onUpdate={() => { fetchLeads(); if(selectedLead) api.getLead(selectedLead.id).then(setSelectedLead); }} />
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Plus, ArrowRight, Search, Building2, Calendar, DollarSign, MoreVertical } from 'lucide-react';
import { STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
import { api } from '../Utils/api';
import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';
import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

const STATUS_CONFIG: Record<string, { dot: string; badge: string; text: string; border: string }> = {
  new: { dot: 'bg-blue-500', badge: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  mql: { dot: 'bg-indigo-500', badge: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  sql: { dot: 'bg-purple-500', badge: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  negotiation: { dot: 'bg-amber-500', badge: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  won: { dot: 'bg-emerald-500', badge: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  lost: { dot: 'bg-rose-500', badge: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
};

export const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => { api.getLeads(search).then(setLeads); };
  
  useEffect(() => { 
    const timer = setTimeout(fetchLeads, 300); 
    return () => clearTimeout(timer); 
  }, [search]);

  const advanceStage = async (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(lead.status);
    if (idx < STATUS_ORDER.length - 1) { 
      await api.updateLeadStatus(lead.id, STATUS_ORDER[idx + 1]); 
      fetchLeads(); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* Top Header Section */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Deal Pipeline</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your active deals and track progress.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads, companies..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus size={16} /> Add Deal
          </button>
        </div>
      </header>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
        <div className="flex gap-5 h-full min-w-max pb-4">
          
          {STATUS_ORDER.map((status) => {
            const statusLeads = leads.filter(l => l.status === status);
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

            return (
              <div key={status} className="flex flex-col w-[320px] bg-slate-100/70 rounded-xl border border-slate-200/80 shrink-0 h-full max-h-full">
                
                {/* Column Header */}
                <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-100 rounded-t-xl shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                      <h3 className="font-semibold text-slate-700 text-sm tracking-wide">
                        {STATUS_LABELS[status]}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                      {statusLeads.length}
                    </span>
                  </div>
                </div>

                {/* Column Body / Cards List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {statusLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)} 
                      className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer group transition-all duration-200 relative"
                    >
                      {/* Top Row: Company & Menu */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Building2 size={14} />
                          <span className="text-xs font-medium truncate max-w-[180px]">{lead.company}</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Lead Name */}
                      <h4 className="font-bold text-slate-800 text-base mb-3 leading-snug">
                        {lead.name}
                      </h4>

                      {/* Value Tag */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${config.badge} ${config.text} border ${config.border}`}>
                          <DollarSign size={12} strokeWidth={3} />
                          <span className="text-xs font-bold">
                            {parseFloat(lead.value).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Date & Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={12} />
                          <span className="text-[11px] font-medium">
                            {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        
                        {/* Static, visible Advance button */}
                        {status !== 'lost' && status !== 'won' && (
                          <button 
                            onClick={(e) => advanceStage(e, lead)} 
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-blue-200 transition-colors"
                          >
                            Advance <ArrowRight size={12} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {statusLeads.length === 0 && (
                    <div className="p-4 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center text-slate-400 mt-2">
                      <span className="text-sm font-medium">No leads in this stage</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={async (d:any) => { await api.createLead(d); fetchLeads(); }} 
      />
      <LeadDetailDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onUpdate={() => { 
          fetchLeads(); 
          if(selectedLead) api.getLead(selectedLead.id).then(setSelectedLead); 
        }} 
      />
    </div>
  );
};