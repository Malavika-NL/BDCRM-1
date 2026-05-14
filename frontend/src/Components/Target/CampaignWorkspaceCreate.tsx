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


import React, { useEffect, useState } from 'react';
import {
  Wand2,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Mail,
  Linkedin,
  Building2,
  LayoutTemplate,
  Target,
  Briefcase,
  MapPin,
  Bot,
  Loader2,
  FileText,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

interface DropdownItem {
  id: number;
  name: string;
}

export const CampaignWorkspaceCreate = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const [verticals, setVerticals] = useState<DropdownItem[]>([]);
  const [regions, setRegions] = useState<DropdownItem[]>([]);

  const [form, setForm] = useState({
    name: '',
    brand_name: '',
    content_theme: '',
    target_description: '',
    selected_channel: 'whatsapp',
    selected_vertical: '',
    selected_region: '',
    prompt: ''
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [vertRes, regRes] = await Promise.all([
          fetch(`${API_BASE}/verticals/`),
          fetch(`${API_BASE}/regions/`)
        ]);
        setVerticals(await vertRes.json());
        setRegions(await regRes.json());
      } catch (err) {
        console.error('Failed to load dropdown data', err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleGenerate = async () => {
    if (!form.name) return alert('Workspace Name is required!');
    if (!form.prompt) return alert('AI Prompt is required!');

    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        brand_name: form.brand_name,
        content_theme: form.content_theme,
        target_description: form.target_description,
        selected_channel: form.selected_channel,
        prompt: form.prompt
      };

      if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical);
      if (form.selected_region) payload.selected_region = parseInt(form.selected_region);

      const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Django Validation Error:', errorData);
        alert(`Validation Error: ${JSON.stringify(errorData)}`);
        setIsGenerating(false);
        return;
      }

      navigate('/campaign-workspace');
    } catch (err) {
      console.error('Network Error:', err);
      alert('Failed to connect to the server');
    } finally {
      setIsGenerating(false);
    }
  };

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle size={16} />,
      activeClass: 'border-green-500 bg-green-50 text-green-700',
      dotColor: 'bg-green-500'
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail size={16} />,
      activeClass: 'border-blue-500 bg-blue-50 text-blue-700',
      dotColor: 'bg-blue-500'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin size={16} />,
      activeClass: 'border-sky-500 bg-sky-50 text-sky-700',
      dotColor: 'bg-sky-500'
    }
  ];

  /* ─── shared input / label classes ─── */
  const labelCls = 'block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1';
  const inputCls =
    'w-full px-3 py-2 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 transition-all';
  const selectCls =
    'w-full px-3 py-2 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-md appearance-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 transition-all';

  /* ─── section header ─── */
  const SectionHeader = ({
    icon,
    label,
    color = 'text-indigo-600'
  }: {
    icon: React.ReactNode;
    label: string;
    color?: string;
  }) => (
    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
      <span className={color}>{icon}</span>
      <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#f4f6fb]">

      {/* ── Page Banner (matches Account Workspace style) ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white" size={16} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-white leading-tight">AI Campaign Studio</h1>
          <p className="text-[12px] text-indigo-200 mt-0.5">Define parameters and let AI craft the perfect outreach</p>
        </div>
        <button
          onClick={() => navigate('/campaign-workspace')}
          className="ml-auto flex items-center gap-1.5 text-[12px] font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </button>
      </div>

      {/* ── Form Body ── */}
      <div className="p-6 space-y-4">

        {/* SECTION 1: Campaign Identity */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <SectionHeader icon={<FileText size={14} />} label="1. Campaign Identity" />

          <div className="grid grid-cols-12 gap-4">
            {/* Workspace Name — full width */}
            <div className="col-span-12">
              <label className={labelCls}>
                Workspace Name <span className="text-red-500 normal-case">*</span>
              </label>
              <div className="relative">
                <LayoutTemplate
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  className={inputCls + ' pl-8'}
                  placeholder="e.g., Q3 Enterprise Software Push"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Brand Name */}
            <div className="col-span-6">
              <label className={labelCls}>Brand / Company Name</label>
              <div className="relative">
                <Building2
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  className={inputCls + ' pl-8'}
                  placeholder="Your Company Name"
                  value={form.brand_name}
                  onChange={e => setForm({ ...form, brand_name: e.target.value })}
                />
              </div>
            </div>

            {/* Content Theme */}
            <div className="col-span-6">
              <label className={labelCls}>Content Theme</label>
              <div className="relative">
                <Sparkles
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  className={inputCls + ' pl-8'}
                  placeholder="e.g., Summer Discount, Feature Launch"
                  value={form.content_theme}
                  onChange={e => setForm({ ...form, content_theme: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Audience & Delivery */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <SectionHeader
            icon={<Target size={14} />}
            label="2. Audience & Delivery"
            color="text-blue-600"
          />

          {/* Channel Selector */}
          <div className="mb-5">
            <label className={labelCls}>Delivery Channel</label>
            <div className="flex gap-2 mt-1">
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setForm({ ...form, selected_channel: ch.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border text-[12px] font-semibold transition-all ${
                    form.selected_channel === ch.id
                      ? ch.activeClass + ' border-2'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {ch.icon}
                  {ch.name}
                  {form.selected_channel === ch.id && (
                    <span className={`w-1.5 h-1.5 rounded-full ${ch.dotColor}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Target Vertical */}
            <div className="col-span-4">
              <label className={labelCls}>Target Vertical</label>
              <div className="relative">
                <Briefcase
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                />
                <select
                  className={selectCls + ' pl-8 pr-8'}
                  value={form.selected_vertical}
                  onChange={e => setForm({ ...form, selected_vertical: e.target.value })}
                >
                  <option value="">Select Vertical</option>
                  {verticals.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Target Region */}
            <div className="col-span-4">
              <label className={labelCls}>Target Region</label>
              <div className="relative">
                <MapPin
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                />
                <select
                  className={selectCls + ' pl-8 pr-8'}
                  value={form.selected_region}
                  onChange={e => setForm({ ...form, selected_region: e.target.value })}
                >
                  <option value="">Select Region</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Audience Description */}
            <div className="col-span-12">
              <label className={labelCls}>Audience Description</label>
              <textarea
                className={inputCls + ' min-h-[80px] resize-y'}
                placeholder="e.g., IT Directors and CTOs in mid-sized logistics companies facing high operational costs..."
                value={form.target_description}
                onChange={e => setForm({ ...form, target_description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: AI Instructions */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <SectionHeader
            icon={<Bot size={14} />}
            label="3. AI Instructions"
            color="text-violet-600"
          />

          <label className={labelCls}>
            What should the AI write about? <span className="text-red-500 normal-case">*</span>
          </label>
          <textarea
            className={inputCls + ' min-h-[100px] resize-y'}
            placeholder="Give instructions to the AI. e.g., Write a highly urgent, exciting message. Keep it under 50 words. Focus on the ROI of our new automation feature..."
            value={form.prompt}
            onChange={e => setForm({ ...form, prompt: e.target.value })}
          />
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={() => navigate('/campaign-workspace')}
            className="px-4 py-2 text-[14px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-5 py-2 text-[14px] font-semibold rounded-md flex items-center gap-2 transition-all ${
              isGenerating
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/30'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={13} /> Generating...
              </>
            ) : (
              <>
                <Wand2 size={13} /> Generate Campaign Draft
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-xl max-w-xs w-full mx-4">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-[3px] border-indigo-100 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-indigo-500 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                <Wand2 size={22} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">AI is working…</h3>
            <p className="text-center text-slate-500 text-[12px]">
              Analyzing audience, synthesizing parameters, and drafting the perfect message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignWorkspaceCreate;