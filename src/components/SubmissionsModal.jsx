import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal     from './ui/Modal.jsx'
import Badge     from './ui/Badge.jsx'
import Button    from './ui/Button.jsx'
import FormInput from './ui/FormInput.jsx'
import EmptyState from './ui/EmptyState.jsx'
import { Paperclip } from 'lucide-react'
import { submissionAPI } from '../utils/api.js'

export default function SubmissionsModal({ open, onClose, assignment, submissions, onGrade }) {
  const [grading, setGrading]       = useState(null)
  const [gradeVal, setGradeVal]     = useState('')
  const [feedback, setFeedback]     = useState('')
  const [gradeLoading, setGL]       = useState(false)
  const [gradeError, setGradeError] = useState('')

  const openGrade = (sub) => {
    setGrading(sub)
    setGradeVal(sub.grade !== null ? String(sub.grade) : '')
    setFeedback(sub.feedback || '')
    setGradeError('')
  }

  const submitGrade = async () => {
    const g = Number(gradeVal)
    if (!gradeVal || isNaN(g)) { setGradeError('Enter a valid numeric grade'); return }
    if (g < 0 || g > assignment.totalMarks) {
      setGradeError(`Grade must be between 0 and ${assignment.totalMarks}`)
      return
    }
    setGradeError('')
    setGL(true)
    try {
      await submissionAPI.grade(grading.id, { grade: g, feedback })
      onGrade(grading.id, g, feedback)
      toast.success(`Grade submitted for ${grading.studentName} ✅`)
      setGrading(null)
    } catch (err) {
      toast.error(err?.message || 'Failed to submit grade.')
    } finally {
      setGL(false)
    }
  }

  return (
    <>
      <Modal
        open={open && !grading}
        onClose={onClose}
        title={`Submissions — ${assignment?.title}`}
        subtitle={`${submissions.length} submission${submissions.length !== 1 ? 's' : ''} received`}
        size="lg"
      >
        {submissions.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No submissions yet"
            message="Students haven't submitted this assignment yet."
          />
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="bg-slate-50 rounded-xl">
                  <th className="table-head rounded-tl-xl">Student</th>
                  <th className="table-head">Roll No.</th>
                  <th className="table-head">Submitted</th>
                  <th className="table-head">File</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Grade</th>
                  <th className="table-head rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-cell font-semibold text-slate-800">{sub.studentName}</td>
                    <td className="table-cell text-slate-500 text-xs">{sub.rollNo}</td>
                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{sub.submittedAt}</td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1 text-blue-600 text-xs cursor-pointer hover:underline">
                        <Paperclip size={11} />
                        {sub.fileName}
                      </span>
                    </td>
                    <td className="table-cell"><Badge status={sub.status} /></td>
                    <td className="table-cell font-bold">
                      {sub.grade !== null
                        ? <span className="text-emerald-600">{sub.grade}/{assignment?.totalMarks}</span>
                        : <span className="text-slate-300">—</span>
                      }
                    </td>
                    <td className="table-cell">
                      <Button
                        variant={sub.grade !== null ? 'success' : 'outline'}
                        size="sm"
                        onClick={() => openGrade(sub)}
                      >
                        {sub.grade !== null ? 'Update' : 'Grade'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        open={!!grading}
        onClose={() => setGrading(null)}
        title={`Grade — ${grading?.studentName}`}
        subtitle={grading?.rollNo}
        size="sm"
      >
        <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-1">
          <div className="text-xs text-slate-500">
            Assignment: <span className="font-semibold text-slate-700">{assignment?.title}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Paperclip size={11} />
            {grading?.fileName}
          </div>
          {grading?.comment && (
            <div className="text-xs text-slate-500 italic mt-1">
              Student note: "{grading.comment}"
            </div>
          )}
        </div>

        <FormInput
          label={`Grade (out of ${assignment?.totalMarks})`}
          type="number"
          value={gradeVal}
          onChange={(e) => { setGradeVal(e.target.value); setGradeError('') }}
          placeholder={`0 – ${assignment?.totalMarks}`}
          error={gradeError}
          required
        />

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
            Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Write feedback for the student..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
              placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={() => setGrading(null)}>Cancel</Button>
          <Button variant="success" loading={gradeLoading} onClick={submitGrade}>
            ✓ Submit Grade
          </Button>
        </div>
      </Modal>
    </>
  )
}
