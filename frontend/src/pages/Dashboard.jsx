import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ rooms: 0, dresses: 0 })
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/rooms/'),
      api.get('/dresses/'),
      api.get('/bookings/'),
    ]).then(([rooms, dresses, bk]) => {
      setStats({
        rooms: rooms.data.count ?? rooms.data.length ?? 0,
        dresses: dresses.data.count ?? dresses.data.length ?? 0,
      })
      setBookings(bk.data.results || bk.data || [])
    }).catch(() => {})
  }, [])

  const activeCount = bookings.filter((b) => ['pending', 'confirmed', 'active'].includes(b.status)).length

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="animate-fade-in-up mb-8">
        <p className="eyebrow">Your atelier</p>
        <h1 className="heading text-4xl mt-1">Welcome back, {user?.username || 'friend'}</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 mb-10">
        {[
          { label: 'Available Suites', value: stats.rooms, to: '/rooms' },
          { label: 'Designer Gowns', value: stats.dresses, to: '/dresses' },
          { label: 'Active Reservations', value: activeCount, to: '/bookings' },
        ].map((s, i) => (
          <Link to={s.to} key={s.label} className={`card card-hover p-6 animate-fade-in-up stagger-${i + 1}`}>
            <div className="heading text-4xl gold-text">{s.value}</div>
            <p className="text-sm text-muted mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="card animate-fade-in-up stagger-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="heading text-xl">Recent Reservations</h2>
          <Link to="/bookings" className="text-sm text-gold-dark hover:underline">View all →</Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center text-muted py-12 px-6">
            No reservations yet. <Link to="/rooms" className="text-gold-dark hover:underline">Browse suites</Link> or <Link to="/dresses" className="text-gold-dark hover:underline">gowns</Link>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-line">
                  <th className="py-3 px-6 font-medium">Item</th>
                  <th className="py-3 px-4 font-medium">Dates</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-line/60 last:border-0 hover:bg-gold-light/10 transition-colors">
                    <td className="py-3.5 px-6 heading">{b.room_name || b.dress_name || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-muted">
                      {new Date(b.start_date).toLocaleDateString()} – {new Date(b.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4"><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td className="py-3.5 px-6 text-right heading text-gold-dark">${b.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
