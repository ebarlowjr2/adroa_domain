import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import type { DashboardStats, TrainingAssignment, Employee, TrainingCatalog } from '@/lib/types'

export default function Dashboard() {
  const { organization } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    trainingCompleted: 0,
    trainingTotal: 0,
    overdueCount: 0,
    atRiskCount: 0,
    dueThisWeek: 0,
  })
  const [recentAssignments, setRecentAssignments] = useState<(TrainingAssignment & { employee?: Employee; training?: TrainingCatalog })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organization) return

    async function loadDashboard() {
      const orgId = organization!.id

      // Get employee count
      const { count: empCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'active')

      // Get all assignments
      const { data: assignments } = await supabase
        .from('training_assignments')
        .select('*')
        .eq('org_id', orgId)

      const total = assignments?.length || 0
      const completed = assignments?.filter(a => a.status === 'completed').length || 0
      const overdue = assignments?.filter(a => a.status === 'overdue' || (a.status === 'assigned' && new Date(a.due_date) < new Date())).length || 0

      // Due this week
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const dueThisWeek = assignments?.filter(a =>
        a.status !== 'completed' &&
        new Date(a.due_date) >= now &&
        new Date(a.due_date) <= weekFromNow
      ).length || 0

      // Employees with overdue training = at risk
      const overdueEmployeeIds = new Set(
        assignments?.filter(a => a.status === 'overdue' || (a.status === 'assigned' && new Date(a.due_date) < new Date()))
          .map(a => a.employee_id)
      )

      setStats({
        totalEmployees: empCount || 0,
        trainingCompleted: completed,
        trainingTotal: total,
        overdueCount: overdue,
        atRiskCount: overdueEmployeeIds.size,
        dueThisWeek,
      })

      // Recent assignments with employee and training info
      const { data: recent } = await supabase
        .from('training_assignments')
        .select('*, employee:employees(*), training:training_catalog(*)')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentAssignments(recent || [])
      setLoading(false)
    }

    loadDashboard()
  }, [organization])

  const completionPct = stats.trainingTotal > 0
    ? Math.round((stats.trainingCompleted / stats.trainingTotal) * 100)
    : 0

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/60">
          {organization?.name} — Training overview
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<Users size={20} />}
            />
            <StatCard
              title="Training Completed"
              value={`${completionPct}%`}
              icon={<CheckCircle size={20} />}
              trend={`${stats.trainingCompleted} of ${stats.trainingTotal}`}
            />
            <StatCard
              title="Overdue Training"
              value={stats.overdueCount}
              icon={<AlertTriangle size={20} />}
            />
            <StatCard
              title="At Risk Employees"
              value={stats.atRiskCount}
              icon={<TrendingUp size={20} />}
            />
            <StatCard
              title="Due This Week"
              value={stats.dueThisWeek}
              icon={<Clock size={20} />}
            />
            <StatCard
              title="Active Trainings"
              value={stats.trainingTotal}
              icon={<BookOpen size={20} />}
            />
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
            <div className="rounded-2xl border border-white/10 bg-brand-card overflow-hidden">
              {recentAssignments.length === 0 ? (
                <div className="p-8 text-center text-white/40">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No training assignments yet</p>
                  <p className="mt-1 text-sm">Add employees and assign training to get started</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/50">
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Training</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentAssignments.map((a) => (
                      <tr key={a.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-white">
                          {a.employee ? `${a.employee.first_name} ${a.employee.last_name}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">
                          {a.training?.title || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              a.status === 'completed' ? 'success' :
                              a.status === 'overdue' ? 'danger' :
                              a.status === 'in_progress' ? 'warning' : 'default'
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/50">
                          {new Date(a.due_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
