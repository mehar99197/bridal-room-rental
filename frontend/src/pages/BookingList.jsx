import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function BookingList() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = () => {
    api.get('/bookings/')
      .then(({ data }) => setBookings(data.results || data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBookings() }, [])

  const act = async (id, action, confirmText) => {
    if (!window.confirm(confirmText)) return
    try {
      await api.post(`/bookings/${id}/${action}/`)
      loadBookings()
    } catch {
      window.alert(`Failed to ${action} booking.`)
    }
  }

  const isAdmin = user?.is_staff

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="animate-fade-in-up mb-8">
        <p className="eyebrow">{isAdmin ? 'Atelier management' : 'Your account'}</p>
        <h1 className="heading text-4xl mt-1">{isAdmin ? 'All Reservations' : 'My Reservations'}</h1>
        <p className="text-muted mt-2 text-sm">
          {isAdmin ? 'Review and approve incoming requests.' : 'Pending requests await confirmation from our atelier.'}
        </p>
      </div>

      {loading ? (
        <div className="min-h-[30vh] grid place-items-center"><div className="spinner" /></div>
      ) : (
        <div className="card animate-fade-in-up overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-line">
                  {isAdmin && <th className="py-4 px-5 font-medium">Guest</th>}
                  <th className="py-4 px-5 font-medium">Item</th>
                  <th className="py-4 px-4 font-medium">Type</th>
                  <th className="py-4 px-4 font-medium">Dates</th>
                  <th className="py-4 px-4 font-medium">Status</th>
                  <th className="py-4 px-4 font-medium text-right">Total</th>
                  <th className="py-4 px-5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id} className={`border-b border-line/60 last:border-0 hover:bg-gold-light/10 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                    {isAdmin && <td className="py-4 px-5 text-muted">{b.user_email}</td>}
                    <td className="py-4 px-5 heading">{b.room_name || b.dress_name || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gold-light/30 text-gold-dark">
                        {b.room ? 'Suite' : 'Dress'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted whitespace-nowrap">
                      {new Date(b.start_date).toLocaleDateString()} – {new Date(b.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4"><span className={`badge badge-${b.status}`}>{b.status === 'pending' ? 'Pending' : b.status}</span></td>
                    <td className="py-4 px-4 text-right heading text-gold-dark">${b.total_price}</td>
                    <td className="py-4 px-5">
                      <div className="flex justify-center gap-2">
                        {!isAdmin && ['pending', 'confirmed'].includes(b.status) && (
                          <button onClick={() => act(b.id, 'cancel', 'Cancel this reservation?')}
                            className="text-xs px-3 py-1.5 rounded-full bg-wine/8 text-wine hover:bg-wine/15 transition-colors">Cancel</button>
                        )}
                        {isAdmin && b.status === 'pending' && (
                          <>
                            <button onClick={() => act(b.id, 'approve', 'Approve this reservation?')}
                              className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Approve</button>
                            <button onClick={() => act(b.id, 'reject', 'Reject this reservation?')}
                              className="text-xs px-3 py-1.5 rounded-full bg-wine/8 text-wine hover:bg-wine/15 transition-colors">Reject</button>
                          </>
                        )}
                        {((isAdmin && b.status !== 'pending') || (!isAdmin && !['pending', 'confirmed'].includes(b.status))) && (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="text-center py-14 text-muted">
                      No reservations yet. <Link to="/rooms" className="text-gold-dark hover:underline">Browse suites</Link> or <Link to="/dresses" className="text-gold-dark hover:underline">gowns</Link>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
