import { useEffect, useState } from 'react'
import { ReportsAPI } from '../services/api'
import { useToast } from '../components/ui/ToastProvider'

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null)
  const { show } = useToast()
  useEffect(() => {
    ReportsAPI.summary().then(setSummary).catch((e) => show(e.message, 'Error'))
  }, [])
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><div className="text-sm text-gray-500">Productos</div><div className="text-2xl font-bold">{summary?.num_productos ?? '-'}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Ventas (total)</div><div className="text-2xl font-bold">${summary?.total_vendido?.toLocaleString?.() ?? '-'}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Facturas</div><div className="text-2xl font-bold">{summary?.num_facturas ?? '-'}</div></div>
      </div>
    </div>
  )
}