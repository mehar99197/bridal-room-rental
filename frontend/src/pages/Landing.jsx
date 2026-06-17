import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Landing() {
  const [rooms, setRooms] = useState([])
  const [dresses, setDresses] = useState([])

  useEffect(() => {
    api.get('/rooms/?status=available')
      .then(({ data }) => setRooms((data.results || data || []).slice(0, 3)))
      .catch(() => {})
    api.get('/dresses/?status=available')
      .then(({ data }) => setDresses((data.results || data || []).slice(0, 4)))
      .catch(() => {})
  }, [])

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative">
        <div className="absolute top-16 right-[8%] w-40 h-40 rounded-full bg-blush/30 blur-2xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 left-[6%] w-52 h-52 rounded-full bg-gold-light/30 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-5 pt-24 pb-20 text-center relative">
          <p className="eyebrow animate-fade-in-up">Where forever begins</p>
          <h1 className="heading text-5xl md:text-7xl font-bold mt-3 leading-[1.05] animate-fade-in-up stagger-1">
            Your Dream Wedding,<br /><span className="gold-text">Beautifully Arranged</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto animate-fade-in-up stagger-2">
            Reserve breathtaking bridal suites and rent designer wedding gowns from our
            curated atelier — every detail composed for your most cherished day.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4 animate-fade-in-up stagger-3">
            <Link to="/rooms" className="btn btn-primary text-base px-8! py-3.5!">Explore Suites</Link>
            <Link to="/dresses" className="btn btn-outline text-base px-8! py-3.5!">View Dresses</Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-fade-in-up stagger-4">
            {[['250+', 'Happy Brides'], ['40+', 'Designer Gowns'], ['15', 'Luxury Suites']].map(([n, l]) => (
              <div key={l}>
                <div className="heading text-3xl gold-text">{n}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured suites ──────────────────── */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <span className="divider text-sm uppercase tracking-[0.2em]">Featured</span>
          <h2 className="heading text-4xl mt-3">Bridal Suites</h2>
          <p className="text-muted mt-2">Elegant spaces to prepare for your walk down the aisle</p>
        </div>

        {rooms.length === 0 ? (
          <p className="text-center text-muted py-8">New suites are being prepared. Please check back soon.</p>
        ) : (
          <div className="grid gap-7 md:grid-cols-3">
            {rooms.map((room, i) => (
              <Link to={`/rooms/${room.id}`} key={room.id} className={`card card-hover overflow-hidden animate-fade-in-up stagger-${i + 1} group`}>
                <div className="h-52 overflow-hidden">
                  {room.image ? (
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full img-placeholder grid place-items-center heading text-5xl text-gold/60">Suite</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="heading text-xl mb-1.5">{room.name}</h3>
                  <p className="text-sm text-muted">Up to {room.capacity} guests · {room.location}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="heading text-2xl text-gold-dark">${room.price_per_hour}<span className="text-sm text-muted font-sans"> /hr</span></span>
                    <span className="text-sm text-gold-dark group-hover:translate-x-1 transition-transform">Reserve →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured dresses ─────────────────── */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <span className="divider text-sm uppercase tracking-[0.2em]">The Collection</span>
          <h2 className="heading text-4xl mt-3">Designer Gowns</h2>
          <p className="text-muted mt-2">Handpicked dresses to rent for your special moment</p>
        </div>

        {dresses.length === 0 ? (
          <p className="text-center text-muted py-8">The collection is being curated. Please check back soon.</p>
        ) : (
          <div className="grid gap-7 grid-cols-2 lg:grid-cols-4">
            {dresses.map((d, i) => (
              <Link to={`/dresses/${d.id}`} key={d.id} className={`card card-hover overflow-hidden animate-fade-in-up stagger-${i + 1} group`}>
                <div className="h-56 overflow-hidden">
                  {d.image ? (
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full img-placeholder grid place-items-center heading text-4xl text-gold/60">Gown</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="heading text-lg leading-tight mb-1">{d.name}</h3>
                  <p className="text-xs text-muted">Size {d.size} · {d.color}</p>
                  <div className="mt-3 heading text-xl text-gold-dark">${d.rental_price_per_day}<span className="text-xs text-muted font-sans"> /day</span></div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/dresses" className="btn btn-outline">View Full Collection</Link>
        </div>
      </section>

      {/* ── Why us ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <span className="divider text-sm uppercase tracking-[0.2em]">The Maison Promise</span>
          <h2 className="heading text-4xl mt-3">Why Brides Choose Us</h2>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {[
            { t: 'Curated Luxury', d: 'Every suite and gown is hand-selected for timeless elegance and impeccable quality.', i: 'M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6L12 2z' },
            { t: 'Effortless Booking', d: 'Request your dates online and receive personal confirmation from our atelier team.', i: 'M5 12l5 5L20 7' },
            { t: 'Personal Care', d: 'Dedicated styling support and fittings so everything is flawless on the day.', i: 'M12 21s-7-4.3-9.3-8.4C1 9.5 2.4 6 5.8 6c2 0 3.3 1.2 4.2 2.4C10.9 7.2 12.2 6 14.2 6c3.4 0 4.8 3.5 3.1 6.6C19 16.7 12 21 12 21z' },
          ].map((f, i) => (
            <div key={f.t} className={`card p-8 text-center animate-fade-in-up stagger-${i + 1}`}>
              <div className="w-14 h-14 mx-auto rounded-full bg-gold-light/40 grid place-items-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8884e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.i} />
                </svg>
              </div>
              <h3 className="heading text-xl mb-2">{f.t}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-8">
        <div className="rounded-3xl px-8 py-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(120deg, #3a322b, #5a4a38)' }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gold/20 blur-3xl" />
          <p className="eyebrow text-gold-light!">Begin your story</p>
          <h2 className="heading text-3xl md:text-4xl text-ivory mt-2 mb-5">Ready to plan the perfect day?</h2>
          <p className="text-gold-light/80 max-w-xl mx-auto mb-8">
            Create an account to reserve suites, rent gowns, and manage everything in one elegant place.
          </p>
          <Link to="/register" className="btn btn-primary text-base px-9! py-3.5!">Create Your Account</Link>
        </div>
      </section>
    </div>
  )
}
