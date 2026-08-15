import { useEffect, useRef, useState } from 'react'
import { Send, UploadCloud, Trash2, FileText } from 'lucide-react'
import api from '../api/client'

export default function PolicyAssistant() {
  const [messages, setMessages] = useState([])
  const [docs, setDocs] = useState([])
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const bottomRef = useRef(null)

  const load = () => {
    api.get('/api/rag/history').then(({ data }) => setMessages(data)).catch(() => {})
    api.get('/api/rag/documents').then(({ data }) => setDocs(data)).catch(() => {})
  }
  useEffect(load, [])
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])

  const upload = async (file) => {
    setError('')
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      await api.post('/api/rag/upload', formData)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeDoc = async (id) => {
    await api.delete(`/api/rag/documents/${id}`)
    load()
  }

  const ask = async (e) => {
    e.preventDefault()
    if (!question.trim() || asking) return
    const q = question
    setQuestion('')
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: 'user', content: q, sources: [] }])
    setAsking(true)
    try {
      const { data } = await api.post('/api/rag/ask', { question: q })
      setMessages((m) => [
        ...m,
        { id: `tmp-a-${Date.now()}`, role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (err) {
      setError(err.response?.data?.detail || 'The assistant could not answer')
    } finally {
      setAsking(false)
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', alignItems: 'start' }}>
      <div className="card">
        <h2 style={{ color: 'var(--navy)', fontSize: 20, marginBottom: 4 }}>AI Business Policy Assistant</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 14 }}>
          Answers are generated with RAG — only from the documents in your knowledge base.
        </p>
        {error && <div className="error-banner">{error}</div>}
        <div className="chat-box">
          {messages.length === 0 && (
            <div className="empty-state">
              Upload company documents, then ask questions like<br />
              “What is our leave policy?” or “What are the vendor payment rules?”
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              {m.content}
              {m.role === 'assistant' && m.sources?.length > 0 && (
                <div className="sources">Sources: {m.sources.join(', ')}</div>
              )}
            </div>
          ))}
          {asking && <div className="msg assistant">Searching your knowledge base…</div>}
          <div ref={bottomRef} />
        </div>
        <form className="chat-input" onSubmit={ask}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your company policies…"
          />
          <button className="btn btn-primary" disabled={asking}>
            <Send size={16} />
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--navy)', fontSize: 16, marginBottom: 12 }}>Knowledge Base</h3>
        <button
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 14 }}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <span className="spinner dark" /> : <><UploadCloud size={16} /> Add Document</>}
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept=".pdf,.docx,.txt,.md,.csv,.png,.jpg,.jpeg"
          onChange={(e) => e.target.files[0] && upload(e.target.files[0])}
        />
        {docs.length === 0 && <div className="empty-state" style={{ padding: 20 }}>No documents indexed yet.</div>}
        {docs.map((d) => (
          <div key={d.id} className="kv-row" style={{ alignItems: 'center' }}>
            <FileText size={15} color="#0fb5a6" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.filename}
            </span>
            <button
              onClick={() => removeDoc(d.id)}
              style={{ background: 'none', border: 'none', color: 'var(--danger)' }}
              title="Remove from knowledge base"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
