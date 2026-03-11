// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Layout ---
import MainLayout from './Components/Layout/MainLayout';
import { LoginPage } from './Components/Login/Login';

// --- Page Components ---
import { Dashboard } from './Components/Dashboard/Dashboard';
import { SmartDashboard } from './Components/Dashboard/SmartDashboard';
import { Pipeline } from './Components/Pipeline/Pipeline';
import { WorkflowMonitor } from './Components/Dashboard/WorkflowMonitor';
import { TasksPage } from './Components/TaskPage/TaskPage';
import { Contacts } from './Components/Contacts/Contacts';
import { CourseWorkflows } from './Components/CourseWorkFlow/CourseWorkFlow';
import { AutoAgent } from './Components/AutoAgent/AutoAgent';
import { AgentFeed } from './Components/Dashboard/AgentFeed';
import { BDMDashboard } from './Components/Dashboard/BDMdashboard';
import { WhatsAppCampaigns } from './Components/Whatsapp/Whatsapp';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============ 1. PUBLIC ROUTES ============ */}
        <Route path="/login" element={<LoginPage />} />

        {/* ============ 2. PROTECTED ROUTES ============ */}
        {/* <Route element={<RequireAuth />}> */}

          {/* --- Routes WITH Layout (Sidebar) --- */}
          <Route element={<MainLayout />}>

            {/* Root redirect */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Core Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Smart Refills / Consumption Logic */}
            <Route path="/smart-refills" element={<SmartDashboard />} />

            {/* Sales Pipeline */}
            <Route path="/pipeline" element={<Pipeline />} />

            {/* Workflow Automation */}
            <Route path="/workflows" element={<WorkflowMonitor />} />

            {/* Tasks */}
            <Route path="/tasks" element={<TasksPage />} />

            {/* Contacts */}
            <Route path="/contacts" element={<Contacts />} />

            {/* Playbooks / LMS */}
            <Route path="/playbooks" element={<CourseWorkflows />} />

            {/* Auto Agent */}
            <Route path="/auto-agent" element={<AutoAgent />} />

            {/* Agent Logs */}
            <Route path="/agent-logs" element={<AgentFeed />} />

            {/* BDM Strategy Dashboard */}
            <Route path="/bdm-core" element={<BDMDashboard />} />

            {/* WhatsApp Campaigns */}
            <Route path="/whatsapp" element={<WhatsAppCampaigns />} />

          </Route>

          {/* --- Fullscreen Routes (NO Sidebar) --- */}
          {/* Add any full-screen pages here if needed */}

        {/* </Route> */}

        {/* ============ 3. 404 ROUTE ============ */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;