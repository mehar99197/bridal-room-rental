import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg = data ? Object.values(data).flat().join(', ') : 'Registration failed'
      setError(msg)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="animate-fade-in-up glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-accent font-[Playfair_Display]">Create Account</h1>
          <p className="text-[#c8a8c8] mt-1">Join Bridal Rental today</p>
        </div>

        {error && (
          <div className="bg-[rgba(220,53,69,0.12)] border border-[rgba(220,53,69,0.3)] rounded-lg p-3 mb-4 text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" placeholder="Username" className="input-field" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="input-field" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password (min 8 chars)" className="input-field" value={form.password} onChange={handleChange} required />
          <input name="phone" placeholder="Phone (optional)" className="input-field" value={form.phone} onChange={handleChange} />
          <textarea name="address" placeholder="Address (optional)" className="input-field" rows="2" value={form.address} onChange={handleChange} />
          <button type="submit" className="btn-accent w-full py-3">Register</button>
        </form>

        <p className="text-center mt-6 text-[#c8a8c8] text-sm">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
