import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import FormInput  from '../../components/ui/FormInput.jsx'
import Button     from '../../components/ui/Button.jsx'
import CaptchaBox from '../../components/ui/CaptchaBox.jsx'
import { validateForm, validators } from '../../utils/helpers.js'

export default function StudentLogin() {
  const { studentLogin, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) navigate(`/${user.role}/dashboard`, { replace: true })

  const [form, setForm]           = useState({ email: '', password: '' })
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [captchaOk, setCaptchaOk] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async () => {
    if (!captchaOk) { toast.error('Please complete the CAPTCHA first.'); return }

    const errs = validateForm(form, {
      email:    [validators.required, validators.email],
      password: [validators.required],
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    const res = await studentLogin(form.email, form.password)
    setLoading(false)

    if (res.success) {
      toast.success('Welcome back! 📚')
      navigate('/student/dashboard')
    } else {
      setErrors({ general: res.error })
    }
  }

  return (
    <AuthLayout role="student">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Student Login</h2>
      <p className="text-sm text-slate-500 mb-7">
        Sign in to view and submit your assignments
      </p>

      {errors.general && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <FormInput label="Email Address" type="email" value={form.email}
        onChange={set('email')} placeholder="rollno@student.edu"
        error={errors.email} required
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <FormInput label="Password" type="password" value={form.password}
        onChange={set('password')} placeholder="Enter your password"
        error={errors.password} required
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      {/* CAPTCHA */}
      <CaptchaBox onValidChange={setCaptchaOk} />

      <Button variant="emerald" loading={loading}
        onClick={handleSubmit} className="w-full justify-center py-3 text-base">
        Sign In as Student
      </Button>

      <p className="text-center text-sm text-slate-500 mt-5">
        Don't have an account?{' '}
        <Link to="/student/signup" className="text-emerald-600 font-semibold hover:underline">Sign Up</Link>
      </p>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <Link to="/teacher/login" className="text-xs text-slate-400 hover:text-slate-600">
          Are you a teacher? Log in here →
        </Link>
      </div>
    </AuthLayout>
  )
}
