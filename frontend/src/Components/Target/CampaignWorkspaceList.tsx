// import React, { useEffect, useState } from 'react';
// import {
//   Wand2,
//   Plus,
//   Mail,
//   MessageCircle,
//   Linkedin,
//   Clock,
//   CheckCircle,
//   Send,
//   Archive,
//   Eye,
//   Sparkles,
//   X,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface CampaignWorkspace {
//   id: number;
//   name: string;
//   brand_name: string;
//   content_theme: string;
//   target_description: string;
//   selected_channel: string;
//   generated_subject: string;
//   generated_content: string;
//   status: string;
//   created_at: string;
//   responses?: any[];
// }

// export const CampaignWorkspaceList = () => {
//   const [workspaces, setWorkspaces] = useState<CampaignWorkspace[]>([]);
//   const [analytics, setAnalytics] = useState<any>(null);
//   const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
//   const navigate = useNavigate();

//   const loadData = async () => {
//     try {
//       const [wsRes, analyticsRes] = await Promise.all([
//         fetch(`${API_BASE}/campaign-workspace/`),
//         fetch(`${API_BASE}/campaign-workspace/analytics/`),
//       ]);

//       setWorkspaces(await wsRes.json());
//       setAnalytics(await analyticsRes.json());
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const getChannelIcon = (channel: string) => {
//     switch (channel) {
//       case 'whatsapp':
//         return <MessageCircle size={16} className="text-emerald-600" />;
//       case 'email':
//         return <Mail size={16} className="text-blue-600" />;
//       case 'linkedin':
//         return <Linkedin size={16} className="text-sky-600" />;
//       default:
//         return <MessageCircle size={16} className="text-slate-400" />;
//     }
//   };

//   const getChannelColor = (channel: string) => {
//     switch (channel) {
//       case 'whatsapp':
//         return 'bg-emerald-50 border-emerald-200 text-emerald-700';
//       case 'email':
//         return 'bg-blue-50 border-blue-200 text-blue-700';
//       case 'linkedin':
//         return 'bg-sky-50 border-sky-200 text-sky-700';
//       default:
//         return 'bg-slate-50 border-slate-200 text-slate-600';
//     }
//   };

//   const getChannelAccent = (channel: string) => {
//     switch (channel) {
//       case 'whatsapp':
//         return 'from-emerald-500 to-green-400';
//       case 'email':
//         return 'from-blue-500 to-cyan-400';
//       case 'linkedin':
//         return 'from-sky-500 to-blue-500';
//       default:
//         return 'from-indigo-500 to-violet-500';
//     }
//   };

//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case 'ready':
//         return { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} /> };
//       case 'sent':
//         return { color: 'bg-blue-100 text-blue-700', icon: <Send size={12} /> };
//       case 'archived':
//         return { color: 'bg-slate-100 text-slate-600', icon: <Archive size={12} /> };
//       default:
//         return { color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
//     }
//   };

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   return (
//     <div className="relative p-8 h-full overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 via-white to-indigo-100">
//       <style>
//         {`
//           @keyframes floatBlob {
//             0% { transform: translateY(0px) translateX(0px); }
//             50% { transform: translateY(-10px) translateX(6px); }
//             100% { transform: translateY(0px) translateX(0px); }
//           }
//           @keyframes fadeUp {
//             0% { opacity: 0; transform: translateY(16px) scale(0.99); }
//             100% { opacity: 1; transform: translateY(0px) scale(1); }
//           }
//           .anim-blob {
//             animation: floatBlob 7s ease-in-out infinite;
//           }
//           .anim-fade-1 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .05s; }
//           .anim-fade-2 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .15s; }
//           .anim-fade-3 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .25s; }
//         `}
//       </style>

//       <div className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 rounded-full bg-blue-300/30 blur-3xl anim-blob" />
//       <div className="pointer-events-none absolute top-44 -right-20 w-80 h-80 rounded-full bg-indigo-300/25 blur-3xl anim-blob" />

//       <header className="relative mb-8 flex justify-between items-center flex-wrap gap-4 anim-fade-1">
//         <div>
//           <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
//             <span className="inline-flex p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow">
//               <Wand2 size={24} />
//             </span>
//             Campaign Workspace
//           </h2>
//           <p className="text-slate-600 mt-2">Generate and manage multi-channel campaign drafts.</p>
//         </div>

//         <button
//           onClick={() => navigate('/campaign-workspace/new')}
//           className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-300 hover:scale-[1.02] active:scale-[0.99]"
//         >
//           <Plus size={16} /> New Workspace
//         </button>
//       </header>

//       {analytics && (
//         <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 anim-fade-2">
//           <StatCard title="Total Workspaces" value={analytics.total_workspaces} color="indigo" />
//           <StatCard title="Ready" value={analytics.ready_campaigns} color="emerald" />
//           <StatCard title="Sent" value={analytics.sent_campaigns} color="blue" />
//           <StatCard title="Interested" value={analytics.responses?.interested || 0} color="amber" />
//         </div>
//       )}

//       <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 anim-fade-3">
//         {workspaces.map((w) => {
//           const statusConfig = getStatusConfig(w.status);
//           const responseCount = w.responses?.length || 0;

//           return (
//             <div
//               key={w.id}
//               className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group hover:-translate-y-1"
//               onClick={() => setSelectedWorkspace(w)}
//             >
//               <div className={`h-1.5 w-full bg-gradient-to-r ${getChannelAccent(w.selected_channel)}`} />

//               <div className="p-5 flex-1 flex flex-col">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${getChannelColor(w.selected_channel)}`}>
//                     {getChannelIcon(w.selected_channel)}
//                     <span className="capitalize">{w.selected_channel}</span>
//                   </span>

//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${statusConfig.color}`}>
//                     {statusConfig.icon}
//                     {w.status.toUpperCase()}
//                   </span>
//                 </div>

//                 <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
//                   {w.name}
//                 </h3>

//                 {w.brand_name && <p className="text-sm text-slate-500 mt-1">{w.brand_name}</p>}

//                 {w.content_theme && (
//                   <div className="mt-3">
//                     <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-indigo-200">
//                       {w.content_theme}
//                     </span>
//                   </div>
//                 )}

//                 {w.generated_subject && (
//                   <div className="mt-3">
//                     <p className="text-xs uppercase font-bold text-slate-400">Subject</p>
//                     <p className="text-sm text-slate-700 mt-0.5 line-clamp-1">{w.generated_subject}</p>
//                   </div>
//                 )}

//                 {w.generated_content && (
//                   <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1">
//                     <p className="text-xs text-slate-600 line-clamp-3">{w.generated_content}</p>
//                   </div>
//                 )}

//                 <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
//                   <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>

//                   <div className="flex items-center gap-3">
//                     {responseCount > 0 && (
//                       <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-medium border border-emerald-200">
//                         {responseCount} response{responseCount > 1 ? 's' : ''}
//                       </span>
//                     )}
//                     <button className="text-slate-400 hover:text-indigo-600 transition-colors">
//                       <Eye size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {workspaces.length === 0 && (
//           <div className="col-span-full text-center py-16 bg-white/90 border border-blue-100 rounded-2xl shadow-sm">
//             <Sparkles size={40} className="mx-auto text-indigo-300 mb-3" />
//             <p className="text-slate-600 font-semibold">No workspaces found</p>
//             <p className="text-sm text-slate-400 mt-1">Create your first AI campaign draft.</p>
//             <button
//               onClick={() => navigate('/campaign-workspace/new')}
//               className="mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-xl font-bold inline-flex items-center gap-2 transition-all"
//             >
//               <Plus size={16} /> Create Workspace
//             </button>
//           </div>
//         )}
//       </div>

//       {selectedWorkspace && (
//         <div
//           className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedWorkspace(null)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-[fadeUp_.3s_ease-out]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={`h-2 w-full rounded-t-2xl bg-gradient-to-r ${getChannelAccent(selectedWorkspace.selected_channel)}`} />

//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-slate-800">{selectedWorkspace.name}</h3>
//                   <p className="text-sm text-slate-500 mt-1">
//                     {selectedWorkspace.brand_name ? `${selectedWorkspace.brand_name}   ` : ''}
//                     <span className="capitalize">{selectedWorkspace.selected_channel}</span>
//                     {'   '}
//                     {formatDate(selectedWorkspace.created_at)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {(() => {
//                     const sc = getStatusConfig(selectedWorkspace.status);
//                     return (
//                       <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${sc.color}`}>
//                         {sc.icon}
//                         {selectedWorkspace.status.toUpperCase()}
//                       </span>
//                     );
//                   })()}
//                   <button
//                     onClick={() => setSelectedWorkspace(null)}
//                     className="text-slate-400 hover:text-slate-600 p-1 rounded"
//                   >
//                     <X size={18} />
//                   </button>
//                 </div>
//               </div>

//               {selectedWorkspace.content_theme && (
//                 <div className="mb-4">
//                   <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-lg border border-indigo-200">
//                     Theme: {selectedWorkspace.content_theme}
//                   </span>
//                 </div>
//               )}

//               {selectedWorkspace.target_description && (
//                 <div className="mb-4">
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-1">Target Audience</p>
//                   <p className="text-sm text-slate-700">{selectedWorkspace.target_description}</p>
//                 </div>
//               )}

//               {selectedWorkspace.generated_subject && (
//                 <div className="mb-4">
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-1">Subject Line</p>
//                   <p className="text-sm font-medium text-slate-800">{selectedWorkspace.generated_subject}</p>
//                 </div>
//               )}

//               <div className="mb-4">
//                 <p className="text-xs uppercase font-bold text-slate-400 mb-2">Generated Content</p>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                   <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedWorkspace.generated_content}</p>
//                 </div>
//               </div>

//               {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
//                 <div>
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-2">
//                     Responses ({selectedWorkspace.responses.length})
//                   </p>
//                   <div className="space-y-2">
//                     {selectedWorkspace.responses.map((r: any) => (
//                       <div key={r.id} className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
//                         <strong>{r.lead_name}</strong>
//                         <span className="mx-1 text-emerald-500"> </span>
//                         <span className="capitalize">{r.response_type.replace('_', ' ')}</span>
//                         {r.response_text && <p className="mt-1 text-slate-600">{r.response_text}</p>}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
//                 <button
//                   onClick={() => setSelectedWorkspace(null)}
//                   className="px-5 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => {
//   const colorMap: Record<string, string> = {
//     indigo: 'border-l-indigo-500',
//     emerald: 'border-l-emerald-500',
//     blue: 'border-l-blue-500',
//     amber: 'border-l-amber-500',
//   };

//   return (
//     <div className={`bg-white/90 p-5 rounded-2xl border border-blue-100 shadow-sm border-l-4 ${colorMap[color] || 'border-l-slate-500'}`}>
//       <p className="text-xs uppercase text-slate-400 font-bold">{title}</p>
//       <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
//     </div>
//   );
// };

// export default CampaignWorkspaceList;


// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Wand2, Plus, Mail, MessageCircle, Linkedin,
//   Clock, CheckCircle, Send, Archive, Eye, X,
//   BarChart3, TrendingUp, Sparkles,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface CampaignWorkspace {
//   id: number;
//   name: string;
//   brand_name: string;
//   content_theme: string;
//   target_description: string;
//   selected_channel: string;
//   generated_subject: string;
//   generated_content: string;
//   status: string;
//   created_at: string;
//   responses?: any[];
// }

// /* ─── channel helpers ─── */
// const getChannelIcon = (channel: string) => {
//   switch (channel) {
//     case 'whatsapp': return <MessageCircle size={13} className="text-emerald-600" />;
//     case 'email':    return <Mail          size={13} className="text-blue-600"    />;
//     case 'linkedin': return <Linkedin      size={13} className="text-sky-600"    />;
//     default:         return <MessageCircle size={13} className="text-slate-400"  />;
//   }
// };

// const getChannelColor = (channel: string) => {
//   switch (channel) {
//     case 'whatsapp': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
//     case 'email':    return 'bg-blue-50 border-blue-200 text-blue-700';
//     case 'linkedin': return 'bg-sky-50 border-sky-200 text-sky-700';
//     default:         return 'bg-slate-50 border-slate-200 text-slate-600';
//   }
// };

// const getChannelAccent = (channel: string) => {
//   switch (channel) {
//     case 'whatsapp': return 'from-emerald-500 to-green-400';
//     case 'email':    return 'from-blue-500 to-cyan-400';
//     case 'linkedin': return 'from-sky-500 to-blue-500';
//     default:         return 'from-indigo-500 to-violet-500';
//   }
// };

// /* ─── status helpers ─── */
// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case 'ready':    return { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: <CheckCircle size={11} /> };
//     case 'sent':     return { color: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500',    icon: <Send        size={11} /> };
//     case 'archived': return { color: 'bg-slate-100 text-slate-600',     dot: 'bg-slate-400',   icon: <Archive     size={11} /> };
//     default:         return { color: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400',   icon: <Clock       size={11} /> };
//   }
// };

// const formatDate = (d: string) =>
//   new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// /* ════════════════════════════
//    ANIMATED COUNTER
// ════════════════════════════ */
// const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
//   const [display, setDisplay] = useState(0);
//   const raf = useRef<number | null>(null);

//   useEffect(() => {
//     const start = performance.now();
//     const duration = 900;
//     const tick = (now: number) => {
//       const p = Math.min((now - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - p, 3);
//       setDisplay(Math.round(eased * value));
//       if (p < 1) raf.current = requestAnimationFrame(tick);
//     };
//     raf.current = requestAnimationFrame(tick);
//     return () => { if (raf.current) cancelAnimationFrame(raf.current); };
//   }, [value]);

//   return <>{display}</>;
// };

// /* ════════════════════════════
//    STAT CARD — original colored gradient pill style
//    with count-up animation + fade-up
// ════════════════════════════ */
// interface StatCardProps {
//   title: string;
//   value: number;
//   gradient: string;
//   icon: React.FC<any>;
//   sub: string;
//   delay: number;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, gradient, icon: Icon, sub, delay }) => {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setVisible(true), delay);
//     return () => clearTimeout(t);
//   }, [delay]);

//   return (
//     <div
//       className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md
//         transition-all duration-500 ease-out ${gradient}
//         ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
//     >
//       {/* decorative rings */}
//       <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
//       <div className="absolute -right-1  top-8  h-12 w-12 rounded-full bg-white/10" />

//       <div className="relative flex items-start justify-between gap-2">
//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 mb-1.5">{title}</p>
//           <p className="text-[2rem] font-black leading-none tabular-nums">
//             {visible ? <AnimatedNumber value={value} /> : 0}
//           </p>
//           <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>
//         </div>
//         <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
//           <Icon size={17} strokeWidth={2.5} />
//         </span>
//       </div>
//     </div>
//   );
// };

// /* ════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════ */
// export const CampaignWorkspaceList = () => {
//   const [workspaces, setWorkspaces]               = useState<CampaignWorkspace[]>([]);
//   const [analytics, setAnalytics]                 = useState<any>(null);
//   const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
//   const navigate = useNavigate();

//   const loadData = async () => {
//     try {
//       const [wsRes, analyticsRes] = await Promise.all([
//         fetch(`${API_BASE}/campaign-workspace/`),
//         fetch(`${API_BASE}/campaign-workspace/analytics/`),
//       ]);
//       setWorkspaces(await wsRes.json());
//       setAnalytics(await analyticsRes.json());
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => { loadData(); }, []);

//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       {/* ── keyframes — same as BDMTargetCreate ── */}
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity:0; transform:translateY(14px) scale(0.99); }
//           to   { opacity:1; transform:translateY(0) scale(1); }
//         }
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px) translateX(0px); }
//           50%     { transform: translateY(-10px) translateX(6px); }
//         }
//         .anim-blob    { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           BANNER — identical structure to BDMTargetCreate:
//           shrink-0  mx-4  mt-4  rounded-2xl  overflow-hidden
//           same linear-gradient + boxShadow
//           inner radial-gradient overlay
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
//           {/* icon block — identical to BDMTargetCreate banner */}
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(4px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//             }}
//           >
//             <Wand2 className="text-white" size={20} />
//           </div>

//           {/* text */}
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               Campaign Workspace
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Generate and manage multi-channel campaign drafts.
//             </p>
//           </div>

//           {/* New Workspace CTA */}
//           <button
//             onClick={() => navigate('/campaign-workspace/new')}
//             className="inline-flex items-center gap-1.5 rounded-xl bg-white text-indigo-700
//               hover:bg-indigo-50 active:bg-indigo-100
//               px-4 py-2.5 text-xs font-black shadow-md shadow-indigo-900/20
//               transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] shrink-0"
//           >
//             <Plus size={14} strokeWidth={2.5} /> New Workspace
//           </button>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY — same as BDMTargetCreate: flex-1 overflow-y-auto p-4 ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* ── STAT CARDS — BDMTargetCreate white-card style ── */}
//         {analytics && (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 anim-fade-2">
//             <StatCard
//               title="Total Workspaces" value={Number(analytics.total_workspaces ?? 0)}
//               gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
//               icon={BarChart3} sub="all time" delay={0}
//             />
//             <StatCard
//               title="Ready" value={Number(analytics.ready_campaigns ?? 0)}
//               gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
//               icon={CheckCircle} sub="awaiting send" delay={80}
//             />
//             <StatCard
//               title="Sent" value={Number(analytics.sent_campaigns ?? 0)}
//               gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
//               icon={Send} sub="delivered" delay={160}
//             />
//             <StatCard
//               title="Interested" value={Number(analytics.responses?.interested ?? 0)}
//               gradient="bg-gradient-to-br from-amber-400 to-orange-500"
//               icon={TrendingUp} sub="responses" delay={240}
//             />
//           </div>
//         )}

//         {/* ── SECTION LABEL ── */}
//         {workspaces.length > 0 && (
//           <div className="anim-fade-3">
//             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//               All Campaigns
//               <span className="ml-1.5 normal-case font-normal tracking-normal text-slate-300">
//                 ({workspaces.length})
//               </span>
//             </p>
//           </div>
//         )}

//         {/* ── CAMPAIGN CARDS GRID ── */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 anim-fade-3">
//           {workspaces.map((w) => {
//             const sc = getStatusConfig(w.status);
//             const responseCount = w.responses?.length ?? 0;

//             return (
//               <div
//                 key={w.id}
//                 onClick={() => setSelectedWorkspace(w)}
//                 className="bg-white rounded-2xl border border-slate-200/80 shadow-sm
//                   hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden
//                   cursor-pointer group hover:-translate-y-0.5"
//               >
//                 {/* channel top accent bar — same 1px height as BDMTargetCreate cards */}
//                 <div className={`h-1 w-full bg-gradient-to-r ${getChannelAccent(w.selected_channel)}`} />

//                 <div className="p-5 flex flex-col flex-1 gap-3">
//                   {/* channel + status */}
//                   <div className="flex justify-between items-center flex-wrap gap-2">
//                     <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${getChannelColor(w.selected_channel)}`}>
//                       {getChannelIcon(w.selected_channel)}
//                       <span className="capitalize">{w.selected_channel}</span>
//                     </span>
//                     <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${sc.color}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
//                       {w.status.toUpperCase()}
//                     </span>
//                   </div>

//                   {/* left-accent name section — matches SectionHead style */}
//                   <div className="flex items-start gap-3">
//                     <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${getChannelAccent(w.selected_channel)} shrink-0`} />
//                     <div className="min-w-0">
//                       <h3 className="text-[14px] font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
//                         {w.name}
//                       </h3>
//                       {w.brand_name && (
//                         <p className="text-[11px] text-slate-400 mt-0.5">{w.brand_name}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* theme badge */}
//                   {w.content_theme && (
//                     <span className="self-start bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-lg border border-indigo-200">
//                       {w.content_theme}
//                     </span>
//                   )}

//                   {/* subject */}
//                   {w.generated_subject && (
//                     <div>
//                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Subject</p>
//                       <p className="text-xs text-slate-700 font-medium line-clamp-1">{w.generated_subject}</p>
//                     </div>
//                   )}

//                   {/* content preview */}
//                   {w.generated_content && (
//                     <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
//                       <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{w.generated_content}</p>
//                     </div>
//                   )}

//                   {/* footer */}
//                   <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
//                     <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>
//                     <div className="flex items-center gap-2">
//                       {responseCount > 0 && (
//                         <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg font-semibold border border-emerald-200">
//                           {responseCount} response{responseCount > 1 ? 's' : ''}
//                         </span>
//                       )}
//                       <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">
//                         <Eye size={14} />
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* empty state */}
//           {workspaces.length === 0 && (
//             <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//               <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
//               <div className="text-center py-20 px-6">
//                 <div
//                   className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
//                   style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)', opacity: 0.15 }}
//                 >
//                   <Sparkles size={24} className="text-indigo-600" style={{ opacity: 1 }} />
//                 </div>
//                 <Sparkles size={28} className="mx-auto text-indigo-300 mb-3 -mt-16" />
//                 <p className="text-sm font-black text-slate-700 mt-2">No workspaces found</p>
//                 <p className="text-xs text-slate-400 mt-1 font-medium">Create your first AI campaign draft.</p>
//                 <button
//                   onClick={() => navigate('/campaign-workspace/new')}
//                   className="mt-5 text-white px-6 py-2.5 rounded-xl text-sm font-black
//                     inline-flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.99]"
//                   style={{
//                     background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//                     boxShadow: '0 4px 18px rgba(79,70,229,0.40)',
//                   }}
//                 >
//                   <Plus size={14} /> Create Workspace
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── DETAIL MODAL ── */}
//         {selectedWorkspace && (
//           <div
//             className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
//             onClick={() => setSelectedWorkspace(null)}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
//               style={{ animation: 'fadeUp .3s ease-out forwards' }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* top accent bar matching card */}
//               <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${getChannelAccent(selectedWorkspace.selected_channel)}`} />

//               <div className="p-6">
//                 {/* modal header with left-accent bar style */}
//                 <div className="flex justify-between items-start gap-4 mb-5 pb-4 border-b border-slate-100">
//                   <div className="flex items-start gap-3">
//                     <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${getChannelAccent(selectedWorkspace.selected_channel)} shrink-0`} />
//                     <div>
//                       <h3 className="text-[14px] font-black text-slate-800">{selectedWorkspace.name}</h3>
//                       <p className="text-[11px] text-slate-400 mt-0.5">
//                         {[selectedWorkspace.brand_name, selectedWorkspace.selected_channel, formatDate(selectedWorkspace.created_at)]
//                           .filter(Boolean).join(' · ')}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 shrink-0">
//                     {(() => {
//                       const sc = getStatusConfig(selectedWorkspace.status);
//                       return (
//                         <span className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${sc.color}`}>
//                           {sc.icon}
//                           {selectedWorkspace.status.toUpperCase()}
//                         </span>
//                       );
//                     })()}
//                     <button
//                       onClick={() => setSelectedWorkspace(null)}
//                       className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 </div>

//                 {selectedWorkspace.content_theme && (
//                   <div className="mb-4">
//                     <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-lg border border-indigo-200">
//                       Theme: {selectedWorkspace.content_theme}
//                     </span>
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   {selectedWorkspace.target_description && (
//                     <div>
//                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Target Audience</p>
//                       <p className="text-sm text-slate-700">{selectedWorkspace.target_description}</p>
//                     </div>
//                   )}

//                   {selectedWorkspace.generated_subject && (
//                     <div>
//                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Subject Line</p>
//                       <p className="text-sm font-black text-slate-800">{selectedWorkspace.generated_subject}</p>
//                     </div>
//                   )}

//                   <div>
//                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">Generated Content</p>
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                       <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
//                         {selectedWorkspace.generated_content}
//                       </p>
//                     </div>
//                   </div>

//                   {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
//                     <div>
//                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">
//                         Responses ({selectedWorkspace.responses.length})
//                       </p>
//                       <div className="space-y-2">
//                         {selectedWorkspace.responses.map((r: any) => (
//                           <div key={r.id} className="text-sm bg-emerald-50 border border-emerald-200 rounded-xl p-3">
//                             <div className="flex items-center gap-2 font-black text-slate-700">
//                               <span>{r.lead_name}</span>
//                               <span className="h-1 w-1 rounded-full bg-emerald-400" />
//                               <span className="text-emerald-600 font-semibold capitalize">
//                                 {r.response_type?.replace('_', ' ')}
//                               </span>
//                             </div>
//                             {r.response_text && <p className="mt-1 text-slate-600">{r.response_text}</p>}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
//                   <button
//                     onClick={() => setSelectedWorkspace(null)}
//                     className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-500
//                       bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="pb-4" /> {/* bottom breathing room */}
//       </div>
//     </div>
//   );
// };

// export default CampaignWorkspaceList;


import React, { useEffect, useState, useRef } from 'react';
import {
  Wand2, Plus, Mail, MessageCircle, Linkedin,
  Clock, CheckCircle, Send, Archive, Eye, X,
  BarChart3, TrendingUp, Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

interface CampaignWorkspace {
  id: number;
  name: string;
  brand_name: string;
  content_theme: string;
  target_description: string;
  selected_channel: string;
  generated_subject: string;
  generated_content: string;
  status: string;
  created_at: string;
  responses?: any[];
}

/* ─── channel helpers ─── */
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return <MessageCircle size={13} className="text-emerald-600" />;
    case 'email':    return <Mail          size={13} className="text-blue-600"    />;
    case 'linkedin': return <Linkedin      size={13} className="text-sky-600"    />;
    default:         return <MessageCircle size={13} className="text-slate-400"  />;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'email':    return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'linkedin': return 'bg-sky-50 border-sky-200 text-sky-700';
    default:         return 'bg-slate-50 border-slate-200 text-slate-600';
  }
};

const getChannelAccent = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return 'from-emerald-500 to-green-400';
    case 'email':    return 'from-blue-500 to-cyan-400';
    case 'linkedin': return 'from-sky-500 to-blue-500';
    default:         return 'from-indigo-500 to-violet-500';
  }
};

const getChannelGlow = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return 'rgba(16,185,129,0.12)';
    case 'email':    return 'rgba(59,130,246,0.12)';
    case 'linkedin': return 'rgba(14,165,233,0.12)';
    default:         return 'rgba(79,70,229,0.12)';
  }
};

const getChannelBorder = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return '#d1fae5';
    case 'email':    return '#dbeafe';
    case 'linkedin': return '#e0f2fe';
    default:         return '#e0e7ff';
  }
};

const getChannelHoverBorder = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return '#6ee7b7';
    case 'email':    return '#93c5fd';
    case 'linkedin': return '#7dd3fc';
    default:         return '#a5b4fc';
  }
};

/* ─── status helpers ─── */
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'ready':    return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: <CheckCircle size={11} /> };
    case 'sent':     return { color: 'bg-blue-100 text-blue-700 border-blue-200',         dot: 'bg-blue-500',    icon: <Send        size={11} /> };
    case 'archived': return { color: 'bg-slate-100 text-slate-600 border-slate-200',      dot: 'bg-slate-400',   icon: <Archive     size={11} /> };
    default:         return { color: 'bg-amber-100 text-amber-700 border-amber-200',      dot: 'bg-amber-400',   icon: <Clock       size={11} /> };
  }
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ════════════════════════════
   ANIMATED COUNTER
════════════════════════════ */
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return <>{display}</>;
};

/* ════════════════════════════
   STAT CARD
════════════════════════════ */
interface StatCardProps {
  title: string;
  value: number;
  gradient: string;
  glowColor: string;
  borderColor: string;
  icon: React.FC<any>;
  sub: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, gradient, glowColor, borderColor, icon: Icon, sub, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white
        transition-all duration-500 ease-out ${gradient}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{
        boxShadow: `0 4px 20px ${glowColor}, 0 1px 4px rgba(0,0,0,0.06)`,
        border: `1.5px solid ${borderColor}`,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) scale(1.02)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${glowColor}, 0 2px 8px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${glowColor}, 0 1px 4px rgba(0,0,0,0.06)`;
      }}
    >
      {/* decorative rings */}
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1  top-8  h-12 w-12 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-1.5">{title}</p>
          <p className="text-[2rem] font-black leading-none tabular-nums">
            {visible ? <AnimatedNumber value={value} /> : 0}
          </p>
          <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>
        </div>
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5"
          style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
          <Icon size={18} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════
   MAIN COMPONENT
════════════════════════════ */
export const CampaignWorkspaceList = () => {
  const [workspaces, setWorkspaces]               = useState<CampaignWorkspace[]>([]);
  const [analytics, setAnalytics]                 = useState<any>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [wsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/campaign-workspace/`),
        fetch(`${API_BASE}/campaign-workspace/analytics/`),
      ]);
      setWorkspaces(await wsRes.json());
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

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
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }

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
        .modal-anim  { animation:modalIn .28s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .overlay-anim { animation:overlayIn .2s ease forwards; }

        .campaign-card {
          transition: all 0.25s cubic-bezier(0.34,1.1,0.64,1);
        }
        .campaign-card:hover {
          transform: translateY(-4px) scale(1.01);
        }

        .btn-banner {
          transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
          box-shadow: 0 4px 14px rgba(255,255,255,0.2);
        }
        .btn-banner:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 24px rgba(255,255,255,0.35);
        }
        .btn-banner:active { transform: scale(0.97); }

        .btn-cta {
          transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          box-shadow: 0 4px 16px rgba(79,70,229,0.35);
        }
        .btn-cta:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(79,70,229,0.5);
        }
        .btn-cta:active { transform: scale(0.97); }

        .trow { transition: background 0.15s ease, transform 0.15s ease; }
        .trow:hover { background: linear-gradient(90deg,#eef2ff,#f5f3ff); transform: translateX(3px); }
      `}</style>

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay: '3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 px-4 pt-4 f1">
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
            boxShadow: '0 12px 40px -4px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.12)',
          }}>
          <div className="shimmer-overlay" />
          <div className="px-6 py-5 flex items-center gap-5 flex-wrap relative z-10"
            style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(4px)',
              }}>
              <Wand2 className="text-white" size={24} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">
                Campaign Workspace
              </h1>
              <p className="text-[13px] text-indigo-200 mt-1 font-medium">
                Generate and manage multi-channel campaign drafts.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/campaign-workspace/new')}
              className="btn-banner inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-5 py-2.5 text-[15px] font-black shrink-0 mr-4">
              <Plus size={15} strokeWidth={2.5} /> New Workspace
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── STAT CARDS ── */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 f2">
            <StatCard
              title="Total Workspaces"
              value={Number(analytics.total_workspaces ?? 0)}
              gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
              glowColor="rgba(99,102,241,0.28)"
              borderColor="rgba(165,180,252,0.4)"
              icon={BarChart3} sub="all time" delay={0}
            />
            <StatCard
              title="Ready"
              value={Number(analytics.ready_campaigns ?? 0)}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              glowColor="rgba(16,185,129,0.25)"
              borderColor="rgba(110,231,183,0.4)"
              icon={CheckCircle} sub="awaiting send" delay={80}
            />
            <StatCard
              title="Sent"
              value={Number(analytics.sent_campaigns ?? 0)}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
              glowColor="rgba(59,130,246,0.25)"
              borderColor="rgba(147,197,253,0.4)"
              icon={Send} sub="delivered" delay={160}
            />
            <StatCard
              title="Interested"
              value={Number(analytics.responses?.interested ?? 0)}
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              glowColor="rgba(245,158,11,0.25)"
              borderColor="rgba(252,211,77,0.4)"
              icon={TrendingUp} sub="responses" delay={240}
            />
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        {workspaces.length > 0 && (
          <div className="flex items-center gap-3 f3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                boxShadow: '0 4px 12px rgba(79,70,229,0.35)',
              }}>
              <Wand2 size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-black text-slate-800 leading-tight">All Campaigns</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <span className="ml-auto text-[12px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              {workspaces.length}
            </span>
          </div>
        )}

        {/* ── CAMPAIGN CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 f3">
          {workspaces.map((w) => {
            const sc = getStatusConfig(w.status);
            const responseCount = w.responses?.length ?? 0;
            const cardBorder = getChannelBorder(w.selected_channel);
            const cardHoverBorder = getChannelHoverBorder(w.selected_channel);
            const cardGlow = getChannelGlow(w.selected_channel);

            return (
              <div
                key={w.id}
                onClick={() => setSelectedWorkspace(w)}
                className="campaign-card bg-white rounded-2xl flex flex-col overflow-hidden cursor-pointer group"
                style={{
                  border: `1.5px solid ${cardBorder}`,
                  boxShadow: `0 4px 16px ${cardGlow}, 0 1px 4px rgba(0,0,0,0.04)`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardHoverBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${cardGlow}, 0 2px 8px rgba(0,0,0,0.06)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = cardBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${cardGlow}, 0 1px 4px rgba(0,0,0,0.04)`;
                }}
              >
                {/* Top accent bar */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${getChannelAccent(w.selected_channel)}`} />

                <div className="p-5 flex flex-col flex-1 gap-3">
                  {/* Channel + Status */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[12px] font-black flex items-center gap-1.5 border ${getChannelColor(w.selected_channel)}`}>
                      {getChannelIcon(w.selected_channel)}
                      <span className="capitalize">{w.selected_channel}</span>
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1.5 border ${sc.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} ${w.status === 'ready' ? 'animate-pulse' : ''}`} />
                      {w.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Name section */}
                  <div className="flex items-start gap-3">
                    <div className={`w-[3px] self-stretch rounded-full bg-gradient-to-b ${getChannelAccent(w.selected_channel)} shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                        {w.name}
                      </h3>
                      {w.brand_name && (
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{w.brand_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Theme badge */}
                  {w.content_theme && (
                    <span className="self-start bg-indigo-50 text-indigo-600 text-[11px] font-black px-2.5 py-1 rounded-lg border border-indigo-200">
                      {w.content_theme}
                    </span>
                  )}

                  {/* Subject */}
                  {w.generated_subject && (
                    <div className="rounded-xl px-3 py-2"
                      style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9' }}>
                      <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Subject</p>
                      <p className="text-[12px] text-slate-700 font-semibold line-clamp-1">{w.generated_subject}</p>
                    </div>
                  )}

                  {/* Content preview */}
                  {w.generated_content && (
                    <div className="flex-1 rounded-xl p-3"
                      style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9' }}>
                      <p className="text-[12px] text-slate-500 line-clamp-3 leading-relaxed">{w.generated_content}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-3 flex justify-between items-center mt-auto"
                    style={{ borderTop: '1px solid #f1f5f9' }}>
                    <p className="text-[11px] text-slate-400 font-medium">{formatDate(w.created_at)}</p>
                    <div className="flex items-center gap-2">
                      {responseCount > 0 && (
                        <span className="text-[11px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {responseCount} response{responseCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all duration-200">
                        <Eye size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {workspaces.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl overflow-hidden"
              style={{
                border: '1.5px solid #e0e7ff',
                boxShadow: '0 4px 20px rgba(79,70,229,0.08)',
              }}>
              <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                  }}>
                  <Sparkles size={26} className="text-white" />
                </div>
                <p className="text-[16px] font-black text-slate-800 mt-2">No workspaces found</p>
                <p className="text-[13px] text-slate-400 mt-1 font-medium">Create your first AI campaign draft.</p>
                <button
                  onClick={() => navigate('/campaign-workspace/new')}
                  className="btn-cta mt-5 text-white px-7 py-3 rounded-2xl text-[15px] font-black inline-flex items-center gap-2">
                  <Plus size={15} /> Create Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ DETAIL MODAL ══════════════════ */}
      {selectedWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
          style={{ backgroundColor: 'rgba(10,8,30,0.65)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedWorkspace(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col modal-anim overflow-hidden"
            style={{
              boxShadow: '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.14)',
              border: '1.5px solid rgba(99,102,241,0.2)',
            }}
            onClick={e => e.stopPropagation()}>

            {/* Modal top accent */}
            <div className={`h-[3px] w-full bg-gradient-to-r ${getChannelAccent(selectedWorkspace.selected_channel)} shrink-0`} />

            {/* Modal header */}
            <div className="shrink-0 px-6 py-5 flex items-center justify-between relative overflow-hidden"
              style={{ background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)' }}>
              <div className="shimmer-overlay" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(4px)',
                  }}>
                  <Wand2 size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-white tracking-tight line-clamp-1">
                    {selectedWorkspace.name}
                  </h2>
                  <p className="text-[11px] text-indigo-200 font-medium mt-0.5">
                    {[selectedWorkspace.brand_name, selectedWorkspace.selected_channel, formatDate(selectedWorkspace.created_at)]
                      .filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 shrink-0">
                {(() => {
                  const sc = getStatusConfig(selectedWorkspace.status);
                  return (
                    <span className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 border ${sc.color}`}>
                      {sc.icon}
                      {selectedWorkspace.status.toUpperCase()}
                    </span>
                  );
                })()}
                <button
                  onClick={() => setSelectedWorkspace(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/15 transition-all duration-200 active:scale-90"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ background: 'linear-gradient(180deg,#fafbff,#f8fafc)' }}>

              {selectedWorkspace.content_theme && (
                <div>
                  <span className="bg-indigo-50 text-indigo-600 text-[12px] font-black px-3 py-1.5 rounded-lg border border-indigo-200">
                    Theme: {selectedWorkspace.content_theme}
                  </span>
                </div>
              )}

              {selectedWorkspace.target_description && (
                <div className="rounded-2xl overflow-hidden bg-white"
                  style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 2px 12px rgba(99,102,241,0.07)' }}>
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: 'linear-gradient(90deg,#eef2ff,#f5f3ff)', borderBottom: '1px solid #e0e7ff' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 3px 10px rgba(99,102,241,0.35)' }}>
                      <TrendingUp size={13} className="text-white" />
                    </div>
                    <span className="text-[12px] font-black text-indigo-700 uppercase tracking-wider">Target Audience</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[13px] text-slate-700 leading-relaxed">{selectedWorkspace.target_description}</p>
                  </div>
                </div>
              )}

              {selectedWorkspace.generated_subject && (
                <div className="rounded-2xl overflow-hidden bg-white"
                  style={{ border: `1.5px solid ${getChannelBorder(selectedWorkspace.selected_channel)}`, boxShadow: `0 2px 12px ${getChannelGlow(selectedWorkspace.selected_channel)}` }}>
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: 'linear-gradient(90deg,#f8fafc,#f1f5f9)', borderBottom: `1px solid ${getChannelBorder(selectedWorkspace.selected_channel)}` }}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${getChannelAccent(selectedWorkspace.selected_channel)}`}
                      style={{ boxShadow: `0 3px 10px ${getChannelGlow(selectedWorkspace.selected_channel)}` }}>
                      {React.cloneElement(getChannelIcon(selectedWorkspace.selected_channel) as React.ReactElement, { size: 13, className: 'text-white' })}
                    </div>
                    <span className="text-[12px] font-black text-slate-600 uppercase tracking-wider">Subject Line</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-black text-slate-800">{selectedWorkspace.generated_subject}</p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl overflow-hidden bg-white"
                style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 2px 12px rgba(99,102,241,0.07)' }}>
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: 'linear-gradient(90deg,#eef2ff,#f5f3ff)', borderBottom: '1px solid #e0e7ff' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 3px 10px rgba(99,102,241,0.35)' }}>
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <span className="text-[12px] font-black text-indigo-700 uppercase tracking-wider">Generated Content</span>
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedWorkspace.generated_content}
                  </p>
                </div>
              </div>

              {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
                <div className="rounded-2xl overflow-hidden bg-white"
                  style={{ border: '1.5px solid #d1fae5', boxShadow: '0 2px 12px rgba(16,185,129,0.07)' }}>
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: 'linear-gradient(90deg,#ecfdf5,#f0fdfa)', borderBottom: '1px solid #d1fae5' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#10b981,#0d9488)', boxShadow: '0 3px 10px rgba(16,185,129,0.35)' }}>
                      <CheckCircle size={13} className="text-white" />
                    </div>
                    <span className="text-[12px] font-black text-emerald-700 uppercase tracking-wider">
                      Responses ({selectedWorkspace.responses.length})
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedWorkspace.responses.map((r: any) => (
                      <div key={r.id}
                        className="trow rounded-xl px-3 py-2.5"
                        style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                        <div className="flex items-center gap-2 font-black text-slate-700 text-[13px]">
                          <span>{r.lead_name}</span>
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          <span className="text-emerald-600 font-bold capitalize text-[12px]">
                            {r.response_type?.replace('_', ' ')}
                          </span>
                        </div>
                        {r.response_text && (
                          <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">{r.response_text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="shrink-0 px-6 py-4 flex items-center justify-end bg-white"
              style={{ borderTop: '1.5px solid #eef2ff', boxShadow: '0 -4px 16px rgba(0,0,0,0.04)' }}>
              <button
                onClick={() => setSelectedWorkspace(null)}
                className="px-6 py-2.5 rounded-xl font-black text-[13px] text-slate-600 bg-white transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-97"
                style={{ border: '1.5px solid #e2e8f0' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignWorkspaceList;
