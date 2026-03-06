import React from 'react';
import { LayoutDashboard, Kanban, Users, BookOpen, CheckSquare, Sparkles, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const topMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'contacts', label: 'All Leads', icon: Users },
    { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800/50 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">BD<span className="text-blue-400">CRM</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sales Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4 relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">Main Menu</p>
        {topMenu.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              }`}
            >
              {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-slate-800/50 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/40 transition cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            BD
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">BD Agent</p>
            <p className="text-xs text-slate-500">Sales Team</p>
          </div>
          <Settings size={16} className="text-slate-600 hover:text-slate-400 transition" />
        </div>
      </div>
    </aside>
  );
};