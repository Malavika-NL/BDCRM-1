// import React, { useEffect, useState } from 'react';
// import { GitMerge, Zap, Layers, MapPin, Plus, Trash2, Loader2 } from 'lucide-react';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface MetaItem {
//   id: number;
//   name: string;
// }

// export const WorkflowMonitor = () => {
//   // --- Existing State ---
//   const [enrollments, setEnrollments] = useState<any[]>([]);

//   // --- New State for Verticals & Regions ---
//   const [verticals, setVerticals] = useState<MetaItem[]>([]);
//   const [regions, setRegions] = useState<MetaItem[]>([]);
  
//   const [newVertical, setNewVertical] = useState('');
//   const [newRegion, setNewRegion] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // --- Fetch Data ---
//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       // Fetch mock enrollments (Keep your existing logic here)
//       setEnrollments([
//         { id: 1, lead_name: "Acme Corp", course_title: "New Lead Warmup", status: "STARTED", started_at: "Just now" },
//         { id: 2, lead_name: "TechStart Inc", course_title: "Demo Follow-up", status: "COMPLETED", started_at: "2 hrs ago" }
//       ]);

//       // Fetch Verticals & Regions
//       const [vertRes, regRes] = await Promise.all([
//         fetch(`${API_BASE}/verticals/`),
//         fetch(`${API_BASE}/regions/`)
//       ]);

//       if (vertRes.ok) setVerticals(await vertRes.json());
//       if (regRes.ok) setRegions(await regRes.json());
      
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // --- Add Handlers ---
//   const handleAddVertical = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newVertical.trim()) return;

//     try {
//       const res = await fetch(`${API_BASE}/verticals/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newVertical.trim() })
//       });
//       if (res.ok) {
//         setNewVertical('');
//         loadData(); // Refresh lists
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddRegion = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newRegion.trim()) return;

//     try {
//       const res = await fetch(`${API_BASE}/regions/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newRegion.trim() })
//       });
//       if (res.ok) {
//         setNewRegion('');
//         loadData(); // Refresh lists
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --- Delete Handlers ---
//   const handleDeleteVertical = async (id: number) => {
//     if (!window.confirm('Delete this Vertical?')) return;
//     try {
//       const res = await fetch(`${API_BASE}/verticals/${id}/`, { method: 'DELETE' });
//       if (res.ok) loadData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteRegion = async (id: number) => {
//     if (!window.confirm('Delete this Region?')) return;
//     try {
//       const res = await fetch(`${API_BASE}/regions/${id}/`, { method: 'DELETE' });
//       if (res.ok) loadData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      
//       {/* HEADER */}
//       <header className="mb-8">
//         <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
//           <GitMerge size={32} className="text-indigo-600" /> Automation Workflows
//         </h2>
//         <p className="text-slate-500 mt-1">Visualize Signal triggers and manage system configurations.</p>
//       </header>

//       {/* ===== EXISTING SECTION: WORKFLOW VISUALIZATION ===== */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
//         {/* The Logic Flow Visualization */}
//         <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
//             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
//               <Zap size={18} className="text-amber-500"/> Live Signal Logic
//             </h3>
            
//             <div className="flex items-center justify-between relative">
//                 {/* Step 1 */}
//                 <div className="flex flex-col items-center z-10 text-center">
//                     <div className="w-16 h-16 bg-blue-50 border-2 border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
//                         Lead
//                     </div>
//                     <p className="text-xs font-bold text-slate-600">NEW LEAD</p>
//                     <p className="text-[10px] text-slate-400">Created via API</p>
//                 </div>

//                 <div className="flex-1 h-0.5 bg-slate-100 mx-4 relative">
//                      <div className="absolute inset-0 bg-blue-400 w-1/2 animate-pulse"></div>
//                 </div>

//                 {/* Step 2 */}
//                 <div className="flex flex-col items-center z-10 text-center">
//                     <div className="w-16 h-16 bg-amber-50 border-2 border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
//                         Signal
//                     </div>
//                     <p className="text-xs font-bold text-slate-600">TRIGGER</p>
//                     <p className="text-[10px] text-slate-400">post_save()</p>
//                 </div>

//                 <div className="flex-1 h-0.5 bg-slate-100 mx-4"></div>

//                 {/* Step 3 */}
//                 <div className="flex flex-col items-center z-10 text-center">
//                     <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shadow-sm mb-3">
//                         Action
//                     </div>
//                     <p className="text-xs font-bold text-slate-600">ENROLL</p>
//                     <p className="text-[10px] text-slate-400">Default Course</p>
//                 </div>
//             </div>
//         </div>

//         {/* Live Logs */}
//         <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
//             <h3 className="font-bold text-slate-800 mb-6">Recent Enrollments</h3>
//             <div className="space-y-4">
//                 {enrollments.map((e) => (
//                     <div key={e.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
//                                 {e.lead_name.substring(0,2).toUpperCase()}
//                             </div>
//                             <div>
//                                 <p className="text-sm font-bold text-slate-800">{e.lead_name}</p>
//                                 <p className="text-xs text-slate-500 flex items-center gap-1">
//                                     Enrolled in <span className="text-indigo-600 font-semibold">{e.course_title}</span>
//                                 </p>
//                             </div>
//                         </div>
//                         <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg ${
//                           e.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
//                         }`}>
//                             {e.status}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//       </div>

//       {/* ===== NEW SECTION: SYSTEM CONFIGURATION (VERTICALS & REGIONS) ===== */}
//       <div>
//         <h3 className="text-xl font-bold text-slate-800 mb-4">System Configuration</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
//           {/* VERTICALS CARD */}
//           <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
//             <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
//                 <Layers size={20} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-slate-800">Industry Verticals</h4>
//                 <p className="text-xs text-slate-500">Manage target industries</p>
//               </div>
//             </div>
            
//             <div className="p-5 flex-1 flex flex-col">
//               {/* Add Form */}
//               <form onSubmit={handleAddVertical} className="flex gap-2 mb-6">
//                 <input 
//                   type="text" 
//                   value={newVertical}
//                   onChange={(e) => setNewVertical(e.target.value)}
//                   placeholder="e.g., Software, Manufacturing..."
//                   className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//                 />
//                 <button 
//                   type="submit"
//                   disabled={!newVertical.trim()}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </form>

//               {/* List */}
//               {isLoading ? (
//                 <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
//               ) : (
//                 <div className="space-y-2 overflow-y-auto max-h-64 custom-scrollbar pr-2">
//                   {verticals.length === 0 ? (
//                     <p className="text-sm text-slate-400 text-center py-4">No verticals added yet.</p>
//                   ) : (
//                     verticals.map(v => (
//                       <div key={v.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-indigo-100 rounded-xl group transition-colors shadow-sm">
//                         <span className="text-sm font-medium text-slate-700">{v.name}</span>
//                         <button 
//                           onClick={() => handleDeleteVertical(v.id)}
//                           className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* REGIONS CARD */}
//           <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
//             <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
//               <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
//                 <MapPin size={20} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-slate-800">Target Regions</h4>
//                 <p className="text-xs text-slate-500">Manage geographical territories</p>
//               </div>
//             </div>
            
//             <div className="p-5 flex-1 flex flex-col">
//               {/* Add Form */}
//               <form onSubmit={handleAddRegion} className="flex gap-2 mb-6">
//                 <input 
//                   type="text" 
//                   value={newRegion}
//                   onChange={(e) => setNewRegion(e.target.value)}
//                   placeholder="e.g., North America, EMEA..."
//                   className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
//                 />
//                 <button 
//                   type="submit"
//                   disabled={!newRegion.trim()}
//                   className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
//                 >
//                   <Plus size={16} /> Add
//                 </button>
//               </form>

//               {/* List */}
//               {isLoading ? (
//                 <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
//               ) : (
//                 <div className="space-y-2 overflow-y-auto max-h-64 custom-scrollbar pr-2">
//                   {regions.length === 0 ? (
//                     <p className="text-sm text-slate-400 text-center py-4">No regions added yet.</p>
//                   ) : (
//                     regions.map(r => (
//                       <div key={r.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-rose-100 rounded-xl group transition-colors shadow-sm">
//                         <span className="text-sm font-medium text-slate-700">{r.name}</span>
//                         <button 
//                           onClick={() => handleDeleteRegion(r.id)}
//                           className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default WorkflowMonitor;


import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Layers, 
  MapPin, 
  Package, 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Loader2 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

// --- REUSABLE CONFIG CARD COMPONENT ---
// This handles fetching, adding, and deleting for any simple ID/Name model automatically.
const ConfigCard = ({ 
  title, 
  description, 
  endpoint, 
  icon: Icon, 
  colorTheme 
}: { 
  title: string, 
  description: string, 
  endpoint: string, 
  icon: any, 
  colorTheme: string 
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Color mappings based on the passed theme
  const colors: Record<string, any> = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700', border: 'hover:border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700', border: 'hover:border-rose-100 focus:border-rose-500 focus:ring-rose-500/20' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', border: 'hover:border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600', border: 'hover:border-amber-100 focus:border-amber-500 focus:ring-amber-500/20' },
  };
  const theme = colors[colorTheme] || colors.indigo;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`);
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newValue.trim() })
      });
      if (res.ok) {
        setNewValue('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[400px]">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
        <div className={`p-2 rounded-lg ${theme.bg} ${theme.text}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col min-h-0">
        {/* Add Input Form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4 shrink-0">
          <input 
            type="text" 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}...`}
            className={`flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${theme.border} focus:bg-white`}
          />
          <button 
            type="submit"
            disabled={!newValue.trim()}
            className={`px-4 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-sm ${theme.btn}`}
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-300" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-sm text-slate-400 font-medium">No items added yet.</p>
              <p className="text-xs text-slate-400 mt-1">Add one using the input above.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group transition-all shadow-sm hover:shadow ${theme.border}`}>
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE (Export fixed to WorkflowMonitor) ---
export const WorkflowMonitor = () => {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      
      {/* HEADER */}
      <header className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Master Data Configuration</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Manage the global categories and dropdown options used across your CRM platform.
          </p>
        </div>
      </header>

      {/* CONFIGURATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        
        <ConfigCard 
          title="Industry Verticals" 
          description="Target business sectors (e.g. Pharma, Tech)"
          endpoint="verticals"
          icon={Layers}
          colorTheme="indigo"
        />

        <ConfigCard 
          title="Geographic Regions" 
          description="Sales territories (e.g. EMEA, APAC)"
          endpoint="regions"
          icon={MapPin}
          colorTheme="rose"
        />

        <ConfigCard 
          title="Product Lines" 
          description="Categories of products you sell (e.g. RFID, Labels)"
          endpoint="product-lines"
          icon={Package}
          colorTheme="emerald"
        />

        <ConfigCard 
          title="System Tags" 
          description="Labels used to organize leads (e.g. VIP, Urgent)"
          endpoint="tags"
          icon={TagIcon}
          colorTheme="amber"
        />

      </div>
    </div>
  );
};

export default WorkflowMonitor;