import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout   from '../../layouts/AuthLayout.jsx'
import FormInput    from '../../components/ui/FormInput.jsx'
import SelectInput  from '../../components/ui/SelectInput.jsx'
import Button       from '../../components/ui/Button.jsx'
import { validateForm, validators } from '../../utils/helpers.js'

const DEPARTMENTS = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
]

export default function TeacherSignup() {
  const { teacherSignup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', department: '', password: '', confirm: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async () => {
    const errs = validateForm(form, {
      name:       [validators.required],
      email:      [validators.required, validators.email],
      department: [validators.required],
      password:   [validators.required, validators.minLength(6)],
      confirm:    [validators.required, validators.match(form.password)],
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const { confirm, ...payload } = form
    const res = await teacherSignup(payload)
    setLoading(false)

    if (res.success) {
      toast.success('Account created! Welcome aboard 🎓')
      navigate('/teacher/dashboard')
    } else {
      setErrors({ general: res.error })
    }
  }

  return (
    <AuthLayout role="teacher">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
      <p className="text-sm text-slate-500 mb-7">Register as a faculty member</p>

      {errors.general && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <FormInput
        label="Full Name"
        value={form.name}
        onChange={set('name')}
        placeholder="Dr. John Smith"
        error={errors.name}
        required
      />

      <FormInput
        label="Email Address"
        type="email"
        value={form.email}
        onChange={set('email')}
        placeholder="professor@university.edu"
        error={errors.email}
        required
      />

      <SelectInput
        label="Department"
        value={form.department}
        onChange={set('department')}
        options={DEPARTMENTS}
        placeholder="Select your department"
        error={errors.department}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={set('password')}
          placeholder="Min 6 characters"
          error={errors.password}
          required
        />
        <FormInput
          label="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          placeholder="Re-enter password"
          error={errors.confirm}
          required
        />
      </div>

      <Button
        variant="primary"
        loading={loading}
        onClick={handleSubmit}
        className="w-full justify-center py-3 text-base mt-2"
      >
        Create Teacher Account
      </Button>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{' '}
        <Link to="/teacher/login" className="text-blue-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
