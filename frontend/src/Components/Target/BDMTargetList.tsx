import React, { useEffect, useState } from 'react';
import { 
  Target, Plus, TrendingUp, BarChart3, ClipboardCheck, 
  X, AlertTriangle, MapPin, Briefcase, Package, 
  ChevronRight, Calendar, DollarSign, Users, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

// --- REVIEW MODAL COMPONENT (Remains Unchanged) ---
const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
  const [reviewData, setReviewData] = useState({ 
    summary: '', findings: '', action_plan: '', review_date: new Date().toISOString().split('T')[0] 
  });

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="text-amber-400"/> PDCA Review
            </h3>
            <p className="text-slate-400 text-sm mt-1">{target.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 bg-slate-50">
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Performance Summary</label>
             <input className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. Missed Printer Target by 20%" value={reviewData.summary} onChange={e => setReviewData({...reviewData, summary: e.target.value})} />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Root Cause (Findings)</label>
             <textarea className="w-full p-3.5 bg-white border border-slate-200 rounded-xl h-24 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Why did this happen?" value={reviewData.findings} onChange={e => setReviewData({...reviewData, findings: e.target.value})} />
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
             <label className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={14}/> Corrective Action Plan (Act)</label>
             <textarea className="w-full p-3.5 bg-white border border-amber-200 rounded-xl h-24 resize-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm" placeholder="Steps for next cycle..." value={reviewData.action_plan} onChange={e => setReviewData({...reviewData, action_plan: e.target.value})} />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => onSubmit(target.id, reviewData)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all">Save Review <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export const BDMTargetsList = () => {
  const navigate = useNavigate(); // ADDED HOOK
  const [dashboard, setDashboard] = useState<any>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);

  const loadData = async () => {
    try {
      const dashRes = await fetch(`${API_BASE}/bdm-targets/dashboard/`);
      setDashboard(await dashRes.json());
      const listRes = await fetch(`${API_BASE}/bdm-targets/`);
      setTargets(await listRes.json());
    } catch(e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, []);

  const submitReview = async (id: number, data: any) => {
    await fetch(`${API_BASE}/bdm-targets/${id}/add_review/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    setActiveReviewTarget(null);
    alert("PDCA Cycle Updated Successfully!");
    loadData();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'region': return <MapPin size={18} className="text-blue-500" />;
      case 'vertical': return <Briefcase size={18} className="text-purple-500" />;
      case 'product': return <Package size={18} className="text-emerald-500" />;
      default: return <Target size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl shadow-slate-900/10 shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Target className="text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Business Targets (PDCA)</h2>
              <p className="text-slate-400 mt-1 text-lg">Manage strategic goals across regions, verticals, and products.</p>
            </div>
          </div>
          
          {/* UPDATED BUTTON: Now Navigates to new page */}
          <button 
            onClick={() => navigate('/bdm-targets/new')} 
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus size={18} /> Set New Target
          </button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <InfoCard title="Active Plans" value={dashboard.active_targets} icon={<Activity size={24} />} color="blue" />
          <InfoCard title="Avg Target Progress" value={`${dashboard.avg_progress}%`} icon={<TrendingUp size={24} />} color="emerald" />
          <InfoCard title="Total Leads Goal" value={dashboard.target_leads.toLocaleString()} icon={<Users size={24} />} color="purple" />
          <InfoCard title="Total Revenue Goal" value={`$${(dashboard.target_revenue).toLocaleString()}`} icon={<DollarSign size={24} />} color="amber" />
        </div>
      )}

      {/* TARGET LIST */}
      <div className="space-y-5">
        {targets.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-3xl">
            <Target className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-700">No Targets Set Yet</h3>
            <p className="text-slate-500 mt-2 mb-6">Create your first strategic goal to start tracking progress.</p>
            <button onClick={() => navigate('/bdm-targets/new')} className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20">Set First Target</button>
          </div>
        )}

        {targets.map((target) => {
          const progress = target.progress || 0;
          const isCompleted = progress >= 100;
          const progressColor = isCompleted ? 'from-emerald-400 to-emerald-500' : 'from-blue-500 to-indigo-500';

          return (
            <div key={target.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    {getTypeIcon(target.target_type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xl leading-tight group-hover:text-blue-600 transition-colors">{target.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                        {getTypeIcon(target.target_type)} {target.target_type}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${target.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {target.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                        <Calendar size={12}/> {new Date(target.start_date).toLocaleDateString()} - {new Date(target.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveReviewTarget(target)} 
                  className="bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                >
                  <ClipboardCheck size={16}/> PDCA Review
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-5">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-sm font-bold text-slate-700">Goal Completion</span>
                   <span className={`text-xl font-black ${isCompleted ? 'text-emerald-500' : 'text-blue-600'}`}>{progress}%</span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                   <div className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 relative`} style={{ width: `${Math.min(progress, 100)}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Target Leads</span> 
                  <span className="text-lg font-black text-slate-700">{target.target_leads.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Leads Won</span> 
                  <span className="text-lg font-black text-emerald-600">{target.achieved_leads.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Revenue Goal</span> 
                  <span className="text-lg font-black text-slate-700">${parseFloat(target.target_revenue).toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Current Rev</span> 
                  <span className="text-lg font-black text-emerald-600">${parseFloat(target.achieved_revenue).toLocaleString()}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <ReviewModal isOpen={!!activeReviewTarget} onClose={() => setActiveReviewTarget(null)} target={activeReviewTarget} onSubmit={submitReview} />
    </div>
  );
};

const InfoCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: 'blue' | 'emerald' | 'purple' | 'amber' }) => {
  const colorMap = {
    blue: 'from-blue-500 to-cyan-500 shadow-blue-500/20 text-blue-50',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-50',
    purple: 'from-purple-500 to-indigo-500 shadow-purple-500/20 text-purple-50',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/20 text-amber-50',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
      <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex justify-between items-start relative z-10">
        <div><p className="text-sm font-semibold opacity-90 uppercase tracking-wider">{title}</p><h3 className="text-3xl font-black text-white mt-2">{value}</h3></div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-white">{icon}</div>
      </div>
    </div>
  );
};

export default BDMTargetsList;