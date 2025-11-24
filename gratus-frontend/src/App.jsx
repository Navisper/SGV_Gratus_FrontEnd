import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/common/Layout'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import SalesPage from './pages/SalesPage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import ReportsPage from './pages/ReportsPage'
import LoadingSpinner from './components/common/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />
  }
  
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />
  }
  
  return !user ? children : <Navigate to="/" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <SalesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Ruta de fallback para SPA */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App