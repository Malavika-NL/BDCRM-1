// --- ENUMS & CONSTANTS ---

export type LeadStatus = 'new' | 'contacted' | 'negotiation' | 'won' | 'lost';

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost'
};

export const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'negotiation', 'won', 'lost'];

export type ActivityType = 'call' | 'email' | 'meeting' | 'note';
export type TaskPriority = 'low' | 'medium' | 'high';

// --- CORE INTERFACES ---

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  region?: string;
}

export interface Activity {
  id: number;
  lead: number; // Lead ID
  activity_type: ActivityType;
  summary: string;
  description: string;
  created_at: string;
}

export interface Task {
  id: number;
  lead: number; // Lead ID
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  is_completed: boolean;
  created_at: string;
}

export interface Lead {
  phone: unknown;
  region: any;
  id: number;
  name: string;
  email: string;
  company: string; // Keeps compatibility with old UI, though backend has relations
  related_company?: number | null; // ID of the Company model
  status: LeadStatus;
  value: string; // Decimal string from Django
  source?: string;
  created_at: string;
  updated_at?: string;
  
  // Nested data from Serializers
  tags_details?: Tag[]; 
  activities?: Activity[];
  tasks?: Task[];
}

// --- ANALYTICS ---

export interface DashboardStats {
  total_value: number;
  total_leads: number;
  win_rate: number;
  status_distribution: { status: string; count: number }[];
  recent_activities: Activity[];
}

// --- LMS / COURSES ---

export interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'script' | 'video' | 'task';
  video_url?: string;
  order: number;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  target_vertical: string;
  target_region: string;
  modules: Module[];
  created_at: string;
}

export interface ConsumptionAlert {
  company: string;
  product: string;
  days_overdue: number;
  pic?: string;
  last_purchase?: string;
}

export interface Enrollment {
  id: number;
  lead_name: string;
  course_title: string;
  status: string;
  started_at: string;
}

export interface AgentPayload {
  name: string;
  email: string;
  company_name: string;
  region?: string;
  vertical?: string;
  source: string;
}