import React, { useEffect, useState } from 'react';
import { BookOpen, PlayCircle, FileText, CheckSquare, ArrowLeft, Target, Globe, GraduationCap } from 'lucide-react';
import { api } from '../Utils/api';
import type { Course, Lesson, Module } from '../Utils/types';

export const CourseWorkflows = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses().then(data => { setCourses(data); setLoading(false); }).catch(console.error);
  }, []);

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
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading Playbooks...</p>
        </div>
      </div>
    );
  }

  // Course List View
  if (!activeCourse) {
    return (
      <div className="p-8 h-full overflow-y-auto custom-scrollbar">
        <header className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Sales Playbooks & Workflows</h2>
          <p className="text-slate-500 mt-1">Standardized BD workflows, PDCA frameworks, and call scripts.</p>
        </header>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="text-slate-300" size={40} />
            </div>
            <p className="text-lg font-semibold text-slate-700">No playbooks yet</p>
            <p className="text-sm text-slate-500 mt-1">Add courses through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => {
                  setActiveCourse(course);
                  if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                    setActiveLesson(course.modules[0].lessons[0]);
                  }
                }}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 group relative overflow-hidden"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/15 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition">{course.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="flex gap-2 mb-5 flex-wrap">
                    {course.target_vertical && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                        <Target size={12} /> {course.target_vertical}
                      </span>
                    )}
                    {course.target_region && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <Globe size={12} /> {course.target_region}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
                    <span className="text-slate-500 font-medium">{course.modules.length} Modules</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Start &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Course Detail View
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <header className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => { setActiveCourse(null); setActiveLesson(null); }} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{activeCourse.title}</h2>
            <div className="flex gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1"><Target size={10} /> {activeCourse.target_vertical || 'All'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Globe size={10} /> {activeCourse.target_region || 'Global'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200/60 overflow-y-auto shrink-0 custom-scrollbar">
          <div className="p-4">
            {activeCourse.modules.map((module: Module) => (
              <div key={module.id} className="mb-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">{module.title}</h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: Lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-50 border border-blue-100 shadow-sm'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5">{getIconForType(lesson.lesson_type)}</div>
                        <div>
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{lesson.title}</p>
                          <p className="text-[10px] text-slate-400 capitalize mt-0.5">{lesson.lesson_type}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeLesson ? (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    {getIconForType(activeLesson.lesson_type)}
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{activeLesson.lesson_type}</span>
                  </div>
                  <h1 className="text-3xl font-bold">{activeLesson.title}</h1>
                </div>
              </div>

              <div className="p-8">
                {activeLesson.video_url && (
                  <div className="aspect-video bg-slate-900 rounded-xl mb-8 overflow-hidden shadow-lg">
                    <iframe src={activeLesson.video_url} className="w-full h-full" title={activeLesson.title} allowFullScreen />
                  </div>
                )}
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px]">{activeLesson.content}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 opacity-30" size={48} />
                <p className="font-medium">Select a lesson to begin</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};