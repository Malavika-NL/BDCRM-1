// ══════════════════════════════════════════════════════
// Utils/types.ts — FULL PRODUCTION FILE
// ══════════════════════════════════════════════════════

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

// --- BDM SPECIFIC TYPES (New) ---

export interface Vertical {
  id: number;
  name: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface ProductLine {
  id: number;
  name: string;
  description?: string;
}

export interface LeadBusinessMeta {
  id: number;
  lead: number;
  lifecycle_type: 'target' | 'current' | 'repeat' | 'dormant';
  last_purchase_date?: string;
  last_purchase_value?: string;
  purchase_frequency_days?: number;
  product_lines: number[]; // Array of Product IDs
}

// --- CORE CRM INTERFACES ---

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
  lead: number;
  activity_type: ActivityType;
  summary: string;
  description: string;
  created_at: string;
}

export interface Task {
  id: number;
  lead: number;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  is_completed: boolean;
  created_at: string;
}

export interface Lead {
  region: any;
  id: number;
  name: string;
  email: string;
  // Fixed: Explicitly allow null so React doesn't crash on render
  phone: string | null; 
  company: string;
  related_company?: number | null;
  status: LeadStatus;
  value: string; // Decimal string from Django
  source?: string;
  created_at: string;
  updated_at?: string;
  
  // Relations (Fixed: Explicitly added these to the type definition)
  vertical?: Vertical | null;
  region_rel?: Region | null;
  
  // Nested data from Serializers
  tags_details?: Tag[]; 
  activities?: Activity[];
  tasks?: Task[];
}

export interface Contact {
  id: number;
  name: string;
  person_name?: string | null;
  company_name?: string;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at?: string;
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

// --- SMART DASHBOARD ---

export interface ConsumptionAlert {
  company: string;
  product: string;
  days_overdue: number;
  pic?: string;
  last_purchase?: string;
}

// --- AUTOMATION ---

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

// --- AI FEATURES ---

export interface AIInteractionLog {
  id: number;
  lead_name: string;
  campaign_name: string;
  interaction_type: string;
  transcript: string;
  ai_summary: string;
  sentiment: string;
  created_at: string;
}

export interface AIAlert {
  id: number;
  alert_type: string;
  lead: number | null;
  lead_name: string;
  lead_company: string;
  title: string;
  description: string;
  priority: string;
  is_read: boolean;
  is_actioned: boolean;
  suggested_action: string;
  data: any;
  created_at: string;
}

export interface AIDocument {
  id: number;
  lead: number | null;
  lead_name: string;
  doc_type: string;
  title: string;
  content: any;
  created_at: string;
}

export interface AILeadProfile {
  id: number;
  lead: number;
  lead_name: string;
  lead_company: string;
  lead_status: string;
  lead_value: string;
  score: number;
  conversion_probability: number;
  priority_rank: number;
  churn_risk: number;
  deal_risk_level: string;
  sentiment_trend: string;
  recommended_action: string;
  competitor_mentions: string[];
  suggested_tags: string[];
  scored_at: string;
}

export interface ChatResponse {
  response: string;
  action_type: string;
  data_highlights?: string[];
  suggested_actions?: { action: string; priority: string }[];
  follow_up_questions?: string[];
}

export interface AIScoreSnapshot {
  id: number;
  lead: number;
  score: number;
  conversion_probability: number;
  churn_risk: number;
  factors: any;
  created_at: string;
}

export interface PlannerTask {
  id: number;
  member_plan: number;
  period_type: 'weekly' | 'daily';
  week_number: number;
  task_date: string | null;
  channel: 'calls' | 'whatsapp' | 'email' | 'linkedin';
  target_count: number;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  created_by_admin: boolean;
}

export interface PlannerMemberPlan {
  id: number;
  planner: number;
  user: number | null;
  member_name: string;
  workspace_name: string;
  monthly_calls_target: number;
  monthly_whatsapp_target: number;
  monthly_email_target: number;
  monthly_linkedin_target: number;
  calls_weightage: number;
  whatsapp_weightage: number;
  email_weightage: number;
  linkedin_weightage: number;
  tasks: PlannerTask[];
}

export interface ActivityPlanner {
  id: number;
  name: string;
  month: number;
  year: number;
  status: 'draft' | 'active' | 'completed';
  notes: string;
  member_plans: PlannerMemberPlan[];
}
