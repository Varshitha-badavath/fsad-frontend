import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Badge       from '../../components/ui/Badge.jsx'
import EmptyState  from '../../components/ui/EmptyState.jsx'
import { useNavigate } from 'react-router-dom'
import { submissionAPI } from '../../utils/api.js'
import { Paperclip, MessageSquare, TrendingUp } from 'lucide-react'

export default function StudentSubmissions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mySubs, setMySubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    submissionAPI.getMySubmissions()
      .then((res) => setMySubs(res.submissions || []))
      .catch(() => setMySubs([]))
      .finally(() => setLoading(false))
  }, [])

  const totalMarks  = mySubs.reduce((acc, s) => {
    return s.grade !== null ? acc + (s.assignment?.totalMarks || 0) : acc
  }, 0)

  const earnedMarks = mySubs.reduce((acc, s) => acc + (s.grade || 0), 0)

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64 text-slate-400">Loading submissions...</div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-7">
        <h1 className="page-title">My Submissions</h1>
        <p className="text-slate-500 mt-1">Review all your submitted assignments and grades</p>
      </div>

      {/* Summary strip */}
      {mySubs.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-7">
          {[
            { label: 'Submitted', value: mySubs.length, color: 'text-blue-600' },
            { label: 'Graded', value: mySubs.filter((s) => s.status === 'graded').length, color: 'text-emerald-600' },
            { label: 'Avg Score', value: totalMarks > 0 ? `${Math.round((earnedMarks / totalMarks) * 100)}%` : '—', color: 'text-violet-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Submission cards */}
      {mySubs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
          <EmptyState
            icon="📭"
            title="No submissions yet"
            message="You haven't submitted any assignments. Go submit your first one!"
            actionLabel="View Assignments"
            onAction={() => navigate('/student/assignments')}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mySubs.map((sub, i) => {
            const a = sub.assignment
            const scorePercent = a && sub.grade !== null
              ? Math.round((sub.grade / a.totalMarks) * 100)
              : null

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-blue-600 tracking-wide">{a?.subject}</span>
                      <Badge status={sub.status} showDot />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-2">{a?.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 text-blue-500 cursor-pointer hover:underline">
                        <Paperclip size={11} />{sub.fileName}
                      </span>
                      <span>Submitted: {sub.submittedAt}</span>
                    </div>

                    {sub.comment && (
                      <p className="text-xs text-slate-500 italic mb-2">Your note: "{sub.comment}"</p>
                    )}

                    {sub.feedback && (
                      <div className="flex items-start gap-2 bg-emerald-50 border-l-4 border-emerald-400 px-3 py-2 rounded-r-xl mt-2">
                        <MessageSquare size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700 italic">{sub.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    {sub.grade !== null ? (
                      <div>
                        <div className="text-3xl font-bold text-emerald-600">
                          {sub.grade}
                          <span className="text-base text-slate-400 font-normal">/{a?.totalMarks}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-500 sm:justify-end mt-0.5">
                          <TrendingUp size={11} />
                          {scorePercent}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 font-medium">Awaiting grade</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
