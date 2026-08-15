import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileSearch,
  Scale,
  ShieldCheck,
  Receipt,
  GitCompare,
  MessageSquareText,
  ClipboardList,
  FileBarChart,
  History as HistoryIcon,
  LogOut,
  ShieldHalf,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const moduleLinks = [
  { to: '/modules/tender', icon: FileSearch, label: 'Tender Analyzer' },
  { to: '/modules/contract', icon: Scale, label: 'Contract & Legal' },
  { to: '/modules/compliance', icon: ShieldCheck, label: 'Compliance Checker' },
  { to: '/modules/invoice', icon: Receipt, label: 'Invoice Verification' },
  { to: '/modules/comparator', icon: GitCompare, label: 'Doc Comparator' },
  { to: '/assistant', icon: MessageSquareText, label: 'Policy Assistant' },
  { to: '/modules/meeting', icon: ClipboardList, label: 'Meeting Minutes' },
  { to: '/reports', icon: FileBarChart, label: 'Report Center' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldHalf size={26} color="#0fb5a6" />
          <span>Comply<span className="accent">AI</span></span>
        </div>
        <NavLink to="/dashboard" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <div className="side-section">AI Modules</div>
        {moduleLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <div className="side-section">Account</div>
        <NavLink to="/history" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
          <HistoryIcon size={18} /> Analysis History
        </NavLink>
        <button
          className="side-link"
          style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
          onClick={() => { logout(); navigate('/') }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="main-area">
        <div className="topbar">
          <div />
          <div className="user-chip">
            <div className="avatar">{user?.full_name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user?.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.company || user?.email}</div>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
