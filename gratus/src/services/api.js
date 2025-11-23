import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    googleLogin: () => window.location.href = '/api/auth/google/login',
};

export const productsAPI = {
    list: (skip = 0, take = 100) => api.get(`/products?skip=${skip}&take=${take}`),
    getByCode: (codigo_unico) => api.get(`/products/${codigo_unico}`),
    create: (data) => api.post('/products', data),
    update: (codigo_unico, data) => api.put(`/products/${codigo_unico}`, data),
    delete: (codigo_unico) => api.delete(`/products/${codigo_unico}`),
};

export const customersAPI = {
    list: (q, take = 50, skip = 0) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        params.append('take', take);
        params.append('skip', skip);
        return api.get(`/customers?${params}`);
    },
    create: (data) => api.post('/customers', data),
    get: (id) => api.get(`/customers/${id}`),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
};

export const salesAPI = {
    create: (data) => api.post('/sales', data),
    get: (id) => api.get(`/sales/${id}`),
    list: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        });
        return api.get(`/sales?${params}`);
    },
    cancel: (id) => api.post(`/sales/${id}/cancel`),
};

export const creditsAPI = {
    createSale: (data) => api.post('/credits/sales', data),
    list: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        });
        return api.get(`/credits?${params}`);
    },
    get: (id) => api.get(`/credits/${id}`),
    addPayment: (id, data) => api.post(`/credits/${id}/payments`, data),
    getAgingReport: () => api.get('/credits/aging/report'),
    getCustomerStatement: (customerId) => api.get(`/credits/customers/${customerId}/statement`),
};

export const invoicesAPI = {
    generate: (saleId) => api.post(`/invoices/${saleId}`),
    get: (id) => api.get(`/invoices/${id}`),
};

export const reportsAPI = {
    summary: () => api.get('/reports/summary'),
    topProducts: (limit = 10) => api.get(`/reports/top-products?limit=${limit}`),
    creditsOverview: () => api.get('/reports/credits/overview'),
    topDebtors: (limit = 10) => api.get(`/reports/credits/top-debtors?limit=${limit}`),
    salesTimeseries: (granularity, dateFrom, dateTo) => {
        const params = new URLSearchParams();
        params.append('granularity', granularity);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        return api.get(`/reports/sales/timeseries?${params}`);
    },
};

export default api;