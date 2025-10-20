
import { Link } from 'react-router-dom'

export default function InvoicesHome(){
  return (
    <div className="card">
      <h1>Facturas</h1>
      <p>Genera la factura desde el detalle de la venta y luego imprímela.</p>
      <p>Ir a <Link to="/sales">Ventas</Link> para seleccionar una venta.</p>
    </div>
  )
}
