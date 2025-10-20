
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path: string, opts: RequestInit = {}){
  const token = localStorage.getItem('token')
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string,string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`  // <— clave para /auth/me
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok){
    let msg = ''
    try { msg = await res.text() } catch {}
    throw new Error(msg || res.statusText)
  }
  const txt = await res.text()
  try { return txt ? JSON.parse(txt) : null } catch { return txt }
}

export const AuthAPI = {
  async login(email: string, password: string){
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    const token = data?.access_token || data?.token
    if (token) localStorage.setItem('token', token)
    return data
  },
  me(){ return request('/auth/me') },
  googleLoginRedirect(){ window.location.href = `${BASE}/auth/google/login` },
  async googleCallback(code: string){
    const data = await request('/auth/google/callback', { method: 'POST', body: JSON.stringify({ code }) })
    const token = data?.access_token || data?.token
    if (token) localStorage.setItem('token', token)
    return data
  }
}

export const ProductsAPI = {
  list: (skip=0, take=100) => request(`/products/?skip=${skip}&take=${take}`),
  get: (codigo_unico: string) => request(`/products/${encodeURIComponent(codigo_unico)}`),
  create: (data: any) => request('/products/', { method: 'POST', body: JSON.stringify(data) }),
  update: (codigo_unico: string, data: any) => request(`/products/${encodeURIComponent(codigo_unico)}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (codigo_unico: string) => request(`/products/${encodeURIComponent(codigo_unico)}`, { method: 'DELETE' }),
}

export const CustomersAPI = {
  list: (q?: string, skip=0, take=50) => request(`/customers/?${q?`q=${encodeURIComponent(q)}&`:''}skip=${skip}&take=${take}`),
  create: (data: any) => request('/customers/', { method: 'POST', body: JSON.stringify(data) }),
}

export const SalesAPI = {
  create: (payload: any) => request('/sales/', { method: 'POST', body: JSON.stringify(payload) }),
  get: (id: string) => request(`/sales/${encodeURIComponent(id)}`),
  list: (params: Record<string, any> = {}) => {
    const sp = new URLSearchParams()
    for (const [k,v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
    return request(`/sales/?${sp.toString()}`)
  },
  kpiDaily: (day?: string) => request(`/sales/kpi/daily${day?`?day=${encodeURIComponent(day)}`:''}`),
  closeDay: (day?: string) => request(`/sales/close/day${day?`?day=${encodeURIComponent(day)}`:''}`),
  cancel: (sale_id: string) => request(`/sales/${encodeURIComponent(sale_id)}/cancel`, { method: 'POST' }),
}

export const InvoicesAPI = {
  generate: (sale_id: string) => request(`/invoices/${encodeURIComponent(sale_id)}`, { method: 'POST' }),
}

export const CreditsAPI = {
  createSale: (payload: any) => request('/credits/sales', { method: 'POST', body: JSON.stringify(payload) }),
  list: (params: Record<string, any> = {}) => {
    const sp = new URLSearchParams()
    for (const [k,v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
    return request(`/credits/?${sp.toString()}`)
  },
  get: (credit_id: string) => request(`/credits/${encodeURIComponent(credit_id)}`),
  addPayment: (credit_id: string, data: any) => request(`/credits/${encodeURIComponent(credit_id)}/payments`, { method: 'POST', body: JSON.stringify(data) }),
  agingReport: () => request('/credits/aging/report'),
  customerStatement: (customer_id: string, fmt?: 'csv'|'pdf') => request(`/credits/customers/${encodeURIComponent(customer_id)}/statement${fmt?'.'+fmt:''}`),
  timeseries: (from?: string, to?: string, granularity: 'day'|'week'|'month'='day') => {
    const sp = new URLSearchParams()
    sp.set('granularity', granularity)
    if (from) sp.set('date_from', from)
    if (to) sp.set('date_to', to)
    return request(`/reports/credits/timeseries?${sp.toString()}`)
  },
  repaymentRate: (from?: string, to?: string, granularity: 'month'|'week'|'day'='month') => {
    const sp = new URLSearchParams()
    sp.set('granularity', granularity)
    if (from) sp.set('date_from', from)
    if (to) sp.set('date_to', to)
    return request(`/reports/credits/repayment-rate?${sp.toString()}`)
  },
}

export const ReportsAPI = {
  summary: () => request('/reports/summary'),
  topProducts: (limit=10) => request(`/reports/top-products?limit=${limit}`),
  creditsOverview: () => request('/reports/credits/overview'),
  creditsTopDebtors: (limit=10) => request(`/reports/credits/top-debtors?limit=${limit}`),
  creditsUpcomingDue: (days=7) => request(`/reports/credits/upcoming-due?days=${days}`),
  salesTimeseries: (from?: string, to?: string, granularity: 'day'|'week'|'month'='day') => {
    const sp = new URLSearchParams()
    sp.set('granularity', granularity)
    if (from) sp.set('date_from', from)
    if (to) sp.set('date_to', to)
    return request(`/reports/sales/timeseries?${sp.toString()}`)
  },
}
