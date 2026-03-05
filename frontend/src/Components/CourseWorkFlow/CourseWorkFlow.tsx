import React, { useEffect, useState } from 'react';
import { BookOpen, PlayCircle, FileText, CheckSquare, ArrowLeft, Target, Globe } from 'lucide-react';
import { api } from '../Utils/api';
import type{ Course, Lesson, Module } from '../Utils/types';

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

  if (loading) return <div className="p-8 text-slate-500">Loading Workflows...</div>;

  if (!activeCourse) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Sales Playbooks & Workflows</h2>
          <p className="text-slate-500 mt-1">Standardized BD workflows, PDCA frameworks, and call scripts.</p>
        </header>

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
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex gap-3 mb-4">
                {course.target_vertical && (
                  <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    <Target size={12}/> {course.target_vertical}
                  </span>
                )}
                {course.target_region && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Globe size={12}/> {course.target_region}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm text-slate-500">
                <span>{course.modules.length} Modules (PDCA)</span>
                <span className="text-blue-600 font-medium group-hover:underline">Start Workflow &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveCourse(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{activeCourse.title}</h2>
            <div className="flex gap-2 text-xs text-slate-500 mt-1">
              <span>Vertical: {activeCourse.target_vertical || 'All'}</span> • 
              <span>Region: {activeCourse.target_region || 'All'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto shrink-0">
          <div className="p-4">
            {activeCourse.modules.map((module: Module) => (
              <div key={module.id} className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">{module.title}</h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: Lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}
                      >
                        <div className="mt-0.5">{getIconForType(lesson.lesson_type)}</div>
                        <div>
                          <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{lesson.title}</p>
                          <p className="text-xs text-slate-400 capitalize">{lesson.lesson_type}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {activeLesson ? (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-800 text-white">
                <div className="flex items-center gap-2 mb-3">
                  {getIconForType(activeLesson.lesson_type)}
                  <span className="text-sm font-medium text-slate-300 uppercase tracking-wide">{activeLesson.lesson_type}</span>
                </div>
                <h1 className="text-3xl font-bold">{activeLesson.title}</h1>
              </div>
              
              <div className="p-8">
                {activeLesson.video_url && (
                  <div className="aspect-video bg-slate-900 rounded-lg mb-8 overflow-hidden">
                    <iframe src={activeLesson.video_url} className="w-full h-full" title={activeLesson.title} allowFullScreen></iframe>
                  </div>
                )}
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{activeLesson.content}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">Select a lesson from the menu to begin.</div>
          )}
        </main>
      </div>
    </div>
  );
};