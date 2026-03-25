import React, { useEffect, useState } from 'react';
import { Target, MapPin, Building, Crosshair, Users, Activity, Tag as TagIcon, Loader2 } from 'lucide-react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

export const BDMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real leads to calculate stats
  useEffect(() => {
    api.getLeads().then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  // --- 1. DYNAMIC CALCULATIONS ---
  
  // Calculate Vertical Distribution
  const verticalStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach(l => {
      const vName = l.vertical?.name || 'Unassigned';
      stats[vName] = (stats[vName] || 0) + 1;
    });
    // Convert to array and sort
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  // Calculate Region Distribution
  const regionStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach(l => {
      const rName = l.region_rel?.name || 'Unassigned';
      stats[rName] = (stats[rName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [leads]);

  // Calculate Lead Stages (MQL/SQL)
  const segmentStats = React.useMemo(() => {
    const mql = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
    const sql = leads.filter(l => l.status === 'negotiation' || l.status === 'won').length;
    return { mql, sql };
  }, [leads]);

  if (loading) {
    return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;
  }

  // Colors for charts
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-purple-500'];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
          <Target size={32} className="text-blue-600" /> BDM Core Intelligence
        </h2>
        <p className="text-slate-500 mt-1">Live breakdown of Verticals, Regions, and Segments.</p>
      </header>

      {/* PDCA Steps */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { l: 'P', name: 'Plan', desc: 'Set Targets', c: 'text-blue-600 bg-blue-50 border-blue-200' },
          { l: 'D', name: 'Do', desc: 'Campaigns', c: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
          { l: 'C', name: 'Check', desc: 'Gap Analysis', c: 'text-amber-600 bg-amber-50 border-amber-200' },
          { l: 'A', name: 'Act', desc: 'Review & Fix', c: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        ].map(step => (
          <div key={step.l} className={`p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center transition hover:-translate-y-1 ${step.c}`}>
             <h1 className="text-5xl font-black mb-3 opacity-90">{step.l}</h1>
             <p className="font-bold text-sm uppercase tracking-wider">{step.name}</p>
             <p className="text-xs mt-1 opacity-80">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* VERTICAL PERFORMANCE (Dynamic) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Building size={18} className="text-slate-400"/> Vertical Penetration
          </h3>
          <div className="space-y-6">
            {verticalStats.length === 0 ? (
              <p className="text-sm text-slate-400">No data available. Add leads with verticals.</p>
            ) : (
              verticalStats.map((v, index) => {
                const percentage = Math.round((v.count / leads.length) * 100);
                return (
                  <div key={v.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">{v.name}</span>
                      <span className="text-slate-500">{v.count} Leads ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* REGIONAL & SEGMENT BREAKDOWN (Dynamic) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
             <Crosshair size={18} className="text-slate-400"/> Market Classifications
           </h3>
           
           <div className="grid grid-cols-2 gap-4">
              {/* Region Stats */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><MapPin size={14}/> Top Regions</p>
                {regionStats.slice(0, 3).map(r => (
                  <div key={r.name} className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-700">{r.name}</span>
                    <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg">{r.count}</span>
                  </div>
                ))}
                {regionStats.length === 0 && <p className="text-xs text-slate-400">No regions found</p>}
              </div>

              {/* Segment Stats */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><Users size={14}/> Pipeline Stage</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-700">MQL (New)</span>
                  <span className="flex items-center gap-2 text-xs font-bold">
                    {segmentStats.mql} <span className="w-2 h-2 rounded-full bg-indigo-400"/>
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-700">SQL (Active)</span>
                  <span className="flex items-center gap-2 text-xs font-bold">
                    {segmentStats.sql} <span className="w-2 h-2 rounded-full bg-blue-500"/>
                  </span>
                </div>
              </div>
           </div>
           
           {/* Cross-Sell Alert */}
           <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <p className="text-xs font-bold text-indigo-500 uppercase mb-3 flex items-center gap-1">
                <TagIcon size={14}/> Cross-Sell Opportunities
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">
                  Printers Sold: {leads.filter(l => l.value && parseFloat(l.value) > 10000).length}
                </span>
                <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">
                  White Space Analysis Active
                </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};