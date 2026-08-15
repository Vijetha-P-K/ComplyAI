import { useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { UploadCloud, Sparkles } from 'lucide-react'
import api from '../api/client'
import { UPLOAD_MODULES } from '../modules'

function FilePicker({ label, file, setFile }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)
  return (
    <div
      className={`dropzone${drag ? ' drag' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0])
      }}
    >
      <UploadCloud size={34} color="#0fb5a6" style={{ marginBottom: 8 }} />
      <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 4 }}>
        Drag & drop or click — PDF, DOCX, TXT, or images (PNG/JPG)
      </div>
      {file && <div className="filename">📄 {file.name}</div>}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.docx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.bmp,.tiff"
        onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
      />
    </div>
  )
}

export default function ModulePage() {
  const { moduleKey } = useParams()
  const navigate = useNavigate()
  const config = UPLOAD_MODULES[moduleKey]
  const [file, setFile] = useState(null)
  const [fileB, setFileB] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!config) return <Navigate to="/dashboard" replace />

  const analyze = async () => {
    if (!file || (config.twoFiles && !fileB)) {
      setError(config.twoFiles ? 'Please select both document versions.' : 'Please select a document.')
      return
    }
    setError('')
    setLoading(true)
    const formData = new FormData()
    formData.append('module', moduleKey)
    formData.append('file', file)
    if (config.twoFiles && fileB) formData.append('second_file', fileB)
    try {
      const { data } = await api.post('/api/analysis/run', formData)
      navigate(`/analysis/${data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: 'var(--navy)', fontSize: 24 }}>{config.title}</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4 }}>{config.subtitle}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FilePicker
          label={config.twoFiles ? 'Document Version A' : 'Upload your document'}
          file={file}
          setFile={setFile}
        />
        {config.twoFiles && (
          <FilePicker label="Document Version B" file={fileB} setFile={setFileB} />
        )}
        <button
          className="btn btn-primary"
          style={{ justifyContent: 'center', padding: '14px' }}
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" /> AI is analyzing your document…
            </>
          ) : (
            <>
              <Sparkles size={17} /> Run AI Analysis
            </>
          )}
        </button>
        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>
            Extracting text → detecting type → running the {config.title} agent on Groq → saving results…
          </p>
        )}
      </div>
    </div>
  )
}
