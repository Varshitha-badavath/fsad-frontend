import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal      from './ui/Modal.jsx'
import FileUpload from './ui/FileUpload.jsx'
import Button     from './ui/Button.jsx'
import { formatDate } from '../utils/helpers.js'

/**
 * SubmitAssignmentModal — student submits a file + comment
 *
 * @prop {boolean}  open
 * @prop {function} onClose
 * @prop {object}   assignment
 * @prop {function} onSubmit   - receives { file, comment }
 */
export default function SubmitAssignmentModal({ open, onClose, assignment, onSubmit }) {
  const [file, setFile]       = useState(null)
  const [comment, setComment] = useState('')
  const [fileError, setFE]    = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!file) { setFE('Please select a file to submit'); return }
    setFE('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    onSubmit({ file, comment })
    toast.success('Assignment submitted successfully! 🎉')
    setFile(null)
    setComment('')
    setLoading(false)
    onClose()
  }

  const handleClose = () => {
    setFile(null)
    setComment('')
    setFE('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Submit Assignment"
      subtitle={assignment?.title}
      size="md"
    >
      {/* Assignment info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 space-y-0.5">
        <div className="text-xs font-bold text-blue-700">{assignment?.subject}</div>
        <div className="text-xs text-blue-600">
          Due: <strong>{formatDate(assignment?.dueDate)}</strong>
          &nbsp;·&nbsp;Total Marks: <strong>{assignment?.totalMarks}</strong>
        </div>
      </div>

      {/* File upload */}
      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase">
        Upload File <span className="text-red-500">*</span>
      </label>
      <FileUpload
        file={file}
        onChange={(f) => { setFile(f); setFE('') }}
        error={fileError}
      />

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
          Note for Teacher <span className="text-slate-400 font-normal normal-case">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Any clarifications or notes you'd like to add..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
            placeholder:text-slate-400 outline-none resize-none
            focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
        />
      </div>

      <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
        <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button variant="emerald" loading={loading} onClick={handleSubmit}>
          📤 Submit Assignment
        </Button>
      </div>
    </Modal>
  )
}
