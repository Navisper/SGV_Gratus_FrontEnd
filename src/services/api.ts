const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string,string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || res.statusText)
  }
  const text = await res.text()
  try { return text ? JSON.parse(text) : null } catch { return text }
}

export const AuthAPI = {
  login(email: string, password: string) {
    return api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  },
  register(nombre: string, email: string, password: string) {
    return api('/auth/register', { method: 'POST', body: JSON.stringify({ nombre, email, password }) })
  },
}

export const ProductsAPI = {
  list: (skip=0,take=1000) => api(`/products?skip=${skip}&take=${take}`),
  get: (codigo_unico: string) => api(`/products/${codigo_unico}`),
  create: (data: any) => api('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (codigo_unico: string, data: any) => api(`/products/${codigo_unico}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (codigo_unico: string) => api(`/products/${codigo_unico}`, { method: 'DELETE' }),
}

export const SalesAPI = {
  create: (payload: any) => api('/sales', { method: 'POST', body: JSON.stringify(payload) }),
  get: (id: string) => api(`/sales/${id}`),
}

export const InvoicesAPI = {
  generate: (sale_id: string) => api(`/invoices/${sale_id}`, { method: 'POST' }),
  get: (invoice_id: string) => api(`/invoices/${invoice_id}`),
}

export const ReportsAPI = {
  topProducts: (limit=10) => api(`/reports/top-products?limit=${limit}`),
  summary: () => api('/reports/summary'),
}