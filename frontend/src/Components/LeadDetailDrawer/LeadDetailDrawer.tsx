import React, { useState, useEffect } from 'react';
import { 
  X, Phone, Mail, Calendar, CheckSquare, Send, Sparkles, 
  StickyNote, Clock, ArrowLeft, Building2, Tag, DollarSign,
  BrainCircuit, Target, ShieldAlert, Zap
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

  // AI API Calls
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

  const activityColors: Record<string, string> = {
    call: 'bg-blue-500',
    email: 'bg-indigo-500',
    meeting: 'bg-emerald-500',
    note: 'bg-amber-500',
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col font-sans h-screen w-screen overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[13px] font-semibold transition-colors">
          <ArrowLeft size={16} /> Back to Pipeline
        </button>
        <div className="flex items-center gap-3">
          {aiScore && (
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm">
              <BrainCircuit size={14} /> Score: {aiScore.score}/100
            </span>
          )}
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wide rounded border border-slate-200">
            {lead.status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
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
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">About this deal</h3>
              <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 space-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><DollarSign size={12}/> Deal Value</p>
                  <p className="text-[14px] font-semibold text-emerald-600">${parseFloat(lead.value).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><Mail size={12}/> Email</p>
                  <a href={`mailto:${lead.email}`} className="text-[13px] font-medium text-blue-600 hover:underline">{lead.email}</a>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5"><Phone size={12}/> Phone</p>
                  {/* FIXED LINE HERE */}
                  <p className="text-[13px] font-medium text-slate-800">{lead.phone ? String(lead.phone) : 'Not provided'}</p>
                </div>
              </div>
            </div>

            {lead.tags_details && lead.tags_details.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag size={12} /> Applied Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags_details.map(tag => (
                    <span key={tag.id} style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }} className="px-2.5 py-1 text-[12px] font-semibold rounded-md border">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          
          <div className="bg-white border-b border-slate-200 px-8 pt-4 shrink-0 flex gap-8">
            <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="Activity" />
            <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label={`Tasks (${lead.tasks?.filter(t => !t.is_completed).length || 0})`} />
            <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Copilot" icon={<Sparkles size={14} className="mb-0.5 text-indigo-600" />} />
          </div>

          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              
              {/* ACTIVITY TAB */}
              {activeTab === 'activity' && (
                <div>
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
                      <button onClick={() => handleAddActivity('note')} disabled={loading || !note} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm">
                        Log Activity
                      </button>
                    </div>
                  </div>

                  <div className="relative border-l-2 border-slate-200 ml-6 space-y-8 pb-8">
                    {lead.activities && lead.activities.length > 0 ? (
                      lead.activities.map((act) => (
                        <div key={act.id} className="relative pl-8">
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
                            <p className="text-[13px] text-slate-600 leading-relaxed mt-1">{act.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-8 py-10 text-center flex flex-col items-center">
                        <StickyNote className="text-slate-300 mb-3" size={32} />
                        <p className="text-[14px] font-medium text-slate-500">No activity history yet</p>
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
                      <input type="datetime-local" className="flex-1 text-[13px] border border-slate-200 rounded-md p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-slate-600" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} required />
                      <button type="submit" disabled={loading} className="bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 shadow-sm">
                        Add Task
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-4">
                    {lead.tasks && lead.tasks.length > 0 ? (
                      lead.tasks.map((task) => (
                        <div key={task.id} className="group flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all">
                          <input type="checkbox" checked={task.is_completed} onChange={async () => { await api.toggleTask(task.id, !task.is_completed); onUpdate(); }} className="mt-0.5 h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                          <div className="flex-1">
                            <p className={`text-[14px] font-medium leading-tight ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
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

              {/* AI COPILOT TAB */}
              {activeTab === 'ai' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* AI Score Card */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-indigo-600"><Target size={100} /></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1"><Target size={18} className="text-indigo-600"/> Win Probability Score</h3>
                        <p className="text-[13px] text-slate-500">Let AI evaluate this lead's data to predict likelihood to close.</p>
                      </div>
                      {!aiScore ? (
                        <button onClick={fetchAIScore} disabled={loadingAI === 'score'} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition">
                          {loadingAI === 'score' ? <Sparkles className="animate-spin" size={16}/> : 'Calculate Score'}
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="text-4xl font-black text-indigo-600">{aiScore.score}<span className="text-lg text-indigo-300">/100</span></span>
                        </div>
                      )}
                    </div>
                    {aiScore && (
                      <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-6 relative z-10">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Strengths</p>
                          <ul className="space-y-1 text-[13px] text-slate-700">
                            {aiScore.strengths.map((s:any, i:any) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Factors</p>
                          <ul className="space-y-1 text-[13px] text-slate-700">
                            {aiScore.weaknesses.map((w:any, i:any) => <li key={i} className="flex items-start gap-2"><span className="text-rose-500 mt-0.5">!</span>{w}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Summary Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="font-bold flex items-center gap-2 mb-1"><BrainCircuit size={18} className="text-blue-400"/> Executive Briefing</h3>
                        <p className="text-[13px] text-slate-400">A 30-second summary reading all past notes and tasks.</p>
                      </div>
                      {!aiSummary && (
                        <button onClick={fetchAISummary} disabled={loadingAI === 'summary'} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition">
                          {loadingAI === 'summary' ? 'Reading Data...' : 'Generate Briefing'}
                        </button>
                      )}
                    </div>
                    {aiSummary && (
                      <div className="mt-5 space-y-4 relative z-10">
                        <p className="text-[15px] font-medium leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">"{aiSummary.one_line_summary}"</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">Current Situation</p>
                            <p className="text-[13px] text-slate-300 leading-relaxed">{aiSummary.current_situation}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">Talking Points for Next Call</p>
                            <ul className="space-y-1.5 text-[13px] text-slate-300 list-disc list-inside pl-2">
                              {aiSummary.recommended_talking_points?.map((pt:any, i:any) => <li key={i}>{pt}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Next Action Card */}
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-1"><Zap size={18}/> Sales Coach: Next Action</h3>
                        <p className="text-[13px] text-emerald-700">Get AI advice on exactly what to do next to close this deal.</p>
                      </div>
                      {!aiNextAction && (
                         <button onClick={fetchAINextAction} disabled={loadingAI === 'nextAction'} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition">
                           {loadingAI === 'nextAction' ? 'Analyzing...' : 'Get Advice'}
                         </button>
                      )}
                    </div>
                    {aiNextAction && (
                      <div className="mt-5 bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-1 rounded">{aiNextAction.priority}</span>
                          <span className="font-bold text-slate-800">{aiNextAction.action}</span>
                        </div>
                        <p className="text-[13px] text-slate-600 mb-4">{aiNextAction.reason}</p>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Suggested Script / Opener</p>
                          <p className="text-[13px] italic font-medium text-slate-700">"{aiNextAction.script_opener}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Message Writer */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Sparkles size={18} className="text-amber-500"/> AI Message Writer</h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Channel</label>
                        <select value={writerParams.type} onChange={e=>setWriterParams({...writerParams, type: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Tone</label>
                        <select value={writerParams.tone} onChange={e=>setWriterParams({...writerParams, tone: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
                          <option value="professional">Professional</option>
                          <option value="casual">Friendly</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Purpose</label>
                        <select value={writerParams.purpose} onChange={e=>setWriterParams({...writerParams, purpose: e.target.value})} className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500">
                          <option value="introduction">Introduction</option>
                          <option value="follow_up">Follow Up</option>
                          <option value="closing">Closing Push</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={handleAIWrite} disabled={loadingAI === 'write'} className="w-full bg-slate-800 text-white py-3 rounded-lg text-[13px] font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2">
                      {loadingAI === 'write' ? <Sparkles className="animate-spin" size={16} /> : <Send size={16} />} 
                      {loadingAI === 'write' ? 'Drafting...' : 'Generate Draft'}
                    </button>

                    {aiDraft && (
                      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5 animate-fade-in">
                        {aiDraft.subject && <div className="mb-3 pb-3 border-b border-slate-200"><span className="text-[11px] font-bold text-slate-400 uppercase">Subject:</span> <span className="font-semibold text-[14px] ml-2">{aiDraft.subject}</span></div>}
                        <pre className="whitespace-pre-wrap text-[14px] text-slate-700 font-sans leading-relaxed">{aiDraft.message}</pre>
                        <div className="mt-4 flex justify-end">
                           <button onClick={() => navigator.clipboard.writeText(aiDraft.message)} className="text-blue-600 text-sm font-bold hover:underline">Copy to Clipboard</button>
                        </div>
                      </div>
                    )}
                  </div>

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
  <button onClick={onClick} className={`pb-4 pt-1 text-[14px] font-semibold border-b-2 transition-all flex items-center gap-1.5 ${ active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800' }`}>
    {icon} {label}
  </button>
);

const IconBtn = ({ icon: Icon, onClick, label }: any) => (
  <button onClick={onClick} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded transition-colors" title={label}>
    <Icon size={18} />
  </button>
);