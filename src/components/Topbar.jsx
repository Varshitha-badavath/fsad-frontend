import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getInitials } from '../utils/helpers.js'

// Map paths → page titles
const PAGE_TITLES = {
  '/teacher/dashboard':   'Dashboard',
  '/teacher/assignments': 'Assignments',
  '/teacher/submissions': 'All Submissions',
  '/teacher/profile':     'My Profile',
  '/student/dashboard':   'Dashboard',
  '/student/assignments': 'Assignments',
  '/student/submissions': 'My Submissions',
  '/student/profile':     'My Profile',
}

/**
 * Topbar — sticky top navigation bar for dashboard layout
 *
 * @prop {function} onMenuClick  - triggers sidebar collapse toggle (mobile)
 */
export default function Topbar({ onMenuClick }) {
  const { user, isTeacher } = useAuth()
  const { pathname } = useLocation()
  const pageTitle = PAGE_TITLES[pathname] || 'Page'
  const accentBg  = isTeacher ? 'bg-blue-600' : 'bg-emerald-600'

  return (
    <header className="h-[60px] bg-white border-b border-slate-100 flex items-center px-5 gap-4 sticky top-0 z-40">

      {/* Hamburger (mobile / toggle) */}
      <button
        onClick={onMenuClick}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb / Page title */}
      <div className="flex-1">
        <h2 className="text-base font-bold text-slate-800">{pageTitle}</h2>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell (placeholder) */}
        <button className="relative p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none`}
          title={user?.name}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  )
}
