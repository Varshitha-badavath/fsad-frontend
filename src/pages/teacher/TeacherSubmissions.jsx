import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Badge    from '../../components/ui/Badge.jsx'
import Button   from '../../components/ui/Button.jsx'
import Modal    from '../../components/ui/Modal.jsx'
import FormInput from '../../components/ui/FormInput.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import toast from 'react-hot-toast'
import { submissionAPI } from '../../utils/api.js'
import { Paperclip, Search } from 'lucide-react'

const FILTERS = ['all', 'pending', 'graded', 'late']

export default function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [grading, setGrading] = useState(null)
  const [gradeVal, setGV]     = useState('')
  const [feedback, setFB]     = useState('')
  const [gradeErr, setGE]     = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchAllSubmissions()
  }, [])

  const fetchAllSubmissions = async () => {
    try {
      setFetching(true)
      const res = await submissionAPI.getMySubmissions()
      setSubmissions(res.submissions || [])
    } catch (err) {
      toast.error('Failed to load submissions.')
    } finally {
      setFetching(false)
    }
  }

  const getAssignment = (sub) => sub.assignment || sub.assignmentId

  const filtered = submissions.filter((s) => {
    const matchF = filter === 'all' || s.status === filter
    const matchS = !search ||
      s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const openGrade = (sub) => {
    setGrading(sub)
    setGV(sub.grade !== null ? String(sub.grade) : '')
    setFB(sub.feedback || '')
    setGE('')
  }

  const submitGrade = async () => {
    const totalMarks = grading.assignment?.totalMarks || grading.totalMarks || 100
    const g = Number(gradeVal)
    if (!gradeVal || isNaN(g)) { setGE('Enter a valid number'); return }
    if (g < 0 || g > totalMarks) { setGE(`Must be 0–${totalMarks}`); return }
    setGE('')
    setLoading(true)
    try {
      await submissionAPI.grade(grading.id, { grade: g, feedback })
      setSubmissions((p) =>
        p.map((s) => s.id === grading.id ? { ...s, grade: g, feedback, status: 'graded' } : s)
      )
      toast.success(`Grade submitted for ${grading.studentName}`)
      setGrading(null)
    } catch (err) {
      toast.error('Failed to submit grade.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-7">
        <h1 className="page-title">All Submissions</h1>
        <p className="text-slate-500 mt-1">Review and grade student submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all
                ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        {fetching ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-slate-400 text-sm">Loading submissions...</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="📋" title="No submissions found" message="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr>
                  <th className="table-head">Student</th>
                  <th className="table-head">Roll No.</th>
                  <th className="table-head">Assignment</th>
                  <th className="table-head">Submitted</th>
                  <th className="table-head">File</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Grade</th>
                  <th className="table-head">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const a = sub.assignment || {}
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="table-cell font-semibold text-slate-800">{sub.studentName}</td>
                      <td className="table-cell text-slate-400 text-xs">{sub.rollNo}</td>
                      <td className="table-cell text-slate-600 max-w-[180px] truncate">{a?.title}</td>
                      <td className="table-cell text-slate-400 text-xs whitespace-nowrap">{sub.submittedAt}</td>
                      <td className="table-cell">
                        <span className="flex items-center gap-1 text-blue-500 text-xs cursor-pointer hover:underline">
                          <Paperclip size={11} />{sub.fileName}
                        </span>
                      </td>
                      <td className="table-cell"><Badge status={sub.status} /></td>
                      <td className="table-cell font-bold">
                        {sub.grade !== null
                          ? <span className="text-emerald-600">{sub.grade}/{a?.totalMarks}</span>
                          : <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="table-cell">
                        <Button size="sm" variant={sub.grade !== null ? 'success' : 'outline'} onClick={() => openGrade(sub)}>
                          {sub.grade !== null ? 'Update' : 'Grade'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!grading} onClose={() => setGrading(null)}
        title={`Grade — ${grading?.studentName}`}
        subtitle={grading?.assignment?.title} size="sm">
        <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-1">
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Paperclip size={11} /> {grading?.fileName}
          </div>
          {grading?.comment && (
            <p className="text-xs text-slate-500 italic">"{grading.comment}"</p>
          )}
        </div>
        <FormInput
          label={`Grade (out of ${grading?.assignment?.totalMarks || 100})`}
          type="number" value={gradeVal}
          onChange={(e) => { setGV(e.target.value); setGE('') }}
          error={gradeErr} required
        />
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">Feedback</label>
          <textarea value={feedback} onChange={(e) => setFB(e.target.value)}
            rows={3} placeholder="Write feedback..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
              placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
        <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={() => setGrading(null)}>Cancel</Button>
          <Button variant="success" loading={loading} onClick={submitGrade}>✓ Submit Grade</Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
