import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit2, UserX, UserCheck } from 'lucide-react'
import type { Employee } from '@/lib/types'

export default function Employees() {
  const { organization } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    job_title: '',
    manager_email: '',
  })

  const loadEmployees = useCallback(async () => {
    if (!organization) return
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('org_id', organization.id)
      .order('created_at', { ascending: false })

    setEmployees((data as Employee[]) || [])
    setLoading(false)
  }, [organization])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const resetForm = () => {
    setForm({ first_name: '', last_name: '', email: '', department: '', job_title: '', manager_email: '' })
    setFormError('')
  }

  const openAdd = () => {
    resetForm()
    setEditEmployee(null)
    setShowAddDialog(true)
  }

  const openEdit = (emp: Employee) => {
    setForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      department: emp.department,
      job_title: emp.job_title,
      manager_email: emp.manager_email,
    })
    setEditEmployee(emp)
    setShowAddDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return
    setFormLoading(true)
    setFormError('')

    if (editEmployee) {
      const { error } = await supabase
        .from('employees')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editEmployee.id)

      if (error) { setFormError(error.message); setFormLoading(false); return }
    } else {
      // Check seat limit
      const activeCount = employees.filter(e => e.status === 'active').length
      if (activeCount >= organization.seat_limit) {
        setFormError(`Seat limit reached (${organization.seat_limit}). Upgrade your plan to add more employees.`)
        setFormLoading(false)
        return
      }

      const { error } = await supabase
        .from('employees')
        .insert({
          ...form,
          org_id: organization.id,
          status: 'active',
        })

      if (error) { setFormError(error.message); setFormLoading(false); return }
    }

    setFormLoading(false)
    setShowAddDialog(false)
    loadEmployees()
  }

  const toggleStatus = async (emp: Employee) => {
    const newStatus = emp.status === 'active' ? 'inactive' : 'active'
    await supabase
      .from('employees')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', emp.id)
    loadEmployees()
  }

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))]

  const filtered = employees.filter(emp => {
    const matchesSearch = !search ||
      `${emp.first_name} ${emp.last_name} ${emp.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesDept = !departmentFilter || emp.department === departmentFilter
    return matchesSearch && matchesDept
  })

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-sm text-white/60">
            {employees.filter(e => e.status === 'active').length} active of {organization?.seat_limit} seats
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
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
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-brand-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            {employees.length === 0 ? (
              <>
                <p className="text-lg">No employees yet</p>
                <p className="mt-1 text-sm">Add your first employee to get started</p>
              </>
            ) : (
              <p>No employees match your filters</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/50">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Job Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">{emp.email}</td>
                    <td className="px-4 py-3 text-sm text-white/70">{emp.department || '—'}</td>
                    <td className="px-4 py-3 text-sm text-white/70">{emp.job_title || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.status === 'active' ? 'success' : 'outline'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(emp)}
                          className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleStatus(emp)}
                          className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                          title={emp.status === 'active' ? 'Disable' : 'Enable'}
                        >
                          {emp.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogHeader>
          <DialogTitle>{editEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="first_name"
              label="First Name"
              placeholder="Jane"
              value={form.first_name}
              onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
              required
            />
            <Input
              id="last_name"
              label="Last Name"
              placeholder="Smith"
              value={form.last_name}
              onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
              required
            />
          </div>
          <Input
            id="emp_email"
            type="email"
            label="Email"
            placeholder="jane@acme.com"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="department"
              label="Department"
              placeholder="Engineering"
              value={form.department}
              onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
            />
            <Input
              id="job_title"
              label="Job Title"
              placeholder="Software Engineer"
              value={form.job_title}
              onChange={(e) => setForm(prev => ({ ...prev, job_title: e.target.value }))}
            />
          </div>
          <Input
            id="manager_email"
            type="email"
            label="Manager Email"
            placeholder="manager@acme.com"
            value={form.manager_email}
            onChange={(e) => setForm(prev => ({ ...prev, manager_email: e.target.value }))}
          />

          {formError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : editEmployee ? 'Update' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Dialog>
    </DashboardLayout>
  )
}
