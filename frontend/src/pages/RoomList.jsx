import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function RoomList() {
  const [rooms, setRooms] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const url = status ? `/rooms/?status=${status}` : '/rooms/'
    api.get(url)
      .then(({ data }) => active && setRooms(data.results || data || []))
      .catch(() => active && setRooms([]))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [status])

  const changeStatus = (val) => {
    setStatus(val)
    setLoading(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="divider text-sm uppercase tracking-[0.2em]">Reserve your space</span>
        <h1 className="heading text-4xl md:text-5xl mt-3">Bridal Suites</h1>
        <p className="text-muted mt-2">Elegant rooms styled for getting-ready moments</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex flex-wrap gap-2 p-1.5 rounded-full bg-ivory border border-line">
          {[['', 'All'], ['available', 'Available'], ['booked', 'Booked'], ['maintenance', 'Maintenance']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => changeStatus(val)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                status === val ? 'bg-gold text-ivory shadow' : 'text-ink/70 hover:text-gold-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[30vh] grid place-items-center"><div className="spinner" /></div>
      ) : rooms.length === 0 ? (
        <p className="text-center text-muted py-16">No suites match this filter.</p>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <Link to={`/rooms/${room.id}`} key={room.id} className={`card card-hover overflow-hidden group animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
              <div className="h-52 overflow-hidden relative">
                {room.image ? (
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full img-placeholder grid place-items-center heading text-5xl text-gold/60">Suite</div>
                )}
                <span className={`badge badge-${room.status} absolute top-3 right-3 backdrop-blur`}>{room.status}</span>
              </div>
              <div className="p-6">
                <h3 className="heading text-xl mb-1">{room.name}</h3>
                <p className="text-sm text-muted">{room.capacity} guests · {room.location}</p>
                <p className="text-sm text-muted mt-2 line-clamp-2">{room.description}</p>
                <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                  <span className="heading text-2xl text-gold-dark">${room.price_per_hour}<span className="text-sm text-muted font-sans"> /hr</span></span>
                  <span className="btn btn-outline py-2! px-4! text-sm">View &amp; Reserve</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
