import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout  from '../../layouts/AuthLayout.jsx'
import FormInput   from '../../components/ui/FormInput.jsx'
import SelectInput from '../../components/ui/SelectInput.jsx'
import Button      from '../../components/ui/Button.jsx'
import { validateForm, validators } from '../../utils/helpers.js'

const BRANCHES = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EEE', label: 'Electrical & Electronics' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
]

const SEMESTERS = [
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' },
]

export default function StudentSignup() {
  const { studentSignup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', rollNo: '', branch: '', semester: '', password: '', confirm: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async () => {
    const errs = validateForm(form, {
      name:     [validators.required],
      email:    [validators.required, validators.email],
      rollNo:   [validators.required],
      branch:   [validators.required],
      semester: [validators.required],
      password: [validators.required, validators.minLength(6)],
      confirm:  [validators.required, validators.match(form.password)],
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const { confirm, ...payload } = form
    const res = await studentSignup(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Account created! Welcome to FSAD Portal 🎉')
      navigate('/student/dashboard')
    } else {
      setErrors({ general: res.error })
    }
  }

  return (
    <AuthLayout role="student">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Student Registration</h2>
      <p className="text-sm text-slate-500 mb-7">Create your student account to get started</p>

      {errors.general && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <FormInput
        label="Full Name"
        value={form.name}
        onChange={set('name')}
        placeholder="John Doe"
        error={errors.name}
        required
      />

      <FormInput
        label="Email Address"
        type="email"
        value={form.email}
        onChange={set('email')}
        placeholder="rollno@student.edu"
        error={errors.email}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Roll Number"
          value={form.rollNo}
          onChange={set('rollNo')}
          placeholder="CS2021001"
          error={errors.rollNo}
          required
        />
        <SelectInput
          label="Branch"
          value={form.branch}
          onChange={set('branch')}
          options={BRANCHES}
          placeholder="Branch"
          error={errors.branch}
          required
        />
      </div>

      <SelectInput
        label="Semester"
        value={form.semester}
        onChange={set('semester')}
        options={SEMESTERS}
        placeholder="Select semester"
        error={errors.semester}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={set('password')}
          placeholder="Min 6 chars"
          error={errors.password}
          required
        />
        <FormInput
          label="Confirm"
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          placeholder="Re-enter"
          error={errors.confirm}
          required
        />
      </div>

      <Button
        variant="emerald"
        loading={loading}
        onClick={handleSubmit}
        className="w-full justify-center py-3 text-base mt-1"
      >
        Create Student Account
      </Button>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already registered?{' '}
        <Link to="/student/login" className="text-emerald-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
