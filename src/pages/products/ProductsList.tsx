
import { useEffect, useMemo, useState } from 'react'
import { ProductsAPI } from '../../services/api'
import { Link } from 'react-router-dom'
import { useToast } from '../../ui/Toast'

type Product = { id: string; codigo_unico: string; nombre: string; categoria?: string; precio?: number; costo?: number; stock?: number }
export default function ProductsList(){
  const [rows,setRows]=useState<Product[]>([])
  const [q,setQ]=useState('')
  const { show } = useToast()
  useEffect(()=>{ ProductsAPI.list(0,1000).then(setRows).catch(e=>show(e.message,'error')) },[])
  const filtered = useMemo(()=> rows.filter(r => (r.nombre||'').toLowerCase().includes(q.toLowerCase()) || (r.codigo_unico||'').toLowerCase().includes(q.toLowerCase())), [rows,q])
  return (
    <div className="grid">
      <div className="row">
        <h1 style={{marginRight:8}}>Productos</h1>
        <Link to="/products/new" className="btn">Nuevo</Link>
        <span className="spacer" />
        <input className="input" placeholder="Buscar por código o nombre..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="code">{p.codigo_unico}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria||'-'}</td>
                <td>${(p.precio||0).toLocaleString('es-CO')}</td>
                <td>{p.stock ?? 0}</td>
                <td><Link to={`/products/${encodeURIComponent(p.codigo_unico)}`} className="btn secondary">Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
