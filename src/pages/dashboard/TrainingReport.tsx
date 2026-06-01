import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Filter } from 'lucide-react'
import type { Employee, TrainingCatalog, TrainingAssignment } from '@/lib/types'

interface EmployeeTrainingRow {
  employee: Employee
  assignments: Record<string, TrainingAssignment>
}

export default function TrainingReport() {
  const { organization } = useAuth()
  const [rows, setRows] = useState<EmployeeTrainingRow[]>([])
  const [trainings, setTrainings] = useState<TrainingCatalog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadData = useCallback(async () => {
    if (!organization) return

    const [empRes, catRes, assignRes] = await Promise.all([
      supabase.from('employees').select('*').eq('org_id', organization.id).order('last_name'),
      supabase.from('training_catalog').select('*').eq('active', true).order('title'),
      supabase.from('training_assignments').select('*').eq('org_id', organization.id),
    ])

    const employees = (empRes.data as Employee[]) || []
    const catalog = (catRes.data as TrainingCatalog[]) || []
    const assignments = (assignRes.data as TrainingAssignment[]) || []

    const assignmentMap: Record<string, Record<string, TrainingAssignment>> = {}
    for (const a of assignments) {
      if (!assignmentMap[a.employee_id]) assignmentMap[a.employee_id] = {}
      assignmentMap[a.employee_id][a.training_id] = a
    }

    const tableRows: EmployeeTrainingRow[] = employees.map(emp => ({
      employee: emp,
      assignments: assignmentMap[emp.id] || {},
    }))

    setRows(tableRows)
    setTrainings(catalog)
    setLoading(false)
  }, [organization])

  useEffect(() => {
    loadData()
  }, [loadData])

  const departments = [...new Set(rows.map(r => r.employee.department).filter(Boolean))]

  const filtered = rows.filter(row => {
    const emp = row.employee
    const matchesSearch = !search ||
      `${emp.first_name} ${emp.last_name} ${emp.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesDept = !departmentFilter || emp.department === departmentFilter
    const matchesStatus = !statusFilter || emp.status === statusFilter
    return matchesSearch && matchesDept && matchesStatus
  })

  const exportCsv = () => {
    const headers = ['Last Name', 'First Name', 'Email', 'Department', 'Status',
      ...trainings.map(t => `${t.title} - Status`),
      ...trainings.map(t => `${t.title} - Assigned`),
      ...trainings.map(t => `${t.title} - Completed`),
    ]
    const csvRows = [headers.join(',')]

    for (const row of filtered) {
      const emp = row.employee
      const base = [emp.last_name, emp.first_name, emp.email, emp.department, emp.status]
      const statuses = trainings.map(t => row.assignments[t.id]?.status || 'not assigned')
      const assigned = trainings.map(t => row.assignments[t.id]?.created_at ? new Date(row.assignments[t.id].created_at).toLocaleDateString() : '')
      const completed = trainings.map(t => row.assignments[t.id]?.completed_at ? new Date(row.assignments[t.id].completed_at!).toLocaleDateString() : '')
      csvRows.push([...base, ...statuses, ...assigned, ...completed].map(v => `"${v}"`).join(','))
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `training-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString()
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="text-xs text-white/30">—</span>
    const variant = status === 'completed' ? 'success' :
                    status === 'overdue' ? 'danger' :
                    status === 'in_progress' ? 'warning' : 'default'
    return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Training Report</h1>
          <p className="text-sm text-white/60">
            Employee training status and completion dates
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-brand-accent/50 focus:outline-none"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-brand-accent/50 focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-brand-accent/50 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Summary bar */}
      <div className="mb-4 flex gap-4 text-xs text-white/50">
        <span>{filtered.length} employees</span>
        <span>{trainings.length} training courses</span>
        <span className="flex items-center gap-1"><Filter size={12} /> Scroll right for all courses →</span>
      </div>

      {/* Spreadsheet table */}
      <div className="rounded-2xl border border-white/10 bg-brand-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <p className="text-lg">No employees to display</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/50">
                  <th className="sticky left-0 z-10 bg-brand-card px-4 py-3 min-w-[180px]">Employee</th>
                  <th className="px-4 py-3 min-w-[120px]">Department</th>
                  <th className="px-4 py-3 min-w-[80px]">Status</th>
                  {trainings.map(t => (
                    <th key={t.id} className="px-3 py-3 min-w-[200px]">
                      <div className="max-w-[180px]">
                        <span className="block truncate normal-case" title={t.title}>{t.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((row) => (
                  <tr key={row.employee.id} className="hover:bg-white/5">
                    <td className="sticky left-0 z-10 bg-brand-card px-4 py-3 text-sm">
                      <div className="font-medium text-white">{row.employee.first_name} {row.employee.last_name}</div>
                      <div className="text-xs text-white/50">{row.employee.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">{row.employee.department || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.employee.status === 'active' ? 'success' : 'outline'}>
                        {row.employee.status}
                      </Badge>
                    </td>
                    {trainings.map(t => {
                      const a = row.assignments[t.id]
                      return (
                        <td key={t.id} className="px-3 py-3 text-xs">
                          <div className="space-y-1">
                            {getStatusBadge(a?.status)}
                            {a && (
                              <div className="space-y-0.5 text-white/40">
                                <div>Assigned: {formatDate(a.created_at)}</div>
                                <div>Due: {formatDate(a.due_date)}</div>
                                {a.completed_at && <div className="text-emerald-400/70">Done: {formatDate(a.completed_at)}</div>}
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
