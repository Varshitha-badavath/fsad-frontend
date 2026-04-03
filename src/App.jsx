import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

// Auth Pages
import TeacherLogin    from './pages/teacher/TeacherLogin.jsx'
import TeacherSignup   from './pages/teacher/TeacherSignup.jsx'
import StudentLogin    from './pages/student/StudentLogin.jsx'
import StudentSignup   from './pages/student/StudentSignup.jsx'

// Teacher Pages
import TeacherDashboard   from './pages/teacher/TeacherDashboard.jsx'
import TeacherAssignments from './pages/teacher/TeacherAssignments.jsx'
import TeacherSubmissions from './pages/teacher/TeacherSubmissions.jsx'
import TeacherProfile     from './pages/teacher/TeacherProfile.jsx'

// Student Pages
import StudentDashboard   from './pages/student/StudentDashboard.jsx'
import StudentAssignments from './pages/student/StudentAssignments.jsx'
import StudentSubmissions from './pages/student/StudentSubmissions.jsx'
import StudentProfile     from './pages/student/StudentProfile.jsx'

// Other
import Home     from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Home />} />

        {/* Teacher auth */}
        <Route path="/teacher/login"  element={<TeacherLogin />} />
        <Route path="/teacher/signup" element={<TeacherSignup />} />

        {/* Student auth */}
        <Route path="/student/login"  element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />

        {/* Teacher protected routes */}
        <Route element={<ProtectedRoute allowedRole="teacher" />}>
          <Route path="/teacher/dashboard"   element={<TeacherDashboard />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/submissions" element={<TeacherSubmissions />} />
          <Route path="/teacher/profile"     element={<TeacherProfile />} />
        </Route>

        {/* Student protected routes */}
        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/student/dashboard"   element={<StudentDashboard />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/submissions" element={<StudentSubmissions />} />
          <Route path="/student/profile"     element={<StudentProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
