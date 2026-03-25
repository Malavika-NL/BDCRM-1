import React, { useEffect, useState } from 'react';
import { Wand2, Plus, Mail, MessageCircle, Linkedin, Clock, CheckCircle, Send, Archive, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

interface CampaignWorkspace {
  id: number;
  name: string;
  brand_name: string;
  content_theme: string;
  target_description: string;
  selected_channel: string;
  generated_subject: string;
  generated_content: string;
  status: string;
  created_at: string;
  responses?: any[];
}

export const CampaignWorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState<CampaignWorkspace[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const wsRes = await fetch(`${API_BASE}/campaign-workspace/`);
      const wsData = await wsRes.json();
      setWorkspaces(wsData);

      const analyticsRes = await fetch(`${API_BASE}/campaign-workspace/analytics/`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Channel Icon Helper
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageCircle size={16} className="text-green-500" />;
      case 'email': return <Mail size={16} className="text-blue-500" />;
      case 'linkedin': return <Linkedin size={16} className="text-sky-600" />;
      default: return <MessageCircle size={16} className="text-slate-400" />;
    }
  };

  // Channel Color Helper
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return 'bg-green-50 border-green-200 text-green-700';
      case 'email': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'linkedin': return 'bg-sky-50 border-sky-200 text-sky-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  // Status Config Helper
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready': return { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} /> };
      case 'sent': return { color: 'bg-blue-100 text-blue-700', icon: <Send size={12} /> };
      case 'archived': return { color: 'bg-slate-100 text-slate-600', icon: <Archive size={12} /> };
      default: return { color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
    }
  };

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Wand2 className="text-purple-600" size={30} /> Campaign Workspace
          </h2>
          <p className="text-slate-500 mt-1">Generate and manage multi-channel campaign drafts.</p>
        </div>

        <button
          onClick={() => navigate('/campaign-workspace/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> New Workspace
        </button>
      </header>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Workspaces" value={analytics.total_workspaces} color="purple" />
          <StatCard title="Ready" value={analytics.ready_campaigns} color="emerald" />
          <StatCard title="Sent" value={analytics.sent_campaigns} color="blue" />
          <StatCard title="Interested" value={analytics.responses?.interested || 0} color="amber" />
        </div>
      )}

      {/* Workspace Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {workspaces.map((w) => {
          const statusConfig = getStatusConfig(w.status);
          const responseCount = w.responses?.length || 0;

          return (
            <div
              key={w.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden cursor-pointer group"
              onClick={() => setSelectedWorkspace(w)}
            >
              {/* Card Top Accent */}
              <div className={`h-1.5 w-full ${
                w.selected_channel === 'whatsapp' ? 'bg-green-500' :
                w.selected_channel === 'email' ? 'bg-blue-500' :
                w.selected_channel === 'linkedin' ? 'bg-sky-500' : 'bg-purple-500'
              }`} />

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Top Row: Status + Channel */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${getChannelColor(w.selected_channel)}`}>
                    {getChannelIcon(w.selected_channel)}
                    <span className="capitalize">{w.selected_channel}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {w.status.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-purple-600 transition-colors">
                  {w.name}
                </h3>

                {/* Brand */}
                {w.brand_name && (
                  <p className="text-sm text-slate-500 mt-1">{w.brand_name}</p>
                )}

                {/* Theme Tag */}
                {w.content_theme && (
                  <div className="mt-3">
                    <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-purple-200">
                      {w.content_theme}
                    </span>
                  </div>
                )}

                {/* Subject Preview */}
                {w.generated_subject && (
                  <div className="mt-3">
                    <p className="text-xs uppercase font-bold text-slate-400">Subject</p>
                    <p className="text-sm text-slate-700 mt-0.5 line-clamp-1">{w.generated_subject}</p>
                  </div>
                )}

                {/* Content Preview */}
                {w.generated_content && (
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1">
                    <p className="text-xs text-slate-600 line-clamp-3">{w.generated_content}</p>
                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>
                  
                  <div className="flex items-center gap-3">
                    {responseCount > 0 && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-medium border border-emerald-200">
                        {responseCount} response{responseCount > 1 ? 's' : ''}
                      </span>
                    )}
                    <button className="text-slate-400 hover:text-purple-600 transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <Wand2 size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No workspaces found</p>
            <p className="text-sm text-slate-400 mt-1">Create your first AI campaign draft!</p>
            <button
              onClick={() => navigate('/campaign-workspace/new')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-bold inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Create Workspace
            </button>
          </div>
        )}
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {selectedWorkspace && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWorkspace(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Accent */}
            <div className={`h-2 w-full rounded-t-2xl ${
              selectedWorkspace.selected_channel === 'whatsapp' ? 'bg-green-500' :
              selectedWorkspace.selected_channel === 'email' ? 'bg-blue-500' :
              selectedWorkspace.selected_channel === 'linkedin' ? 'bg-sky-500' : 'bg-purple-500'
            }`} />

            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedWorkspace.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedWorkspace.brand_name && `${selectedWorkspace.brand_name} • `}
                    <span className="capitalize">{selectedWorkspace.selected_channel}</span>
                    {' • '}
                    {formatDate(selectedWorkspace.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const sc = getStatusConfig(selectedWorkspace.status);
                    return (
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${sc.color}`}>
                        {sc.icon}
                        {selectedWorkspace.status.toUpperCase()}
                      </span>
                    );
                  })()}
                  <button
                    onClick={() => setSelectedWorkspace(null)}
                    className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Theme */}
              {selectedWorkspace.content_theme && (
                <div className="mb-4">
                  <span className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1 rounded-lg border border-purple-200">
                    Theme: {selectedWorkspace.content_theme}
                  </span>
                </div>
              )}

              {/* Target Description */}
              {selectedWorkspace.target_description && (
                <div className="mb-4">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-1">Target Audience</p>
                  <p className="text-sm text-slate-700">{selectedWorkspace.target_description}</p>
                </div>
              )}

              {/* Subject */}
              {selectedWorkspace.generated_subject && (
                <div className="mb-4">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-1">Subject Line</p>
                  <p className="text-sm font-medium text-slate-800">{selectedWorkspace.generated_subject}</p>
                </div>
              )}

              {/* Full Content */}
              <div className="mb-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2">Generated Content</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedWorkspace.generated_content}</p>
                </div>
              </div>

              {/* Responses */}
              {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 mb-2">
                    Responses ({selectedWorkspace.responses.length})
                  </p>
                  <div className="space-y-2">
                    {selectedWorkspace.responses.map((r: any) => (
                      <div key={r.id} className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <strong>{r.lead_name}</strong>
                        <span className="mx-1 text-emerald-500">•</span>
                        <span className="capitalize">{r.response_type.replace('_', ' ')}</span>
                        {r.response_text && (
                          <p className="mt-1 text-slate-600">{r.response_text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedWorkspace(null)}
                  className="px-5 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== STAT CARD COMPONENT =====
const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => {
  const colorMap: Record<string, string> = {
    purple: 'border-l-purple-500',
    emerald: 'border-l-emerald-500',
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 ${colorMap[color] || 'border-l-slate-500'}`}>
      <p className="text-xs uppercase text-slate-400 font-bold">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  );
};

export default CampaignWorkspaceList;