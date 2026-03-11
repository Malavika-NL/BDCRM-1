
import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Plus,
  Users,
  CheckCheck,
  Clock,
  AlertCircle,
  Loader2,
  X,
  Search,
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

  // Create campaign state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message_template: '',
    lead_ids: [] as number[],
  });
  const [leadSearch, setLeadSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignData, leadData] = await Promise.all([
        api.getWhatsAppCampaigns(),
        api.getLeads(),
      ]);
      setCampaigns(campaignData);
      setLeads(leadData);
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
    setLoading(false);
  };

  const handleQuickSend = async () => {
    if (!quickPhone || !quickMessage) return;
    setQuickSending(true);
    setQuickResult(null);
    try {
      await api.quickSendWhatsApp(quickPhone, quickMessage);
      setQuickResult({ type: 'success', text: 'Message sent successfully!' });
      setQuickPhone('');
      setQuickMessage('');
    } catch (e) {
      setQuickResult({ type: 'error', text: 'Failed to send message.' });
    }
    setQuickSending(false);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.message_template || newCampaign.lead_ids.length === 0) return;
    try {
      await api.createWhatsAppCampaign(newCampaign);
      setShowCreateModal(false);
      setNewCampaign({ name: '', message_template: '', lead_ids: [] });
      fetchData();
    } catch (e) {
      console.error('Failed to create campaign', e);
    }
  };

  const handleSendCampaign = async (campaignId: number) => {
    setSendingCampaignId(campaignId);
    try {
      await api.sendWhatsAppCampaign(campaignId);
      fetchData();
    } catch (e) {
      console.error('Failed to send campaign', e);
    }
    setSendingCampaignId(null);
  };

  const toggleLeadSelection = (leadId: number) => {
    setNewCampaign((prev) => ({
      ...prev,
      lead_ids: prev.lead_ids.includes(leadId)
        ? prev.lead_ids.filter((id) => id !== leadId)
        : [...prev.lead_ids, leadId],
    }));
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'sending':
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-green-500/25 transition"
        >
          <Plus size={18} /> New Campaign
        </button>
      </header>

      {/* Quick Send */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 mb-8">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Send size={18} className="text-green-600" /> Quick Message
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Phone (e.g., +1234567890)"
            value={quickPhone}
            onChange={(e) => setQuickPhone(e.target.value)}
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition"
          />
          <input
            type="text"
            placeholder="Type your message..."
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            className="flex-[2] p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition"
          />
          <button
            onClick={handleQuickSend}
            disabled={quickSending || !quickPhone || !quickMessage}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {quickSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send
          </button>
        </div>
        {quickResult && (
          <div
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
              quickResult.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {quickResult.text}
          </div>
        )}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Campaign History</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="text-slate-300" size={40} />
            </div>
            <p className="text-lg font-semibold text-slate-700">No campaigns yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first WhatsApp campaign above.</p>
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
                    <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                      {camp.message_template}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${getStatusBadge(
                        camp.status
                      )}`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {camp.total_messages || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCheck size={14} className="text-green-500" />
                      <span className="text-slate-600">{camp.delivered_count || 0}</span>
                      {(camp.failed_count || 0) > 0 && (
                        <span className="text-red-500 text-xs flex items-center gap-0.5">
                          <AlertCircle size={12} /> {camp.failed_count} failed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(camp.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {camp.status === 'draft' || camp.status === 'pending' ? (
                      <button
                        onClick={() => handleSendCampaign(camp.id)}
                        disabled={sendingCampaignId === camp.id}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-green-500/25 transition flex items-center gap-2 ml-auto disabled:opacity-50"
                      >
                        {sendingCampaignId === camp.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        Send Now
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Clock size={12} /> Sent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========== CREATE CAMPAIGN MODAL ========== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle size={20} /> Create Campaign
                </h3>
                <p className="text-green-100 text-sm mt-0.5">Select leads and compose your message.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-green-200 hover:text-white transition p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition"
                  placeholder="e.g. Q3 Product Launch"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message Template
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition resize-none h-28"
                  placeholder="Hi {name}, we wanted to let you know about..."
                  value={newCampaign.message_template}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, message_template: e.target.value })
                  }
                />
                <p className="text-xs text-slate-400 mt-1">
                  Use {'{name}'}, {'{company}'} as placeholders.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Select Leads ({newCampaign.lead_ids.length} selected)
                </label>
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-400 outline-none transition"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                  />
                </div>
                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredLeads.map((lead) => {
                    const isSelected = newCampaign.lead_ids.includes(lead.id);
                    const hasPhone = lead.phone;
                    return (
                      <label
                        key={lead.id}
                        className={`flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${
                          !hasPhone ? 'opacity-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!hasPhone}
                          onChange={() => toggleLeadSelection(lead.id)}
                          className="h-4 w-4 text-green-600 rounded border-slate-300"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-800">{lead.name}</span>
                          <span className="text-xs text-slate-400 ml-2">{lead.company}</span>
                        </div>
                        {hasPhone ? (
                          <span className="text-xs text-slate-400">{String(lead.phone)}</span>
                        ) : (
                          <span className="text-xs text-red-400">No phone</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 shrink-0">
              <button
                onClick={handleCreateCampaign}
                disabled={
                  !newCampaign.name ||
                  !newCampaign.message_template ||
                  newCampaign.lead_ids.length === 0
                }
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
              >
                Create Campaign ({newCampaign.lead_ids.length} recipients)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};