import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { checkAuth } = useAuth()
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('Procesando autenticación...')

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token')
                const error = searchParams.get('error')

                console.log('Callback received - Token:', !!token, 'Error:', error)

                if (error) {
                    setStatus('error')
                    setMessage(`Error en autenticación: ${decodeURIComponent(error)}`)
                    return
                }

                if (!token) {
                    setStatus('error')
                    setMessage('No se recibió token de autenticación')
                    return
                }

                // Guardar el token en localStorage
                localStorage.setItem('auth_token', token)

                console.log('Token saved, verifying authentication...')

                // Verificar la autenticación
                await checkAuth()

                setStatus('success')
                setMessage('¡Autenticación exitosa! Redirigiendo...')

                // Redirigir al dashboard después de 2 segundos
                setTimeout(() => {
                    navigate('/', { replace: true })
                }, 2000)

            } catch (err) {
                console.error('Auth callback error:', err)
                setStatus('error')
                setMessage('Error al procesar la autenticación: ' + (err.message || 'Error desconocido'))
            }
        }

        handleCallback()
    }, [searchParams, navigate, checkAuth])

    const handleRetry = () => {
        navigate('/login')
    }

    return (
        <div className="login-container">
            <div className="login-card text-center">
                {status === 'loading' && (
                    <>
                        <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Procesando autenticación...</h2>
                        <p className="text-gray-600">{message}</p>
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
                        <div className="space-y-2">
                            <button
                                onClick={handleRetry}
                                className="btn btn-primary w-full"
                            >
                                Volver al Login
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-outline w-full"
                            >
                                Reintentar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthCallbackPage