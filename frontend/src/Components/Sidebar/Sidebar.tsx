// src/Components/Sidebar/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  RefreshCw,
  GitBranch,
  Workflow,
  CheckSquare,
  Users,
  BookOpen,
  Bot,
  Terminal,
  BarChart3,
  MessageCircle,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/smart-refills', label: 'Smart Refills',    icon: RefreshCw },
  { path: '/pipeline',      label: 'Pipeline',         icon: GitBranch },
  { path: '/workflows',     label: 'Workflows',        icon: Workflow },
  { path: '/tasks',         label: 'Tasks',            icon: CheckSquare },
  { path: '/contacts',      label: 'Contacts',         icon: Users },
  { path: '/playbooks',     label: 'Playbooks',        icon: BookOpen },
  { path: '/auto-agent',    label: 'Auto Agent',       icon: Bot },
  { path: '/agent-logs',    label: 'Agent Logs',       icon: Terminal },
  { path: '/bdm-core',      label: 'BDM Dashboard',    icon: BarChart3 },
  { path: '/whatsapp',      label: 'WhatsApp',         icon: MessageCircle },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">BD CRM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 text-sm font-medium
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};