import { useState, useEffect } from 'react'
import DashboardLayout       from '../../layouts/DashboardLayout.jsx'
import AssignmentCard        from '../../components/AssignmentCard.jsx'
import CreateAssignmentModal from '../../components/CreateAssignmentModal.jsx'
import SubmissionsModal      from '../../components/SubmissionsModal.jsx'
import Button                from '../../components/ui/Button.jsx'
import EmptyState            from '../../components/ui/EmptyState.jsx'
import { assignmentAPI, submissionAPI } from '../../utils/api.js'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'

const FILTERS = ['all', 'active', 'graded']

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [showCreate, setShowCreate]   = useState(false)
  const [activeAssignment, setActive] = useState(null)
  const [filter, setFilter]           = useState('all')
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const res = await assignmentAPI.getAll()
      setAssignments(res.assignments || [])
    } catch (err) {
      toast.error('Failed to load assignments.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await submissionAPI.getByAssignment(assignmentId)
      setSubmissions(res.submissions || [])
    } catch (err) {
      toast.error('Failed to load submissions.')
    }
  }

  const handleViewSubmissions = async (assignment) => {
    setActive(assignment)
    await fetchSubmissions(assignment.id)
  }

  const handleCreate = (a) => {
    setAssignments((prev) => [a, ...prev])
  }

  const handleGrade = (id, grade, feedback) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade, feedback, status: 'graded' } : s))
    )
  }

  const filtered = assignments.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const getSubsFor = (id) => submissions.filter((s) =>
    (s.assignmentId === id || s.assignment?.id === id)
  )

  return (
    <DashboardLayout>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <h1 className="page-title">Assignments</h1>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          + Create Assignment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all
                ${filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-slate-400 text-sm">Loading assignments...</div>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-4">
            Showing {filtered.length} assignment{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100">
              <EmptyState
                icon="📝"
                title="No assignments found"
                message="Try changing your search or filter."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((a, i) => (
                <div key={a.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <AssignmentCard
                    assignment={a}
                    submissionCount={getSubsFor(a.id).length}
                    onViewSubmissions={handleViewSubmissions}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <CreateAssignmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <SubmissionsModal
        open={!!activeAssignment}
        onClose={() => setActive(null)}
        assignment={activeAssignment}
        submissions={getSubsFor(activeAssignment?.id)}
        onGrade={handleGrade}
      />
    </DashboardLayout>
  )
}
