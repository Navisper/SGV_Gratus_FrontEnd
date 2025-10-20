
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ToastHost } from '../ui/Toast'

export default function App(){
  const nav = useNavigate()
  const loc = useLocation()
  const isAuthed = !!localStorage.getItem('token') // simple y suficiente con tu backend de token en URL

  useEffect(()=>{
    const publicPaths = ['/login', '/auth/callback'] // <— importante
    if (!isAuthed && !publicPaths.includes(loc.pathname)) nav('/login')
  },[isAuthed, loc.pathname])

  const logout = ()=>{ localStorage.removeItem('token'); nav('/login') }

  return (
    <>
      <div className="navbar">
        <a className="pill">Gratus SGV</a>
        {isAuthed && (
          <>
            <NavLink to="/" end>Panel</NavLink>
            <NavLink to="/products">Productos</NavLink>
            <NavLink to="/sales">Ventas</NavLink>
            <NavLink to="/sales/new">POS</NavLink>
            <NavLink to="/invoices">Facturas</NavLink>
            <NavLink to="/reports/top-products">Reportes</NavLink>
            <span className="spacer" />
            <button className="btn secondary" onClick={logout}>Salir</button>
          </>
        )}
      </div>
      <div className="container">
        <Outlet />
      </div>
      <ToastHost />
    </>
  )
}

