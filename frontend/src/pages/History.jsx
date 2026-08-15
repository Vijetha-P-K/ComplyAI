import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'
import api from '../api/client'

export default function History() {
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    api.get('/api/analysis/history').then(({ data }) => setAnalyses(data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 6 }}>Analysis History</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 22 }}>All your previous AI analyses, stored for future reference.</p>
      <div className="card">
        {analyses.length === 0 ? (
          <div className="empty-state">
            <HistoryIcon size={34} color="#0fb5a6" style={{ marginBottom: 10 }} />
            <br />No analyses yet — pick a module from the dashboard to get started.
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr><th>Module</th><th>Document</th><th>Risk</th><th>Compliance</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{a.module}</td>
                  <td>
                    {a.document?.filename}
                    {a.second_document ? ` vs ${a.second_document.filename}` : ''}
                  </td>
                  <td>{a.risk_score !== null ? Math.round(a.risk_score) : '—'}</td>
                  <td>{a.compliance_score !== null ? Math.round(a.compliance_score) : '—'}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                  <td>
                    <Link to={`/analysis/${a.id}`}>
                      <button className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
