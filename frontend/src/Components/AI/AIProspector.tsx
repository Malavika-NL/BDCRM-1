// import React, { useState } from 'react';
// import {
//   Search, Loader2, Sparkles, UserPlus, ExternalLink,
//   Linkedin, Globe, MapPin, Building2, Briefcase,
//   MessageCircle, Zap, CheckCircle2, Download, Filter, Star
// } from 'lucide-react';

// // Adjust port if needed
// const API_URL = 'http://127.0.0.1:8000/api/ai-prospector';

// interface Profile {
//   name: string;
//   title: string;
//   company: string;
//   location: string;
//   source: string;
//   profile_url: string;
//   linkedin_url?: string;
//   naukri_url?: string;
//   relevance_reason?: string;
//   relevance_score?: number;
//   email?: string;
//   phone?: string;
//   headline?: string;
//   rank?: number;
// }

// export const AIProspector: React.FC = () => {
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<Profile[]>([]);
//   const [searchMeta, setSearchMeta] = useState<any>(null);
//   const [sources, setSources] = useState<string[]>(['linkedin', 'naukri']);
//   const [imported, setImported] = useState<Set<string>>(new Set());
  
//   // Outreach Modal State
//   const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
//   const [outreachMsg, setOutreachMsg] = useState<any>(null);
//   const [genLoading, setGenLoading] = useState(false);

//   // --- API CALLS ---

//   const searchAPI = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     setResults([]);
//     setSearchMeta(null);

//     try {
//       const res = await fetch(`${API_URL}/search/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, sources })
//       });
//       const data = await res.json();
      
//       if (data.success) {
//         setResults(data.results || []);
//         setSearchMeta({
//           stats: data.source_stats,
//           total: data.total_consolidated,
//           parsed: data.parsed_criteria
//         });
//       } else {
//         alert("AI Error: " + (data.error || data.message));
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Failed to connect to backend.");
//     }
//     setLoading(false);
//   };

//   const importAPI = async (profile: Profile) => {
//     try {
//       const res = await fetch(`${API_URL}/import_lead/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(profile)
//       });
//       if (!res.ok) throw new Error('Import failed');
//       setImported(prev => new Set(prev).add(profile.profile_url));
//     } catch (e) { console.error(e); }
//   };

//   // ✅ ADDED MISSING FUNCTION
//   const bulkImportAPI = async () => {
//     const toImport = results.filter(p => !imported.has(p.profile_url));
//     if (!toImport.length) return;

//     if (!confirm(`Import ${toImport.length} leads to CRM?`)) return;

//     try {
//       const res = await fetch(`${API_URL}/import_bulk/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profiles: toImport })
//       });
      
//       if (!res.ok) throw new Error('Bulk import failed');
      
//       const newSet = new Set(imported);
//       toImport.forEach(p => newSet.add(p.profile_url));
//       setImported(newSet);
//       alert(`Successfully imported ${toImport.length} leads!`);
//     } catch (e) { console.error(e); alert("Bulk import failed"); }
//   };

//   // ✅ ADDED MISSING FUNCTION
//   const generateOutreachAPI = async (channel: string) => {
//     if (!activeProfile) return;
//     setGenLoading(true);
//     setOutreachMsg(null);
//     try {
//       const res = await fetch(`${API_URL}/generate_outreach/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profile: activeProfile, channel })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error('Generation failed');
//       setOutreachMsg(data);
//     } catch (e) { console.error(e); alert("Failed to generate message"); }
//     setGenLoading(false);
//   };

//   const toggleSource = (s: string) => {
//     setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 font-sans">
//       {/* Header */}
//       <header className="mb-8">
//         <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
//           <Sparkles size={32} className="text-indigo-600" /> AI Multi-Source Prospector
//         </h2>
//         <p className="text-slate-500 mt-1">Search real profiles on LinkedIn & Naukri via AI.</p>
//       </header>

//       {/* Search Box */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//             <input 
//               type="text" 
//               placeholder="e.g. Find Marketing Managers in Kerala" 
//               className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium text-slate-700"
//               value={prompt}
//               onChange={e => setPrompt(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && searchAPI()}
//             />
//           </div>
//           <button 
//             onClick={searchAPI} 
//             disabled={loading || !prompt}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 min-w-[140px] justify-center"
//           >
//             {loading ? <Loader2 className="animate-spin" /> : <Search />} Search
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex items-center gap-4">
//           <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Filter size={12}/> Sources:</span>
//           {[
//             { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
//             { id: 'naukri', label: 'Naukri', icon: Globe },
//             { id: 'apollo', label: 'Apollo (Optional)', icon: Zap },
//           ].map(src => (
//             <button 
//               key={src.id} 
//               onClick={() => toggleSource(src.id)}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${sources.includes(src.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
//             >
//               <src.icon size={12} /> {src.label} {sources.includes(src.id) && <CheckCircle2 size={10} />}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Meta Stats */}
//       {searchMeta && (
//         <div className="flex gap-4 mb-6">
//           <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700">
//             Found: {searchMeta.total}
//           </div>
//           {Object.entries(searchMeta.stats || {}).map(([k, v]) => (
//             <div key={k} className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 capitalize">
//               {k}: <strong>{v as any}</strong>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Results Header */}
//       {results.length > 0 && (
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-bold text-slate-700">Search Results</h3>
//           <button onClick={bulkImportAPI} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 shadow-sm transition">
//             <Download size={14} /> Import All Leads
//           </button>
//         </div>
//       )}

//       {/* Results List */}
//       <div className="space-y-4">
//         {results.map((p, idx) => (
//           <div key={idx} className={`bg-white p-5 rounded-xl border transition hover:shadow-md ${imported.has(p.profile_url) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg shrink-0 uppercase">
//                 {p.name.charAt(0)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="font-bold text-slate-800 text-lg truncate flex items-center gap-2">
//                       {p.name}
//                       {p.relevance_score && p.relevance_score > 80 && (
//                         <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
//                           <Star size={10} fill="currentColor"/> {p.relevance_score}% Match
//                         </span>
//                       )}
//                     </h4>
//                     <p className="text-sm text-slate-600 flex items-center gap-2 mt-0.5 truncate">
//                       <Briefcase size={14} className="text-slate-400"/> {p.title} 
//                       {p.company && <span className="text-slate-400">•</span>} 
//                       {p.company && <span className="flex items-center gap-1 truncate"><Building2 size={14} className="text-slate-400"/> {p.company}</span>}
//                     </p>
//                     <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate"><MapPin size={12}/> {p.location || "Location Unknown"}</p>
//                   </div>
                  
//                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border shrink-0 ${
//                     p.source.toLowerCase().includes('linkedin') ? 'bg-blue-50 text-blue-700 border-blue-200' : 
//                     p.source.toLowerCase().includes('naukri') ? 'bg-purple-50 text-purple-700 border-purple-200' : 
//                     'bg-orange-50 text-orange-700 border-orange-200'
//                   }`}>
//                     {p.source}
//                   </span>
//                 </div>

//                 {p.relevance_reason && (
//                   <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-xs text-indigo-800">
//                     <strong>AI Insight:</strong> {p.relevance_reason}
//                   </div>
//                 )}

//                 <div className="flex gap-2 mt-4">
//                   <a href={p.profile_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition">
//                     <ExternalLink size={12}/> View Profile
//                   </a>
                  
//                   <button onClick={() => { setActiveProfile(p); setOutreachMsg(null); }} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1 transition">
//                     <MessageCircle size={12}/> AI Outreach
//                   </button>

//                   <button 
//                     onClick={() => importAPI(p)} 
//                     disabled={imported.has(p.profile_url)}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
//                       imported.has(p.profile_url) ? 'bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200' : 'bg-slate-800 hover:bg-slate-900 text-white'
//                     }`}
//                   >
//                     {imported.has(p.profile_url) ? <CheckCircle2 size={12}/> : <UserPlus size={12}/>} 
//                     {imported.has(p.profile_url) ? 'Imported' : 'Add to CRM'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {!loading && results.length === 0 && prompt && (
//         <div className="text-center py-20 text-slate-400">
//           <Search size={48} className="mx-auto mb-4 opacity-20"/>
//           <p>No profiles found. Try simpler keywords.</p>
//         </div>
//       )}

//       {/* Outreach Modal */}
//       {activeProfile && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//               <div>
//                 <h3 className="font-bold text-lg text-slate-800">Outreach Generator</h3>
//                 <p className="text-xs text-slate-500">For {activeProfile.name} • {activeProfile.company}</p>
//               </div>
//               <button onClick={() => setActiveProfile(null)} className="text-slate-400 hover:text-slate-600">✕</button>
//             </div>
            
//             <div className="p-6">
//               {!outreachMsg ? (
//                 <div className="space-y-4">
//                   <p className="text-sm text-slate-600 font-medium">Choose a channel to generate a personalized message:</p>
//                   <div className="grid grid-cols-2 gap-3">
//                     <button onClick={() => generateOutreachAPI('LinkedIn')} disabled={genLoading} className="p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition text-sm font-bold text-slate-600 flex flex-col items-center gap-2 group">
//                       <Linkedin size={24} className="text-blue-600 group-hover:scale-110 transition"/> LinkedIn
//                     </button>
//                     <button onClick={() => generateOutreachAPI('Email')} disabled={genLoading} className="p-4 border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition text-sm font-bold text-slate-600 flex flex-col items-center gap-2 group">
//                       <MessageCircle size={24} className="text-orange-500 group-hover:scale-110 transition"/> Cold Email
//                     </button>
//                   </div>
//                   {genLoading && (
//                     <div className="flex items-center justify-center gap-2 text-indigo-600 py-4">
//                       <Loader2 className="animate-spin" size={20} />
//                       <span className="text-sm font-bold">AI is writing...</span>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {outreachMsg.subject && (
//                     <div>
//                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
//                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 mt-1 select-all">
//                         {outreachMsg.subject}
//                       </div>
//                     </div>
//                   )}
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Body</label>
//                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed select-all h-40 overflow-y-auto custom-scrollbar">
//                       {outreachMsg.message}
//                     </div>
//                   </div>
//                   <div className="flex gap-2 pt-2">
//                     <button onClick={() => setActiveProfile(null)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold transition">Close</button>
//                     <button 
//                       onClick={() => { navigator.clipboard.writeText(outreachMsg.message); alert("Copied!"); }} 
//                       className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
//                     >
//                       Copy Text
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useState } from 'react';
// import {
//   Search, Loader2, Sparkles, UserPlus, ExternalLink,
//   Linkedin, Globe, MapPin, Building2, Briefcase,
//   MessageCircle, Zap, CheckCircle2, Download, Filter, Star,
//   X, Users, BarChart2, Target
// } from 'lucide-react';

// const API_URL = 'http://127.0.0.1:8000/api/ai-prospector';

// interface Profile {
//   name: string;
//   title: string;
//   company: string;
//   location: string;
//   source: string;
//   profile_url: string;
//   linkedin_url?: string;
//   naukri_url?: string;
//   relevance_reason?: string;
//   relevance_score?: number;
//   email?: string;
//   phone?: string;
//   headline?: string;
//   rank?: number;
// }

// export const AIProspector: React.FC = () => {
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<Profile[]>([]);
//   const [searchMeta, setSearchMeta] = useState<any>(null);
//   const [sources, setSources] = useState<string[]>(['linkedin', 'naukri']);
//   const [imported, setImported] = useState<Set<string>>(new Set());

//   const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
//   const [outreachMsg, setOutreachMsg] = useState<any>(null);
//   const [genLoading, setGenLoading] = useState(false);

//   /* ── all original functions untouched ── */
//   const searchAPI = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     setResults([]);
//     setSearchMeta(null);
//     try {
//       const res = await fetch(`${API_URL}/search/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, sources })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setResults(data.results || []);
//         setSearchMeta({ stats: data.source_stats, total: data.total_consolidated, parsed: data.parsed_criteria });
//       } else {
//         alert("AI Error: " + (data.error || data.message));
//       }
//     } catch (e) { console.error(e); alert("Failed to connect to backend."); }
//     setLoading(false);
//   };

//   const importAPI = async (profile: Profile) => {
//     try {
//       const res = await fetch(`${API_URL}/import_lead/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(profile)
//       });
//       if (!res.ok) throw new Error('Import failed');
//       setImported(prev => new Set(prev).add(profile.profile_url));
//     } catch (e) { console.error(e); }
//   };

//   const bulkImportAPI = async () => {
//     const toImport = results.filter(p => !imported.has(p.profile_url));
//     if (!toImport.length) return;
//     if (!confirm(`Import ${toImport.length} leads to CRM?`)) return;
//     try {
//       const res = await fetch(`${API_URL}/import_bulk/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profiles: toImport })
//       });
//       if (!res.ok) throw new Error('Bulk import failed');
//       const newSet = new Set(imported);
//       toImport.forEach(p => newSet.add(p.profile_url));
//       setImported(newSet);
//       alert(`Successfully imported ${toImport.length} leads!`);
//     } catch (e) { console.error(e); alert("Bulk import failed"); }
//   };

//   const generateOutreachAPI = async (channel: string) => {
//     if (!activeProfile) return;
//     setGenLoading(true);
//     setOutreachMsg(null);
//     try {
//       const res = await fetch(`${API_URL}/generate_outreach/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profile: activeProfile, channel })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error('Generation failed');
//       setOutreachMsg(data);
//     } catch (e) { console.error(e); alert("Failed to generate message"); }
//     setGenLoading(false);
//   };

//   const toggleSource = (s: string) => {
//     setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
//   };

//   /* ── source badge config ── */
//   const sourceBadge = (source: string) => {
//     const s = source.toLowerCase();
//     if (s.includes('linkedin')) return { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' };
//     if (s.includes('naukri'))  return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' };
//     return                            { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' };
//   };

//   const importedCount = results.filter(p => imported.has(p.profile_url)).length;
//   const highMatchCount = results.filter(p => (p.relevance_score || 0) > 80).length;

//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden font-sans">

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px) scale(0.99); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px) translateX(0px); }
//           50%     { transform: translateY(-10px) translateX(6px); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position:  200% center; }
//         }
//         @keyframes pulseRing {
//           0%   { transform: scale(1);   opacity: .6; }
//           100% { transform: scale(1.6); opacity: 0;  }
//         }
//         .anim-blob    { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//         .shimmer-text {
//           background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 40%, #a855f7 60%, #4f46e5 100%);
//           background-size: 200% auto;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           animation: shimmer 3s linear infinite;
//         }
//         .pulse-ring::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           border-radius: 50%;
//           background: rgba(99,102,241,0.4);
//           animation: pulseRing 1.5s ease-out infinite;
//         }
//         .card-hover { transition: all .2s ease; }
//         .card-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -4px rgba(79,70,229,0.12); }
//       `}</style>

//       {/* decorative blobs */}
//       <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//       <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//       {/* ══════════════════════════════════════════════════
//           BANNER
//       ══════════════════════════════════════════════════ */}
//       <div
//         className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
//         style={{
//           background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//           boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
//         }}
//       >
//         <div
//           className="px-6 py-5 flex items-center gap-4 flex-wrap"
//           style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
//         >
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
//           >
//             <Sparkles className="text-white" size={20} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               AI Multi-Source Prospector
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Search real profiles on LinkedIn & Naukri via AI — import directly to CRM.
//             </p>
//           </div>
//           {results.length > 0 && (
//             <div className="hidden sm:flex items-center gap-2 flex-wrap shrink-0">
//               {[
//                 { label: 'Found',    value: results.length,   color: 'rgba(255,255,255,0.12)' },
//                 { label: 'Match',    value: `${highMatchCount} high`, color: 'rgba(16,185,129,0.25)' },
//                 { label: 'Imported', value: importedCount,    color: 'rgba(255,255,255,0.12)' },
//               ].map(k => (
//                 <div key={k.label}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-white"
//                   style={{ backgroundColor: k.color, border: '1px solid rgba(255,255,255,0.18)' }}>
//                   <span className="text-white/60">{k.label}</span>
//                   <span>{k.value}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           SCROLLABLE BODY
//       ══════════════════════════════════════════════════ */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* ── SEARCH CARD ── */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden anim-fade-2">
//           <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
//           <div className="p-5">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
//               <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
//                 <Search size={13} className="text-white" />
//               </div>
//               <h3 className="text-[13px] font-black text-slate-700">Prospect Search</h3>
//             </div>

//             {/* Search input row */}
//             <div className="flex gap-3 mb-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                 <input
//                   type="text"
//                   placeholder="e.g. Find Marketing Managers in Kerala with 5+ years experience"
//                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
//                   value={prompt}
//                   onChange={e => setPrompt(e.target.value)}
//                   onKeyDown={e => e.key === 'Enter' && searchAPI()}
//                 />
//               </div>
//               <button
//                 onClick={searchAPI}
//                 disabled={loading || !prompt}
//                 className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-black text-white transition-all active:scale-95 disabled:opacity-40 shadow-sm shrink-0"
//                 style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
//               >
//                 {loading
//                   ? <Loader2 className="animate-spin" size={15} />
//                   : <Search size={15} />}
//                 {loading ? 'Searching…' : 'Search'}
//               </button>
//             </div>

//             {/* Source toggles */}
//             <div className="flex items-center gap-3 flex-wrap">
//               <div className="flex items-center gap-1.5">
//                 <div className="p-1 rounded-lg bg-slate-50">
//                   <Filter size={10} className="text-slate-400" />
//                 </div>
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sources</span>
//               </div>
//               {[
//                 { id: 'linkedin', label: 'LinkedIn',         icon: Linkedin,      active: 'from-blue-500 to-blue-600',    activeBg: 'bg-blue-50',   activeTxt: 'text-blue-700',   activeBorder: 'border-blue-200' },
//                 { id: 'naukri',   label: 'Naukri',           icon: Globe,         active: 'from-purple-500 to-violet-600',activeBg: 'bg-purple-50', activeTxt: 'text-purple-700', activeBorder: 'border-purple-200' },
//                 { id: 'apollo',   label: 'Apollo (Optional)',icon: Zap,           active: 'from-amber-400 to-orange-500', activeBg: 'bg-amber-50',  activeTxt: 'text-amber-700',  activeBorder: 'border-amber-200' },
//               ].map(src => {
//                 const on = sources.includes(src.id);
//                 return (
//                   <button
//                     key={src.id}
//                     onClick={() => toggleSource(src.id)}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all active:scale-95 ${
//                       on
//                         ? `${src.activeBg} ${src.activeTxt} ${src.activeBorder} shadow-sm`
//                         : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
//                     }`}
//                   >
//                     {on
//                       ? <div className={`w-4 h-4 rounded-lg bg-gradient-to-br ${src.active} flex items-center justify-center shrink-0`}>
//                           <src.icon size={9} className="text-white" />
//                         </div>
//                       : <src.icon size={12} />
//                     }
//                     {src.label}
//                     {on && <CheckCircle2 size={10} />}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* ── LOADING STATE ── */}
//         {loading && (
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden anim-fade-2">
//             <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
//             <div className="p-10 flex flex-col items-center gap-4">
//               <div className="relative w-12 h-12 flex items-center justify-center">
//                 <span className="pulse-ring absolute inset-0 rounded-full" />
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg relative z-10">
//                   <Sparkles size={20} className="text-white animate-pulse" />
//                 </div>
//               </div>
//               <div className="text-center">
//                 <p className="text-[14px] font-black text-slate-700">AI is scanning profiles…</p>
//                 <p className="text-[12px] text-slate-400 mt-1 font-medium">Searching across {sources.join(', ')}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── SEARCH META STATS ── */}
//         {searchMeta && !loading && (
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden anim-fade-2">
//             <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
//             <div className="p-4 flex items-center gap-4 flex-wrap">
//               <div className="flex items-center gap-3">
//                 <div className="w-1 h-8 bg-emerald-500 rounded-full shrink-0" />
//                 <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shrink-0">
//                   <BarChart2 size={13} className="text-white" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Found</p>
//                   <p className="text-[18px] font-black text-emerald-600 leading-tight">{searchMeta.total}</p>
//                 </div>
//               </div>
//               <div className="h-8 w-px bg-slate-100" />
//               {Object.entries(searchMeta.stats || {}).map(([k, v]) => (
//                 <div key={k} className="flex items-center gap-2">
//                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider capitalize">{k}</span>
//                   <span className="text-[13px] font-black text-slate-700 px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-100">{v as any}</span>
//                 </div>
//               ))}
//               <div className="ml-auto flex items-center gap-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">High Match</span>
//                 <span className="text-[13px] font-black text-emerald-600 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100">{highMatchCount}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── RESULTS HEADER ── */}
//         {results.length > 0 && !loading && (
//           <div className="flex items-center justify-between anim-fade-3">
//             <div className="flex items-center gap-3">
//               <div className="w-1 h-4 bg-indigo-500 rounded-full" />
//               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//                 {results.length} Profile{results.length !== 1 ? 's' : ''} Found
//               </p>
//             </div>
//             <button
//               onClick={bulkImportAPI}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 shadow-sm"
//               style={{ background: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 100%)' }}
//             >
//               <Download size={13} /> Import All to CRM
//             </button>
//           </div>
//         )}

//         {/* ── RESULTS LIST ── */}
//         <div className="space-y-3 anim-fade-3">
//           {results.map((p, idx) => {
//             const badge   = sourceBadge(p.source);
//             const isImported = imported.has(p.profile_url);
//             const initials   = p.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
//             const isHighMatch = (p.relevance_score || 0) > 80;

//             return (
//               <div
//                 key={idx}
//                 className={`bg-white rounded-2xl border shadow-sm card-hover overflow-hidden ${
//                   isImported ? 'border-emerald-200' : 'border-slate-200/80'
//                 }`}
//                 style={{ animationDelay: `${idx * 40}ms` }}
//               >
//                 {/* per-card top accent */}
//                 <div className={`h-0.5 w-full bg-gradient-to-r ${
//                   isImported ? 'from-emerald-400 to-teal-400' :
//                   isHighMatch ? 'from-indigo-500 to-violet-500' :
//                   'from-slate-200 to-slate-100'
//                 }`} />

//                 <div className="p-4">
//                   <div className="flex items-start gap-4">

//                     {/* Avatar */}
//                     <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-[14px] uppercase shrink-0 shadow-sm ${
//                       isImported
//                         ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
//                         : 'bg-gradient-to-br from-indigo-400 to-violet-600 text-white'
//                     }`}>
//                       {initials}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-3 mb-1">
//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <h4 className="font-black text-slate-800 text-[14px] truncate">{p.name}</h4>
//                             {isHighMatch && (
//                               <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black shrink-0">
//                                 <Star size={9} fill="currentColor" /> {p.relevance_score}% Match
//                               </span>
//                             )}
//                             {isImported && (
//                               <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black shrink-0">
//                                 <CheckCircle2 size={9} /> Imported
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-2 mt-0.5 text-[12px] text-slate-500 flex-wrap font-medium">
//                             <span className="flex items-center gap-1"><Briefcase size={11} className="text-slate-400" />{p.title}</span>
//                             {p.company && <>
//                               <span className="text-slate-200">·</span>
//                               <span className="flex items-center gap-1"><Building2 size={11} className="text-slate-400" />{p.company}</span>
//                             </>}
//                           </div>
//                           <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
//                             <MapPin size={10} /> {p.location || 'Location Unknown'}
//                           </p>
//                         </div>

//                         {/* Source badge */}
//                         <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}>
//                           <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
//                           {p.source}
//                         </span>
//                       </div>

//                       {/* AI Insight */}
//                       {p.relevance_reason && (
//                         <div className="mt-3 rounded-xl overflow-hidden">
//                           <div className="h-0.5 w-full bg-gradient-to-r from-indigo-400 to-violet-400" />
//                           <div className="bg-indigo-50 border border-indigo-100 border-t-0 px-3 py-2">
//                             <p className="text-[11px] text-indigo-700 font-medium">
//                               <span className="font-black">AI Insight: </span>{p.relevance_reason}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {/* Actions */}
//                       <div className="flex items-center gap-2 mt-3 flex-wrap">
//                         <a
//                           href={p.profile_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600 rounded-xl text-[11px] font-black transition-all"
//                         >
//                           <ExternalLink size={11} /> View Profile
//                         </a>
//                         <button
//                           onClick={() => { setActiveProfile(p); setOutreachMsg(null); }}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-black transition-all"
//                         >
//                           <MessageCircle size={11} /> AI Outreach
//                         </button>
//                         <button
//                           onClick={() => importAPI(p)}
//                           disabled={isImported}
//                           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all active:scale-95 ${
//                             isImported
//                               ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
//                               : 'text-white shadow-sm'
//                           }`}
//                           style={!isImported ? { background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' } : {}}
//                         >
//                           {isImported
//                             ? <><CheckCircle2 size={11} /> Imported</>
//                             : <><UserPlus size={11} /> Add to CRM</>}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── EMPTY STATE ── */}
//         {!loading && results.length === 0 && prompt && (
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden anim-fade-2">
//             <div className="h-1 w-full bg-gradient-to-r from-slate-200 to-slate-100" />
//             <div className="py-16 flex flex-col items-center gap-3">
//               <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
//                 <Search size={22} className="text-slate-300" />
//               </div>
//               <p className="text-[13px] font-black text-slate-500">No profiles found</p>
//               <p className="text-[11px] text-slate-400 font-medium">Try simpler or broader keywords.</p>
//             </div>
//           </div>
//         )}

//         <div className="pb-2" />
//       </div>

//       {/* ══════════════════════════════════════════════════
//           OUTREACH MODAL
//       ══════════════════════════════════════════════════ */}
//       {activeProfile && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div
//             className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
//             style={{ animation: 'fadeUp .3s ease-out forwards' }}
//           >
//             {/* Modal banner */}
//             <div
//               className="px-5 py-4 flex items-center gap-3"
//               style={{ background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)' }}
//             >
//               <div
//                 className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
//                 style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
//               >
//                 <MessageCircle size={16} className="text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-[14px] font-black text-white leading-tight">Outreach Generator</h3>
//                 <p className="text-[11px] text-indigo-200 font-medium truncate">
//                   {activeProfile.name} · {activeProfile.company}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setActiveProfile(null)}
//                 className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
//                 style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
//               >
//                 <X size={14} />
//               </button>
//             </div>

//             <div className="p-5">
//               {!outreachMsg ? (
//                 <div className="space-y-4">
//                   <p className="text-[12px] text-slate-500 font-medium">Choose a channel to generate a personalized message:</p>
//                   <div className="grid grid-cols-2 gap-3">
//                     {[
//                       { channel: 'LinkedIn', icon: Linkedin, gradient: 'from-blue-500 to-blue-600',   iconColor: 'text-blue-500',   hoverBg: 'hover:bg-blue-50',   hoverBorder: 'hover:border-blue-200' },
//                       { channel: 'Email',    icon: MessageCircle, gradient: 'from-amber-400 to-orange-500', iconColor: 'text-amber-500', hoverBg: 'hover:bg-amber-50', hoverBorder: 'hover:border-amber-200' },
//                     ].map(({ channel, icon: Icon, gradient, iconColor, hoverBg, hoverBorder }) => (
//                       <button
//                         key={channel}
//                         onClick={() => generateOutreachAPI(channel)}
//                         disabled={genLoading}
//                         className={`p-5 border border-slate-200 rounded-2xl ${hoverBg} ${hoverBorder} transition-all text-[13px] font-black text-slate-600 flex flex-col items-center gap-3 group active:scale-95 disabled:opacity-50`}
//                       >
//                         <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
//                           <Icon size={18} className="text-white" />
//                         </div>
//                         {channel === 'LinkedIn' ? 'LinkedIn DM' : 'Cold Email'}
//                       </button>
//                     ))}
//                   </div>
//                   {genLoading && (
//                     <div className="flex items-center justify-center gap-2.5 text-indigo-600 py-4 bg-indigo-50 rounded-xl border border-indigo-100">
//                       <Loader2 className="animate-spin" size={16} />
//                       <span className="text-[12px] font-black">AI is writing your message…</span>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {outreachMsg.subject && (
//                     <div>
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Subject Line</label>
//                       <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-[13px] font-black text-slate-800 select-all">
//                         {outreachMsg.subject}
//                       </div>
//                     </div>
//                   )}
//                   <div>
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Message Body</label>
//                     <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed select-all h-44 overflow-y-auto custom-scrollbar">
//                       {outreachMsg.message}
//                     </div>
//                   </div>
//                   <div className="flex gap-2 pt-1">
//                     <button
//                       onClick={() => setActiveProfile(null)}
//                       className="flex-1 py-2.5 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-black transition-all"
//                     >
//                       Close
//                     </button>
//                     <button
//                       onClick={() => { navigator.clipboard.writeText(outreachMsg.message); alert("Copied!"); }}
//                       className="flex-1 py-2.5 text-white rounded-xl text-[12px] font-black transition-all active:scale-95 shadow-sm"
//                       style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
//                     >
//                       Copy Text
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };





import React, { useState } from 'react';
import {
  Search, Loader2, Sparkles, UserPlus, ExternalLink,
  Linkedin, Globe, MapPin, Building2, Briefcase,
  MessageCircle, Zap, CheckCircle2, Download, Filter, Star,
  X, Users, BarChart2, Target
} from 'lucide-react';

const API_URL = '/api/ai-prospector';

interface Profile {
  name: string;
  title: string;
  company: string;
  location: string;
  source: string;
  profile_url: string;
  linkedin_url?: string;
  naukri_url?: string;
  relevance_reason?: string;
  relevance_score?: number;
  email?: string;
  phone?: string;
  headline?: string;
  rank?: number;
}

export const AIProspector: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const [searchMeta, setSearchMeta] = useState<any>(null);
  const [sources, setSources] = useState<string[]>(['linkedin', 'naukri']);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [outreachMsg, setOutreachMsg] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);

  /* ── all original functions untouched ── */
  const searchAPI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults([]);
    setSearchMeta(null);
    try {
      const res = await fetch(`${API_URL}/search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sources })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setSearchMeta({ stats: data.source_stats, total: data.total_consolidated, parsed: data.parsed_criteria });
      } else {
        alert("AI Error: " + (data.error || data.message));
      }
    } catch (e) { console.error(e); alert("Failed to connect to backend."); }
    setLoading(false);
  };

  const importAPI = async (profile: Profile) => {
    try {
      const res = await fetch(`${API_URL}/import_lead/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Import failed');
      setImported(prev => new Set(prev).add(profile.profile_url));
    } catch (e) { console.error(e); }
  };

  const bulkImportAPI = async () => {
    const toImport = results.filter(p => !imported.has(p.profile_url));
    if (!toImport.length) return;
    if (!confirm(`Import ${toImport.length} leads to CRM?`)) return;
    try {
      const res = await fetch(`${API_URL}/import_bulk/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: toImport })
      });
      if (!res.ok) throw new Error('Bulk import failed');
      const newSet = new Set(imported);
      toImport.forEach(p => newSet.add(p.profile_url));
      setImported(newSet);
      alert(`Successfully imported ${toImport.length} leads!`);
    } catch (e) { console.error(e); alert("Bulk import failed"); }
  };

  const generateOutreachAPI = async (channel: string) => {
    if (!activeProfile) return;
    setGenLoading(true);
    setOutreachMsg(null);
    try {
      const res = await fetch(`${API_URL}/generate_outreach/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile, channel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Generation failed');
      setOutreachMsg(data);
    } catch (e) { console.error(e); alert("Failed to generate message"); }
    setGenLoading(false);
  };

  const toggleSource = (s: string) => {
    setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const sourceBadge = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('linkedin')) return { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' };
    if (s.includes('naukri'))  return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' };
    return                            { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' };
  };

  const importedCount  = results.filter(p => imported.has(p.profile_url)).length;
  const highMatchCount = results.filter(p => (p.relevance_score || 0) > 80).length;

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes floatBlob {
          0%,100% { transform:translateY(0) translateX(0); }
          50%     { transform:translateY(-12px) translateX(6px); }
        }
        @keyframes pulseRing {
          0%   { transform:scale(1);   opacity:.5; }
          100% { transform:scale(1.7); opacity:0; }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .anim-blob   { animation:floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s; }
        .anim-fade-2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s; }
        .anim-fade-3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s; }
        .modal-anim  { animation:modalIn .28s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .overlay-anim{ animation:overlayIn .2s ease forwards; }

        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }

        .pulse-ring::after {
          content:''; position:absolute; inset:0; border-radius:50%;
          background:rgba(99,102,241,0.4);
          animation:pulseRing 1.5s ease-out infinite;
        }

        /* result cards */
        .result-card { transition:all .2s cubic-bezier(0.34,1.1,0.64,1); }
        .result-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px -4px rgba(79,70,229,0.15); }

        /* search card */
        .search-card { transition:box-shadow .2s ease; }
        .search-card:hover { box-shadow:0 8px 28px rgba(79,70,229,0.1); }

        /* search bar focus */
        .search-wrap { transition:all .25s ease; }
        .search-wrap:focus-within {
          transform:translateY(-1px);
          box-shadow:0 0 0 4px rgba(99,102,241,0.14),0 4px 16px rgba(99,102,241,0.1);
          border-radius:14px;
        }

        /* CTA button */
        .btn-cta { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
        .btn-cta:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 24px rgba(79,70,229,0.45) !important; }
        .btn-cta:active { transform:scale(0.97); }

        /* bulk import btn */
        .btn-bulk { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
        .btn-bulk:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 20px rgba(30,27,75,0.35) !important; }
        .btn-bulk:active { transform:scale(0.97); }

        /* action btns in cards */
        .btn-action { transition:all .15s ease; }
        .btn-action:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.08); }
        .btn-action:active { transform:scale(0.96); }

        /* source toggle */
        .src-btn { transition:all .15s ease; }
        .src-btn:active { transform:scale(0.95); }

        /* channel card */
        .channel-card { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
        .channel-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(79,70,229,0.14); }
        .channel-card:active { transform:scale(0.97); }

        /* cancel btn */
        .btn-cancel { transition:all .2s ease; }
        .btn-cancel:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,0.08); }
        .btn-cancel:active { transform:scale(0.97); }
      `}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative anim-fade-1"
        style={{
          background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
          boxShadow: '0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
        }}>
        <div className="shimmer-overlay" />
        <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
          style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <Sparkles className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">
              AI Multi-Source Prospector
            </h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Search real profiles on LinkedIn & Naukri via AI — import directly to CRM.
            </p>
          </div>
          {results.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 flex-wrap shrink-0">
              {[
                { label:'Found',    value:results.length,        color:'rgba(255,255,255,0.12)', glow:'rgba(255,255,255,0.08)' },
                { label:'Match',    value:`${highMatchCount} high`, color:'rgba(16,185,129,0.28)',  glow:'rgba(16,185,129,0.1)'  },
                { label:'Imported', value:importedCount,         color:'rgba(255,255,255,0.12)', glow:'rgba(255,255,255,0.08)' },
              ].map(k => (
                <div key={k.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black text-white"
                  style={{ backgroundColor:k.color, border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
                  <span className="text-white/60">{k.label}</span>
                  <span>{k.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── SEARCH CARD ── */}
        <div className="search-card bg-white rounded-2xl overflow-hidden anim-fade-2"
          style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-5">
  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
    style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
    <Search size={17} className="text-white" />
  </div>
  <div>
    <h3 className="text-[18px] font-black text-slate-800 leading-tight">Prospect Search</h3>
    <p className="text-[13px] text-slate-400 font-medium mt-0.5">Find and import leads from multiple sources</p>
  </div>
</div>

            {/* Search input */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1 search-wrap">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    placeholder="e.g. Find Marketing Managers in Kerala with 5+ years experience"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 rounded-xl"
                    style={{ border:'1.5px solid #e2e8f0' }}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && searchAPI()}
                  />
                </div>
              </div>
              <button
                onClick={searchAPI}
                disabled={loading || !prompt}
                className="btn-cta flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black text-white disabled:opacity-40 shrink-0"
                style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 16px rgba(79,70,229,0.35)' }}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>

            {/* Source toggles */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background:'#f8fafc', border:'1px solid #e2e8f0' }}>
                <Filter size={11} className="text-slate-400" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Sources</span>
              </div>
              {[
                { id:'linkedin', label:'LinkedIn',          icon:Linkedin, active:'from-blue-500 to-blue-600',    activeBg:'#eff6ff', activeTxt:'text-blue-700',   activeBorder:'#bfdbfe', inactiveBorder:'#e2e8f0' },
                { id:'naukri',  label:'Naukri',             icon:Globe,    active:'from-purple-500 to-violet-600',activeBg:'#faf5ff', activeTxt:'text-purple-700', activeBorder:'#ddd6fe', inactiveBorder:'#e2e8f0' },
                { id:'apollo',  label:'Apollo (Optional)',  icon:Zap,      active:'from-amber-400 to-orange-500', activeBg:'#fffbeb', activeTxt:'text-amber-700',  activeBorder:'#fde68a', inactiveBorder:'#e2e8f0' },
              ].map(src => {
                const on = sources.includes(src.id);
                return (
                  <button key={src.id} onClick={() => toggleSource(src.id)}
                    className={`src-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-black`}
                    style={{
                      background: on ? src.activeBg : '#f8fafc',
                      border: `1.5px solid ${on ? src.activeBorder : src.inactiveBorder}`,
                      color: on ? undefined : '#94a3b8',
                      boxShadow: on ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}>
                    {on
                      ? <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${src.active} flex items-center justify-center shrink-0`}>
                          <src.icon size={10} className="text-white" />
                        </div>
                      : <src.icon size={13} />}
                    <span className={on ? src.activeTxt : ''}>{src.label}</span>
                    {on && <CheckCircle2 size={11} className={src.activeTxt} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="bg-white rounded-2xl overflow-hidden anim-fade-2"
            style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07)' }}>
            <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
            <div className="p-12 flex flex-col items-center gap-5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <span className="pulse-ring absolute inset-0 rounded-full" />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
                  <Sparkles size={22} className="text-white animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-black text-slate-800">AI is scanning profiles…</p>
                <p className="text-[13px] text-slate-400 mt-1 font-medium">Searching across {sources.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH META STATS ── */}
        {searchMeta && !loading && (
          <div className="bg-white rounded-2xl overflow-hidden anim-fade-2"
            style={{ border:'1.5px solid #d1fae5', boxShadow:'0 4px 20px rgba(16,185,129,0.08)' }}>
            <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#10b981,#0d9488)' }} />
            <div className="p-5 flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-4">
  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
    style={{ background:'linear-gradient(135deg,#10b981,#0d9488)', boxShadow:'0 4px 14px rgba(16,185,129,0.35)' }}>
    <BarChart2 size={17} className="text-white" />
  </div>
  <div>
    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Total Found</p>
    <p className="text-[22px] font-black text-emerald-600 leading-tight">{searchMeta.total}</p>
  </div>
</div>
              <div className="h-10 w-px bg-slate-100" />
              {Object.entries(searchMeta.stats || {}).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider capitalize">{k}</span>
                  <span className="text-[13px] font-black text-slate-700 px-2.5 py-1 rounded-lg"
                    style={{ background:'#f8fafc', border:'1px solid #e2e8f0' }}>{v as any}</span>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">High Match</span>
                <span className="text-[14px] font-black text-emerald-600 px-3 py-1 rounded-lg"
                  style={{ background:'#ecfdf5', border:'1px solid #a7f3d0' }}>{highMatchCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS HEADER ── */}
        {results.length > 0 && !loading && (
          <div className="flex items-center justify-between anim-fade-3">
            <div className="flex items-center gap-3">
  <p className="text-[15px] font-black text-slate-700">
    {results.length} Profile{results.length !== 1 ? 's' : ''} Found
  </p>
  <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
    {highMatchCount} high match
  </span>
</div>
            <button onClick={bulkImportAPI}
              className="btn-bulk flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-black text-white"
              style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', boxShadow:'0 4px 14px rgba(30,27,75,0.3)' }}>
              <Download size={14} /> Import All to CRM
            </button>
          </div>
        )}

        {/* ── RESULTS LIST ── */}
        <div className="space-y-3 anim-fade-3">
          {results.map((p, idx) => {
            const badge      = sourceBadge(p.source);
            const isImported = imported.has(p.profile_url);
            const initials   = p.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            const isHighMatch = (p.relevance_score || 0) > 80;

            return (
              <div key={idx}
                className="result-card bg-white rounded-2xl overflow-hidden"
                style={{
                  border: `1.5px solid ${isImported ? '#a7f3d0' : isHighMatch ? '#c7d2fe' : '#e2e8f0'}`,
                  boxShadow: isImported
                    ? '0 4px 20px rgba(16,185,129,0.1),0 1px 4px rgba(0,0,0,0.04)'
                    : isHighMatch
                      ? '0 4px 20px rgba(79,70,229,0.08),0 1px 4px rgba(0,0,0,0.04)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  animationDelay: `${idx * 40}ms`,
                }}>
                {/* top accent bar */}
                <div className="h-[3px] w-full"
                  style={{ background: isImported
                    ? 'linear-gradient(90deg,#10b981,#0d9488)'
                    : isHighMatch
                      ? 'linear-gradient(90deg,#4f46e5,#7c3aed)'
                      : 'linear-gradient(90deg,#e2e8f0,#f1f5f9)' }} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-[14px] uppercase shrink-0"
                      style={{
                        background: isImported
                          ? 'linear-gradient(135deg,#10b981,#0d9488)'
                          : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        boxShadow: isImported
                          ? '0 4px 12px rgba(16,185,129,0.35)'
                          : '0 4px 12px rgba(79,70,229,0.35)',
                        color: 'white',
                      }}>
                      {initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-slate-800 text-[15px] truncate">{p.name}</h4>
                            {isHighMatch && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black"
                                style={{ background:'#ecfdf5', border:'1px solid #a7f3d0', color:'#065f46' }}>
                                <Star size={10} fill="currentColor" /> {p.relevance_score}% Match
                              </span>
                            )}
                            {isImported && (
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black"
                                style={{ background:'#ecfdf5', border:'1px solid #a7f3d0', color:'#065f46' }}>
                                <CheckCircle2 size={10} /> Imported
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[13px] text-slate-500 flex-wrap font-medium">
                            <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-slate-400" />{p.title}</span>
                            {p.company && <>
                              <span className="text-slate-200">·</span>
                              <span className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-400" />{p.company}</span>
                            </>}
                          </div>
                          <p className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                            <MapPin size={11} /> {p.location || 'Location Unknown'}
                          </p>
                        </div>

                        {/* Source badge */}
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                          style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          {p.source}
                        </span>
                      </div>

                      {/* AI Insight */}
                      {p.relevance_reason && (
                        <div className="mt-3 rounded-xl overflow-hidden"
                          style={{ border:'1px solid #e0e7ff' }}>
                          <div className="h-[2px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                          <div className="px-4 py-2.5" style={{ background:'#eef2ff' }}>
                            <p className="text-[12px] text-indigo-700 font-medium">
                              <span className="font-black">AI Insight: </span>{p.relevance_reason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <a href={p.profile_url} target="_blank" rel="noreferrer"
                          className="btn-action flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black text-slate-600"
                          style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                          <ExternalLink size={12} /> View Profile
                        </a>
                        <button
                          onClick={() => { setActiveProfile(p); setOutreachMsg(null); }}
                          className="btn-action flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black text-indigo-700"
                          style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe' }}>
                          <MessageCircle size={12} /> AI Outreach
                        </button>
                        <button
                          onClick={() => importAPI(p)}
                          disabled={isImported}
                          className={`btn-action flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black ${isImported ? 'cursor-default' : ''}`}
                          style={isImported
                            ? { background:'#ecfdf5', border:'1.5px solid #a7f3d0', color:'#065f46' }
                            : { background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', boxShadow:'0 4px 12px rgba(79,70,229,0.3)' }}>
                          {isImported
                            ? <><CheckCircle2 size={12} /> Imported</>
                            : <><UserPlus size={12} /> Add to CRM</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── EMPTY STATE ── */}
        {!loading && results.length === 0 && prompt && (
          <div className="bg-white rounded-2xl overflow-hidden anim-fade-2"
            style={{ border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,0.04)' }}>
            <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#e2e8f0,#f1f5f9)' }} />
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background:'#f8fafc', border:'2px dashed #e2e8f0' }}>
                <Search size={24} className="text-slate-300" />
              </div>
              <p className="text-[14px] font-black text-slate-500">No profiles found</p>
              <p className="text-[12px] text-slate-400 font-medium">Try simpler or broader keywords.</p>
            </div>
          </div>
        )}

        <div className="pb-4" />
      </div>

      {/* ══════════════════ OUTREACH MODAL ══════════════════ */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
          style={{ backgroundColor:'rgba(10,8,30,0.65)', backdropFilter:'blur(8px)' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden modal-anim"
            style={{ boxShadow:'0 24px 64px rgba(79,70,229,0.28),0 8px 24px rgba(0,0,0,0.14)', border:'1.5px solid rgba(99,102,241,0.2)' }}>

            {/* Modal header */}
            <div className="px-6 py-5 flex items-center gap-4 relative overflow-hidden"
              style={{ background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)' }}>
              <div className="shimmer-overlay" />
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 relative z-10"
                style={{ backgroundColor:'rgba(255,255,255,0.15)', backdropFilter:'blur(4px)', border:'1.5px solid rgba(255,255,255,0.25)' }}>
                <MessageCircle size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-[17px] font-black text-white leading-tight">Outreach Generator</h3>
                <p className="text-[12px] text-indigo-200 font-medium truncate mt-0.5">
                  {activeProfile.name} · {activeProfile.company}
                </p>
              </div>
              <button onClick={() => setActiveProfile(null)}
                className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all active:scale-90"
                style={{ border:'1px solid rgba(255,255,255,0.18)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="p-6" style={{ background:'linear-gradient(180deg,#fafbff,#f8fafc)' }}>
              {!outreachMsg ? (
                <div className="space-y-5">
                  <p className="text-[13px] text-slate-500 font-medium">Choose a channel to generate a personalized message:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { channel:'LinkedIn', icon:Linkedin,     gradient:'from-blue-500 to-blue-600',    glow:'rgba(59,130,246,0.3)'  },
                      { channel:'Email',    icon:MessageCircle, gradient:'from-amber-400 to-orange-500', glow:'rgba(245,158,11,0.3)' },
                    ].map(({ channel, icon: Icon, gradient, glow }) => (
                      <button key={channel}
                        onClick={() => generateOutreachAPI(channel)}
                        disabled={genLoading}
                        className="channel-card p-6 bg-white rounded-2xl text-[14px] font-black text-slate-600 flex flex-col items-center gap-3 disabled:opacity-50"
                        style={{ border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                          style={{ boxShadow:`0 6px 16px ${glow}` }}>
                          <Icon size={20} className="text-white" />
                        </div>
                        {channel === 'LinkedIn' ? 'LinkedIn DM' : 'Cold Email'}
                      </button>
                    ))}
                  </div>
                  {genLoading && (
                    <div className="flex items-center justify-center gap-3 py-4 rounded-xl"
                      style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe' }}>
                      <Loader2 className="animate-spin text-indigo-600" size={17} />
                      <span className="text-[13px] font-black text-indigo-700">AI is writing your message…</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {outreachMsg.subject && (
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">Subject Line</label>
                      <div className="px-4 py-3 rounded-xl text-[14px] font-black text-slate-800 select-all"
                        style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                        {outreachMsg.subject}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">Message Body</label>
                    <div className="px-4 py-3 rounded-xl text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed select-all h-44 overflow-y-auto"
                      style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                      {outreachMsg.message}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setActiveProfile(null)}
                      className="btn-cancel flex-1 py-3 text-[13px] font-black text-slate-600 bg-white rounded-xl"
                      style={{ border:'1.5px solid #e2e8f0' }}>
                      Close
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(outreachMsg.message); alert("Copied!"); }}
                      className="btn-cta flex-1 py-3 text-[13px] font-black text-white rounded-xl"
                      style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 16px rgba(79,70,229,0.35)' }}>
                      Copy Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
