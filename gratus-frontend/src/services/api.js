import axios from 'axios'

// URL base dinámica basada en el entorno
const getApiBaseUrl = () => {
    // En desarrollo, usar localhost
    if (import.meta.env.DEV) {
        return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    }
    // En producción, usar la variable de entorno
    return import.meta.env.VITE_API_BASE_URL || 'https://tu-api-en-render.onrender.com'
}

const API_BASE_URL = getApiBaseUrl()

console.log('API Base URL:', API_BASE_URL)
console.log('Environment:', import.meta.env.MODE)

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Aumentar timeout para producción
})

// Interceptor para requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        if (import.meta.env.DEV) {
            console.log('Making API request:', config.method?.toUpperCase(), config.url)
        }

        return config
    },
    (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// Interceptor para responses
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('API response:', response.status, response.config.url)
        }
        return response
    },
    (error) => {
        console.error('API error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.detail || error.message
        })

        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            // Redirigir al login solo si estamos en el cliente
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

// Google Login - URL dinámica
export const googleLogin = () => {
    const googleUrl = `${API_BASE_URL}/auth/google/login`
    console.log('Redirecting to Google login:', googleUrl)
    window.location.href = googleUrl
}

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    googleLogin: googleLogin,
}

export const productsAPI = {
    list: (skip = 0, take = 100) => api.get(`/products?skip=${skip}&take=${take}`),
    getByCode: (codigo_unico) => api.get(`/products/${codigo_unico}`),
    create: (data) => api.post('/products', data),
    update: (codigo_unico, data) => api.put(`/products/${codigo_unico}`, data),
    delete: (codigo_unico) => api.delete(`/products/${codigo_unico}`),
}

export const customersAPI = {
    list: (q = '', take = 50, skip = 0) => {
        const params = new URLSearchParams()
        if (q) params.append('q', q)
        params.append('take', take)
        params.append('skip', skip)
        return api.get(`/customers?${params}`)
    },
    create: (data) => api.post('/customers', data),
    get: (id) => api.get(`/customers/${id}`),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
}

export const salesAPI = {
    create: (data) => api.post('/sales', data),
    get: (id) => api.get(`/sales/${id}`),
    list: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value.toString())
            }
        })
        return api.get(`/sales?${params}`)
    },
    cancel: (id) => api.post(`/sales/${id}/cancel`),
}

export const creditsAPI = {
    createSale: (data) => api.post('/credits/sales', data),
    list: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value.toString())
            }
        })
        return api.get(`/credits?${params}`)
    },
    get: (id) => api.get(`/credits/${id}`),
    addPayment: (id, data) => api.post(`/credits/${id}/payments`, data),
}

export const invoicesAPI = {
    generate: (saleId) => api.post(`/invoices/${saleId}`),
    get: (id) => api.get(`/invoices/${id}`),
}

export const reportsAPI = {
    summary: () => api.get('/reports/summary'),
    topProducts: (limit = 10) => api.get(`/reports/top-products?limit=${limit}`),
    creditsOverview: () => api.get('/reports/credits/overview'),
}

export default api