import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileBarChart } from 'lucide-react'
import api from '../api/client'

export default function Reports() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    api.get('/api/reports').then(({ data }) => setReports(data)).catch(() => {})
  }, [])

  const download = async (report) => {
    const res = await api.get(`/api/reports/${report.id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `ComplyAI_Report_${report.id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 6 }}>AI Report Center</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 22 }}>
        Every analysis generates a professional PDF report — download them any time.
      </p>
      <div className="card">
        {reports.length === 0 ? (
          <div className="empty-state">
            <FileBarChart size={34} color="#0fb5a6" style={{ marginBottom: 10 }} />
            <br />No reports yet. Run an analysis in any AI module to generate your first report.
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr><th>Report</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.title}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => download(r)}>
                      <Download size={14} /> PDF
                    </button>
                    <Link to={`/analysis/${r.analysis_id}`}>
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
