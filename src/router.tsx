import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import Callback from './pages/auth/Callback'
import Dashboard from './pages/Dashboard'
import ProductsList from './pages/products/ProductsList'
import ProductForm from './pages/products/ProductForm'
import SalesPOS from './pages/sales/SalesPOS'
import SaleDetail from './pages/sales/SaleDetail'
import TopProducts from './pages/reports/TopProducts'
import InvoicesPage from './pages/InvoicesPage'
import InvoicePrint from './pages/invoices/InvoicePrint'
import { useAuth } from './store/auth'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <Callback /> },
  {
    path: '/',
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductsList /> },
      { path: 'products/new', element: <ProductForm /> },
      { path: 'products/:codigo_unico', element: <ProductForm /> },
      { path: 'sales', element: <SalesPOS /> },
      { path: 'sales/:sale_id', element: <SaleDetail /> },
      { path: 'reports/top-products', element: <TopProducts /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'invoices/print/:invoice_id', element: <InvoicePrint /> },
    ]
  }
])