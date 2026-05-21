// import React, { useEffect, useState } from 'react';
// import { 
//   BookOpen, PlayCircle, FileText, CheckSquare, ArrowLeft, Target, 
//   Globe, GraduationCap, Sparkles, BrainCircuit, Wand2, Loader2
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { Course, Lesson, Module } from '../Utils/types';

// export const CourseWorkflows = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [activeCourse, setActiveCourse] = useState<Course | null>(null);
//   const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
//   const [loading, setLoading] = useState(true);
  
//   // AI Generator States
//   const [aiPrompt, setAiPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);

//   const fetchCourses = () => {
//     api.getCourses().then(data => { 
//       setCourses(data); 
//       setLoading(false); 
//     }).catch(console.error);
//   }

//   useEffect(() => { fetchCourses(); }, []);

//   const handleGeneratePlaybook = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!aiPrompt) return;
    
//     setIsGenerating(true);
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/courses/generate_ai/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: aiPrompt })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to generate playbook');
//       }
      
//       setAiPrompt('');
//       fetchCourses(); // Refresh the list
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error: ${error.message}\n\nCheck your Django Terminal for details.`);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const getIconForType = (type: string) => {
//     switch (type) {
//       case 'video': return <PlayCircle size={18} className="text-blue-500" />;
//       case 'task': return <CheckSquare size={18} className="text-emerald-500" />;
//       default: return <FileText size={18} className="text-amber-500" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//           <p className="text-slate-500 font-medium">Loading Playbook Library...</p>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // LIST VIEW: AI Generator & Playbook Grid
//   // ==========================================
//   if (!activeCourse) {
//     return (
//       <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
//         <header className="mb-8">
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//             <BrainCircuit size={32} className="text-indigo-600" /> AI Playbook Architect
//           </h2>
//           <p className="text-slate-500 mt-1 font-medium">Generate standard operating procedures and scripts instantly.</p>
//         </header>

//         {/* 🟢 AI Generator Hero Section 🟢 */}
//         <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[32px] shadow-2xl shadow-indigo-900/20 mb-10 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
//           <div className="relative z-10 max-w-3xl">
//             <div className="flex items-center gap-2 mb-4">
//               <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-400/20">
//                 <Sparkles size={12} /> Auto-Generator
//               </span>
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-6">What do you want your team to sell today?</h3>
            
//             <form onSubmit={handleGeneratePlaybook} className="flex flex-col sm:flex-row gap-4">
//               <input 
//                 type="text" 
//                 placeholder="e.g. 'A 3-step cold email sequence for selling SaaS to Real Estate agents'"
//                 className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all text-sm font-medium"
//                 value={aiPrompt}
//                 onChange={e => setAiPrompt(e.target.value)}
//                 disabled={isGenerating}
//                 required
//               />
//               <button 
//                 type="submit" 
//                 disabled={isGenerating}
//                 className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 min-w-[200px]"
//               >
//                 {isGenerating ? (
//                   <><Loader2 size={18} className="animate-spin" /> Architecting...</>
//                 ) : (
//                   <><Wand2 size={18} /> Build Playbook</>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* 🟢 Playbook Grid 🟢 */}
//         <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
//           <BookOpen size={20} className="text-slate-400"/> Your Playbook Library
//         </h3>

//         {courses.length === 0 ? (
//           <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-20 text-center">
//             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
//               <GraduationCap className="text-slate-300" size={40} />
//             </div>
//             <p className="text-lg font-bold text-slate-700">No playbooks yet</p>
//             <p className="text-sm text-slate-500 mt-1">Use the AI Architect above to generate your first strategy.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {courses.map(course => (
//               <div
//                 key={course.id}
//                 onClick={() => {
//                   setActiveCourse(course);
//                   if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
//                     setActiveLesson(course.modules[0].lessons[0]);
//                   }
//                 }}
//                 className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col"
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

//                 <div className="relative z-10 flex-1 flex flex-col">
//                   <div className="flex justify-between items-start mb-5">
//                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
//                       <BookOpen size={20} />
//                     </div>
//                     {course.target_vertical && (
//                       <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
//                         <Target size={10} /> {course.target_vertical}
//                       </span>
//                     )}
//                   </div>
                  
//                   <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition leading-tight">{course.title}</h3>
//                   <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed flex-1">{course.description}</p>

//                   <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
//                     <span className="text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
//                       {course.modules.length} Modules
//                     </span>
//                     <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
//                       Open <ArrowLeft size={14} className="rotate-180" />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ==========================================
//   // DETAIL VIEW: Reading the Playbook
//   // ==========================================
//   return (
//     <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
//       <header className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
//         <div className="flex items-center gap-4">
//           <button onClick={() => { setActiveCourse(null); setActiveLesson(null); }} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition shadow-sm">
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             <h2 className="text-xl font-bold text-slate-800">{activeCourse.title}</h2>
//             <p className="text-xs font-medium text-slate-500 mt-0.5">{activeCourse.description}</p>
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar Navigation for the Playbook */}
//         <aside className="w-80 bg-white border-r border-slate-200/60 overflow-y-auto shrink-0 custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
//           <div className="p-5">
//             {activeCourse.modules.map((module: Module) => (
//               <div key={module.id} className="mb-6">
//                 <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{module.title}</h3>
//                 <div className="space-y-1">
//                   {module.lessons.map((lesson: Lesson) => {
//                     const isActive = activeLesson?.id === lesson.id;
//                     return (
//                       <button
//                         key={lesson.id}
//                         onClick={() => setActiveLesson(lesson)}
//                         className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
//                           isActive
//                             ? 'bg-indigo-50 border border-indigo-100 shadow-sm'
//                             : 'hover:bg-slate-50 border border-transparent'
//                         }`}
//                       >
//                         <div className="mt-0.5">{getIconForType(lesson.lesson_type)}</div>
//                         <div>
//                           <p className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</p>
//                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-1">{lesson.lesson_type}</p>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </aside>

//         {/* Playbook Content Workspace */}
//         <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//           {activeLesson ? (
//             <div className="max-w-4xl mx-auto bg-white border border-slate-200/60 shadow-md rounded-[24px] overflow-hidden">
//               <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden flex justify-between items-end">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full" />
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-2 mb-3">
//                     {getIconForType(activeLesson.lesson_type)}
//                     <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{activeLesson.lesson_type}</span>
//                   </div>
//                   <h1 className="text-3xl font-black tracking-tight">{activeLesson.title}</h1>
//                 </div>
//               </div>

//               <div className="p-8">
//                 {activeLesson.video_url && (
//                   <div className="aspect-video bg-slate-900 rounded-2xl mb-8 overflow-hidden shadow-lg border border-slate-200">
//                     <iframe src={activeLesson.video_url} className="w-full h-full" title={activeLesson.title} allowFullScreen />
//                   </div>
//                 )}
                
//                 <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative group">
//                   <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={() => navigator.clipboard.writeText(activeLesson.content)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:text-indigo-600">
//                       Copy Script
//                     </button>
//                   </div>
//                   <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed text-[15px]">
//                     {activeLesson.content}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-slate-400">
//               <div className="text-center">
//                 <BookOpen className="mx-auto mb-4 opacity-30" size={48} />
//                 <p className="font-bold">Select a lesson to begin</p>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { 
  BookOpen, PlayCircle, FileText, CheckSquare, ArrowLeft, Target, 
  Globe, GraduationCap, Sparkles, BrainCircuit, Wand2, Loader2
} from 'lucide-react';
import { api } from '../Utils/api';
import type { Course, Lesson, Module } from '../Utils/types';

export const CourseWorkflows = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchCourses = () => {
    api.getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleGeneratePlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/courses/generate_ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate playbook');
      setAiPrompt('');
      fetchCourses();
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}\n\nCheck your Django Terminal for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video':  return <PlayCircle  size={18} className="text-blue-500" />;
      case 'task':   return <CheckSquare size={18} className="text-emerald-500" />;
      default:       return <FileText    size={18} className="text-amber-500" />;
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
            <Loader2 className="text-white animate-spin" size={28} />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-black text-slate-700">Loading Playbook Library</p>
            <p className="text-[13px] text-slate-400 font-medium mt-1">Fetching your strategies…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════ */
  if (!activeCourse) {
    return (
      <div className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            50%     { transform:translateY(-14px) translateX(8px); }
          }
          .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
          .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
          .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
          .shimmer-overlay {
            position:absolute; inset:0; pointer-events:none;
            background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
            background-size:200% 100%;
            animation:shimmer 4s ease-in-out infinite;
          }
          .blob { animation:floatBlob 8s ease-in-out infinite; }

          /* playbook card */
          .pb-card { transition:all .25s cubic-bezier(0.34,1.1,0.64,1); }
          .pb-card:hover { transform:translateY(-5px) scale(1.01); }

          /* generate btn */
          .btn-gen { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
          .btn-gen:hover  { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 28px rgba(79,70,229,0.5) !important; }
          .btn-gen:active { transform:scale(0.97); }

          /* input focus */
          .gen-input:focus {
            outline:none;
            border-color:rgba(99,102,241,0.6);
            box-shadow:0 0 0 4px rgba(99,102,241,0.15);
          }
        `}</style>

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-16 -left-20 w-80 h-80 rounded-full bg-blue-300/15 blur-3xl blob -z-10" />
        <div className="pointer-events-none fixed top-1/2 -right-24 w-96 h-96 rounded-full bg-violet-300/12 blur-3xl blob -z-10" style={{ animationDelay:'3s' }} />

        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* ── Page header ── */}
          <div className="f1">
            <div className="rounded-2xl overflow-hidden relative"
              style={{
                background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
                boxShadow:'0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
              }}>
              <div className="shimmer-overlay" />
              <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
                style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
                  <BrainCircuit className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">
                    AI Playbook Architect
                  </h1>
                  <p className="text-[13px] text-indigo-200 mt-1 font-medium">
                    Generate standard operating procedures and scripts instantly.
                  </p>
                </div>
              
              </div>
            </div>
          </div>

          {/* ── AI Generator card ── */}
          <div className="f2 rounded-2xl overflow-hidden relative"
            style={{
              background:'linear-gradient(125deg,#0f0c29 0%,#1e1b4b 30%,#1a1054 60%,#0d0d1a 100%)',
              boxShadow:'0 12px 40px -4px rgba(79,70,229,0.4),0 2px 8px rgba(0,0,0,0.2)',
              border:'1.5px solid rgba(99,102,241,0.25)',
            }}>
            {/* glow orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
              style={{ background:'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', filter:'blur(40px)' }} />
            <div className="absolute bottom-0 left-20 w-60 h-60 rounded-full pointer-events-none"
              style={{ background:'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', filter:'blur(40px)' }} />
            <div className="shimmer-overlay" />

            <div className="px-8 py-8 relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)' }}>
                  <Sparkles size={13} className="text-blue-300" />
                  <span className="text-[12px] font-black text-blue-300 uppercase tracking-wider">Auto-Generator</span>
                </div>
              </div>

              <h3 className="text-[22px] font-black text-white mb-6 leading-tight">
                What do you want your team to sell today?
              </h3>

              <form onSubmit={handleGeneratePlaybook} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="e.g. 'A 3-step cold email sequence for selling SaaS to Real Estate agents'"
                  className="gen-input flex-1 text-white placeholder:text-slate-400 px-5 py-4 rounded-xl text-[14px] font-medium transition-all duration-200"
                  style={{
                    background:'rgba(255,255,255,0.08)',
                    border:'1.5px solid rgba(255,255,255,0.18)',
                    backdropFilter:'blur(4px)',
                  }}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  disabled={isGenerating}
                  required
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-gen flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-[15px] font-black text-white disabled:opacity-60 shrink-0"
                  style={{
                    background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    boxShadow:'0 4px 20px rgba(79,70,229,0.5)',
                    minWidth:'200px',
                  }}>
                  {isGenerating
                    ? <><Loader2 size={18} className="animate-spin" /> Architecting…</>
                    : <><Wand2 size={18} /> Build Playbook</>}
                </button>
              </form>
            </div>
          </div>

          {/* ── Playbook Library ── */}
          <div className="f3">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow:'0 4px 14px rgba(245,158,11,0.35)' }}>
                <BookOpen size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-slate-800 leading-tight">Your Playbook Library</h2>
                <p className="text-[13px] text-slate-400 font-medium mt-0.5">
                  {courses.length} playbook{courses.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center"
                style={{ border:'1.5px solid #e2e8f0', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background:'linear-gradient(145deg,#f8fafc,#f1f5f9)', border:'1.5px dashed #e2e8f0' }}>
                  <GraduationCap className="text-slate-300" size={36} />
                </div>
                <p className="text-[17px] font-black text-slate-700">No playbooks yet</p>
                <p className="text-[13px] text-slate-400 mt-1.5 font-medium">
                  Use the AI Architect above to generate your first strategy.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course, i) => (
                  <div key={course.id}
                    onClick={() => {
                      setActiveCourse(course);
                      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                        setActiveLesson(course.modules[0].lessons[0]);
                      }
                    }}
                    className="pb-card bg-white rounded-2xl overflow-hidden cursor-pointer group"
                    style={{
                      border:'1.5px solid #e0e7ff',
                      boxShadow:'0 4px 20px rgba(79,70,229,0.06),0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                    {/* top accent */}
                    <div className="h-[3px] w-full"
                      style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                            boxShadow:'0 4px 14px rgba(79,70,229,0.35)',
                            transition:'transform .2s ease',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1) rotate(-3deg)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                          <BookOpen size={20} className="text-white" />
                        </div>
                        {course.target_vertical && (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg"
                            style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', color:'#6d28d9' }}>
                            <Target size={10} /> {course.target_vertical}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[16px] font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                        {course.title}
                      </h3>
                      <p className="text-[13px] text-slate-400 font-medium mb-5 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between pt-4"
                        style={{ borderTop:'1px solid #f1f5f9' }}>
                        <span className="text-[12px] font-bold px-3 py-1.5 rounded-lg"
                          style={{ background:'#f8fafc', border:'1px solid #e2e8f0', color:'#64748b' }}>
                          {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-[13px] font-black text-indigo-600 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-200">
                          Open <ArrowLeft size={14} className="rotate-180" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pb-6" />
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     DETAIL VIEW
  ══════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }
        .lesson-btn { transition:all .15s ease; }
        .lesson-btn:hover { transform:translateX(3px); }
        .copy-btn { transition:all .2s ease; }
        .copy-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .back-btn { transition:all .2s ease; }
        .back-btn:hover { transform:translateX(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.08); }
      `}</style>

      {/* ── Detail header ── */}
      <header className="shrink-0 bg-white px-6 py-4 flex items-center justify-between z-10"
        style={{ borderBottom:'1.5px solid #e0e7ff', boxShadow:'0 2px 12px rgba(79,70,229,0.07)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
            className="back-btn p-2.5 rounded-xl text-slate-600 bg-white"
            style={{ border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-[18px] font-black text-slate-800 leading-tight">{activeCourse.title}</h2>
            <p className="text-[12px] font-medium text-slate-400 mt-0.5">{activeCourse.description}</p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-black"
          style={{ background:'#eef2ff', border:'1px solid #c7d2fe', color:'#4f46e5' }}>
          <BookOpen size={13} /> {activeCourse.modules.length} Module{activeCourse.modules.length !== 1 ? 's' : ''}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-72 bg-white overflow-y-auto shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ borderRight:'1.5px solid #e0e7ff', boxShadow:'4px 0 20px rgba(79,70,229,0.05)' }}>
          <div className="p-5 space-y-6">
            {activeCourse.modules.map((module: Module) => (
              <div key={module.id}>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1 h-4 rounded-full" style={{ background:'linear-gradient(180deg,#4f46e5,#7c3aed)' }} />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{module.title}</h3>
                </div>
                <div className="space-y-1">
                  {module.lessons.map((lesson: Lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                        className="lesson-btn w-full text-left flex items-start gap-3 p-3 rounded-xl"
                        style={isActive
                          ? { background:'#eef2ff', border:'1.5px solid #c7d2fe', boxShadow:'0 2px 8px rgba(79,70,229,0.1)' }
                          : { background:'transparent', border:'1.5px solid transparent' }}>
                        <div className="mt-0.5 shrink-0">{getIconForType(lesson.lesson_type)}</div>
                        <div>
                          <p className={`text-[13px] font-black leading-snug ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            {lesson.lesson_type}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Content area ── */}
        <main className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden"
              style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 8px 32px rgba(79,70,229,0.1),0 2px 8px rgba(0,0,0,0.04)' }}>

              {/* lesson header */}
              <div className="px-8 py-8 relative overflow-hidden flex justify-between items-end"
                style={{ background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)' }}>
                <div className="shimmer-overlay" />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background:'radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)', filter:'blur(40px)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-3">
                    {getIconForType(activeLesson.lesson_type)}
                    <span className="text-[12px] font-black text-indigo-300 uppercase tracking-widest">
                      {activeLesson.lesson_type}
                    </span>
                  </div>
                  <h1 className="text-[28px] font-black text-white tracking-tight leading-tight">
                    {activeLesson.title}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                {activeLesson.video_url && (
                  <div className="aspect-video bg-slate-900 rounded-2xl mb-8 overflow-hidden"
                    style={{ border:'1.5px solid #e2e8f0', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
                    <iframe src={activeLesson.video_url} className="w-full h-full"
                      title={activeLesson.title} allowFullScreen />
                  </div>
                )}

                <div className="relative group rounded-2xl overflow-hidden"
                  style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                  {/* top accent */}
                  <div className="h-[3px] w-full"
                    style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />

                  <div className="absolute right-4 top-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigator.clipboard.writeText(activeLesson.content)}
                      className="copy-btn px-4 py-2 rounded-xl text-[12px] font-black text-indigo-700 bg-white"
                      style={{ border:'1.5px solid #c7d2fe', boxShadow:'0 2px 8px rgba(79,70,229,0.12)' }}>
                      Copy Script
                    </button>
                  </div>

                  <div className="p-6">
                    <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed text-[15px]">
                      {activeLesson.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background:'linear-gradient(145deg,#f8fafc,#f1f5f9)', border:'1.5px dashed #e2e8f0' }}>
                  <BookOpen className="text-slate-300" size={36} />
                </div>
                <p className="text-[16px] font-black text-slate-500">Select a lesson to begin</p>
                <p className="text-[13px] text-slate-400 font-medium">Choose any lesson from the sidebar</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};