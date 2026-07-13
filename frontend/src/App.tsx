// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type React from 'react';
import { authStore } from './Components/Utils/auth';

// --- Layout ---
import MainLayout from './Components/Layout/MainLayout';
import { LoginPage } from './Components/Login/Login';
import { UserCreationPage } from './Components/Login/UserCreationPage';

// --- Page Components ---
import { Dashboard } from './Components/Dashboard/Dashboard';
import { SmartDashboard } from './Components/Dashboard/SmartDashboard';
import { Pipeline } from './Components/Pipeline/Pipeline';
import AddDealPage from './Components/Pipeline/AddDealPage';
import { WorkflowMonitor } from './Components/Dashboard/WorkflowMonitor';
import { TasksPage } from './Components/TaskPage/TaskPage';
import { Contacts } from './Components/Contacts/Contacts';
import { CourseWorkflows } from './Components/CourseWorkFlow/CourseWorkFlow';
import { AutoAgent } from './Components/AutoAgent/AutoAgent';
import { AgentFeed } from './Components/Dashboard/AgentFeed';
import { BDMDashboard } from './Components/Dashboard/BDMdashboard';
import { WhatsAppCampaigns } from './Components/Whatsapp/Whatsapp';
import { AIAnalytics } from './Components/AI/AIAnalytics';
import { AICommandCenter } from './Components/AI/AICommandcenter';
import { AIProspector } from './Components/AI/AIProspector';
import CampaignWorkspaceCreate from './Components/Target/CampaignWorkspaceCreate';
import CampaignWorkspaceList from './Components/Target/CampaignWorkspaceList';
import BDMTargetCreate from './Components/Target/BDMTargetCreate';
import BDMTargetsList from './Components/Target/BDMTargetList';
import { ActivityPlannerPage } from './Components/Planner/ActivityPlannerPage';
import { ActivityPlannerAssignmentsPage } from './Components/Planner/ActivityPlannerAssignmentsPage';
import { NotificationsPage } from './Components/Notifications/NotificationsPage';
import { ChangePasswordPage } from './Components/Settings/ChangePasswordPage';
import { AccountTargetingPage } from './Components/AccountTargeting/AccountTargetingPage';
import { AccountTargetingOwnersPage } from './Components/AccountTargeting/AccountTargetingOwnersPage';
import { WishlistPage } from './Components/Wishlist/WishlistPage';

function App() {
  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    if (!authStore.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ============ 1. PUBLIC ROUTES ============ */}
        <Route path="/login" element={<LoginPage />} />

        {/* ============ 2. PROTECTED ROUTES ============ */}
        {/* <Route element={<RequireAuth />}> */}

          {/* --- Routes WITH Layout (Sidebar) --- */}
          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>

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
            <Route path="/pipeline/new" element={<AddDealPage />} />

            {/* Workflow Automation */}
            <Route path="/workflows" element={<WorkflowMonitor />} />

            {/* Tasks */}
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/activity-planner" element={<ActivityPlannerPage />} />
            <Route path="/activity-planner/assignments/:plannerId" element={<ActivityPlannerAssignmentsPage />} />
            <Route path="/activity-planner/assignments" element={<ActivityPlannerAssignmentsPage />} />

            {/* Contacts */}
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Playbooks / LMS */}
            <Route path="/playbooks" element={<CourseWorkflows />} />

            {/* Auto Agent */}
            <Route path="/auto-agent" element={<AutoAgent />} />

            {/* Agent Logs */}
            <Route path="/agent-logs" element={<AgentFeed />} />
            {/* BDM Strategy Dashboard */}
            <Route path="/bdm-core" element={<BDMDashboard />} />
            <Route path="/prospector" element={<AIProspector />} />
            <Route path="/ai-command" element={<AICommandCenter />} />
            <Route path="/ai-analytics" element={<AIAnalytics />} />
            {/* <Route path="/bdm-targets" element={<BDMTargets />} /> */}
            {/* <Route path="/campaign-workspace" element={<CampaignWorkspacePage />} /> */}
            <Route path="/campaign-workspace" element={<CampaignWorkspaceList />} />
            <Route path="/campaign-workspace/new" element={<CampaignWorkspaceCreate />} />
            <Route path="/bdm-targets" element={<BDMTargetsList />} />
            <Route path="/bdm-targets/new" element={<BDMTargetCreate />} />
            <Route path="/create-user" element={<UserCreationPage />} />
            <Route path="/account-targetting" element={<AccountTargetingPage />} />
            <Route path="/account-targetting/owners" element={<AccountTargetingOwnersPage />} />
            <Route path="/settings/change-password" element={<ChangePasswordPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />



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
