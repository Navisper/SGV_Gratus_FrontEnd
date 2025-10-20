
import { useParams } from 'react-router-dom'

export default function InvoicePrint(){
  const { saleId } = useParams()
  return (
    <div className="card">
      <h1>Factura para venta {saleId}</h1>
      <p>Después de generar la factura desde el detalle de la venta, imprime/descarga desde el backend.</p>
    </div>
  )
}
