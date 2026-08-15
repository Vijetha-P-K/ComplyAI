import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, ArrowLeft } from 'lucide-react'
import api from '../api/client'
import ScoreRing from '../components/ScoreRing'
import ResultRenderer from '../components/ResultRenderer'

export default function AnalysisResult() {
  const { analysisId } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/api/analysis/${analysisId}`)
      .then(({ data }) => setAnalysis(data))
      .catch((err) => setError(err.response?.data?.detail || 'Could not load analysis'))
  }, [analysisId])

  const downloadReport = async () => {
    const res = await api.get(`/api/reports/${analysis.report_id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `ComplyAI_Report_${analysis.report_id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) return <div className="error-banner">{error}</div>
  if (!analysis) return <div className="empty-state">Loading analysis…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Link to="/history" style={{ color: 'var(--teal)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ArrowLeft size={15} /> Back to history
          </Link>
          <h1 style={{ color: 'var(--navy)', fontSize: 23, marginTop: 6 }}>
            {analysis.module.charAt(0).toUpperCase() + analysis.module.slice(1)} Analysis
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            {analysis.document?.filename}
            {analysis.second_document ? ` vs ${analysis.second_document.filename}` : ''} ·{' '}
            {new Date(analysis.created_at).toLocaleString()}
          </p>
        </div>
        {analysis.report_id && (
          <button className="btn btn-amber" onClick={downloadReport}>
            <Download size={16} /> Download PDF Report
          </button>
        )}
      </div>

      {(analysis.risk_score !== null || analysis.compliance_score !== null) && (
        <div className="card" style={{ display: 'flex', gap: 36, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          {analysis.risk_score !== null && <ScoreRing value={analysis.risk_score} label="Risk Score" />}
          {analysis.compliance_score !== null && (
            <ScoreRing value={analysis.compliance_score} label="Compliance" invert />
          )}
        </div>
      )}

      <ResultRenderer result={analysis.result} />
    </div>
  )
}
