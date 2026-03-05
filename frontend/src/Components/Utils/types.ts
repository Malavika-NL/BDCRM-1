export type LeadStatus = 'new' | 'contacted' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  value: string; 
  created_at: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost'
};

export const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'negotiation', 'won', 'lost'];

export interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'script' | 'video' | 'task';
  video_url?: string;
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