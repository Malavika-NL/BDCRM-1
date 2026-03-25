import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Send, Plus, CheckCheck, Clock, 
  AlertCircle, Loader2, X, Search, Sparkles
} from 'lucide-react';
import { api } from '../Utils/api';
import type { Lead } from '../Utils/types';

interface Campaign {
  id: number;
  name: string;
  message_template: string;
  status: string;
  created_at: string;
  total_messages?: number;
  sent_count?: number;
  delivered_count?: number;
  failed_count?: number;
}

export const WhatsAppCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<number | null>(null);

  // Quick send state
  const [quickPhone, setQuickPhone] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickSending, setQuickSending] = useState(false);
  const [quickResult, setQuickResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Standard campaign state
  const [newCampaign, setNewCampaign] = useState({ name: '', message_template: '', lead_ids: [] as number[] });
  const [leadSearch, setLeadSearch] = useState('');

  // AI MAGIC BULK STATE
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiBaseMessage, setAiBaseMessage] = useState('');
  const [aiSelectedLeads, setAiSelectedLeads] = useState<number[]>([]);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [sendingAI, setSendingAI] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignData, leadData] = await Promise.all([api.getWhatsAppCampaigns(), api.getLeads()]);
      setCampaigns(campaignData);
      setLeads(leadData);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleQuickSend = async () => {
    if (!quickPhone || !quickMessage) return;
    setQuickSending(true); setQuickResult(null);
    try {
      await api.quickSendWhatsApp(quickPhone, quickMessage);
      setQuickResult({ type: 'success', text: 'Message sent successfully!' });
      setQuickPhone(''); setQuickMessage('');
    } catch (e) { setQuickResult({ type: 'error', text: 'Failed to send message.' }); }
    setQuickSending(false);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.message_template || newCampaign.lead_ids.length === 0) return;
    try {
      await api.createWhatsAppCampaign(newCampaign);
      setShowCreateModal(false);
      setNewCampaign({ name: '', message_template: '', lead_ids: [] });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleSendCampaign = async (campaignId: number) => {
    setSendingCampaignId(campaignId);
    try { await api.sendWhatsAppCampaign(campaignId); fetchData(); } catch (e) { console.error(e); }
    setSendingCampaignId(null);
  };

  // AI Bulk Handlers
  const handleGenerateAIBulk = async () => {
    if(!aiBaseMessage || aiSelectedLeads.length === 0) return;
    setGeneratingAI(true);
    try {
      const res = await api.generateAIBulkMessages(aiSelectedLeads, aiBaseMessage, 'whatsapp');
      setAiResults(res.messages);
    } catch(e) { console.error(e); }
    setGeneratingAI(false);
  };

  const handleSendAIBulk = async () => {
    setSendingAI(true);
    for (const msg of aiResults) {
      if (msg.phone && msg.personalized_message && !msg.personalized_message.startsWith('❌')) {
        try { await api.quickSendWhatsApp(msg.phone, msg.personalized_message); } catch (e) { console.error(e); }
      }
    }
    setSendingAI(false);
    setShowAIModal(false);
    setAiResults([]);
  };

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.company.toLowerCase().includes(leadSearch.toLowerCase()));
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'sending': case 'active': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
            <MessageCircle size={32} className="text-green-600" /> WhatsApp Campaigns
          </h2>
          <p className="text-slate-500 mt-1">Send bulk messages and track delivery.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setShowAIModal(true); setAiResults([]); }} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-orange-500/25 transition">
            <Sparkles size={18} /> AI Magic Send
          </button>
          <button onClick={() => setShowCreateModal(true)} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-slate-900 transition">
            <Plus size={18} /> Standard Campaign
          </button>
        </div>
      </header>

      {/* Quick Send */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 mb-8">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Send size={18} className="text-green-600" /> Quick Message
        </h3>
        <div className="flex gap-4">
          <input type="text" placeholder="Phone (e.g., +1234567890)" value={quickPhone} onChange={(e) => setQuickPhone(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition" />
          <input type="text" placeholder="Type your message..." value={quickMessage} onChange={(e) => setQuickMessage(e.target.value)} className="flex-[2] p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition" />
          <button onClick={handleQuickSend} disabled={quickSending || !quickPhone || !quickMessage} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition flex items-center gap-2 disabled:opacity-50">
            {quickSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send
          </button>
        </div>
        {quickResult && (
          <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${quickResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {quickResult.text}
          </div>
        )}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-800">Campaign History</h3></div>
        {loading ? (
          <div className="p-12 text-center"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" /></div>
        ) : campaigns.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5"><MessageCircle className="text-slate-300" size={40} /></div>
            <p className="text-lg font-semibold text-slate-700">No campaigns yet</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Campaign</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Messages</th>
                <th className="px-6 py-4 font-semibold">Delivered</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-blue-50/30 transition group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{camp.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{camp.message_template}</div>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${getStatusBadge(camp.status)}`}>{camp.status}</span></td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{camp.total_messages || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCheck size={14} className="text-green-500" />
                      <span className="text-slate-600">{camp.delivered_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{new Date(camp.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {camp.status === 'draft' || camp.status === 'pending' ? (
                      <button onClick={() => handleSendCampaign(camp.id)} disabled={sendingCampaignId === camp.id} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-green-500/25 transition flex items-center gap-2 ml-auto disabled:opacity-50">
                        {sendingCampaignId === camp.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Now
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Clock size={12} /> Sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========== AI BULK MODAL ========== */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles size={20} /> AI Bulk Personalizer</h3>
                <p className="text-orange-100 text-sm mt-0.5">Write one generic message. AI personalizes it for everyone.</p>
              </div>
              <button onClick={() => setShowAIModal(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/2 p-6 border-r border-slate-100 flex flex-col">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Base Message Idea</label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-orange-400 outline-none resize-none h-32 mb-6"
                  placeholder="E.g., We have a 20% discount on barcode labels this month..."
                  value={aiBaseMessage}
                  onChange={(e) => setAiBaseMessage(e.target.value)}
                />

                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Recipients ({aiSelectedLeads.length})</label>
                <div className="border border-slate-200 rounded-xl flex-1 overflow-y-auto custom-scrollbar">
                  {leads.filter(l => l.phone).map(lead => (
                    <label key={lead.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                      <input 
                        type="checkbox" 
                        checked={aiSelectedLeads.includes(lead.id)}
                        onChange={() => setAiSelectedLeads(prev => prev.includes(lead.id) ? prev.filter(id=>id!==lead.id) : [...prev, lead.id])}
                        className="h-4 w-4 text-orange-500 rounded border-slate-300" 
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-800">{lead.name}</span>
                        <span className="text-xs text-slate-400 ml-2">{lead.company}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={handleGenerateAIBulk}
                  disabled={generatingAI || aiSelectedLeads.length === 0 || !aiBaseMessage}
                  className="w-full mt-4 bg-orange-100 text-orange-700 py-3 rounded-xl font-bold hover:bg-orange-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {generatingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate {aiSelectedLeads.length} Variations
                </button>
              </div>

              <div className="w-1/2 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-100 font-bold text-slate-700 text-sm">Review AI Output</div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {aiResults.length === 0 ? (
                    <div className="text-center text-slate-400 mt-20 text-sm">Generated messages will appear here.</div>
                  ) : (
                    aiResults.map((msg, idx) => {
                      // Look for the failure cross mark we added in the backend
                      const isError = msg.personalized_message?.startsWith('❌');
                      
                      return (
                        <div key={idx} className={`p-4 rounded-xl border shadow-sm relative ${isError ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'}`}>
                          <span className={`absolute top-0 right-0 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl ${isError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isError ? 'Failed' : 'Ready'}
                          </span>
                          <p className="text-xs font-bold text-slate-800 mb-2">To: {msg.name} ({msg.phone})</p>
                          <p className={`text-sm leading-relaxed ${isError ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                            {msg.personalized_message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {aiResults.length > 0 && (
                  <div className="p-4 border-t border-slate-200 bg-white">
                    <button 
                      onClick={handleSendAIBulk}
                      disabled={sendingAI || aiResults.some(msg => msg.personalized_message?.startsWith('❌'))}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {sendingAI ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      Confirm & Send All via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== STANDARD CREATE MODAL ========== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><MessageCircle size={20} /> Standard Campaign</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-green-200 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Campaign Name</label>
                <input type="text" className="w-full p-3 border rounded-xl focus:border-green-400 outline-none" placeholder="e.g. Q3 Product Launch" value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message Template</label>
                <textarea className="w-full p-3 border rounded-xl focus:border-green-400 outline-none resize-none h-28" placeholder="Hi {name}, about {company}..." value={newCampaign.message_template} onChange={(e) => setNewCampaign({ ...newCampaign, message_template: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Leads ({newCampaign.lead_ids.length} selected)</label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search leads..." className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm" value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} />
                </div>
                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredLeads.map((lead) => (
                    <label key={lead.id} className={`flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b ${!lead.phone ? 'opacity-50' : ''}`}>
                      <input type="checkbox" checked={newCampaign.lead_ids.includes(lead.id)} disabled={!lead.phone} onChange={() => setNewCampaign(p => ({ ...p, lead_ids: p.lead_ids.includes(lead.id) ? p.lead_ids.filter(id=>id!==lead.id) : [...p.lead_ids, lead.id] }))} className="h-4 w-4 text-green-600 rounded border-slate-300" />
                      <div className="flex-1"><span className="text-sm font-medium">{lead.name}</span></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 shrink-0">
              <button onClick={handleCreateCampaign} disabled={!newCampaign.name || !newCampaign.message_template || newCampaign.lead_ids.length===0} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-50">
                Create Standard Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};