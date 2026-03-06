// import React, { useEffect, useState } from 'react';
// import { Plus, ArrowRight, Search, Filter, MoreHorizontal } from 'lucide-react';
// import { STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
// import { api } from '../Utils/api';
// import { AddLeadModal } from '../AddLeadModel/AddLeadModel';
// import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';

// const STATUS_COLORS: Record<string, { bar: string; badge: string; dot: string }> = {
//   new: { bar: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
//   contacted: { bar: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
//   negotiation: { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
//   won: { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
//   lost: { bar: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
// };

// export const Pipeline = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [search, setSearch] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

//   const fetchLeads = async () => {
//     try { const data = await api.getLeads(search); setLeads(data); }
//     catch (err) { console.error(err); }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => fetchLeads(), 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const handleCreate = async (data: any) => { await api.createLead(data); fetchLeads(); };

//   const handleDrawerUpdate = () => {
//     fetchLeads();
//     if (selectedLead) api.getLead(selectedLead.id).then(setSelectedLead);
//   };

//   const advanceStage = async (e: React.MouseEvent, lead: Lead) => {
//     e.stopPropagation();
//     const idx = STATUS_ORDER.indexOf(lead.status);
//     if (idx < STATUS_ORDER.length - 1) {
//       await api.updateLeadStatus(lead.id, STATUS_ORDER[idx + 1]);
//       fetchLeads();
//     }
//   };

//   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   return (
//     <div className="p-8 h-full flex flex-col overflow-hidden relative">
//       {/* Header */}
//       <header className="flex justify-between items-center mb-6 shrink-0">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Deal Pipeline</h2>
//           <p className="text-slate-500 mt-1">Track opportunities across every stage.</p>
//         </div>
//         <div className="flex gap-3 items-center">
//           <div className="relative group">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
//             <input
//               type="text"
//               placeholder="Search leads, companies..."
//               className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-72 transition-all shadow-sm bg-white"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-white text-slate-500 hover:text-slate-700 transition shadow-sm bg-white">
//             <Filter size={18} />
//           </button>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md font-medium"
//           >
//             <Plus size={18} /> Add Deal
//           </button>
//         </div>
//       </header>

//       {/* Kanban Board */}
//       <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
//         <div className="flex gap-5 h-full min-w-[1400px]">
//           {STATUS_ORDER.map((status) => {
//             const statusLeads = leads.filter(l => l.status === status);
//             const colors = STATUS_COLORS[status];
//             const totalValue = statusLeads.reduce((s, l) => s + parseFloat(l.value), 0);

//             return (
//               <div key={status} className="flex-1 flex flex-col min-w-[280px] rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/60">
//                 {/* Column Header */}
//                 <div className="p-4 rounded-t-2xl relative overflow-hidden">
//                   <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bar}`} />
//                   <div className="flex justify-between items-center mt-1">
//                     <div className="flex items-center gap-2.5">
//                       <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
//                       <h3 className="font-bold text-slate-700">{STATUS_LABELS[status]}</h3>
//                       <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-bold">
//                         {statusLeads.length}
//                       </span>
//                     </div>
//                     <button className="text-slate-400 hover:text-slate-600 transition"><MoreHorizontal size={16} /></button>
//                   </div>
//                   <p className="text-xs text-slate-400 mt-1 ml-5">${totalValue.toLocaleString()} total</p>
//                 </div>

//                 {/* Cards Container */}
//                 <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
//                   {statusLeads.map(lead => (
//                     <div
//                       key={lead.id}
//                       onClick={() => setSelectedLead(lead)}
//                       className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 cursor-pointer transition-all duration-200 group relative"
//                     >
//                       {/* Top Row */}
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
//                             {getInitials(lead.name)}
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-slate-800 text-sm">{lead.name}</h4>
//                             <p className="text-xs text-slate-500">{lead.company}</p>
//                           </div>
//                         </div>
//                         {lead.tasks && lead.tasks.some(t => !t.is_completed) && (
//                           <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/30" title="Pending Tasks" />
//                         )}
//                       </div>

//                       {/* Value */}
//                       <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
//                         <p className="text-lg font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</p>
//                       </div>

//                       {/* Tags */}
//                       {lead.tags_details && lead.tags_details.length > 0 && (
//                         <div className="flex gap-1.5 flex-wrap mb-3">
//                           {lead.tags_details.map(tag => (
//                             <span key={tag.id} className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium shadow-sm" style={{ backgroundColor: tag.color }}>
//                               {tag.name}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       {/* Footer */}
//                       <div className="flex items-center justify-between pt-3 border-t border-slate-50">
//                         <span className="text-[11px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
//                         {status !== 'lost' && status !== 'won' && (
//                           <button
//                             onClick={(e) => advanceStage(e, lead)}
//                             className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold opacity-0 group-hover:opacity-100 transition-all bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100"
//                           >
//                             Advance <ArrowRight size={12} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {statusLeads.length === 0 && (
//                     <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
//                       <p className="text-sm font-medium">No deals here</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleCreate} />
//       <LeadDetailDrawer lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleDrawerUpdate} />
//     </div>
//   );
// };



import React, { useEffect, useState } from 'react';
import { Plus, ArrowRight, Search } from 'lucide-react';
import { STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
import { api } from '../Utils/api';
import { LeadDetailDrawer } from '../LeadDetailDrawer/LeadDetailDrawer';
import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-400', mql: 'bg-indigo-500', sql: 'bg-purple-500',
  negotiation: 'bg-amber-400', won: 'bg-emerald-500', lost: 'bg-red-400',
};

export const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => { api.getLeads(search).then(setLeads); };
  useEffect(() => { const timer = setTimeout(fetchLeads, 300); return () => clearTimeout(timer); }, [search]);

  const advanceStage = async (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(lead.status);
    if (idx < STATUS_ORDER.length - 1) { await api.updateLeadStatus(lead.id, STATUS_ORDER[idx + 1]); fetchLeads(); }
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden relative">
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Deal Pipeline</h2>
          <p className="text-slate-500 mt-1">Track MQLs to SQLs to Close.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
            <input type="text" placeholder="Search..." className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-indigo-700 transition">
            <Plus size={18} /> Add Deal
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-5 h-full min-w-[1600px]">
          {STATUS_ORDER.map((status) => {
            const statusLeads = leads.filter(l => l.status === status);
            return (
              <div key={status} className="flex-1 flex flex-col min-w-[260px] rounded-2xl bg-white/60 border border-slate-200/60 shadow-sm">
                <div className="p-4 rounded-t-2xl relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${STATUS_COLORS[status]}`} />
                  <div className="flex justify-between items-center mt-1">
                    <h3 className="font-bold text-slate-700 text-sm">{STATUS_LABELS[status]}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-lg font-bold border border-slate-200">{statusLeads.length}</span>
                  </div>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {statusLeads.map(lead => (
                    <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md cursor-pointer group transition-all">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
                      <p className="text-xs text-slate-500 mb-3 truncate">{lead.company}</p>
                      <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3"><p className="text-sm font-bold text-slate-800">${parseFloat(lead.value).toLocaleString()}</p></div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                        <span className="text-[10px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                        {status !== 'lost' && status !== 'won' && (
                          <button onClick={(e) => advanceStage(e, lead)} className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-bold hover:bg-indigo-100 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">Advance <ArrowRight size={10}/></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={async (d:any) => { await api.createLead(d); fetchLeads(); }} />
      <LeadDetailDrawer lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} onUpdate={() => { fetchLeads(); if(selectedLead) api.getLead(selectedLead.id).then(setSelectedLead); }} />
    </div>
  );
};