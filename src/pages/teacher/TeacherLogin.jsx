import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import FormInput  from '../../components/ui/FormInput.jsx'
import Button     from '../../components/ui/Button.jsx'
import CaptchaBox from '../../components/ui/CaptchaBox.jsx'
import { validateForm, validators } from '../../utils/helpers.js'

// ── OTP Step ───────────────────────────────────────────────────────────────────
function OTPStep({ email, onSuccess, onBack }) {
  const { verifyOTP, resendOTP, loading } = useAuth()
  const [otp, setOtp]             = useState(['', '', '', '', '', ''])
  const [timer, setTimer]         = useState(300)
  const [resending, setResending] = useState(false)
  const inputRefs                 = useRef([])

  // Countdown timer
  useState(() => {
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(id)
  })

  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (p.length === 6) { setOtp(p.split('')); inputRefs.current[5]?.focus() }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) return toast.error('Enter the 6-digit OTP.')
    const res = await verifyOTP(email, code)
    if (res.success) {
      toast.success('Welcome back, Professor! 🎓')
      onSuccess()
    } else {
      toast.error(res.error)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    setResending(true)
    const res = await resendOTP(email)
    setResending(false)
    if (res.success) {
      toast.success('New OTP sent! 📧')
      setTimer(300)
      setOtp(['', '', '', '', '', ''])
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">🔐</div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">OTP Verification</h2>
      <p className="text-sm text-slate-500 mb-1 text-center">A 6-digit code was sent to</p>
      <p className="text-center font-semibold text-indigo-600 mb-6 text-sm">{email}</p>

      <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
        {otp.map((d, i) => (
          <input key={i} ref={(el) => (inputRefs.current[i] = el)}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-12 text-center text-xl font-bold border-2 rounded-xl
              focus:outline-none focus:border-indigo-500 border-slate-200 py-2"
          />
        ))}
      </div>

      <p className="text-center text-sm mb-4">
        {timer > 0
          ? <>Expires in <span className={`font-bold ${timer < 60 ? 'text-red-500' : 'text-indigo-600'}`}>{fmt(timer)}</span></>
          : <span className="text-red-500 font-semibold">OTP expired!</span>
        }
      </p>

      <Button variant="primary" loading={loading}
        onClick={handleVerify} className="w-full justify-center py-3 text-base mb-3">
        Verify OTP
      </Button>

      <div className="text-center mb-2">
        <button onClick={handleResend} disabled={resending || timer > 240}
          className="text-sm text-indigo-600 hover:underline disabled:text-slate-400">
          {resending ? 'Sending...' : 'Resend OTP'}
        </button>
        {timer > 240 && (
          <p className="text-xs text-slate-400 mt-1">Resend available after {fmt(timer - 240)}</p>
        )}
      </div>

      <div className="text-center">
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600">
          ← Back to Login
        </button>
      </div>
    </div>
  )
}

// ── Main Teacher Login ─────────────────────────────────────────────────────────
export default function TeacherLogin() {
  const { teacherLogin, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) navigate(`/${user.role}/dashboard`, { replace: true })

  const [form, setForm]           = useState({ email: '', password: '' })
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [captchaOk, setCaptchaOk] = useState(false)
  const [otpEmail, setOtpEmail]   = useState(null)

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

    const res = await teacherLogin(form.email, form.password)
    setLoading(false)

    if (res.success && res.requireOTP) {
      toast.success('OTP sent to your email! 📧')
      setOtpEmail(res.email)
    } else if (!res.success) {
      setErrors({ general: res.error })
    }
  }

  if (otpEmail) {
    return (
      <AuthLayout role="teacher">
        <OTPStep
          email={otpEmail}
          onSuccess={() => navigate('/teacher/dashboard')}
          onBack={() => setOtpEmail(null)}
        />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout role="teacher">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Teacher Login</h2>
      <p className="text-sm text-slate-500 mb-7">
        Sign in to manage assignments and grade your students
      </p>

      {errors.general && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      <FormInput label="Email Address" type="email" value={form.email}
        onChange={set('email')} placeholder="professor@university.edu"
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

      <Button variant="primary" loading={loading}
        onClick={handleSubmit} className="w-full justify-center py-3 text-base">
        Sign In as Teacher
      </Button>

      <p className="text-center text-sm text-slate-500 mt-5">
        Don't have an account?{' '}
        <Link to="/teacher/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
      </p>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <Link to="/student/login" className="text-xs text-slate-400 hover:text-slate-600">
          Are you a student? Log in here →
        </Link>
      </div>
    </AuthLayout>
  )
}
