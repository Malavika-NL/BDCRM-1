// import React, { useEffect, useState } from 'react';
// import { api } from '../Utils/api';
// import type { Task } from '../Utils/types';
// import { CheckSquare, Calendar, AlertCircle, Clock, ListTodo } from 'lucide-react';

// export const TasksPage = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     setLoading(true);
//     const data = await api.getTasks(filter === 'all' ? undefined : filter === 'completed');
//     setTasks(data);
//     setLoading(false);
//   };

//   useEffect(() => { fetchTasks(); }, [filter]);

//   const toggleTask = async (id: number, currentStatus: boolean) => {
//     setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
//     await api.toggleTask(id, !currentStatus);
//     fetchTasks();
//   };

//   const priorityConfig: Record<string, { color: string; bg: string }> = {
//     high: { color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
//     medium: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
//     low: { color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar">
//       <header className="mb-8 flex justify-between items-center">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">My Tasks</h2>
//           <p className="text-slate-500 mt-1">Stay on top of your follow-ups and action items.</p>
//         </div>
//         <div className="flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
//           {(['pending', 'completed', 'all'] as const).map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
//                 filter === f
//                   ? f === 'completed'
//                     ? 'bg-emerald-100 text-emerald-700 shadow-sm'
//                     : f === 'pending'
//                     ? 'bg-blue-100 text-blue-700 shadow-sm'
//                     : 'bg-slate-100 text-slate-700 shadow-sm'
//                   : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </header>

//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden max-w-4xl">
//         {loading ? (
//           <div className="p-12 text-center">
//             <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
//           </div>
//         ) : tasks.length === 0 ? (
//           <div className="p-20 text-center flex flex-col items-center">
//             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
//               <ListTodo className="text-slate-300" size={40} />
//             </div>
//             <p className="text-lg font-semibold text-slate-700">All clear!</p>
//             <p className="text-sm text-slate-500 mt-1">No tasks match the current filter.</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-100">
//             {tasks.map((task) => {
//               const isOverdue = new Date(task.due_date) < new Date() && !task.is_completed;
//               const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

//               return (
//                 <div
//                   key={task.id}
//                   className={`p-5 flex items-start gap-4 transition-all duration-200 group ${
//                     task.is_completed ? 'bg-slate-50/50 opacity-70' : 'hover:bg-blue-50/30'
//                   }`}
//                 >
//                   <div className="mt-1">
//                     <input
//                       type="checkbox"
//                       checked={task.is_completed}
//                       onChange={() => toggleTask(task.id, task.is_completed)}
//                       className="h-5 w-5 text-blue-600 rounded-md border-2 border-slate-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <p className={`font-semibold ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
//                         {task.title}
//                       </p>
//                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${pConfig.bg} ${pConfig.color}`}>
//                         {task.priority}
//                       </span>
//                     </div>
//                     <div className="flex gap-4 text-xs mt-2 text-slate-500">
//                       <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
//                         {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
//                         {new Date(task.due_date).toLocaleString()}
//                         {isOverdue && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] ml-1">OVERDUE</span>}
//                       </span>
//                       <span className="flex items-center gap-1.5 text-slate-400">
//                         <Clock size={14} /> Lead #{task.lead}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type { Task } from '../Utils/types';
import {
  CheckSquare, Calendar, AlertCircle, Clock,
  ListTodo, CheckCircle2, RotateCcw,
} from 'lucide-react';

export const TasksPage = () => {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const data = await api.getTasks(filter === 'all' ? undefined : filter === 'completed');
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const toggleTask = async (id: number, currentStatus: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    await api.toggleTask(id, !currentStatus);
    fetchTasks();
  };

  const priorityConfig: Record<string, { color: string; bg: string }> = {
    high:   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200'     },
    medium: { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
    low:    { color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' },
  };

  const pendingCount   = tasks.filter(t => !t.is_completed).length;
  const completedCount = tasks.filter(t => t.is_completed).length;
  const overdueCount   = tasks.filter(t => new Date(t.due_date) < new Date() && !t.is_completed).length;

  const filterLabel: Record<string, string> = {
    pending:   'Pending Tasks',
    completed: 'Completed Tasks',
    all:       'All Tasks',
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px) scale(0.99); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — identical structure to BDMTargetCreate
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow:  '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          {/* icon block */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <CheckSquare className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">My Tasks</h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Stay on top of your follow-ups and action items.
            </p>
          </div>

          {/* stat pills in banner */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <ListTodo size={12} className="text-indigo-200" />
              <span className="text-[11px] font-black text-indigo-100">{pendingCount} pending</span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <CheckCircle2 size={12} className="text-indigo-200" />
              <span className="text-[11px] font-black text-indigo-100">{completedCount} done</span>
            </div>
            {overdueCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl animate-pulse"
                style={{ backgroundColor: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }}
              >
                <AlertCircle size={12} className="text-red-200" />
                <span className="text-[11px] font-black text-red-100">{overdueCount} overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {/* ── FILTER + TASK LIST CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-2">

          {/* top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl" />

          {/* card header — SectionHead style + filter toggle */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
            {/* left accent + title */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-1 self-stretch rounded-full bg-indigo-500 shrink-0" />
              <div>
                <h2 className="text-[14px] font-black text-slate-800">{filterLabel[filter]}</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* filter toggle — matches BDMTargetCreate category buttons style */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1 shrink-0">
              {(['pending', 'completed', 'all'] as const).map((f) => {
                const active = filter === f;
                const activeStyle =
                  f === 'completed' ? 'text-emerald-700 border-emerald-200' :
                  f === 'pending'   ? 'text-indigo-700 border-indigo-200'   :
                                     'text-slate-700 border-slate-200';
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-[12px] font-black rounded-xl transition-all capitalize ${
                      active
                        ? `bg-white shadow-sm border ${activeStyle}`
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* body */}
          {loading ? (
            <div className="p-16 flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-[12px] font-medium text-slate-400">Loading tasks…</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-16 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(125deg, #4f46e5, #7c3aed)', opacity: 0.12 }}
              />
              <ListTodo className="text-indigo-300 -mt-14 mb-1" size={28} />
              <p className="text-[14px] font-black text-slate-700">All clear!</p>
              <p className="text-[12px] text-slate-400 font-medium">No tasks match the current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const isOverdue = new Date(task.due_date) < new Date() && !task.is_completed;
                const pConfig   = priorityConfig[task.priority] || priorityConfig.medium;

                return (
                  <div
                    key={task.id}
                    className={`px-5 py-4 flex items-center gap-4 transition-all duration-200 group ${
                      task.is_completed
                        ? 'bg-slate-50/60'
                        : isOverdue
                        ? 'hover:bg-red-50/30 border-l-2 border-l-red-400'
                        : 'hover:bg-indigo-50/20'
                    }`}
                  >
                    {/* status dot */}
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      task.is_completed
                        ? 'bg-emerald-400'
                        : isOverdue
                        ? 'bg-red-400 animate-pulse'
                        : 'bg-indigo-300'
                    }`} />

                    {/* content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <p className={`text-[13px] font-black leading-snug ${
                          task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}>
                          {task.title}
                        </p>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${pConfig.bg} ${pConfig.color}`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className={`flex items-center gap-1.5 text-[11px] font-medium ${
                          isOverdue ? 'text-red-500' : 'text-slate-400'
                        }`}>
                          {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                          {new Date(task.due_date).toLocaleString()}
                          {isOverdue && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-lg text-[10px] font-black ml-1">
                              OVERDUE
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Clock size={11} /> Lead #{task.lead}
                        </span>
                      </div>
                    </div>

                    {/* toggle button */}
                    {task.is_completed ? (
                      <button
                        onClick={() => toggleTask(task.id, task.is_completed)}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[11px] font-black
                          text-slate-500 bg-white border border-slate-200 rounded-xl
                          hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                      >
                        <RotateCcw size={12} /> Reopen
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleTask(task.id, task.is_completed)}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[11px] font-black
                          text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl
                          hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                      >
                        <CheckCircle2 size={12} /> Mark Done
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pb-2" />
      </div>
    </div>
  );
};