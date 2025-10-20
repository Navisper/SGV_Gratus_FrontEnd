
import { useState } from 'react'
import { SalesAPI, ProductsAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../ui/Toast'

type PosItem = { codigo_unico: string; nombre: string; cantidad: number; precio_unitario: number; subtotal: number }

export default function SalesPOS() {
  const [code, setCode] = useState('')
  const [qty, setQty] = useState(1)
  const [items, setItems] = useState<PosItem[]>([])
  const [descuento, setDescuento] = useState(0)
  const { show } = useToast()
  const nav = useNavigate()

  const addByCode = async () => {
    if (!code) return
    try {
      const p = await ProductsAPI.get(code)
      const price = Number(p.precio || 0)
      const existing = items.find(i => i.codigo_unico === code)
      if (existing) {
        existing.cantidad += qty
        existing.subtotal = existing.cantidad * existing.precio_unitario
        setItems([...items])
      } else {
        setItems([...items, { codigo_unico: code, nombre: p.nombre, cantidad: qty, precio_unitario: price, subtotal: price * qty }])
      }
      setCode(''); setQty(1)
    } catch (err: any) { show(err.message, 'error') }
  }

  const total = items.reduce((a, b) => a + b.subtotal, 0) - (descuento || 0)

  const checkout = async () => {
    try {
      const payload = {
        items: items.map(i => ({
          codigo_unico: i.codigo_unico,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
        })),
        descuento,
        metodo_pago: 'efectivo',
      };

      const resp = await SalesAPI.create(payload);

      // Tolerante al nombre del campo
      const saleId =
        resp?.id ??
        resp?.sale_id ??
        resp?.data?.id ??
        resp?.data?.sale_id;

      if (!saleId) {
        show('No se recibió el ID de la venta; revisa la respuesta del backend', 'error');
        console.debug('Respuesta POST /sales/', resp);
        return;
      }
      show('Venta creada', 'ok');
      nav(`/sales/${saleId}`);
    } catch (err: any) {
      show(err.message, 'error');
    }
  };

  return (
    <div className="grid">
      <h1>Punto de Venta</h1>
      <div className="card">
        <div className="row">
          <input className="input" placeholder="Código del producto" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addByCode() }} />
          <input className="input" style={{ width: 120 }} type="number" value={qty} onChange={e => setQty(+e.target.value)} />
          <button className="btn" onClick={addByCode}>Agregar</button>
          <span className="spacer" />
          <label>Descuento <input className="input" style={{ width: 160 }} type="number" value={descuento} onChange={e => setDescuento(+e.target.value)} /></label>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx}>
                <td className="code">{i.codigo_unico}</td>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>${i.precio_unitario.toLocaleString('es-CO')}</td>
                <td>${i.subtotal.toLocaleString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={4} style={{ textAlign: 'right' }}>TOTAL</td><td>${total.toLocaleString('es-CO')}</td></tr></tfoot>
        </table>
      </div>
      <div className="row">
        <button className="btn" onClick={checkout} disabled={!items.length}>Confirmar venta</button>
      </div>
    </div>
  )
}
