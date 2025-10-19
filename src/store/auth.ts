import { create } from 'zustand'

type AuthState = {
  token: string | null
  role: string | null
  isAuthenticated: boolean
  setToken: (t: string | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  isAuthenticated: !!localStorage.getItem('token'),
  setToken: (t) => {
    if (t) {
      localStorage.setItem('token', t)
      set({ token: t, isAuthenticated: true })
    } else {
      localStorage.removeItem('token')
      set({ token: null, isAuthenticated: false })
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    set({ token: null, role: null, isAuthenticated: false })
  }
}))