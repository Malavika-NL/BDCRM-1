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
  
  // AI Generator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchCourses = () => {
    api.getCourses().then(data => { 
      setCourses(data); 
      setLoading(false); 
    }).catch(console.error);
  }

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate playbook');
      }
      
      setAiPrompt('');
      fetchCourses(); // Refresh the list
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}\n\nCheck your Django Terminal for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle size={18} className="text-blue-500" />;
      case 'task': return <CheckSquare size={18} className="text-emerald-500" />;
      default: return <FileText size={18} className="text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Playbook Library...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // LIST VIEW: AI Generator & Playbook Grid
  // ==========================================
  if (!activeCourse) {
    return (
      <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BrainCircuit size={32} className="text-indigo-600" /> AI Playbook Architect
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Generate standard operating procedures and scripts instantly.</p>
        </header>

        {/* 🟢 AI Generator Hero Section 🟢 */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[32px] shadow-2xl shadow-indigo-900/20 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-400/20">
                <Sparkles size={12} /> Auto-Generator
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">What do you want your team to sell today?</h3>
            
            <form onSubmit={handleGeneratePlaybook} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="e.g. 'A 3-step cold email sequence for selling SaaS to Real Estate agents'"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all text-sm font-medium"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                disabled={isGenerating}
                required
              />
              <button 
                type="submit" 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 min-w-[200px]"
              >
                {isGenerating ? (
                  <><Loader2 size={18} className="animate-spin" /> Architecting...</>
                ) : (
                  <><Wand2 size={18} /> Build Playbook</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 🟢 Playbook Grid 🟢 */}
        <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-slate-400"/> Your Playbook Library
        </h3>

        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
              <GraduationCap className="text-slate-300" size={40} />
            </div>
            <p className="text-lg font-bold text-slate-700">No playbooks yet</p>
            <p className="text-sm text-slate-500 mt-1">Use the AI Architect above to generate your first strategy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => {
                  setActiveCourse(course);
                  if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                    setActiveLesson(course.modules[0].lessons[0]);
                  }
                }}
                className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                      <BookOpen size={20} />
                    </div>
                    {course.target_vertical && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Target size={10} /> {course.target_vertical}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition leading-tight">{course.title}</h3>
                  <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed flex-1">{course.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      {course.modules.length} Modules
                    </span>
                    <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open <ArrowLeft size={14} className="rotate-180" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DETAIL VIEW: Reading the Playbook
  // ==========================================
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <header className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => { setActiveCourse(null); setActiveLesson(null); }} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{activeCourse.title}</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{activeCourse.description}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation for the Playbook */}
        <aside className="w-80 bg-white border-r border-slate-200/60 overflow-y-auto shrink-0 custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
          <div className="p-5">
            {activeCourse.modules.map((module: Module) => (
              <div key={module.id} className="mb-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{module.title}</h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: Lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-indigo-50 border border-indigo-100 shadow-sm'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5">{getIconForType(lesson.lesson_type)}</div>
                        <div>
                          <p className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-1">{lesson.lesson_type}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Playbook Content Workspace */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto bg-white border border-slate-200/60 shadow-md rounded-[24px] overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden flex justify-between items-end">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    {getIconForType(activeLesson.lesson_type)}
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{activeLesson.lesson_type}</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">{activeLesson.title}</h1>
                </div>
              </div>

              <div className="p-8">
                {activeLesson.video_url && (
                  <div className="aspect-video bg-slate-900 rounded-2xl mb-8 overflow-hidden shadow-lg border border-slate-200">
                    <iframe src={activeLesson.video_url} className="w-full h-full" title={activeLesson.title} allowFullScreen />
                  </div>
                )}
                
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative group">
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigator.clipboard.writeText(activeLesson.content)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:text-indigo-600">
                      Copy Script
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed text-[15px]">
                    {activeLesson.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 opacity-30" size={48} />
                <p className="font-bold">Select a lesson to begin</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};