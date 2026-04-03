import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { authAPI } from '../utils/api.js'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fsad_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  // ── Persist user to localStorage ──────────────────────────────────────────
  const persistUser = useCallback((userData, token) => {
    const safe = { ...userData }
    delete safe.password
    setUser(safe)
    localStorage.setItem('fsad_user', JSON.stringify(safe))
    if (token) localStorage.setItem('fsad_token', token)
  }, [])

  // ── Teacher Login Step 1: password check → OTP sent ──────────────────────
  const teacherLogin = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.teacherLogin({ email, password })
      // Backend returns requireOTP: true → OTP sent to email
      return { success: true, requireOTP: res.requireOTP, email: res.email }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Teacher Login Step 2: verify OTP → get JWT ────────────────────────────
  const verifyOTP = useCallback(async (email, otp) => {
    setLoading(true)
    try {
      const res = await authAPI.verifyOTP({ email, otp })
      persistUser(res.user, res.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Invalid OTP.' }
    } finally {
      setLoading(false)
    }
  }, [persistUser])

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const resendOTP = useCallback(async (email) => {
    try {
      const res = await authAPI.resendOTP({ email })
      return { success: true, message: res.message }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to resend OTP.' }
    }
  }, [])

  // ── Student Login ──────────────────────────────────────────────────────────
  const studentLogin = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.studentLogin({ email, password })
      persistUser(res.user, res.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' }
    } finally {
      setLoading(false)
    }
  }, [persistUser])

  // ── Teacher Signup ─────────────────────────────────────────────────────────
  const teacherSignup = useCallback(async (formData) => {
    setLoading(true)
    try {
      const res = await authAPI.teacherSignup(formData)
      persistUser(res.user, res.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed.' }
    } finally {
      setLoading(false)
    }
  }, [persistUser])

  // ── Student Signup ─────────────────────────────────────────────────────────
  const studentSignup = useCallback(async (formData) => {
    setLoading(true)
    try {
      const res = await authAPI.studentSignup(formData)
      persistUser(res.user, res.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed.' }
    } finally {
      setLoading(false)
    }
  }, [persistUser])

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authAPI.logout() } catch (_) {}
    setUser(null)
    localStorage.removeItem('fsad_user')
    localStorage.removeItem('fsad_token')
    toast.success('Logged out successfully.')
  }, [])

  const value = {
    user,
    loading,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    isAuthenticated: !!user,
    teacherLogin,
    verifyOTP,
    resendOTP,
    studentLogin,
    teacherSignup,
    studentSignup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
