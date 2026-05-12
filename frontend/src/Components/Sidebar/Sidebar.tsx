import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Workflow, CheckSquare,
  Users, BookOpen, Terminal, BarChart3,
  Target, BrainCircuit, TrendingUp,
  Wand2,
  CalendarDays,
  UserPlus
} from 'lucide-react';
import { api } from '../Utils/api';
import { authStore } from '../Utils/auth';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/bdm-targets',   label: 'BDM Targets',     icon: Target },
  { path: '/campaign-workspace', label: 'Campaign Workspace', icon: Wand2 },
  { path: '/activity-planner', label: 'Activity Planner', icon: CalendarDays, isNew: true },
  { path: '/pipeline',      label: 'Pipeline',        icon: GitBranch },
  { path: '/ai-command',    label: 'AI Assistant',    icon: BrainCircuit, isNew: true },
  { path: '/ai-analytics',  label: 'AI Analytics',    icon: TrendingUp, isNew: true },
  { path: '/workflows',     label: 'Workflows',       icon: Workflow },
  { path: '/tasks',         label: 'Tasks',           icon: CheckSquare },
  { path: '/contacts',      label: 'Contacts',        icon: Users },
  { path: '/playbooks',     label: 'Playbooks',       icon: BookOpen },
  { path: '/prospector',    label: 'AI Prospector',   icon: Target },
  { path: '/agent-logs',    label: 'Agent Logs',      icon: Terminal },
  { path: '/bdm-core',      label: 'BDM Dashboard',   icon: BarChart3 },
  // { path: '/whatsapp',      label: 'WhatsApp',        icon: MessageCircle },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);
  const currentUser = authStore.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const visibleNavItems = isAdmin
    ? [...navItems, { path: '/create-user', label: 'Create User', icon: UserPlus }]
    : navItems;

  useEffect(() => {
    const fetchCount = () => {
      api.aiUnreadCount()
        .then(d => setAlertCount(d.unread || 0))
        .catch(() => {});
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authStore.clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">BD</span> CRM
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold ml-auto">
            AI
          </span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 text-sm font-medium relative
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>

              {/* NEW badge */}
              {item.isNew && (
                <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold ml-auto">
                  NEW
                </span>
              )}

              {/* Alert count badge on AI Assistant */}
              {item.path === '/ai-command' && alertCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          AI Engine Active
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full rounded-lg bg-slate-800 text-slate-100 text-sm py-2 hover:bg-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
