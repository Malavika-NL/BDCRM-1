import type {
  Contact,
  ContactInput,
  Lead,
  DashboardStats,
  Task,
  Course,
  ConsumptionAlert,
  AgentPayload,
  ActivityPlanner,
  PlannerMemberPlan,
  PlannerTask,
  WishlistEntry,
  WishlistEntryInput,
} from './types';

// Change this if you deploy to AWS/Heroku
const API_BASE_URL = '/api';

export const api = {
  getContacts: async (search: string = '', project: string = 'all'): Promise<Contact[]> => {
    const url = new URL(`${API_BASE_URL}/contacts/`, window.location.origin);
    if (search) url.searchParams.append('search', search);
    if (project !== 'all') url.searchParams.append('project', project);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
  },

  createContact: async (data: ContactInput): Promise<Contact> => {
    const res = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.non_field_errors?.[0] || 'Failed to create contact');
    }
    return res.json();
  },

  updateContact: async (id: number | string, data: ContactInput): Promise<Contact> => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.non_field_errors?.[0] || 'Failed to update contact');
    }
    return res.json();
  },

  deleteContact: async (id: number | string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact');
  },

  // ==========================================
  // 1. LEADS & PIPELINE (CORE CRM)
  // ==========================================

  getLeads: async (search: string = ''): Promise<Lead[]> => {
    const url = new URL(`${API_BASE_URL}/leads/`, window.location.origin);
    if (search) url.searchParams.append('search', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  getLead: async (id: number | string): Promise<Lead> => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch lead');
    return res.json();
  },

  createLead: async (data: any): Promise<Lead> => {
    const res = await fetch(`${API_BASE_URL}/leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    return res.json();
  },

  updateLead: async (id: number | string, data: any): Promise<Lead> => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
  },

  updateLeadStatus: async (id: number | string, status: string): Promise<Lead> => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update lead status');
    return res.json();
  },

  deleteLead: async (id: number | string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete lead');
  },

  // ==========================================
  // 2. DASHBOARD & TASKS & ACTIVITIES
  // ==========================================

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE_URL}/leads/dashboard_stats/`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  getTasks: async (is_completed?: boolean): Promise<Task[]> => {
    const url = new URL(`${API_BASE_URL}/tasks/`, window.location.origin);
    if (is_completed !== undefined) url.searchParams.append('is_completed', is_completed.toString());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  createTask: async (data: any): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  updateTask: async (id: number | string, data: any): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  toggleTask: async (id: number | string, is_completed: boolean): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed }),
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  deleteTask: async (id: number | string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  getActivities: async (leadId?: number | string): Promise<any[]> => {
    const url = leadId ? `${API_BASE_URL}/activities/?lead=${leadId}` : `${API_BASE_URL}/activities/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  createActivity: async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/activities/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create activity');
    return res.json();
  },

  // ==========================================
  // 3. TAGS & COMPANIES (AUXILIARY)
  // ==========================================

  getTags: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/tags/`);
    if (!res.ok) return [];
    return res.json();
  },

  createTag: async (data: { name: string; color?: string }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/tags/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create tag');
    return res.json();
  },

  getCompanies: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/companies/`);
    if (!res.ok) return [];
    return res.json();
  },

  createCompany: async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/companies/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create company');
    return res.json();
  },

  // ==========================================
  // 4. BDM SEGMENTATION (DYNAMIC DROPDOWNS)
  // ==========================================

  getVerticals: async (): Promise<any[]> => {
    // Fetches list of industries (Auto, Pharma, etc.)
    const res = await fetch(`${API_BASE_URL}/verticals/`); 
    if (!res.ok) return []; 
    return res.json();
  },

  getRegions: async (): Promise<any[]> => {
    // Fetches list of regions (North, West, etc.)
    const res = await fetch(`${API_BASE_URL}/regions/`); 
    if (!res.ok) return []; 
    return res.json();
  },

  getProductLines: async (): Promise<any[]> => {
    // Fetches list of products (Printer, Label, Ribbon)
    const res = await fetch(`${API_BASE_URL}/product-lines/`); 
    if (!res.ok) return []; 
    return res.json();
  },

  getLeadBusinessMeta: async (leadId: number | string): Promise<any> => {
    // Fetches cross-sell data (Which products they own vs need)
    const res = await fetch(`${API_BASE_URL}/lead-business-meta/?lead=${leadId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.length > 0 ? data[0] : null; 
  },

  // ==========================================
  // 5. AI COPILOT (SCORING & INTELLIGENCE)
  // ==========================================

  getAILogs: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai-logs/`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.error('Failed to fetch AI logs:', e);
      return [];
    }
  },

  getAIScore: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/ai_score/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch AI score');
    return res.json();
  },

  getAISummary: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/ai_summary/`);
    if (!res.ok) throw new Error('Failed to fetch AI summary');
    return res.json();
  },

  getAINextAction: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/ai_next_action/`);
    if (!res.ok) throw new Error('Failed to fetch AI next action');
    return res.json();
  },

  aiWriteMessage: async (leadId: number | string, data: { type: string; tone: string; purpose: string }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/ai_write/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to generate AI message');
    return res.json();
  },

  generateAIBulkMessages: async (leadIds: number[], baseMessage: string, channel: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/ai_bulk_message/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_ids: leadIds, base_message: baseMessage, channel })
    });
    if (!res.ok) throw new Error('Failed to generate AI bulk messages');
    return res.json();
  },

  generateAIPlaybook: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/generate_ai_playbook/`);
    if (!res.ok) throw new Error('Failed to generate AI Playbook');
    return res.json();
  },

  // ==========================================
  // 6. WHATSAPP CAMPAIGNS
  // ==========================================

  getWhatsAppCampaigns: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.error('WhatsApp campaigns endpoint failed:', e);
      return [];
    }
  },

  createWhatsAppCampaign: async (data: { name: string; message_template: string; lead_ids: number[] }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    return res.json();
  },

  sendWhatsAppCampaign: async (campaignId: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${campaignId}/send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to send campaign');
    return res.json();
  },

  quickSendWhatsApp: async (phone: string, message: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/quick_send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Failed to send message' };
    return data;
  },

  // ==========================================
  // 7. MISC (Courses, Smart Dashboard)
  // ==========================================

  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE_URL}/courses/`);
    if (!res.ok) return [];
    return res.json();
  },

  getSmartPrompts: async (): Promise<{ date: string; alerts: ConsumptionAlert[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/smart_prompts/`);
      if (!res.ok) return { date: new Date().toISOString(), alerts: [] };
      return res.json();
    } catch (e) {
      return { date: new Date().toISOString(), alerts: [] };
    }
  },

  triggerAgentDump: async (leads: AgentPayload[]): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/agent/dump_leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leads),
    });
    if (!res.ok) throw new Error('Failed to trigger agent dump');
    return res.json();
  },

  // ==========================================
  // 8. AI ANALYTICS & ALERTS (Advanced)
  // ==========================================

  // --- AI SCORING ---
  aiScoreLead: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/score/${leadId}/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiScoreBulk: async (leadIds?: number[]): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/score_bulk/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_ids: leadIds || [] })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiGetProfile: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/profile/${leadId}/`);
    if (!res.ok) return null;
    return res.json();
  },

  aiGetScoreHistory: async (leadId: number | string): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/ai/score_history/${leadId}/`);
    if (!res.ok) return [];
    return res.json();
  },

  aiGetLeaderboard: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/ai/leaderboard/`);
    if (!res.ok) return [];
    return res.json();
  },

  // --- AI CHURN ---
  aiChurnRisk: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/churn/${leadId}/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiChurnReport: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/churn_report/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // --- AI INTELLIGENCE ---
  aiConversationIntelligence: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/intelligence/${leadId}/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiSentimentTimeline: async (leadId: number | string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/sentiment/${leadId}/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // --- AI ACTIVITY ANALYSIS ---
  aiAnalyzeActivity: async (activityId: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-activity/analyze/${activityId}/`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiGetActivityAnalyses: async (leadId: number | string): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/ai-activity/for_lead/${leadId}/`);
    if (!res.ok) return [];
    return res.json();
  },

  // --- AI DOCUMENTS ---
  aiGenerateProposal: async (leadId: number | string, instructions?: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-docs/proposal/${leadId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructions: instructions || '' })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiGenerateBattleCard: async (leadId: number | string, competitors?: string[]): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-docs/battle_card/${leadId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitors: competitors || [] })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiGenerateEmailSequence: async (leadId: number | string, num: number = 5, goal: string = 'nurture'): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-docs/email_sequence/${leadId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num_emails: num, goal })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiGetLeadDocuments: async (leadId: number | string): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/ai-docs/for_lead/${leadId}/`);
    if (!res.ok) return [];
    return res.json();
  },

  aiGetAllDocuments: async (type?: string): Promise<any[]> => {
    let url = `${API_BASE_URL}/ai-docs/all_docs/`;
    if (type) url += `?type=${type}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  // --- AI SEARCH ---
  aiSearch: async (query: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai/search/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  // --- AI CHATBOT ---
  aiChat: async (message: string, sessionId: string = 'default'): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-chat/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiChatHistory: async (sessionId: string = 'default'): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-chat/history/?session_id=${sessionId}`);
    if (!res.ok) return { messages: [] };
    return res.json();
  },

  aiChatClear: async (sessionId: string = 'default'): Promise<void> => {
    await fetch(`${API_BASE_URL}/ai-chat/clear/?session_id=${sessionId}`, { method: 'DELETE' });
  },

  // --- AI ALERTS ---
  aiGetAlerts: async (isRead?: boolean): Promise<any[]> => {
    let url = `${API_BASE_URL}/ai-alerts/`;
    if (isRead !== undefined) url += `?is_read=${isRead}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  aiMarkAlertRead: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/ai-alerts/${id}/mark_read/`, { method: 'POST' });
  },

  aiMarkAllRead: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/ai-alerts/mark_all_read/`, { method: 'POST' });
  },

  aiUnreadCount: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-alerts/unread_count/`);
    if (!res.ok) return { unread: 0 };
    return res.json();
  },

  // --- AI ANALYTICS ---
  aiRevenueForecast: async (months: number = 3): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-analytics/revenue_forecast/?months=${months}`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiAnomalies: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-analytics/anomalies/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiDailyDigest: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-analytics/daily_digest/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  aiPipelineIntelligence: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/ai-analytics/pipeline_intelligence/`);
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  getActivityPlanners: async (): Promise<ActivityPlanner[]> => {
    const res = await fetch(`${API_BASE_URL}/activity-planners/`);
    if (!res.ok) return [];
    return res.json();
  },

  createActivityPlanner: async (data: Partial<ActivityPlanner>): Promise<ActivityPlanner> => {
    const res = await fetch(`${API_BASE_URL}/activity-planners/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create planner');
    return res.json();
  },

  updateActivityPlanner: async (plannerId: number, data: Partial<ActivityPlanner>): Promise<ActivityPlanner> => {
    const res = await fetch(`${API_BASE_URL}/activity-planners/${plannerId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update planner');
    return res.json();
  },

  assignPlannerMembers: async (plannerId: number, members: any[]): Promise<PlannerMemberPlan[]> => {
    const res = await fetch(`${API_BASE_URL}/activity-planners/${plannerId}/assign_members/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members }),
    });
    if (!res.ok) throw new Error('Failed to assign planner members');
    return res.json();
  },

  updatePlannerMember: async (memberPlanId: number, data: Partial<PlannerMemberPlan>): Promise<PlannerMemberPlan> => {
    const res = await fetch(`${API_BASE_URL}/planner-member-plans/${memberPlanId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update member plan');
    return res.json();
  },

  updatePlannerTask: async (taskId: number, data: Partial<PlannerTask>): Promise<PlannerTask> => {
    const res = await fetch(`${API_BASE_URL}/planner-tasks/${taskId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  getWishlistEntries: async (): Promise<WishlistEntry[]> => {
    const res = await fetch(`${API_BASE_URL}/wishlist/`);
    if (!res.ok) return [];
    return res.json();
  },

  createWishlistEntry: async (data: WishlistEntryInput): Promise<WishlistEntry> => {
    const res = await fetch(`${API_BASE_URL}/wishlist/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create wishlist entry');
    return res.json();
  },

};

export default api;
