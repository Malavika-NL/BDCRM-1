import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  GitBranch,
  Workflow,
  CheckSquare,
  Users,
  BookOpen,
  BarChart3,
  Target,
  BrainCircuit,
  TrendingUp,
  Wand2,
  CalendarDays,
  UserPlus,
  PanelLeftClose,
  ChevronDown,
  Settings,
  Building2,
  Heart,
} from 'lucide-react';
import { api } from '../Utils/api';
import { authStore } from '../Utils/auth';

type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  isNew?: boolean;
};

const topNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, bg: 'bg-gradient-to-br from-sky-400 to-blue-600' },
  { path: '/bdm-targets', label: 'BD Targets', icon: Target, bg: 'bg-gradient-to-br from-amber-400 to-orange-600' },
  { path: '/campaign-workspace', label: 'Campaign Workspace', icon: Wand2, bg: 'bg-gradient-to-br from-violet-400 to-purple-700' },
  { path: '/activity-planner', label: 'Activity Planner', icon: CalendarDays, bg: 'bg-gradient-to-br from-emerald-400 to-green-600', isNew: true },
  { path: '/pipeline', label: 'Pipeline', icon: GitBranch, bg: 'bg-gradient-to-br from-blue-400 to-blue-700' },
];

const aiNavItems: NavItem[] = [
  { path: '/ai-command', label: 'AI Assistant', icon: BrainCircuit, bg: 'bg-gradient-to-br from-pink-400 to-rose-600', isNew: true },
  { path: '/ai-analytics', label: 'AI Analytics', icon: TrendingUp, bg: 'bg-gradient-to-br from-teal-400 to-cyan-700', isNew: true },
  { path: '/prospector', label: 'AI Prospector', icon: Target, bg: 'bg-gradient-to-br from-purple-400 to-purple-700' },
];

const bottomNavItems: NavItem[] = [
  { path: '/workflows', label: 'Workflows', icon: Workflow, bg: 'bg-gradient-to-br from-yellow-400 to-amber-600' },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare, bg: 'bg-gradient-to-br from-green-400 to-green-600' },
  { path: '/contacts', label: 'Contacts', icon: Users, bg: 'bg-gradient-to-br from-cyan-400 to-cyan-700' },
  { path: '/wishlist', label: 'Wishlist', icon: Heart, bg: 'bg-gradient-to-br from-rose-400 to-pink-600' },
  { path: '/playbooks', label: 'Playbooks', icon: BookOpen, bg: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  { path: '/bdm-core', label: 'BD Dashboard', icon: BarChart3, bg: 'bg-gradient-to-br from-indigo-400 to-blue-700' },
];

const adminItem: NavItem = {
  path: '/create-user',
  label: 'Create User',
  icon: UserPlus,
  bg: 'bg-gradient-to-br from-pink-400 to-pink-700',
};

const accountTargetingItems: NavItem[] = [
  { path: '/account-targetting', label: 'Company Registry', icon: Building2, bg: 'bg-gradient-to-br from-cyan-500 to-teal-600' },
  { path: '/account-targetting/owners', label: 'Owner Summary', icon: Users, bg: 'bg-gradient-to-br from-sky-500 to-blue-700' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = authStore.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const utilityNavItems = isAdmin ? [...bottomNavItems, adminItem] : bottomNavItems;

  const isAiRoute = aiNavItems.some((item) => location.pathname.startsWith(item.path));
  const [aiOpen, setAiOpen] = useState(() => isAiRoute);
  const isAccountTargetingRoute = accountTargetingItems.some((item) => location.pathname.startsWith(item.path));
  const [accountTargetingOpen, setAccountTargetingOpen] = useState(() => isAccountTargetingRoute);

  useEffect(() => {
    const fetchCount = () => {
      api.aiUnreadCount().then((d) => setAlertCount(d.unread || 0)).catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAiRoute) setAiOpen(true);
  }, [isAiRoute]);

  useEffect(() => {
    if (isAccountTargetingRoute) setAccountTargetingOpen(true);
  }, [isAccountTargetingRoute]);

  const renderNavItem = (item: NavItem, index: number, nested = false) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={collapsed ? item.label : undefined}
        style={{ animationDelay: `${0.2 + index * 0.04}s` }}
        className={({ isActive }) => `
          group flex items-center gap-3 rounded-xl
          font-medium text-[13.5px] relative overflow-hidden
          transition-all duration-200 no-underline
          animate-[slideInLeft_0.4s_cubic-bezier(0.34,1.2,0.64,1)_both]
          ${collapsed
            ? 'w-[46px] h-[44px] mx-auto justify-center p-0'
            : nested
              ? 'h-[40px] w-full pl-5 pr-3'
              : 'h-[46px] w-full px-3'}
          ${isActive
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
        `}
      >
        {({ isActive }) => (
          <>
            <div className={`
              flex items-center justify-center shrink-0 rounded-[9px]
              ${nested ? 'w-[28px] h-[28px]' : 'w-[32px] h-[32px]'} text-white
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
              transition-transform duration-200
              group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-1
              ${isActive ? 'bg-white/25 !transform-none' : item.bg}
            `}>
              <Icon size={nested ? 13 : 15} />
            </div>

            {!collapsed && <span className="truncate">{item.label}</span>}

            {!collapsed && item.isNew && (
              <span className={`
                ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded
                ${isActive ? 'bg-white/25 text-white' : 'bg-indigo-500 text-white'}
              `}>
                NEW
              </span>
            )}

            {item.path === '/ai-command' && alertCount > 0 && aiOpen && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  const showAiAlertOnParent = alertCount > 0 && (!aiOpen || collapsed);

  return (
    <aside
      className={`
        relative flex flex-col h-full bg-white border-r border-slate-200
        shadow-[2px_0_16px_rgba(15,23,42,0.07)]
        transition-all duration-300 ease-in-out overflow-visible
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      <button
        onClick={() => setCollapsed((p) => !p)}
        className={`
          absolute -right-3.5 top-[34px] -translate-y-1/2 z-50
          w-7 h-7 flex items-center justify-center
          bg-white border-[1.5px] border-slate-200 rounded-full
          text-slate-400 cursor-pointer
          transition-all duration-300
          hover:text-indigo-600 hover:border-indigo-300
          hover:shadow-[0_2px_12px_rgba(79,70,229,0.25)]
          ${collapsed ? 'rotate-180' : ''}
        `}
      >
        <PanelLeftClose size={15} />
      </button>

      <div className={`
        flex items-center border-b border-slate-100 shrink-0 h-[68px]
        ${collapsed ? 'justify-center px-0' : 'px-5'}
      `}>
        {!collapsed && (
          <div className="flex flex-col gap-0.5 overflow-hidden w-full items-center">
            <div className="text-[36px] leading-none font-black tracking-[2px] text-slate-900 whitespace-nowrap text-center">
              <span className="text-blue-800">BD</span>
              <span className="text-pink-600">CRM</span>
            </div>
            <div className="text-[9px] font-bold text-slate-400 tracking-[1.8px] uppercase text-center">
              AI-Powered CRM
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-[11px] font-black">BD</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-visible px-2.5 py-3 space-y-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {topNavItems.map((item, i) => renderNavItem(item, i))}

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setAiOpen((prev) => !prev)}
            title={collapsed ? 'AI Features' : undefined}
            className={`
              group w-full flex items-center gap-3 rounded-xl
              font-medium text-[13.5px] relative overflow-hidden
              transition-all duration-200
              ${collapsed ? 'w-[46px] h-[44px] mx-auto justify-center p-0' : 'h-[46px] px-3'}
              ${isAiRoute
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
            `}
          >
            <div className={`
              flex items-center justify-center shrink-0 rounded-[9px]
              w-[32px] h-[32px] text-white
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
              transition-transform duration-200
              group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-1
              ${isAiRoute ? 'bg-white/25 !transform-none' : 'bg-gradient-to-br from-fuchsia-500 to-violet-600'}
            `}>
              <BrainCircuit size={15} />
            </div>

            {!collapsed && <span className="truncate">AI Features</span>}

            {!collapsed && (
              <ChevronDown
                size={15}
                className={`ml-auto transition-transform duration-200 ${aiOpen ? 'rotate-0' : '-rotate-90'}`}
              />
            )}

            {showAiAlertOnParent && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>

          {aiOpen && (
            <div className={`${collapsed ? 'space-y-1 mt-1' : 'space-y-1 mt-1 pl-2 border-l-2 border-indigo-100 ml-2'}`}>
              {aiNavItems.map((item, i) => renderNavItem(item, topNavItems.length + i, true))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setAccountTargetingOpen((prev) => !prev)}
            title={collapsed ? 'Account Targetting' : undefined}
            className={`
              group w-full flex items-center gap-3 rounded-xl
              font-medium text-[13.5px] relative overflow-hidden
              transition-all duration-200
              ${collapsed ? 'w-[46px] h-[44px] mx-auto justify-center p-0' : 'h-[46px] px-3'}
              ${isAccountTargetingRoute
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'}
            `}
          >
            <div className={`
              flex items-center justify-center shrink-0 rounded-[9px]
              w-[32px] h-[32px] text-white
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
              transition-transform duration-200
              group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-1
              ${isAccountTargetingRoute ? 'bg-white/25 !transform-none' : 'bg-gradient-to-br from-cyan-500 to-teal-600'}
            `}>
              <Building2 size={15} />
            </div>

            {!collapsed && <span className="truncate">Account Targetting</span>}

            {!collapsed && (
              <ChevronDown
                size={15}
                className={`ml-auto transition-transform duration-200 ${accountTargetingOpen ? 'rotate-0' : '-rotate-90'}`}
              />
            )}
          </button>

          {accountTargetingOpen && (
            <div className={`${collapsed ? 'space-y-1 mt-1' : 'space-y-1 mt-1 pl-2 border-l-2 border-cyan-100 ml-2'}`}>
              {accountTargetingItems.map((item, i) => renderNavItem(item, topNavItems.length + aiNavItems.length + i + 1, true))}
            </div>
          )}
        </div>

        {utilityNavItems.map((item, i) => renderNavItem(item, topNavItems.length + aiNavItems.length + accountTargetingItems.length + i + 2))}
      </nav>

      <div className={`shrink-0 border-t border-slate-100 p-2 ${collapsed ? 'pb-3' : 'pb-4'}`}>
        <NavLink
          to="/settings/change-password"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) => `
            group w-full flex items-center gap-3 rounded-xl
            font-medium text-[13.5px] relative overflow-hidden
            transition-all duration-200 no-underline
            ${collapsed ? 'w-[46px] h-[44px] mx-auto justify-center p-0' : 'h-[46px] px-3'}
            ${isActive
              ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-[0_4px_14px_rgba(51,65,85,0.28)]'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`
                flex items-center justify-center shrink-0 rounded-[9px]
                w-[32px] h-[32px] text-white
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
                transition-transform duration-200
                group-hover:-translate-y-0.5 group-hover:scale-110
                ${isActive ? 'bg-white/25' : 'bg-gradient-to-br from-slate-500 to-slate-700'}
              `}>
                <Settings size={15} />
              </div>
              {!collapsed && <span className="truncate">Settings</span>}
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
