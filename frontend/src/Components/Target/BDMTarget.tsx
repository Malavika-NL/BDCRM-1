import React, { useEffect, useState } from 'react';
import { Target, Plus, TrendingUp, BarChart3, ClipboardCheck, X, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

// --- REVIEW MODAL COMPONENT ---
const ReviewModal = ({ isOpen, onClose, target, onSubmit }: any) => {
  const [reviewData, setReviewData] = useState({ 
    summary: '', 
    findings: '', 
    action_plan: '', 
    review_date: new Date().toISOString().split('T')[0] 
  });

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-amber-500"/> PDCA Review: {target.name}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        
        <div className="space-y-4">
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Performance Summary</label>
             <input className="w-full p-3 border border-slate-200 rounded-xl" placeholder="e.g. Missed Printer Target by 20%" value={reviewData.summary} onChange={e => setReviewData({...reviewData, summary: e.target.value})} />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Root Cause (Findings)</label>
             <textarea className="w-full p-3 border border-slate-200 rounded-xl h-20 resize-none" placeholder="Why did this happen?" value={reviewData.findings} onChange={e => setReviewData({...reviewData, findings: e.target.value})} />
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
             <label className="block text-xs font-bold text-amber-700 uppercase mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Corrective Action Plan</label>
             <textarea className="w-full p-3 bg-white border border-amber-200 rounded-xl h-20 resize-none placeholder:text-slate-400" placeholder="What will we do to fix it?" value={reviewData.action_plan} onChange={e => setReviewData({...reviewData, action_plan: e.target.value})} />
          </div>
        </div>

        <button onClick={() => onSubmit(target.id, reviewData)} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">
          Save Review (Act)
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export const BDMTargets = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [activeReviewTarget, setActiveReviewTarget] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', target_type: 'region', target_leads: 0, target_revenue: 0, start_date: '', end_date: '', status: 'active' });

  const loadData = async () => {
    try {
      const dashRes = await fetch(`${API_BASE}/bdm-targets/dashboard/`);
      setDashboard(await dashRes.json());
      const listRes = await fetch(`${API_BASE}/bdm-targets/`);
      setTargets(await listRes.json());
    } catch(e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    await fetch(`${API_BASE}/bdm-targets/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form) });
    setShowForm(false); loadData();
  };

  const submitReview = async (id: number, data: any) => {
    await fetch(`${API_BASE}/bdm-targets/${id}/add_review/`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    setActiveReviewTarget(null);
    alert("PDCA Cycle Updated!");
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><Target className="text-blue-600" size={30} /> BDM Targets (PDCA)</h2>
          <p className="text-slate-500 mt-1">Manage Region, Vertical, and Product Targets.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={16} /> Set Target</button>
      </header>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <InfoCard title="Active Plans" value={dashboard.active_targets} icon={<Target />} />
          <InfoCard title="Avg Progress" value={`${dashboard.avg_progress}%`} icon={<TrendingUp />} />
          <InfoCard title="Total Leads Goal" value={dashboard.target_leads} icon={<ClipboardCheck />} />
          <InfoCard title="Revenue Goal" value={`$${(dashboard.target_revenue/1000).toFixed(0)}k`} icon={<BarChart3 />} />
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input className="p-3 border rounded-xl" placeholder="Target Name (e.g. Q3 North Printers)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
             <select className="p-3 border rounded-xl" value={form.target_type} onChange={e => setForm({...form, target_type: e.target.value})}>
                <option value="region">Region Wise</option>
                <option value="vertical">Vertical Wise</option>
                <option value="product">Product Wise</option>
             </select>
             <input type="number" className="p-3 border rounded-xl" placeholder="Lead Goal" value={form.target_leads} onChange={e => setForm({...form, target_leads: parseInt(e.target.value)})} />
             <input type="number" className="p-3 border rounded-xl" placeholder="Revenue Goal ($)" value={form.target_revenue} onChange={e => setForm({...form, target_revenue: parseInt(e.target.value)})} />
             <input type="date" className="p-3 border rounded-xl" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
             <input type="date" className="p-3 border rounded-xl" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
          </div>
          <button onClick={handleCreate} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">Save Plan</button>
        </div>
      )}

      {/* Target List */}
      <div className="space-y-4">
        {targets.map((target) => (
          <div key={target.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{target.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{target.target_type}</span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{target.status}</span>
                </div>
              </div>
              <div className="text-right">
                <button onClick={() => setActiveReviewTarget(target)} className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-100 transition-colors">
                  <ClipboardCheck size={14}/> Add Review / Act
                </button>
              </div>
            </div>

            <div className="mt-4">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                 <span>Progress</span>
                 <span>{target.progress || 0}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                 <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${target.progress || 0}%` }} />
               </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
              <div><span className="text-slate-400 text-xs uppercase font-bold block">Target Leads</span> <span className="font-bold text-slate-700">{target.target_leads}</span></div>
              <div><span className="text-slate-400 text-xs uppercase font-bold block">Achieved</span> <span className="font-bold text-emerald-600">{target.achieved_leads}</span></div>
              <div><span className="text-slate-400 text-xs uppercase font-bold block">Revenue Goal</span> <span className="font-bold text-slate-700">${target.target_revenue}</span></div>
              <div><span className="text-slate-400 text-xs uppercase font-bold block">Current Rev</span> <span className="font-bold text-emerald-600">${target.achieved_revenue}</span></div>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal isOpen={!!activeReviewTarget} onClose={() => setActiveReviewTarget(null)} target={activeReviewTarget} onSubmit={submitReview} />
    </div>
  );
};

const InfoCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
    <div><p className="text-xs uppercase text-slate-400 font-bold">{title}</p><h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3></div>
    <div className="text-blue-600 opacity-80">{icon}</div>
  </div>
);