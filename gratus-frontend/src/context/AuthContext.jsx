/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-useless-catch */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            setLoading(false)
            return null
        }

        try {
            const response = await authAPI.getMe()
            setUser(response.data)
            return response.data
        } catch (error) {
            console.error('Auth check failed:', error)
            localStorage.removeItem('auth_token')
            setUser(null)
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials)
            const { access_token } = response.data
            localStorage.setItem('auth_token', access_token)
            await checkAuth()
            return response
        } catch (error) {
            throw error
        }
    }

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            const { access_token } = response.data
            localStorage.removeItem('auth_token', access_token)
            await checkAuth()
            return response
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        setUser(null)
    }

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        checkAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}