export interface Profile {
  id: string;
  username: string;
  full_name: string;
  initials: string;
  role: "admin" | "member";
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "paused" | "completed" | "cancelled";
  team_size: number;
  fee_type: "fixed" | "hourly" | "retainer";
  fee_amount: number;
  currency: string;
  total_received: number;
  total_earning: number;
  platform: "upwork" | "direct" | "fiverr" | "toptal" | "other";
  last_edited_by: string;
  last_edited_at: string;
  created_by: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
  amount: number;
  notes: string;
  created_at: string;
}

export interface ProjectCost {
  id: string;
  project_id: string;
  label: string;
  amount: number;
  cost_date: string;
  cost_type: "platform_fee" | "ad_spend" | "tool" | "other";
  note: string;
  created_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  amount: number;
  payment_date: string;
  payment_type: "advance" | "milestone" | "partial" | "final";
  note: string;
  created_at: string;
}

export interface EditLog {
  id: string;
  project_id: string;
  edited_by: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  edited_at: string;
}

export interface MonthlyAnalytics {
  month: string;
  earnings: number;
  costs: number;
  profit: number;
  projects_added: number;
}
