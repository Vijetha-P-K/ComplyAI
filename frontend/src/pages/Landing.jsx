import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldHalf, ArrowRight, Zap, Database, Lock } from 'lucide-react'
import { MODULES } from '../modules'

export default function Landing() {
  return (
    <div>
      <nav className="landing-nav">
        <div className="brand">
          <ShieldHalf size={28} color="#0fb5a6" />
          Comply<span style={{ color: '#0fb5a6' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login"><button className="btn btn-outline">Sign In</button></Link>
          <Link to="/register"><button className="btn btn-primary">Get Started</button></Link>
        </div>
      </nav>

      <header className="hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="badge">Enterprise AI Document Intelligence</div>
          <h1>
            Understand every <span className="accent">business document</span> in{' '}
            <span className="accent2">seconds</span>, not hours
          </h1>
          <p>
            ComplyAI analyzes tenders, contracts, invoices, policies and meeting notes with
            specialized AI agents — detecting risks, scoring compliance, answering policy
            questions and generating professional PDF reports.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>
                Start Analyzing Free <ArrowRight size={17} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-amber" style={{ padding: '14px 28px', fontSize: 15 }}>
                Sign In
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 30, marginTop: 46, color: '#9fb2cc', fontSize: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><Zap size={16} color="#f5a623" /> Groq Llama 3.3 powered</span>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><Database size={16} color="#0fb5a6" /> RAG with ChromaDB</span>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><Lock size={16} color="#0fb5a6" /> Secure JWT authentication</span>
          </div>
        </motion.div>
      </header>

      <section className="section">
        <h2>Eight Specialized AI Modules</h2>
        <p className="lead">
          Each module has its own dedicated AI agent with prompt-engineered analysis, structured
          scoring and downloadable reports.
        </p>
        <div className="grid grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {MODULES.map((m, i) => (
            <motion.div
              key={m.key}
              className="card module-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="module-icon" style={{ background: `${m.color}18` }}>
                <m.icon size={22} color={m.color} />
              </div>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} ComplyAI — AI Business Compliance & Document Intelligence Platform
      </footer>
    </div>
  )
}
