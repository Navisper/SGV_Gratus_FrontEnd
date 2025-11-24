/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import { Plus, Search, Edit, Trash2, Barcode, Filter } from 'lucide-react'

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState('nombre')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    // Usar SOLO los campos que existen en la base de datos
    const [formData, setFormData] = useState({
        codigo_unico: '',
        nombre: '',
        categoria: '',
        departamento: '',
        tipo: '',
        precio: '',
        costo: '',
        stock: ''
    })

    useEffect(() => {
        loadProducts()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [products, searchTerm, searchType])

    const loadProducts = async () => {
        try {
            const response = await productsAPI.list(0, 1000)
            setProducts(response.data)
        } catch (error) {
            console.error('Error loading products:', error)
            alert('Error al cargar productos: ' + (error.response?.data?.detail || error.message))
        }
    }

    const filterProducts = () => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products)
            return
        }

        const filtered = products.filter(product => {
            if (searchType === 'nombre') {
                return product.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            } else {
                return product.codigo_unico?.toLowerCase().includes(searchTerm.toLowerCase())
            }
        })

        setFilteredProducts(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos SOLO con campos que existen en la base de datos
            const productData = {
                nombre: formData.nombre,
                categoria: formData.categoria || null,
                departamento: formData.departamento || null,
                tipo: formData.tipo || null,
                precio: formData.precio ? parseFloat(formData.precio) : null,
                costo: formData.costo ? parseFloat(formData.costo) : null,
                stock: formData.stock ? parseInt(formData.stock) : null
            }

            if (editingProduct) {
                await productsAPI.update(editingProduct.codigo_unico, productData)
            } else {
                // Para crear, incluir código único
                await productsAPI.create({
                    ...productData,
                    codigo_unico: formData.codigo_unico
                })
            }

            await loadProducts()
            resetForm()
            alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente')
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Error al guardar el producto: ' + (error.response?.data?.detail || error.message))
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            codigo_unico: product.codigo_unico || '',
            nombre: product.nombre || '',
            categoria: product.categoria || '',
            departamento: product.departamento || '',
            tipo: product.tipo || '',
            precio: product.precio || '',
            costo: product.costo || '',
            stock: product.stock || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (codigo_unico) => {
        if (!confirm('¿Está seguro de eliminar este producto?')) return

        try {
            await productsAPI.delete(codigo_unico)
            await loadProducts()
            alert('Producto eliminado exitosamente')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Error al eliminar el producto: ' + (error.response?.data?.detail || error.message))
        }
    }

    const resetForm = () => {
        setFormData({
            codigo_unico: '',
            nombre: '',
            categoria: '',
            departamento: '',
            tipo: '',
            precio: '',
            costo: '',
            stock: ''
        })
        setEditingProduct(null)
        setShowForm(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-4 items-center mb-4">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="nombre">Buscar por Nombre</option>
                        <option value="codigo">Buscar por Código</option>
                    </select>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Buscar productos por ${searchType === 'nombre' ? 'nombre' : 'código'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código Único {!editingProduct && '*'}
                            </label>
                            <input
                                type="text"
                                value={formData.codigo_unico}
                                onChange={(e) => setFormData({ ...formData, codigo_unico: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required={!editingProduct}
                                disabled={!!editingProduct}
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength={150}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <input
                                type="text"
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                value={formData.departamento}
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <input
                                type="text"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Costo
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.costo}
                                onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <span>{editingProduct ? 'Actualizar' : 'Crear'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Productos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Lista de Productos {filteredProducts.length > 0 && `(${filteredProducts.length})`}
                </h2>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Código</th>
                                    <th className="text-left py-3 px-4">Nombre</th>
                                    <th className="text-left py-3 px-4">Categoría</th>
                                    <th className="text-left py-3 px-4">Precio</th>
                                    <th className="text-left py-3 px-4">Stock</th>
                                    <th className="text-left py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.codigo_unico} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">{product.codigo_unico}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{product.nombre}</div>
                                            {product.tipo && (
                                                <div className="text-sm text-gray-600">{product.tipo}</div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {product.categoria && (
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {product.categoria}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {product.precio ? `$${product.precio}` : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${(product.stock || 0) > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                    title="Editar producto"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.codigo_unico)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductsPage