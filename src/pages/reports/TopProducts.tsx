import { useEffect, useState } from 'react'
import { ReportsAPI } from '../../services/api'
import { useToast } from '../../components/ui/ToastProvider'

type Row = { codigo_unico: string; nombre: string; unidades: number; vendido: number; utilidad_estimada: number }

export default function TopProducts() {
  const [rows, setRows] = useState<Row[]>([])
  const { show } = useToast()
  useEffect(() => { ReportsAPI.topProducts().then(setRows).catch((e:any)=>show(e.message,'Error')) }, [])
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Top productos</h1>
      <div className="card overflow-auto">
        <table className="table">
          <thead><tr><th className="th">Código</th><th className="th">Nombre</th><th className="th">Unidades</th><th className="th">Vendido</th><th className="th">Utilidad Estimada</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.codigo_unico}>
                <td className="td">{r.codigo_unico}</td>
                <td className="td">{r.nombre}</td>
                <td className="td">{r.unidades}</td>
                <td className="td">${r.vendido}</td>
                <td className="td">${r.utilidad_estimada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
