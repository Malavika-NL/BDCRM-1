import React, { useEffect, useState } from 'react';
import { RefreshCw, PhoneCall, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { api } from '../Utils/api';
import type { ConsumptionAlert } from '../Utils/types';

export const SmartDashboard = () => {
  const [alerts, setAlerts] = useState<ConsumptionAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSmartPrompts().then(data => {
      setAlerts(data.alerts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
          <RefreshCw size={32} className="text-blue-600" /> Smart Refills
        </h2>
        <p className="text-slate-500 mt-1">AI-Predicted consumption patterns. Call these clients today.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urgent Refills</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{alerts.length}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-xl"><AlertTriangle size={24} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue at Risk</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">$12.5k</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><TrendingUp size={24} /></div>
          </div>
        </div>
      </div>

      {/* The List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Company / PIC</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{item.company}</div>
                  <div className="text-xs text-slate-500">PIC: {item.pic || "Unknown"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    <Package size={12} /> {item.product}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    {item.days_overdue} days overdue
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Frequency: Predicted 30 days</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/25 transition flex items-center gap-2 ml-auto">
                    <PhoneCall size={14} /> Call Now
                  </button>
                </td>
              </tr>
            ))}
            {alerts.length === 0 && !loading && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No refill alerts today.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};