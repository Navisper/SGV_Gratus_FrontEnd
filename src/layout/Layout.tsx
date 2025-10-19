import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Layout(){
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b no-print">
        <div className="container-page flex items-center justify-between h-16">
          <div className="font-bold text-lg">Gratus SGV</div>
          <nav className="hidden md:flex gap-4">
            <NavLink to="/" className={({isActive}) => (isActive ? 'text-indigo-700' : 'text-gray-700')}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive}) => (isActive ? 'text-indigo-700' : 'text-gray-700')}>Productos</NavLink>
            <NavLink to="/sales" className={({isActive}) => (isActive ? 'text-indigo-700' : 'text-gray-700')}>Ventas</NavLink>
            <NavLink to="/reports/top-products" className={({isActive}) => (isActive ? 'text-indigo-700' : 'text-gray-700')}>Reportes</NavLink>
            <NavLink to="/invoices" className={({isActive}) => (isActive ? 'text-indigo-700' : 'text-gray-700')}>Facturas</NavLink>
          </nav>
          <button className="btn btn-ghost" onClick={() => { logout(); navigate('/login'); }}>Salir</button>
        </div>
      </header>
      <main className="container-page py-6">
        <Outlet />
      </main>
    </div>
  )
}