// // src/Components/Layout/MainLayout.tsx
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Sidebar } from '../Sidebar/Sidebar';

// const MainLayout: React.FC = () => {
//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
//       <Sidebar />
//       <main className="flex-1 min-h-0 h-screen overflow-y-auto overflow-x-hidden relative flex flex-col">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default MainLayout;


// src/Components/Layout/MainLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { Navbar } from '../Navbar/Navbar';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isEmbeddedDashboard = location.pathname === '/dashboard'
    && new URLSearchParams(location.search).get('embed') === '1';

  if (isEmbeddedDashboard) {
    return (
      <main className="h-screen overflow-y-auto overflow-x-hidden bg-slate-50 font-sans text-slate-900">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans text-slate-900">
      {/* Navbar — full width across the top */}
      <Navbar />

      {/* Below navbar: sidebar + content side by side */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
