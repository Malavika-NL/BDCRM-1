// import React, { useEffect, useState } from 'react';
// import { 
//   Settings, 
//   Layers, 
//   MapPin, 
//   Package, 
//   Tag as TagIcon, 
//   Plus, 
//   Trash2, 
//   Loader2,
//   Users,
//   Network,
//   Wrench,
//   Building2
// } from 'lucide-react';

// const API_BASE = 'http://127.0.0.1:8000/api';

// // --- REUSABLE CONFIG CARD COMPONENT ---
// const ConfigCard = ({ 
//   title, 
//   description, 
//   endpoint, 
//   icon: Icon, 
//   colorTheme 
// }: { 
//   title: string, 
//   description: string, 
//   endpoint: string, 
//   icon: any, 
//   colorTheme: string 
// }) => {
//   const [items, setItems] = useState<any[]>([]);
//   const [newValue, setNewValue] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Expanded color mappings
//   const colors: Record<string, any> = {
//     indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700', border: 'hover:border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20' },
//     rose: { bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700', border: 'hover:border-rose-100 focus:border-rose-500 focus:ring-rose-500/20' },
//     emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', border: 'hover:border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20' },
//     amber: { bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600', border: 'hover:border-amber-100 focus:border-amber-500 focus:ring-amber-500/20' },
//     blue: { bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', border: 'hover:border-blue-100 focus:border-blue-500 focus:ring-blue-500/20' },
//     purple: { bg: 'bg-purple-100', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', border: 'hover:border-purple-100 focus:border-purple-500 focus:ring-purple-500/20' },
//     cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', btn: 'bg-cyan-600 hover:bg-cyan-700', border: 'hover:border-cyan-100 focus:border-cyan-500 focus:ring-cyan-500/20' },
//   };
//   const theme = colors[colorTheme] || colors.indigo;

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/`);
//       if (res.ok) setItems(await res.json());
//     } catch (err) {
//       console.error(`Error loading ${endpoint}:`, err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { loadData(); }, [endpoint]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newValue.trim()) return;

//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newValue.trim() })
//       });
//       if (res.ok) {
//         setNewValue('');
//         loadData();
//       }
//     } catch (err) { console.error(err); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm(`Are you sure you want to delete this item?`)) return;
//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
//       if (res.ok) loadData();
//     } catch (err) { console.error(err); }
//   };

//   return (
//     <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[420px] hover:shadow-md transition-shadow">
//       <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4 shrink-0">
//         <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} shadow-sm`}>
//           <Icon size={24} />
//         </div>
//         <div>
//           <h4 className="font-bold text-slate-800 text-lg leading-tight">{title}</h4>
//           <p className="text-xs text-slate-500 mt-0.5">{description}</p>
//         </div>
//       </div>
      
//       <div className="p-6 flex-1 flex flex-col min-h-0 bg-white">
//         <form onSubmit={handleAdd} className="flex gap-2 mb-5 shrink-0">
//           <input 
//             type="text" 
//             value={newValue}
//             onChange={(e) => setNewValue(e.target.value)}
//             placeholder={`Add new ${title.toLowerCase()}...`}
//             className={`flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${theme.border} focus:bg-white`}
//           />
//           <button 
//             type="submit"
//             disabled={!newValue.trim()}
//             className={`px-5 py-3 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm ${theme.btn}`}
//           >
//             <Plus size={18} />
//           </button>
//         </form>

//         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2.5">
//           {isLoading ? (
//             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-300" size={30} /></div>
//           ) : items.length === 0 ? (
//             <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
//               <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">No items yet</p>
//               <p className="text-xs text-slate-400 mt-1">Populate this dimension for your CRM.</p>
//             </div>
//           ) : (
//             items.map((item, index) => (
//               <div key={item.id} className={`flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl group transition-all hover:bg-white hover:shadow-sm ${theme.border}`}>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs font-bold text-slate-400 w-4">{index + 1}.</span>
//                   <span className="text-sm font-bold text-slate-700">{item.name}</span>
//                 </div>
//                 <button 
//                   onClick={() => handleDelete(item.id)}
//                   className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
//                   title="Delete"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- MAIN PAGE ---
// export const WorkflowMonitor = () => {
//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 shadow-xl text-white flex items-center gap-6">
//         <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
//           <Settings size={32} className="text-blue-300" />
//         </div>
//         <div>
//           <h2 className="text-3xl font-black">BD Cone Master Data</h2>
//           <p className="text-slate-400 mt-1 text-lg">
//             Configure the 6 dimensions of your Business Development Strategy.
//           </p>
//         </div>
//       </div>

//       {/* CONFIGURATION GRID - Exactly matching the handwritten note */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        
//         {/* 1. Products */}
//         <ConfigCard 
//           title="1. Product Lines" 
//           description="e.g., WMS, RFID, Labels, Ribbon"
//           endpoint="product-lines"
//           icon={Package}
//           colorTheme="blue"
//         />

//         {/* 2. Customer Categories */}
//         <ConfigCard 
//           title="2. Customer Categories" 
//           description="e.g., Key Accounts, Existing, Dealers"
//           endpoint="customer-categories"
//           icon={Users}
//           colorTheme="purple"
//         />

//         {/* 3. Channels */}
//         <ConfigCard 
//           title="3. Sales Channels" 
//           description="e.g., Direct Customers, Dealers"
//           endpoint="sales-channels"
//           icon={Network}
//           colorTheme="emerald"
//         />

//         {/* 4. Tools */}
//         <ConfigCard 
//           title="4. Engagement Tools" 
//           description="e.g., WhatsApp, Email, LinkedIn"
//           endpoint="engagement-tools"
//           icon={Wrench}
//           colorTheme="amber"
//         />

//         {/* 5. Regions */}
//         <ConfigCard 
//           title="5. Geographic Regions" 
//           description="e.g., North, South, West, International"
//           endpoint="regions"
//           icon={MapPin}
//           colorTheme="rose"
//         />

//         {/* 6. Verticals */}
//         <ConfigCard 
//           title="6. Industry Verticals" 
//           description="e.g., Automotive, Electrical, E-commerce"
//           endpoint="verticals"
//           icon={Building2}
//           colorTheme="indigo"
//         />

//         {/* Optional/Extra: Tags */}
//         <ConfigCard 
//           title="System Tags" 
//           description="Lead management tags (e.g., Urgent, VIP)"
//           endpoint="tags"
//           icon={TagIcon}
//           colorTheme="cyan"
//         />

//       </div>
//     </div>
//   );
// };

// export default WorkflowMonitor;

// import React, { useEffect, useState } from 'react';
// import {
//   Settings,
//   Layers,
//   MapPin,
//   Package,
//   Tag as TagIcon,
//   Plus,
//   Trash2,
//   Loader2,
//   Users,
//   Network,
//   Wrench,
//   Building2,
// } from 'lucide-react';

// const API_BASE = 'http://127.0.0.1:8000/api';

// // ─── CONFIG CARD ─────────────────────────────────────────────────────────────
// const ConfigCard = ({
//   title,
//   description,
//   endpoint,
//   icon: Icon,
//   colorTheme,
// }: {
//   title: string;
//   description: string;
//   endpoint: string;
//   icon: any;
//   colorTheme: string;
// }) => {
//   const [items, setItems] = useState<any[]>([]);
//   const [newValue, setNewValue] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   const colors: Record<string, any> = {
//     indigo: {
//       topBar:    'from-indigo-500 to-violet-500',
//       accentBar: 'bg-indigo-500',
//       iconBg:    'bg-gradient-to-br from-indigo-500 to-violet-600',
//       btn:       'from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700',
//       focusRing: 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400',
//       badge:     'bg-indigo-50 text-indigo-600 border-indigo-100',
//       dot:       'bg-indigo-500',
//       itemHover: 'hover:border-indigo-100',
//       emptyBg:   'bg-indigo-50 text-indigo-500',
//     },
//     rose: {
//       topBar:    'from-rose-500 to-pink-500',
//       accentBar: 'bg-rose-500',
//       iconBg:    'bg-gradient-to-br from-rose-500 to-pink-600',
//       btn:       'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
//       focusRing: 'focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400',
//       badge:     'bg-rose-50 text-rose-600 border-rose-100',
//       dot:       'bg-rose-500',
//       itemHover: 'hover:border-rose-100',
//       emptyBg:   'bg-rose-50 text-rose-500',
//     },
//     emerald: {
//       topBar:    'from-emerald-500 to-teal-400',
//       accentBar: 'bg-emerald-500',
//       iconBg:    'bg-gradient-to-br from-emerald-500 to-teal-600',
//       btn:       'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
//       focusRing: 'focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400',
//       badge:     'bg-emerald-50 text-emerald-600 border-emerald-100',
//       dot:       'bg-emerald-500',
//       itemHover: 'hover:border-emerald-100',
//       emptyBg:   'bg-emerald-50 text-emerald-500',
//     },
//     amber: {
//       topBar:    'from-amber-400 to-orange-400',
//       accentBar: 'bg-amber-400',
//       iconBg:    'bg-gradient-to-br from-amber-400 to-orange-500',
//       btn:       'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600',
//       focusRing: 'focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400',
//       badge:     'bg-amber-50 text-amber-600 border-amber-100',
//       dot:       'bg-amber-400',
//       itemHover: 'hover:border-amber-100',
//       emptyBg:   'bg-amber-50 text-amber-500',
//     },
//     blue: {
//       topBar:    'from-blue-500 to-cyan-400',
//       accentBar: 'bg-blue-500',
//       iconBg:    'bg-gradient-to-br from-blue-500 to-indigo-600',
//       btn:       'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
//       focusRing: 'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400',
//       badge:     'bg-blue-50 text-blue-600 border-blue-100',
//       dot:       'bg-blue-500',
//       itemHover: 'hover:border-blue-100',
//       emptyBg:   'bg-blue-50 text-blue-500',
//     },
//     purple: {
//       topBar:    'from-purple-500 to-fuchsia-500',
//       accentBar: 'bg-purple-500',
//       iconBg:    'bg-gradient-to-br from-purple-500 to-fuchsia-600',
//       btn:       'from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700',
//       focusRing: 'focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400',
//       badge:     'bg-purple-50 text-purple-600 border-purple-100',
//       dot:       'bg-purple-500',
//       itemHover: 'hover:border-purple-100',
//       emptyBg:   'bg-purple-50 text-purple-500',
//     },
//     cyan: {
//       topBar:    'from-cyan-500 to-blue-400',
//       accentBar: 'bg-cyan-500',
//       iconBg:    'bg-gradient-to-br from-cyan-500 to-blue-600',
//       btn:       'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
//       focusRing: 'focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-400',
//       badge:     'bg-cyan-50 text-cyan-600 border-cyan-100',
//       dot:       'bg-cyan-500',
//       itemHover: 'hover:border-cyan-100',
//       emptyBg:   'bg-cyan-50 text-cyan-500',
//     },
//   };
//   const theme = colors[colorTheme] || colors.indigo;

//   // --- all functions unchanged ---
//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/`);
//       if (res.ok) setItems(await res.json());
//     } catch (err) {
//       console.error(`Error loading ${endpoint}:`, err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { loadData(); }, [endpoint]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newValue.trim()) return;
//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newValue.trim() }),
//       });
//       if (res.ok) { setNewValue(''); loadData(); }
//     } catch (err) { console.error(err); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm(`Are you sure you want to delete this item?`)) return;
//     try {
//       const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
//       if (res.ok) loadData();
//     } catch (err) { console.error(err); }
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md
//       transition-all duration-200 overflow-hidden flex flex-col h-[420px]">

//       {/* top accent bar — matches BDMTargetCreate cards */}
//       <div className={`h-1 w-full bg-gradient-to-r ${theme.topBar} shrink-0`} />

//       {/* Card header — SectionHead pattern from BDMTargetCreate */}
//       <div className="px-5 pt-4 pb-4 border-b border-slate-100 shrink-0">
//         <div className="flex items-start gap-3">
//           <div className={`w-1 self-stretch rounded-full ${theme.accentBar} shrink-0`} />
//           <div className={`p-2.5 rounded-xl ${theme.iconBg} shadow-sm shrink-0`}>
//             <Icon size={16} className="text-white" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="text-[14px] font-black text-slate-800 leading-tight truncate">{title}</h4>
//             <p className="text-[11px] text-slate-400 mt-0.5 truncate">{description}</p>
//           </div>
//           {/* item count badge */}
//           {!isLoading && (
//             <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${theme.badge} shrink-0`}>
//               {items.length}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Card body */}
//       <div className="p-5 flex-1 flex flex-col min-h-0">

//         {/* Add form */}
//         <form onSubmit={handleAdd} className="flex gap-2 mb-4 shrink-0">
//           <input
//             type="text"
//             value={newValue}
//             onChange={(e) => setNewValue(e.target.value)}
//             placeholder={`Add new ${title.toLowerCase()}...`}
//             className={`flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px]
//               font-medium text-slate-700 placeholder:text-slate-300
//               focus:bg-white outline-none transition-all ${theme.focusRing}`}
//           />
//           <button
//             type="submit"
//             disabled={!newValue.trim()}
//             className={`px-4 py-3 text-white rounded-xl text-sm font-black
//               bg-gradient-to-r ${theme.btn}
//               disabled:opacity-40 disabled:cursor-not-allowed
//               transition-all shadow-sm active:scale-95 shrink-0`}
//           >
//             <Plus size={16} />
//           </button>
//         </form>

//         {/* Items list */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-0.5">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-10 gap-2">
//               <Loader2 className="animate-spin text-slate-300" size={22} />
//               <p className="text-[11px] text-slate-300 font-medium">Loading…</p>
//             </div>
//           ) : items.length === 0 ? (
//             <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-xl">
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 ${theme.emptyBg}`}>
//                 <Icon size={16} />
//               </div>
//               <p className="text-[12px] font-black text-slate-500">No items yet</p>
//               <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Add the first entry above.</p>
//             </div>
//           ) : (
//             items.map((item, index) => (
//               <div
//                 key={item.id}
//                 className={`flex items-center justify-between px-3.5 py-2.5
//                   bg-slate-50 border border-slate-100 rounded-xl group
//                   transition-all hover:bg-white hover:shadow-sm ${theme.itemHover}`}
//               >
//                 <div className="flex items-center gap-3 min-w-0">
//                   <span className={`w-5 h-5 rounded-full flex items-center justify-center
//                     text-[9px] font-black text-white ${theme.dot} shrink-0`}>
//                     {index + 1}
//                   </span>
//                   <span className="text-[13px] font-semibold text-slate-700 truncate">{item.name}</span>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500
//                     rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
//                   title="Delete"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// export const WorkflowMonitor = () => {
//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity:0; transform:translateY(14px) scale(0.99); }
//           to   { opacity:1; transform:translateY(0) scale(1); }
//         }
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px) translateX(0px); }
//           50%     { transform: translateY(-10px) translateX(6px); }
//         }
//         .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           BANNER — identical structure to BDMTargetCreate
//       ══════════════════════════════════════════════════ */}
//       <div
//         className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
//         style={{
//           background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//           boxShadow:  '0 8px 32px -4px rgba(79,70,229,0.45)',
//         }}
//       >
//         <div
//           className="px-6 py-5 flex items-center gap-4 flex-wrap"
//           style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
//         >
//           {/* icon block */}
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
//           >
//             <Settings className="text-white" size={20} />
//           </div>

//           {/* text */}
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               BD Cone Master Data
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Configure the 6 dimensions of your Business Development Strategy.
//             </p>
//           </div>

//           {/* dimension badge */}
//           <div
//             className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
//             style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
//           >
//             <Layers size={14} className="text-indigo-200" />
//             <span className="text-[12px] font-black text-indigo-100">7 Dimensions</span>
//           </div>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* section label — same style as BDMTargetsList */}
//         <div className="flex items-center gap-3 anim-fade-2">
//           <div className="w-1 h-4 bg-indigo-500 rounded-full" />
//           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//             Configuration Dimensions
//           </p>
//         </div>

//         {/* Cards grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 anim-fade-3 pb-4">

//           <ConfigCard
//             title="1. Product Lines"
//             description="e.g., WMS, RFID, Labels, Ribbon"
//             endpoint="product-lines"
//             icon={Package}
//             colorTheme="blue"
//           />
//           <ConfigCard
//             title="2. Customer Categories"
//             description="e.g., Key Accounts, Existing, Dealers"
//             endpoint="customer-categories"
//             icon={Users}
//             colorTheme="purple"
//           />
//           <ConfigCard
//             title="3. Sales Channels"
//             description="e.g., Direct Customers, Dealers"
//             endpoint="sales-channels"
//             icon={Network}
//             colorTheme="emerald"
//           />
//           <ConfigCard
//             title="4. Engagement Tools"
//             description="e.g., WhatsApp, Email, LinkedIn"
//             endpoint="engagement-tools"
//             icon={Wrench}
//             colorTheme="amber"
//           />
//           <ConfigCard
//             title="5. Geographic Regions"
//             description="e.g., North, South, West, International"
//             endpoint="regions"
//             icon={MapPin}
//             colorTheme="rose"
//           />
//           <ConfigCard
//             title="6. Industry Verticals"
//             description="e.g., Automotive, Electrical, E-commerce"
//             endpoint="verticals"
//             icon={Building2}
//             colorTheme="indigo"
//           />
//           <ConfigCard
//             title="System Tags"
//             description="Lead management tags (e.g., Urgent, VIP)"
//             endpoint="tags"
//             icon={TagIcon}
//             colorTheme="cyan"
//           />

//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkflowMonitor;




import React, { useEffect, useState } from 'react';
import {
  Settings, Layers, MapPin, Package, Tag as TagIcon,
  Plus, Trash2, Loader2, Users, Network, Wrench, Building2,
} from 'lucide-react';

const API_BASE = '/api';

// ─── CONFIG CARD ─────────────────────────────────────────────────────────────
const ConfigCard = ({
  title, description, endpoint, icon: Icon, colorTheme,
}: {
  title: string; description: string; endpoint: string; icon: any; colorTheme: string;
}) => {
  const [items, setItems]       = useState<any[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const colors: Record<string, any> = {
    indigo: {
      topBar:    'linear-gradient(90deg,#4f46e5,#7c3aed)',
      iconBg:    'linear-gradient(135deg,#4f46e5,#7c3aed)',
      iconGlow:  'rgba(79,70,229,0.35)',
      btn:       'linear-gradient(135deg,#4f46e5,#7c3aed)',
      btnGlow:   'rgba(79,70,229,0.35)',
      focusBorder:'#6366f1', focusRing:'rgba(99,102,241,0.15)',
      badge:     { bg:'#eef2ff', text:'#4f46e5', border:'#c7d2fe' },
      dot:       '#4f46e5',
      itemBorder:'#e0e7ff', itemHoverBorder:'#a5b4fc',
      cardBorder:'#e0e7ff', cardHoverBorder:'#a5b4fc',
      cardGlow:  'rgba(79,70,229,0.12)',
      emptyBg:   '#eef2ff', emptyText:'#4f46e5',
    },
    rose: {
      topBar:    'linear-gradient(90deg,#f43f5e,#ec4899)',
      iconBg:    'linear-gradient(135deg,#f43f5e,#ec4899)',
      iconGlow:  'rgba(244,63,94,0.35)',
      btn:       'linear-gradient(135deg,#f43f5e,#ec4899)',
      btnGlow:   'rgba(244,63,94,0.35)',
      focusBorder:'#fb7185', focusRing:'rgba(244,63,94,0.15)',
      badge:     { bg:'#fff1f2', text:'#e11d48', border:'#fecdd3' },
      dot:       '#f43f5e',
      itemBorder:'#ffe4e6', itemHoverBorder:'#fda4af',
      cardBorder:'#ffe4e6', cardHoverBorder:'#fda4af',
      cardGlow:  'rgba(244,63,94,0.1)',
      emptyBg:   '#fff1f2', emptyText:'#e11d48',
    },
    emerald: {
      topBar:    'linear-gradient(90deg,#10b981,#0d9488)',
      iconBg:    'linear-gradient(135deg,#10b981,#0d9488)',
      iconGlow:  'rgba(16,185,129,0.35)',
      btn:       'linear-gradient(135deg,#10b981,#0d9488)',
      btnGlow:   'rgba(16,185,129,0.35)',
      focusBorder:'#34d399', focusRing:'rgba(16,185,129,0.15)',
      badge:     { bg:'#ecfdf5', text:'#059669', border:'#a7f3d0' },
      dot:       '#10b981',
      itemBorder:'#d1fae5', itemHoverBorder:'#6ee7b7',
      cardBorder:'#d1fae5', cardHoverBorder:'#6ee7b7',
      cardGlow:  'rgba(16,185,129,0.1)',
      emptyBg:   '#ecfdf5', emptyText:'#059669',
    },
    amber: {
      topBar:    'linear-gradient(90deg,#f59e0b,#f97316)',
      iconBg:    'linear-gradient(135deg,#f59e0b,#f97316)',
      iconGlow:  'rgba(245,158,11,0.35)',
      btn:       'linear-gradient(135deg,#f59e0b,#f97316)',
      btnGlow:   'rgba(245,158,11,0.35)',
      focusBorder:'#fbbf24', focusRing:'rgba(245,158,11,0.15)',
      badge:     { bg:'#fffbeb', text:'#d97706', border:'#fde68a' },
      dot:       '#f59e0b',
      itemBorder:'#fef3c7', itemHoverBorder:'#fcd34d',
      cardBorder:'#fef3c7', cardHoverBorder:'#fcd34d',
      cardGlow:  'rgba(245,158,11,0.1)',
      emptyBg:   '#fffbeb', emptyText:'#d97706',
    },
    blue: {
      topBar:    'linear-gradient(90deg,#3b82f6,#06b6d4)',
      iconBg:    'linear-gradient(135deg,#3b82f6,#6366f1)',
      iconGlow:  'rgba(59,130,246,0.35)',
      btn:       'linear-gradient(135deg,#3b82f6,#6366f1)',
      btnGlow:   'rgba(59,130,246,0.35)',
      focusBorder:'#60a5fa', focusRing:'rgba(59,130,246,0.15)',
      badge:     { bg:'#eff6ff', text:'#2563eb', border:'#bfdbfe' },
      dot:       '#3b82f6',
      itemBorder:'#dbeafe', itemHoverBorder:'#93c5fd',
      cardBorder:'#dbeafe', cardHoverBorder:'#93c5fd',
      cardGlow:  'rgba(59,130,246,0.1)',
      emptyBg:   '#eff6ff', emptyText:'#2563eb',
    },
    purple: {
      topBar:    'linear-gradient(90deg,#9333ea,#d946ef)',
      iconBg:    'linear-gradient(135deg,#9333ea,#d946ef)',
      iconGlow:  'rgba(147,51,234,0.35)',
      btn:       'linear-gradient(135deg,#9333ea,#d946ef)',
      btnGlow:   'rgba(147,51,234,0.35)',
      focusBorder:'#c084fc', focusRing:'rgba(147,51,234,0.15)',
      badge:     { bg:'#faf5ff', text:'#7e22ce', border:'#ddd6fe' },
      dot:       '#9333ea',
      itemBorder:'#ede9fe', itemHoverBorder:'#c4b5fd',
      cardBorder:'#ede9fe', cardHoverBorder:'#c4b5fd',
      cardGlow:  'rgba(147,51,234,0.1)',
      emptyBg:   '#faf5ff', emptyText:'#7e22ce',
    },
    cyan: {
      topBar:    'linear-gradient(90deg,#06b6d4,#3b82f6)',
      iconBg:    'linear-gradient(135deg,#06b6d4,#0284c7)',
      iconGlow:  'rgba(6,182,212,0.35)',
      btn:       'linear-gradient(135deg,#06b6d4,#0284c7)',
      btnGlow:   'rgba(6,182,212,0.35)',
      focusBorder:'#22d3ee', focusRing:'rgba(6,182,212,0.15)',
      badge:     { bg:'#ecfeff', text:'#0e7490', border:'#a5f3fc' },
      dot:       '#06b6d4',
      itemBorder:'#cffafe', itemHoverBorder:'#67e8f9',
      cardBorder:'#cffafe', cardHoverBorder:'#67e8f9',
      cardGlow:  'rgba(6,182,212,0.1)',
      emptyBg:   '#ecfeff', emptyText:'#0e7490',
    },
  };
  const t = colors[colorTheme] || colors.indigo;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`);
      if (res.ok) setItems(await res.json());
    } catch (err) { console.error(`Error loading ${endpoint}:`, err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, [endpoint]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newValue.trim() }),
      });
      if (res.ok) { setNewValue(''); loadData(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div
      className="config-card bg-white flex flex-col overflow-hidden"
      style={{
        borderRadius: '18px',
        border: `1.5px solid ${t.cardBorder}`,
        boxShadow: `0 4px 20px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)`,
        height: '420px',
        transition: 'all 0.28s cubic-bezier(0.34,1.1,0.64,1)',
        '--card-hover-border': t.cardHoverBorder,
        '--card-hover-glow': t.cardGlow,
      } as React.CSSProperties}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-5px) scale(1.01)';
        el.style.boxShadow = `0 16px 40px ${t.cardGlow}, 0 4px 12px rgba(0,0,0,0.06)`;
        el.style.border = `1.5px solid ${t.cardHoverBorder}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = '0 4px 20px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)';
        el.style.border = `1.5px solid ${t.cardBorder}`;
      }}>

      {/* top accent bar */}
      <div className="h-[3px] w-full shrink-0" style={{ background: t.topBar }} />

      {/* card header */}
      <div className="px-5 pt-4 pb-4 shrink-0" style={{ borderBottom:'1px solid #f1f5f9' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: t.iconBg, boxShadow: `0 4px 14px ${t.iconGlow}` }}>
            <Icon size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[15px] font-black text-slate-800 leading-tight truncate">{title}</h4>
            <p className="text-[12px] text-slate-400 mt-0.5 truncate font-medium">{description}</p>
          </div>
          {!isLoading && (
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg border shrink-0"
              style={{ background: t.badge.bg, color: t.badge.text, borderColor: t.badge.border }}>
              {items.length}
            </span>
          )}
        </div>
      </div>

      {/* card body */}
      <div className="p-5 flex-1 flex flex-col min-h-0">

        {/* add form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4 shrink-0">
          <input
            type="text"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}...`}
            className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 outline-none transition-all duration-200"
            style={{ border:'1.5px solid #e2e8f0' }}
            onFocus={e => {
              e.currentTarget.style.borderColor = t.focusBorder;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${t.focusRing}`;
              e.currentTarget.style.background = '#ffffff';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = '#f8fafc';
            }}
          />
          <button
            type="submit"
            disabled={!newValue.trim()}
            className="px-4 py-2.5 text-white rounded-xl font-black disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
            style={{
              background: t.btn,
              boxShadow: `0 4px 12px ${t.btnGlow}`,
              transition: 'all 0.2s cubic-bezier(0.34,1.2,0.64,1)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.05)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 18px ${t.btnGlow}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.btnGlow}`;
            }}>
            <Plus size={16} />
          </button>
        </form>

        {/* items list */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-1.5 pr-0.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: t.badge.bg, border: `1px solid ${t.badge.border}` }}>
                <Loader2 className="animate-spin" size={18} style={{ color: t.badge.text }} />
              </div>
              <p className="text-[12px] text-slate-400 font-medium">Loading…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl"
              style={{ border:`2px dashed ${t.itemBorder}`, background:`${t.emptyBg}22` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: t.emptyBg }}>
                <Icon size={16} style={{ color: t.emptyText }} />
              </div>
              <p className="text-[12px] font-black text-slate-500">No items yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Add the first entry above.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                style={{
                  background:'#f8fafc',
                  border: `1.5px solid ${t.itemBorder}`,
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = '#ffffff';
                  el.style.borderColor = t.itemHoverBorder;
                  el.style.transform = 'translateX(3px)';
                  el.style.boxShadow = `0 2px 10px ${t.cardGlow}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = '#f8fafc';
                  el.style.borderColor = t.itemBorder;
                  el.style.transform = '';
                  el.style.boxShadow = 'none';
                }}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                    style={{ background: t.dot }}>
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-semibold text-slate-700 truncate">{item.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 shrink-0"
                  style={{ transition:'all 0.15s ease', color:'#cbd5e1' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff1f2';
                    (e.currentTarget as HTMLButtonElement).style.color = '#f43f5e';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1';
                  }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export const WorkflowMonitor = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes floatBlob {
          0%,100% { transform:translateY(0) translateX(0); }
          50%     { transform:translateY(-12px) translateX(6px); }
        }
        .anim-blob { animation:floatBlob 7s ease-in-out infinite; }
        .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }
      `}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay:'3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative f1"
        style={{
          background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
          boxShadow:'0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
        }}>
        <div className="shimmer-overlay" />
        <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
          style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <Settings className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">
              BD Cone Master Data
            </h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Configure the 7 dimensions of your Business Development Strategy.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
            <Layers size={14} className="text-indigo-200" />
            <span className="text-[13px] font-black text-indigo-100">7 Dimensions</span>
          </div>
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* section label */}
        <div className="flex items-center gap-3 f2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
            <Settings size={17} className="text-white" />
          </div>
          <div>
            <h2 className="text-[17px] font-black text-slate-800 leading-tight">Configuration Dimensions</h2>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5">
              Manage your master data across all BD dimensions
            </p>
          </div>
        </div>

        {/* cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 f3 pb-4">
          <ConfigCard title="1. Product Lines"       description="e.g., WMS, RFID, Labels, Ribbon"          endpoint="product-lines"       icon={Package}  colorTheme="blue"    />
          <ConfigCard title="2. Customer Categories" description="e.g., Key Accounts, Existing, Dealers"     endpoint="customer-categories" icon={Users}    colorTheme="purple"  />
          <ConfigCard title="3. Sales Channels"      description="e.g., Direct Customers, Dealers"           endpoint="sales-channels"      icon={Network}  colorTheme="emerald" />
          <ConfigCard title="4. Engagement Tools"    description="e.g., WhatsApp, Email, LinkedIn"           endpoint="engagement-tools"    icon={Wrench}   colorTheme="amber"   />
          <ConfigCard title="5. Geographic Regions"  description="e.g., North, South, West, International"   endpoint="regions"             icon={MapPin}   colorTheme="rose"    />
          <ConfigCard title="6. Industry Verticals"  description="e.g., Automotive, Electrical, E-commerce"  endpoint="verticals"           icon={Building2} colorTheme="indigo"  />
          <ConfigCard title="System Tags"            description="Lead management tags (e.g., Urgent, VIP)"  endpoint="tags"                icon={TagIcon}  colorTheme="cyan"    />
        </div>

      </div>
    </div>
  );
};

export default WorkflowMonitor;
