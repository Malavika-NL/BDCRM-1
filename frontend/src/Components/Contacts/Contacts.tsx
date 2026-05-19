// import React, { useEffect, useState } from 'react';
// import { api } from '../Utils/api';
// import type { Lead } from '../Utils/types';
// import { Search, Users, Mail, Building2 } from 'lucide-react';

// const STATUS_BADGE: Record<string, string> = {
//   new: 'bg-blue-50 text-blue-700 border-blue-200',
//   contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
//   negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
//   won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//   lost: 'bg-red-50 text-red-700 border-red-200',
// };

// export const Contacts = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [search, setSearch] = useState('');

//   const fetchLeads = async () => {
//     const data = await api.getLeads(search);
//     setLeads(data);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => fetchLeads(), 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   const avatarColors = [
//     'from-blue-500 to-indigo-600',
//     'from-violet-500 to-purple-600',
//     'from-emerald-500 to-teal-600',
//     'from-amber-500 to-orange-600',
//     'from-rose-500 to-pink-600',
//     'from-cyan-500 to-blue-600',
//   ];

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar">
//       <header className="mb-8 flex justify-between items-center">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">All Contacts</h2>
//           <p className="text-slate-500 mt-1">Complete directory of everyone in your pipeline.</p>
//         </div>
//         <div className="relative group">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
//           <input
//             type="text"
//             placeholder="Search by name, company, email..."
//             className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-80 transition-all shadow-sm bg-white"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </header>

//       {leads.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-20 text-center">
//           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
//             <Users className="text-slate-300" size={40} />
//           </div>
//           <p className="text-lg font-semibold text-slate-700">No contacts found</p>
//           <p className="text-sm text-slate-500 mt-1">Try adjusting your search or add new leads.</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase border-b border-slate-100">
//               <tr>
//                 <th className="px-6 py-4 font-semibold">Contact</th>
//                 <th className="px-6 py-4 font-semibold">Company</th>
//                 <th className="px-6 py-4 font-semibold">Status</th>
//                 <th className="px-6 py-4 font-semibold text-right">Deal Value</th>
//                 <th className="px-6 py-4 font-semibold">Added</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {leads.map((lead, index) => (
//                 <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
//                         {getInitials(lead.name)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition">{lead.name}</div>
//                         <div className="text-slate-400 text-xs flex items-center gap-1"><Mail size={10} /> {lead.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 text-slate-600">
//                       <Building2 size={14} className="text-slate-400" />
//                       {lead.company}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${STATUS_BADGE[lead.status] || STATUS_BADGE.new}`}>
//                       {lead.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 font-semibold text-slate-800 text-right">
//                     ${parseFloat(lead.value).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-slate-500 text-sm">
//                     {new Date(lead.created_at).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';
import { Search, Users, Mail, Building2 } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  new:         'bg-blue-50 text-blue-700 border-blue-200',
  contacted:   'bg-indigo-50 text-indigo-700 border-indigo-200',
  negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
  won:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost:        'bg-red-50 text-red-700 border-red-200',
};

export const Contacts = () => {
  const [leads, setLeads]   = useState<Lead[]>([]);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    const data = await api.getLeads(search);
    setLeads(data);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLeads(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px) scale(0.99); }
          to   { opacity:1; transform:translateY(0) scale(1); }
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

      {/* ══════════════════════════════════════════════════
          BANNER — identical structure to BDMTargetCreate
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow:  '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          {/* icon block */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Users className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">All Contacts</h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Complete directory of everyone in your pipeline.
            </p>
          </div>

          {/* contact count badge */}
          {leads.length > 0 && (
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <Users size={13} className="text-indigo-200" />
              <span className="text-[12px] font-black text-indigo-100">
                {leads.length} contact{leads.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {/* ── SEARCH + TABLE CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-2">

          {/* top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl" />

          {/* card header — SectionHead pattern + search */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-4 flex-wrap">
            {/* left accent + title */}
            <div className="flex items-start gap-3 flex-1 min-w-[160px]">
              <div className="w-1 self-stretch rounded-full bg-indigo-500 shrink-0" />
              <div>
                <h2 className="text-[14px] font-black text-slate-800">Contact Directory</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {leads.length} contact{leads.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* search input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by name, company, email…"
                className="w-full pl-11 pr-4 py-3 text-[13px] font-medium text-slate-700
                  bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-300
                  focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400
                  outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* empty state */}
          {leads.length === 0 ? (
            <div className="p-20 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)', opacity: 0.1 }}
              />
              <Users className="text-indigo-300 -mt-14 mb-1" size={30} />
              <p className="text-[14px] font-black text-slate-700">No contacts found</p>
              <p className="text-[12px] text-slate-400 font-medium">
                Try adjusting your search or add new leads.
              </p>
            </div>
          ) : (
            /* table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Contact', 'Company', 'Status', 'Deal Value', 'Added'].map((col, i) => (
                      <th
                        key={col}
                        className={`px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest ${
                          i === 3 ? 'text-right' : ''
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-indigo-50/20 transition-colors group cursor-pointer"
                    >
                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]}
                              flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0`}
                          >
                            {getInitials(lead.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-black text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                              <Mail size={10} /> {lead.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                          <Building2 size={13} className="text-slate-300 shrink-0" />
                          {lead.company}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] rounded-lg font-black uppercase border
                          ${STATUS_BADGE[lead.status] || STATUS_BADGE.new}`}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Deal Value */}
                      <td className="px-5 py-4 text-[13px] font-black text-slate-800 text-right">
                        ${parseFloat(lead.value).toLocaleString()}
                      </td>

                      {/* Added */}
                      <td className="px-5 py-4 text-[12px] text-slate-400 font-medium">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="pb-2" />
      </div>
    </div>
  );
};