// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { X, LogOut } from 'lucide-react';
// import { authStore } from '../Utils/auth';

// const getAbbreviation = (name: string) =>
//   name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

// export const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const popupRef = useRef<HTMLDivElement>(null);
//   const currentUser = authStore.getUser();

//   const userName = currentUser?.name || currentUser?.username || currentUser?.email || 'User';
//   const userEmail = currentUser?.email || '';
//   const abbreviation = getAbbreviation(userName);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     if (isOpen) document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen]);

//   return (
//     <header className="h-[68px] bg-[#001740] flex items-center justify-between px-4 shrink-0 z-20 shadow-[0_3px_8px_rgba(0,0,0,0.24)]">

//       {/* ── Brand ── */}
//       <div className="flex flex-col gap-0.5">
//         <span
//           className="text-[26px] font-extrabold tracking-[2px] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent"
//           style={{ backgroundSize: '220% 100%', animation: 'brandFlow 4.2s ease-in-out infinite alternate' }}
//         >
//           VAIJNANIK
//         </span>
//         <span className="text-[10px] font-bold text-blue-100 tracking-[2.5px] uppercase opacity-85">
//           Business Solutions
//         </span>
//       </div>

//       <style>{`
//         @keyframes brandFlow {
//           from { background-position: 0% 50%; }
//           to   { background-position: 100% 50%; }
//         }
//       `}</style>

//       {/* ── Avatar ── */}
//       <div className="relative" ref={popupRef}>
//         <button
//           onClick={() => setIsOpen(p => !p)}
//           className="w-11 h-11 rounded-full font-bold text-[15px] flex items-center justify-center bg-white text-[#001740] hover:bg-slate-200 transition-colors"
//         >
//           {abbreviation}
//         </button>

//         {/* ── Popup ── */}
//         {isOpen && (
//           <div className="absolute right-0 top-full mt-3 w-[320px] bg-[#f1f3f4] rounded-[22px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] z-50 flex flex-col justify-between p-5 overflow-hidden"
//             style={{ height: '300px' }}
//           >
//             {/* Close */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-300 transition-colors"
//             >
//               <X size={14} />
//             </button>

//             {/* Profile info */}
//             <div className="flex flex-col items-center gap-1 mt-2">
//               <p className="text-[11px] text-[#001740]">{userEmail}</p>

//               {/* Avatar with gradient border matching VAIJNANIK text */}
//               <div className="mt-3 p-[3px] rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-violet-400">
//                 <div className="w-[58px] h-[58px] rounded-full bg-[#001740] text-white font-bold text-xl flex items-center justify-center">
//                   {abbreviation}
//                 </div>
//               </div>

//               <p className="text-[18px] font-semibold text-[#001740] mt-1">
//                 Hi, {userName}!
//               </p>
//             </div>

//             {/* Bottom */}
//             <div className="flex flex-col items-center gap-3">
//               <button
//                 onClick={() => { authStore.clearSession(); navigate('/login', { replace: true }); }}
//                 className="flex items-center gap-2 px-7 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
//                 style={{
//                   background: 'linear-gradient(135deg, #67E8F9, #60A5FA, #A78BFA)',
//                   backgroundSize: '200% 100%',
//                   animation: 'brandFlow 3s ease-in-out infinite alternate',
//                   boxShadow: '0 0 12px rgba(103,232,249,0.35)',
//                 }}
//               >
//                 <LogOut size={14} />
//                 Sign Out
//               </button>

//               <div className="flex gap-5">
//                 <span className="text-[10px] text-[#001740] cursor-pointer hover:underline">Privacy policy</span>
//                 <span className="text-[10px] text-[#001740] cursor-pointer hover:underline">Terms of service</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };



import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import Bell icon
import { X, LogOut, Bell } from 'lucide-react';
import { authStore } from '../Utils/auth';
import { api } from '../Utils/api';

const getAbbreviation = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const seenAlertIdsRef = useRef<Set<number>>(new Set());
  const popupRef = useRef<HTMLDivElement>(null);
  const currentUser = authStore.getUser();

  const userName =
    `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() ||
    currentUser?.username ||
    currentUser?.email ||
    'User';
  const userEmail = currentUser?.email || '';
  const abbreviation = getAbbreviation(userName);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const loadAlerts = async () => {
      const [countRes, unreadAlerts] = await Promise.all([
        api.aiUnreadCount(),
        api.aiGetAlerts(false),
      ]);
      setUnreadCount(countRes?.unread || 0);

      const newOnes = (unreadAlerts || []).filter((a: any) => !seenAlertIdsRef.current.has(a.id));
      newOnes.forEach((a: any) => seenAlertIdsRef.current.add(a.id));
      if (newOnes.length > 0) {
        setLiveAlerts((prev) => [...newOnes.slice(0, 4), ...prev].slice(0, 5));
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (liveAlerts.length === 0) return;
    const timer = setTimeout(() => {
      setLiveAlerts((prev) => prev.slice(0, -1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [liveAlerts]);

  return (
    <header className="h-[68px] bg-[#001740] flex items-center justify-between pr-4 pl-0 shrink-0 z-20 shadow-[0_3px_8px_rgba(0,0,0,0.24)]">

      {/* ── Brand ── */}
      <div className="flex flex-col gap-0.5 items-start justify-center">
        <span
          className="text-[26px] leading-none font-extrabold tracking-[2px] bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent"
          style={{ backgroundSize: '220% 100%', animation: 'brandFlow 4.2s ease-in-out infinite alternate' }}
        >
          VAIJNANIK
        </span>
        <span className="text-[10px] font-bold text-blue-100 tracking-[2.5px] uppercase opacity-85">
          BUSINESS SOLUTIONS
        </span>
      </div>

      <style>{`
        @keyframes brandFlow {
          from { background-position: 0% 50%; }
          to   { background-position: 100% 50%; }
        }
      `}</style>

      {/* ── Right side actions (Notifications + Avatar) ── */}
      <div className="flex items-center gap-3">

        {/* Notification Button */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute mt-[-20px] ml-[18px] min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar & Popup */}
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setIsOpen(p => !p)}
            className="w-11 h-11 rounded-full font-bold text-[15px] flex items-center justify-center bg-white text-[#001740] hover:bg-slate-200 transition-colors"
          >
            {abbreviation}
          </button>

          {/* Popup */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-3 w-[320px] bg-[#f1f3f4] rounded-[22px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] z-50 flex flex-col justify-between p-5 overflow-hidden"
              style={{ height: '300px' }}
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-300 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Profile info */}
              <div className="flex flex-col items-center gap-1 mt-2">
                <p className="text-[11px] text-[#001740]">{userEmail}</p>

                {/* Avatar with gradient border */}
                <div className="mt-3 p-[3px] rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-violet-400">
                  <div className="w-[58px] h-[58px] rounded-full bg-[#001740] text-white font-bold text-xl flex items-center justify-center">
                    {abbreviation}
                  </div>
                </div>

                <p className="text-[18px] font-semibold text-[#001740] mt-1">
                  Hi, {userName}!
                </p>
              </div>

              {/* Bottom */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    authStore.clearSession();
                    const portalUrl = `${window.location.protocol}//${window.location.hostname}:8002`;
                    window.location.replace(`${portalUrl}?workspace=1`);
                  }}
                  className="flex items-center gap-2 px-7 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03]"
                  style={{
                    background: 'linear-gradient(135deg, #67E8F9, #60A5FA, #A78BFA)',
                    backgroundSize: '200% 100%',
                    animation: 'brandFlow 3s ease-in-out infinite alternate',
                    boxShadow: '0 0 12px rgba(103,232,249,0.35)',
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>

                <div className="flex gap-5">
                  <span className="text-[10px] text-[#001740] cursor-pointer hover:underline">Privacy policy</span>
                  <span className="text-[10px] text-[#001740] cursor-pointer hover:underline">Terms of service</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {liveAlerts.length > 0 && (
        <div className="fixed right-4 top-[82px] z-[90] space-y-2 w-[320px]">
          {liveAlerts.map((alert) => (
            <button
              key={alert.id}
              onClick={() => navigate('/notifications')}
              className="w-full text-left rounded-xl bg-white border border-indigo-200 shadow-lg p-3 hover:bg-indigo-50 transition-colors"
            >
              <p className="text-[12px] font-black text-slate-900 truncate">{alert.title}</p>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{alert.description}</p>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
