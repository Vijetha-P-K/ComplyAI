import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, BrainCircuit, FileBarChart, Activity } from 'lucide-react'
import api from '../api/client'
import { MODULES } from '../modules'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/dashboard/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const statCards = [
    { label: 'Documents Uploaded', value: stats?.total_documents ?? '—', icon: FileText, color: '#0fb5a6' },
    { label: 'AI Analyses', value: stats?.total_analyses ?? '—', icon: BrainCircuit, color: '#f5a623' },
    { label: 'Reports Generated', value: stats?.total_reports ?? '—', icon: FileBarChart, color: '#3b82f6' },
    {
      label: 'Avg Risk / Compliance',
      value: stats
        ? `${stats.avg_risk_score ?? '—'} / ${stats.avg_compliance_score ?? '—'}`
        : '—',
      icon: Activity,
      color: '#8b5cf6',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'var(--navy)', fontSize: 26 }}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4 }}>Select an AI module to analyze your business documents.</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 26 }}>
        {statCards.map((s) => (
          <div key={s.label} className="card stat-card">
            <div className="stat-icon" style={{ background: `${s.color}18` }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ color: 'var(--navy)', fontSize: 19, marginBottom: 14 }}>AI Modules</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', marginBottom: 26 }}>
        {MODULES.map((m, i) => (
          <motion.div key={m.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={m.path}>
              <div className="card module-card" style={{ height: '100%' }}>
                <div className="module-icon" style={{ background: `${m.color}18` }}>
                  <m.icon size={22} color={m.color} />
                </div>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
                <span style={{ color: m.color, fontWeight: 600, fontSize: 13.5 }}>Open module →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Recent Activity</h3>
        {stats?.recent_activity?.length ? (
          stats.recent_activity.map((a) => (
            <div key={a.id} className="kv-row">
              <span className="k">{a.action.replace(/_/g, ' ')}</span>
              <span className="v">{a.detail}</span>
              <span className="v" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">No activity yet — run your first analysis!</div>
        )}
      </div>
    </div>
  )
}
