import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Staff-only routes. Unauthenticated users go to login; signed-in non-staff
// users are sent back to their own dashboard.
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="spinner" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!user.is_staff) return <Navigate to="/dashboard" replace />
  return children
}
