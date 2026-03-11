// import React, { useState, useEffect } from 'react';
// import { X, Phone, Mail, Calendar, CheckSquare, Send, Sparkles, StickyNote } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { Lead } from '../Utils/types';

// interface LeadDetailDrawerProps {
//   lead: Lead | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onUpdate: () => void;
// }

// export const LeadDetailDrawer = ({ lead, isOpen, onClose, onUpdate }: LeadDetailDrawerProps) => {
//   const [activeTab, setActiveTab] = useState<'activity' | 'tasks' | 'ai'>('activity');
//   const [note, setNote] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDate, setTaskDate] = useState('');
//   const [aiPrompt, setAiPrompt] = useState('');
//   const [aiResponse, setAiResponse] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setAiResponse('');
//       setAiPrompt('');
//       setNote('');
//       setActiveTab('activity');
//     }
//   }, [lead?.id, isOpen]);

//   if (!isOpen || !lead) return null;

//   const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting') => {
//     if (!note) return;
//     setLoading(true);
//     try {
//       await api.createActivity({ lead: lead.id, activity_type: type, description: note, summary: `${type.toUpperCase()} Logged` });
//       setNote('');
//       onUpdate();
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const handleAddTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     await api.createTask({ lead: lead.id, title: taskTitle, due_date: new Date(taskDate).toISOString(), priority: 'medium', is_completed: false });
//     setTaskTitle('');
//     setTaskDate('');
//     setLoading(false);
//     onUpdate();
//   };

//   const handleGenerateAI = async () => {
//     setLoading(true);
//     try {
//       const res = await api.generateAIPrompt(lead.id, aiPrompt);
//       setAiResponse(res.generated_text);
//     } catch (e) { setAiResponse("Error generating AI draft."); }
//     setLoading(false);
//   };

//   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   const activityColors: Record<string, string> = {
//     call: 'bg-blue-400',
//     email: 'bg-indigo-400',
//     meeting: 'bg-emerald-400',
//     note: 'bg-amber-400',
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end">
//       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]" onClick={onClose} />

//       <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
//         {/* Header */}
//         <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/80">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
//                 {getInitials(lead.name)}
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800">{lead.name}</h2>
//                 <p className="text-slate-500 text-sm">{lead.company} • {lead.email}</p>
//                 <div className="flex gap-2 mt-3">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-lg border border-blue-100">
//                     {lead.status}
//                   </span>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
//                     ${parseFloat(lead.value).toLocaleString()}
//                   </span>
//                   {lead.tags_details?.map(tag => (
//                     <span key={tag.id} style={{ backgroundColor: tag.color }} className="px-2.5 py-1 text-white text-xs font-bold rounded-lg shadow-sm">
//                       {tag.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition">
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-slate-200 px-8 bg-white">
//           <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Activity" />
//           <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label={`Tasks (${lead.tasks?.filter(t => !t.is_completed).length || 0})`} />
//           <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Copilot" icon={<Sparkles size={14} />} />
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 custom-scrollbar">
//           {/* ACTIVITY TAB */}
//           {activeTab === 'activity' && (
//             <div className="space-y-8">
//               {/* Input */}
//               <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition">
//                 <textarea
//                   className="w-full text-sm border-none focus:ring-0 resize-none placeholder:text-slate-400 p-5 min-h-[100px]"
//                   placeholder="Log a call summary, meeting notes, or email draft..."
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                 />
//                 <div className="flex justify-between items-center px-5 pb-4 pt-2 border-t border-slate-50">
//                   <div className="flex gap-1">
//                     <IconBtn icon={Phone} onClick={() => handleAddActivity('call')} label="Call" color="blue" />
//                     <IconBtn icon={Mail} onClick={() => handleAddActivity('email')} label="Email" color="indigo" />
//                     <IconBtn icon={Calendar} onClick={() => handleAddActivity('meeting')} label="Meeting" color="emerald" />
//                     <IconBtn icon={StickyNote} onClick={() => handleAddActivity('note')} label="Note" color="amber" />
//                   </div>
//                   <button
//                     onClick={() => handleAddActivity('note')}
//                     disabled={loading || !note}
//                     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition disabled:opacity-50"
//                   >
//                     Log Activity
//                   </button>
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
//                 {lead.activities && lead.activities.length > 0 ? (
//                   lead.activities.map((act) => (
//                     <div key={act.id} className="relative pl-8">
//                       <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${activityColors[act.activity_type] || 'bg-slate-400'}`} />
//                       <div className="flex items-center gap-2 mb-1.5">
//                         <span className="text-xs font-bold uppercase text-slate-600 tracking-wide">{act.activity_type}</span>
//                         <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{new Date(act.created_at).toLocaleString()}</span>
//                       </div>
//                       <div className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed">
//                         {act.description}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="pl-8 py-8 text-center text-slate-400">
//                     <StickyNote className="mx-auto mb-3 opacity-30" size={32} />
//                     <p className="font-medium">No activity history yet</p>
//                     <p className="text-xs mt-1">Log your first interaction above.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* TASKS TAB */}
//           {activeTab === 'tasks' && (
//             <div className="space-y-6">
//               <form onSubmit={handleAddTask} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
//                 <input
//                   type="text"
//                   placeholder="What needs to be done?"
//                   className="w-full text-sm border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//                   value={taskTitle}
//                   onChange={(e) => setTaskTitle(e.target.value)}
//                   required
//                 />
//                 <div className="flex gap-3">
//                   <input
//                     type="datetime-local"
//                     className="flex-1 text-sm border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none text-slate-600 transition"
//                     value={taskDate}
//                     onChange={(e) => setTaskDate(e.target.value)}
//                     required
//                   />
//                   <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition flex items-center gap-2">
//                     <CheckSquare size={16} /> Add
//                   </button>
//                 </div>
//               </form>

//               <div className="space-y-3">
//                 {lead.tasks && lead.tasks.length > 0 ? (
//                   lead.tasks.map((task) => (
//                     <div key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${task.is_completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200/60 shadow-sm'}`}>
//                       <input
//                         type="checkbox"
//                         checked={task.is_completed}
//                         onChange={async () => { await api.toggleTask(task.id, !task.is_completed); onUpdate(); }}
//                         className="mt-1 h-5 w-5 text-blue-600 rounded-md border-2 border-slate-300 focus:ring-blue-500 cursor-pointer"
//                       />
//                       <div className="flex-1">
//                         <p className={`text-sm font-medium ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</p>
//                         <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
//                           <Calendar size={12} /> {new Date(task.due_date).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="py-8 text-center text-slate-400">
//                     <CheckSquare className="mx-auto mb-3 opacity-30" size={32} />
//                     <p className="font-medium">No tasks yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* AI TAB */}
//           {activeTab === 'ai' && (
//             <div className="space-y-5 h-full flex flex-col">
//               <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100/60 text-indigo-900">
//                 <p className="flex items-center gap-2 font-bold text-indigo-700 mb-1"><Sparkles size={16} /> AI Sales Copilot</p>
//                 <p className="text-sm text-indigo-600/80">Draft personalized outreach using AI based on this lead's data and history.</p>
//               </div>

//               <textarea
//                 className="w-full text-sm border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none resize-none shadow-sm transition"
//                 rows={4}
//                 placeholder="E.g., 'Draft a follow-up about our pricing proposal', 'Write a cold intro mentioning their recent funding round'..."
//                 value={aiPrompt}
//                 onChange={(e) => setAiPrompt(e.target.value)}
//               />
//               <button
//                 onClick={handleGenerateAI}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-70"
//               >
//                 {loading ? <Sparkles className="animate-spin" size={18} /> : <Send size={18} />}
//                 {loading ? 'Thinking...' : 'Generate Draft'}
//               </button>

//               {aiResponse && (
//                 <div className="mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generated Output</span>
//                     <button onClick={() => navigator.clipboard.writeText(aiResponse)} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition">Copy</button>
//                   </div>
//                   <div className="p-6 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
//                     <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{aiResponse}</pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const TabButton = ({ active, onClick, label, icon }: any) => (
//   <button
//     onClick={onClick}
//     className={`pb-4 pt-4 px-5 font-medium text-sm border-b-2 transition-all flex items-center gap-2 ${
//       active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
//     }`}
//   >
//     {icon} {label}
//   </button>
// );

// const IconBtn = ({ icon: Icon, onClick, label, color }: any) => {
//   const colors: Record<string, string> = {
//     blue: 'hover:bg-blue-50 hover:text-blue-600',
//     indigo: 'hover:bg-indigo-50 hover:text-indigo-600',
//     emerald: 'hover:bg-emerald-50 hover:text-emerald-600',
//     amber: 'hover:bg-amber-50 hover:text-amber-600',
//   };
//   return (
//     <button onClick={onClick} className={`p-2.5 text-slate-400 rounded-xl transition ${colors[color]}`} title={label}>
//       <Icon size={18} />
//     </button>
//   );
// };


import React, { useState, useEffect } from 'react';
import { 
  X, Phone, Mail, Calendar, CheckSquare, Send, Sparkles, 
  StickyNote, Clock, ArrowLeft, Building2, Tag, DollarSign 
} from 'lucide-react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetailDrawer = ({ lead, isOpen, onClose, onUpdate }: LeadDetailDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'tasks' | 'ai'>('activity');
  const [note, setNote] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAiResponse('');
      setAiPrompt('');
      setNote('');
      setActiveTab('activity');
    }
  }, [lead?.id, isOpen]);

  if (!isOpen || !lead) return null;

  const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting') => {
    if (!note) return;
    setLoading(true);
    try {
      await api.createActivity({ lead: lead.id, activity_type: type, description: note, summary: `${type.toUpperCase()} Logged` });
      setNote('');
      onUpdate();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.createTask({ lead: lead.id, title: taskTitle, due_date: new Date(taskDate).toISOString(), priority: 'medium', is_completed: false });
    setTaskTitle('');
    setTaskDate('');
    setLoading(false);
    onUpdate();
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await api.generateAIPrompt(lead.id, aiPrompt);
      setAiResponse(res.generated_text);
    } catch (e) { setAiResponse("Error generating AI draft."); }
    setLoading(false);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const activityColors: Record<string, string> = {
    call: 'bg-blue-500',
    email: 'bg-indigo-500',
    meeting: 'bg-emerald-500',
    note: 'bg-amber-500',
  };

  return (
    // FULL SCREEN OVERLAY
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col font-sans h-screen w-screen overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[13px] font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Back to Pipeline
        </button>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wide rounded border border-slate-200">
            {lead.status}
          </span>
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Lead Profile */}
        <div className="w-[320px] md:w-[380px] bg-white border-r border-slate-200 shrink-0 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-[28px] shadow-sm mb-4">
              {getInitials(lead.name)}
            </div>
            <h2 className="text-[22px] font-bold text-slate-800 leading-tight">{lead.name}</h2>
            <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5">
              <Building2 size={14} /> {lead.company}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* About Card */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">About this deal</h3>
              <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><DollarSign size={12}/> Deal Value</p>
                  <p className="text-[14px] font-semibold text-emerald-600">
                    ${parseFloat(lead.value).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><Mail size={12}/> Email Address</p>
                  <a href={`mailto:${lead.email}`} className="text-[13px] font-medium text-blue-600 hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            {lead.tags_details && lead.tags_details.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag size={12} /> Applied Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags_details.map(tag => (
                    <span 
                      key={tag.id} 
                      style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }} 
                      className="px-2.5 py-1 text-[12px] font-semibold rounded-md border"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Workspace (Tabs & Content) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          
          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-8 pt-4 shrink-0 flex gap-8">
            <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Activity" />
            <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label={`Tasks (${lead.tasks?.filter(t => !t.is_completed).length || 0})`} />
            <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Copilot" icon={<Sparkles size={14} className="mb-0.5" />} />
          </div>

          {/* Scrollable Workspace */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              
              {/* ACTIVITY TAB */}
              {activeTab === 'activity' && (
                <div>
                  {/* Clean Input Area */}
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all overflow-hidden mb-10">
                    <textarea
                      className="w-full text-[13px] border-none focus:ring-0 resize-none placeholder:text-slate-400 p-5 min-h-[120px] outline-none"
                      placeholder="Log a call summary, meeting notes, or email draft..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100 bg-slate-50/80">
                      <div className="flex gap-2">
                        <IconBtn icon={Phone} onClick={() => handleAddActivity('call')} label="Call" />
                        <IconBtn icon={Mail} onClick={() => handleAddActivity('email')} label="Email" />
                        <IconBtn icon={Calendar} onClick={() => handleAddActivity('meeting')} label="Meeting" />
                        <IconBtn icon={StickyNote} onClick={() => handleAddActivity('note')} label="Note" />
                      </div>
                      <button
                        onClick={() => handleAddActivity('note')}
                        disabled={loading || !note}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm"
                      >
                        Log Activity
                      </button>
                    </div>
                  </div>

                  {/* Minimal Timeline */}
                  <div className="relative border-l-2 border-slate-200 ml-6 space-y-8 pb-8">
                    {lead.activities && lead.activities.length > 0 ? (
                      lead.activities.map((act) => (
                        <div key={act.id} className="relative pl-8">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ring-[#f8fafc] ${activityColors[act.activity_type] || 'bg-slate-400'}`} />
                          
                          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[13px] font-bold capitalize text-slate-800 flex items-center gap-2">
                                {act.activity_type === 'call' && <Phone size={14} className="text-blue-500"/>}
                                {act.activity_type === 'email' && <Mail size={14} className="text-indigo-500"/>}
                                {act.activity_type === 'meeting' && <Calendar size={14} className="text-emerald-500"/>}
                                {act.activity_type === 'note' && <StickyNote size={14} className="text-amber-500"/>}
                                Logged {act.activity_type}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(act.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-[13px] text-slate-600 leading-relaxed mt-1">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-8 py-10 text-center flex flex-col items-center">
                        <StickyNote className="text-slate-300 mb-3" size={32} />
                        <p className="text-[14px] font-medium text-slate-500">No activity history yet</p>
                        <p className="text-[13px] text-slate-400 mt-1">Log your first interaction above.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddTask} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <input
                      type="text"
                      placeholder="What needs to be done?"
                      className="w-full text-[14px] border border-slate-200 rounded-md p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-slate-400"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                    <div className="flex gap-3">
                      <input
                        type="datetime-local"
                        className="flex-1 text-[13px] border border-slate-200 rounded-md p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-600"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm"
                      >
                        Add Task
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-4">
                    {lead.tasks && lead.tasks.length > 0 ? (
                      lead.tasks.map((task) => (
                        <div key={task.id} className="group flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all">
                          <input
                            type="checkbox"
                            checked={task.is_completed}
                            onChange={async () => { await api.toggleTask(task.id, !task.is_completed); onUpdate(); }}
                            className="mt-0.5 h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className={`text-[14px] font-medium leading-tight ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                              {task.title}
                            </p>
                            <p className="text-[12px] font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
                              <Calendar size={13} /> {new Date(task.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center flex flex-col items-center">
                        <CheckSquare className="text-slate-300 mb-3" size={36} />
                        <p className="text-[14px] font-medium text-slate-500">No tasks yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI TAB */}
              {activeTab === 'ai' && (
                <div className="space-y-5">
                  <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 flex gap-4 items-start">
                    <div className="mt-1 text-blue-600 bg-white p-2 rounded shadow-sm border border-blue-100">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-blue-900 mb-1">AI Sales Copilot</p>
                      <p className="text-[13px] text-blue-700/80 leading-relaxed">
                        Use AI to draft highly personalized emails and outreach messages based on this lead's specific data, company, and activity history.
                      </p>
                    </div>
                  </div>

                  <textarea
                    className="w-full text-[14px] border border-slate-200 rounded-lg p-4 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-slate-400 resize-none bg-white shadow-sm"
                    rows={5}
                    placeholder="E.g., 'Draft a follow-up email mentioning our new pricing proposal'..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  
                  <button
                    onClick={handleGenerateAI}
                    disabled={loading || !aiPrompt}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {loading ? <Sparkles className="animate-spin" size={16} /> : <Send size={16} />}
                    {loading ? 'Generating Response...' : 'Generate Draft'}
                  </button>

                  {aiResponse && (
                    <div className="mt-8 animate-fade-in">
                      <div className="flex justify-between items-center mb-3 px-1">
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Generated Output</span>
                        <button onClick={() => navigator.clipboard.writeText(aiResponse)} className="text-[13px] text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 px-3 py-1 rounded">
                          Copy to clipboard
                        </button>
                      </div>
                      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <pre className="whitespace-pre-wrap text-[14px] text-slate-700 font-sans leading-relaxed">
                          {aiResponse}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* Micro-components */
const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`pb-4 pt-1 text-[14px] font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
      active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon} {label}
  </button>
);

const IconBtn = ({ icon: Icon, onClick, label }: any) => (
  <button 
    onClick={onClick} 
    className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors" 
    title={label}
  >
    <Icon size={18} />
  </button>
);