import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function BookingList() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  const loadBookings = () => {
    api.get('/bookings/').then(({ data }) => setBookings(data.results || data || []))
  }

  useEffect(() => { loadBookings() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.post(`/bookings/${id}/cancel/`)
      loadBookings()
    } catch { alert('Failed to cancel') }
  }

  const handleApprove = async (id) => {
    if (!confirm('Approve this booking?')) return
    try {
      await api.post(`/bookings/${id}/approve/`)
      loadBookings()
    } catch { alert('Failed to approve') }
  }

  const handleReject = async (id) => {
    if (!confirm('Reject this booking?')) return
    try {
      await api.post(`/bookings/${id}/reject/`)
      loadBookings()
    } catch { alert('Failed to reject') }
  }

  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    confirmed: 'bg-green-500/20 text-green-300',
    active: 'bg-blue-500/20 text-blue-300',
    completed: 'bg-gray-500/20 text-gray-400',
    cancelled: 'bg-red-500/20 text-red-300',
  }

  const isAdmin = user?.is_staff

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up mb-6">
        <h1 className="text-3xl font-bold text-accent font-[Playfair_Display] mb-2">📋 Bookings</h1>
        <p className="text-[#c8a8c8] text-sm">Pending requests wait for admin approval</p>
      </div>

      <div className="animate-fade-in-up stagger-1 glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[rgba(139,58,139,0.15)] text-[#f0d68a] uppercase tracking-wider text-xs">
                {isAdmin && <th className="text-left py-4 px-4">User</th>}
                <th className="text-left py-4 px-4">Item</th>
                <th className="text-left py-4 px-4">Type</th>
                <th className="text-left py-4 px-4">Dates</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-right py-4 px-4">Price</th>
                <th className="text-center py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className={`border-t border-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.04)] transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                  {isAdmin && <td className="py-4 px-4 text-[#c8a8c8]">{b.user_email}</td>}
                  <td className="py-4 px-4 font-medium">{b.room_name || b.dress_name || 'N/A'}</td>
                  <td className="py-4 px-4">
                    {b.room ? <span className="text-blue-300">🏠 Room</span> : <span className="text-yellow-300">👗 Dress</span>}
                  </td>
                  <td className="py-4 px-4 text-[#c8a8c8]">
                    {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                      {b.status === 'pending' ? 'Pending Approval' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">${b.total_price}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      {!isAdmin && ['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => handleCancel(b.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
                          Cancel
                        </button>
                      )}
                      {isAdmin && b.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(b.id)} className="px-3 py-1.5 text-xs rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(b.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {isAdmin && b.status !== 'pending' && <span className="text-[#c8a8c8] text-xs">-</span>}
                      {!isAdmin && !['pending', 'confirmed'].includes(b.status) && <span className="text-[#c8a8c8] text-xs">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-[#c8a8c8]">
                    No bookings yet. <Link to="/rooms" className="text-accent hover:underline">Browse rooms</Link> or <Link to="/dresses" className="text-accent hover:underline">dresses</Link>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
