export default function ScoreRing({ value, label, invert = false }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0))
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const good = invert ? score >= 70 : score <= 35
  const bad = invert ? score <= 40 : score >= 70
  const color = good ? '#22a06b' : bad ? '#e5484d' : '#f5a623'

  return (
    <div className="score-ring">
      <svg width="130" height="130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="score-text">
        <span className="num">{Math.round(score)}</span>
        <span className="lbl">{label}</span>
      </div>
    </div>
  )
}
