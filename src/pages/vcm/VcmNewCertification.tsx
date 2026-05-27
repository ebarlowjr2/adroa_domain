import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { supabase } from '@/lib/supabase'
import type { CertificationCatalogEntry } from '@/lib/vcm-types'
import { ArrowLeft, Search } from 'lucide-react'

export default function VcmNewCertification() {
  const { user } = useVcmAuth()
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<CertificationCatalogEntry[]>([])
  const [search, setSearch] = useState('')
  const [selectedCatalog, setSelectedCatalog] = useState<CertificationCatalogEntry | null>(null)
  const [isCustom, setIsCustom] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [certName, setCertName] = useState('')
  const [vendor, setVendor] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [renewalCycle, setRenewalCycle] = useState<string>('')
  const [requiredUnits, setRequiredUnits] = useState<string>('')
  const [unitType, setUnitType] = useState('CEU')
  const [credentialId, setCredentialId] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    supabase
      .from('certification_catalog')
      .select('*')
      .eq('active', true)
      .order('name')
      .then(({ data }) => setCatalog((data || []) as CertificationCatalogEntry[]))
  }, [])

  const filteredCatalog = catalog.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.vendor.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const selectFromCatalog = (entry: CertificationCatalogEntry) => {
    setSelectedCatalog(entry)
    setIsCustom(false)
    setCertName(entry.name)
    setVendor(entry.vendor)
    setUnitType(entry.unit_type || 'CEU')
    setRenewalCycle(entry.default_renewal_cycle_months?.toString() || '')
    setRequiredUnits(entry.default_required_units?.toString() || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !certName.trim()) return
    setError('')
    setSaving(true)

    const { error: err } = await supabase.from('user_certifications').insert({
      user_id: user.id,
      certification_id: selectedCatalog?.id || null,
      custom_cert_name: certName,
      vendor,
      issue_date: issueDate || null,
      expiration_date: expirationDate || null,
      renewal_cycle_months: renewalCycle ? Number(renewalCycle) : null,
      required_units: requiredUnits ? Number(requiredUnits) : null,
      unit_type: unitType,
      status: 'active',
      credential_id: credentialId,
      credential_url: credentialUrl,
      notes,
    })

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/vcm/certifications')
    }
  }

  return (
    <VcmLayout>
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate('/vcm/certifications')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Certifications
        </button>

        <h1 className="mb-6 text-2xl font-bold text-white">Add Certification</h1>

        {/* Step 1: Select from catalog or custom */}
        {!selectedCatalog && !isCustom && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search certifications (e.g. Security+, CISSP, PMP)..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-brand-accent focus:outline-none"
              />
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredCatalog.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => selectFromCatalog(entry)}
                  className="flex w-full items-start gap-4 rounded-xl border border-white/10 bg-brand-card p-4 text-left transition-colors hover:border-brand-accent/30"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{entry.name}</p>
                    <p className="text-xs text-white/40">{entry.vendor} · {entry.category}</p>
                    <p className="mt-1 text-xs text-white/30">{entry.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {entry.default_required_units && (
                      <p className="text-xs text-brand-accent">
                        {entry.default_required_units} {entry.unit_type}
                      </p>
                    )}
                    {entry.default_renewal_cycle_months && (
                      <p className="text-xs text-white/30">
                        {entry.default_renewal_cycle_months} mo cycle
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCustom(true)}
              className="w-full rounded-xl border border-dashed border-white/20 bg-white/5 py-4 text-sm text-white/60 hover:border-brand-accent/30 hover:text-white"
            >
              + Add a custom certification not in the catalog
            </button>
          </div>
        )}

        {/* Step 2: Certification details form */}
        {(selectedCatalog || isCustom) && (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-brand-card p-6">
            {selectedCatalog && (
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/40">Selected from catalog:</p>
                  <p className="text-sm font-medium text-brand-accent">{selectedCatalog.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCatalog(null)
                    setCertName('')
                    setVendor('')
                  }}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Change
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-white/60">Certification Name *</label>
                <input
                  type="text"
                  value={certName}
                  onChange={e => setCertName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Vendor / Issuing Organization</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={e => setVendor(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Credential ID</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={e => setCredentialId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. COMP001234567890"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={e => setExpirationDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Renewal Cycle (months)</label>
                <input
                  type="number"
                  value={renewalCycle}
                  onChange={e => setRenewalCycle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. 36"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Required Units</label>
                <input
                  type="number"
                  value={requiredUnits}
                  onChange={e => setRequiredUnits(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Unit Type</label>
                <select
                  value={unitType}
                  onChange={e => setUnitType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                >
                  <option value="CEU">CEU</option>
                  <option value="CPE">CPE</option>
                  <option value="PDU">PDU</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-white/60">Credential URL</label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={e => setCredentialUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-white/60">Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !certName.trim()}
                className="rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add Certification'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/vcm/certifications')}
                className="rounded-xl border border-white/10 px-6 py-2.5 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </VcmLayout>
  )
}
