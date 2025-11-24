import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, XCircle } from 'lucide-react'

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { checkAuth } = useAuth()
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token')
            const error = searchParams.get('error')

            if (error) {
                setStatus('error')
                setMessage(`Error en autenticación: ${error}`)
                return
            }

            if (token) {
                try {
                    // Guardar el token en localStorage
                    localStorage.setItem('auth_token', token)

                    // Verificar la autenticación
                    await checkAuth()

                    setStatus('success')
                    setMessage('¡Autenticación exitosa! Redirigiendo...')

                    // Redirigir al dashboard después de 2 segundos
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)

                } catch (err) {
                    setStatus('error')
                    setMessage('Error al procesar la autenticación')
                    console.error('Auth callback error:', err)
                }
            } else {
                setStatus('error')
                setMessage('No se recibió token de autenticación')
            }
        }

        handleCallback()
    }, [searchParams, navigate, checkAuth])

    return (
        <div className="login-container">
            <div className="login-card text-center">
                {status === 'loading' && (
                    <>
                        <div className="loading-spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Procesando autenticación...</h2>
                        <p className="text-gray-600">Espere un momento por favor.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Autenticación exitosa!</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error de autenticación</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-primary"
                        >
                            Volver al Login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthCallbackPage