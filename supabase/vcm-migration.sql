-- VCM Phase 1: Virtual Certification Manager
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. TABLES
-- ============================================

-- User profiles for VCM (individual users, not org-linked)
CREATE TABLE IF NOT EXISTS vcm_user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  profession text DEFAULT '',
  industry text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certification catalog (reference table — readable by all authenticated users)
CREATE TABLE IF NOT EXISTS certification_catalog (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  vendor text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  default_renewal_cycle_months integer,
  default_required_units integer,
  unit_type text DEFAULT 'CEU',
  description text DEFAULT '',
  vendor_url text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User certifications (individual user's tracked certifications)
CREATE TABLE IF NOT EXISTS user_certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES certification_catalog(id) ON DELETE SET NULL,
  custom_cert_name text DEFAULT '',
  vendor text DEFAULT '',
  issue_date date,
  expiration_date date,
  renewal_cycle_months integer,
  required_units integer,
  unit_type text DEFAULT 'CEU',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending')),
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Training activities (completed CEUs/CPEs/training)
CREATE TABLE IF NOT EXISTS training_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES user_certifications(id) ON DELETE SET NULL,
  title text NOT NULL,
  provider text DEFAULT '',
  activity_type text DEFAULT 'course',
  completion_date date NOT NULL,
  units_earned numeric(6,2) NOT NULL DEFAULT 0,
  unit_type text DEFAULT 'CEU',
  evidence_url text DEFAULT '',
  certificate_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Training opportunities (upcoming events/courses — reference table)
CREATE TABLE IF NOT EXISTS training_opportunities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  provider text NOT NULL DEFAULT '',
  category text DEFAULT 'general',
  unit_type text DEFAULT 'CEU',
  estimated_units numeric(6,2),
  event_date date,
  registration_url text DEFAULT '',
  cost text DEFAULT 'Free',
  delivery_method text DEFAULT 'virtual' CHECK (delivery_method IN ('virtual', 'in-person', 'hybrid', 'self-paced')),
  source text DEFAULT 'manual',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_vcm_profiles_user ON vcm_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certs_user ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certs_status ON user_certifications(status);
CREATE INDEX IF NOT EXISTS idx_training_activities_user ON training_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_training_activities_cert ON training_activities(certification_id);
CREATE INDEX IF NOT EXISTS idx_training_opportunities_active ON training_opportunities(active);

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE vcm_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_opportunities ENABLE ROW LEVEL SECURITY;

-- vcm_user_profiles: users can only access their own profile
CREATE POLICY "Users can view own profile" ON vcm_user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON vcm_user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON vcm_user_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- certification_catalog: readable by all authenticated users
CREATE POLICY "Authenticated users can view certification catalog" ON certification_catalog
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- user_certifications: users can only access their own
CREATE POLICY "Users can view own certifications" ON user_certifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own certifications" ON user_certifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own certifications" ON user_certifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own certifications" ON user_certifications
  FOR DELETE USING (user_id = auth.uid());

-- training_activities: users can only access their own
CREATE POLICY "Users can view own training activities" ON training_activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own training activities" ON training_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own training activities" ON training_activities
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own training activities" ON training_activities
  FOR DELETE USING (user_id = auth.uid());

-- training_opportunities: readable by all authenticated users
CREATE POLICY "Authenticated users can view training opportunities" ON training_opportunities
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================
-- 4. SEED DATA — Certification Catalog
-- ============================================

INSERT INTO certification_catalog (name, vendor, category, default_renewal_cycle_months, default_required_units, unit_type, description, vendor_url) VALUES
  -- Cybersecurity
  ('CompTIA Security+', 'CompTIA', 'Cybersecurity', 36, 50, 'CEU', 'Foundational cybersecurity certification validating baseline security skills.', 'https://www.comptia.org/certifications/security'),
  ('CompTIA Network+', 'CompTIA', 'Networking', 36, 30, 'CEU', 'Validates essential networking skills and knowledge.', 'https://www.comptia.org/certifications/network'),
  ('CompTIA CySA+', 'CompTIA', 'Cybersecurity', 36, 60, 'CEU', 'Cybersecurity analyst certification for threat detection and response.', 'https://www.comptia.org/certifications/cybersecurity-analyst'),
  ('CompTIA CASP+', 'CompTIA', 'Cybersecurity', 36, 75, 'CEU', 'Advanced security practitioner certification for enterprise security.', 'https://www.comptia.org/certifications/comptia-advanced-security-practitioner'),
  ('ISC2 CISSP', 'ISC2', 'Cybersecurity', 36, 120, 'CPE', 'Gold-standard certification for information security professionals.', 'https://www.isc2.org/certifications/cissp'),
  ('ISC2 CC', 'ISC2', 'Cybersecurity', 36, 45, 'CPE', 'Entry-level cybersecurity certification from ISC2.', 'https://www.isc2.org/certifications/cc'),
  ('ISACA CISM', 'ISACA', 'Cybersecurity', 36, 120, 'CPE', 'Certified Information Security Manager for management-focused security.', 'https://www.isaca.org/credentialing/cism'),
  ('ISACA CISA', 'ISACA', 'Cybersecurity', 36, 120, 'CPE', 'Certified Information Systems Auditor for audit and assurance.', 'https://www.isaca.org/credentialing/cisa'),
  ('GIAC GSEC', 'GIAC', 'Cybersecurity', 48, 36, 'CPE', 'GIAC Security Essentials for IT professionals with security responsibilities.', 'https://www.giac.org/certifications/security-essentials-gsec/'),
  ('GIAC GCIH', 'GIAC', 'Cybersecurity', 48, 36, 'CPE', 'GIAC Certified Incident Handler for incident response professionals.', 'https://www.giac.org/certifications/certified-incident-handler-gcih/'),

  -- Cloud/IT
  ('AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Cloud', 36, NULL, 'CEU', 'Foundational AWS cloud certification.', 'https://aws.amazon.com/certification/certified-cloud-practitioner/'),
  ('AWS Solutions Architect Associate', 'Amazon Web Services', 'Cloud', 36, NULL, 'CEU', 'Associate-level certification for designing distributed systems on AWS.', 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'),
  ('Microsoft Azure Fundamentals', 'Microsoft', 'Cloud', NULL, NULL, 'CEU', 'Entry-level Azure cloud concepts certification. No expiration.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/'),
  ('Microsoft Azure Administrator', 'Microsoft', 'Cloud', 12, NULL, 'CEU', 'Azure administration certification for managing cloud services.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/'),
  ('Google Cloud Digital Leader', 'Google Cloud', 'Cloud', 36, NULL, 'CEU', 'Foundational Google Cloud certification.', 'https://cloud.google.com/learn/certification/cloud-digital-leader'),
  ('Cisco CCNA', 'Cisco', 'Networking', 36, NULL, 'CEU', 'Cisco Certified Network Associate for networking fundamentals.', 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html'),

  -- Project/Compliance
  ('PMP', 'PMI', 'Project Management', 36, 60, 'PDU', 'Project Management Professional certification.', 'https://www.pmi.org/certifications/project-management-pmp'),
  ('CAPM', 'PMI', 'Project Management', 36, 15, 'PDU', 'Certified Associate in Project Management.', 'https://www.pmi.org/certifications/certified-associate-capm'),
  ('ITIL Foundation', 'PeopleCert', 'IT Service Management', NULL, NULL, 'CEU', 'IT Infrastructure Library foundation certification. No expiration.', 'https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-702'),
  ('CMMC CCP', 'Cyber AB', 'Compliance', 36, NULL, 'CEU', 'Cybersecurity Maturity Model Certification Certified Professional.', 'https://cyberab.org/'),
  ('CMMC CCA', 'Cyber AB', 'Compliance', 36, NULL, 'CEU', 'Cybersecurity Maturity Model Certification Certified Assessor.', 'https://cyberab.org/')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. SEED DATA — Training Opportunities (placeholder)
-- ============================================

INSERT INTO training_opportunities (title, provider, category, unit_type, estimated_units, event_date, registration_url, cost, delivery_method) VALUES
  ('CompTIA Security+ Prep Course', 'Adroa Domain', 'Cybersecurity', 'CEU', 40, NULL, 'https://learn.adroadomain.com', 'Included', 'self-paced'),
  ('CISSP Study Group — Weekly Sessions', 'ISC2 Community', 'Cybersecurity', 'CPE', 2, NULL, 'https://www.isc2.org/chapters', 'Free', 'virtual'),
  ('AWS Cloud Practitioner Essentials', 'AWS Training', 'Cloud', 'CEU', 6, NULL, 'https://aws.amazon.com/training/', 'Free', 'self-paced'),
  ('PMP Exam Prep Workshop', 'PMI', 'Project Management', 'PDU', 35, NULL, 'https://www.pmi.org/learning', 'Paid', 'virtual'),
  ('Cyber Awareness & Digital Safety', 'Adroa Domain', 'Cybersecurity', 'CEU', 10, NULL, 'https://learn.adroadomain.com', 'Included', 'self-paced'),
  ('ISACA CISM Review Course', 'ISACA', 'Cybersecurity', 'CPE', 40, NULL, 'https://www.isaca.org/education', 'Paid', 'virtual'),
  ('Google Cloud Fundamentals', 'Google Cloud', 'Cloud', 'CEU', 8, NULL, 'https://cloud.google.com/training', 'Free', 'self-paced'),
  ('ITIL Foundation Crash Course', 'PeopleCert', 'IT Service Management', 'CEU', 16, NULL, 'https://www.peoplecert.org/', 'Paid', 'virtual')
ON CONFLICT DO NOTHING;
