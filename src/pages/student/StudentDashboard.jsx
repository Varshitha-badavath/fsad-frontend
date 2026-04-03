import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout       from '../../layouts/DashboardLayout.jsx'
import StatCard              from '../../components/ui/StatCard.jsx'
import Badge                 from '../../components/ui/Badge.jsx'
import Button                from '../../components/ui/Button.jsx'
import SubmitAssignmentModal from '../../components/SubmitAssignmentModal.jsx'
import { assignmentAPI, submissionAPI, statsAPI } from '../../utils/api.js'
import { formatDate, isOverdue, dueDateLabel } from '../../utils/helpers.js'
import { Calendar, Hash, MessageSquare, Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'

const FILTERS = ['all', 'not-submitted', 'submitted', 'graded']

export default function StudentDashboard() {
  const { user } = useAuth()

  const [assignments, setAssignments]   = useState([])
  const [submitTarget, setSubmitTarget] = useState(null)
  const [filter, setFilter]             = useState('all')
  const [stats, setStats]               = useState({})
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [assignRes, statsRes] = await Promise.all([
        assignmentAPI.getMyAssignments(),
        statsAPI.studentStats(),
      ])
      setAssignments(assignRes.assignments || [])
      setStats(statsRes || {})
    } catch (err) {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const getMySubmission = (a) => ({
    status: a.submissionStatus,
    id: a.submissionId,
  })

  const getDisplayStatus = (a) => {
    if (!a.submissionStatus) return isOverdue(a.dueDate) ? 'late' : 'not-submitted'
    return a.submissionStatus
  }

  const filtered = assignments.filter((a) => {
    if (filter === 'all')           return true
    if (filter === 'not-submitted') return !a.submissionStatus
    if (filter === 'submitted')     return !!a.submissionStatus
    if (filter === 'graded')        return a.submissionStatus === 'graded'
    return true
  })

  const handleSubmit = async ({ file, comment }) => {
    try {
      const formData = new FormData()
      formData.append('assignmentId', submitTarget.id)
      formData.append('comment', comment || '')
      formData.append('file', file)
      await submissionAPI.submit(formData)
      toast.success('Assignment submitted successfully! ✅')
      setSubmitTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Failed to submit assignment.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Track your assignments and submission status here.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📚" label="Total Assignments" value={stats.totalAssignments || 0} color="#3b82f6" />
        <StatCard icon="📤" label="Submitted"         value={stats.submitted        || 0} color="#8b5cf6" />
        <StatCard icon="✅" label="Graded"            value={stats.graded           || 0} color="#10b981" trendUp />
        <StatCard icon="⏰" label="Pending"           value={stats.pending          || 0} color="#f59e0b" />
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all
              ${filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
            {f.replace('-', ' ')}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">
          {filtered.length} assignment{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-slate-400 text-sm">Loading assignments...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a, i) => {
            const overdue  = isOverdue(a.dueDate) && !a.submissionStatus
            const dueLabel = dueDateLabel(a.dueDate)
            const status   = getDisplayStatus(a)

            return (
              <div key={a.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 p-5 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 tracking-wide">{a.subject}</span>
                      <Badge status={status} showDot />
                      {overdue && <Badge status="late" />}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{a.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">{a.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={12} />Due: {formatDate(a.dueDate)}</span>
                      <span className="flex items-center gap-1"><Hash size={12} />{a.totalMarks} marks</span>
                    </div>
                    <div className={`mt-3 text-xs font-medium px-2.5 py-1 rounded-lg w-fit
                      ${overdue ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                      {dueLabel}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    {!a.submissionStatus ? (
                      <Button variant="emerald" onClick={() => setSubmitTarget(a)}>
                        📤 Submit
                      </Button>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 font-medium capitalize">{a.submissionStatus}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <SubmitAssignmentModal
        open={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        assignment={submitTarget}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  )
}
