
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './shell/App'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/auth/LoginPage'
import AuthCallback from './pages/auth/AuthCallback'
import ProductsList from './pages/products/ProductsList'
import ProductForm from './pages/products/ProductForm'
import SalesPOS from './pages/sales/SalesPOS'
import SalesList from './pages/sales/SalesList'
import SaleDetail from './pages/sales/SaleDetail'
import TopProducts from './pages/reports/TopProducts'
import InvoicePrint from './pages/invoices/InvoicePrint'
import InvoicesHome from './pages/invoices/InvoicesHome'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
      { index: true, element: <Dashboard /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'products', element: <ProductsList /> },
      { path: 'products/new', element: <ProductForm /> },
      { path: 'products/:codigo', element: <ProductForm /> },
      { path: 'sales', element: <SalesList /> },
      { path: 'sales/new', element: <SalesPOS /> },
      { path: 'sales/:saleId', element: <SaleDetail /> },
      { path: 'reports/top-products', element: <TopProducts /> },
      { path: 'invoices', element: <InvoicesHome /> },
      { path: 'invoices/:saleId', element: <InvoicePrint /> }
  ]}
])

const qc = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
