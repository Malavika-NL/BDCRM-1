import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';
import { Search, Users, Mail, Building2 } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
  won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
};

export const Contacts = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    const data = await api.getLeads(search);
    setLeads(data);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLeads(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">All Contacts</h2>
          <p className="text-slate-500 mt-1">Complete directory of everyone in your pipeline.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-80 transition-all shadow-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Users className="text-slate-300" size={40} />
          </div>
          <p className="text-lg font-semibold text-slate-700">No contacts found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or add new leads.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Deal Value</th>
                <th className="px-6 py-4 font-semibold">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead, index) => (
                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition">{lead.name}</div>
                        <div className="text-slate-400 text-xs flex items-center gap-1"><Mail size={10} /> {lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 size={14} className="text-slate-400" />
                      {lead.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${STATUS_BADGE[lead.status] || STATUS_BADGE.new}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 text-right">
                    ${parseFloat(lead.value).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};