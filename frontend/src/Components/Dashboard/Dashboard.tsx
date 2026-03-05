import React, { useEffect, useState } from 'react';
import { DollarSign, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { api } from '../Utils/api';
import type{ Lead } from '../Utils/types';

export const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getLeads().then(data => { setLeads(data); setLoading(false); }).catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading dashboard...</div>;

  const totalValue = leads.reduce((sum, lead) => sum + parseFloat(lead.value), 0);
  const activeLeads = leads.filter(l => l.status !== 'won' && l.status !== 'lost');
  const wonLeads = leads.filter(l => l.status === 'won');
  const winRate = leads.length > 0 ? ((wonLeads.length / leads.length) * 100).toFixed(1) : '0';

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Overview</h2>
        <p className="text-slate-500 mt-1">Real-time metrics from your database.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Pipeline" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} color="blue" />
        <StatCard title="Active Deals" value={activeLeads.length.toString()} icon={Briefcase} color="indigo" />
        <StatCard title="Deals Won" value={wonLeads.length.toString()} icon={TrendingUp} color="emerald" />
        <StatCard title="Win Rate" value={`${winRate}%`} icon={AlertCircle} color="amber" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h3 className="font-semibold text-lg text-slate-800">Recent Leads</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{lead.name}</td>
                  <td className="px-6 py-4 text-slate-600">{lead.company}</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 uppercase">{lead.status}</span></td>
                  <td className="px-6 py-4 font-medium text-slate-800 text-right">${parseFloat(lead.value).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div><p className="text-sm font-medium text-slate-500">{title}</p><h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3></div>
        <div className={`p-3 rounded-lg ${colors[color]}`}><Icon size={20} /></div>
      </div>
    </div>
  );
};