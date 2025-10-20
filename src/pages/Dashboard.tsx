
import { useEffect, useState } from 'react'
import { ReportsAPI } from '../services/api'
import { useToast } from '../ui/Toast'

export default function Dashboard(){
  const [summary,setSummary]=useState<any>(null)
  const { show } = useToast()
  useEffect(()=>{ ReportsAPI.summary().then(setSummary).catch(e=>show(e.message,'error')) },[])
  return (
    <div className="grid">
      <h1>Panel</h1>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
        <div className="card kpi"><div className="label">Productos</div><div className="value">{summary?.num_productos ?? '-'}</div></div>
        <div className="card kpi"><div className="label">Ventas</div><div className="value">{summary?.num_ventas ?? '-'}</div></div>
        <div className="card kpi"><div className="label">Total vendido</div><div className="value">$ {summary?.total_vendido?.toLocaleString?.('es-CO') ?? '-'}</div></div>
      </div>
      <div className="muted">Resumen desde <span className="code">/reports/summary</span></div>
    </div>
  )
}
