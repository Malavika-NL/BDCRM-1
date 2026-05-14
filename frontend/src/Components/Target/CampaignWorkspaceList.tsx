import React, { useEffect, useState } from 'react';
import {
  Wand2,
  Plus,
  Mail,
  MessageCircle,
  Linkedin,
  Clock,
  CheckCircle,
  Send,
  Archive,
  Eye,
  Sparkles,
  X,
} from 'lucide-react';
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
      const [wsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/campaign-workspace/`),
        fetch(`${API_BASE}/campaign-workspace/analytics/`),
      ]);

      setWorkspaces(await wsRes.json());
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle size={16} className="text-emerald-600" />;
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'linkedin':
        return <Linkedin size={16} className="text-sky-600" />;
      default:
        return <MessageCircle size={16} className="text-slate-400" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'email':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'linkedin':
        return 'bg-sky-50 border-sky-200 text-sky-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getChannelAccent = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'from-emerald-500 to-green-400';
      case 'email':
        return 'from-blue-500 to-cyan-400';
      case 'linkedin':
        return 'from-sky-500 to-blue-500';
      default:
        return 'from-indigo-500 to-violet-500';
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} /> };
      case 'sent':
        return { color: 'bg-blue-100 text-blue-700', icon: <Send size={12} /> };
      case 'archived':
        return { color: 'bg-slate-100 text-slate-600', icon: <Archive size={12} /> };
      default:
        return { color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative p-8 h-full overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <style>
        {`
          @keyframes floatBlob {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-10px) translateX(6px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(16px) scale(0.99); }
            100% { opacity: 1; transform: translateY(0px) scale(1); }
          }
          .anim-blob {
            animation: floatBlob 7s ease-in-out infinite;
          }
          .anim-fade-1 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .05s; }
          .anim-fade-2 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .15s; }
          .anim-fade-3 { opacity: 0; animation: fadeUp .55s ease-out forwards; animation-delay: .25s; }
        `}
      </style>

      <div className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 rounded-full bg-blue-300/30 blur-3xl anim-blob" />
      <div className="pointer-events-none absolute top-44 -right-20 w-80 h-80 rounded-full bg-indigo-300/25 blur-3xl anim-blob" />

      <header className="relative mb-8 flex justify-between items-center flex-wrap gap-4 anim-fade-1">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow">
              <Wand2 size={24} />
            </span>
            Campaign Workspace
          </h2>
          <p className="text-slate-600 mt-2">Generate and manage multi-channel campaign drafts.</p>
        </div>

        <button
          onClick={() => navigate('/campaign-workspace/new')}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-300 hover:scale-[1.02] active:scale-[0.99]"
        >
          <Plus size={16} /> New Workspace
        </button>
      </header>

      {analytics && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 anim-fade-2">
          <StatCard title="Total Workspaces" value={analytics.total_workspaces} color="indigo" />
          <StatCard title="Ready" value={analytics.ready_campaigns} color="emerald" />
          <StatCard title="Sent" value={analytics.sent_campaigns} color="blue" />
          <StatCard title="Interested" value={analytics.responses?.interested || 0} color="amber" />
        </div>
      )}

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 anim-fade-3">
        {workspaces.map((w) => {
          const statusConfig = getStatusConfig(w.status);
          const responseCount = w.responses?.length || 0;

          return (
            <div
              key={w.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group hover:-translate-y-1"
              onClick={() => setSelectedWorkspace(w)}
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${getChannelAccent(w.selected_channel)}`} />

              <div className="p-5 flex-1 flex flex-col">
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

                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                  {w.name}
                </h3>

                {w.brand_name && <p className="text-sm text-slate-500 mt-1">{w.brand_name}</p>}

                {w.content_theme && (
                  <div className="mt-3">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-indigo-200">
                      {w.content_theme}
                    </span>
                  </div>
                )}

                {w.generated_subject && (
                  <div className="mt-3">
                    <p className="text-xs uppercase font-bold text-slate-400">Subject</p>
                    <p className="text-sm text-slate-700 mt-0.5 line-clamp-1">{w.generated_subject}</p>
                  </div>
                )}

                {w.generated_content && (
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1">
                    <p className="text-xs text-slate-600 line-clamp-3">{w.generated_content}</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>

                  <div className="flex items-center gap-3">
                    {responseCount > 0 && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-medium border border-emerald-200">
                        {responseCount} response{responseCount > 1 ? 's' : ''}
                      </span>
                    )}
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {workspaces.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white/90 border border-blue-100 rounded-2xl shadow-sm">
            <Sparkles size={40} className="mx-auto text-indigo-300 mb-3" />
            <p className="text-slate-600 font-semibold">No workspaces found</p>
            <p className="text-sm text-slate-400 mt-1">Create your first AI campaign draft.</p>
            <button
              onClick={() => navigate('/campaign-workspace/new')}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-xl font-bold inline-flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Create Workspace
            </button>
          </div>
        </div>
      </div>

      {selectedWorkspace && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWorkspace(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-[fadeUp_.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-2 w-full rounded-t-2xl bg-gradient-to-r ${getChannelAccent(selectedWorkspace.selected_channel)}`} />

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedWorkspace.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedWorkspace.brand_name ? `${selectedWorkspace.brand_name} � ` : ''}
                    <span className="capitalize">{selectedWorkspace.selected_channel}</span>
                    {' � '}
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
                    className="text-slate-400 hover:text-slate-600 p-1 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {selectedWorkspace.content_theme && (
                <div className="mb-4">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-lg border border-indigo-200">
                    Theme: {selectedWorkspace.content_theme}
                  </span>
                </div>
              )}

              {selectedWorkspace.target_description && (
                <div className="mb-4">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-1">Target Audience</p>
                  <p className="text-sm text-slate-700">{selectedWorkspace.target_description}</p>
                </div>
              )}

              {selectedWorkspace.generated_subject && (
                <div className="mb-4">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-1">Subject Line</p>
                  <p className="text-sm font-medium text-slate-800">{selectedWorkspace.generated_subject}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2">Generated Content</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedWorkspace.generated_content}</p>
                </div>
              </div>
            )}

              {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 mb-2">
                    Responses ({selectedWorkspace.responses.length})
                  </p>
                  <div className="space-y-2">
                    {selectedWorkspace.responses.map((r: any) => (
                      <div key={r.id} className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <strong>{r.lead_name}</strong>
                        <span className="mx-1 text-emerald-500">�</span>
                        <span className="capitalize">{r.response_type.replace('_', ' ')}</span>
                        {r.response_text && <p className="mt-1 text-slate-600">{r.response_text}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => {
  const colorMap: Record<string, string> = {
    indigo: 'border-l-indigo-500',
    emerald: 'border-l-emerald-500',
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
  };

  return (
    <div className={`bg-white/90 p-5 rounded-2xl border border-blue-100 shadow-sm border-l-4 ${colorMap[color] || 'border-l-slate-500'}`}>
      <p className="text-xs uppercase text-slate-400 font-bold">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  );
};

export default CampaignWorkspaceList;
