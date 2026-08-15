import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldHalf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 18 }}>
          <ShieldHalf size={26} color="#0fb5a6" />
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>
            Comply<span style={{ color: '#0fb5a6' }}>AI</span>
          </span>
        </div>
        <h2>Welcome back</h2>
        <p className="sub">Sign in to access your AI document intelligence dashboard.</p>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 18, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
          New to ComplyAI? <Link to="/register" style={{ color: '#0fb5a6', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}
