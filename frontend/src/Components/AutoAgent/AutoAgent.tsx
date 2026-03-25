import React, { useState, useEffect } from 'react';
import { Bot, PhoneCall, UploadCloud, FileText, CheckCircle2, Zap, Play, Globe } from 'lucide-react';
import { api } from '../Utils/api';
import type { AIInteractionLog } from '../Utils/types';

export const AutoAgent = () => {
  const [activeStep, setActiveStep] = useState(3);
  const [logs, setLogs] = useState<AIInteractionLog[]>([]);
  const [isDialing, setIsDialing] = useState(false);

  // Fetch real data from Django
  const fetchLogs = async () => {
    const data = await api.getAILogs();
    setLogs(data);
  };

  // Poll for new logs every 3 seconds to create a "Live Terminal" effect
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, name: 'Upload List', icon: UploadCloud, desc: 'CSV or Scrape' },
    { id: 2, name: 'Verify', icon: CheckCircle2, desc: 'Validate lines' },
    { id: 3, name: 'Auto Dial', icon: PhoneCall, desc: 'Twilio / Asterisk' },
    { id: 4, name: 'Transcribe', icon: FileText, desc: 'Speech to Text' },
    { id: 5, name: 'Action', icon: Zap, desc: 'CRM Update' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <Bot size={32} className="text-indigo-600" /> Auto Sales Agent
        </h2>
        <p className="text-slate-500 mt-1">Configure your AI-driven outbound voice and text campaigns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider mb-3 inline-block">Active Pattern</span>
            {/* If you have a live Campaign, you can map its name here. For now, showing latest log's campaign */}
            <h3 className="text-2xl font-bold text-slate-800">
              {logs.length > 0 && logs[0].campaign_name ? logs[0].campaign_name : "General Outbound"}
            </h3>
            <p className="text-slate-500 mt-1">Connected to system. Ready for outbound triggers.</p>
          </div>
          <button 
            onClick={() => setIsDialing(!isDialing)}
            className={`text-white px-8 py-4 rounded-2xl font-bold transition flex items-center gap-2 text-lg shadow-lg ${
              isDialing 
              ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
              : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-emerald-500/30'
            }`}
          >
            {isDialing ? 'Stop Engine' : <><Play size={20} fill="currentColor" /> Start Dialing</>}
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
          <Globe className="absolute -right-6 -bottom-6 text-white/5" size={140} />
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider z-10">Total AI Logs</p>
          <h3 className="text-5xl font-black mt-2 z-10">{logs.length}</h3>
          <p className="text-emerald-400 text-sm mt-3 font-medium flex items-center gap-1 z-10">
            <CheckCircle2 size={16}/> Live DB Connection
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 mb-8">
        <h3 className="font-bold text-slate-800 mb-8 text-lg">Workflow Pattern</h3>
        <div className="flex justify-between relative px-4">
          <div className="absolute top-7 left-12 right-12 h-1 bg-slate-100 -z-10" />
          <div className="absolute top-7 left-12 h-1 bg-indigo-500 -z-10 transition-all duration-700" style={{ width: `${((activeStep - 1) / 4) * 100}%` }} />
          
          {steps.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <div key={step.id} className="flex flex-col items-center w-32 text-center cursor-pointer" onClick={() => setActiveStep(step.id)}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/40' : 'bg-slate-50 text-slate-400 border-2 border-slate-100'}`}>
                  <step.icon size={24} />
                </div>
                <p className={`mt-4 font-bold text-sm ${isActive ? 'text-indigo-700' : 'text-slate-600'}`}>{step.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟢 REAL DATA TERMINAL 🟢 */}
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
          <span className="text-slate-300 text-sm font-mono ml-2">Terminal // Live Django Database</span>
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${isDialing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}/> 
            {isDialing ? 'ONLINE & LISTENING' : 'PAUSED'}
          </span>
        </div>
        
        <div className="p-6 font-mono text-sm space-y-4 text-slate-300 h-[300px] overflow-y-auto custom-scrollbar flex flex-col-reverse">
          
          {isDialing && (
            <div className="animate-pulse text-slate-500 flex gap-2">
              <span className="text-emerald-500">➜</span> Waiting for next event...
            </div>
          )}

          {logs.length === 0 ? (
             <p className="text-slate-500">No interaction logs found in the database yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border-b border-white/5 pb-3">
                <p className="text-xs text-slate-500 mb-1">
                  [{new Date(log.created_at).toLocaleTimeString()}] 
                  <span className="text-amber-400 ml-2">Type: {log.interaction_type.toUpperCase()}</span>
                </p>
                <p>
                  <span className="text-blue-400 font-bold">[LEAD]</span> {log.lead_name} 
                  {log.sentiment && (
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      log.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-300' :
                      log.sentiment === 'negative' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      Sentiment: {log.sentiment}
                    </span>
                  )}
                </p>
                <p className="text-slate-300 mt-1 whitespace-pre-wrap pl-4 border-l-2 border-slate-700">
                  {log.transcript || log.ai_summary || "No transcript available."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
};