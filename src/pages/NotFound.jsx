import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  const navigate      = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const handleHome = () => {
    if (isAuthenticated) navigate(`/${user.role}/dashboard`)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-auth flex items-center justify-center p-6">
      <div className="text-center animate-fade-up">
        <div className="text-8xl mb-6 select-none">🔍</div>
        <h1 className="font-display text-7xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="font-display text-2xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary" onClick={handleHome} size="lg">
          ← Go Back Home
        </Button>
      </div>
    </div>
  )
}
