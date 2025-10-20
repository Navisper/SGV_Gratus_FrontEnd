
import { useEffect, useState } from 'react'
import { SalesAPI } from '../../services/api'
import { Link } from 'react-router-dom'
import { useToast } from '../../ui/Toast'

export default function SalesList(){
  const [rows,setRows]=useState<any[]>([])
  const { show } = useToast()
  useEffect(()=>{ SalesAPI.list({ limit: 50, offset: 0 }).then(setRows).catch(e=>show(e.message,'error')) },[])
  return (
    <div className="grid">
      <h1>Ventas</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Fecha</th><th>Método</th><th>Total</th><th>Anulada</th><th></th></tr></thead>
          <tbody>
            {rows.map((r:any)=>(
              <tr key={r.id}>
                <td className="code">{String(r.id).slice(0,8)}</td>
                <td>{r.created_at}</td>
                <td>{r.metodo_pago}</td>
                <td>${(r.total||0).toLocaleString('es-CO')}</td>
                <td>{r.anulada? 'Sí':'No'}</td>
                <td><Link className="btn secondary" to={`/sales/${r.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
