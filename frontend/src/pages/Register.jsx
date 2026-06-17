import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="card p-8 md:p-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <p className="eyebrow">Join the atelier</p>
          <h1 className="heading text-3xl mt-1">Create Account</h1>
          <p className="text-sm text-muted mt-2">Reserve suites & gowns in a few clicks</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-wine/8 border border-wine/20 px-4 py-3 text-sm text-wine">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input name="username" placeholder="janedoe" className="input-field" value={form.username} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" className="input-field" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" placeholder="Minimum 8 characters" className="input-field" value={form.password} onChange={handleChange} minLength={8} required />
          </div>
          <div>
            <label className="label">Phone <span className="text-muted normal-case font-normal">(optional)</span></label>
            <input name="phone" placeholder="+1 (555) 000-0000" className="input-field" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Address <span className="text-muted normal-case font-normal">(optional)</span></label>
            <textarea name="address" placeholder="Where should we reach you?" className="input-field" rows="2" value={form.address} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3! text-base">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-7 text-sm text-muted">
          Already a member? <Link to="/login" className="text-gold-dark font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
