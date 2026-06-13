import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="animate-slide-down bg-[rgba(15,10,26,0.95)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.12)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold font-[Playfair_Display] text-accent">
          <span className="text-2xl">💎</span> Bridal Rental
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/rooms" className="text-[#c8a8c8] hover:text-accent transition-colors">Rooms</Link>
          <Link to="/dresses" className="text-[#c8a8c8] hover:text-accent transition-colors">Dresses</Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-[#f5e6f5] hover:text-accent transition-colors">
                <span>👤</span> {user.email}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-[#1a0f2e] border border-[rgba(212,175,55,0.15)] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                <Link to="/dashboard" className="block px-4 py-2 text-[#c8a8c8] hover:text-accent hover:bg-[rgba(212,175,55,0.06)]">Dashboard</Link>
                <Link to="/bookings" className="block px-4 py-2 text-[#c8a8c8] hover:text-accent hover:bg-[rgba(212,175,55,0.06)]">My Bookings</Link>
                {user.is_staff && (
                  <a href="/admin" className="block px-4 py-2 text-[#d4af37] hover:text-accent hover:bg-[rgba(212,175,55,0.06)]">🛡️ Admin Panel</a>
                )}
                <hr className="my-1 border-[rgba(212,175,55,0.1)]" />
                <button onClick={logout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-[rgba(255,0,0,0.06)]">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-[#c8a8c8] hover:text-accent transition-colors">Login</Link>
              <Link to="/register" className="btn-accent text-sm px-5 py-2">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
