import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type { Task } from '../Utils/types';
import { CheckSquare, Calendar, AlertCircle, Clock, ListTodo } from 'lucide-react';

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
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
    high: { color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    medium: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    low: { color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">My Tasks</h2>
          <p className="text-slate-500 mt-1">Stay on top of your follow-ups and action items.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
          {(['pending', 'completed', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                filter === f
                  ? f === 'completed'
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : f === 'pending'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'bg-slate-100 text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden max-w-4xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <ListTodo className="text-slate-300" size={40} />
            </div>
            <p className="text-lg font-semibold text-slate-700">All clear!</p>
            <p className="text-sm text-slate-500 mt-1">No tasks match the current filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date() && !task.is_completed;
              const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

              return (
                <div
                  key={task.id}
                  className={`p-5 flex items-start gap-4 transition-all duration-200 group ${
                    task.is_completed ? 'bg-slate-50/50 opacity-70' : 'hover:bg-blue-50/30'
                  }`}
                >
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTask(task.id, task.is_completed)}
                      className="h-5 w-5 text-blue-600 rounded-md border-2 border-slate-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`font-semibold ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${pConfig.bg} ${pConfig.color}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs mt-2 text-slate-500">
                      <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                        {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
                        {new Date(task.due_date).toLocaleString()}
                        {isOverdue && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] ml-1">OVERDUE</span>}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} /> Lead #{task.lead}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};