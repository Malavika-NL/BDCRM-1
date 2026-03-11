// src/Components/Layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 h-screen overflow-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;