import React, { useEffect, useState } from 'react';
import { TerminalSquare, Play, RefreshCw, Server } from 'lucide-react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

export const AgentFeed = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const fetchLeads = () => {
    // In real app, filter for source='AI Agent'
    api.getLeads().then(setLeads);
  };

  useEffect(() => { fetchLeads(); }, []);

  const runSimulation = async () => {
    const fakeData = [{
        name: `Scraped Lead ${Math.floor(Math.random()*1000)}`,
        email: `ai.test.${Date.now()}@example.com`,
        company_name: "Auto-Detected Corp",
        region: "North",
        vertical: "Automotive",
        source: "Python Scraper"
    }];
    await api.triggerAgentDump(fakeData);
    fetchLeads();
  };

  return (
    <div className="p-0 h-full bg-[#0d1117] flex flex-col font-mono overflow-hidden text-slate-300">
      {/* Terminal Header */}
      <header className="bg-[#161b22] border-b border-slate-800 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <TerminalSquare size={20} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-200">AI_AGENT_V2.1 // LOGS</h2>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchLeads} className="p-2 hover:bg-slate-800 rounded text-slate-400"><RefreshCw size={16}/></button>
            <button onClick={runSimulation} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2">
                <Play size={12} fill="currentColor" /> TEST INGESTION
            </button>
        </div>
      </header>

      {/* Terminal Body */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-2">
        <div className="text-slate-500 text-xs mb-4">Last login: {new Date().toLocaleString()} on ttys001</div>
        
        {leads.map((lead, idx) => (
            <div key={lead.id} className="group flex gap-3 hover:bg-white/5 p-1 rounded -mx-1">
                <span className="text-slate-600 text-xs">[{new Date(lead.created_at).toLocaleTimeString()}]</span>
                <span className="text-purple-400 text-xs font-bold">INBOUND_PAYLOAD</span>
                <span className="text-slate-300 text-sm">
                    Received <span className="text-emerald-400 font-bold">{lead.name}</span> 
                    <span className="text-slate-500"> from </span> 
                    <span className="text-yellow-500">{lead.source}</span>
                </span>
                {lead.region && <span className="text-xs border border-slate-700 px-1 rounded text-slate-500">{lead.region}</span>}
            </div>
        ))}
        
        <div className="animate-pulse flex gap-2 mt-4">
            <span className="text-emerald-500">➜</span>
            <span className="w-2 h-4 bg-slate-500"></span>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-[#161b22] border-t border-slate-800 p-2 flex gap-6 text-xs font-bold text-slate-500">
         <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> SYSTEM ONLINE</span>
         <span className="flex items-center gap-2"><Server size={12}/> PORT: 8000 LISTENING</span>
      </div>
    </div>
  );
};
