// import React, { useState, useEffect } from 'react';
// import { 
//   X, Phone, Mail, Calendar, CheckSquare, Send, Sparkles, 
//   StickyNote, Clock, ArrowLeft, Building2, Tag, DollarSign,
//   BrainCircuit, Target, ShieldAlert, Zap
// } from 'lucide-react';
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
//   const [loading, setLoading] = useState(false);

//   // AI States
//   const [aiScore, setAiScore] = useState<any>(null);
//   const [aiSummary, setAiSummary] = useState<any>(null);
//   const [aiNextAction, setAiNextAction] = useState<any>(null);
//   const [writerParams, setWriterParams] = useState({ type: 'email', tone: 'professional', purpose: 'introduction' });
//   const [aiDraft, setAiDraft] = useState<any>(null);
//   const [loadingAI, setLoadingAI] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen) {
//       setNote('');
//       setActiveTab('activity');
//       setAiScore(null);
//       setAiSummary(null);
//       setAiNextAction(null);
//       setAiDraft(null);
//     }
//   }, [lead?.id, isOpen]);

//   if (!isOpen || !lead) return null;

//   const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting') => {
//     if (!note) return;
//     setLoading(true);
//     await api.createActivity({ lead: lead.id, activity_type: type, description: note, summary: `${type.toUpperCase()} Logged` });
//     setNote('');
//     onUpdate();
//     setLoading(false);
//   };

//   const handleAddTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     await api.createTask({ lead: lead.id, title: taskTitle, due_date: new Date(taskDate).toISOString(), priority: 'medium', is_completed: false });
//     setTaskTitle('');
//     setTaskDate('');
//     onUpdate();
//     setLoading(false);
//   };

//   // AI API Calls
//   const fetchAIScore = async () => {
//     setLoadingAI('score');
//     try { const res = await api.getAIScore(lead.id); setAiScore(res.scoring); } catch (e) { console.error(e); }
//     setLoadingAI(null);
//   };

//   const fetchAISummary = async () => {
//     setLoadingAI('summary');
//     try { const res = await api.getAISummary(lead.id); setAiSummary(res.summary); } catch (e) { console.error(e); }
//     setLoadingAI(null);
//   };

//   const fetchAINextAction = async () => {
//     setLoadingAI('nextAction');
//     try { const res = await api.getAINextAction(lead.id); setAiNextAction(res.next_action); } catch (e) { console.error(e); }
//     setLoadingAI(null);
//   };

//   const handleAIWrite = async () => {
//     setLoadingAI('write');
//     try { const res = await api.aiWriteMessage(lead.id, writerParams); setAiDraft(res.content); } catch (e) { console.error(e); }
//     setLoadingAI(null);
//   };

//   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   const activityColors: Record<string, string> = {
//     call: 'bg-blue-500',
//     email: 'bg-indigo-500',
//     meeting: 'bg-emerald-500',
//     note: 'bg-amber-500',
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col font-sans h-screen w-screen overflow-hidden">
      
//       {/* Top Navigation Bar */}
//       <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
//         <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[13px] font-semibold transition-colors">
//           <ArrowLeft size={16} /> Back to Pipeline
//         </button>
//         <div className="flex items-center gap-3">
//           {aiScore && (
//             <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm">
//               <BrainCircuit size={14} /> Score: {aiScore.score}/100
//             </span>
//           )}
//           <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wide rounded border border-slate-200">
//             {lead.status}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
        
//         {/* Left Sidebar */}
//         <div className="w-[320px] md:w-[380px] bg-white border-r border-slate-200 shrink-0 overflow-y-auto custom-scrollbar flex flex-col">
//           <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center">
//             <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-[28px] shadow-sm mb-4">
//               {getInitials(lead.name)}
//             </div>
//             <h2 className="text-[22px] font-bold text-slate-800 leading-tight">{lead.name}</h2>
//             <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5">
//               <Building2 size={14} /> {lead.company}
//             </p>
//           </div>

//           <div className="p-8 space-y-6">
//             <div>
//               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">About this deal</h3>
//               <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-4">
//                 <div>
//                   <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><DollarSign size={12}/> Deal Value</p>
//                   <p className="text-[14px] font-semibold text-emerald-600">${parseFloat(lead.value).toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><Mail size={12}/> Email</p>
//                   <a href={`mailto:${lead.email}`} className="text-[13px] font-medium text-blue-600 hover:underline">{lead.email}</a>
//                 </div>
//                 <div>
//                   <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><Phone size={12}/> Phone</p>
//                   {/* FIXED LINE HERE */}
//                   <p className="text-[13px] font-medium text-slate-800">{lead.phone ? String(lead.phone) : 'Not provided'}</p>
//                 </div>
//               </div>
//             </div>

//             {lead.tags_details && lead.tags_details.length > 0 && (
//               <div>
//                 <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
//                   <Tag size={12} /> Applied Tags
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {lead.tags_details.map(tag => (
//                     <span key={tag.id} style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }} className="px-2.5 py-1 text-[12px] font-semibold rounded-md border">
//                       {tag.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Workspace */}
//         <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          
//           <div className="bg-white border-b border-slate-200 px-8 pt-4 shrink-0 flex gap-8">
//             <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Activity" />
//             <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label={`Tasks (${lead.tasks?.filter(t => !t.is_completed).length || 0})`} />
//             <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Copilot" icon={<Sparkles size={14} className="mb-0.5 text-indigo-600" />} />
//           </div>

//           <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
//             <div className="max-w-3xl mx-auto">
              
//               {/* ACTIVITY TAB */}
//               {activeTab === 'activity' && (
//                 <div>
//                   <div className="bg-white rounded-lg border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all overflow-hidden mb-10">
//                     <textarea
//                       className="w-full text-[13px] border-none focus:ring-0 resize-none placeholder:text-slate-400 p-5 min-h-[120px] outline-none"
//                       placeholder="Log a call summary, meeting notes, or email draft..."
//                       value={note}
//                       onChange={(e) => setNote(e.target.value)}
//                     />
//                     <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100 bg-slate-50/80">
//                       <div className="flex gap-2">
//                         <IconBtn icon={Phone} onClick={() => handleAddActivity('call')} label="Call" />
//                         <IconBtn icon={Mail} onClick={() => handleAddActivity('email')} label="Email" />
//                         <IconBtn icon={Calendar} onClick={() => handleAddActivity('meeting')} label="Meeting" />
//                         <IconBtn icon={StickyNote} onClick={() => handleAddActivity('note')} label="Note" />
//                       </div>
//                       <button onClick={() => handleAddActivity('note')} disabled={loading || !note} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm">
//                         Log Activity
//                       </button>
//                     </div>
//                   </div>

//                   <div className="relative border-l-2 border-slate-200 ml-6 space-y-8 pb-8">
//                     {lead.activities && lead.activities.length > 0 ? (
//                       lead.activities.map((act) => (
//                         <div key={act.id} className="relative pl-8">
//                           <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ring-[#f8fafc] ${activityColors[act.activity_type] || 'bg-slate-400'}`} />
//                           <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-[13px] font-bold capitalize text-slate-800 flex items-center gap-2">
//                                 {act.activity_type === 'call' && <Phone size={14} className="text-blue-500"/>}
//                                 {act.activity_type === 'email' && <Mail size={14} className="text-indigo-500"/>}
//                                 {act.activity_type === 'meeting' && <Calendar size={14} className="text-emerald-500"/>}
//                                 {act.activity_type === 'note' && <StickyNote size={14} className="text-amber-500"/>}
//                                 Logged {act.activity_type}
//                               </span>
//                               <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
//                                 <Clock size={11} />
//                                 {new Date(act.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
//                               </span>
//                             </div>
//                             <p className="text-[13px] text-slate-600 leading-relaxed mt-1">{act.description}</p>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="pl-8 py-10 text-center flex flex-col items-center">
//                         <StickyNote className="text-slate-300 mb-3" size={32} />
//                         <p className="text-[14px] font-medium text-slate-500">No activity history yet</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* TASKS TAB */}
//               {activeTab === 'tasks' && (
//                 <div className="space-y-6">
//                   <form onSubmit={handleAddTask} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
//                     <input
//                       type="text"
//                       placeholder="What needs to be done?"
//                       className="w-full text-[14px] border border-slate-200 rounded-md p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-slate-400"
//                       value={taskTitle}
//                       onChange={(e) => setTaskTitle(e.target.value)}
//                       required
//                     />
//                     <div className="flex gap-3">
//                       <input type="datetime-local" className="flex-1 text-[13px] border border-slate-200 rounded-md p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-600" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} required />
//                       <button type="submit" disabled={loading} className="bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm">
//                         Add Task
//                       </button>
//                     </div>
//                   </form>

//                   <div className="space-y-3 pt-4">
//                     {lead.tasks && lead.tasks.length > 0 ? (
//                       lead.tasks.map((task) => (
//                         <div key={task.id} className="group flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all">
//                           <input type="checkbox" checked={task.is_completed} onChange={async () => { await api.toggleTask(task.id, !task.is_completed); onUpdate(); }} className="mt-0.5 h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
//                           <div className="flex-1">
//                             <p className={`text-[14px] font-medium leading-tight ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
//                             <p className="text-[12px] font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
//                               <Calendar size={13} /> {new Date(task.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
//                             </p>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="py-16 text-center flex flex-col items-center">
//                         <CheckSquare className="text-slate-300 mb-3" size={36} />
//                         <p className="text-[14px] font-medium text-slate-500">No tasks yet</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* AI COPILOT TAB */}
//               {activeTab === 'ai' && (
//                 <div className="space-y-6 animate-fade-in">
                  
//                   {/* AI Score Card */}
//                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
//                     <div className="absolute top-0 right-0 p-6 opacity-5 text-indigo-600"><Target size={100} /></div>
//                     <div className="relative z-10 flex justify-between items-start">
//                       <div>
//                         <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1"><Target size={18} className="text-indigo-600"/> Win Probability Score</h3>
//                         <p className="text-[13px] text-slate-500">Let AI evaluate this lead's data to predict likelihood to close.</p>
//                       </div>
//                       {!aiScore ? (
//                         <button onClick={fetchAIScore} disabled={loadingAI === 'score'} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition">
//                           {loadingAI === 'score' ? <Sparkles className="animate-spin" size={16}/> : 'Calculate Score'}
//                         </button>
//                       ) : (
//                         <div className="text-right">
//                           <span className="text-4xl font-black text-indigo-600">{aiScore.score}<span className="text-lg text-indigo-300">/100</span></span>
//                         </div>
//                       )}
//                     </div>
//                     {aiScore && (
//                       <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-6 relative z-10">
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Strengths</p>
//                           <ul className="space-y-1 text-[13px] text-slate-700">
//                             {aiScore.strengths.map((s:any, i:any) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}
//                           </ul>
//                         </div>
//                         <div>
//                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Factors</p>
//                           <ul className="space-y-1 text-[13px] text-slate-700">
//                             {aiScore.weaknesses.map((w:any, i:any) => <li key={i} className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">!</span>{w}</li>)}
//                           </ul>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* AI Summary Card */}
//                   <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-xl relative overflow-hidden">
//                     <div className="flex justify-between items-start relative z-10">
//                       <div>
//                         <h3 className="font-bold flex items-center gap-2 mb-1"><BrainCircuit size={18} className="text-blue-400"/> Executive Briefing</h3>
//                         <p className="text-[13px] text-slate-400">A 30-second summary reading all past notes and tasks.</p>
//                       </div>
//                       {!aiSummary && (
//                         <button onClick={fetchAISummary} disabled={loadingAI === 'summary'} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition">
//                           {loadingAI === 'summary' ? 'Reading Data...' : 'Generate Briefing'}
//                         </button>
//                       )}
//                     </div>
//                     {aiSummary && (
//                       <div className="mt-5 space-y-4 relative z-10">
//                         <p className="text-[15px] font-medium leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">"{aiSummary.one_line_summary}"</p>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">Current Situation</p>
//                             <p className="text-[13px] text-slate-300 leading-relaxed">{aiSummary.current_situation}</p>
//                           </div>
//                           <div>
//                             <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">Talking Points for Next Call</p>
//                             <ul className="space-y-1.5 text-[13px] text-slate-300 list-disc list-inside pl-2">
//                               {aiSummary.recommended_talking_points?.map((pt:any, i:any) => <li key={i}>{pt}</li>)}
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* AI Next Action Card */}
//                   <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-1"><Zap size={18}/> Sales Coach: Next Action</h3>
//                         <p className="text-[13px] text-emerald-700">Get AI advice on exactly what to do next to close this deal.</p>
//                       </div>
//                       {!aiNextAction && (
//                          <button onClick={fetchAINextAction} disabled={loadingAI === 'nextAction'} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition">
//                            {loadingAI === 'nextAction' ? 'Analyzing...' : 'Get Advice'}
//                          </button>
//                       )}
//                     </div>
//                     {aiNextAction && (
//                       <div className="mt-5 bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
//                         <div className="flex items-center gap-3 mb-3">
//                           <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-1 rounded">{aiNextAction.priority}</span>
//                           <span className="font-bold text-slate-800">{aiNextAction.action}</span>
//                         </div>
//                         <p className="text-[13px] text-slate-600 mb-4">{aiNextAction.reason}</p>
//                         <div className="bg-slate-50 p-3 rounded border border-slate-200">
//                           <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Suggested Script / Opener</p>
//                           <p className="text-[13px] italic font-medium text-slate-700">"{aiNextAction.script_opener}"</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* AI Message Writer */}
//                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//                     <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Sparkles size={18} className="text-amber-500"/> AI Message Writer</h3>
                    
//                     <div className="grid grid-cols-3 gap-4 mb-4">
//                       <div>
//                         <label className="text-[11px] font-bold text-slate-500 uppercase">Channel</label>
//                         <select value={writerParams.type} onChange={e=>setWriterParams({...writerParams, type: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
//                           <option value="email">Email</option>
//                           <option value="whatsapp">WhatsApp</option>
//                           <option value="linkedin">LinkedIn</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="text-[11px] font-bold text-slate-500 uppercase">Tone</label>
//                         <select value={writerParams.tone} onChange={e=>setWriterParams({...writerParams, tone: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
//                           <option value="professional">Professional</option>
//                           <option value="casual">Friendly</option>
//                           <option value="urgent">Urgent</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="text-[11px] font-bold text-slate-500 uppercase">Purpose</label>
//                         <select value={writerParams.purpose} onChange={e=>setWriterParams({...writerParams, purpose: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
//                           <option value="introduction">Introduction</option>
//                           <option value="follow_up">Follow Up</option>
//                           <option value="closing">Closing Push</option>
//                         </select>
//                       </div>
//                     </div>

//                     <button onClick={handleAIWrite} disabled={loadingAI === 'write'} className="w-full bg-slate-800 text-white py-3 rounded-lg text-[13px] font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2">
//                       {loadingAI === 'write' ? <Sparkles className="animate-spin" size={16} /> : <Send size={16} />} 
//                       {loadingAI === 'write' ? 'Drafting...' : 'Generate Draft'}
//                     </button>

//                     {aiDraft && (
//                       <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5 animate-fade-in">
//                         {aiDraft.subject && <div className="mb-3 pb-3 border-b border-slate-200"><span className="text-[11px] font-bold text-slate-400 uppercase">Subject:</span> <span className="font-semibold text-[14px] ml-2">{aiDraft.subject}</span></div>}
//                         <pre className="whitespace-pre-wrap text-[14px] text-slate-700 font-sans leading-relaxed">{aiDraft.message}</pre>
//                         <div className="mt-4 flex justify-end">
//                            <button onClick={() => navigator.clipboard.writeText(aiDraft.message)} className="text-blue-600 text-sm font-bold hover:underline">Copy to Clipboard</button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Micro-components */
// const TabButton = ({ active, onClick, label, icon }: any) => (
//   <button onClick={onClick} className={`pb-4 pt-1 text-[14px] font-semibold border-b-2 transition-all flex items-center gap-1.5 ${ active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800' }`}>
//     {icon} {label}
//   </button>
// );

// const IconBtn = ({ icon: Icon, onClick, label }: any) => (
//   <button onClick={onClick} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors" title={label}>
//     <Icon size={18} />
//   </button>
// );


import React, { useState, useEffect } from 'react';
import {
  X, Phone, Mail, Calendar, CheckSquare, Send, Sparkles,
  StickyNote, Clock, ArrowLeft, Building2, Tag, DollarSign,
  BrainCircuit, Target, ShieldAlert, Zap, CheckCircle2,
  Activity, Layers, TrendingUp
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
  const [loading, setLoading] = useState(false);

  // AI States
  const [aiScore, setAiScore] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [aiNextAction, setAiNextAction] = useState<any>(null);
  const [writerParams, setWriterParams] = useState({ type: 'email', tone: 'professional', purpose: 'introduction' });
  const [aiDraft, setAiDraft] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNote('');
      setActiveTab('activity');
      setAiScore(null);
      setAiSummary(null);
      setAiNextAction(null);
      setAiDraft(null);
    }
  }, [lead?.id, isOpen]);

  if (!isOpen || !lead) return null;

  /* ── all original functions untouched ── */
  const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting') => {
    if (!note) return;
    setLoading(true);
    await api.createActivity({ lead: lead.id, activity_type: type, description: note, summary: `${type.toUpperCase()} Logged` });
    setNote('');
    onUpdate();
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.createTask({ lead: lead.id, title: taskTitle, due_date: new Date(taskDate).toISOString(), priority: 'medium', is_completed: false });
    setTaskTitle('');
    setTaskDate('');
    onUpdate();
    setLoading(false);
  };

  const fetchAIScore = async () => {
    setLoadingAI('score');
    try { const res = await api.getAIScore(lead.id); setAiScore(res.scoring); } catch (e) { console.error(e); }
    setLoadingAI(null);
  };

  const fetchAISummary = async () => {
    setLoadingAI('summary');
    try { const res = await api.getAISummary(lead.id); setAiSummary(res.summary); } catch (e) { console.error(e); }
    setLoadingAI(null);
  };

  const fetchAINextAction = async () => {
    setLoadingAI('nextAction');
    try { const res = await api.getAINextAction(lead.id); setAiNextAction(res.next_action); } catch (e) { console.error(e); }
    setLoadingAI(null);
  };

  const handleAIWrite = async () => {
    setLoadingAI('write');
    try { const res = await api.aiWriteMessage(lead.id, writerParams); setAiDraft(res.content); } catch (e) { console.error(e); }
    setLoadingAI(null);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const activityIconMap: Record<string, { icon: React.ReactNode; gradient: string; dot: string }> = {
    call:    { icon: <Phone size={13} className="text-white" />,      gradient: 'from-blue-500 to-blue-600',    dot: 'bg-blue-500' },
    email:   { icon: <Mail size={13} className="text-white" />,       gradient: 'from-indigo-500 to-violet-600', dot: 'bg-indigo-500' },
    meeting: { icon: <Calendar size={13} className="text-white" />,   gradient: 'from-emerald-500 to-teal-600',  dot: 'bg-emerald-500' },
    note:    { icon: <StickyNote size={13} className="text-white" />, gradient: 'from-amber-400 to-orange-500',  dot: 'bg-amber-400' },
  };

  const pendingTaskCount = lead.tasks?.filter(t => !t.is_completed).length || 0;

  /* ── tab definitions ── */
  const tabs: { key: 'activity' | 'tasks' | 'ai'; label: string; icon: React.ReactNode; badge?: number; gradient: string }[] = [
    { key: 'activity', label: 'Activity',    icon: <Activity size={13} />,    gradient: 'from-indigo-500 to-violet-500' },
    { key: 'tasks',    label: 'Tasks',       icon: <CheckSquare size={13} />, badge: pendingTaskCount, gradient: 'from-violet-500 to-purple-500' },
    { key: 'ai',       label: 'AI Copilot',  icon: <Sparkles size={13} />,    gradient: 'from-amber-400 to-orange-500' },
  ];

  const inputCls = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all';
  const selectCls = 'w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all';

  return (
    <div className="fixed inset-0 z-50 bg-[#f0f2f8] flex flex-col font-sans h-screen w-screen overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .45s ease-out forwards; animation-delay:.04s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .45s ease-out forwards; animation-delay:.12s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .45s ease-out forwards; animation-delay:.20s; }
      `}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

      {/* ══════════════════════════════════════════════════
          BANNER — WorkflowMonitor style
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/70 hover:text-white text-[12px] font-black transition-colors shrink-0 px-3 py-2 rounded-xl hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Lead avatar + name */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-[15px] shadow-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {getInitials(lead.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight truncate">{lead.name}</h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium flex items-center gap-1.5">
              <Building2 size={11} /> {lead.company}
            </p>
          </div>

          {/* Deal value badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <DollarSign size={14} className="text-indigo-200" />
            <span className="text-[12px] font-black text-indigo-100">${parseFloat(lead.value).toLocaleString()}</span>
          </div>

          {/* Status badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <Layers size={14} className="text-indigo-200" />
            <span className="text-[12px] font-black text-indigo-100 capitalize">{lead.status}</span>
          </div>

          {/* AI Score badge if available */}
          {aiScore && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
              style={{ backgroundColor: 'rgba(99,102,241,0.35)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <BrainCircuit size={14} className="text-indigo-200" />
              <span className="text-[12px] font-black text-white">Score: {aiScore.score}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden min-h-0 mx-4 mt-3 mb-4 gap-3 anim-fade-2">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-[280px] flex flex-col gap-3 shrink-0 overflow-y-auto custom-scrollbar">

          {/* Contact info card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                  <Building2 size={13} className="text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 uppercase tracking-wider">Deal Info</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-100 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                    <DollarSign size={12} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Deal Value</p>
                    <p className="text-[14px] font-black text-emerald-600">${parseFloat(lead.value).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={12} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-[12px] font-semibold text-indigo-600 hover:underline truncate block">{lead.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-100 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={12} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-[12px] font-semibold text-slate-700">{lead.phone ? String(lead.phone) : 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags card */}
          {lead.tags_details && lead.tags_details.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-amber-400 rounded-full shrink-0" />
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shrink-0">
                    <Tag size={13} className="text-white" />
                  </div>
                  <h3 className="text-[12px] font-black text-slate-700 uppercase tracking-wider">Applied Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.tags_details.map(tag => (
                    <span
                      key={tag.id}
                      style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }}
                      className="px-2.5 py-1 text-[11px] font-black rounded-xl border"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick stats card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 bg-violet-500 rounded-full shrink-0" />
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
                  <TrendingUp size={13} className="text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 uppercase tracking-wider">Quick Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Activities', value: lead.activities?.length || 0,  bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
                  { label: 'Tasks',      value: lead.tasks?.length || 0,        bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
                  { label: 'Pending',    value: pendingTaskCount,               bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100' },
                  { label: 'Done',       value: (lead.tasks?.length || 0) - pendingTaskCount, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-[20px] font-black leading-tight ${s.text}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT WORKSPACE ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden anim-fade-3">

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-3">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <div className="px-5 flex gap-1 items-center py-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black transition-all relative ${
                    activeTab === tab.key
                      ? 'text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                  style={activeTab === tab.key ? {
                    background: `linear-gradient(125deg, ${
                      tab.key === 'activity' ? '#4f46e5, #7c3aed' :
                      tab.key === 'tasks'    ? '#7c3aed, #9333ea' :
                                              '#f59e0b, #f97316'
                    })`
                  } : {}}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-violet-100 text-violet-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-4 pb-4">

              {/* ══ ACTIVITY TAB ══ */}
              {activeTab === 'activity' && (
                <>
                  {/* Log activity card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                          <Activity size={13} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-700">Log Activity</h3>
                      </div>
                      <textarea
                        className={`${inputCls} resize-none min-h-[100px] mb-3`}
                        placeholder="Log a call summary, meeting notes, or email draft..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {[
                            { type: 'call' as const,    icon: Phone,      label: 'Call',    gradient: 'from-blue-500 to-blue-600' },
                            { type: 'email' as const,   icon: Mail,       label: 'Email',   gradient: 'from-indigo-500 to-violet-600' },
                            { type: 'meeting' as const, icon: Calendar,   label: 'Meeting', gradient: 'from-emerald-500 to-teal-600' },
                            { type: 'note' as const,    icon: StickyNote, label: 'Note',    gradient: 'from-amber-400 to-orange-500' },
                          ].map(({ type, icon: Icon, label, gradient }) => (
                            <button
                              key={type}
                              onClick={() => handleAddActivity(type)}
                              disabled={!note}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r ${gradient} text-white shadow-sm`}
                            >
                              <Icon size={12} /> {label}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handleAddActivity('note')}
                          disabled={loading || !note}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 disabled:opacity-40 shadow-sm"
                          style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
                        >
                          <Send size={12} /> Log Activity
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity timeline */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
                    <div className="px-5 pt-4 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-violet-500 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
                          <Clock size={13} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-700">Activity History</h3>
                        <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-lg border bg-violet-50 text-violet-600 border-violet-100">
                          {lead.activities?.length || 0} entries
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      {lead.activities && lead.activities.length > 0 ? (
                        <div className="relative border-l-2 border-indigo-100 ml-4 space-y-5">
                          {lead.activities.map((act) => {
                            const cfg = activityIconMap[act.activity_type] || activityIconMap.note;
                            return (
                              <div key={act.id} className="relative pl-7">
                                <div className={`absolute -left-[15px] top-1 w-7 h-7 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm border-2 border-white`}>
                                  {cfg.icon}
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-indigo-100 hover:bg-white hover:shadow-sm transition-all group">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[12px] font-black text-slate-800 capitalize flex items-center gap-1.5">
                                      Logged {act.activity_type}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                      <Clock size={9} />
                                      {new Date(act.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-slate-600 leading-relaxed">{act.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                            <StickyNote size={20} className="text-indigo-300" />
                          </div>
                          <p className="text-[13px] font-black text-slate-500">No activity yet</p>
                          <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Log a call or note above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ══ TASKS TAB ══ */}
              {activeTab === 'tasks' && (
                <>
                  {/* Add task card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 bg-violet-500 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
                          <CheckSquare size={13} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-700">Add New Task</h3>
                      </div>
                      <form onSubmit={handleAddTask} className="space-y-3">
                        <input
                          type="text"
                          placeholder="What needs to be done?"
                          className={inputCls}
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          required
                        />
                        <div className="flex gap-3">
                          <input
                            type="datetime-local"
                            className={`${inputCls} flex-1`}
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            required
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 disabled:opacity-40 shadow-sm shrink-0"
                            style={{ background: 'linear-gradient(125deg, #7c3aed 0%, #9333ea 100%)' }}
                          >
                            Add Task
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Task list card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="px-5 pt-4 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                          <Layers size={13} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-700">All Tasks</h3>
                        <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-lg border bg-violet-50 text-violet-600 border-violet-100">
                          {pendingTaskCount} pending
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      {lead.tasks && lead.tasks.length > 0 ? (
                        <div className="space-y-2.5">
                          {lead.tasks.map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                                task.is_completed
                                  ? 'bg-emerald-50 border-emerald-100'
                                  : 'bg-slate-50 border-slate-100 hover:border-indigo-100 hover:bg-white'
                              }`}
                            >
                              {/* Status toggle pill — replaces checkbox */}
                              <button
                                onClick={async () => { await api.toggleTask(task.id, !task.is_completed); onUpdate(); }}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 border ${
                                  task.is_completed
                                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.is_completed ? 'bg-white' : 'bg-slate-300'}`} />
                                {task.is_completed ? 'Done' : 'Pending'}
                              </button>

                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-black leading-tight ${task.is_completed ? 'text-emerald-600 line-through decoration-emerald-400' : 'text-slate-800'}`}>
                                  {task.title}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5">
                                  <Calendar size={11} />
                                  {new Date(task.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                          <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                            <CheckSquare size={20} className="text-violet-300" />
                          </div>
                          <p className="text-[13px] font-black text-slate-500">No tasks yet</p>
                          <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Add a task above to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ══ AI COPILOT TAB ══ */}
              {activeTab === 'ai' && (
                <>
                  {/* Win Probability Score */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-12 bg-indigo-500 rounded-full shrink-0" />
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                            <Target size={15} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-black text-slate-800">Win Probability Score</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">AI evaluates this lead's data to predict likelihood to close.</p>
                          </div>
                        </div>
                        {!aiScore ? (
                          <button
                            onClick={fetchAIScore}
                            disabled={loadingAI === 'score'}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 disabled:opacity-60 shadow-sm shrink-0"
                            style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
                          >
                            {loadingAI === 'score' ? <Sparkles className="animate-spin" size={13} /> : <Target size={13} />}
                            Calculate Score
                          </button>
                        ) : (
                          <div className="text-right shrink-0">
                            <span className="text-4xl font-black text-indigo-600">{aiScore.score}</span>
                            <span className="text-lg text-indigo-300 font-bold">/100</span>
                          </div>
                        )}
                      </div>
                      {aiScore && (
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2">Strengths</p>
                            <ul className="space-y-1.5">
                              {aiScore.strengths.map((s: any, i: any) => (
                                <li key={i} className="text-[12px] text-slate-700 flex items-start gap-2">
                                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-2">Risk Factors</p>
                            <ul className="space-y-1.5">
                              {aiScore.weaknesses.map((w: any, i: any) => (
                                <li key={i} className="text-[12px] text-slate-700 flex items-start gap-2">
                                  <ShieldAlert size={13} className="text-red-400 shrink-0 mt-0.5" />{w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Executive Briefing */}
                  <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)' }}>
                    <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-12 bg-blue-400 rounded-full shrink-0" />
                          <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <BrainCircuit size={15} className="text-blue-300" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-black text-white">Executive Briefing</h3>
                            <p className="text-[11px] text-indigo-300 font-medium mt-0.5">A 30-second summary reading all past notes and tasks.</p>
                          </div>
                        </div>
                        {!aiSummary && (
                          <button
                            onClick={fetchAISummary}
                            disabled={loadingAI === 'summary'}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 disabled:opacity-60 shrink-0"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                          >
                            {loadingAI === 'summary' ? 'Reading...' : 'Generate Briefing'}
                          </button>
                        )}
                      </div>
                      {aiSummary && (
                        <div className="mt-5 space-y-4">
                          <p className="text-[14px] font-semibold leading-relaxed p-4 rounded-xl text-white italic"
                            style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            "{aiSummary.one_line_summary}"
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <p className="text-[10px] font-black text-blue-300 uppercase tracking-wider mb-2">Current Situation</p>
                              <p className="text-[12px] text-indigo-200 leading-relaxed">{aiSummary.current_situation}</p>
                            </div>
                            <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <p className="text-[10px] font-black text-blue-300 uppercase tracking-wider mb-2">Talking Points</p>
                              <ul className="space-y-1.5 text-[12px] text-indigo-200">
                                {aiSummary.recommended_talking_points?.map((pt: any, i: any) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-blue-400 shrink-0">·</span>{pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sales Coach: Next Action */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-12 bg-emerald-500 rounded-full shrink-0" />
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shrink-0">
                            <Zap size={15} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-black text-slate-800">Sales Coach: Next Action</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Get AI advice on exactly what to do next to close this deal.</p>
                          </div>
                        </div>
                        {!aiNextAction && (
                          <button
                            onClick={fetchAINextAction}
                            disabled={loadingAI === 'nextAction'}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black text-white transition-all active:scale-95 disabled:opacity-60 shadow-sm shrink-0"
                            style={{ background: 'linear-gradient(125deg, #10b981 0%, #0d9488 100%)' }}
                          >
                            {loadingAI === 'nextAction' ? 'Analyzing...' : 'Get Advice'}
                          </button>
                        )}
                      </div>
                      {aiNextAction && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm">{aiNextAction.priority}</span>
                            <span className="font-black text-slate-800 text-[13px]">{aiNextAction.action}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 mb-3 leading-relaxed">{aiNextAction.reason}</p>
                          <div className="bg-white rounded-xl p-3.5 border border-emerald-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Suggested Script / Opener</p>
                            <p className="text-[13px] italic font-semibold text-slate-700">"{aiNextAction.script_opener}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Message Writer */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 bg-amber-400 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shrink-0">
                          <Sparkles size={13} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-800">AI Message Writer</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { label: 'Channel', key: 'type',    options: [['email','Email'],['whatsapp','WhatsApp'],['linkedin','LinkedIn']] },
                          { label: 'Tone',    key: 'tone',    options: [['professional','Professional'],['casual','Friendly'],['urgent','Urgent']] },
                          { label: 'Purpose', key: 'purpose', options: [['introduction','Introduction'],['follow_up','Follow Up'],['closing','Closing Push']] },
                        ].map(({ label, key, options }) => (
                          <div key={key}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">{label}</label>
                            <select
                              value={(writerParams as any)[key]}
                              onChange={e => setWriterParams({ ...writerParams, [key]: e.target.value })}
                              className={selectCls}
                            >
                              {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleAIWrite}
                        disabled={loadingAI === 'write'}
                        className="w-full py-3 rounded-xl text-[13px] font-black text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 shadow-sm"
                        style={{ background: 'linear-gradient(125deg, #f59e0b 0%, #f97316 100%)' }}
                      >
                        {loadingAI === 'write' ? <Sparkles className="animate-spin" size={14} /> : <Send size={14} />}
                        {loadingAI === 'write' ? 'Drafting…' : 'Generate Draft'}
                      </button>

                      {aiDraft && (
                        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                          {aiDraft.subject && (
                            <div className="mb-3 pb-3 border-b border-slate-200">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject:</span>
                              <span className="font-black text-[13px] text-slate-800 ml-2">{aiDraft.subject}</span>
                            </div>
                          )}
                          <pre className="whitespace-pre-wrap text-[13px] text-slate-700 font-sans leading-relaxed">{aiDraft.message}</pre>
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => navigator.clipboard.writeText(aiDraft.message)}
                              className="flex items-center gap-1.5 text-[11px] font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              Copy to Clipboard
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Micro-components (unchanged signatures) ── */
const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`pb-4 pt-1 text-[14px] font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
      active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon} {label}
  </button>
);

const IconBtn = ({ icon: Icon, onClick, label }: any) => (
  <button onClick={onClick} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors" title={label}>
    <Icon size={18} />
  </button>
);