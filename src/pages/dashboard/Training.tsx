import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BookOpen, Send, ExternalLink, Plus, Library, Check, Loader2, Search, FolderOpen, ChevronRight } from 'lucide-react'
import { fetchCourseList, fetchCollectionList, getCategoryFromTags, estimateMinutesFromAbout } from '@/services/learnhouse'
import type { LearnHouseCourse, LearnHouseCollection } from '@/services/learnhouse'
import { openWithSso } from '@/services/sso'
import type { TrainingCatalog, Employee, TrainingAssignment } from '@/lib/types'

type LibraryTab = 'collections' | 'courses'

export default function Training() {
  const { organization, user } = useAuth()
  const [catalog, setCatalog] = useState<TrainingCatalog[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [assignments, setAssignments] = useState<(TrainingAssignment & { employee?: Employee; training?: TrainingCatalog })[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showLibraryDialog, setShowLibraryDialog] = useState(false)
  const [assignForm, setAssignForm] = useState({
    training_id: '',
    employee_ids: [] as string[],
    department: '',
    due_date: '',
    assign_to: 'individual' as 'individual' | 'department' | 'all',
  })
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignError, setAssignError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Course Library state
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('collections')
  const [libraryCourses, setLibraryCourses] = useState<LearnHouseCourse[]>([])
  const [libraryCollections, setLibraryCollections] = useState<LearnHouseCollection[]>([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [librarySearch, setLibrarySearch] = useState('')
  const [addingCourseId, setAddingCourseId] = useState<string | null>(null)
  const [addingCollectionId, setAddingCollectionId] = useState<string | null>(null)
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!organization) return

    const [catalogRes, empRes, assignRes] = await Promise.all([
      supabase.from('training_catalog').select('*').eq('active', true).order('title'),
      supabase.from('employees').select('*').eq('org_id', organization.id).eq('status', 'active'),
      supabase.from('training_assignments')
        .select('*, employee:employees(*), training:training_catalog(*)')
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false }),
    ])

    setCatalog((catalogRes.data as TrainingCatalog[]) || [])
    setEmployees((empRes.data as Employee[]) || [])
    setAssignments(assignRes.data || [])
    setLoading(false)
  }, [organization])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openLibrary = async () => {
    setShowLibraryDialog(true)
    setLibraryTab('collections')
    setLibraryLoading(true)
    const [courses, collections] = await Promise.all([
      fetchCourseList(),
      fetchCollectionList(),
    ])
    setLibraryCourses(courses)
    setLibraryCollections(collections)
    setLibraryLoading(false)
  }

  const isCourseInCatalog = (courseUuid: string): boolean => {
    return catalog.some(c => c.learnhouse_course_id === courseUuid)
  }

  const collectionCatalogStatus = (collection: LearnHouseCollection): 'all' | 'some' | 'none' => {
    const inCatalog = collection.courses.filter(c => isCourseInCatalog(c.course_uuid)).length
    if (inCatalog === collection.courses.length) return 'all'
    if (inCatalog > 0) return 'some'
    return 'none'
  }

  const addCourseToCatalog = async (course: LearnHouseCourse) => {
    setAddingCourseId(course.course_uuid)
    const category = getCategoryFromTags(course.tags || '')
    const minutes = estimateMinutesFromAbout(course.about || '')

    const { error } = await supabase.from('training_catalog').insert({
      title: course.name,
      description: course.description,
      category,
      required_default: false,
      learnhouse_course_id: course.course_uuid,
      estimated_minutes: minutes,
      active: true,
    })

    if (!error) {
      await loadData()
    }
    setAddingCourseId(null)
  }

  const addCollectionToCatalog = async (collection: LearnHouseCollection) => {
    setAddingCollectionId(collection.collection_uuid)
    const coursesToAdd = collection.courses.filter(c => !isCourseInCatalog(c.course_uuid))

    if (coursesToAdd.length > 0) {
      const records = coursesToAdd.map(course => ({
        title: course.name,
        description: course.description,
        category: getCategoryFromTags(course.tags || ''),
        required_default: false,
        learnhouse_course_id: course.course_uuid,
        estimated_minutes: estimateMinutesFromAbout(course.about || ''),
        active: true,
      }))

      const { error } = await supabase.from('training_catalog').insert(records)
      if (!error) {
        await loadData()
      }
    }
    setAddingCollectionId(null)
  }

  const filteredLibraryCourses = libraryCourses.filter(c => {
    if (!librarySearch) return true
    const q = librarySearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || (c.tags || '').toLowerCase().includes(q)
  })

  const filteredCollections = libraryCollections.filter(c => {
    if (!librarySearch) return true
    const q = librarySearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  })

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return
    setAssignLoading(true)
    setAssignError('')

    let targetEmployeeIds: string[] = []

    if (assignForm.assign_to === 'all') {
      targetEmployeeIds = employees.map(e => e.id)
    } else if (assignForm.assign_to === 'department') {
      targetEmployeeIds = employees.filter(e => e.department === assignForm.department).map(e => e.id)
    } else {
      targetEmployeeIds = assignForm.employee_ids
    }

    if (targetEmployeeIds.length === 0) {
      setAssignError('No employees selected')
      setAssignLoading(false)
      return
    }

    const records = targetEmployeeIds.map(empId => ({
      org_id: organization.id,
      employee_id: empId,
      training_id: assignForm.training_id,
      assigned_by: organization.id,
      due_date: assignForm.due_date,
      status: 'assigned',
    }))

    const { error } = await supabase.from('training_assignments').insert(records)

    if (error) {
      setAssignError(error.message)
      setAssignLoading(false)
      return
    }

    setAssignLoading(false)
    setShowAssignDialog(false)
    setAssignForm({ training_id: '', employee_ids: [], department: '', due_date: '', assign_to: 'individual' })
    loadData()
  }

  const toggleEmployeeSelection = (empId: string) => {
    setAssignForm(prev => ({
      ...prev,
      employee_ids: prev.employee_ids.includes(empId)
        ? prev.employee_ids.filter(id => id !== empId)
        : [...prev.employee_ids, empId]
    }))
  }

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))]

  const filteredAssignments = assignments.filter(a => {
    if (!statusFilter) return true
    return a.status === statusFilter
  })

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Training</h1>
          <p className="text-sm text-white/60">Manage and assign cybersecurity training</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openLibrary}>
            <Library size={16} className="mr-2" />
            Course Library
          </Button>
          <Button onClick={() => setShowAssignDialog(true)}>
            <Send size={16} className="mr-2" />
            Assign Training
          </Button>
        </div>
      </div>

      {/* Training Catalog */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Training Catalog</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
            </div>
          ) : catalog.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-brand-card p-8 text-center">
              <Library size={32} className="mx-auto mb-3 text-white/30" />
              <p className="text-white/60 mb-3">No training courses in your catalog yet</p>
              <Button variant="outline" size="sm" onClick={openLibrary}>
                <Plus size={14} className="mr-1.5" />
                Browse Course Library
              </Button>
            </div>
          ) : (
            catalog.map(course => {
              const assignedCount = assignments.filter(a => a.training_id === course.id).length
              const completedCount = assignments.filter(a => a.training_id === course.id && a.status === 'completed').length
              return (
                <div key={course.id} className="rounded-2xl border border-white/10 bg-brand-card p-5 transition-all hover:border-brand-accent/30">
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen size={18} className="mt-0.5 text-brand-accent" />
                    {course.required_default && <Badge variant="warning">Required</Badge>}
                  </div>
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{course.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                    <span>{course.estimated_minutes} min</span>
                    <span>{completedCount}/{assignedCount} completed</span>
                  </div>
                  {course.learnhouse_course_id && (
                    <button
                      onClick={() => {
                        const uuid = course.learnhouse_course_id!.replace('course_', '')
                        const email = user?.email || ''
                        const firstName = (user?.user_metadata?.first_name as string) || ''
                        const lastName = (user?.user_metadata?.last_name as string) || ''
                        openWithSso(email, firstName, lastName, `/course/${uuid}`)
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
                    >
                      View in LearnHouse <ExternalLink size={10} />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Assignments Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Assignments</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-card overflow-hidden">
          {filteredAssignments.length === 0 ? (
            <div className="p-8 text-center text-white/40">
              <p>No assignments {statusFilter ? `with status "${statusFilter}"` : 'yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/50">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Training</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-sm text-white">
                        {a.employee ? `${a.employee.first_name} ${a.employee.last_name}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-white/70">{a.training?.title || '—'}</td>
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
                      <td className="px-4 py-3 text-sm text-white/50">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onClose={() => setShowAssignDialog(false)} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Training</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAssign} className="space-y-4">
          <Select
            id="training_id"
            label="Training Course"
            value={assignForm.training_id}
            onChange={(e) => setAssignForm(prev => ({ ...prev, training_id: e.target.value }))}
            required
          >
            <option value="">Select a course...</option>
            {catalog.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </Select>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/80">Assign To</label>
            <div className="flex gap-2">
              {(['individual', 'department', 'all'] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAssignForm(prev => ({ ...prev, assign_to: opt }))}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    assignForm.assign_to === opt
                      ? 'bg-brand-accent/20 text-brand-accent'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {opt === 'individual' ? 'Individual' : opt === 'department' ? 'Department' : 'All Employees'}
                </button>
              ))}
            </div>
          </div>

          {assignForm.assign_to === 'individual' && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">Select Employees</label>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-2 space-y-1">
                {employees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-white hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assignForm.employee_ids.includes(emp.id)}
                      onChange={() => toggleEmployeeSelection(emp.id)}
                      className="rounded border-white/20"
                    />
                    {emp.first_name} {emp.last_name}
                    {emp.department && <span className="text-white/40">({emp.department})</span>}
                  </label>
                ))}
              </div>
            </div>
          )}

          {assignForm.assign_to === 'department' && (
            <Select
              id="assign_dept"
              label="Department"
              value={assignForm.department}
              onChange={(e) => setAssignForm(prev => ({ ...prev, department: e.target.value }))}
              required
            >
              <option value="">Select department...</option>
              {departments.map(d => (
                <option key={d} value={d}>{d} ({employees.filter(e => e.department === d).length} employees)</option>
              ))}
            </Select>
          )}

          <Input
            id="due_date"
            type="date"
            label="Due Date"
            value={assignForm.due_date}
            onChange={(e) => setAssignForm(prev => ({ ...prev, due_date: e.target.value }))}
            required
          />

          {assignError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {assignError}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={assignLoading}>
              {assignLoading ? 'Assigning...' : 'Assign Training'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Course Library Dialog */}
      <Dialog open={showLibraryDialog} onClose={() => setShowLibraryDialog(false)} className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Course Library</DialogTitle>
          <p className="text-sm text-white/50 mt-1">
            Browse collections and courses from LearnHouse
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => { setLibraryTab('collections'); setLibrarySearch('') }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              libraryTab === 'collections'
                ? 'bg-brand-accent/20 text-brand-accent'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <FolderOpen size={14} className="inline mr-1.5 -mt-0.5" />
            Collections
          </button>
          <button
            onClick={() => { setLibraryTab('courses'); setLibrarySearch('') }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              libraryTab === 'courses'
                ? 'bg-brand-accent/20 text-brand-accent'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <BookOpen size={14} className="inline mr-1.5 -mt-0.5" />
            Individual Courses
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder={libraryTab === 'collections' ? 'Search collections...' : 'Search courses...'}
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-3">
          {libraryLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-brand-accent mb-3" />
              <p className="text-sm text-white/50">Loading from LearnHouse...</p>
            </div>
          ) : libraryTab === 'collections' ? (
            /* Collections Tab */
            filteredCollections.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                {librarySearch ? 'No collections match your search' : 'No collections available'}
              </div>
            ) : (
              filteredCollections.map(collection => {
                const status = collectionCatalogStatus(collection)
                const isExpanded = expandedCollection === collection.collection_uuid
                const isAdding = addingCollectionId === collection.collection_uuid
                const coursesNotInCatalog = collection.courses.filter(c => !isCourseInCatalog(c.course_uuid)).length
                return (
                  <div key={collection.collection_uuid} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FolderOpen size={16} className="text-brand-accent flex-shrink-0" />
                            <h3 className="font-semibold text-white truncate">{collection.name}</h3>
                            <Badge variant="outline">{collection.courses.length} courses</Badge>
                          </div>
                          <p className="text-xs text-white/50 line-clamp-2">{collection.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-start gap-2">
                          {status === 'all' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                              <Check size={14} /> All Added
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addCollectionToCatalog(collection)}
                              disabled={isAdding}
                            >
                              {isAdding ? (
                                <Loader2 size={14} className="animate-spin mr-1.5" />
                              ) : (
                                <Plus size={14} className="mr-1.5" />
                              )}
                              {isAdding ? 'Adding...' : status === 'some' ? `Add ${coursesNotInCatalog} Remaining` : 'Add All to Catalog'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedCollection(isExpanded ? null : collection.collection_uuid)}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
                      >
                        <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        {isExpanded ? 'Hide courses' : 'View courses'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 space-y-2">
                        {collection.courses.map(course => {
                          const inCatalog = isCourseInCatalog(course.course_uuid)
                          const courseAdding = addingCourseId === course.course_uuid
                          return (
                            <div key={course.course_uuid} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <BookOpen size={12} className="text-white/40 flex-shrink-0" />
                                  <span className="text-sm text-white truncate">{course.name}</span>
                                  <span className="text-xs text-white/30">{estimateMinutesFromAbout(course.about || '')} min</span>
                                </div>
                              </div>
                              {inCatalog ? (
                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                  <Check size={12} /> Added
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => addCourseToCatalog(course)}
                                  disabled={courseAdding}
                                  className="text-xs h-7 px-2"
                                >
                                  {courseAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )
          ) : (
            /* Courses Tab */
            filteredLibraryCourses.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                {librarySearch ? 'No courses match your search' : 'No courses available'}
              </div>
            ) : (
              filteredLibraryCourses.map(course => {
                const alreadyAdded = isCourseInCatalog(course.course_uuid)
                const isAdding = addingCourseId === course.course_uuid
                return (
                  <div
                    key={course.course_uuid}
                    className={`rounded-xl border p-4 transition-all ${
                      alreadyAdded
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-white/10 bg-white/[0.03] hover:border-brand-accent/30'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{course.name}</h3>
                          <Badge variant="outline">{getCategoryFromTags(course.tags || '')}</Badge>
                        </div>
                        <p className="text-xs text-white/50 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                          <span>{estimateMinutesFromAbout(course.about || '')} min</span>
                          {(course.tags || '').split(',').filter(Boolean).slice(0, 3).map(tag => (
                            <span key={tag.trim()} className="rounded-full bg-white/5 px-2 py-0.5">{tag.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-start">
                        {alreadyAdded ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                            <Check size={14} /> In Catalog
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addCourseToCatalog(course)}
                            disabled={isAdding}
                          >
                            {isAdding ? (
                              <Loader2 size={14} className="animate-spin mr-1.5" />
                            ) : (
                              <Plus size={14} className="mr-1.5" />
                            )}
                            {isAdding ? 'Adding...' : 'Add to Catalog'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )
          )}
        </div>

        <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
          <p className="text-xs text-white/40">
            {libraryTab === 'collections'
              ? `${filteredCollections.length} collection${filteredCollections.length !== 1 ? 's' : ''}`
              : `${filteredLibraryCourses.length} course${filteredLibraryCourses.length !== 1 ? 's' : ''}`
            }
          </p>
          <Button variant="outline" onClick={() => setShowLibraryDialog(false)}>
            Done
          </Button>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
