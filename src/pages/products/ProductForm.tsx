
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductsAPI } from '../../services/api'
import { useToast } from '../../ui/Toast'

export default function ProductForm(){
  const { codigo } = useParams()
  const isEdit = !!codigo
  const [data,setData]=useState<any>({ codigo_unico:'', nombre:'', categoria:'', costo:0, precio:0, stock:0 })
  const { show } = useToast()
  const nav = useNavigate()

  useEffect(()=>{
    if (isEdit) ProductsAPI.get(codigo!).then(setData).catch(e=>show(e.message,'error'))
  },[codigo])

  const save=async(e:any)=>{
    e.preventDefault()
    try{
      if (isEdit) await ProductsAPI.update(codigo!, data)
      else await ProductsAPI.create(data)
      show('Guardado','ok')
      nav('/products')
    }catch(err:any){ show(err.message,'error') }
  }

  return (
    <div className="card" style={{maxWidth:700}}>
      <h1>{isEdit ? 'Editar' : 'Nuevo'} producto</h1>
      <form className="grid" onSubmit={save}>
        <label>Código<input className="input" value={data.codigo_unico} onChange={e=>setData({...data, codigo_unico:e.target.value})} disabled={isEdit} /></label>
        <label>Nombre<input className="input" value={data.nombre} onChange={e=>setData({...data, nombre:e.target.value})} /></label>
        <label>Categoría<input className="input" value={data.categoria||''} onChange={e=>setData({...data, categoria:e.target.value})} /></label>
        <div className="row">
          <label style={{flex:1}}>Costo<input className="input" type="number" value={data.costo} onChange={e=>setData({...data, costo:+e.target.value})} /></label>
          <label style={{flex:1}}>Precio<input className="input" type="number" value={data.precio} onChange={e=>setData({...data, precio:+e.target.value})} /></label>
          <label style={{flex:1}}>Stock<input className="input" type="number" value={data.stock} onChange={e=>setData({...data, stock:+e.target.value})} /></label>
        </div>
        <div className="row">
          <button className="btn">Guardar</button>
        </div>
      </form>
    </div>
  )
}
