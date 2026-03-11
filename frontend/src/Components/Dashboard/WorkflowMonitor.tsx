import React, { useEffect, useState } from 'react';
import { GitMerge, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../Utils/api';
import type { Enrollment } from '../Utils/types';

export const WorkflowMonitor = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    // Mock data in case backend isn't full populated yet
    // api.getEnrollments().then(setEnrollments); 
    setEnrollments([
        { id: 1, lead_name: "Acme Corp", course_title: "New Lead Warmup", status: "STARTED", started_at: "Just now" },
        { id: 2, lead_name: "TechStart Inc", course_title: "Demo Follow-up", status: "COMPLETED", started_at: "2 hrs ago" }
    ]);
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
          <GitMerge size={32} className="text-indigo-600" /> Automation Workflows
        </h2>
        <p className="text-slate-500 mt-1">Visualize Signal triggers and auto-enrollments.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* The Logic Flow Visualization */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Zap size={18} className="text-amber-500"/> Live Signal Logic</h3>
            
            <div className="flex items-center justify-between relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 border-2 border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
                        Lead
                    </div>
                    <p className="text-xs font-bold text-slate-600">NEW LEAD</p>
                    <p className="text-[10px] text-slate-400">Created via API</p>
                </div>

                <div className="flex-1 h-0.5 bg-slate-100 mx-4 relative">
                     <div className="absolute inset-0 bg-blue-400 w-1/2 animate-pulse"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-16 h-16 bg-amber-50 border-2 border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
                        Signal
                    </div>
                    <p className="text-xs font-bold text-slate-600">TRIGGER</p>
                    <p className="text-[10px] text-slate-400">post_save()</p>
                </div>

                <div className="flex-1 h-0.5 bg-slate-100 mx-4"></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
                        Action
                    </div>
                    <p className="text-xs font-bold text-slate-600">ENROLL</p>
                    <p className="text-[10px] text-slate-400">Default Course</p>
                </div>
            </div>
        </div>

        {/* Live Logs */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Recent Enrollments</h3>
            <div className="space-y-4">
                {enrollments.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                {e.lead_name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{e.lead_name}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    Enrolled in <span className="text-indigo-600 font-semibold">{e.course_title}</span>
                                </p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg">
                            {e.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};