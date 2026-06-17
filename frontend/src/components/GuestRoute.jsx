import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Public-only routes (login / register). If already authenticated, bounce the
// user to their own home so the auth forms never render behind a logged-in nav.
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="spinner" />
      </div>
    )
  }
  if (user) return <Navigate to={user.is_staff ? '/admin-panel' : '/dashboard'} replace />
  return children
}
