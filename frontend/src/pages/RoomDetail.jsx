import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const nowLocalStr = () => {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function RoomDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [form, setForm] = useState(() => ({ start_date: nowLocalStr(), end_date: '', notes: '' }))
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/rooms/${id}/`).then(({ data }) => setRoom(data)).catch(() => setRoom(false))
  }, [id])

  const estimate = useMemo(() => {
    if (!room || !form.start_date || !form.end_date) return null
    const hours = (new Date(form.end_date) - new Date(form.start_date)) / 3.6e6
    if (!(hours > 0)) return null
    const billed = Math.max(1, hours)
    return { hours: billed, total: (Number(room.price_per_hour) * billed).toFixed(2) }
  }, [room, form.start_date, form.end_date])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setMsg(null)
    setSubmitting(true)
    try {
      await api.post('/bookings/', {
        room: parseInt(id),
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        notes: form.notes,
      })
      setMsg({ ok: true, text: 'Reservation request sent! Our atelier will confirm shortly.' })
      setForm({ start_date: '', end_date: '', notes: '' })
    } catch (err) {
      setMsg({ ok: false, text: Object.values(err.response?.data || {}).flat().join(' ') || 'Reservation failed.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (room === false) return <p className="text-center py-24 text-muted">Suite not found.</p>
  if (!room) return <div className="min-h-[60vh] grid place-items-center"><div className="spinner" /></div>

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <Link to="/rooms" className="text-sm text-gold-dark hover:underline inline-block mb-5">← Back to Suites</Link>
      <div className="grid lg:grid-cols-2 gap-10 animate-fade-in-up">
        <div>
          <div className="rounded-2xl overflow-hidden card p-0!">
            {room.image ? (
              <img src={room.image} alt={room.name} className="w-full object-cover" />
            ) : (
              <div className="w-full aspect-4/3 img-placeholder grid place-items-center heading text-6xl text-gold/60">Suite</div>
            )}
          </div>
        </div>

        <div>
          <span className={`badge badge-${room.status} mb-3`}>{room.status}</span>
          <h1 className="heading text-4xl mb-3">{room.name}</h1>
          <p className="text-muted leading-relaxed mb-6">{room.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Capacity</p>
              <p className="heading text-lg">{room.capacity} guests</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Location</p>
              <p className="heading text-lg">{room.location}</p>
            </div>
            {room.room_number && (
              <div className="card p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Suite No.</p>
                <p className="heading text-lg">{room.room_number}</p>
              </div>
            )}
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Rate</p>
              <p className="heading text-lg text-gold-dark">${room.price_per_hour}/hr</p>
            </div>
          </div>

          {room.amenities && (
            <div className="mb-6">
              <p className="label">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.split(',').map((a, idx) => a.trim() && (
                  <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gold-light/30 text-gold-dark">{a.trim()}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="heading text-2xl mb-4">Reserve This Suite</h2>

            {msg && (
              <div className={`mb-4 rounded-xl px-4 py-3 text-sm border ${msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-wine/8 border-wine/20 text-wine'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start</label>
                  <div className="input-field bg-gold-light/20 text-ink/70 cursor-default select-none">
                    {new Date(form.start_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    <span className="ml-2 text-xs text-gold-dark font-medium">(Today)</span>
                  </div>
                </div>
                <div>
                  <label className="label">End</label>
                  <input type="datetime-local" className="input-field" value={form.end_date}
                    min={form.start_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Notes <span className="text-muted normal-case font-normal">(optional)</span></label>
                <textarea className="input-field" rows="2" placeholder="Any special requests?" value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              {estimate && (
                <div className="flex items-center justify-between rounded-xl bg-gold-light/25 px-4 py-3">
                  <span className="text-sm text-ink/70">Estimated total · {estimate.hours.toFixed(1)} hrs</span>
                  <span className="heading text-xl text-gold-dark">${estimate.total}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3!">
                {submitting ? 'Sending…' : user ? 'Request Reservation' : 'Sign in to Reserve'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
