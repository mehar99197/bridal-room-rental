import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function RoomList() {
  const [rooms, setRooms] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const url = status ? `/rooms/?status=${status}` : '/rooms/'
    api.get(url).then(({ data }) => setRooms(data.results || data || []))
  }, [status])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-accent font-[Playfair_Display]">🏠 Bridal Rooms</h1>
        <select
          className="input-field w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, i) => (
          <div key={room.id} className={`animate-fade-in-up glass-card overflow-hidden stagger-${Math.min(i + 1, 8)}`}>
            {room.image ? (
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-5xl">🏠</div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{room.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  room.status === 'available' ? 'bg-green-500/20 text-green-300' :
                  room.status === 'booked' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-gray-500/20 text-gray-400'
                }`}>{room.status}</span>
              </div>
              <p className="text-[#c8a8c8] text-sm mb-2">👥 Capacity: {room.capacity} guests</p>
              <p className="text-[#c8a8c8] text-sm mb-3">📍 {room.location}</p>
              <p className="text-sm text-[#c8a8c8] mb-4 line-clamp-2">{room.description?.substring(0, 100)}...</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-accent">${room.price_per_hour}<span className="text-sm text-[#c8a8c8]">/hr</span></span>
                <Link to={`/rooms/${room.id}`} className="btn-primary text-sm">View & Book</Link>
              </div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && (
          <p className="col-span-full text-center text-[#c8a8c8] py-12">No rooms found.</p>
        )}
      </div>
    </div>
  )
}
