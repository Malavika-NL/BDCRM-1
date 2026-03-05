import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type{ Lead } from '../Utils/types';

export const Contacts = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    api.getLeads().then(setLeads).catch(console.error);
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">All Contacts</h2>
        <p className="text-slate-500 mt-1">Directory of everyone in your pipeline.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Name / Email</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Added On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{lead.name}</div>
                    <div className="text-slate-500 text-sm">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs rounded-full font-medium uppercase bg-slate-100 text-slate-600">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};