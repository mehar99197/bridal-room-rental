import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Landing() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    api.get('/rooms/?status=available').then(({ data }) => {
      setRooms((data.results || data || []).slice(0, 3))
    })
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-24 text-center relative">
          <div className="animate-fade-in-up">
            <div className="text-6xl mb-6">💎</div>
            <h1 className="text-5xl md:text-7xl font-bold font-[Playfair_Display] text-accent mb-4 leading-tight">
              Your Dream Wedding<br />Starts Here
            </h1>
            <p className="text-xl text-[#c8a8c8] mb-8 max-w-2xl mx-auto">
              Elegant bridal rooms & stunning wedding dresses for your perfect day.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/rooms" className="btn-accent text-lg px-8 py-3">Browse Rooms</Link>
              <Link to="/dresses" className="btn-primary text-lg px-8 py-3">Browse Dresses</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-accent font-[Playfair_Display] mb-2">Available Now</h2>
          <p className="text-[#c8a8c8]">Rooms ready to book for your special day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <div key={room.id} className={`animate-fade-in-up glass-card overflow-hidden stagger-${i + 1}`}>
              {room.image ? (
                <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-5xl">🏠</div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{room.name}</h3>
                <p className="text-[#c8a8c8] text-sm mb-1">👥 Up to {room.capacity} guests</p>
                <p className="text-[#c8a8c8] text-sm mb-3">📍 {room.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-accent">${room.price_per_hour}<span className="text-sm text-[#c8a8c8]">/hr</span></span>
                  <Link to={`/rooms/${room.id}`} className="btn-primary text-sm">Book Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">🏰</div>
            <h3 className="text-lg font-bold mb-2">Luxury Rooms</h3>
            <p className="text-[#c8a8c8] text-sm">Beautifully decorated bridal suites for your wedding day preparations.</p>
          </div>
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">👰</div>
            <h3 className="text-lg font-bold mb-2">Designer Dresses</h3>
            <p className="text-[#c8a8c8] text-sm">Exquisite bridal gowns from top designers for rent.</p>
          </div>
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-bold mb-2">Easy Booking</h3>
            <p className="text-[#c8a8c8] text-sm">Simple request & approval system for hassle-free reservations.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
