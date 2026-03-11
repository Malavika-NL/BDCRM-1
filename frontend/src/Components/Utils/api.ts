// src/Utils/api.ts

import type {
  Lead,
  DashboardStats,
  Task,
  Course,
  ConsumptionAlert,
  Enrollment,
  AgentPayload
} from './types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {

  // ==========================================
  // 1. LEADS & PIPELINE
  // ==========================================

  getLeads: async (search: string = ''): Promise<Lead[]> => {
    const url = new URL(`${API_BASE_URL}/leads/`);
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
    const res = await fetch(`${API_BASE_URL}/leads/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete lead');
  },

  // ==========================================
  // 2. DASHBOARD
  // ==========================================

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE_URL}/leads/dashboard_stats/`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // ==========================================
  // 3. TASKS
  // ==========================================

  getTasks: async (is_completed?: boolean): Promise<Task[]> => {
    const url = new URL(`${API_BASE_URL}/tasks/`);
    if (is_completed !== undefined) {
      url.searchParams.append('is_completed', is_completed.toString());
    }
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
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  // ==========================================
  // 4. ACTIVITIES
  // ==========================================

  getActivities: async (leadId?: number | string): Promise<any[]> => {
    const url = leadId 
      ? `${API_BASE_URL}/activities/?lead=${leadId}`
      : `${API_BASE_URL}/activities/`;
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
  // 5. TAGS
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

  // ==========================================
  // 6. COMPANIES
  // ==========================================

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
  // 7. PLAYBOOKS / COURSES
  // ==========================================

  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE_URL}/courses/`);
    if (!res.ok) return [];
    return res.json();
  },

  getCourse: async (id: number | string): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  createCourse: async (data: any): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },

  // ==========================================
  // 8. AI COPILOT
  // ==========================================

  generateAIPrompt: async (
    leadId: number | string,
    customPrompt: string
  ): Promise<{ generated_text: string }> => {
    const res = await fetch(`${API_BASE_URL}/leads/${leadId}/generate_ai_prompt/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_prompt: customPrompt }),
    });
    if (!res.ok) throw new Error('Failed to generate AI prompt');
    return res.json();
  },

  // ==========================================
  // 9. SMART DASHBOARD & AGENT & AUTOMATION
  // ==========================================

  // Smart Dashboard (Consumption Logic - Refills)
  getSmartPrompts: async (): Promise<{ date: string; alerts: ConsumptionAlert[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/smart_prompts/`);
      if (!res.ok) return { date: new Date().toISOString(), alerts: [] };
      return res.json();
    } catch (e) {
      console.warn('Smart prompts endpoint failed', e);
      return { date: new Date().toISOString(), alerts: [] };
    }
  },

  // Agent Terminal (Triggering the Python Scraper logic)
  triggerAgentDump: async (leads: AgentPayload[]): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/agent/dump_leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leads),
    });
    if (!res.ok) throw new Error('Failed to trigger agent dump');
    return res.json();
  },

  // Workflow Automation (Reading the Signal outputs)
  getEnrollments: async (): Promise<Enrollment[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.warn('Enrollments endpoint not reachable yet, returning empty array.');
      return [];
    }
  },

  // ==========================================
  // 10. AI PROFILE INTELLIGENCE
  // ==========================================

  searchProfile: async (
    name: string,
    company: string = '',
    location: string = '',
    customInstructions: string = ''
  ): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/search-profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        company,
        location,
        custom_instructions: customInstructions,
      }),
    });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return res.json();
  },

  // ==========================================
  // 11. WHATSAPP CAMPAIGNS
  // ==========================================

  /**
   * Get all WhatsApp campaigns
   * GET /api/whatsapp-campaigns/
   */
  getWhatsAppCampaigns: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/`);
      if (!res.ok) {
        console.warn('Failed to fetch WhatsApp campaigns:', res.status);
        return [];
      }
      return res.json();
    } catch (e) {
      console.error('WhatsApp campaigns endpoint failed:', e);
      return [];
    }
  },

  /**
   * Get a single WhatsApp campaign with all its messages
   * GET /api/whatsapp-campaigns/{id}/
   */
  getWhatsAppCampaign: async (id: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch WhatsApp campaign');
    return res.json();
  },

  /**
   * Create a new WhatsApp campaign and prepare messages for selected leads
   * POST /api/whatsapp-campaigns/
   * Body: { name, message_template, lead_ids }
   */
  createWhatsAppCampaign: async (data: {
    name: string;
    message_template: string;
    lead_ids: number[];
  }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Failed to create campaign' }));
      throw new Error(error.detail || 'Failed to create campaign');
    }
    
    return res.json();
  },

  /**
   * Update a WhatsApp campaign
   * PATCH /api/whatsapp-campaigns/{id}/
   */
  updateWhatsAppCampaign: async (id: number, data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update campaign');
    return res.json();
  },

  /**
   * Delete a WhatsApp campaign
   * DELETE /api/whatsapp-campaigns/{id}/
   */
  deleteWhatsAppCampaign: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete campaign');
  },

  /**
   * Send all pending messages in a campaign
   * POST /api/whatsapp-campaigns/{id}/send/
   */
  sendWhatsAppCampaign: async (campaignId: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${campaignId}/send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to send campaign' }));
      throw new Error(error.error || 'Failed to send campaign');
    }
    
    return res.json();
  },

  /**
   * Get campaign delivery statistics
   * GET /api/whatsapp-campaigns/{id}/stats/
   */
  getWhatsAppCampaignStats: async (campaignId: number): Promise<{
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  }> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${campaignId}/stats/`);
    if (!res.ok) throw new Error('Failed to fetch campaign stats');
    return res.json();
  },

  /**
   * Get all messages for a campaign
   * GET /api/whatsapp-campaigns/{id}/messages/
   */
  getWhatsAppCampaignMessages: async (campaignId: number): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/${campaignId}/messages/`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.warn('Failed to fetch campaign messages:', e);
      return [];
    }
  },

  /**
   * Quick send a single WhatsApp message to one phone number
   * POST /api/whatsapp-campaigns/quick_send/
   * Body: { phone, message }
   */
  quickSendWhatsApp: async (phone: string, message: string): Promise<{
    success: boolean;
    message?: string;
    message_id?: string;
    error?: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/quick_send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to send message'
      };
    }
    
    return data;
  },

  /**
   * Send a WhatsApp template message (for approved templates only)
   * POST /api/whatsapp-campaigns/send_template/
   * Body: { phone, template_name, parameters, language_code }
   */
  sendWhatsAppTemplate: async (data: {
    phone: string;
    template_name: string;
    parameters?: string[];
    language_code?: string;
  }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-campaigns/send_template/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to send template' }));
      throw new Error(error.error || 'Failed to send template');
    }
    
    return res.json();
  },

  /**
   * Retry a failed WhatsApp message
   * POST /api/whatsapp-messages/{id}/retry/
   */
  retryWhatsAppMessage: async (messageId: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/whatsapp-messages/${messageId}/retry/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) throw new Error('Failed to retry message');
    return res.json();
  },

  // ==========================================
  // 12. CAMPAIGNS (General - Legacy)
  // ==========================================

  getCampaigns: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns/`);
      if (!res.ok) return [];
      return res.json();
    } catch (e) {
      console.warn('Campaigns endpoint failed:', e);
      return [];
    }
  },

  createCampaign: async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/campaigns/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    return res.json();
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Format phone number for WhatsApp (remove spaces, dashes, etc.)
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = formatPhoneNumber(phone);
  return /^\+?\d{10,15}$/.test(cleaned);
};

/**
 * Format message template with variables
 */
export const formatMessageTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  let formatted = template;
  Object.entries(variables).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return formatted;
};

// Default export
export default api;