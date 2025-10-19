import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductsAPI } from '../../services/api'

type Product = { id: string; codigo_unico: string; nombre: string; precio?: number; costo?: number; stock?: number }

export default function ProductsList() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [minStock, setMinStock] = useState<number | ''>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const data = await ProductsAPI.list() as Product[]
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let arr = [...items]
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      arr = arr.filter(p => p.nombre?.toLowerCase().includes(s) || p.codigo_unico?.toLowerCase().includes(s))
    }
    if (minStock !== '') {
      arr = arr.filter(p => (p.stock ?? 0) >= Number(minStock))
    }
    return arr
  }, [items, q, minStock])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  useEffect(() => { if (page > totalPages) setPage(1) }, [totalPages])

  const exportCSV = () => {
  const headers = ['codigo_unico', 'nombre', 'precio', 'costo', 'stock'];

  // Escapa correctamente un valor para CSV (RFC 4180-friendly)
  const csvEscape = (val: unknown): string => {
    const s = val == null ? '' : String(val);
    // Doble comillas internas
    const escaped = s.replace(/"/g, '""');
    // Si contiene coma, comillas o salto de línea, envolver en comillas
    const needsQuotes = /[",\n]/.test(escaped);
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const rows = filtered.map(p => [
    p.codigo_unico ?? '',
    p.nombre ?? '',
    p.precio ?? '',
    p.costo ?? '',
    p.stock ?? ''
  ]);

  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map(r => r.map(csvEscape).join(','))
  ];

  // BOM para que Excel reconozca UTF-8 correctamente
  const csvContent = '\uFEFF' + lines.join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'productos.csv';
  a.click();
  URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <div className="flex items-center gap-2">
          <input className="input" placeholder="Buscar por nombre o código" value={q} onChange={e=>setQ(e.target.value)} />
          <input className="input w-40" type="number" min={0} placeholder="Stock mínimo" value={minStock} onChange={e=>setMinStock(e.target.value === '' ? '' : Number(e.target.value))} />
          <select className="input w-32" value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <button className="btn btn-ghost" onClick={exportCSV}>Exportar CSV</button>
          <Link to="/products/new" className="btn btn-primary">Nuevo producto</Link>
        </div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="card overflow-auto">
        <table className="table">
          <thead><tr>
            <th className="th">Código</th>
            <th className="th">Nombre</th>
            <th className="th">Precio</th>
            <th className="th">Costo</th>
            <th className="th">Stock</th>
            <th className="th"></th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td className="td" colSpan={6}>Cargando...</td></tr> :
              current.map(p => (
                <tr key={p.id}>
                  <td className="td">{p.codigo_unico}</td>
                  <td className="td">{p.nombre}</td>
                  <td className="td">${p.precio ?? '-'}</td>
                  <td className="td">${p.costo ?? '-'}</td>
                  <td className="td">{p.stock ?? 0}</td>
                  <td className="td flex gap-2">
                    <button className="btn btn-ghost" onClick={() => navigate(`/products/${p.codigo_unico}`)}>Editar</button>
                    <button className="btn btn-ghost" onClick={async () => { if (confirm('¿Eliminar?')) { await ProductsAPI.delete(p.codigo_unico); await load() }}}>Eliminar</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="btn btn-ghost" onClick={()=>setPage(p => Math.max(1, p-1))}>Anterior</button>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <button className="btn btn-ghost" onClick={()=>setPage(p => Math.min(totalPages, p+1))}>Siguiente</button>
      </div>
    </div>
  )
}
