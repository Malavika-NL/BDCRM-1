// import React, { useEffect, useState } from 'react';
// import { Wand2, Plus, Mail, MessageCircle, Linkedin, Clock, CheckCircle, Send, Archive, Eye } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://127.0.0.1:8000/api';

// interface CampaignWorkspace {
//   id: number;
//   name: string;
//   brand_name: string;
//   content_theme: string;
//   target_description: string;
//   selected_channel: string;
//   generated_subject: string;
//   generated_content: string;
//   status: string;
//   created_at: string;
//   responses?: any[];
// }

// export const CampaignWorkspaceList = () => {
//   const [workspaces, setWorkspaces] = useState<CampaignWorkspace[]>([]);
//   const [analytics, setAnalytics] = useState<any>(null);
//   const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
//   const navigate = useNavigate();

//   const loadData = async () => {
//     try {
//       const wsRes = await fetch(`${API_BASE}/campaign-workspace/`);
//       const wsData = await wsRes.json();
//       setWorkspaces(wsData);

//       const analyticsRes = await fetch(`${API_BASE}/campaign-workspace/analytics/`);
//       const analyticsData = await analyticsRes.json();
//       setAnalytics(analyticsData);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Channel Icon Helper
//   const getChannelIcon = (channel: string) => {
//     switch (channel) {
//       case 'whatsapp': return <MessageCircle size={16} className="text-green-500" />;
//       case 'email': return <Mail size={16} className="text-blue-500" />;
//       case 'linkedin': return <Linkedin size={16} className="text-sky-600" />;
//       default: return <MessageCircle size={16} className="text-slate-400" />;
//     }
//   };

//   // Channel Color Helper
//   const getChannelColor = (channel: string) => {
//     switch (channel) {
//       case 'whatsapp': return 'bg-green-50 border-green-200 text-green-700';
//       case 'email': return 'bg-blue-50 border-blue-200 text-blue-700';
//       case 'linkedin': return 'bg-sky-50 border-sky-200 text-sky-700';
//       default: return 'bg-slate-50 border-slate-200 text-slate-600';
//     }
//   };

//   // Status Config Helper
//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case 'ready': return { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} /> };
//       case 'sent': return { color: 'bg-blue-100 text-blue-700', icon: <Send size={12} /> };
//       case 'archived': return { color: 'bg-slate-100 text-slate-600', icon: <Archive size={12} /> };
//       default: return { color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> };
//     }
//   };

//   // Format Date Helper
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   return (
//     <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
//       {/* Header */}
//       <header className="mb-8 flex justify-between items-center">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
//             <Wand2 className="text-purple-600" size={30} /> Campaign Workspace
//           </h2>
//           <p className="text-slate-500 mt-1">Generate and manage multi-channel campaign drafts.</p>
//         </div>

//         <button
//           onClick={() => navigate('/campaign-workspace/new')}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
//         >
//           <Plus size={16} /> New Workspace
//         </button>
//       </header>

//       {/* Analytics Cards */}
//       {analytics && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <StatCard title="Total Workspaces" value={analytics.total_workspaces} color="purple" />
//           <StatCard title="Ready" value={analytics.ready_campaigns} color="emerald" />
//           <StatCard title="Sent" value={analytics.sent_campaigns} color="blue" />
//           <StatCard title="Interested" value={analytics.responses?.interested || 0} color="amber" />
//         </div>
//       )}

//       {/* Workspace Card Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {workspaces.map((w) => {
//           const statusConfig = getStatusConfig(w.status);
//           const responseCount = w.responses?.length || 0;

//           return (
//             <div
//               key={w.id}
//               className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden cursor-pointer group"
//               onClick={() => setSelectedWorkspace(w)}
//             >
//               {/* Card Top Accent */}
//               <div className={`h-1.5 w-full ${
//                 w.selected_channel === 'whatsapp' ? 'bg-green-500' :
//                 w.selected_channel === 'email' ? 'bg-blue-500' :
//                 w.selected_channel === 'linkedin' ? 'bg-sky-500' : 'bg-purple-500'
//               }`} />

//               {/* Card Body */}
//               <div className="p-5 flex-1 flex flex-col">
//                 {/* Top Row: Status + Channel */}
//                 <div className="flex justify-between items-center mb-3">
//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${getChannelColor(w.selected_channel)}`}>
//                     {getChannelIcon(w.selected_channel)}
//                     <span className="capitalize">{w.selected_channel}</span>
//                   </span>

//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${statusConfig.color}`}>
//                     {statusConfig.icon}
//                     {w.status.toUpperCase()}
//                   </span>
//                 </div>

//                 {/* Title */}
//                 <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-purple-600 transition-colors">
//                   {w.name}
//                 </h3>

//                 {/* Brand */}
//                 {w.brand_name && (
//                   <p className="text-sm text-slate-500 mt-1">{w.brand_name}</p>
//                 )}

//                 {/* Theme Tag */}
//                 {w.content_theme && (
//                   <div className="mt-3">
//                     <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-purple-200">
//                       {w.content_theme}
//                     </span>
//                   </div>
//                 )}

//                 {/* Subject Preview */}
//                 {w.generated_subject && (
//                   <div className="mt-3">
//                     <p className="text-xs uppercase font-bold text-slate-400">Subject</p>
//                     <p className="text-sm text-slate-700 mt-0.5 line-clamp-1">{w.generated_subject}</p>
//                   </div>
//                 )}

//                 {/* Content Preview */}
//                 {w.generated_content && (
//                   <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex-1">
//                     <p className="text-xs text-slate-600 line-clamp-3">{w.generated_content}</p>
//                   </div>
//                 )}

//                 {/* Card Footer */}
//                 <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
//                   <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>
                  
//                   <div className="flex items-center gap-3">
//                     {responseCount > 0 && (
//                       <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg font-medium border border-emerald-200">
//                         {responseCount} response{responseCount > 1 ? 's' : ''}
//                       </span>
//                     )}
//                     <button className="text-slate-400 hover:text-purple-600 transition-colors">
//                       <Eye size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* Empty State */}
//         {workspaces.length === 0 && (
//           <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl">
//             <Wand2 size={40} className="mx-auto text-slate-300 mb-3" />
//             <p className="text-slate-500 font-medium">No workspaces found</p>
//             <p className="text-sm text-slate-400 mt-1">Create your first AI campaign draft!</p>
//             <button
//               onClick={() => navigate('/campaign-workspace/new')}
//               className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-bold inline-flex items-center gap-2 transition-colors"
//             >
//               <Plus size={16} /> Create Workspace
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ===== DETAIL MODAL ===== */}
//       {selectedWorkspace && (
//         <div
//           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//           onClick={() => setSelectedWorkspace(null)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Top Accent */}
//             <div className={`h-2 w-full rounded-t-2xl ${
//               selectedWorkspace.selected_channel === 'whatsapp' ? 'bg-green-500' :
//               selectedWorkspace.selected_channel === 'email' ? 'bg-blue-500' :
//               selectedWorkspace.selected_channel === 'linkedin' ? 'bg-sky-500' : 'bg-purple-500'
//             }`} />

//             <div className="p-6">
//               {/* Modal Header */}
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-slate-800">{selectedWorkspace.name}</h3>
//                   <p className="text-sm text-slate-500 mt-1">
//                     {selectedWorkspace.brand_name && `${selectedWorkspace.brand_name} • `}
//                     <span className="capitalize">{selectedWorkspace.selected_channel}</span>
//                     {' • '}
//                     {formatDate(selectedWorkspace.created_at)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {(() => {
//                     const sc = getStatusConfig(selectedWorkspace.status);
//                     return (
//                       <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${sc.color}`}>
//                         {sc.icon}
//                         {selectedWorkspace.status.toUpperCase()}
//                       </span>
//                     );
//                   })()}
//                   <button
//                     onClick={() => setSelectedWorkspace(null)}
//                     className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>

//               {/* Theme */}
//               {selectedWorkspace.content_theme && (
//                 <div className="mb-4">
//                   <span className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1 rounded-lg border border-purple-200">
//                     Theme: {selectedWorkspace.content_theme}
//                   </span>
//                 </div>
//               )}

//               {/* Target Description */}
//               {selectedWorkspace.target_description && (
//                 <div className="mb-4">
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-1">Target Audience</p>
//                   <p className="text-sm text-slate-700">{selectedWorkspace.target_description}</p>
//                 </div>
//               )}

//               {/* Subject */}
//               {selectedWorkspace.generated_subject && (
//                 <div className="mb-4">
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-1">Subject Line</p>
//                   <p className="text-sm font-medium text-slate-800">{selectedWorkspace.generated_subject}</p>
//                 </div>
//               )}

//               {/* Full Content */}
//               <div className="mb-4">
//                 <p className="text-xs uppercase font-bold text-slate-400 mb-2">Generated Content</p>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                   <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedWorkspace.generated_content}</p>
//                 </div>
//               </div>

//               {/* Responses */}
//               {selectedWorkspace.responses && selectedWorkspace.responses.length > 0 && (
//                 <div>
//                   <p className="text-xs uppercase font-bold text-slate-400 mb-2">
//                     Responses ({selectedWorkspace.responses.length})
//                   </p>
//                   <div className="space-y-2">
//                     {selectedWorkspace.responses.map((r: any) => (
//                       <div key={r.id} className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
//                         <strong>{r.lead_name}</strong>
//                         <span className="mx-1 text-emerald-500">•</span>
//                         <span className="capitalize">{r.response_type.replace('_', ' ')}</span>
//                         {r.response_text && (
//                           <p className="mt-1 text-slate-600">{r.response_text}</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Modal Footer */}
//               <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
//                 <button
//                   onClick={() => setSelectedWorkspace(null)}
//                   className="px-5 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ===== STAT CARD COMPONENT =====
// const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => {
//   const colorMap: Record<string, string> = {
//     purple: 'border-l-purple-500',
//     emerald: 'border-l-emerald-500',
//     blue: 'border-l-blue-500',
//     amber: 'border-l-amber-500',
//   };

//   return (
//     <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 ${colorMap[color] || 'border-l-slate-500'}`}>
//       <p className="text-xs uppercase text-slate-400 font-bold">{title}</p>
//       <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
//     </div>
//   );
// };

// export default CampaignWorkspaceList;


import React, { useEffect, useState, useRef } from 'react';
import {
  Wand2, Plus, Mail, MessageCircle, Linkedin,
  Clock, CheckCircle, Send, Archive, Eye, X,
  BarChart3, Zap, TrendingUp,
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

/* ─── channel config ─── */
const CHANNEL_CONFIG: Record<string, {
  icon: React.FC<any>; label: string;
  badge: string; bar: string;
}> = {
  whatsapp: {
    icon: MessageCircle, label: 'WhatsApp',
    badge: 'bg-green-50 border-green-200 text-green-700',
    bar: 'bg-gradient-to-r from-green-400 to-emerald-500',
  },
  email: {
    icon: Mail, label: 'Email',
    badge: 'bg-blue-50 border-blue-200 text-blue-700',
    bar: 'bg-gradient-to-r from-blue-400 to-indigo-500',
  },
  linkedin: {
    icon: Linkedin, label: 'LinkedIn',
    badge: 'bg-sky-50 border-sky-200 text-sky-700',
    bar: 'bg-gradient-to-r from-sky-400 to-cyan-500',
  },
};

const defaultChannel = {
  icon: Zap, label: 'Other',
  badge: 'bg-purple-50 border-purple-200 text-purple-700',
  bar: 'bg-gradient-to-r from-purple-400 to-violet-500',
};

/* ─── status config ─── */
const STATUS_CONFIG: Record<string, { pill: string; icon: React.FC<any>; dot: string }> = {
  ready:    { pill: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' },
  sent:     { pill: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',          icon: Send,        dot: 'bg-blue-500'    },
  archived: { pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',       icon: Archive,     dot: 'bg-slate-400'   },
  draft:    { pill: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',       icon: Clock,       dot: 'bg-amber-400'   },
};

const getStatus  = (s: string) => STATUS_CONFIG[s]  ?? STATUS_CONFIG.draft;
const getChannel = (c: string) => CHANNEL_CONFIG[c] ?? defaultChannel;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ════════════════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════════════════ */
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 900 }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{display}</>;
};

/* ════════════════════════════════════════════
   STAT CARD — fade-up + count-up
════════════════════════════════════════════ */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.FC<any>;
  gradient: string;
  sub?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, gradient, sub, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md ${gradient}
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      {/* decorative rings */}
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-1 top-8  h-12 w-12 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 leading-none mb-2">
            {title}
          </p>
          <p className="text-[2rem] font-black leading-none tabular-nums">
            {visible ? <AnimatedNumber value={value} /> : 0}
          </p>
          {sub && <p className="mt-1.5 text-[11px] opacity-70 font-medium">{sub}</p>}
        </div>
        <span className="shrink-0 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm mt-0.5">
          <Icon size={17} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   CAMPAIGN CARD
════════════════════════════════════════════ */
const CampaignCard: React.FC<{ w: CampaignWorkspace; onClick: () => void }> = ({ w, onClick }) => {
  const ch = getChannel(w.selected_channel);
  const st = getStatus(w.status);
  const ChIcon = ch.icon;
  const responseCount = w.responses?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-slate-200 shadow-sm
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col
        overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
    >
      {/* top colour bar */}
      <div className={`h-1 w-full ${ch.bar}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* channel + status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${ch.badge}`}>
            <ChIcon size={12} strokeWidth={2.5} />
            {ch.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${st.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {w.status.toUpperCase()}
          </span>
        </div>

        {/* name */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-violet-600 transition-colors line-clamp-1">
            {w.name}
          </h3>
          {w.brand_name && (
            <p className="text-xs text-slate-400 mt-0.5">{w.brand_name}</p>
          )}
        </div>

        {/* theme */}
        {w.content_theme && (
          <span className="self-start bg-violet-50 text-violet-600 border border-violet-200 text-xs font-medium px-2.5 py-1 rounded-lg">
            {w.content_theme}
          </span>
        )}

        {/* subject */}
        {w.generated_subject && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Subject</p>
            <p className="text-xs text-slate-700 font-medium line-clamp-1">{w.generated_subject}</p>
          </div>
        )}

        {/* content preview */}
        {w.generated_content && (
          <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{w.generated_content}</p>
          </div>
        )}

        {/* footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
          <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>
          <div className="flex items-center gap-2">
            {responseCount > 0 && (
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg font-semibold border border-emerald-200">
                {responseCount} response{responseCount > 1 ? 's' : ''}
              </span>
            )}
            <span className="text-slate-300 group-hover:text-violet-500 transition-colors">
              <Eye size={14} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

/* ════════════════════════════════════════════
   DETAIL MODAL
════════════════════════════════════════════ */
const DetailModal: React.FC<{ w: CampaignWorkspace; onClose: () => void }> = ({ w, onClose }) => {
  const ch = getChannel(w.selected_channel);
  const st = getStatus(w.status);
  const StIcon = st.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 w-full rounded-t-2xl ${ch.bar}`} />

        <div className="p-6 md:p-8">
          {/* modal header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-800 leading-tight">{w.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {[w.brand_name, ch.label, formatDate(w.created_at)].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${st.pill}`}>
                <StIcon size={11} />
                {w.status.toUpperCase()}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {w.content_theme && (
            <div className="mb-4">
              <span className="bg-violet-50 text-violet-600 border border-violet-200 text-xs font-medium px-3 py-1 rounded-lg">
                Theme: {w.content_theme}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {w.target_description && <Section label="Target Audience" value={w.target_description} />}
            {w.generated_subject  && <Section label="Subject Line"    value={w.generated_subject}  bold />}

            {w.generated_content && (
              <div>
                <SectionLabel>Generated Content</SectionLabel>
                <div className="mt-1.5 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{w.generated_content}</p>
                </div>
              </div>
            )}

            {w.responses && w.responses.length > 0 && (
              <div>
                <SectionLabel>Responses ({w.responses.length})</SectionLabel>
                <div className="mt-1.5 space-y-2">
                  {w.responses.map((r: any) => (
                    <div key={r.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <span>{r.lead_name}</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        <span className="text-emerald-600 font-medium capitalize">
                          {r.response_type?.replace('_', ' ')}
                        </span>
                      </div>
                      {r.response_text && <p className="mt-1 text-slate-600">{r.response_text}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* helpers */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</p>
);
const Section: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <div>
    <SectionLabel>{label}</SectionLabel>
    <p className={`mt-1 text-sm text-slate-700 ${bold ? 'font-semibold' : ''}`}>{value}</p>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export const CampaignWorkspaceList = () => {
  const [workspaces, setWorkspaces]               = useState<CampaignWorkspace[]>([]);
  const [analytics, setAnalytics]                 = useState<any>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<CampaignWorkspace | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const wsRes        = await fetch(`${API_BASE}/campaign-workspace/`);
      const wsData       = await wsRes.json();
      setWorkspaces(wsData);

      const analyticsRes  = await fetch(`${API_BASE}/campaign-workspace/analytics/`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="min-h-screen bg-[#f4f5f9]">

      {/* ── HEADER BANNER
           Soft purple gradient that harmonises with the dark navy sidebar
           without competing — same hue family, much lighter value.        ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6c47ff] via-[#7c5cfc] to-[#9b7bfe] px-6 py-7 md:px-10 md:py-9">
        {/* subtle radial highlight */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-64 opacity-10"
          style={{ background: 'radial-gradient(ellipse at top right, white 0%, transparent 70%)' }}
        />
        <div className="pointer-events-none absolute -bottom-6 left-1/3 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Wand2 size={17} className="text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight tracking-tight">
                Campaign Workspace
              </h1>
              <p className="text-xs text-white/70 mt-0.5">
                Generate and manage multi-channel campaign drafts powered by AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/campaign-workspace/new')}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white text-violet-700
              hover:bg-violet-50 active:bg-violet-100
              px-4 py-2 text-sm font-bold shadow-md shadow-violet-900/20
              transition-all duration-150 hover:scale-[1.03]"
          >
            <Plus size={15} strokeWidth={2.5} />
            New Workspace
          </button>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="mx-auto max-w-7xl px-4 py-7 md:px-8">

        {/* stat cards */}
        {analytics && (
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              title="Total Workspaces" value={Number(analytics.total_workspaces ?? 0)}
              icon={BarChart3} gradient="bg-gradient-to-br from-slate-600 to-slate-800"
              sub="all time" delay={0}
            />
            <StatCard
              title="Ready" value={Number(analytics.ready_campaigns ?? 0)}
              icon={CheckCircle} gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              sub="awaiting send" delay={80}
            />
            <StatCard
              title="Sent" value={Number(analytics.sent_campaigns ?? 0)}
              icon={Send} gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              sub="delivered" delay={160}
            />
            <StatCard
              title="Interested" value={Number(analytics.responses?.interested ?? 0)}
              icon={TrendingUp} gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              sub="responses" delay={240}
            />
          </div>
        )}

        {/* section label — light, not bold */}
        {workspaces.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              All Campaigns
              <span className="ml-1.5 normal-case font-normal tracking-normal text-slate-300">
                ({workspaces.length})
              </span>
            </p>
          </div>
        )}

        {/* campaign grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((w) => (
            <CampaignCard key={w.id} w={w} onClick={() => setSelectedWorkspace(w)} />
          ))}

          {workspaces.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20
              bg-white border border-dashed border-slate-200 rounded-2xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <Wand2 size={24} className="text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No campaigns yet</p>
              <p className="mt-1 text-xs text-slate-400">Create your first AI-powered campaign draft.</p>
              <button
                onClick={() => navigate('/campaign-workspace/new')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600
                  hover:bg-violet-500 text-white px-5 py-2 text-sm font-semibold shadow transition-all"
              >
                <Plus size={14} /> Create Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {/* modal */}
      {selectedWorkspace && (
        <DetailModal w={selectedWorkspace} onClose={() => setSelectedWorkspace(null)} />
      )}
    </div>
  );
};

export default CampaignWorkspaceList;