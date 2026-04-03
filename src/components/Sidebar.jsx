import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  LayoutDashboard, FileText, ClipboardList, User,
  GraduationCap, BookOpen, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'

// ─── Nav Items ────────────────────────────────────────────────────────────────
const TEACHER_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/teacher/dashboard' },
  { icon: FileText,        label: 'Assignments',  path: '/teacher/assignments' },
  { icon: ClipboardList,   label: 'Submissions',  path: '/teacher/submissions' },
  { icon: User,            label: 'Profile',      path: '/teacher/profile' },
]

const STUDENT_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/student/dashboard' },
  { icon: BookOpen,        label: 'Assignments',     path: '/student/assignments' },
  { icon: ClipboardList,   label: 'My Submissions',  path: '/student/submissions' },
  { icon: User,            label: 'Profile',         path: '/student/profile' },
]

/**
 * Sidebar — fixed left navigation
 *
 * @prop {boolean}  collapsed
 * @prop {function} onToggle
 */
export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, isTeacher } = useAuth()
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  const navItems   = isTeacher ? TEACHER_NAV : STUDENT_NAV
  const accent     = isTeacher ? 'text-blue-600 bg-blue-50 border-blue-500' : 'text-emerald-600 bg-emerald-50 border-emerald-500'
  const iconGrad   = isTeacher ? 'from-blue-500 to-blue-700' : 'from-emerald-500 to-emerald-600'

  const handleLogout = () => {
    logout()
    navigate(isTeacher ? '/teacher/login' : '/student/login')
  }

  return (
    <aside
      className="flex flex-col h-screen bg-white border-r border-slate-100 transition-all duration-300 shrink-0"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 overflow-hidden">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGrad} flex items-center justify-center shrink-0 shadow-sm`}>
          {isTeacher
            ? <GraduationCap size={18} className="text-white" />
            : <BookOpen size={18} className="text-white" />
          }
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-slate-800 truncate">FSAD Portal</div>
            <div className="text-xs text-slate-400 capitalize">{user?.role} Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 border-l-[3px] text-left
                ${active
                  ? `${accent} font-semibold`
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-slate-100 space-y-1">
        {/* User info */}
        {!collapsed && (
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 mb-1">
            <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500
            hover:bg-slate-50 hover:text-slate-700 transition-all duration-150
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={18} className="shrink-0" />
            : <><ChevronLeft size={18} className="shrink-0" /><span>Collapse</span></>
          }
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500
            hover:bg-red-50 transition-all duration-150 font-medium
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
