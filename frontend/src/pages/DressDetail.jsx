import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function DressDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dress, setDress] = useState(null)
  const [form, setForm] = useState(() => ({ start_date: new Date().toLocaleDateString('en-CA'), end_date: '', notes: '' }))
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/dresses/${id}/`)
      .then(({ data }) => setDress(data))
      .catch(() => setDress(false))
  }, [id])

  const estimate = useMemo(() => {
    if (!dress || !form.start_date || !form.end_date) return null
    const days = (new Date(form.end_date) - new Date(form.start_date)) / 8.64e7
    if (!(days >= 0)) return null
    const billed = Math.max(1, days)
    const total = Number(dress.rental_price_per_day) * billed + Number(dress.deposit_amount)
    return { days: billed, total: total.toFixed(2) }
  }, [dress, form.start_date, form.end_date])

  const handleRent = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setMsg(null)
    setSubmitting(true)
    try {
      await api.post('/bookings/', {
        dress: parseInt(id),
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        notes: form.notes,
      })
      setMsg({ ok: true, text: 'Rental request sent! Our atelier will confirm shortly.' })
    } catch (err) {
      setMsg({ ok: false, text: Object.values(err.response?.data || {}).flat().join(' ') || 'Rental failed.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (dress === false) return <p className="text-center py-24 text-muted">Dress not found.</p>
  if (!dress) return <div className="min-h-[60vh] grid place-items-center"><div className="spinner" /></div>

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <Link to="/dresses" className="text-sm text-gold-dark hover:underline inline-block mb-5">← Back to Collection</Link>
      <div className="grid lg:grid-cols-2 gap-10 animate-fade-in-up">
        <div>
          <div className="rounded-2xl overflow-hidden card p-0!">
            {dress.image ? (
              <img src={dress.image} alt={dress.name} className="w-full object-cover" />
            ) : (
              <div className="w-full aspect-3/4 img-placeholder grid place-items-center heading text-6xl text-gold/60">Gown</div>
            )}
          </div>
        </div>

        <div>
          <span className={`badge badge-${dress.status} mb-3`}>{dress.status}</span>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-dark mb-1">{dress.category_name || 'Bridal'}</p>
          <h1 className="heading text-4xl mb-3">{dress.name}</h1>
          <p className="text-muted leading-relaxed mb-6">{dress.description}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Size</p>
              <p className="heading text-lg">{dress.size}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Color</p>
              <p className="heading text-lg">{dress.color}</p>
            </div>
            {dress.dress_number && (
              <div className="card p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Dress No.</p>
                <p className="heading text-lg">{dress.dress_number}</p>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="heading text-3xl text-gold-dark">${dress.rental_price_per_day}<span className="text-sm text-muted font-sans"> /day</span></span>
            <span className="text-sm text-muted">+ ${dress.deposit_amount} refundable deposit</span>
          </div>

          <div className="card p-6">
            <h2 className="heading text-2xl mb-4">Rent This Gown</h2>

            {msg && (
              <div className={`mb-4 rounded-xl px-4 py-3 text-sm border ${msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-wine/8 border-wine/20 text-wine'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleRent} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <div className="input-field bg-gold-light/20 text-ink/70 cursor-default select-none">
                    {new Date(form.start_date + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    <span className="ml-2 text-xs text-gold-dark font-medium">(Today)</span>
                  </div>
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input-field" value={form.end_date}
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
                  <span className="text-sm text-ink/70">Estimated total · {Math.round(estimate.days)} day(s) + deposit</span>
                  <span className="heading text-xl text-gold-dark">${estimate.total}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3!">
                {submitting ? 'Sending…' : user ? 'Request Rental' : 'Sign in to Rent'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
