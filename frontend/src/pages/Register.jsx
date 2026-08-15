import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldHalf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', company: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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
        <h2>Create your account</h2>
        <p className="sub">Register once, sign in any time — your analyses stay saved.</p>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full Name</label>
            <input value={form.full_name} onChange={update('full_name')} required placeholder="Jane Smith" />
          </div>
          <div className="field">
            <label>Work Email</label>
            <input type="email" value={form.email} onChange={update('email')} required placeholder="you@company.com" />
          </div>
          <div className="field">
            <label>Company (optional)</label>
            <input value={form.company} onChange={update('company')} placeholder="Acme Corp" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} required placeholder="Minimum 6 characters" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: 18, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
          Already registered? <Link to="/login" style={{ color: '#0fb5a6', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
