
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SalesAPI, InvoicesAPI } from '../../services/api'
import { useToast } from '../../ui/Toast'

export default function SaleDetail(){
  const { saleId } = useParams()
  const [sale,setSale]=useState<any>(null)
  const { show } = useToast()

  useEffect(()=>{ SalesAPI.get(saleId!).then(setSale).catch(e=>show(e.message,'error')) },[saleId])

  const genInvoice = async()=>{
    try{ await InvoicesAPI.generate(saleId!); show('Factura generada','ok') }catch(err:any){ show(err.message,'error') }
  }
  const cancel = async()=>{
    if (!confirm('¿Anular venta?')) return
    try{ await SalesAPI.cancel(saleId!); show('Venta anulada','ok') }catch(err:any){ show(err.message,'error') }
  }

  if (!sale) return <div className="card">Cargando...</div>
  return (
    <div className="grid">
      <div className="row">
        <h1>Venta {String(sale.id).slice(0,8)}</h1>
        <span className="spacer" />
        <button className="btn secondary" onClick={genInvoice}>Generar factura</button>
        <button className="btn danger" onClick={cancel}>Anular</button>
      </div>
      <div className="card">
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          <div><div className="label">Fecha</div><div>{sale.created_at}</div></div>
          <div><div className="label">Total</div><div>$ {sale.total?.toLocaleString?.('es-CO')}</div></div>
          <div><div className="label">Pago</div><div>{sale.metodo_pago}</div></div>
        </div>
        <div className="hr"></div>
        <table className="table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Cant</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {sale.items?.map((it:any)=>(
              <tr key={it.id}>
                <td className="code">{it.codigo_unico}</td>
                <td>{it.nombre}</td>
                <td>{it.cantidad}</td>
                <td>${it.precio_unitario?.toLocaleString?.('es-CO')}</td>
                <td>${it.subtotal?.toLocaleString?.('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/sales/new" className="btn">Nueva venta</Link>
    </div>
  )
}
