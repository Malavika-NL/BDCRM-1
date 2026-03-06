import axios from 'axios';
import type { 
  Lead, 
  Course, 
  DashboardStats, 
  Task, 
  Activity, 
  Tag, 
  Company 
} from './types';

const API_URL = 'http://localhost:8000/api';

export const api = {
  // --- LEADS ---
  getLeads: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await axios.get<Lead[]>(`${API_URL}/leads/`, { params });
    return response.data;
  },
  
  getLead: async (id: number) => {
    const response = await axios.get<Lead>(`${API_URL}/leads/${id}/`);
    return response.data;
  },

  createLead: async (lead: Partial<Lead>) => {
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

  // --- DASHBOARD ANALYTICS ---
  getDashboardStats: async () => {
    const response = await axios.get<DashboardStats>(`${API_URL}/leads/dashboard_stats/`);
    return response.data;
  },

  // --- TASKS ---
  getTasks: async (is_completed?: boolean) => {
    const params = is_completed !== undefined ? { is_completed } : {};
    const response = await axios.get<Task[]>(`${API_URL}/tasks/`, { params });
    return response.data;
  },

  createTask: async (task: Partial<Task>) => {
    const response = await axios.post<Task>(`${API_URL}/tasks/`, task);
    return response.data;
  },

  toggleTask: async (id: number, is_completed: boolean) => {
    const response = await axios.patch<Task>(`${API_URL}/tasks/${id}/`, { is_completed });
    return response.data;
  },

  // --- ACTIVITIES ---
  createActivity: async (activity: Partial<Activity>) => {
    const response = await axios.post<Activity>(`${API_URL}/activities/`, activity);
    return response.data;
  },

  // --- AI GENERATION ---
  generateAIPrompt: async (id: number, customPrompt: string = "") => {
    const response = await axios.post(`${API_URL}/leads/${id}/generate_ai_prompt/`, {
      custom_prompt: customPrompt
    });
    return response.data;
  },

  // --- LMS / COURSES ---
  getCourses: async () => {
    const response = await axios.get<Course[]>(`${API_URL}/courses/`);
    return response.data;
  },

  // --- AUXILIARY (Tags & Companies) ---
  getTags: async () => {
    const response = await axios.get<Tag[]>(`${API_URL}/tags/`);
    return response.data;
  },

  getCompanies: async () => {
    const response = await axios.get<Company[]>(`${API_URL}/companies/`);
    return response.data;
  }
};