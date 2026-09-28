import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit, Send, Sparkles, AlertTriangle, TrendingUp,
  Target, Loader2, Trash2, Bell, Zap, Search,
  CheckCircle2, XCircle, Clock, ArrowRight
} from 'lucide-react';
import { api } from '../Utils/api';
import type { AIAlert, ChatResponse } from '../Utils/types';

/* ═══════════════════════════════════════════════════════
   ALL ORIGINAL FUNCTIONS ARE UNTOUCHED — UI only
═══════════════════════════════════════════════════════ */

const STYLES = `
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
    50%     { transform:translateY(-12px) translateX(6px); }
  }
  @keyframes pulseRing {
    0%   { transform:scale(1);   opacity:.5; }
    100% { transform:scale(1.7); opacity:0; }
  }
  @keyframes slideInMsg {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .anim-blob   { animation:floatBlob 7s ease-in-out infinite; }
  .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
  .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
  .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
  .msg-in { animation:slideInMsg .25s ease-out forwards; }
  .shimmer-overlay {
    position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
    background-size:200% 100%;
    animation:shimmer 4s ease-in-out infinite;
  }
  .pulse-ring::after {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:rgba(99,102,241,0.4);
    animation:pulseRing 1.5s ease-out infinite;
  }

  /* tab content cards */
  .tab-card {
    border-radius:18px;
    border:1.5px solid #e0e7ff;
    box-shadow:0 4px 24px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04);
    overflow:hidden;
    transition:box-shadow .25s ease;
  }

  /* alert / digest cards */
  .inner-card { transition:all .2s cubic-bezier(0.34,1.1,0.64,1); }
  .inner-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(79,70,229,0.12); }

  /* tab buttons */
  .tab-btn { transition:all .18s ease; }
  .tab-btn:hover { transform:translateY(-1px); }

  /* send/search CTA */
  .btn-cta { transition:all .2s cubic-bezier(0.34,1.2,0.64,1); }
  .btn-cta:hover  { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 20px rgba(79,70,229,0.4) !important; }
  .btn-cta:active { transform:scale(0.97); }

  /* search table rows */
  .search-row { transition:background .15s ease, transform .15s ease; }
  .search-row:hover { background:#eef2ff; transform:translateX(3px); }

  /* alert cards */
  .alert-card { transition:all .2s ease; }
  .alert-card:hover { transform:translateX(3px); box-shadow:0 4px 16px rgba(0,0,0,0.08); }

  /* digest inner cards */
  .digest-card { transition:all .2s cubic-bezier(0.34,1.1,0.64,1); }
  .digest-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(79,70,229,0.1); }

  /* input focus */
  .chat-input:focus {
    outline:none;
    border-color:#6366f1;
    box-shadow:0 0 0 4px rgba(99,102,241,0.14);
    background:#ffffff;
  }
`;

const PRIORITY_STYLES: Record<string, {
  bar: string; bg: string; border: string; glow: string;
  badge: { bg: string; text: string; border: string };
}> = {
  critical: { bar:'linear-gradient(90deg,#ef4444,#f43f5e)', bg:'#fff1f2', border:'#fecdd3', glow:'rgba(239,68,68,0.12)',
    badge:{ bg:'#fee2e2', text:'#be123c', border:'#fca5a5' } },
  high:     { bar:'linear-gradient(90deg,#f97316,#fb923c)', bg:'#fff7ed', border:'#fed7aa', glow:'rgba(249,115,22,0.12)',
    badge:{ bg:'#ffedd5', text:'#c2410c', border:'#fdba74' } },
  medium:   { bar:'linear-gradient(90deg,#f59e0b,#fbbf24)', bg:'#fffbeb', border:'#fde68a', glow:'rgba(245,158,11,0.12)',
    badge:{ bg:'#fef3c7', text:'#b45309', border:'#fde68a' } },
  low:      { bar:'linear-gradient(90deg,#94a3b8,#cbd5e1)', bg:'#f8fafc', border:'#e2e8f0', glow:'rgba(100,116,139,0.08)',
    badge:{ bg:'#f1f5f9', text:'#475569', border:'#e2e8f0' } },
};

export const AICommandCenter: React.FC = () => {
  const [tab, setTab] = useState<'chat' | 'alerts' | 'digest' | 'search'>('chat');

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput]       = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [unread, setUnread] = useState(0);

  const [digest, setDigest]             = useState<any>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  const [searchQ, setSearchQ]         = useState('');
  const [searchRes, setSearchRes]     = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { loadAlerts(); loadUnread(); loadHistory(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const loadAlerts  = () => api.aiGetAlerts(false).then(setAlerts).catch(() => {});
  const loadUnread  = () => api.aiUnreadCount().then(d => setUnread(d.unread || 0)).catch(() => {});
  const loadHistory = () => api.aiChatHistory().then(d => { if (d.messages) setMessages(d.messages); }).catch(() => {});

  const sendChat = async () => {
    if (!input.trim()) return;
    const msg = input; setInput('');
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setChatLoading(true);
    try {
      const res: ChatResponse = await api.aiChat(msg);
      const assistantText =
        (res?.response && String(res.response).trim()) ||
        (res as any)?.error ||
        'AI returned no response. Please check backend AI config.';
      setMessages(prev => [...prev, { role:'assistant', content:assistantText }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Sorry, something went wrong.' }]);
    }
    setChatLoading(false);
  };

  const clearChat   = async () => { await api.aiChatClear(); setMessages([]); };
  const doDigest    = async () => { setDigestLoading(true); try { setDigest(await api.aiDailyDigest()); } catch(e) { console.error(e); } setDigestLoading(false); };
  const doSearch    = async () => { if (!searchQ.trim()) return; setSearchLoading(true); try { setSearchRes(await api.aiSearch(searchQ)); } catch(e) { console.error(e); } setSearchLoading(false); };
  const markRead    = async (id: number) => { await api.aiMarkAlertRead(id); loadAlerts(); loadUnread(); };
  const markAllRead = async () => { await api.aiMarkAllRead(); loadAlerts(); loadUnread(); };

  const quickQuestions  = ['Which leads should I focus on today?','Show me at-risk deals','Pipeline health check','Any overdue follow-ups?'];
  const searchSuggestions = ['Show all hot leads','Deals over ₹1 Cr','Leads from LinkedIn','New leads this week'];

  const TAB_CONFIG = [
    { id:'chat'   as const, label:'AI Assistant', icon:BrainCircuit, badge:null,        accent:'#4f46e5' },
    { id:'alerts' as const, label:'Alerts',       icon:Bell,         badge:unread||null, accent:'#ef4444' },
    { id:'digest' as const, label:'Daily Digest', icon:Zap,          badge:null,        accent:'#f59e0b' },
    { id:'search' as const, label:'AI Search',    icon:Search,       badge:null,        accent:'#4f46e5' },
  ];

  const TAB_ACCENT: Record<string, string> = {
    chat:   'linear-gradient(90deg,#4f46e5,#7c3aed)',
    alerts: 'linear-gradient(90deg,#ef4444,#f97316)',
    digest: 'linear-gradient(90deg,#f59e0b,#f97316)',
    search: 'linear-gradient(90deg,#4f46e5,#7c3aed)',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans"
      style={{ background:'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>
      <style>{STYLES}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay:'3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative f1"
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
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">AI Command Center</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Chat with your CRM, get alerts, daily briefings, and natural-language search.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {unread > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black text-white animate-pulse"
                style={{ backgroundColor:'rgba(239,68,68,0.35)', border:'1px solid rgba(255,100,100,0.4)', backdropFilter:'blur(4px)' }}>
                <Bell size={13} />
                <span className="text-white/70">Unread</span>
                <span>{unread}</span>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ══════════════════ TAB BAR ══════════════════ */}
      <div className="mx-4 mt-4 bg-white shrink-0 f2"
        style={{ borderRadius:'18px', border:'1.5px solid #e0e7ff', boxShadow:'0 4px 16px rgba(79,70,229,0.07),0 1px 4px rgba(0,0,0,0.04)' }}>
        <div className="h-[3px] w-full rounded-t-[18px]" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
        <div className="flex px-2 pt-1.5 gap-1 pb-1">
          {TAB_CONFIG.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`tab-btn relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                  active ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700'
                }`}
                style={active ? { background:'#eef2ff', border:'1.5px solid #c7d2fe' } : { border:'1.5px solid transparent' }}>
                <t.icon size={15} />
                {t.label}
                {t.badge !== null && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full text-white text-[9px] font-black shrink-0"
                    style={{ background:'linear-gradient(135deg,#ef4444,#f43f5e)', boxShadow:'0 2px 8px rgba(239,68,68,0.4)' }}>
                    {t.badge}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-[-5px] left-3 right-3 h-[3px] rounded-full"
                    style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════ TAB CONTENT ══════════════════ */}
      <div className="flex-1 min-h-0 mx-4 mt-3 mb-4 f3">

        {/* ── CHAT TAB ── */}
        {tab === 'chat' && (
          <div className="tab-card flex flex-col h-full bg-white">
            <div className="h-[3px] w-full shrink-0" style={{ background: TAB_ACCENT.chat }} />

            {/* messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-5">
                    <span className="pulse-ring absolute inset-0 rounded-full" />
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
                      <BrainCircuit size={28} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-black text-slate-800 mb-1">AI CRM Assistant</h3>
                  <p className="text-[13px] text-slate-400 font-medium mb-6 max-w-xs">
                    Ask me anything about your pipeline, leads, tasks, or deals.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {quickQuestions.map(q => (
                      <button key={q} onClick={() => setInput(q)}
                        className="px-3.5 py-2 rounded-xl text-[12px] font-black text-indigo-600 transition-all active:scale-95"
                        style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#e0e7ff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#eef2ff'; }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex msg-in ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-0.5"
                      style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 10px rgba(79,70,229,0.35)' }}>
                      <BrainCircuit size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[72%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                    m.role === 'user' ? 'text-white rounded-br-sm' : 'text-slate-700 rounded-bl-sm'
                  }`}
                    style={m.role === 'user'
                      ? { background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.3)' }
                      : { background:'#f8fafc', border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start msg-in">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mr-2"
                    style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 10px rgba(79,70,229,0.35)' }}>
                    <BrainCircuit size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
                    style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                    <span className="text-[13px] font-black text-slate-500">Analyzing CRM data…</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* input bar */}
            <div className="shrink-0 px-4 py-3 flex gap-2 items-center"
              style={{ borderTop:'1.5px solid #eef2ff', background:'linear-gradient(90deg,#ffffff,#fafbff)' }}>
              <button onClick={clearChat}
                className="p-2.5 rounded-xl transition-all"
                style={{ color:'#cbd5e1', border:'1.5px solid #e2e8f0' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background='#fff1f2'; b.style.color='#f43f5e'; b.style.borderColor='#fca5a5'; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background=''; b.style.color='#cbd5e1'; b.style.borderColor='#e2e8f0'; }}
                title="Clear chat">
                <Trash2 size={15} />
              </button>
              <input type="text" placeholder="Ask your CRM anything…"
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                className="chat-input flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium text-slate-700 placeholder:text-slate-300 transition-all duration-200"
                style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }} />
              <button onClick={sendChat} disabled={chatLoading || !input.trim()}
                className="btn-cta p-3 rounded-xl text-white disabled:opacity-40"
                style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {tab === 'alerts' && (
          <div className="tab-card flex flex-col h-full bg-white" style={{ border:'1.5px solid #ffe4e6' }}>
            <div className="h-[3px] w-full shrink-0" style={{ background:TAB_ACCENT.alerts }} />

            {/* header */}
            <div className="shrink-0 px-6 py-4 flex items-center justify-between"
              style={{ borderBottom:'1.5px solid #fef2f2', background:'linear-gradient(90deg,#ffffff,#fff8f8)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'linear-gradient(135deg,#ef4444,#f97316)', boxShadow:'0 4px 14px rgba(239,68,68,0.35)' }}>
                  <Bell size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-[17px] font-black text-slate-800 leading-tight">AI-Generated Alerts</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={markAllRead}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-black transition-all"
                style={{ background:'#ecfdf5', border:'1.5px solid #a7f3d0', color:'#065f46' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#d1fae5'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#ecfdf5'; }}>
                <CheckCircle2 size={13} /> Mark all read
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background:'#ecfdf5', border:'1.5px dashed #a7f3d0' }}>
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-[15px] font-black text-slate-500">All clear!</p>
                  <p className="text-[13px] text-slate-400 font-medium mt-0.5">No unread alerts.</p>
                </div>
              ) : (
                alerts.map((alert, idx) => {
                  const ps = PRIORITY_STYLES[alert.priority] || PRIORITY_STYLES.medium;
                  return (
                    <div key={alert.id}
                      className="alert-card rounded-2xl overflow-hidden"
                      style={{ background:ps.bg, border:`1.5px solid ${ps.border}`, boxShadow:`0 2px 12px ${ps.glow}`, animationDelay:`${idx*40}ms` }}>
                      <div className="h-[3px] w-full" style={{ background:ps.bar }} />
                      <div className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg"
                                style={{ background:'#ffffff', border:'1px solid #e2e8f0', color:'#64748b' }}>
                                {alert.alert_type.replace(/_/g,' ')}
                              </span>
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg"
                                style={{ background:ps.badge.bg, color:ps.badge.text, border:`1px solid ${ps.badge.border}` }}>
                                {alert.priority}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(alert.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[13px] font-black text-slate-800 mb-0.5">{alert.title}</p>
                            <p className="text-[12px] text-slate-500 font-medium">{alert.description}</p>
                            {alert.suggested_action && (
                              <div className="mt-2.5 rounded-xl overflow-hidden">
                                <div className="h-[2px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                                <div className="px-3 py-2" style={{ background:'#eef2ff', border:'1px solid #c7d2fe', borderTop:'none' }}>
                                  <p className="text-[12px] text-indigo-700 font-medium">
                                    <span className="font-black">💡 </span>{alert.suggested_action}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <button onClick={() => markRead(alert.id)}
                            className="p-2.5 rounded-xl transition-all shrink-0"
                            style={{ color:'#cbd5e1', border:'1.5px solid #e2e8f0' }}
                            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background='#ecfdf5'; b.style.color='#10b981'; b.style.borderColor='#a7f3d0'; }}
                            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background=''; b.style.color='#cbd5e1'; b.style.borderColor='#e2e8f0'; }}
                            title="Mark as read">
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── DIGEST TAB ── */}
        {tab === 'digest' && (
          <div className="tab-card flex flex-col h-full bg-white" style={{ border:'1.5px solid #fef3c7' }}>
            <div className="h-[3px] w-full shrink-0" style={{ background:TAB_ACCENT.digest }} />

            <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!digest ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-5">
                    <span className="pulse-ring absolute inset-0 rounded-full" />
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow:'0 8px 24px rgba(245,158,11,0.4)' }}>
                      <Zap size={26} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-black text-slate-800 mb-1">AI Daily Digest</h3>
                  <p className="text-[13px] text-slate-400 font-medium mb-6">Your AI-powered morning briefing</p>
                  <button onClick={doDigest} disabled={digestLoading}
                    className="btn-cta flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-black text-white disabled:opacity-50"
                    style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow:'0 6px 20px rgba(245,158,11,0.4)' }}>
                    {digestLoading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
                    Generate Today's Digest
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-4">

                  {/* Hero */}
                  <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                    style={{ background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)', boxShadow:'0 8px 32px rgba(79,70,229,0.3)' }}>
                    <div className="shimmer-overlay" />
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                      style={{ background:'radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)', filter:'blur(40px)' }} />
                    <div className="relative z-10">
                      <p className="text-indigo-300 text-[12px] font-black uppercase tracking-wider mb-1">{digest.greeting}</p>
                      <h2 className="text-[20px] font-black mb-4 leading-tight">{digest.headline}</h2>
                      <div className="flex items-end gap-2">
                        <span className="text-[44px] font-black leading-none">{digest.day_score}</span>
                        <span className="text-indigo-300 text-[13px] font-bold pb-1">/10 day score</span>
                      </div>
                    </div>
                  </div>

                  {/* Priorities */}
                  {digest.top_priorities?.length > 0 && (
                    <div className="digest-card bg-white rounded-2xl overflow-hidden"
                      style={{ border:'1.5px solid #fecdd3', boxShadow:'0 4px 16px rgba(239,68,68,0.08)' }}>
                      <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f43f5e,#f97316)' }} />
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background:'linear-gradient(135deg,#ef4444,#f97316)', boxShadow:'0 4px 12px rgba(239,68,68,0.35)' }}>
                            <Target size={17} className="text-white" />
                          </div>
                          <div>
                            <p className="text-[15px] font-black text-slate-800 leading-tight">Top Priorities</p>
                            <p className="text-[12px] text-slate-400 font-medium mt-0.5">Action items for today</p>
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          {digest.top_priorities.map((p: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-xl"
                              style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                              <p className="text-[13px] font-black text-slate-800 mb-0.5">{p.priority}</p>
                              <p className="text-[12px] text-slate-400 font-medium">{p.why}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <ArrowRight size={11} className="text-indigo-400" />
                                <p className="text-[12px] text-indigo-600 font-black">{p.action}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wins + Warnings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {digest.wins?.length > 0 && (
                      <div className="digest-card bg-white rounded-2xl overflow-hidden"
                        style={{ border:'1.5px solid #a7f3d0', boxShadow:'0 4px 16px rgba(16,185,129,0.08)' }}>
                        <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#10b981,#0d9488)' }} />
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background:'linear-gradient(135deg,#10b981,#0d9488)', boxShadow:'0 4px 10px rgba(16,185,129,0.35)' }}>
                              <CheckCircle2 size={15} className="text-white" />
                            </div>
                            <p className="text-[14px] font-black text-slate-800">Wins</p>
                          </div>
                          <div className="space-y-1.5">
                            {digest.wins.map((w: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl"
                                style={{ background:'#ecfdf5', border:'1px solid #a7f3d0' }}>
                                <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-emerald-800 font-medium">{w}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {digest.warnings?.length > 0 && (
                      <div className="digest-card bg-white rounded-2xl overflow-hidden"
                        style={{ border:'1.5px solid #fecdd3', boxShadow:'0 4px 16px rgba(239,68,68,0.08)' }}>
                        <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#f43f5e,#f97316)' }} />
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background:'linear-gradient(135deg,#ef4444,#f43f5e)', boxShadow:'0 4px 10px rgba(239,68,68,0.35)' }}>
                              <AlertTriangle size={15} className="text-white" />
                            </div>
                            <p className="text-[14px] font-black text-slate-800">Warnings</p>
                          </div>
                          <div className="space-y-1.5">
                            {digest.warnings.map((w: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl"
                                style={{ background:'#fff1f2', border:'1px solid #fecdd3' }}>
                                <XCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-red-800 font-medium">{w}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pipeline Insight */}
                  {digest.pipeline_insight && (
                    <div className="digest-card bg-white rounded-2xl overflow-hidden"
                      style={{ border:'1.5px solid #bfdbfe', boxShadow:'0 4px 16px rgba(59,130,246,0.08)' }}>
                      <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#3b82f6,#6366f1)' }} />
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow:'0 4px 10px rgba(59,130,246,0.35)' }}>
                          <TrendingUp size={15} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-slate-700 mb-0.5">Pipeline Insight</p>
                          <p className="text-[12px] text-slate-500 font-medium">{digest.pipeline_insight}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Motivation */}
                  {digest.motivation && (
                    <div className="rounded-2xl p-5 text-center"
                      style={{ background:'linear-gradient(125deg,#eef2ff,#f5f3ff)', border:'1.5px solid #c7d2fe' }}>
                      <p className="text-[14px] font-black text-indigo-700 italic leading-relaxed">"{digest.motivation}"</p>
                    </div>
                  )}

                  {/* Regen */}
                  <button onClick={doDigest} disabled={digestLoading}
                    className="w-full py-3 rounded-xl text-[13px] font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                    style={{ background:'#fffbeb', border:'1.5px solid #fde68a', color:'#b45309' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#fef3c7'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#fffbeb'; }}>
                    <Sparkles size={14} /> Regenerate Digest
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SEARCH TAB ── */}
        {tab === 'search' && (
          <div className="tab-card flex flex-col h-full bg-white">
            <div className="h-[3px] w-full shrink-0" style={{ background:TAB_ACCENT.search }} />

            <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {/* header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
                  <Search size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-[17px] font-black text-slate-800 leading-tight">Natural Language Search</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">Search your CRM in plain English</p>
                </div>
              </div>

              {/* input row */}
              <div className="flex gap-3 mb-4">
                <input type="text"
                  placeholder='e.g. "hot leads in negotiation with value over 50k"'
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  className="chat-input flex-1 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 placeholder:text-slate-300 transition-all duration-200"
                  style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }} />
                <button onClick={doSearch} disabled={searchLoading || !searchQ.trim()}
                  className="btn-cta flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black text-white disabled:opacity-40 shrink-0"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
                  {searchLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                  Search
                </button>
              </div>

              {/* chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {searchSuggestions.map(q => (
                  <button key={q} onClick={() => setSearchQ(q)}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-black text-indigo-600 transition-all active:scale-95"
                    style={{ background:'#eef2ff', border:'1.5px solid #c7d2fe' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='#e0e7ff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='#eef2ff'; }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* loading */}
              {searchLoading && (
                <div className="bg-white rounded-2xl overflow-hidden"
                  style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 16px rgba(79,70,229,0.07)' }}>
                  <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                  <div className="p-10 flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                      <span className="pulse-ring absolute inset-0 rounded-full" />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10"
                        style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 6px 18px rgba(79,70,229,0.4)' }}>
                        <Search size={18} className="text-white" />
                      </div>
                    </div>
                    <p className="text-[13px] font-black text-slate-500">Searching your CRM…</p>
                  </div>
                </div>
              )}

              {/* results */}
              {searchRes && !searchLoading && (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden">
                    <div className="h-[2px] w-full" style={{ background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
                    <div className="px-4 py-3 flex items-start justify-between gap-3"
                      style={{ background:'#eef2ff', border:'1px solid #c7d2fe', borderTop:'none' }}>
                      <div>
                        <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wider mb-0.5">Interpreted As</p>
                        <p className="text-[13px] text-indigo-800 font-medium">{searchRes.interpretation}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[12px] font-black shrink-0"
                        style={{ background:'#e0e7ff', border:'1px solid #c7d2fe', color:'#4338ca' }}>
                        {searchRes.count} results
                      </span>
                    </div>
                  </div>

                  {searchRes.error ? (
                    <div className="rounded-xl overflow-hidden">
                      <div className="h-[2px] w-full bg-red-400" />
                      <div className="px-4 py-3" style={{ background:'#fff1f2', border:'1px solid #fecdd3', borderTop:'none' }}>
                        <p className="text-[13px] text-red-700 font-medium">{searchRes.error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl overflow-hidden"
                      style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 4px 20px rgba(79,70,229,0.07)' }}>
                      <div className="h-[3px] w-full" style={{ background:'linear-gradient(90deg,#1e1b4b,#4f46e5,#7c3aed)' }} />
                      <table className="w-full text-left">
                        <thead>
                          <tr style={{ background:'linear-gradient(90deg,#1e1b4b 0%,#312e81 30%,#4f46e5 65%,#7c3aed 100%)' }}>
                            {[
                              { label:'Name',    color:'text-blue-200'   },
                              { label:'Company', color:'text-violet-200' },
                              { label:'Status',  color:'text-emerald-200'},
                              { label:'Value',   color:'text-amber-200'  },
                            ].map((h, i) => (
                              <th key={h.label} className={`px-5 py-3.5 text-[11px] font-black ${h.color} uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>
                                {h.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {searchRes.results?.map((lead: any, idx: number) => (
                            <tr key={lead.id}
                              className="search-row border-l-[3px]"
                              style={{ borderColor: ['#60a5fa','#a78bfa','#34d399','#fb923c','#f472b6','#22d3ee'][idx % 6], borderBottom:'1px solid #f1f5f9' }}>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
                                    style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 3px 8px rgba(79,70,229,0.3)' }}>
                                    {lead.name?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <span className="text-[13px] font-black text-slate-800">{lead.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-[13px] text-slate-500 font-medium">{lead.company}</td>
                              <td className="px-5 py-3.5">
                                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg"
                                  style={{ background:'#f1f5f9', border:'1px solid #e2e8f0', color:'#475569' }}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-[13px] font-black text-slate-700 text-right">
                                ₹{parseFloat(lead.value).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                          {(!searchRes.results || searchRes.results.length === 0) && (
                            <tr>
                              <td colSpan={4} className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ background:'#f8fafc', border:'1.5px dashed #e2e8f0' }}>
                                    <Search size={18} className="text-slate-300" />
                                  </div>
                                  <p className="text-[13px] font-black text-slate-400">No results found</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
