const HIDDEN_KEYS = new Set(['risk_score', 'compliance_score'])

function humanize(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function severityClass(item) {
  if (typeof item === 'object' && item !== null) {
    const sev = item.severity || item.priority || item.overall_impact
    if (sev === 'high' || sev === 'medium') return ` severity-${sev}`
  }
  return ''
}

function ObjectRow({ obj }) {
  return (
    <div>
      {Object.entries(obj).map(([k, v]) => {
        if (v === null || v === undefined || v === '') return null
        if (k === 'severity' || k === 'priority') {
          return (
            <span key={k} className={`pill ${v}`} style={{ marginRight: 8 }}>
              {String(v).toUpperCase()}
            </span>
          )
        }
        return (
          <div key={k} style={{ marginBottom: 2 }}>
            <strong>{humanize(k)}: </strong>
            {typeof v === 'object' ? <ValueBlock value={v} /> : String(v)}
          </div>
        )
      })}
    </div>
  )
}

function ValueBlock({ value }) {
  if (value === null || value === undefined) return <span>—</span>
  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: 'var(--muted)' }}>None detected</span>
    return (
      <div>
        {value.map((item, i) => (
          <div key={i} className={`list-item${severityClass(item)}`}>
            {typeof item === 'object' ? <ObjectRow obj={item} /> : String(item)}
          </div>
        ))}
      </div>
    )
  }
  if (typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="kv-row">
            <span className="k">{humanize(k)}</span>
            <span className="v">{v === null || v === '' ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{String(value)}</p>
}

export default function ResultRenderer({ result }) {
  if (!result) return null
  return (
    <div>
      {Object.entries(result).map(([key, value]) => {
        if (HIDDEN_KEYS.has(key)) return null
        return (
          <div key={key} className="result-section card" style={{ marginBottom: 16 }}>
            <h4>{humanize(key)}</h4>
            <ValueBlock value={value} />
          </div>
        )
      })}
    </div>
  )
}
