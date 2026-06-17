import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function DressList() {
  const [dresses, setDresses] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories/')
      .then(({ data }) => setCategories(data.results || data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    let url = '/dresses/'
    const params = []
    if (status) params.push(`status=${status}`)
    if (category) params.push(`category=${category}`)
    if (params.length) url += '?' + params.join('&')
    api.get(url)
      .then(({ data }) => active && setDresses(data.results || data || []))
      .catch(() => active && setDresses([]))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [status, category])

  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="divider text-sm uppercase tracking-[0.2em]">The Collection</span>
        <h1 className="heading text-4xl md:text-5xl mt-3">Designer Gowns</h1>
        <p className="text-muted mt-2">Timeless dresses to rent for your special day</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
        <select className="input-field w-auto" value={status} onChange={(e) => { setLoading(true); setStatus(e.target.value) }}>
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select className="input-field w-auto" value={category} onChange={(e) => { setLoading(true); setCategory(e.target.value) }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="min-h-[30vh] grid place-items-center"><div className="spinner" /></div>
      ) : dresses.length === 0 ? (
        <p className="text-center text-muted py-16">No gowns match this filter.</p>
      ) : (
        <div className="grid gap-7 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dresses.map((d, i) => (
            <Link to={`/dresses/${d.id}`} key={d.id} className={`card card-hover overflow-hidden group animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
              <div className="h-60 overflow-hidden relative">
                {d.image ? (
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full img-placeholder grid place-items-center heading text-4xl text-gold/60">Gown</div>
                )}
                <span className={`badge badge-${d.status} absolute top-3 right-3 backdrop-blur`}>{d.status}</span>
              </div>
              <div className="p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-gold-dark mb-1">{d.category_name || 'Bridal'}</p>
                <h3 className="heading text-lg leading-tight mb-1">{d.name}</h3>
                <p className="text-xs text-muted">Size {d.size} · {d.color}</p>
                <div className="mt-3 pt-3 border-t border-line">
                  <span className="heading text-xl text-gold-dark">${d.rental_price_per_day}<span className="text-xs text-muted font-sans"> /day</span></span>
                  <p className="text-xs text-muted mt-0.5">Deposit ${d.deposit_amount}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
