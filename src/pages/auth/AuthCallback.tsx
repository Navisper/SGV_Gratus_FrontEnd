
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthAPI } from '../../services/api'
import { useToast } from '../../ui/Toast'

export default function AuthCallback(){
  const [sp] = useSearchParams()
  const code = sp.get('code')
  const token = sp.get('token') || sp.get('access_token')
  const nav = useNavigate()
  const { show } = useToast()

  useEffect(()=>{
    async function run(){
      try{
        // Caso 1: tu backend redirige con ?token=...
        if (token){
          localStorage.setItem('token', token)
          // sanity check: opcional, probar /auth/me
          try { await AuthAPI.me() } catch {}
          show('Inicio de sesión con Google exitoso','ok')
          nav('/')
          return
        }
        // Caso 2: flujo code + POST /auth/google/callback
        if (code){
          const data = await AuthAPI.googleCallback(code)
          const t = data?.access_token || data?.token
          if (t) localStorage.setItem('token', t)
          show('Inicio de sesión con Google exitoso','ok')
          nav('/')
          return
        }
        // Caso 3: ya hay cookie en backend (si algún día usas cookie httpOnly)
        try {
          await AuthAPI.me()
          nav('/')
        } catch {
          nav('/login')
        }
      }catch(e:any){
        show(e.message || 'No se pudo completar el inicio de sesión', 'error')
        nav('/login')
      }
    }
    run()
  },[code, token])

  return <div className="card">Procesando inicio de sesión con Google...</div>
}
