import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="animate-fade-in-up glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💎</div>
          <h1 className="text-2xl font-bold text-accent font-[Playfair_Display]">Welcome Back</h1>
          <p className="text-[#c8a8c8] mt-1">Sign in to manage your rentals</p>
        </div>

        {error && (
          <div className="bg-[rgba(220,53,69,0.12)] border border-[rgba(220,53,69,0.3)] rounded-lg p-3 mb-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-accent-light mb-2">📧 Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-light mb-2">🔒 Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-accent w-full py-3 text-lg">Sign In</button>
        </form>

        <p className="text-center mt-6 text-[#c8a8c8] text-sm">
          No account? <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
