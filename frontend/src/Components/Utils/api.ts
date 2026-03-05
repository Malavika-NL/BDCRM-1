import axios from 'axios';
import type{ Lead, Course } from '../Utils/types';

const API_URL = 'http://localhost:8000/api';

export const api = {
  // CRM LEADS
  getLeads: async () => {
    const response = await axios.get<Lead[]>(`${API_URL}/leads/`);
    return response.data;
  },
  createLead: async (lead: Omit<Lead, 'id' | 'created_at'>) => {
    const response = await axios.post<Lead>(`${API_URL}/leads/`, lead);
    return response.data;
  },
  updateLeadStatus: async (id: number, status: string) => {
    const response = await axios.patch<Lead>(`${API_URL}/leads/${id}/`, { status });
    return response.data;
  },
  deleteLead: async (id: number) => {
    await axios.delete(`${API_URL}/leads/${id}/`);
  },

  // AI FEATURE
  generateAIPrompt: async (id: number, customPrompt: string = "") => {
    const response = await axios.post(`${API_URL}/leads/${id}/generate_ai_prompt/`, {
      custom_prompt: customPrompt
    });
    return response.data;
  },

  // COURSES / PLAYBOOKS
  getCourses: async () => {
    const response = await axios.get<Course[]>(`${API_URL}/courses/`);
    return response.data;
  }
};