-- AdroaDomain Organization Training Tracker MVP
-- Supabase Schema

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'premium')),
  seat_limit integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organization members (links Supabase auth users to orgs)
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('owner', 'admin', 'hr_manager', 'employee')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  department text DEFAULT '',
  job_title text DEFAULT '',
  manager_email text DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  learnhouse_user_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Training catalog (seeded with default courses)
CREATE TABLE IF NOT EXISTS training_catalog (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'awareness',
  required_default boolean DEFAULT false,
  learnhouse_course_id text,
  estimated_minutes integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Training assignments (links employees to training)
CREATE TABLE IF NOT EXISTS training_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  training_id uuid NOT NULL REFERENCES training_catalog(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue')),
  completed_at timestamptz,
  learnhouse_completion_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Readiness events (for premium tier)
CREATE TABLE IF NOT EXISTS readiness_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_result text NOT NULL,
  source text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Organization mandatory training (company-wide required courses)
CREATE TABLE IF NOT EXISTS org_mandatory_training (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  training_id uuid NOT NULL REFERENCES training_catalog(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, training_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(org_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(org_id);
CREATE INDEX IF NOT EXISTS idx_assignments_org ON training_assignments(org_id);
CREATE INDEX IF NOT EXISTS idx_assignments_employee ON training_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_readiness_org ON readiness_events(org_id);

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_mandatory_training ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations: members can read their own org
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Organizations: authenticated users can create orgs (for signup)
CREATE POLICY "Authenticated users can create organizations" ON organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Organizations: owners can update their org
CREATE POLICY "Owners can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Organization members: users can view memberships in orgs they belong to
-- Uses a security definer function to avoid infinite recursion
CREATE OR REPLACE FUNCTION get_user_org_ids(uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT org_id FROM organization_members WHERE user_id = uid;
$$;

CREATE POLICY "Members can view org members" ON organization_members
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Organization members: authenticated users can create memberships (for signup)
CREATE POLICY "Authenticated users can create memberships" ON organization_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Employees: org members can CRUD employees in their org
CREATE POLICY "Org members can view employees" ON employees
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can insert employees" ON employees
  FOR INSERT WITH CHECK (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can update employees" ON employees
  FOR UPDATE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Training catalog: anyone can read (public catalog)
CREATE POLICY "Anyone can view training catalog" ON training_catalog
  FOR SELECT USING (true);

-- Training catalog: org admins can add courses
CREATE POLICY "Org admins can insert training catalog" ON training_catalog
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Training assignments: org members can view their org's assignments
CREATE POLICY "Org members can view assignments" ON training_assignments
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can create assignments" ON training_assignments
  FOR INSERT WITH CHECK (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can update assignments" ON training_assignments
  FOR UPDATE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Readiness events: org members can view
CREATE POLICY "Org members can view readiness events" ON readiness_events
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Employees: org admins can delete employees
CREATE POLICY "Org admins can delete employees" ON employees
  FOR DELETE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Training assignments: org admins can delete assignments
CREATE POLICY "Org admins can delete assignments" ON training_assignments
  FOR DELETE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Mandatory training: org members can view
CREATE POLICY "Org members can view mandatory training" ON org_mandatory_training
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Mandatory training: org admins can manage
CREATE POLICY "Org admins can insert mandatory training" ON org_mandatory_training
  FOR INSERT WITH CHECK (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can delete mandatory training" ON org_mandatory_training
  FOR DELETE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

-- Seed training catalog
INSERT INTO training_catalog (title, description, category, required_default, learnhouse_course_id, estimated_minutes) VALUES
  ('Modern Cyber Awareness & Digital Safety', 'Comprehensive modern-awareness course covering AI threats, social engineering, digital safety, and operational security judgment.', 'awareness', true, 'course_bc254865-9e05-41c5-ae1a-0bf423b855f1', 120),
  ('Cybersecurity Level 1 Foundations', 'Foundational course covering why cybersecurity matters, assets to protect, common mistakes, and shared responsibility.', 'awareness', true, 'course_068b6443-5d6e-45f5-be3e-0174b808ea9c', 60),
  ('Linux Basics for Security Awareness', 'Introduction to Linux command line, file permissions, user management, and basic security operations.', 'technical', false, 'course_44378351-3b04-438d-88ee-015b119e89b7', 45),
  ('Phishing Awareness Essentials', 'Learn to identify and respond to phishing attacks across email, SMS, voice, and social media.', 'awareness', true, NULL, 30),
  ('Protecting PII & Sensitive Data', 'Understanding data classification, handling requirements, and breach prevention for personal and business data.', 'compliance', true, NULL, 30),
  ('Password & MFA Best Practices', 'Modern password management, multi-factor authentication setup, and credential hygiene.', 'awareness', false, NULL, 20),
  ('Safe Use of AI Tools at Work', 'Guidelines for using AI assistants, chatbots, and generative AI tools without exposing sensitive information.', 'awareness', false, NULL, 25),
  ('Social Media & Location Safety', 'Protecting yourself and your organization from social media reconnaissance and location-based risks.', 'awareness', false, NULL, 20),
  ('Incident Reporting Basics', 'How to recognize, document, and report security incidents through proper channels.', 'compliance', true, NULL, 15)
ON CONFLICT DO NOTHING;
