import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ModulePage from './pages/ModulePage'
import PolicyAssistant from './pages/PolicyAssistant'
import Reports from './pages/Reports'
import History from './pages/History'
import AnalysisResult from './pages/AnalysisResult'
import AppLayout from './components/AppLayout'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/modules/:moduleKey" element={<Protected><ModulePage /></Protected>} />
      <Route path="/assistant" element={<Protected><PolicyAssistant /></Protected>} />
      <Route path="/reports" element={<Protected><Reports /></Protected>} />
      <Route path="/history" element={<Protected><History /></Protected>} />
      <Route path="/analysis/:analysisId" element={<Protected><AnalysisResult /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
