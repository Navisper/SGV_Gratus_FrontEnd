import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { SalesAPI, InvoicesAPI } from '../../services/api'
import { useToast } from '../../components/ui/ToastProvider'

export default function SaleDetail() {
  const { sale_id } = useParams()
  const [sale, setSale] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const { show } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!sale_id) return
    SalesAPI.get(sale_id).then(setSale).catch((e:any)=>show(e.message,'Error'))
  }, [sale_id])

  const generateInvoice = async () => {
    if (!sale_id) return
    try {
      const inv = await InvoicesAPI.generate(sale_id) as any
      setInvoice(inv)
    } catch (e:any) {
      show(e.message, 'Error')
    }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Detalle de venta</h1>
      {!sale ? <div className="card">Cargando...</div> : (
        <div className="card grid gap-2">
          <div className="text-sm text-gray-500">ID: {sale.id}</div>
          <div className="text-sm text-gray-500">Fecha: {new Date(sale.fecha || sale.created_at || Date.now()).toLocaleString()}</div>
          <div className="overflow-auto">
            <table className="table">
              <thead><tr><th className="th">Código</th><th className="th">Nombre</th><th className="th">Cantidad</th><th className="th">Precio</th><th className="th">Subtotal</th></tr></thead>
              <tbody>
                {sale.items?.map((it:any) => (
                  <tr key={it.codigo_unico}>
                    <td className="td">{it.codigo_unico}</td>
                    <td className="td">{it.nombre}</td>
                    <td className="td">{it.cantidad}</td>
                    <td className="td">${it.precio_unitario}</td>
                    <td className="td">${it.precio_unitario * it.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right font-semibold">Total: ${sale.total}</div>

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={generateInvoice}>Generar factura</button>
            {invoice && (
              <Link className="btn btn-ghost" to={`/invoices/print/${invoice.id || invoice.consecutivo}`}>Imprimir comprobante</Link>
            )}
            <button className="btn btn-ghost" onClick={()=>navigate(-1)}>Volver</button>
          </div>
        </div>
      )}
    </div>
  )
}
