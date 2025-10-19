import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InvoicesAPI } from '../../services/api'

export default function InvoicePrint() {
  const { invoice_id } = useParams()
  const [inv, setInv] = useState<any>(null)

  useEffect(() => {
    if (!invoice_id) return
    InvoicesAPI.get(invoice_id).then(setInv).catch(()=>{})
    setTimeout(() => window.print(), 500)
  }, [invoice_id])

  if (!inv) return <div className="min-h-screen grid place-items-center">Cargando factura...</div>

  return (
    <div className="p-6 max-w-lg mx-auto print:p-0">
      <div className="border rounded-2xl p-5">
        <h1 className="text-xl font-bold text-center">GRATUS - COMPROBANTE</h1>
        <div className="flex justify-between mt-2 text-sm">
          <div><span className="font-semibold">Factura:</span> {inv.consecutivo || inv.id}</div>
          <div><span className="font-semibold">Fecha:</span> {new Date(inv.fecha || Date.now()).toLocaleString()}</div>
        </div>

        <table className="table mt-4">
          <thead><tr><th className="th">Código</th><th className="th">Nombre</th><th className="th">Cant.</th><th className="th">Precio</th><th className="th">Subtotal</th></tr></thead>
          <tbody>
            {inv.items?.map((it:any) => (
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

        <div className="text-right font-semibold mt-3">Total: ${inv.total}</div>
        <p className="text-center text-xs mt-4">¡Gracias por su compra!</p>
      </div>
    </div>
  )
}
