import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit, Send, Sparkles, AlertTriangle, TrendingUp,
  Target, Loader2, Trash2, Bell, Zap, Search,
  CheckCircle2, XCircle, Clock, ArrowRight
} from 'lucide-react';
import { api } from '../Utils/api';
import type { AIAlert, ChatResponse } from '../Utils/types';

export const AICommandCenter: React.FC = () => {
  const [tab, setTab] = useState<'chat' | 'alerts' | 'digest' | 'search'>('chat');

  // Chat
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Alerts
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [unread, setUnread] = useState(0);

  // Digest
  const [digest, setDigest] = useState<any>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  // Search
  const [searchQ, setSearchQ] = useState('');
  const [searchRes, setSearchRes] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
    loadUnread();
    loadHistory();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAlerts = () => api.aiGetAlerts(false).then(setAlerts).catch(() => {});
  const loadUnread = () => api.aiUnreadCount().then(d => setUnread(d.unread || 0)).catch(() => {});
  const loadHistory = () => api.aiChatHistory().then(d => { if (d.messages) setMessages(d.messages); }).catch(() => {});

  const sendChat = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res: ChatResponse = await api.aiChat(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
    setChatLoading(false);
  };

  const clearChat = async () => {
    await api.aiChatClear();
    setMessages([]);
  };

  const doDigest = async () => {
    setDigestLoading(true);
    try { setDigest(await api.aiDailyDigest()); } catch (e) { console.error(e); }
    setDigestLoading(false);
  };

  const doSearch = async () => {
    if (!searchQ.trim()) return;
    setSearchLoading(true);
    try { setSearchRes(await api.aiSearch(searchQ)); } catch (e) { console.error(e); }
    setSearchLoading(false);
  };

  const markRead = async (id: number) => {
    await api.aiMarkAlertRead(id);
    loadAlerts();
    loadUnread();
  };

  const markAllRead = async () => {
    await api.aiMarkAllRead();
    loadAlerts();
    loadUnread();
  };

  const priorityColor: Record<string, string> = {
    critical: 'border-l-red-500 bg-red-50',
    high: 'border-l-orange-500 bg-orange-50',
    medium: 'border-l-amber-400 bg-amber-50',
    low: 'border-l-slate-300 bg-slate-50',
  };

  const quickQuestions = [
    'Which leads should I focus on today?',
    'Show me at-risk deals',
    'Pipeline health check',
    'Any overdue follow-ups?',
  ];

  const searchSuggestions = [
    'Show all hot leads',
    'Deals over $100k',
    'Leads from LinkedIn',
    'New leads this week',
  ];

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Tab Bar */}
        <div className="bg-white border-b border-slate-200 px-6 pt-4 flex gap-6 shrink-0">
          {([
            { id: 'chat' as const, label: 'AI Assistant', icon: BrainCircuit },
            { id: 'alerts' as const, label: `Alerts${unread ? ` (${unread})` : ''}`, icon: Bell },
            { id: 'digest' as const, label: 'Daily Digest', icon: Zap },
            { id: 'search' as const, label: 'AI Search', icon: Search },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
                tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── CHAT TAB ── */}
        {tab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <BrainCircuit size={48} className="text-indigo-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">AI CRM Assistant</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Ask me anything about your pipeline, leads, tasks, or deals.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                    {quickQuestions.map(q => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-2 text-indigo-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm font-medium">Analyzing CRM data...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-3 items-center">
              <button onClick={clearChat} className="p-2 text-slate-400 hover:text-red-500 transition" title="Clear chat">
                <Trash2 size={18} />
              </button>
              <input
                type="text"
                placeholder="Ask your CRM anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !input.trim()}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {tab === 'alerts' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">AI-Generated Alerts</h3>
              <button onClick={markAllRead} className="text-sm font-medium text-indigo-600 hover:underline">
                Mark all read
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle2 size={48} className="text-emerald-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-700">All clear!</p>
                <p className="text-slate-500 text-sm mt-1">No unread alerts.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-xl p-5 shadow-sm transition hover:shadow-md ${
                    priorityColor[alert.priority] || priorityColor.medium
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border">
                          {alert.alert_type.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          alert.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {alert.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-slate-600 mb-2">{alert.description}</p>
                      {alert.suggested_action && (
                        <p className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block border border-indigo-100">
                          💡 {alert.suggested_action}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => markRead(alert.id)}
                      className="text-slate-400 hover:text-emerald-600 transition p-1 shrink-0 ml-4"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── DIGEST TAB ── */}
        {tab === 'digest' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {!digest ? (
              <div className="text-center py-20">
                <Zap size={48} className="text-amber-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">AI Daily Digest</h3>
                <p className="text-slate-500 mb-6">Your AI-powered morning briefing</p>
                <button
                  onClick={doDigest}
                  disabled={digestLoading}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-orange-500/25 transition flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {digestLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate Today's Digest
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-indigo-300 text-sm mb-2">{digest.greeting}</p>
                    <h2 className="text-2xl font-bold mb-3">{digest.headline}</h2>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-4xl font-black">{digest.day_score}</span>
                      <span className="text-indigo-300 text-sm">/10 day score</span>
                    </div>
                  </div>
                </div>

                {/* Priorities */}
                {digest.top_priorities && digest.top_priorities.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-red-500" /> Top Priorities
                    </h3>
                    <div className="space-y-3">
                      {digest.top_priorities.map((p: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="font-bold text-sm text-slate-800 mb-1">{p.priority}</p>
                          <p className="text-xs text-slate-500">{p.why}</p>
                          <p className="text-xs text-indigo-600 mt-2 font-medium flex items-center gap-1">
                            <ArrowRight size={12} /> {p.action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wins */}
                {digest.wins && digest.wins.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                    <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} /> Wins
                    </h3>
                    {digest.wins.map((w: string, i: number) => (
                      <p key={i} className="text-sm text-emerald-700 flex items-start gap-2 mb-1">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" />{w}
                      </p>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {digest.warnings && digest.warnings.length > 0 && (
                  <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle size={18} /> Warnings
                    </h3>
                    {digest.warnings.map((w: string, i: number) => (
                      <p key={i} className="text-sm text-red-700 flex items-start gap-2 mb-1">
                        <XCircle size={14} className="mt-0.5 shrink-0" />{w}
                      </p>
                    ))}
                  </div>
                )}

                {/* Pipeline Insight */}
                {digest.pipeline_insight && (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <TrendingUp size={18} /> Pipeline
                    </h3>
                    <p className="text-sm text-blue-700">{digest.pipeline_insight}</p>
                  </div>
                )}

                {/* Motivation */}
                {digest.motivation && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-xl text-center">
                    <p className="text-indigo-800 font-medium italic text-lg">"{digest.motivation}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SEARCH TAB ── */}
        {tab === 'search' && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Natural Language Search</h3>
              <p className="text-sm text-slate-500 mb-4">Search your CRM in plain English</p>

              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder='e.g. "hot leads in negotiation with value over 50k"'
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm"
                />
                <button
                  onClick={doSearch}
                  disabled={searchLoading || !searchQ.trim()}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {searchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {searchSuggestions.map(q => (
                  <button
                    key={q}
                    onClick={() => setSearchQ(q)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {searchRes && (
                <>
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-4">
                    <p className="text-sm text-indigo-800">
                      <strong>Interpreted as:</strong> {searchRes.interpretation}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">{searchRes.count} results found</p>
                  </div>

                  {searchRes.error ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                      <p className="text-sm text-red-700">{searchRes.error}</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Company</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {searchRes.results?.map((lead: any) => (
                            <tr key={lead.id} className="hover:bg-blue-50/30 transition">
                              <td className="px-4 py-3 font-semibold text-sm text-slate-800">{lead.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{lead.company}</td>
                              <td className="px-4 py-3">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800 text-right">
                                ${parseFloat(lead.value).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {(!searchRes.results || searchRes.results.length === 0) && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                                No results found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};