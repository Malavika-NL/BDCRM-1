import React, { useState } from 'react';
import { Sidebar } from './Components/Sidebar/Sidebar';
import { Dashboard } from '../src/Components/Dashboard/Dashboard';
import { Pipeline } from './Components/Pipeline/Pipeline';
import { Contacts } from './Components/Contacts/Contacts';
import { TasksPage } from './Components/TaskPage/TaskPage';
import { CourseWorkflows } from './Components/CourseWorkFlow/CourseWorkFlow';
import { BDMDashboard } from './Components/Dashboard/BDMdashboard';
import { AutoAgent } from './Components/AutoAgent/AutoAgent';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pipeline':
        return <Pipeline />;
      case 'tasks':
        return <TasksPage />;
      case 'contacts':
        return <Contacts />;
      case 'playbooks':
        return <CourseWorkflows />;
      default:
        return <Dashboard />;
      case 'auto-agent':
        return <AutoAgent />;
      case 'bdm-core':
        return <BDMDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Left Sidebar Navigation */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-hidden relative flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;