import React, { useState } from 'react';
import { Sidebar } from './Components/Layout/Layout';
import { Dashboard } from './Components/Dashboard/Dashboard';
import { Pipeline } from './Components/Pipeline/Pipeline';
import { Contacts } from './Components/Contacts/Contacts';
import { CourseWorkflows } from './Components/CourseWorkFlow/CourseWorkFlow';

function App() {
  const [activePage, setActivePage] = useState('pipeline');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pipeline': return <Pipeline />;
      case 'contacts': return <Contacts />;
      case 'playbooks': return <CourseWorkflows />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="ml-64 w-full">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;