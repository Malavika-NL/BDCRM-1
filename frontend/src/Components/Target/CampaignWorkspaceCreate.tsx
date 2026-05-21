// import React, { useEffect, useState } from 'react';
// import { 
//   Wand2, 
//   ArrowLeft, 
//   Sparkles, 
//   MessageCircle, 
//   Mail, 
//   Linkedin, 
//   Building2, 
//   LayoutTemplate, 
//   Target, 
//   Briefcase, 
//   MapPin, 
//   Bot,
//   Loader2,
//   FileText
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface DropdownItem {
//   id: number;
//   name: string;
// }

// export const CampaignWorkspaceCreate = () => {
//   const navigate = useNavigate();
//   const [isGenerating, setIsGenerating] = useState(false);
  
//   // Dropdown Data States
//   const [verticals, setVerticals] = useState<DropdownItem[]>([]);
//   const [regions, setRegions] = useState<DropdownItem[]>([]);

//   const [form, setForm] = useState({
//     name: '',
//     brand_name: '',
//     content_theme: '',
//     target_description: '',
//     selected_channel: 'whatsapp',
//     selected_vertical: '',
//     selected_region: '',
//     prompt: ''
//   });

//   // Fetch Verticals & Regions on load
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [vertRes, regRes] = await Promise.all([
//           fetch(`${API_BASE}/verticals/`),
//           fetch(`${API_BASE}/regions/`)
//         ]);
        
//         setVerticals(await vertRes.json());
//         setRegions(await regRes.json());
//       } catch (err) {
//         console.error("Failed to load dropdown data", err);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   // --- FIXED GENERATE FUNCTION ---
//   const handleGenerate = async () => {
//     if (!form.name) return alert("Workspace Name is required!");
//     if (!form.prompt) return alert("AI Prompt is required!");
    
//     setIsGenerating(true);
//     try {
//       // 1. Build a clean payload (ONLY include what has text/data to prevent 400 Bad Request)
//       const payload: Record<string, any> = {
//         name: form.name,
//         brand_name: form.brand_name,
//         content_theme: form.content_theme,
//         target_description: form.target_description,
//         selected_channel: form.selected_channel,
//         prompt: form.prompt
//       };

//       // 2. Only add ID fields if they were actually selected (prevents sending 'null')
//       if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical);
//       if (form.selected_region) payload.selected_region = parseInt(form.selected_region);

//       // 3. Send request
//       const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       // 4. Catch exactly what Django is complaining about if it fails
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Django Validation Error:", errorData);
//         alert(`Validation Error: ${JSON.stringify(errorData)}`);
//         setIsGenerating(false);
//         return;
//       }

//       // Redirect back to list page upon success
//       navigate('/campaign-workspace');
//     } catch (err) {
//       console.error("Network Error:", err);
//       alert('Failed to connect to the server');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Channel UI Configurations
//   const channels = [
//     { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={24} />, color: 'text-green-600', bg: 'bg-green-50', active: 'border-green-500 ring-1 ring-green-500 bg-green-50/50' },
//     { id: 'email', name: 'Email', icon: <Mail size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', active: 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' },
//     { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} />, color: 'text-sky-600', bg: 'bg-sky-50', active: 'border-sky-500 ring-1 ring-sky-500 bg-sky-50/50' },
//   ];

//   return (
//     <div className="h-full overflow-y-auto custom-scrollbar bg-slate-50/50 relative">
      
//       {/* --- HERO HEADER --- */}
//       <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 pt-12 pb-24 px-8 relative overflow-hidden shrink-0">
//         {/* Decorative background shapes */}
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
//           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
//         </div>

//         <div className="max-w-5xl mx-auto relative z-10">
//           <button 
//             onClick={() => navigate('/campaign-workspace')}
//             className="mb-6 flex items-center gap-2 text-purple-200 hover:text-white transition-colors font-medium text-sm bg-white/10 hover:bg-white/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm"
//           >
//             <ArrowLeft size={16} /> Back to Workspaces
//           </button>
          
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
//               <Sparkles className="text-yellow-300" size={28} />
//             </div>
//             <div>
//               <h2 className="text-4xl font-black text-white tracking-tight">AI Campaign Studio</h2>
//               <p className="text-purple-200 mt-1 text-lg">Define your parameters and let AI craft the perfect outreach.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN FORM CONTENT --- */}
//       <div className="max-w-5xl mx-auto px-8 -mt-16 relative z-20 pb-20 space-y-6">
        
//         {/* SECTION 1: Basic Information */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
//           <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
//             <FileText className="text-purple-600" size={20} />
//             <h3 className="text-lg font-bold text-slate-800">1. Campaign Identity</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1.5 md:col-span-2">
//               <label className="text-sm font-bold text-slate-700">Workspace Name <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <LayoutTemplate className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
//                 <input
//                   className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
//                   placeholder="e.g., Q3 Enterprise Software Push"
//                   value={form.name}
//                   onChange={e => setForm({ ...form, name: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-700">Brand / Company Name</label>
//               <div className="relative">
//                 <Building2 className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
//                 <input
//                   className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
//                   placeholder="Your Company Name"
//                   value={form.brand_name}
//                   onChange={e => setForm({ ...form, brand_name: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-700">Content Theme</label>
//               <div className="relative">
//                 <Sparkles className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
//                 <input
//                   className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
//                   placeholder="e.g., Summer Discount, Feature Launch"
//                   value={form.content_theme}
//                   onChange={e => setForm({ ...form, content_theme: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SECTION 2: Target & Channel */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
//           <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
//             <Target className="text-blue-600" size={20} />
//             <h3 className="text-lg font-bold text-slate-800">2. Audience & Delivery</h3>
//           </div>

//           {/* Visual Channel Selector */}
//           <div className="mb-8">
//             <label className="text-sm font-bold text-slate-700 block mb-3">Delivery Channel</label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {channels.map((ch) => (
//                 <button
//                   key={ch.id}
//                   onClick={() => setForm({ ...form, selected_channel: ch.id })}
//                   className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-200 ${
//                     form.selected_channel === ch.id 
//                       ? ch.active 
//                       : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
//                   }`}
//                 >
//                   <div className={`p-3 rounded-full mb-2 ${ch.bg} ${ch.color}`}>
//                     {ch.icon}
//                   </div>
//                   <span className={`font-bold ${form.selected_channel === ch.id ? 'text-slate-900' : 'text-slate-600'}`}>
//                     {ch.name}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-700">Target Vertical</label>
//               <div className="relative">
//                 <Briefcase className="absolute left-3.5 top-3.5 text-slate-400 z-10" size={18} />
//                 <select
//                   className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
//                   value={form.selected_vertical}
//                   onChange={e => setForm({ ...form, selected_vertical: e.target.value })}
//                 >
//                   <option value="">-- Select Industry Vertical --</option>
//                   {verticals.map(v => (
//                     <option key={v.id} value={v.id}>{v.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-700">Target Region</label>
//               <div className="relative">
//                 <MapPin className="absolute left-3.5 top-3.5 text-slate-400 z-10" size={18} />
//                 <select
//                   className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
//                   value={form.selected_region}
//                   onChange={e => setForm({ ...form, selected_region: e.target.value })}
//                 >
//                   <option value="">-- Select Region --</option>
//                   {regions.map(r => (
//                     <option key={r.id} value={r.id}>{r.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-sm font-bold text-slate-700">Detailed Audience Description</label>
//             <textarea
//               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[100px] resize-y"
//               placeholder="e.g., IT Directors and CTOs in Mid-sized logistics companies facing high operational costs..."
//               value={form.target_description}
//               onChange={e => setForm({ ...form, target_description: e.target.value })}
//             />
//           </div>
//         </div>

//         {/* SECTION 3: AI Prompt */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 relative overflow-hidden">
//           {/* Subtle gradient background for the AI section */}
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 pointer-events-none" />
          
//           <div className="relative z-10">
//             <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-4">
//               <div className="flex items-center gap-2">
//                 <Bot className="text-indigo-600" size={20} />
//                 <h3 className="text-lg font-bold text-slate-800">3. AI Instructions <span className="text-red-500">*</span></h3>
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-700">What should the AI write about?</label>
//               <textarea
//                 className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[140px] resize-y"
//                 placeholder="Give instructions to the AI. e.g., Write a highly urgent, exciting message. Keep it under 50 words. Focus on the ROI of our new automation feature..."
//                 value={form.prompt}
//                 onChange={e => setForm({ ...form, prompt: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>

//         {/* --- ACTION FOOTER --- */}
//         <div className="flex items-center justify-end gap-4 pt-4">
//           <button
//             onClick={() => navigate('/campaign-workspace')}
//             className="px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>
          
//           <button
//             onClick={handleGenerate}
//             disabled={isGenerating}
//             className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
//               isGenerating 
//                 ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
//                 : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5'
//             }`}
//           >
//             {isGenerating ? (
//               <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Compiling Data...</span>
//             ) : (
//               <span className="flex items-center gap-2"><Wand2 size={18} /> Generate Campaign Draft</span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* --- LOADING OVERLAY --- */}
//       {isGenerating && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-200">
//             <div className="relative w-24 h-24 mb-6">
//               <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
//               <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
//               <div className="absolute inset-0 flex items-center justify-center text-purple-600">
//                 <Wand2 size={32} className="animate-pulse" />
//               </div>
//             </div>
//             <h3 className="text-xl font-black text-slate-800 mb-2">AI is working...</h3>
//             <p className="text-center text-slate-500 text-sm font-medium">
//               Analyzing audience, synthesizing parameters, and drafting the perfect message.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CampaignWorkspaceCreate;


// import React, { useEffect, useState } from 'react';
// import {
//   Wand2,
//   ArrowLeft,
//   Sparkles,
//   MessageCircle,
//   Mail,
//   Linkedin,
//   Building2,
//   LayoutTemplate,
//   Target,
//   Briefcase,
//   MapPin,
//   Bot,
//   Loader2,
//   FileText,
//   PenSquare,
//   Orbit,
//   PencilLine,
//   Save,
//   Rocket,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface DropdownItem {
//   id: number;
//   name: string;
// }

// export const CampaignWorkspaceCreate = () => {
//   const navigate = useNavigate();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [mode, setMode] = useState<'ai' | 'manual'>('ai');

//   const [verticals, setVerticals] = useState<DropdownItem[]>([]);
//   const [regions, setRegions] = useState<DropdownItem[]>([]);

//   const [form, setForm] = useState({
//     name: '',
//     brand_name: '',
//     content_theme: '',
//     target_description: '',
//     selected_channel: 'whatsapp',
//     selected_vertical: '',
//     selected_region: '',
//     prompt: '',
//     manual_subject: '',
//     manual_content: '',
//     manual_cta: '',
//     manual_audience_hint: '',
//   });

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [vertRes, regRes] = await Promise.all([
//           fetch(`${API_BASE}/verticals/`),
//           fetch(`${API_BASE}/regions/`),
//         ]);

//         setVerticals(await vertRes.json());
//         setRegions(await regRes.json());
//       } catch (err) {
//         console.error('Failed to load dropdown data', err);
//         console.error('Failed to load dropdown data', err);
//       }
//     };
//     fetchDropdowns();
//   }, []);

//   const handleGenerate = async () => {
//     if (!form.name) return alert('Workspace Name is required!');
//     if (!form.prompt) return alert('AI Prompt is required!');

//     if (!form.name) return alert('Workspace Name is required!');
//     if (!form.prompt) return alert('AI Prompt is required!');

//     setIsGenerating(true);
//     try {
//       const payload: Record<string, any> = {
//         name: form.name,
//         brand_name: form.brand_name,
//         content_theme: form.content_theme,
//         target_description: form.target_description,
//         selected_channel: form.selected_channel,
//         prompt: form.prompt,
//       };

//       if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
//       if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);

//       const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Django Validation Error:', errorData);
//         console.error('Django Validation Error:', errorData);
//         alert(`Validation Error: ${JSON.stringify(errorData)}`);
//         setIsGenerating(false);
//         return;
//       }

//       navigate('/campaign-workspace');
//     } catch (err) {
//       console.error('Network Error:', err);
//       alert('Failed to connect to the server');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualCreate = async (status: 'draft' | 'ready') => {
//     if (!form.name) return alert('Workspace Name is required!');
//     if (!form.manual_content) return alert('Manual Content is required!');

//     setIsGenerating(true);
//     try {
//       const payload: Record<string, any> = {
//         name: form.name,
//         brand_name: form.brand_name,
//         content_theme: form.content_theme,
//         target_description: form.target_description || form.manual_audience_hint,
//         selected_channel: form.selected_channel,
//         generated_subject: form.manual_subject,
//         generated_content: [form.manual_content, form.manual_cta ? `CTA: ${form.manual_cta}` : '']
//           .filter(Boolean)
//           .join('\n\n'),
//         status,
//       };

//       if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
//       if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);

//       const response = await fetch(`${API_BASE}/campaign-workspace/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Django Validation Error:', errorData);
//         alert(`Validation Error: ${JSON.stringify(errorData)}`);
//         setIsGenerating(false);
//         return;
//       }
//       navigate('/campaign-workspace');
//     } catch (err) {
//       console.error('Network Error:', err);
//       console.error('Network Error:', err);
//       alert('Failed to connect to the server');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const channels = [
//     {
//       id: 'whatsapp',
//       name: 'WhatsApp',
//       icon: <MessageCircle size={22} />,
//       color: 'text-emerald-600',
//       bg: 'bg-emerald-50',
//       active: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50',
//     },
//     {
//       id: 'email',
//       name: 'Email',
//       icon: <Mail size={22} />,
//       color: 'text-blue-600',
//       bg: 'bg-blue-50',
//       active: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50',
//     },
//     {
//       id: 'linkedin',
//       name: 'LinkedIn',
//       icon: <Linkedin size={22} />,
//       color: 'text-sky-600',
//       bg: 'bg-sky-50',
//       active: 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-50',
//     },
//   ];

//   return (
//     <div className="h-full overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_10%_10%,#dbeafe_0%,#eff6ff_35%,#f0f9ff_100%)] relative">
//       <style>
//         {`
//           @keyframes drift {
//             0% { transform: translateY(0) translateX(0); }
//             50% { transform: translateY(-10px) translateX(8px); }
//             100% { transform: translateY(0) translateX(0); }
//           }
//           @keyframes rise {
//             0% { opacity: 0; transform: translateY(14px) scale(0.99); }
//             100% { opacity: 1; transform: translateY(0) scale(1); }
//           }
//           .anim-drift { animation: drift 8s ease-in-out infinite; }
//           .anim-rise-1 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .04s; }
//           .anim-rise-2 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .12s; }
//           .anim-rise-3 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .2s; }
//           .anim-rise-4 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .28s; }
//         `}
//       </style>

//       <div className="pointer-events-none absolute -top-16 -left-12 w-80 h-80 bg-blue-300/25 rounded-full blur-3xl anim-drift" />
//       <div className="pointer-events-none absolute top-40 -right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl anim-drift" />

//       <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 pt-12 pb-24 px-8 relative overflow-hidden shrink-0">
//         <div className="absolute inset-0 opacity-20 pointer-events-none">
//           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-sky-300 rounded-full blur-3xl" />
//         </div>

//         <div className="max-w-6xl mx-auto relative z-10 anim-rise-1">
//           <button
//             onClick={() => navigate('/campaign-workspace')}
//             className="mb-6 flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium text-sm bg-white/15 hover:bg-white/25 w-fit px-3.5 py-2 rounded-lg backdrop-blur-sm"
//           >
//             <ArrowLeft size={16} /> Back to Workspaces
//           </button>

//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
//               <Sparkles className="text-cyan-200" size={28} />
//             </div>
//             <div>
//               <h2 className="text-4xl font-black text-white tracking-tight"> Campaign Creation</h2>
//               <p className="text-blue-100 mt-1 text-lg">Define parameters and let AI craft high-converting outreach.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-16 relative z-20 pb-20 space-y-6">
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-blue-100 anim-rise-2 hover:shadow-[0_14px_50px_rgba(37,99,235,0.2)] transition-shadow">
//           <SectionTitle icon={FileText} title="1. Campaign Identity" accent="text-blue-600" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <Field
//               label="Workspace Name"
//               required
//               icon={LayoutTemplate}
//               placeholder="e.g., Q3 Enterprise Software Push"
//               value={form.name}
//               onChange={(v) => setForm({ ...form, name: v })}
//               focus="focus:border-blue-500 focus:ring-blue-500/10"
//               className="md:col-span-2"
//             />

//             <Field
//               label="Brand / Company Name"
//               icon={Building2}
//               placeholder="Your Company Name"
//               value={form.brand_name}
//               onChange={(v) => setForm({ ...form, brand_name: v })}
//               focus="focus:border-blue-500 focus:ring-blue-500/10"
//             />

//             <Field
//               label="Content Theme"
//               icon={Orbit}
//               placeholder="e.g., Summer Offer, Feature Launch"
//               value={form.content_theme}
//               onChange={(v) => setForm({ ...form, content_theme: v })}
//               focus="focus:border-blue-500 focus:ring-blue-500/10"
//             />
//           </div>
//         </div>

//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_10px_36px_rgba(59,130,246,0.12)] border border-blue-100 anim-rise-3">
//           <div className="flex items-center justify-between flex-wrap gap-3">
//             <div>
//               <p className="text-sm font-bold text-slate-700">Creation Mode</p>
//               <p className="text-xs text-slate-500">Choose AI-assisted generation or fully manual workspace creation.</p>
//             </div>
//             <div className="inline-flex bg-slate-100 rounded-xl p-1">
//               <button
//                 onClick={() => setMode('ai')}
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                   mode === 'ai' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'
//                 }`}
//               >
//                 <span className="inline-flex items-center gap-2"><Wand2 size={15} /> AI Generate</span>
//               </button>
//               <button
//                 onClick={() => setMode('manual')}
//                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                   mode === 'manual' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'
//                 }`}
//               >
//                 <span className="inline-flex items-center gap-2"><PencilLine size={15} /> Manual Compose</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(14,165,233,0.13)] border border-cyan-100 anim-rise-3 hover:shadow-[0_14px_50px_rgba(14,165,233,0.18)] transition-shadow">
//           <SectionTitle icon={Target} title="2. Audience & Delivery" accent="text-cyan-600" />

//           <div className="mb-8 mt-6">
//             <label className="text-sm font-bold text-slate-700 block mb-3">Delivery Channel</label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {channels.map((ch) => (
//                 <button
//                   key={ch.id}
//                   onClick={() => setForm({ ...form, selected_channel: ch.id })}
//                   className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${
//                     form.selected_channel === ch.id
//                       ? ch.active
//                       : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
//                   }`}
//                 >
//                   <div className={`p-3 rounded-full mb-2 ${ch.bg} ${ch.color}`}>{ch.icon}</div>
//                   <span className={`font-bold ${form.selected_channel === ch.id ? 'text-slate-900' : 'text-slate-600'}`}>{ch.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <SelectField
//               label="Target Vertical"
//               icon={Briefcase}
//               value={form.selected_vertical}
//               onChange={(v) => setForm({ ...form, selected_vertical: v })}
//               options={verticals}
//               placeholder="Select Industry Vertical"
//               focus="focus:border-cyan-500 focus:ring-cyan-500/10"
//             />

//             <SelectField
//               label="Target Region"
//               icon={MapPin}
//               value={form.selected_region}
//               onChange={(v) => setForm({ ...form, selected_region: v })}
//               options={regions}
//               placeholder="Select Region"
//               focus="focus:border-cyan-500 focus:ring-cyan-500/10"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-sm font-bold text-slate-700">Detailed Audience Description</label>
//             <textarea
//               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none min-h-[120px] resize-y"
//               placeholder="e.g., IT Directors and CTOs in mid-sized logistics companies facing high operational costs."
//               value={form.target_description}
//               onChange={(e) => setForm({ ...form, target_description: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(59,130,246,0.12)] border border-blue-100 relative overflow-hidden anim-rise-4 hover:shadow-[0_14px_50px_rgba(59,130,246,0.18)] transition-shadow">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-50/45 to-cyan-50/45 pointer-events-none" />

//           <div className="relative z-10">
//             <SectionTitle
//               icon={mode === 'ai' ? Bot : PencilLine}
//               title={mode === 'ai' ? '3. AI Instructions' : '3. Manual Content Composer'}
//               accent="text-indigo-600"
//               required
//             />

//             {mode === 'ai' ? (
//               <div className="space-y-1.5 mt-6">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-bold text-slate-700">What should the AI write about?</label>
//                   <span className="text-xs text-slate-500">{form.prompt.trim().split(/\s+/).filter(Boolean).length} words</span>
//                 </div>
//                 <div className="relative">
//                   <PenSquare className="absolute left-4 top-4 text-slate-400" size={18} />
//                   <textarea
//                     className="w-full pl-11 p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[160px] resize-y"
//                     placeholder="Give clear instructions. Example: Write an urgent 60-word message emphasizing ROI and requesting a 15-minute demo call."
//                     value={form.prompt}
//                     onChange={(e) => setForm({ ...form, prompt: e.target.value })}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//                 <div className="space-y-4">
//                   <Field
//                     label="Subject Line"
//                     icon={Mail}
//                     placeholder="e.g., Cut Operating Cost by 30% This Quarter"
//                     value={form.manual_subject}
//                     onChange={(v) => setForm({ ...form, manual_subject: v })}
//                     focus="focus:border-indigo-500 focus:ring-indigo-500/10"
//                   />
//                   <div className="space-y-1.5">
//                     <div className="flex items-center justify-between">
//                       <label className="text-sm font-bold text-slate-700">Message Content <span className="text-rose-500">*</span></label>
//                       <span className="text-xs text-slate-500">{form.manual_content.trim().split(/\\s+/).filter(Boolean).length} words</span>
//                     </div>
//                     <textarea
//                       className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[180px] resize-y"
//                       placeholder="Write your campaign message manually..."
//                       value={form.manual_content}
//                       onChange={(e) => setForm({ ...form, manual_content: e.target.value })}
//                     />
//                   </div>
//                   <Field
//                     label="Call To Action"
//                     icon={Target}
//                     placeholder="e.g., Reply YES for a 15-min strategy call"
//                     value={form.manual_cta}
//                     onChange={(v) => setForm({ ...form, manual_cta: v })}
//                     focus="focus:border-indigo-500 focus:ring-indigo-500/10"
//                   />
//                   <Field
//                     label="Audience Hint"
//                     icon={Briefcase}
//                     placeholder="e.g., CTOs in logistics with legacy ERP"
//                     value={form.manual_audience_hint}
//                     onChange={(v) => setForm({ ...form, manual_audience_hint: v })}
//                     focus="focus:border-indigo-500 focus:ring-indigo-500/10"
//                   />
//                 </div>
//                 <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
//                   <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-2">Live Preview</p>
//                   <h4 className="text-sm font-bold text-slate-800">{form.manual_subject || 'Your subject will appear here'}</h4>
//                   <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{form.manual_content || 'Your manual content preview will appear here.'}</p>
//                   {form.manual_cta && <p className="text-sm font-semibold text-blue-700 mt-4">CTA: {form.manual_cta}</p>}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-4 pt-4 anim-rise-4">
//           <button
//             onClick={() => navigate('/campaign-workspace')}
//             className="px-4 py-2 text-[14px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>

//           {mode === 'ai' ? (
//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
//                 isGenerating
//                   ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
//                   : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0'
//               }`}
//             >
//               {isGenerating ? (
//                 <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Compiling Data...</span>
//               ) : (
//                 <span className="flex items-center gap-2"><Wand2 size={18} /> Generate Campaign Draft</span>
//               )}
//             </button>
//           ) : (
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => handleManualCreate('draft')}
//                 disabled={isGenerating}
//                 className="px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
//               >
//                 <Save size={18} /> Save Draft
//               </button>
//               <button
//                 onClick={() => handleManualCreate('ready')}
//                 disabled={isGenerating}
//                 className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
//                   isGenerating
//                     ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
//                     : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0'
//                 }`}
//               >
//                 <Rocket size={18} /> Publish Manual Workspace
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isGenerating && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm">
//           <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4 animate-[rise_.28s_ease-out]">
//             <div className="relative w-24 h-24 mb-6">
//               <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
//               <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
//               <div className="absolute inset-0 flex items-center justify-center text-cyan-600">
//                 <Wand2 size={32} className="animate-pulse" />
//               </div>
//             </div>
//             <h3 className="text-xl font-black text-slate-800 mb-2">AI is working...</h3>
//             <p className="text-center text-slate-500 text-sm font-medium">
//               Analyzing audience, blending parameters, and drafting your campaign message.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// type FieldProps = {
//   label: string;
//   required?: boolean;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   placeholder: string;
//   value: string;
//   onChange: (value: string) => void;
//   focus: string;
//   className?: string;
// };

// const Field = ({ label, required, icon: Icon, placeholder, value, onChange, focus, className }: FieldProps) => (
//   <div className={`space-y-1.5 ${className || ''}`}>
//     <label className="text-sm font-bold text-slate-700">
//       {label} {required && <span className="text-rose-500">*</span>}
//     </label>
//     <div className="relative">
//       <Icon className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
//       <input
//         className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-4 transition-all outline-none ${focus}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   </div>
// );

// type SelectFieldProps = {
//   label: string;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   value: string;
//   onChange: (value: string) => void;
//   options: DropdownItem[];
//   placeholder: string;
//   focus: string;
// };

// const SelectField = ({ label, icon: Icon, value, onChange, options, placeholder, focus }: SelectFieldProps) => (
//   <div className="space-y-1.5">
//     <label className="text-sm font-bold text-slate-700">{label}</label>
//     <div className="relative">
//       <Icon className="absolute left-3.5 top-3.5 text-slate-400 z-10" size={18} />
//       <select
//         className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 transition-all outline-none appearance-none ${focus}`}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">-- {placeholder} --</option>
//         {options.map((item) => (
//           <option key={item.id} value={item.id}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   </div>
// );

// const SectionTitle = ({
//   icon: Icon,
//   title,
//   accent,
//   required,
// }: {
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   title: string;
//   accent: string;
//   required?: boolean;
// }) => (
//   <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
//     <Icon className={accent} size={20} />
//     <h3 className="text-lg font-bold text-slate-800">
//       {title} {required && <span className="text-rose-500">*</span>}
//     </h3>
//   </div>
// );

// export default CampaignWorkspaceCreate;


// import React, { useEffect, useState } from 'react';
// import {
//   Wand2, ArrowLeft, Sparkles, MessageCircle, Mail, Linkedin,
//   Building2, LayoutTemplate, Target, Briefcase, MapPin, Bot,
//   Loader2, FileText, PenSquare, Orbit, PencilLine, Save, Rocket,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface DropdownItem { id: number; name: string; }

// // ─── SectionHead — matches BDMTargetCreate exactly ───────────────────────────
// const SectionHead = ({
//   icon: Icon,
//   title,
//   subtitle,
//   accentColor = 'bg-indigo-500',
//   required,
// }: {
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   title: string;
//   subtitle: string;
//   accentColor?: string;
//   required?: boolean;
// }) => (
//   <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
//     <div className={`w-1 self-stretch rounded-full ${accentColor} shrink-0`} />
//     <div className="flex items-center gap-2.5">
//       <Icon className="text-slate-400 shrink-0" size={16} />
//       <div>
//         <h3 className="text-[14px] font-black text-slate-800">
//           {title} {required && <span className="text-rose-400">*</span>}
//         </h3>
//         <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
//       </div>
//     </div>
//   </div>
// );

// // ─── Field — upgraded with BDMTargetCreate label style ───────────────────────
// type FieldProps = {
//   label: string; required?: boolean;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   placeholder: string; value: string;
//   onChange: (value: string) => void;
//   focusRing: string; className?: string;
// };

// const Field = ({ label, required, icon: Icon, placeholder, value, onChange, focusRing, className }: FieldProps) => (
//   <div className={`space-y-2 ${className || ''}`}>
//     <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//       {label} {required && <span className="text-rose-400">*</span>}
//     </label>
//     <div className="relative">
//       <Icon className="absolute left-4 top-3.5 text-slate-400" size={15} />
//       <input
//         className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm
//           font-medium text-slate-700 placeholder:text-slate-300
//           focus:bg-white outline-none transition-all ${focusRing}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   </div>
// );

// // ─── SelectField — upgraded ───────────────────────────────────────────────────
// type SelectFieldProps = {
//   label: string;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   value: string; onChange: (value: string) => void;
//   options: DropdownItem[]; placeholder: string; focusRing: string;
// };

// const SelectField = ({ label, icon: Icon, value, onChange, options, placeholder, focusRing }: SelectFieldProps) => (
//   <div className="space-y-2">
//     <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</label>
//     <div className="relative">
//       <Icon className="absolute left-4 top-3.5 text-slate-400 z-10" size={15} />
//       <select
//         className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm
//           font-medium text-slate-700 focus:bg-white outline-none transition-all appearance-none ${focusRing}`}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">— {placeholder} —</option>
//         {options.map((item) => (
//           <option key={item.id} value={item.id}>{item.name}</option>
//         ))}
//       </select>
//     </div>
//   </div>
// );

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export const CampaignWorkspaceCreate = () => {
//   const navigate = useNavigate();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [mode, setMode] = useState<'ai' | 'manual'>('ai');
//   const [verticals, setVerticals] = useState<DropdownItem[]>([]);
//   const [regions, setRegions] = useState<DropdownItem[]>([]);

//   const [form, setForm] = useState({
//     name: '', brand_name: '', content_theme: '', target_description: '',
//     selected_channel: 'whatsapp', selected_vertical: '', selected_region: '',
//     prompt: '', manual_subject: '', manual_content: '', manual_cta: '', manual_audience_hint: '',
//   });

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [vertRes, regRes] = await Promise.all([
//           fetch(`${API_BASE}/verticals/`),
//           fetch(`${API_BASE}/regions/`),
//         ]);
//         setVerticals(await vertRes.json());
//         setRegions(await regRes.json());
//       } catch (err) { console.error('Failed to load dropdown data', err); }
//     };
//     fetchDropdowns();
//   }, []);

//   const handleGenerate = async () => {
//     if (!form.name) return alert('Workspace Name is required!');
//     if (!form.prompt) return alert('AI Prompt is required!');
//     setIsGenerating(true);
//     try {
//       const payload: Record<string, any> = {
//         name: form.name, brand_name: form.brand_name, content_theme: form.content_theme,
//         target_description: form.target_description, selected_channel: form.selected_channel, prompt: form.prompt,
//       };
//       if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
//       if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);
//       const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Django Validation Error:', errorData);
//         alert(`Validation Error: ${JSON.stringify(errorData)}`);
//         setIsGenerating(false); return;
//       }
//       navigate('/campaign-workspace');
//     } catch (err) { console.error('Network Error:', err); alert('Failed to connect to the server'); }
//     finally { setIsGenerating(false); }
//   };

//   const handleManualCreate = async (status: 'draft' | 'ready') => {
//     if (!form.name) return alert('Workspace Name is required!');
//     if (!form.manual_content) return alert('Manual Content is required!');
//     setIsGenerating(true);
//     try {
//       const payload: Record<string, any> = {
//         name: form.name, brand_name: form.brand_name, content_theme: form.content_theme,
//         target_description: form.target_description || form.manual_audience_hint,
//         selected_channel: form.selected_channel, generated_subject: form.manual_subject,
//         generated_content: [form.manual_content, form.manual_cta ? `CTA: ${form.manual_cta}` : ''].filter(Boolean).join('\n\n'),
//         status,
//       };
//       if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
//       if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);
//       const response = await fetch(`${API_BASE}/campaign-workspace/`, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Django Validation Error:', errorData);
//         alert(`Validation Error: ${JSON.stringify(errorData)}`);
//         setIsGenerating(false); return;
//       }
//       navigate('/campaign-workspace');
//     } catch (err) { console.error('Network Error:', err); alert('Failed to connect to the server'); }
//     finally { setIsGenerating(false); }
//   };

//   const channels = [
//     { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', activeBar: 'bg-emerald-500', activeBorder: 'border-emerald-400', activeRing: 'ring-2 ring-emerald-500/20', activeBg: 'bg-emerald-50' },
//     { id: 'email',    name: 'Email',    icon: <Mail          size={18} />, color: 'text-blue-600',    bg: 'bg-blue-50',    activeBar: 'bg-blue-500',    activeBorder: 'border-blue-400',    activeRing: 'ring-2 ring-blue-500/20',    activeBg: 'bg-blue-50'    },
//     { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin      size={18} />, color: 'text-sky-600',     bg: 'bg-sky-50',     activeBar: 'bg-sky-500',     activeBorder: 'border-sky-400',     activeRing: 'ring-2 ring-sky-500/20',     activeBg: 'bg-sky-50'     },
//   ];

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
//         .anim-blob    { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//         .anim-fade-4  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.33s; }
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
//           {/* back button */}
//           <button
//             onClick={() => navigate('/campaign-workspace')}
//             className="flex items-center gap-1.5 text-indigo-200 hover:text-white text-xs font-semibold
//               bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all shrink-0"
//           >
//             <ArrowLeft size={14} /> Back
//           </button>

//           {/* icon block */}
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
//           >
//             <Sparkles className="text-white" size={20} />
//           </div>

//           {/* text */}
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               Campaign Creation
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Define parameters and let AI craft high-converting outreach.
//             </p>
//           </div>

//           {/* Mode toggle — in banner on larger screens */}
//           <div className="hidden sm:inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1 gap-1 shrink-0">
//             <button
//               onClick={() => setMode('ai')}
//               className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
//                 mode === 'ai'
//                   ? 'bg-white text-indigo-700 shadow-md'
//                   : 'text-indigo-200 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               <Wand2 size={12} /> AI Generate
//             </button>
//             <button
//               onClick={() => setMode('manual')}
//               className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
//                 mode === 'manual'
//                   ? 'bg-white text-indigo-700 shadow-md'
//                   : 'text-indigo-200 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               <PencilLine size={12} /> Manual Compose
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── SCROLLABLE BODY ── */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* mobile mode toggle */}
//         <div className="sm:hidden flex bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1.5 gap-1.5 anim-fade-1">
//           <button
//             onClick={() => setMode('ai')}
//             className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
//               mode === 'ai'
//                 ? 'text-white shadow-md'
//                 : 'text-slate-500 hover:bg-slate-50'
//             }`}
//             style={mode === 'ai' ? { background: 'linear-gradient(125deg, #4f46e5, #7c3aed)' } : {}}
//           >
//             <Wand2 size={12} /> AI Generate
//           </button>
//           <button
//             onClick={() => setMode('manual')}
//             className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
//               mode === 'manual'
//                 ? 'text-white shadow-md'
//                 : 'text-slate-500 hover:bg-slate-50'
//             }`}
//             style={mode === 'manual' ? { background: 'linear-gradient(125deg, #4f46e5, #7c3aed)' } : {}}
//           >
//             <PencilLine size={12} /> Manual Compose
//           </button>
//         </div>

//         {/* ══ CARD 1: Campaign Identity ══ */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-2">
//           <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl" />
//           <div className="p-5 md:p-6">
//             <SectionHead
//               icon={FileText}
//               title="1. Campaign Identity"
//               subtitle="Name your workspace and define the brand context."
//               accentColor="bg-indigo-500"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
//               <Field
//                 label="Workspace Name" required icon={LayoutTemplate}
//                 placeholder="e.g., Q3 Enterprise Software Push"
//                 value={form.name} onChange={(v) => setForm({ ...form, name: v })}
//                 focusRing="focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
//                 className="md:col-span-2"
//               />
//               <Field
//                 label="Brand / Company Name" icon={Building2}
//                 placeholder="Your Company Name"
//                 value={form.brand_name} onChange={(v) => setForm({ ...form, brand_name: v })}
//                 focusRing="focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
//               />
//               <Field
//                 label="Content Theme" icon={Orbit}
//                 placeholder="e.g., Summer Offer, Feature Launch"
//                 value={form.content_theme} onChange={(v) => setForm({ ...form, content_theme: v })}
//                 focusRing="focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ══ CARD 2: Audience & Delivery ══ */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-2">
//           <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-2xl" />
//           <div className="p-5 md:p-6">
//             <SectionHead
//               icon={Target}
//               title="2. Audience & Delivery"
//               subtitle="Choose your channel and define who you're reaching."
//               accentColor="bg-emerald-500"
//             />

//             {/* Channel selector */}
//             <div className="mt-5 mb-4">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Delivery Channel</label>
//               <div className="grid grid-cols-3 gap-3">
//                 {channels.map((ch) => {
//                   const active = form.selected_channel === ch.id;
//                   return (
//                     <button
//                       key={ch.id}
//                       type="button"
//                       onClick={() => setForm({ ...form, selected_channel: ch.id })}
//                       className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2
//                         transition-all duration-200 overflow-hidden
//                         ${active
//                           ? `${ch.activeBorder} ${ch.activeRing} ${ch.activeBg}`
//                           : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
//                         }`}
//                     >
//                       {/* active top micro-bar */}
//                       {active && (
//                         <div className={`absolute top-0 left-0 right-0 h-0.5 ${ch.activeBar}`} />
//                       )}
//                       <div className={`p-2.5 rounded-xl mb-2 ${ch.bg} ${ch.color}`}>{ch.icon}</div>
//                       <span className={`text-xs font-black ${active ? 'text-slate-800' : 'text-slate-400'}`}>
//                         {ch.name}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <SelectField
//                 label="Target Vertical" icon={Briefcase}
//                 value={form.selected_vertical} onChange={(v) => setForm({ ...form, selected_vertical: v })}
//                 options={verticals} placeholder="Select Industry Vertical"
//                 focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
//               />
//               <SelectField
//                 label="Target Region" icon={MapPin}
//                 value={form.selected_region} onChange={(v) => setForm({ ...form, selected_region: v })}
//                 options={regions} placeholder="Select Region"
//                 focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Detailed Audience Description</label>
//               <textarea
//                 className="w-full px-4 py-3.5 min-h-[90px] bg-slate-50 border border-slate-200 rounded-xl text-sm
//                   font-medium text-slate-700 placeholder:text-slate-300 resize-none
//                   focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none transition-all"
//                 placeholder="e.g., IT Directors and CTOs in mid-sized logistics companies facing high operational costs."
//                 value={form.target_description}
//                 onChange={(e) => setForm({ ...form, target_description: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ══ CARD 3: AI Instructions / Manual Compose ══ */}
//         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-3">
//           <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r ${
//             mode === 'ai' ? 'from-blue-500 to-cyan-400' : 'from-violet-500 to-purple-400'
//           }`} />
//           <div className="p-5 md:p-6">
//             <SectionHead
//               icon={mode === 'ai' ? Bot : PencilLine}
//               title={mode === 'ai' ? '3. AI Instructions' : '3. Manual Content Composer'}
//               subtitle={mode === 'ai'
//                 ? 'Tell the AI exactly what to write and how to write it.'
//                 : 'Compose your campaign content manually with a live preview.'}
//               accentColor={mode === 'ai' ? 'bg-blue-500' : 'bg-violet-500'}
//               required
//             />

//             {mode === 'ai' ? (
//               <div className="mt-5 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest">What should the AI write about?</label>
//                   <span className="text-xs text-slate-400 font-medium">
//                     {form.prompt.trim().split(/\s+/).filter(Boolean).length} words
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <PenSquare className="absolute left-4 top-3.5 text-slate-400" size={15} />
//                   <textarea
//                     className="w-full pl-11 pr-4 py-3.5 min-h-[140px] bg-slate-50 border border-slate-200 rounded-xl
//                       text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-y
//                       focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
//                     placeholder="Give clear instructions. Example: Write an urgent 60-word message emphasizing ROI and requesting a 15-minute demo call."
//                     value={form.prompt}
//                     onChange={(e) => setForm({ ...form, prompt: e.target.value })}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
//                 {/* left col — inputs */}
//                 <div className="space-y-4">
//                   <Field
//                     label="Subject Line" icon={Mail}
//                     placeholder="e.g., Cut Operating Cost by 30% This Quarter"
//                     value={form.manual_subject} onChange={(v) => setForm({ ...form, manual_subject: v })}
//                     focusRing="focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400"
//                   />
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//                         Message Content <span className="text-rose-400 normal-case font-black">*</span>
//                       </label>
//                       <span className="text-xs text-slate-400 font-medium">
//                         {form.manual_content.trim().split(/\s+/).filter(Boolean).length} words
//                       </span>
//                     </div>
//                     <textarea
//                       className="w-full px-4 py-3.5 min-h-[130px] bg-slate-50 border border-slate-200 rounded-xl text-sm
//                         font-medium text-slate-700 placeholder:text-slate-300 resize-y
//                         focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 outline-none transition-all"
//                       placeholder="Write your campaign message manually..."
//                       value={form.manual_content}
//                       onChange={(e) => setForm({ ...form, manual_content: e.target.value })}
//                     />
//                   </div>
//                   <Field
//                     label="Call To Action" icon={Target}
//                     placeholder="e.g., Reply YES for a 15-min strategy call"
//                     value={form.manual_cta} onChange={(v) => setForm({ ...form, manual_cta: v })}
//                     focusRing="focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400"
//                   />
//                   <Field
//                     label="Audience Hint" icon={Briefcase}
//                     placeholder="e.g., CTOs in logistics with legacy ERP"
//                     value={form.manual_audience_hint} onChange={(v) => setForm({ ...form, manual_audience_hint: v })}
//                     focusRing="focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400"
//                   />
//                 </div>

//                 {/* right col — live preview */}
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
//                   {/* preview header */}
//                   <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
//                   <div className="flex items-start gap-2.5 px-4 pt-4 pb-3 border-b border-slate-200">
//                     <div className="w-1 self-stretch rounded-full bg-violet-500 shrink-0" />
//                     <div>
//                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Live Preview</p>
//                       <p className="text-[11px] text-slate-400 mt-0.5">Updates as you type</p>
//                     </div>
//                   </div>
//                   <div className="p-4 flex-1">
//                     <h4 className="text-sm font-black text-slate-800 leading-snug">
//                       {form.manual_subject || <span className="text-slate-300 font-medium">Your subject will appear here</span>}
//                     </h4>
//                     <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap leading-relaxed">
//                       {form.manual_content || <span className="text-slate-300">Your manual content preview will appear here.</span>}
//                     </p>
//                     {form.manual_cta && (
//                       <div className="mt-4 pt-3 border-t border-slate-200">
//                         <span className="text-xs font-black text-violet-600 uppercase tracking-widest">CTA</span>
//                         <p className="text-sm font-semibold text-violet-700 mt-0.5">{form.manual_cta}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ FOOTER ACTIONS — matches BDMTargetCreate ══ */}
//         <div className="flex items-center justify-end gap-3 pt-1 pb-4 anim-fade-4">
//           <button
//             type="button"
//             onClick={() => navigate('/campaign-workspace')}
//             className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-500
//               bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>

//           {mode === 'ai' ? (
//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="px-7 py-3 text-white rounded-xl text-sm font-black
//                 flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
//               style={{
//                 background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//                 boxShadow:  '0 4px 18px rgba(79,70,229,0.40)',
//               }}
//             >
//               {isGenerating
//                 ? <><Loader2 className="animate-spin" size={16} /> Generating…</>
//                 : <><Wand2 size={16} /> Generate Campaign Draft</>}
//             </button>
//           ) : (
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => handleManualCreate('draft')}
//                 disabled={isGenerating}
//                 className="px-5 py-3 rounded-xl text-sm font-black flex items-center gap-1.5
//                   text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition-all disabled:opacity-60"
//               >
//                 <Save size={15} /> Save Draft
//               </button>
//               <button
//                 onClick={() => handleManualCreate('ready')}
//                 disabled={isGenerating}
//                 className="px-7 py-3 text-white rounded-xl text-sm font-black
//                   flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
//                 style={{
//                   background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//                   boxShadow:  '0 4px 18px rgba(79,70,229,0.40)',
//                 }}
//               >
//                 {isGenerating
//                   ? <><Loader2 className="animate-spin" size={16} /> Saving…</>
//                   : <><Rocket size={15} /> Publish Workspace</>}
//               </button>
//             </div>
//           )}
//         </div>

//       </div>{/* end scrollable body */}

//       {/* ══ GENERATING OVERLAY ══ */}
//       {isGenerating && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
//           <div
//             className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-xs w-full mx-4"
//             style={{ animation: 'fadeUp .28s ease-out' }}
//           >
//             <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
//             <div className="p-8 flex flex-col items-center">
//               <div className="relative w-16 h-16 mb-5">
//                 <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
//                 <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Wand2 size={22} className="text-indigo-500 animate-pulse" />
//                 </div>
//               </div>
//               <h3 className="text-[14px] font-black text-slate-800 mb-1.5">AI is working…</h3>
//               <p className="text-center text-slate-400 text-xs leading-relaxed font-medium">
//                 Analyzing audience, blending parameters, and drafting your campaign message.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CampaignWorkspaceCreate;


import React, { useEffect, useState } from 'react';
import {
  Wand2, ArrowLeft, Sparkles, MessageCircle, Mail, Linkedin,
  Building2, LayoutTemplate, Target, Briefcase, MapPin, Bot,
  Loader2, FileText, PenSquare, Orbit, PencilLine, Save, Rocket,
  ChevronDown, Globe, Users, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

interface DropdownItem { id: number; name: string; }

const labelCls = 'block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1';
const inputCls =
  'w-full px-3 py-2 text-[13px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all duration-200';
const selectCls =
  'w-full px-3 py-2 text-[13px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl ' +
  'appearance-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all duration-200 pr-8';

const SectionHead = ({
  icon: Icon, title, subtitle,
  iconBg = 'linear-gradient(135deg,#4f46e5,#7c3aed)',
  iconGlow = 'rgba(79,70,229,0.3)',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string; subtitle: string;
  iconBg?: string; iconGlow?: string;
}) => (
  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: iconBg, boxShadow: `0 4px 12px ${iconGlow}` }}>
      <Icon size={14} className="text-white" />
    </div>
    <div>
      <h3 className="text-[14px] font-black text-slate-800 leading-tight">{title}</h3>
      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{subtitle}</p>
    </div>
  </div>
);

const SectionCard = ({
  children,
  topGradient = 'from-indigo-500 to-violet-500',
  borderColor = '#e0e7ff',
  className = '',
}: {
  children: React.ReactNode;
  topGradient?: string;
  borderColor?: string;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl section-card-hover h-full ${className}`}
    style={{ border: `1.5px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(15,23,42,0.06)' }}
  >
    <div className={`h-[3px] w-full bg-gradient-to-r ${topGradient} rounded-t-2xl`} />
    <div className="p-4 h-full">{children}</div>
  </div>
);

const SelectField = ({
  focusColor = 'indigo',
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { focusColor?: string }) => (
  <div className="relative">
    <select className={`${selectCls} ${className}`} {...props} />
    <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

export const CampaignWorkspaceCreate = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [verticals, setVerticals] = useState<DropdownItem[]>([]);
  const [regions, setRegions] = useState<DropdownItem[]>([]);

  const [form, setForm] = useState({
    name: '', brand_name: '', content_theme: '', target_description: '',
    selected_channel: 'whatsapp', selected_vertical: '', selected_region: '',
    prompt: '', manual_subject: '', manual_content: '', manual_cta: '', manual_audience_hint: '',
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [vertRes, regRes] = await Promise.all([
          fetch(`${API_BASE}/verticals/`),
          fetch(`${API_BASE}/regions/`),
        ]);
        setVerticals(await vertRes.json());
        setRegions(await regRes.json());
      } catch (err) { console.error('Failed to load dropdown data', err); }
    };
    fetchDropdowns();
  }, []);

  const handleGenerate = async () => {
    if (!form.name) return alert('Workspace Name is required!');
    if (!form.prompt) return alert('AI Prompt is required!');
    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: form.name, brand_name: form.brand_name, content_theme: form.content_theme,
        target_description: form.target_description, selected_channel: form.selected_channel, prompt: form.prompt,
      };
      if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
      if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);
      const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Validation Error: ${JSON.stringify(errorData)}`);
        setIsGenerating(false); return;
      }
      navigate('/campaign-workspace');
    } catch (err) { alert('Failed to connect to the server'); }
    finally { setIsGenerating(false); }
  };

  const handleManualCreate = async (status: 'draft' | 'ready') => {
    if (!form.name) return alert('Workspace Name is required!');
    if (!form.manual_content) return alert('Manual Content is required!');
    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: form.name, brand_name: form.brand_name, content_theme: form.content_theme,
        target_description: form.target_description || form.manual_audience_hint,
        selected_channel: form.selected_channel, generated_subject: form.manual_subject,
        generated_content: [form.manual_content, form.manual_cta ? `CTA: ${form.manual_cta}` : ''].filter(Boolean).join('\n\n'),
        status,
      };
      if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
      if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);
      const response = await fetch(`${API_BASE}/campaign-workspace/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Validation Error: ${JSON.stringify(errorData)}`);
        setIsGenerating(false); return;
      }
      navigate('/campaign-workspace');
    } catch (err) { alert('Failed to connect to the server'); }
    finally { setIsGenerating(false); }
  };

  const channels = [
    {
      id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle size={16} />,
      color: 'text-emerald-600', bg: 'bg-emerald-50',
      activeBar: 'from-emerald-500 to-green-400',
      activeBorder: '#6ee7b7', activeBg: '#ecfdf5',
      glow: 'rgba(16,185,129,0.25)',
    },
    {
      id: 'email', name: 'Email', icon: <Mail size={16} />,
      color: 'text-blue-600', bg: 'bg-blue-50',
      activeBar: 'from-blue-500 to-cyan-400',
      activeBorder: '#93c5fd', activeBg: '#eff6ff',
      glow: 'rgba(59,130,246,0.25)',
    },
    {
      id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={16} />,
      color: 'text-sky-600', bg: 'bg-sky-50',
      activeBar: 'from-sky-500 to-blue-500',
      activeBorder: '#7dd3fc', activeBg: '#f0f9ff',
      glow: 'rgba(14,165,233,0.25)',
    },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}
    >
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
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .12s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .20s }
        .f4 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .28s }

        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }
        .modal-anim  { animation:modalIn .28s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .overlay-anim { animation:overlayIn .2s ease forwards; }

        .section-card-hover { transition: all 0.25s cubic-bezier(0.34,1.1,0.64,1); }
        .section-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(79,70,229,0.10), 0 2px 8px rgba(0,0,0,0.04);
        }

        .btn-cta {
          transition: all 0.22s cubic-bezier(0.34,1.2,0.64,1);
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          box-shadow: 0 4px 16px rgba(79,70,229,0.38);
        }
        .btn-cta:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(79,70,229,0.52);
          background: linear-gradient(135deg,#4338ca,#6d28d9);
        }
        .btn-cta:active:not(:disabled) { transform: scale(0.97); }

        .btn-cancel { transition: all 0.2s ease; }
        .btn-cancel:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          background: #f8fafc;
        }

        .btn-draft { transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1); }
        .btn-draft:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(79,70,229,0.2);
          background: #eef2ff;
        }

        .channel-card { transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1); }
        .channel-card:hover { transform: translateY(-2px); }
        .channel-card:active { transform: scale(0.96); }

        .mode-toggle-btn { transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1); }
        .mode-toggle-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay: '3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 px-4 pt-4 f1">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
            boxShadow: '0 12px 40px -4px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <div className="shimmer-overlay" />
          <div
            className="px-6 py-4 flex items-center gap-4 flex-wrap relative z-10"
            style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}
          >
            {/* Back button */}
            <button
              onClick={() => navigate('/campaign-workspace')}
              className="flex items-center gap-1.5 text-indigo-200 hover:text-white text-[12px] font-black
                bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all duration-200 shrink-0"
            >
              <ArrowLeft size={13} /> Back
            </button>

            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Sparkles className="text-white" size={19} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-black text-white leading-tight tracking-tight">Campaign Creation</h1>
              <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
                Define parameters and let AI craft high-converting outreach.
              </p>
            </div>

            {/* Mode toggle */}
            <div
              className="hidden sm:flex items-center gap-1 shrink-0 mr-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '12px',
                padding: '4px',
              }}
            >
              <button
                onClick={() => setMode('ai')}
                className={`mode-toggle-btn px-3.5 py-2 rounded-lg text-[11px] font-black flex items-center gap-1.5 ${
                  mode === 'ai'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wand2 size={11} /> AI Generate
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`mode-toggle-btn px-3.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 ${
                  mode === 'manual'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <PencilLine size={11} /> Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ SCROLLABLE BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* Mobile mode toggle */}
        <div
          className="sm:hidden flex bg-white rounded-2xl p-1 gap-1 mb-3 f2"
          style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 4px 16px rgba(79,70,229,0.07)' }}
        >
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
              mode === 'ai' ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
            style={mode === 'ai' ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : {}}
          >
            <Wand2 size={11} /> AI Generate
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
              mode === 'manual' ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
            style={mode === 'manual' ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : {}}
          >
            <PencilLine size={11} /> Manual
          </button>
        </div>

        {/* ═══════ LAYOUT ═══════ */}
        <div className="space-y-3">

          {/* ── ROW 1: Card 1 + Card 2 side by side ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 f2 items-stretch">

            {/* CARD 1: Campaign Identity */}
<SectionCard topGradient="from-indigo-500 to-violet-500" borderColor="#e0e7ff">
  <SectionHead
    icon={FileText}
    title="1. Campaign Identity"
    subtitle="Name your workspace and define brand context."
    iconBg="linear-gradient(135deg,#4f46e5,#7c3aed)"
    iconGlow="rgba(79,70,229,0.3)"
  />

  <div className="space-y-4 mt-3">

    {/* Workspace Name */}
    <div className="space-y-1">
      <label className={labelCls}>
        Workspace Name <span className="text-rose-400">*</span>
      </label>

      <div className="relative">
        <LayoutTemplate
          size={12}
          className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"
        />

        <input
          className={inputCls + ' pl-8'}
          placeholder="e.g., Q3 Enterprise Software Push"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>
    </div>

    {/* Brand / Company */}
    <div className="space-y-1">
      <label className={labelCls}>Brand / Company</label>

      <div className="relative">
        <Building2
          size={12}
          className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"
        />

        <input
          className={inputCls + ' pl-8'}
          placeholder="Your Company"
          value={form.brand_name}
          onChange={e => setForm({ ...form, brand_name: e.target.value })}
        />
      </div>
    </div>

    {/* Content Theme */}
    <div className="space-y-1">
      <label className={labelCls}>Content Theme</label>

      <div className="relative">
        <Orbit
          size={12}
          className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"
        />

        <input
          className={inputCls + ' pl-8'}
          placeholder="e.g., Feature Launch"
          value={form.content_theme}
          onChange={e => setForm({ ...form, content_theme: e.target.value })}
        />
      </div>
    </div>

  </div>
</SectionCard>

            {/* CARD 2: Audience & Delivery */}
            <SectionCard topGradient="from-emerald-500 to-teal-400" borderColor="#d1fae5">
              <SectionHead
                icon={Target}
                title="2. Audience & Delivery"
                subtitle="Choose your channel and define who you're reaching."
                iconBg="linear-gradient(135deg,#10b981,#0d9488)"
                iconGlow="rgba(16,185,129,0.3)"
              />

              {/* Channel selector */}
              <div className="mt-3 mb-3">
                <label className={labelCls + ' mb-2'}>Delivery Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {channels.map(ch => {
                    const active = form.selected_channel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setForm({ ...form, selected_channel: ch.id })}
                        className="channel-card relative flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 overflow-hidden"
                        style={
                          active
                            ? { borderColor: ch.activeBorder, background: ch.activeBg, boxShadow: `0 4px 14px ${ch.glow}` }
                            : { borderColor: '#e2e8f0', background: '#ffffff' }
                        }
                      >
                        {active && (
                          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${ch.activeBar}`} />
                        )}
                        <div className={`p-1.5 rounded-lg shrink-0 ${ch.bg} ${ch.color}`}>{ch.icon}</div>
                        <span className={`text-[12px] font-black ${active ? 'text-slate-800' : 'text-slate-400'}`}>
                          {ch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical + Region + Audience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelCls + ' flex items-center gap-1'}>
                    <Briefcase size={9} /> Vertical
                  </label>
                  <SelectField
                    value={form.selected_vertical}
                    onChange={e => setForm({ ...form, selected_vertical: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </SelectField>
                </div>
                <div className="space-y-1">
                  <label className={labelCls + ' flex items-center gap-1'}>
                    <MapPin size={9} /> Region
                  </label>
                  <SelectField
                    value={form.selected_region}
                    onChange={e => setForm({ ...form, selected_region: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </SelectField>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className={labelCls + ' flex items-center gap-1'}>
                    <Users size={9} /> Audience Description
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g., IT Directors in mid-sized logistics companies"
                    value={form.target_description}
                    onChange={e => setForm({ ...form, target_description: e.target.value })}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── ROW 2: Card 3 full width ── */}
          <div className="f3">
            <SectionCard
              topGradient={mode === 'ai' ? 'from-blue-500 to-cyan-400' : 'from-violet-500 to-purple-400'}
              borderColor={mode === 'ai' ? '#dbeafe' : '#ede9fe'}
            >
              <SectionHead
                icon={mode === 'ai' ? Bot : PencilLine}
                title={mode === 'ai' ? '3. AI Instructions' : '3. Manual Content Composer'}
                subtitle={
                  mode === 'ai'
                    ? 'Tell the AI exactly what to write and how to write it.'
                    : 'Compose your campaign content manually with a live preview.'
                }
                iconBg={mode === 'ai' ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'linear-gradient(135deg,#7c3aed,#9333ea)'}
                iconGlow={mode === 'ai' ? 'rgba(59,130,246,0.3)' : 'rgba(124,58,237,0.3)'}
              />

              {mode === 'ai' ? (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>
                      What should the AI write about? <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {form.prompt.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <div className="relative">
                    <PenSquare size={12} className="absolute left-3 top-2.5 text-slate-400" />
                    <textarea
                      className={inputCls + ' pl-8 resize-none'}
                      rows={4}
                      placeholder="Give clear instructions. Example: Write an urgent 60-word message emphasizing ROI and requesting a 15-minute demo call."
                      value={form.prompt}
                      onChange={e => setForm({ ...form, prompt: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                /* Manual mode — 2-col grid */
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* Left: inputs */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className={labelCls}>Subject Line</label>
                        <div className="relative">
                          <Mail size={11} className="absolute left-3 top-2.5 text-slate-400" />
                          <input
                            className={inputCls + ' pl-8'}
                            placeholder="e.g., Cut Costs by 30%"
                            value={form.manual_subject}
                            onChange={e => setForm({ ...form, manual_subject: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Call To Action</label>
                        <div className="relative">
                          <Target size={11} className="absolute left-3 top-2.5 text-slate-400" />
                          <input
                            className={inputCls + ' pl-8'}
                            placeholder="Reply YES for demo"
                            value={form.manual_cta}
                            onChange={e => setForm({ ...form, manual_cta: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className={labelCls}>
                          Message Content <span className="text-rose-400">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {form.manual_content.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        className={inputCls + ' resize-none'}
                        rows={4}
                        placeholder="Write your campaign message manually..."
                        value={form.manual_content}
                        onChange={e => setForm({ ...form, manual_content: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelCls}>Audience Hint</label>
                      <div className="relative">
                        <Briefcase size={11} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          className={inputCls + ' pl-8'}
                          placeholder="e.g., CTOs in logistics with legacy ERP"
                          value={form.manual_audience_hint}
                          onChange={e => setForm({ ...form, manual_audience_hint: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: live preview */}
                  <div
                    className="rounded-xl overflow-hidden flex flex-col"
                    style={{ border: '1.5px solid #ede9fe', background: '#faf5ff' }}
                  >
                    <div className="h-[3px] w-full bg-gradient-to-r from-violet-500 to-purple-400" />
                    <div
                      className="px-3 pt-3 pb-2 flex items-center gap-2"
                      style={{ borderBottom: '1px solid #ede9fe' }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)' }}
                      >
                        <Sparkles size={11} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-violet-700 uppercase tracking-wider">Live Preview</p>
                        <p className="text-[9px] text-slate-400">Updates as you type</p>
                      </div>
                    </div>
                    <div className="p-3 flex-1 overflow-auto">
                      <h4 className="text-[13px] font-black text-slate-800 leading-snug">
                        {form.manual_subject || (
                          <span className="text-slate-300 font-medium text-[12px]">Subject appears here</span>
                        )}
                      </h4>
                      <p className="text-[12px] text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">
                        {form.manual_content || (
                          <span className="text-slate-300">Content preview appears here…</span>
                        )}
                      </p>
                      {form.manual_cta && (
                        <div className="mt-3 pt-2.5" style={{ borderTop: '1px solid #ede9fe' }}>
                          <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">CTA</span>
                          <p className="text-[12px] font-bold text-violet-700 mt-0.5">{form.manual_cta}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="flex items-center justify-center gap-4 pt-1 pb-4 f4">
            <button
              type="button"
              onClick={() => navigate('/campaign-workspace')}
              className="btn-cancel px-8 py-3 rounded-xl text-[15px] font-black text-slate-600
                bg-white border-2 border-slate-200 min-w-[120px]"
            >
              Cancel
            </button>

            {mode === 'ai' ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-cta px-8 py-3 text-white rounded-xl text-[15px] font-black
                  flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[180px] justify-center"
              >
                {isGenerating
                  ? <><Loader2 className="animate-spin" size={15} /> Generating…</>
                  : <><Wand2 size={15} /> Generate Campaign</>}
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleManualCreate('draft')}
                  disabled={isGenerating}
                  className="btn-draft px-5 py-3 rounded-xl text-[13px] font-black flex items-center gap-1.5
                    text-indigo-700 bg-white border-2 border-indigo-200 disabled:opacity-60 min-w-[120px] justify-center"
                >
                  <Save size={14} /> Save Draft
                </button>
                <button
                  onClick={() => handleManualCreate('ready')}
                  disabled={isGenerating}
                  className="btn-cta px-7 py-3 text-white rounded-xl text-[13px] font-black
                    flex items-center gap-2 disabled:opacity-60 min-w-[160px] justify-center"
                >
                  {isGenerating
                    ? <><Loader2 className="animate-spin" size={15} /> Saving…</>
                    : <><Rocket size={14} /> Publish Workspace</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ GENERATING OVERLAY ══ */}
      {isGenerating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overlay-anim"
          style={{ backgroundColor: 'rgba(10,8,30,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-xs mx-4 modal-anim"
            style={{
              boxShadow: '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.14)',
              border: '1.5px solid rgba(99,102,241,0.2)',
            }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <div className="p-8 flex flex-col items-center">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 size={20} className="text-indigo-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-[15px] font-black text-slate-800 mb-1.5">AI is working…</h3>
              <p className="text-center text-slate-400 text-[12px] leading-relaxed font-medium">
                Analyzing audience, blending parameters, and drafting your campaign message.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignWorkspaceCreate;