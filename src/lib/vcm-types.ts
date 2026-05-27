export interface VcmUserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  profession: string
  industry: string
  bio: string
  created_at: string
  updated_at: string
}

export interface CertificationCatalogEntry {
  id: string
  name: string
  vendor: string
  category: string
  default_renewal_cycle_months: number | null
  default_required_units: number | null
  unit_type: string
  description: string
  vendor_url: string
  active: boolean
  created_at: string
}

export interface UserCertification {
  id: string
  user_id: string
  certification_id: string | null
  custom_cert_name: string
  vendor: string
  issue_date: string | null
  expiration_date: string | null
  renewal_cycle_months: number | null
  required_units: number | null
  unit_type: string
  status: 'active' | 'expired' | 'revoked' | 'pending'
  credential_id: string
  credential_url: string
  notes: string
  created_at: string
  updated_at: string
  // joined
  catalog_entry?: CertificationCatalogEntry
}

export interface TrainingActivity {
  id: string
  user_id: string
  certification_id: string | null
  title: string
  provider: string
  activity_type: string
  completion_date: string
  units_earned: number
  unit_type: string
  evidence_url: string
  certificate_url: string
  notes: string
  created_at: string
  updated_at: string
  // joined
  certification?: UserCertification
}

export interface TrainingOpportunity {
  id: string
  title: string
  provider: string
  category: string
  unit_type: string
  estimated_units: number | null
  event_date: string | null
  registration_url: string
  cost: string
  delivery_method: 'virtual' | 'in-person' | 'hybrid' | 'self-paced'
  source: string
  active: boolean
  created_at: string
  updated_at: string
}
