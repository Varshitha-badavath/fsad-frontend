import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout        from '../../layouts/DashboardLayout.jsx'
import StatCard               from '../../components/ui/StatCard.jsx'
import AssignmentCard         from '../../components/AssignmentCard.jsx'
import CreateAssignmentModal  from '../../components/CreateAssignmentModal.jsx'
import SubmissionsModal       from '../../components/SubmissionsModal.jsx'
import Button                 from '../../components/ui/Button.jsx'
import { assignmentAPI, submissionAPI, statsAPI } from '../../utils/api.js'
import toast from 'react-hot-toast'

export default function TeacherDashboard() {
  const { user } = useAuth()

  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats]             = useState({})
  const [showCreate, setShowCreate]   = useState(false)
  const [activeAssignment, setActive] = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [assignRes, statsRes] = await Promise.all([
        assignmentAPI.getAll(),
        statsAPI.teacherStats(),
      ])
      setAssignments(assignRes.assignments || [])
      setStats(statsRes || {})
    } catch (err) {
      toast.error('Failed to load dashboard data.')
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

  const handleCreate = (newAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev])
    setStats((prev) => ({
      ...prev,
      totalAssignments: (prev.totalAssignments || 0) + 1,
      activeAssignments: (prev.activeAssignments || 0) + 1,
    }))
  }

  const handleGrade = (submissionId, grade, feedback) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, grade, feedback, status: 'graded' } : s
      )
    )
  }

  const getSubsForAssignment = (assignmentId) =>
    submissions.filter((s) => s.assignmentId === assignmentId || s.assignment?.id === assignmentId)

  return (
    <DashboardLayout>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="page-title">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening in your classroom today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📝" label="Total Assignments"  value={stats.totalAssignments  || 0} color="#3b82f6" />
        <StatCard icon="📋" label="Total Submissions"  value={stats.totalSubmissions  || 0} color="#8b5cf6" />
        <StatCard icon="⏳" label="Pending Grading"    value={stats.pendingSubmissions || 0} color="#f59e0b" trendUp={false} />
        <StatCard icon="✅" label="Graded"             value={stats.gradedSubmissions  || 0} color="#10b981" trendUp />
      </div>

      {/* Assignments header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">Assignments</h2>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          + Create Assignment
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-slate-400 text-sm">Loading dashboard...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.length === 0 ? (
            <div className="col-span-3 text-center text-slate-400 py-10">
              No assignments yet. Create your first one!
            </div>
          ) : (
            assignments.map((a, i) => (
              <div key={a.id} style={{ animationDelay: `${i * 60}ms` }}>
                <AssignmentCard
                  assignment={a}
                  submissionCount={getSubsForAssignment(a.id).length}
                  onViewSubmissions={handleViewSubmissions}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <CreateAssignmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <SubmissionsModal
        open={!!activeAssignment}
        onClose={() => setActive(null)}
        assignment={activeAssignment}
        submissions={getSubsForAssignment(activeAssignment?.id)}
        onGrade={handleGrade}
      />
    </DashboardLayout>
  )
}
