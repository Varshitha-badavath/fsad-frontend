import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Topbar  from '../components/Topbar.jsx'

/**
 * DashboardLayout — shared shell for teacher & student dashboards
 *
 * @prop {ReactNode} children - page content
 */
export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <Topbar onMenuClick={() => setCollapsed(!collapsed)} />

        {/* Page content with scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
