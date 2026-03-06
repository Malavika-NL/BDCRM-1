import React from 'react';
import { Target, MapPin, Building, Crosshair, Users, Activity, Tag as TagIcon } from 'lucide-react';

export const BDMDashboard = () => {
  const verticalTargets = [
    { name: 'Automotive', target: 500, achieved: 320, color: 'bg-blue-500' },
    { name: 'Pharma', target: 800, achieved: 750, color: 'bg-emerald-500' },
    { name: 'IT / Tech', target: 600, achieved: 210, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
          <Target size={32} className="text-blue-600" /> BDM Core & Targets
        </h2>
        <p className="text-slate-500 mt-1">Manage PDCA loop, regional quotas, and vertical segmentation.</p>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { l: 'P', name: 'Plan', desc: 'Set Targets & Lists', c: 'text-blue-600 bg-blue-50 border-blue-200 shadow-blue-100' },
          { l: 'D', name: 'Do', desc: 'Auto Agent / Campaigns', c: 'text-indigo-600 bg-indigo-50 border-indigo-200 shadow-indigo-100' },
          { l: 'C', name: 'Check', desc: 'MQL to SQL Convert', c: 'text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100' },
          { l: 'A', name: 'Act', desc: 'Follow-ups & Close', c: 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-100' },
        ].map(step => (
          <div key={step.l} className={`p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center transition hover:-translate-y-1 ${step.c}`}>
             <h1 className="text-5xl font-black mb-3 opacity-90">{step.l}</h1>
             <p className="font-bold text-sm uppercase tracking-wider">{step.name}</p>
             <p className="text-xs mt-1 opacity-80">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><Building size={18} className="text-slate-400"/> Vertical Performance</h3>
          <div className="space-y-6">
            {verticalTargets.map(v => (
              <div key={v.name}>
                <div className="flex justify-between text-sm mb-2"><span className="font-semibold">{v.name}</span><span className="text-slate-500">{v.achieved} / {v.target}</span></div>
                <div className="w-full bg-slate-100 rounded-full h-3"><div className={`${v.color} h-3 rounded-full transition-all`} style={{ width: `${(v.achieved/v.target)*100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><Crosshair size={18} className="text-slate-400"/> Classifications</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><MapPin size={14}/> Regions</p>
                <div className="flex justify-between items-center mb-3"><span className="text-sm font-medium text-slate-700">North America</span><span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg">1240</span></div>
                <div className="flex justify-between items-center mb-3"><span className="text-sm font-medium text-slate-700">EMEA</span><span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg">850</span></div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-1"><Users size={14}/> Segments</p>
                <div className="flex justify-between items-center mb-3"><span className="text-sm font-medium text-slate-700">MQLs</span><span className="w-3 h-3 rounded-full bg-indigo-400"/></div>
                <div className="flex justify-between items-center mb-3"><span className="text-sm font-medium text-slate-700">SQLs</span><span className="w-3 h-3 rounded-full bg-blue-500"/></div>
              </div>
           </div>
           
           <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50">
              <p className="text-xs font-bold text-indigo-500 uppercase mb-3 flex items-center gap-1"><TagIcon size={14}/> Ribbon / Label Dashboard</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">🔥 Hot Lead (42)</span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">⏱️ Follow-up (105)</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};