import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Monogram() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="28" r="13" stroke="url(#g)" strokeWidth="2" />
      <path d="M24 6l3.2 6.2L34 13l-4.8 4.2L30.4 24 24 20.6 17.6 24l1.2-6.8L14 13l6.8-0.8L24 6z" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d9bd83" />
          <stop offset="1" stopColor="#a8884e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navLink = ({ isActive }) =>
    `relative text-sm tracking-wide transition-colors ${
      isActive ? 'text-gold-dark' : 'text-ink/70 hover:text-gold-dark'
    }`

  return (
    <nav className="glass-nav animate-slide-down sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Monogram />
          <span className="leading-tight">
            <span className="block heading text-xl font-semibold gold-text">Maison Belle</span>
            <span className="block text-[0.62rem] tracking-[0.32em] uppercase text-muted">Bridal Atelier</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/rooms" className={navLink}>Suites</NavLink>
          <NavLink to="/dresses" className={navLink}>Dresses</NavLink>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-ink hover:text-gold-dark transition-colors">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className={`grid place-items-center w-8 h-8 rounded-full font-semibold uppercase ${user.is_staff ? 'bg-wine/12 text-wine' : 'bg-gold-light/50 text-gold-dark'}`}>
                    {(user.username || user.email || '?').charAt(0)}
                  </span>
                )}
                <span className="max-w-[140px] truncate">{user.username || user.email}</span>
                {user.is_staff && (
                  <span className="text-[0.6rem] tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">Admin</span>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-56 card rounded-xl! shadow-xl opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 py-2 overflow-hidden">
                {user.is_staff ? (
                  <Link to="/admin-panel" className="block px-4 py-2.5 text-sm text-wine font-medium hover:bg-gold-light/20">Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-ink/80 hover:text-gold-dark hover:bg-gold-light/20">Dashboard</Link>
                    <Link to="/bookings" className="block px-4 py-2.5 text-sm text-ink/80 hover:text-gold-dark hover:bg-gold-light/20">My Reservations</Link>
                  </>
                )}
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-ink/80 hover:text-gold-dark hover:bg-gold-light/20">Edit Profile</Link>
                <div className="my-1 border-t border-line" />
                <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-wine hover:bg-wine/5">Sign out</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/login" className={navLink}>Sign in</NavLink>
              <Link to="/register" className="btn btn-primary py-2! px-5! text-sm">Join us</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-gold-light/30 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-ink transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden animate-slide-down border-t border-line bg-ivory/95 backdrop-blur-xl px-5 py-4 space-y-1">
          <Link to="/rooms" onClick={() => setOpen(false)} className="block py-2.5 text-ink/80">Suites</Link>
          <Link to="/dresses" onClick={() => setOpen(false)} className="block py-2.5 text-ink/80">Dresses</Link>
          {user ? (
            <>
              {user.is_staff ? (
                <Link to="/admin-panel" onClick={() => setOpen(false)} className="block py-2.5 text-wine font-medium">Admin Panel</Link>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-2.5 text-ink/80">Dashboard</Link>
                  <Link to="/bookings" onClick={() => setOpen(false)} className="block py-2.5 text-ink/80">My Reservations</Link>
                </>
              )}
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-2.5 text-ink/80">Edit Profile</Link>
              <button onClick={logout} className="block w-full text-left py-2.5 text-wine">Sign out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline flex-1">Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1">Join us</Link>
            </div>
          )}
          {/* close on route change marker */}
          <span hidden>{location.pathname}</span>
        </div>
      )}
    </nav>
  )
}
