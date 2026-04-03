import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${user.role}/dashboard`, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #93c5fd, transparent 70%)' }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7f3d0, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
        rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }} />

      <div className="relative z-10 w-full max-w-4xl text-center animate-fade-up">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700
            flex items-center justify-center text-3xl shadow-xl shadow-blue-200">
            🏛
          </div>
        </div>

        {/* Title */}
        <p className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase mb-3">
          FSAD-PS25
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4">
          Online Assignment<br />
          <span className="text-gradient-blue">Submission & Grading</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed">
          A comprehensive academic platform for managing assignments,
          submissions, and grading — built for modern universities.
        </p>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

          {/* Teacher card */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 p-7 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700
              flex items-center justify-center mb-4 shadow-md shadow-blue-200">
              <GraduationCap size={22} className="text-white" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-1">I'm a Teacher</h2>
            <p className="text-sm text-slate-500 mb-5">
              Create assignments, review submissions, and grade your students.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/teacher/login"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600
                  text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Login as Teacher
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/teacher/signup"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-blue-200
                  text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Account
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Student card */}
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 p-7 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600
              flex items-center justify-center mb-4 shadow-md shadow-emerald-200">
              <BookOpen size={22} className="text-white" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-1">I'm a Student</h2>
            <p className="text-sm text-slate-500 mb-5">
              View your assignments, submit your work, and track your grades.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/student/login"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600
                  text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Login as Student
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/student/signup"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-emerald-200
                  text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors"
              >
                Create Account
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-slate-400">
          © 2025 FSAD-PS25 · Full Stack Application Development Project
        </p>
      </div>
    </div>
  )
}
