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
      user && api.get('/bookings/'),
    ]).then(([rooms, dresses, bookings]) => {
      setStats({
        rooms: rooms.data.count || rooms.data.length || 0,
        dresses: dresses.data.count || dresses.data.length || 0,
      })
      if (bookings) setBookings(bookings.data.results || bookings.data || [])
    })
  }, [user])

  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    confirmed: 'bg-green-500/20 text-green-300',
    active: 'bg-blue-500/20 text-blue-300',
    completed: 'bg-gray-500/20 text-gray-400',
    cancelled: 'bg-red-500/20 text-red-300',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-accent font-[Playfair_Display] animate-fade-in-up mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="animate-fade-in-up stagger-1 glass-card p-6 text-center">
          <div className="text-4xl mb-2">👤</div>
          <div className="text-xl font-bold">{user?.username || 'User'}</div>
          <p className="text-[#c8a8c8] text-sm">Welcome back!</p>
        </div>
        <div className="animate-fade-in-up stagger-2 glass-card p-6 text-center">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-xl font-bold">{stats.rooms}</div>
          <p className="text-[#c8a8c8] text-sm">Available Rooms</p>
        </div>
        <div className="animate-fade-in-up stagger-3 glass-card p-6 text-center">
          <div className="text-4xl mb-2">👗</div>
          <div className="text-xl font-bold">{stats.dresses}</div>
          <p className="text-[#c8a8c8] text-sm">Available Dresses</p>
        </div>
      </div>

      <div className="animate-fade-in-up stagger-4 glass-card">
        <div className="p-5 border-b border-[rgba(212,175,55,0.1)] flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link to="/bookings" className="text-sm text-accent hover:underline">View All</Link>
        </div>
        <div className="p-5">
          {bookings.length === 0 ? (
            <p className="text-[#c8a8c8] text-center py-4">
              No bookings yet. <Link to="/rooms" className="text-accent hover:underline">Browse rooms</Link> or <Link to="/dresses" className="text-accent hover:underline">dresses</Link>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#c8a8c8] border-b border-[rgba(212,175,55,0.1)]">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-left py-3 px-2">Dates</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="border-b border-[rgba(212,175,55,0.05)] hover:bg-[rgba(212,175,55,0.04)] transition-colors">
                      <td className="py-3 px-2">{b.room_name || b.dress_name || 'N/A'}</td>
                      <td className="py-3 px-2 text-[#c8a8c8]">
                        {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">${b.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
