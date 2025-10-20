
import { useState } from 'react'
import { AuthAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../ui/Toast'

export default function LoginPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const nav=useNavigate()
  const { show } = useToast()

  const submit=async(e:any)=>{
    e.preventDefault()
    setLoading(true)
    try{
      await AuthAPI.login(email,password)
      show('Bienvenido','ok')
      nav('/')
    }catch(err:any){
      show(err.message,'error')
    }finally{ setLoading(false) }
  }

  const loginGoogle=()=>{ AuthAPI.googleLoginRedirect() }

  return (
    <div className="container" style={{maxWidth:480}}>
      <div className="card">
        <h1>Iniciar sesión</h1>
        <form className="grid" onSubmit={submit}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn" disabled={loading}>{loading?'Ingresando...':'Entrar'}</button>
        </form>
        <div className="hr"></div>
        <button className="btn google" onClick={loginGoogle}>
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 20H24v8.5h11.8C34.9 32.9 30.1 36 24 36c-6.6 0-12.2-4.3-14.2-10.2S9 13.6 15 11.6 28.4 12 30.4 18h8.8C37.4 8.4 27.7 2.6 17.9 5.2S1.4 18.5 4 28.3C6.6 38.1 16.3 43.9 26.1 41.3c7.7-2 13.3-8.8 13.8-16.6.2-1.6.2-3.2-.1-4.7z" fill="currentColor"/></svg>
          Iniciar con Google
        </button>
        <p className="muted">buscas el registrarte <code>pues no mi bro</code>.</p>
      </div>
    </div>
  )
}
