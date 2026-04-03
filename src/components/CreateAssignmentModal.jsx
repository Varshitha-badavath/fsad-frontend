import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal       from './ui/Modal.jsx'
import FormInput   from './ui/FormInput.jsx'
import SelectInput from './ui/SelectInput.jsx'
import Button      from './ui/Button.jsx'
import { validateForm, validators } from '../utils/helpers.js'
import { assignmentAPI } from '../utils/api.js'

const SUBJECTS = [
  { code: 'CS101', name: 'Data Structures' },
  { code: 'CS102', name: 'Algorithms' },
  { code: 'CS103', name: 'Operating Systems' },
  { code: 'CS104', name: 'Database Management' },
  { code: 'CS105', name: 'Computer Networks' },
  { code: 'CS106', name: 'Software Engineering' },
  { code: 'CS107', name: 'Web Technologies' },
  { code: 'CS108', name: 'Machine Learning' },
  { code: 'MATH101', name: 'Mathematics' },
  { code: 'PHY101', name: 'Physics' },
]

export default function CreateAssignmentModal({ open, onClose, onCreate }) {
  const initial = {
    title: '', description: '', subject: '', totalMarks: '', dueDate: '',
  }
  const [form, setForm]     = useState(initial)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleCreate = async () => {
    const errs = validateForm(form, {
      title:       [validators.required],
      subject:     [validators.required],
      totalMarks:  [validators.required, validators.numeric, validators.range(1, 1000)],
      dueDate:     [validators.required],
    })
    if (!form.description.trim()) errs.description = 'Description is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const response = await assignmentAPI.create({
        title:       form.title,
        description: form.description,
        subject:     form.subject,
        totalMarks:  Number(form.totalMarks),
        dueDate:     form.dueDate,
      })

      const newAssignment = response.assignment
      onCreate(newAssignment)
      toast.success('Assignment created successfully!')
      setForm(initial)
      onClose()
    } catch (err) {
      toast.error(err?.message || 'Failed to create assignment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const subjectOptions = SUBJECTS.map((s) => ({ value: s.code, label: `${s.code} — ${s.name}` }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Assignment"
      subtitle="Fill in the details below to publish a new assignment"
      size="md"
    >
      <FormInput
        label="Assignment Title"
        value={form.title}
        onChange={set('title')}
        placeholder="e.g., Data Structures: AVL Trees Implementation"
        error={errors.title}
        required
      />

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={4}
          placeholder="Describe the assignment requirements, deliverables, and evaluation criteria..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 text-slate-800
            placeholder:text-slate-400 outline-none resize-y transition-all duration-200
            focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400
            ${errors.description ? 'border-red-300' : 'border-slate-200'}`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      <SelectInput
        label="Subject"
        value={form.subject}
        onChange={set('subject')}
        options={subjectOptions}
        placeholder="Select subject"
        error={errors.subject}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Total Marks"
          type="number"
          value={form.totalMarks}
          onChange={set('totalMarks')}
          placeholder="100"
          error={errors.totalMarks}
          required
        />
        <FormInput
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={set('dueDate')}
          error={errors.dueDate}
          required
        />
      </div>

      <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" loading={loading} onClick={handleCreate}>
          ✓ Publish Assignment
        </Button>
      </div>
    </Modal>
  )
}
