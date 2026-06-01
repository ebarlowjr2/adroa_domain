import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { StatCard } from '@/components/ui/stat-card'
import { useVcmAuth } from '@/contexts/VcmAuthContext'
import { supabase } from '@/lib/supabase'
import type { UserCertification, TrainingActivity } from '@/lib/vcm-types'
import {
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Plus,
} from 'lucide-react'

interface DashboardData {
  certifications: UserCertification[]
  allActivities: TrainingActivity[]
  recentActivities: TrainingActivity[]
}

export default function VcmDashboard() {
  const { user } = useVcmAuth()
  const [data, setData] = useState<DashboardData>({ certifications: [], allActivities: [], recentActivities: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [certsRes, allActivitiesRes, recentActivitiesRes] = await Promise.all([
        supabase
          .from('user_certifications')
          .select('*')
          .eq('user_id', user!.id)
          .order('expiration_date', { ascending: true }),
        supabase
          .from('training_activities')
          .select('*')
          .eq('user_id', user!.id),
        supabase
          .from('training_activities')
          .select('*')
          .eq('user_id', user!.id)
          .order('completion_date', { ascending: false })
          .limit(5),
      ])
      setData({
        certifications: (certsRes.data || []) as UserCertification[],
        allActivities: (allActivitiesRes.data || []) as TrainingActivity[],
        recentActivities: (recentActivitiesRes.data || []) as TrainingActivity[],
      })
      setLoading(false)
    }
    load()
  }, [user])

  const now = new Date()
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const activeCerts = data.certifications.filter(c => c.status === 'active')
  const expiringSoon = activeCerts.filter(c => {
    if (!c.expiration_date) return false
    const exp = new Date(c.expiration_date)
    return exp <= in90Days && exp > now
  })
  const expired = data.certifications.filter(c => {
    if (!c.expiration_date) return false
    return new Date(c.expiration_date) <= now
  })

  const currentYear = now.getFullYear()
  const thisYearActivities = data.allActivities.filter(a =>
    new Date(a.completion_date).getFullYear() === currentYear
  )
  const totalUnitsEarned = thisYearActivities.reduce((sum, a) => sum + Number(a.units_earned), 0)

  const totalUnitsRequired = activeCerts.reduce((sum, c) => sum + (c.required_units || 0), 0)
  const unitsRemaining = Math.max(0, totalUnitsRequired - totalUnitsEarned)

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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40">Your certification tracking overview</p>
        </div>
        <Link
          to="/vcm/certifications/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent-light"
        >
          <Plus size={16} />
          Add Certification
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Certifications"
          value={activeCerts.length}
          icon={<Award size={20} />}
        />
        <StatCard
          title="Credits Completed"
          value={totalUnitsEarned}
          icon={<BookOpen size={20} />}
          trend={`This year (${currentYear})`}
        />
        <StatCard
          title="Credits Remaining"
          value={unitsRemaining}
          icon={<TrendingUp size={20} />}
          trend={totalUnitsRequired > 0 ? `of ${totalUnitsRequired} total required` : 'No requirements set'}
        />
        <StatCard
          title="Renewals Due Soon"
          value={expiringSoon.length}
          icon={<AlertTriangle size={20} />}
          trend="Within 90 days"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Renewals */}
        <div className="rounded-2xl border border-white/10 bg-brand-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Renewals</h2>
            <Link to="/vcm/certifications" className="text-xs text-brand-accent hover:underline">
              View all <ChevronRight size={12} className="inline" />
            </Link>
          </div>
          {[...expiringSoon, ...expired].length === 0 && activeCerts.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar size={32} className="mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/40">No certifications tracked yet</p>
              <Link
                to="/vcm/certifications/new"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-accent hover:underline"
              >
                <Plus size={14} />
                Add your first certification
              </Link>
            </div>
          ) : [...expiringSoon, ...expired].length === 0 ? (
            <p className="py-4 text-sm text-white/40">No renewals due in the next 90 days.</p>
          ) : (
            <div className="space-y-3">
              {[...expired, ...expiringSoon].slice(0, 5).map(cert => {
                const exp = new Date(cert.expiration_date!)
                const isExpired = exp <= now
                const daysUntil = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={cert.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {cert.custom_cert_name || cert.vendor}
                      </p>
                      <p className="text-xs text-white/40">{cert.vendor}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isExpired
                        ? 'bg-red-500/10 text-red-400'
                        : daysUntil <= 30
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-brand-accent/10 text-brand-accent'
                    }`}>
                      {isExpired ? 'Expired' : `${daysUntil} days`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Training Activity */}
        <div className="rounded-2xl border border-white/10 bg-brand-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Training Activity</h2>
            <Link to="/vcm/training-log" className="text-xs text-brand-accent hover:underline">
              View all <ChevronRight size={12} className="inline" />
            </Link>
          </div>
          {data.recentActivities.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/40">No training activities logged yet</p>
              <Link
                to="/vcm/training-log"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-accent hover:underline"
              >
                <Plus size={14} />
                Log your first activity
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-xs text-white/40">
                      {activity.provider} · {new Date(activity.completion_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
                    {activity.units_earned} {activity.unit_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-brand-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Suggested Next Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeCerts.length === 0 && (
            <Link
              to="/vcm/certifications/new"
              className="flex items-center gap-3 rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-4 py-3 text-sm text-white hover:bg-brand-accent/10"
            >
              <Award size={18} className="text-brand-accent" />
              Add your first certification
            </Link>
          )}
          {data.allActivities.length === 0 && (
            <Link
              to="/vcm/training-log"
              className="flex items-center gap-3 rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-4 py-3 text-sm text-white hover:bg-brand-accent/10"
            >
              <BookOpen size={18} className="text-brand-accent" />
              Log a training activity
            </Link>
          )}
          <Link
            to="/vcm/opportunities"
            className="flex items-center gap-3 rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-4 py-3 text-sm text-white hover:bg-brand-accent/10"
          >
            <TrendingUp size={18} className="text-brand-accent" />
            Browse training opportunities
          </Link>
        </div>
      </div>
    </VcmLayout>
  )
}
