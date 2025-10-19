import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductsAPI } from '../../services/api'
import { useToast } from '../../components/ui/ToastProvider'

const Schema = z.object({
  codigo_unico: z.string().min(1, 'Requerido'),
  nombre: z.string().min(1, 'Requerido'),
  precio: z.coerce.number().min(0, '>= 0').optional(),
  costo: z.coerce.number().min(0, '>= 0').optional(),
  stock: z.coerce.number().min(0, '>= 0').optional(),
})
type Form = z.infer<typeof Schema>

export default function ProductForm() {
  const { codigo_unico } = useParams()
  const isEdit = !!codigo_unico
  const navigate = useNavigate()
  const { show } = useToast()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: { codigo_unico: '', nombre: '', precio: 0, costo: 0, stock: 0 }
  })

  useEffect(() => {
    if (isEdit) {
      ProductsAPI.get(codigo_unico!).then((d:any) => {
        for (const k of Object.keys(d)) (setValue as any)(k, d[k])
      }).catch((e:any) => show(e.message, 'Error'))
    }
  }, [codigo_unico])

  const save = async (data: Form) => {
    try {
      if (isEdit) await ProductsAPI.update(codigo_unico!, data)
      else await ProductsAPI.create(data)
      show('Producto guardado', 'Éxito')
      navigate('/products')
    } catch (e: any) {
      show(e.message, 'Error')
    }
  }

  return (
    <form className="card grid gap-3 max-w-xl" onSubmit={handleSubmit(save)}>
      <h1 className="text-xl font-semibold">{isEdit ? 'Editar' : 'Nuevo'} producto</h1>
      <label className="label">Código único</label>
      <input className="input" disabled={isEdit} {...register('codigo_unico')} />
      {errors.codigo_unico && <p className="text-red-600 text-sm">{errors.codigo_unico.message}</p>}

      <label className="label">Nombre</label>
      <input className="input" {...register('nombre')} />
      {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Precio</label>
          <input className="input" type="number" step="0.01" {...register('precio')} />
          {errors.precio && <p className="text-red-600 text-sm">{errors.precio.message}</p>}
        </div>
        <div>
          <label className="label">Costo</label>
          <input className="input" type="number" step="0.01" {...register('costo')} />
          {errors.costo && <p className="text-red-600 text-sm">{errors.costo.message}</p>}
        </div>
      </div>

      <label className="label">Stock</label>
      <input className="input" type="number" {...register('stock')} />
      {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}

      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={()=>history.back()}>Cancelar</button>
      </div>
    </form>
  )
}
