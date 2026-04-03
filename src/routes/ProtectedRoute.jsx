import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Wraps a group of routes that require authentication and a specific role.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute allowedRole="teacher" />}>
 *     <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
 *   </Route>
 */
export default function ProtectedRoute({ allowedRole }) {
  const { user, isAuthenticated } = useAuth()

  // Not logged in → send to role-specific login
  if (!isAuthenticated) {
    return <Navigate to={`/${allowedRole}/login`} replace />
  }

  // Wrong role → send to their own dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  // Authorized → render child routes
  return <Outlet />
}
