import { useState } from 'react'
import { ProductsAPI, SalesAPI } from '../../services/api'
import { useToast } from '../../components/ui/ToastProvider'
import { useNavigate } from 'react-router-dom'

type Item = { codigo_unico: string; nombre: string; cantidad: number; precio_unitario: number }

export default function SalesPOS() {
  const [code, setCode] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [descuento, setDescuento] = useState<number>(0)
  const [processing, setProcessing] = useState(false)
  const { show } = useToast()
  const navigate = useNavigate()

  const addByCode = async () => {
    if (!code.trim()) return
    try {
      const p = await ProductsAPI.get(code.trim()) as any
      const price = Number(p.precio || 0)
      setItems(prev => {
        const idx = prev.findIndex(i => i.codigo_unico === p.codigo_unico)
        if (idx >= 0) {
          const clone = [...prev]; clone[idx].cantidad += 1; return clone
        }
        return [...prev, { codigo_unico: p.codigo_unico, nombre: p.nombre, cantidad: 1, precio_unitario: price }]
      })
      setCode('')
    } catch (e: any) {
      show(e.message, 'Error')
    }
  }

  const total = items.reduce((acc, it) => acc + it.precio_unitario * it.cantidad, 0) - (descuento || 0)

  const submitSale = async () => {
    if (!items.length) return
    setProcessing(true)
    try {
      const payload = { items: items.map(i => ({ codigo_unico: i.codigo_unico, cantidad: i.cantidad, precio_unitario: i.precio_unitario })), descuento }
      const res = await SalesAPI.create(payload) as any
      setItems([]); setDescuento(0)
      show(`Venta #${res.sale_id || res.id} creada. Total: $${res.total}`, 'Éxito')
      navigate(`/sales/${res.sale_id || res.id}`)
    } catch (e: any) {
      show(e.message, 'Error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Punto de Venta</h1>
      <div className="card grid gap-3">
        <div className="flex gap-2">
          <input className="input" placeholder="Escanea o escribe código" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=> e.key==='Enter' && addByCode()} />
          <button className="btn btn-primary" onClick={addByCode}>Agregar</button>
        </div>
        <div className="overflow-auto">
          <table className="table">
            <thead><tr><th className="th">Código</th><th className="th">Nombre</th><th className="th">Cantidad</th><th className="th">Precio</th><th className="th">Subtotal</th><th className="th"></th></tr></thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.codigo_unico}>
                  <td className="td">{it.codigo_unico}</td>
                  <td className="td">{it.nombre}</td>
                  <td className="td">
                    <input type="number" min={1} className="input w-24" value={it.cantidad} onChange={e => {
                      const v = Number(e.target.value); setItems(prev => { const c=[...prev]; c[idx].cantidad = v; return c })
                    }} />
                  </td>
                  <td className="td">${it.precio_unitario}</td>
                  <td className="td">${it.precio_unitario * it.cantidad}</td>
                  <td className="td"><button className="btn btn-ghost" onClick={() => setItems(prev => prev.filter(x => x.codigo_unico !== it.codigo_unico))}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="label m-0">Descuento</span>
            <input type="number" className="input w-32" value={descuento} onChange={e=>setDescuento(Number(e.target.value))} />
          </div>
          <div className="text-xl font-semibold">Total: ${total}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={processing || items.length===0} onClick={submitSale}>
            {processing ? 'Procesando...' : 'Confirmar venta'}
          </button>
          <button className="btn btn-ghost" onClick={()=>{ setItems([]); setDescuento(0) }}>Vaciar</button>
        </div>
      </div>
    </div>
  )
}
