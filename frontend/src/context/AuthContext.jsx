import { createContext, useContext, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('complyai_user')
    return stored ? JSON.parse(stored) : null
  })

  const saveSession = (data) => {
    localStorage.setItem('complyai_token', data.access_token)
    localStorage.setItem('complyai_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    saveSession(data)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload)
    saveSession(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('complyai_token')
    localStorage.removeItem('complyai_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
