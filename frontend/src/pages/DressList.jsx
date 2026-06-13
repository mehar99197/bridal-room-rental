import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function DressList() {
  const [dresses, setDresses] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    api.get('/categories/').then(({ data }) => setCategories(data.results || data || []))
  }, [])

  useEffect(() => {
    let url = '/dresses/'
    const params = []
    if (status) params.push(`status=${status}`)
    if (category) params.push(`category=${category}`)
    if (params.length) url += '?' + params.join('&')
    api.get(url).then(({ data }) => setDresses(data.results || data || []))
  }, [status, category])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-accent font-[Playfair_Display]">👗 Bridal Dresses</h1>
        <div className="flex gap-3">
          <select className="input-field w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select className="input-field w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dresses.map((d, i) => (
          <div key={d.id} className={`animate-fade-in-up glass-card overflow-hidden stagger-${Math.min(i + 1, 8)}`}>
            {d.image ? (
              <img src={d.image} alt={d.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-5xl">👗</div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{d.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  d.status === 'available' ? 'bg-green-500/20 text-green-300' :
                  d.status === 'rented' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-gray-500/20 text-gray-400'
                }`}>{d.status}</span>
              </div>
              <p className="text-[#c8a8c8] text-sm mb-1">🏷️ {d.category_name || 'Uncategorized'}</p>
              <p className="text-[#c8a8c8] text-sm mb-3">📏 Size: {d.size} &bull; 🎨 {d.color}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-accent">${d.rental_price_per_day}<span className="text-sm text-[#c8a8c8]">/day</span></span>
                  <p className="text-xs text-[#c8a8c8]">Deposit: ${d.deposit_amount}</p>
                </div>
                <Link to={`/dresses/${d.id}`} className="btn-primary text-sm">View & Rent</Link>
              </div>
            </div>
          </div>
        ))}
        {dresses.length === 0 && (
          <p className="col-span-full text-center text-[#c8a8c8] py-12">No dresses found.</p>
        )}
      </div>
    </div>
  )
}
