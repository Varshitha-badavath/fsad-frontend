/**
 * AuthLayout — wraps all login/signup pages
 *
 * @prop {string}    role     - 'teacher' | 'student'
 * @prop {ReactNode} children - form content
 */
export default function AuthLayout({ children, role = 'teacher' }) {
  const isTeacher = role === 'teacher'

  const iconGradient = isTeacher
    ? 'from-blue-500 to-blue-700'
    : 'from-emerald-500 to-emerald-600'

  const iconShadow = isTeacher
    ? 'shadow-blue-200'
    : 'shadow-emerald-200'

  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #bfdbfe, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a7f3d0, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c7d2fe, transparent 70%)' }}
      />

      {/* Card wrapper */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">

        {/* Brand header */}
        <div className="text-center mb-7">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} shadow-lg ${iconShadow}
              flex items-center justify-center text-3xl mx-auto mb-3`}
          >
            {isTeacher ? '🎓' : '📚'}
          </div>
          <span className="block text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-0.5">
            FSAD University Portal
          </span>
          <span className="block text-xs text-slate-400">
            Online Assignment &amp; Grading System
          </span>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-modal border border-slate-100 px-8 py-8">
          {children}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-5">
          © 2025 FSAD-PS25 · For academic use only
        </p>
      </div>
    </div>
  )
}
