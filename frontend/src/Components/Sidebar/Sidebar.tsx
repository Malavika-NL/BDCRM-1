// import React, { useEffect, useState } from 'react';
// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard, GitBranch, Workflow, CheckSquare,
//   Users, BookOpen, Terminal, BarChart3,
//   Target, BrainCircuit, TrendingUp,
//   Wand2,
//   CalendarDays,
//   UserPlus
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import { authStore } from '../Utils/auth';

// const navItems = [
//   { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
//   { path: '/bdm-targets',   label: 'BDM Targets',     icon: Target },
//   { path: '/campaign-workspace', label: 'Campaign Workspace', icon: Wand2 },
//   { path: '/activity-planner', label: 'Activity Planner', icon: CalendarDays, isNew: true },
//   { path: '/pipeline',      label: 'Pipeline',        icon: GitBranch },
//   { path: '/ai-command',    label: 'AI Assistant',    icon: BrainCircuit, isNew: true },
//   { path: '/ai-analytics',  label: 'AI Analytics',    icon: TrendingUp, isNew: true },
//   { path: '/workflows',     label: 'Workflows',       icon: Workflow },
//   { path: '/tasks',         label: 'Tasks',           icon: CheckSquare },
//   { path: '/contacts',      label: 'Contacts',        icon: Users },
//   { path: '/playbooks',     label: 'Playbooks',       icon: BookOpen },
//   { path: '/prospector',    label: 'AI Prospector',   icon: Target },
//   { path: '/agent-logs',    label: 'Agent Logs',      icon: Terminal },
//   { path: '/bdm-core',      label: 'BDM Dashboard',   icon: BarChart3 },
//   // { path: '/whatsapp',      label: 'WhatsApp',        icon: MessageCircle },
// ];

// export const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [alertCount, setAlertCount] = useState(0);
//   const currentUser = authStore.getUser();
//   const isAdmin = currentUser?.role === 'admin';
//   const visibleNavItems = isAdmin
//     ? [...navItems, { path: '/create-user', label: 'Create User', icon: UserPlus }]
//     : navItems;

//   useEffect(() => {
//     const fetchCount = () => {
//       api.aiUnreadCount()
//         .then(d => setAlertCount(d.unread || 0))
//         .catch(() => {});
//     };

//     fetchCount();
//     const interval = setInterval(fetchCount, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     authStore.clearSession();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
//       {/* Logo */}
//       <div className="p-6 border-b border-slate-700">
//         <h1 className="text-xl font-bold flex items-center gap-2">
//           <span className="text-blue-400">BD</span> CRM
//           <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold ml-auto">
//             AI
//           </span>
//         </h1>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
//         {visibleNavItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;

//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={`
//                 flex items-center gap-3 px-4 py-3 rounded-lg
//                 transition-all duration-200 text-sm font-medium relative
//                 ${isActive
//                   ? 'bg-blue-600 text-white'
//                   : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                 }
//               `}
//             >
//               <Icon size={20} />
//               <span>{item.label}</span>

//               {/* NEW badge */}
//               {item.isNew && (
//                 <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold ml-auto">
//                   NEW
//                 </span>
//               )}

//               {/* Alert count badge on AI Assistant */}
//               {item.path === '/ai-command' && alertCount > 0 && (
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
//                   {alertCount > 9 ? '9+' : alertCount}
//                 </span>
//               )}
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-slate-700">
//         <div className="flex items-center gap-2 text-xs text-slate-500">
//           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//           AI Engine Active
//         </div>
//         <button
//           onClick={handleLogout}
//           className="mt-3 w-full rounded-lg bg-slate-800 text-slate-100 text-sm py-2 hover:bg-slate-700 transition-colors"
//         >
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };



// import React, { useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard, GitBranch, Workflow, CheckSquare,
//   Users, BookOpen, Terminal, BarChart3,
//   Target, BrainCircuit, TrendingUp,
//   Wand2, CalendarDays, UserPlus, PanelLeftClose
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import { authStore } from '../Utils/auth';

// const navItems = [
//   { path: '/dashboard',          label: 'Dashboard',          icon: LayoutDashboard, bg: 'bg-gradient-to-br from-sky-400 to-blue-600' },
//   { path: '/bdm-targets',        label: 'BDM Targets',        icon: Target,          bg: 'bg-gradient-to-br from-amber-400 to-orange-600' },
//   { path: '/campaign-workspace', label: 'Campaign Workspace', icon: Wand2,           bg: 'bg-gradient-to-br from-violet-400 to-purple-700' },
//   { path: '/activity-planner',   label: 'Activity Planner',   icon: CalendarDays,    bg: 'bg-gradient-to-br from-emerald-400 to-green-600', isNew: true },
//   { path: '/pipeline',           label: 'Pipeline',           icon: GitBranch,       bg: 'bg-gradient-to-br from-blue-400 to-blue-700' },
//   { path: '/ai-command',         label: 'AI Assistant',       icon: BrainCircuit,    bg: 'bg-gradient-to-br from-pink-400 to-rose-600', isNew: true },
//   { path: '/ai-analytics',       label: 'AI Analytics',       icon: TrendingUp,      bg: 'bg-gradient-to-br from-teal-400 to-cyan-700', isNew: true },
//   { path: '/workflows',          label: 'Workflows',          icon: Workflow,        bg: 'bg-gradient-to-br from-yellow-400 to-amber-600' },
//   { path: '/tasks',              label: 'Tasks',              icon: CheckSquare,     bg: 'bg-gradient-to-br from-green-400 to-green-600' },
//   { path: '/contacts',           label: 'Contacts',           icon: Users,           bg: 'bg-gradient-to-br from-cyan-400 to-cyan-700' },
//   { path: '/playbooks',          label: 'Playbooks',          icon: BookOpen,        bg: 'bg-gradient-to-br from-orange-400 to-orange-600' },
//   { path: '/prospector',         label: 'AI Prospector',      icon: Target,          bg: 'bg-gradient-to-br from-purple-400 to-purple-700' },
//   // { path: '/agent-logs',         label: 'Agent Logs',         icon: Terminal,        bg: 'bg-gradient-to-br from-slate-400 to-slate-600' },
//   { path: '/bdm-core',           label: 'BDM Dashboard',      icon: BarChart3,       bg: 'bg-gradient-to-br from-indigo-400 to-blue-700' },
// ];

// const adminItem = {
//   path: '/create-user', label: 'Create User', icon: UserPlus,
//   bg: 'bg-gradient-to-br from-pink-400 to-pink-700'
// };

// export const Sidebar: React.FC = () => {
//   const navigate = useNavigate();
//   const [alertCount, setAlertCount] = useState(0);
//   const [collapsed, setCollapsed] = useState(false);
//   const currentUser = authStore.getUser();
//   const isAdmin = currentUser?.role === 'admin';
//   const visibleNavItems = isAdmin ? [...navItems, adminItem] : navItems;

//   useEffect(() => {
//     const fetchCount = () => {
//       api.aiUnreadCount().then(d => setAlertCount(d.unread || 0)).catch(() => {});
//     };
//     fetchCount();
//     const interval = setInterval(fetchCount, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <aside
//       className={`
//         flex flex-col h-full bg-white border-r border-slate-200
//         shadow-[2px_0_16px_rgba(15,23,42,0.07)]
//         transition-all duration-300 ease-in-out overflow-visible relative
//         ${collapsed ? 'w-[72px]' : 'w-[240px]'}
//       `}
//     >
//       {/* ── Logo ── */}
//       <div className={`
//         flex items-center border-b border-slate-100 shrink-0
//         ${collapsed ? 'justify-center px-0 py-5' : 'justify-between px-5 py-5'}
//       `}>
//         {!collapsed && (
//           <div className="flex flex-col gap-0.5 overflow-hidden">
//             <div className="text-[20px] font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
//               <span className="text-blue-600">BD</span> CRM
//             </div>
//             <div className="text-[9px] font-bold text-slate-400 tracking-[1.8px] uppercase">
//               AI-Powered CRM
//             </div>
//           </div>
//         )}
//         <PanelLeftClose
//           size={20}
//           onClick={() => setCollapsed(p => !p)}
//           className={`
//             text-slate-400 cursor-pointer shrink-0 p-0.5
//             bg-white border-[1.5px] border-slate-200 rounded-full
//             transition-all duration-300 hover:text-indigo-600
//             hover:border-indigo-300 hover:shadow-[0_2px_12px_rgba(79,70,229,0.25)]
//             ${collapsed ? 'rotate-180' : ''}
//           `}
//         />
//       </div>

//       {/* ── Nav ── */}
//       <nav className="flex-1 overflow-y-auto overflow-x-visible px-2.5 py-3 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//         {visibleNavItems.map((item, i) => {
//           const Icon = item.icon;
//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               title={collapsed ? item.label : undefined}
//               style={{ animationDelay: `${0.2 + i * 0.04}s` }}
//               className={({ isActive }) => `
//                 group flex items-center gap-3 rounded-xl
//                 font-medium text-[13.5px] relative overflow-hidden
//                 transition-all duration-200 no-underline
//                 animate-[slideInLeft_0.4s_cubic-bezier(0.34,1.2,0.64,1)_both]
//                 ${collapsed ? 'w-[46px] h-[46px] mx-auto justify-center p-0' : 'h-[46px] w-full px-3'}
//                 ${isActive
//                   ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
//                   : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'
//                 }
//               `}
//             >
//               {({ isActive }) => (
//                 <>
//                   {/* Icon pill */}
//                   <div className={`
//                     flex items-center justify-center shrink-0 rounded-[9px]
//                     w-[32px] h-[32px] text-white
//                     shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
//                     transition-transform duration-200
//                     group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:-rotate-3
//                     ${isActive ? 'bg-white/25 !transform-none' : item.bg}
//                   `}>
//                     <Icon size={15} />
//                   </div>

//                   {/* Label */}
//                   {!collapsed && <span className="truncate">{item.label}</span>}

//                   {/* NEW badge */}
//                   {!collapsed && item.isNew && (
//                     <span className={`
//                       ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded
//                       ${isActive ? 'bg-white/25 text-white' : 'bg-indigo-500 text-white'}
//                     `}>
//                       NEW
//                     </span>
//                   )}

//                   {/* Alert badge */}
//                   {item.path === '/ai-command' && alertCount > 0 && (
//                     <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
//                       {alertCount > 9 ? '9+' : alertCount}
//                     </span>
//                   )}
//                 </>
//               )}
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* ── Footer ── */}
//       {/* <div className="shrink-0 border-t border-slate-100 px-3 py-3 space-y-2">
//         <div className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${collapsed ? 'justify-center' : ''}`}>
//           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
//           {!collapsed && <span>AI Engine Active</span>}
//         </div>
//         {!collapsed && (
//           <button
//             onClick={() => { authStore.clearSession(); navigate('/login', { replace: true }); }}
//             className="w-full rounded-xl bg-slate-100 text-slate-600 text-[13px] font-semibold py-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
//           >
//             Logout
//           </button>
//         )}
//       </div> */}
//     </aside>
//   );
// };



import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Workflow, CheckSquare,
  Users, BookOpen, Terminal, BarChart3,
  Target, BrainCircuit, TrendingUp,
  Wand2, CalendarDays, UserPlus, PanelLeftClose
} from 'lucide-react';
import { api } from '../Utils/api';
import { authStore } from '../Utils/auth';

const navItems = [
  { path: '/dashboard',          label: 'Dashboard',          icon: LayoutDashboard, bg: 'bg-gradient-to-br from-sky-400 to-blue-600' },
  { path: '/bdm-targets',        label: 'BDM Targets',        icon: Target,          bg: 'bg-gradient-to-br from-amber-400 to-orange-600' },
  { path: '/campaign-workspace', label: 'Campaign Workspace', icon: Wand2,           bg: 'bg-gradient-to-br from-violet-400 to-purple-700' },
  { path: '/activity-planner',   label: 'Activity Planner',   icon: CalendarDays,    bg: 'bg-gradient-to-br from-emerald-400 to-green-600', isNew: true },
  { path: '/pipeline',           label: 'Pipeline',           icon: GitBranch,       bg: 'bg-gradient-to-br from-blue-400 to-blue-700' },
  { path: '/ai-command',         label: 'AI Assistant',       icon: BrainCircuit,    bg: 'bg-gradient-to-br from-pink-400 to-rose-600', isNew: true },
  { path: '/ai-analytics',       label: 'AI Analytics',       icon: TrendingUp,      bg: 'bg-gradient-to-br from-teal-400 to-cyan-700', isNew: true },
  { path: '/workflows',          label: 'Workflows',          icon: Workflow,        bg: 'bg-gradient-to-br from-yellow-400 to-amber-600' },
  { path: '/tasks',              label: 'Tasks',              icon: CheckSquare,     bg: 'bg-gradient-to-br from-green-400 to-green-600' },
  { path: '/contacts',           label: 'Contacts',           icon: Users,           bg: 'bg-gradient-to-br from-cyan-400 to-cyan-700' },
  { path: '/playbooks',          label: 'Playbooks',          icon: BookOpen,        bg: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  { path: '/prospector',         label: 'AI Prospector',      icon: Target,          bg: 'bg-gradient-to-br from-purple-400 to-purple-700' },
  { path: '/bdm-core',           label: 'BDM Dashboard',      icon: BarChart3,       bg: 'bg-gradient-to-br from-indigo-400 to-blue-700' },
];

const adminItem = {
  path: '/create-user', label: 'Create User', icon: UserPlus,
  bg: 'bg-gradient-to-br from-pink-400 to-pink-700'
};

export const Sidebar: React.FC = () => {
  const [alertCount, setAlertCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = authStore.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const visibleNavItems = isAdmin ? [...navItems, adminItem] : navItems;

  useEffect(() => {
    const fetchCount = () => {
      api.aiUnreadCount().then(d => setAlertCount(d.unread || 0)).catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={`
        relative flex flex-col h-full bg-white border-r border-slate-200
        shadow-[2px_0_16px_rgba(15,23,42,0.07)]
        transition-all duration-300 ease-in-out overflow-visible
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      {/* ── Toggle button on the border line ── */}
      <button
        onClick={() => setCollapsed(p => !p)}
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

      {/* ── Logo ── */}
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

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-visible px-2.5 py-3 space-y-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleNavItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={{ animationDelay: `${0.2 + i * 0.04}s` }}
              className={({ isActive }) => `
                group flex items-center gap-3 rounded-xl
                font-medium text-[13.5px] relative overflow-hidden
                transition-all duration-200 no-underline
                animate-[slideInLeft_0.4s_cubic-bezier(0.34,1.2,0.64,1)_both]
                ${collapsed ? 'w-[46px] h-[46px] mx-auto justify-center p-0' : 'h-[46px] w-full px-3'}
                ${isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-0.5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Icon pill */}
                  <div className={`
                    flex items-center justify-center shrink-0 rounded-[9px]
                    w-[32px] h-[32px] text-white
                    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
                    transition-transform duration-200
                    group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-1
                    ${isActive ? 'bg-white/25 !transform-none' : item.bg}
                  `}>
                    <Icon size={15} />
                  </div>

                  {/* Label */}
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* NEW badge */}
                  {!collapsed && item.isNew && (
                    <span className={`
                      ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded
                      ${isActive ? 'bg-white/25 text-white' : 'bg-indigo-500 text-white'}
                    `}>
                      NEW
                    </span>
                  )}

                  {/* Alert badge */}
                  {item.path === '/ai-command' && alertCount > 0 && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {alertCount > 9 ? '9+' : alertCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
