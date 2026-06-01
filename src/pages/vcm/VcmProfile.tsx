import { useState, useEffect } from 'react'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { supabase } from '@/lib/supabase'
import { UserCircle, Save, Check } from 'lucide-react'

export default function VcmProfile() {
  const { user, profile, refreshProfile } = useVcmAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profession: '',
    industry: '',
    bio: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email || user?.email || '',
        profession: profile.profession,
        industry: profile.industry,
        bio: profile.bio,
      })
    }
  }, [profile, user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaved(false)

    await supabase.from('vcm_user_profiles').update({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      profession: form.profession,
      industry: form.industry,
      bio: form.bio,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)

    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <VcmLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <UserCircle size={28} className="text-brand-accent" />
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-sm text-white/40">Manage your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-white/10 bg-brand-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-white/60">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-white/60">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/40 focus:border-brand-accent focus:outline-none"
                disabled
              />
              <p className="mt-1 text-xs text-white/30">Email is linked to your login and cannot be changed here.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Profession</label>
              <input
                type="text"
                value={form.profession}
                onChange={e => setForm(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                placeholder="e.g. Cybersecurity Analyst"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Industry</label>
              <select
                value={form.industry}
                onChange={e => setForm(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              >
                <option value="">Select industry</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="information_technology">Information Technology</option>
                <option value="cloud_computing">Cloud Computing</option>
                <option value="compliance">Compliance & Risk</option>
                <option value="project_management">Project Management</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="government">Government</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-white/60">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-accent focus:outline-none"
                placeholder="Brief description of your professional background..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-accent-light disabled:opacity-50"
            >
              {saving ? (
                <>Saving...</>
              ) : saved ? (
                <>
                  <Check size={16} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile
                </>
              )}
            </button>
            {saved && (
              <span className="text-sm text-green-400">Profile updated successfully!</span>
            )}
          </div>
        </form>

        {/* Account info */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-brand-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Login Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Account Created</span>
              <span className="text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VcmLayout>
  )
}
