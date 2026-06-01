import { useEffect, useState } from 'react'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { supabase } from '@/lib/supabase'
import type { TrainingActivity, UserCertification } from '@/lib/vcm-types'
import { BookOpen, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'

export default function VcmTrainingLog() {
  const { user } = useVcmAuth()
  const [activities, setActivities] = useState<TrainingActivity[]>([])
  const [certs, setCerts] = useState<UserCertification[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    provider: '',
    activity_type: 'course',
    completion_date: '',
    units_earned: '',
    unit_type: 'CEU',
    certification_id: '',
    evidence_url: '',
    certificate_url: '',
    notes: '',
  })

  const resetForm = () => setForm({
    title: '', provider: '', activity_type: 'course',
    completion_date: '', units_earned: '', unit_type: 'CEU',
    certification_id: '', evidence_url: '', certificate_url: '', notes: '',
  })

  const loadData = async () => {
    if (!user) return
    const [activitiesRes, certsRes] = await Promise.all([
      supabase.from('training_activities').select('*').eq('user_id', user.id).order('completion_date', { ascending: false }),
      supabase.from('user_certifications').select('*').eq('user_id', user.id).order('custom_cert_name'),
    ])
    setActivities((activitiesRes.data || []) as TrainingActivity[])
    setCerts((certsRes.data || []) as UserCertification[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = {
      user_id: user.id,
      title: form.title,
      provider: form.provider,
      activity_type: form.activity_type,
      completion_date: form.completion_date,
      units_earned: Number(form.units_earned) || 0,
      unit_type: form.unit_type,
      certification_id: form.certification_id || null,
      evidence_url: form.evidence_url,
      certificate_url: form.certificate_url,
      notes: form.notes,
    }

    if (editId) {
      await supabase.from('training_activities').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('training_activities').insert(payload)
    }

    resetForm()
    setShowAdd(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('training_activities').delete().eq('id', id)
    setDeleteId(null)
    loadData()
  }

  const startEdit = (a: TrainingActivity) => {
    setEditId(a.id)
    setShowAdd(true)
    setForm({
      title: a.title,
      provider: a.provider,
      activity_type: a.activity_type,
      completion_date: a.completion_date,
      units_earned: a.units_earned.toString(),
      unit_type: a.unit_type,
      certification_id: a.certification_id || '',
      evidence_url: a.evidence_url,
      certificate_url: a.certificate_url,
      notes: a.notes,
    })
  }

  // Summary stats
  const currentYear = new Date().getFullYear()
  const thisYearActivities = activities.filter(a => new Date(a.completion_date).getFullYear() === currentYear)
  const totalUnitsThisYear = thisYearActivities.reduce((s, a) => s + Number(a.units_earned), 0)

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
          <h1 className="text-2xl font-bold text-white">Training Log</h1>
          <p className="text-sm text-white/40">
            {totalUnitsThisYear > 0 ? `${totalUnitsThisYear} units earned in ${currentYear}` : 'Track your completed training activities'}
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditId(null); resetForm() }}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-light"
        >
          <Plus size={16} />
          Log Activity
        </button>
      </div>

      {/* Add/Edit form */}
      {showAdd && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-brand-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {editId ? 'Edit Activity' : 'Log Training Activity'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-white/60">Activity Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. CompTIA Security+ Prep Course"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Provider</label>
                <input
                  type="text"
                  value={form.provider}
                  onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. Adroa Domain, Coursera, SANS"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Activity Type</label>
                <select
                  value={form.activity_type}
                  onChange={e => setForm(prev => ({ ...prev, activity_type: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                >
                  <option value="course">Course</option>
                  <option value="webinar">Webinar</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="self-study">Self Study</option>
                  <option value="teaching">Teaching/Mentoring</option>
                  <option value="publication">Publication</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Completion Date *</label>
                <input
                  type="date"
                  value={form.completion_date}
                  onChange={e => setForm(prev => ({ ...prev, completion_date: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Units Earned *</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.units_earned}
                  onChange={e => setForm(prev => ({ ...prev, units_earned: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. 4"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Unit Type</label>
                <select
                  value={form.unit_type}
                  onChange={e => setForm(prev => ({ ...prev, unit_type: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                >
                  <option value="CEU">CEU</option>
                  <option value="CPE">CPE</option>
                  <option value="PDU">PDU</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Applies to Certification</label>
                <select
                  value={form.certification_id}
                  onChange={e => setForm(prev => ({ ...prev, certification_id: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                >
                  <option value="">None / General</option>
                  {certs.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.custom_cert_name || 'Unnamed Certification'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Evidence URL</label>
                <input
                  type="url"
                  value={form.evidence_url}
                  onChange={e => setForm(prev => ({ ...prev, evidence_url: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. LearnHouse course URL"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Certificate URL</label>
                <input
                  type="url"
                  value={form.certificate_url}
                  onChange={e => setForm(prev => ({ ...prev, certificate_url: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-white/60">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light"
              >
                {editId ? 'Save Changes' : 'Log Activity'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(false); setEditId(null); resetForm() }}
                className="rounded-xl border border-white/10 px-6 py-2.5 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activity list */}
      {activities.length === 0 && !showAdd ? (
        <div className="rounded-2xl border border-white/10 bg-brand-card py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="text-lg font-semibold text-white">No training activities yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
            Log completed courses, webinars, and other training to track your CEU/CPE/PDU credits.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light"
          >
            <Plus size={16} />
            Log Your First Activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="rounded-2xl border border-white/10 bg-brand-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">{activity.title}</h3>
                    <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-medium text-brand-accent">
                      {activity.units_earned} {activity.unit_type}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-white/40">
                    {activity.provider && <span>{activity.provider}</span>}
                    <span>{new Date(activity.completion_date).toLocaleDateString()}</span>
                    <span className="capitalize">{activity.activity_type}</span>
                  </div>
                  {(activity.evidence_url || activity.certificate_url) && (
                    <div className="mt-2 flex gap-3">
                      {activity.evidence_url && (
                        <a href={activity.evidence_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline">
                          Evidence <ExternalLink size={10} />
                        </a>
                      )}
                      {activity.certificate_url && (
                        <a href={activity.certificate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline">
                          Certificate <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  )}
                  {activity.notes && <p className="mt-1 text-xs text-white/30">{activity.notes}</p>}
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => startEdit(activity)}
                    className="rounded-lg border border-white/10 p-2 text-white/40 hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(activity.id)}
                    className="rounded-lg border border-white/10 p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {deleteId === activity.id && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="flex-1 text-sm text-red-300">Delete this activity?</p>
                  <button onClick={() => handleDelete(activity.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">
                    Delete
                  </button>
                  <button onClick={() => setDeleteId(null)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white">
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
