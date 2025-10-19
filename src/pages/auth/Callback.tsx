import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { useToast } from '../../components/ui/ToastProvider'

export default function Callback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const { show } = useToast()
  useEffect(() => {
    const token = params.get('token')
    if (token) { setToken(token); navigate('/') }
    else { show('No se recibió token en el callback', 'Error OAuth'); navigate('/login') }
  }, [])
  return <div className="min-h-screen grid place-items-center">Autenticando con Google...</div>
}
