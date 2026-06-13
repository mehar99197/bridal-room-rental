import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function DressDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dress, setDress] = useState(null)
  const [form, setForm] = useState({ start_date: '', end_date: '', notes: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get(`/dresses/${id}/`).then(({ data }) => {
      setDress(data)
      setForm((prev) => ({ ...prev, start_date: new Date().toISOString().split('T')[0] }))
    })
  }, [id])

  const handleRent = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    try {
      await api.post('/bookings/', {
        dress: parseInt(id),
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        notes: form.notes,
      })
      setMsg('Rental request sent! Waiting for admin approval.')
    } catch (err) {
      setMsg(Object.values(err.response?.data || {}).flat().join(', ') || 'Rental failed')
    }
  }

  if (!dress) return <div className="text-center py-20 text-[#c8a8c8]">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/dresses" className="text-accent hover:underline text-sm mb-4 inline-block">← Back to Dresses</Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
        <div>
          {dress.image ? (
            <img src={dress.image} alt={dress.name} className="w-full rounded-2xl shadow-2xl" />
          ) : (
            <div className="w-full aspect-video bg-[rgba(255,255,255,0.03)] rounded-2xl flex items-center justify-center text-7xl">👗</div>
          )}
        </div>
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold text-accent font-[Playfair_Display] mb-2">{dress.name}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            dress.status === 'available' ? 'bg-green-500/20 text-green-300' :
            dress.status === 'rented' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-gray-500/20 text-gray-400'
          }`}>{dress.status}</span>
          <p className="text-[#c8a8c8] mb-4">{dress.description}</p>
          <ul className="space-y-2 text-sm text-[#c8a8c8] mb-4">
            <li>🏷️ <strong className="text-[#f5e6f5]">Category:</strong> {dress.category_name || 'Uncategorized'}</li>
            <li>📏 <strong className="text-[#f5e6f5]">Size:</strong> {dress.size}</li>
            <li>🎨 <strong className="text-[#f5e6f5]">Color:</strong> {dress.color}</li>
          </ul>
          <p className="text-3xl font-bold text-accent mb-1">${dress.rental_price_per_day}<span className="text-sm text-[#c8a8c8]">/day</span></p>
          <p className="text-sm text-[#c8a8c8] mb-6">Deposit: ${dress.deposit_amount}</p>

          <hr className="border-[rgba(212,175,55,0.1)] mb-6" />
          <h2 className="text-xl font-bold mb-4">Rent This Dress</h2>

          {msg && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${msg.includes('sent') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleRent} className="space-y-4">
            <div>
              <label className="block text-sm text-accent-light mb-1">Start Date</label>
              <input type="date" className="input-field" value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-accent-light mb-1">End Date</label>
              <input type="date" className="input-field" value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-accent-light mb-1">Notes</label>
              <textarea className="input-field" rows="2" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full py-3">Rent Now</button>
          </form>
        </div>
      </div>
    </div>
  )
}
