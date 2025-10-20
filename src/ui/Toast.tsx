
import React, { createContext, useContext, useState } from 'react'

type Toast = { id: number, text: string, type?: 'ok'|'error' }
const Ctx = createContext<{show:(text:string,t?:'ok'|'error')=>void}>({show:()=>{}})
export const useToast=()=>useContext(Ctx)

export function ToastHost(){
  const [toasts, setToasts] = useState<Toast[]>([])
  const show = (text: string, type?: 'ok'|'error') => {
    const id = Math.random()
    setToasts(prev => [...prev, { id, text, type }])
    setTimeout(()=> setToasts(prev => prev.filter(t=>t.id!==id)), 3000)
  }
  return (
    <Ctx.Provider value={{show}}>
      <div className="toast">
        {toasts.map(t=> <div key={t.id} className="card" style={{borderColor:t.type==='error'?'var(--bad)':'#0003'}}>{t.text}</div>)}
      </div>
    </Ctx.Provider>
  )
}
