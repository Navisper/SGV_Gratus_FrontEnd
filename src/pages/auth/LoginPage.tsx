import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthAPI } from '../../services/api'
import { useAuth } from '../../store/auth'
import { useToast } from '../../components/ui/ToastProvider'

const LoginSchema = z.object({ email: z.string().email('Email inválido'), password: z.string().min(6, 'Mínimo 6 caracteres') })
type LoginForm = z.infer<typeof LoginSchema>

export default function LoginPage(){
  const { setToken } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: 'admin@example.com', password: 'admin123' }
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(false)
    try {
      setLoading(true)
      const res = await AuthAPI.login(data.email, data.password) as any
      setToken(res.access_token)
      navigate('/')
    } catch (e: any) {
      show(e.message || 'Error al iniciar sesión', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => { window.location.href = `${BASE}/auth/google/login` }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="card w/full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Ingresar a Gratus SGV</h1>
        <label className="label">Email</label>
        <input className="input" type="email" {...register('email')} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

        <label className="label mt-3">Contraseña</label>
        <input className="input" type="password" {...register('password')} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

        <button className="btn btn-primary mt-4 w-full" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="mx-2 text-sm text-gray-500">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button type="button" onClick={handleGoogleLogin} className="btn btn-ghost w-full border-gray-300 flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Iniciar sesión con Google
        </button>
      </form>
    </div>
  )
}
