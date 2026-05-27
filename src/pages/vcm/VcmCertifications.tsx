import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { supabase } from '@/lib/supabase'
import type { UserCertification } from '@/lib/vcm-types'
import { Award, Plus, Pencil, Trash2, ExternalLink, Calendar, AlertTriangle } from 'lucide-react'

export default function VcmCertifications() {
  const { user } = useVcmAuth()
  const [certs, setCerts] = useState<UserCertification[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserCertification>>({})

  const loadCerts = async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_certifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setCerts((data || []) as UserCertification[])
    setLoading(false)
  }

  useEffect(() => { loadCerts() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string) => {
    await supabase.from('user_certifications').delete().eq('id', id)
    setDeleteId(null)
    loadCerts()
  }

  const handleEditSave = async () => {
    if (!editId) return
    await supabase.from('user_certifications').update({
      custom_cert_name: editForm.custom_cert_name,
      vendor: editForm.vendor,
      issue_date: editForm.issue_date || null,
      expiration_date: editForm.expiration_date || null,
      renewal_cycle_months: editForm.renewal_cycle_months ?? null,
      required_units: editForm.required_units ?? null,
      unit_type: editForm.unit_type,
      status: editForm.status,
      credential_id: editForm.credential_id,
      credential_url: editForm.credential_url,
      notes: editForm.notes,
      updated_at: new Date().toISOString(),
    }).eq('id', editId)
    setEditId(null)
    loadCerts()
  }

  const now = new Date()

  const getStatusBadge = (cert: UserCertification) => {
    if (cert.expiration_date && new Date(cert.expiration_date) <= now) {
      return <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">Expired</span>
    }
    if (cert.status === 'active') {
      return <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Active</span>
    }
    if (cert.status === 'pending') {
      return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">Pending</span>
    }
    return <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40">{cert.status}</span>
  }

  if (loading) {
    return (
      <VcmLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      </VcmLayout>
    )
  }

  return (
    <VcmLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certifications</h1>
          <p className="text-sm text-white/40">Manage your professional certifications</p>
        </div>
        <Link
          to="/vcm/certifications/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-light"
        >
          <Plus size={16} />
          Add Certification
        </Link>
      </div>

      {certs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-card py-16 text-center">
          <Award size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="text-lg font-semibold text-white">No certifications yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
            Start tracking your professional certifications to stay on top of renewals and continuing education requirements.
          </p>
          <Link
            to="/vcm/certifications/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light"
          >
            <Plus size={16} />
            Add Your First Certification
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map(cert => (
            <div key={cert.id} className="rounded-2xl border border-white/10 bg-brand-card p-5">
              {editId === cert.id ? (
                /* Edit mode */
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Certification Name</label>
                      <input
                        type="text"
                        value={editForm.custom_cert_name || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, custom_cert_name: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Vendor</label>
                      <input
                        type="text"
                        value={editForm.vendor || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, vendor: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Issue Date</label>
                      <input
                        type="date"
                        value={editForm.issue_date || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, issue_date: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Expiration Date</label>
                      <input
                        type="date"
                        value={editForm.expiration_date || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, expiration_date: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Required Units</label>
                      <input
                        type="number"
                        value={editForm.required_units ?? ''}
                        onChange={e => setEditForm(prev => ({ ...prev, required_units: e.target.value ? Number(e.target.value) : null }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Unit Type</label>
                      <select
                        value={editForm.unit_type || 'CEU'}
                        onChange={e => setEditForm(prev => ({ ...prev, unit_type: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      >
                        <option value="CEU">CEU</option>
                        <option value="CPE">CPE</option>
                        <option value="PDU">PDU</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Status</label>
                      <select
                        value={editForm.status || 'active'}
                        onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value as UserCertification['status'] }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="pending">Pending</option>
                        <option value="revoked">Revoked</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-white/60">Credential ID</label>
                      <input
                        type="text"
                        value={editForm.credential_id || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, credential_id: e.target.value }))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/60">Notes</label>
                    <textarea
                      value={editForm.notes || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-light"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-white">
                        {cert.custom_cert_name || 'Unnamed Certification'}
                      </h3>
                      {getStatusBadge(cert)}
                    </div>
                    <p className="mt-1 text-sm text-white/40">{cert.vendor}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                      {cert.issue_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </span>
                      )}
                      {cert.expiration_date && (
                        <span className={`flex items-center gap-1 ${
                          new Date(cert.expiration_date) <= now ? 'text-red-400' :
                          new Date(cert.expiration_date) <= new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) ? 'text-amber-400' : ''
                        }`}>
                          {new Date(cert.expiration_date) <= now ? <AlertTriangle size={12} /> : <Calendar size={12} />}
                          Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                        </span>
                      )}
                      {cert.required_units != null && cert.required_units > 0 && (
                        <span>{cert.required_units} {cert.unit_type} required</span>
                      )}
                      {cert.credential_id && <span>ID: {cert.credential_id}</span>}
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
                      >
                        View Credential <ExternalLink size={10} />
                      </a>
                    )}
                    {cert.notes && (
                      <p className="mt-2 text-xs text-white/30">{cert.notes}</p>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(cert.id)
                        setEditForm(cert)
                      }}
                      className="rounded-lg border border-white/10 p-2 text-white/40 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cert.id)}
                      className="rounded-lg border border-white/10 p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Delete confirmation */}
              {deleteId === cert.id && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="flex-1 text-sm text-red-300">Delete this certification?</p>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </VcmLayout>
  )
}
