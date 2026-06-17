/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Start in the loading state only when there is a token worth verifying.
  // Use sessionStorage so each browser tab keeps its own independent session
  // (logging in as admin in one tab won't hijack a user session in another).
  const [loading, setLoading] = useState(() => !!sessionStorage.getItem('access_token'))

  useEffect(() => {
    if (!sessionStorage.getItem('access_token')) return
    api.get('/auth/profile/')
      .then(({ data }) => {
        setUser(data)
        sessionStorage.setItem('user', JSON.stringify(data))
      })
      .catch(() => {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password })
    sessionStorage.setItem('access_token', data.access)
    sessionStorage.setItem('refresh_token', data.refresh)
    const { data: profile } = await api.get('/auth/profile/')
    setUser(profile)
    sessionStorage.setItem('user', JSON.stringify(profile))
    return profile
  }

  // Update the signed-in user's editable profile fields (phone, address, avatar).
  // Sent as multipart so the avatar image can be included.
  const updateProfile = async (fields) => {
    const fd = new FormData()
    Object.entries(fields).forEach(([k, v]) => {
      if (k === 'avatar') { if (v) fd.append(k, v) }
      else if (v !== undefined && v !== null) fd.append(k, v)
    })
    const { data } = await api.patch('/auth/profile/', fd, { headers: { 'Content-Type': undefined } })
    setUser(data)
    sessionStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register/', formData)
    return data
  }

  const logout = () => {
    setUser(null)
    sessionStorage.clear()
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
