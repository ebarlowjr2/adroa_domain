export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'premium'
  seat_limit: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  org_id: string
  user_id: string
  role: 'owner' | 'admin' | 'hr_manager' | 'employee'
  status: 'active' | 'inactive'
  created_at: string
}

export interface Employee {
  id: string
  org_id: string
  first_name: string
  last_name: string
  email: string
  department: string
  job_title: string
  manager_email: string
  status: 'active' | 'inactive'
  learnhouse_user_id: string | null
  created_at: string
  updated_at: string
}

export interface TrainingCatalog {
  id: string
  title: string
  description: string
  category: string
  required_default: boolean
  learnhouse_course_id: string | null
  estimated_minutes: number
  active: boolean
  created_at: string
}

export interface TrainingAssignment {
  id: string
  org_id: string
  employee_id: string
  training_id: string
  assigned_by: string
  due_date: string
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue'
  completed_at: string | null
  learnhouse_completion_id: string | null
  created_at: string
  updated_at: string
  // joined fields
  employee?: Employee
  training?: TrainingCatalog
}

export interface ReadinessEvent {
  id: string
  org_id: string
  employee_id: string
  event_type: string
  event_result: string
  source: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface DashboardStats {
  totalEmployees: number
  trainingCompleted: number
  trainingTotal: number
  overdueCount: number
  atRiskCount: number
  dueThisWeek: number
}
