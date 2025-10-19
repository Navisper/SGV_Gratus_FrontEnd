import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import Toasts from './Toasts'

export type Toast = { id: number; title?: string; message: string }
type ToastCtx = { show: (message: string, title?: string) => void }
const ToastContext = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([])
  const show = useCallback((message: string, title?: string) => {
    const id = Date.now() + Math.floor(Math.random()*1000)
    setToasts(t => [...t, { id, message, title }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])
  const value = useMemo(() => ({ show }), [show])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toasts toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}