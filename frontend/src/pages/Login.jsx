import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const profile = await login(email, password)
      navigate(profile?.is_staff ? '/admin-panel' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="card p-8 md:p-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <p className="eyebrow">Welcome back</p>
          <h1 className="heading text-3xl mt-1">Sign In</h1>
          <p className="text-sm text-muted mt-2">Continue planning your perfect day</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-wine/8 border border-wine/20 px-4 py-3 text-sm text-wine">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" value={email} placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input-field" value={password} placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3! text-base">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-7 text-sm text-muted">
          New to Maison Belle? <Link to="/register" className="text-gold-dark font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
