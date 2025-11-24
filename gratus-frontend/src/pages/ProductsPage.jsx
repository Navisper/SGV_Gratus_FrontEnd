/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import './ProductsPage.css'

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState('nombre')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [loading, setLoading] = useState(false)

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
        <div className="products-page">
            <div className="products-container">
                {/* Header */}
                <div className="products-header">
                    <div>
                        <h1 className="products-title">Gestión de Productos</h1>
                        <p className="sales-subtitle">Administra y organiza tu inventario de productos</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="new-product-btn"
                    >
                        <Plus className="icon" />
                        <span>Nuevo Producto</span>
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="search-panel">
                    <div className="search-controls">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="search-type-select"
                        >
                            <option value="nombre">Buscar por Nombre</option>
                            <option value="codigo">Buscar por Código</option>
                        </select>

                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder={`Buscar productos por ${searchType === 'nombre' ? 'nombre' : 'código'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                {showForm && (
                    <div className="product-form-panel">
                        <h2 className="form-title">
                            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>

                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-group">
                                <label className="form-label">
                                    Código Único {!editingProduct && '*'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.codigo_unico}
                                    onChange={(e) => setFormData({ ...formData, codigo_unico: e.target.value })}
                                    className="form-input"
                                    required={!editingProduct}
                                    disabled={!!editingProduct}
                                    maxLength={50}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="form-input"
                                    required
                                    maxLength={150}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Categoría
                                </label>
                                <input
                                    type="text"
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    className="form-input"
                                    placeholder="Opcional"
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Departamento
                                </label>
                                <input
                                    type="text"
                                    value={formData.departamento}
                                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                    className="form-input"
                                    placeholder="Opcional"
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Tipo
                                </label>
                                <input
                                    type="text"
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    className="form-input"
                                    placeholder="Opcional"
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Costo
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.costo}
                                    onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="form-input"
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="cancel-btn"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner"></div>
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
                <div className="products-list-panel">
                    <h2 className="list-title">
                        Lista de Productos {filteredProducts.length > 0 && `(${filteredProducts.length})`}
                    </h2>

                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <div className="empty-title">
                                {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                            </div>
                            <div className="empty-subtitle">
                                {!searchTerm && 'Comienza agregando tu primer producto'}
                            </div>
                        </div>
                    ) : (
                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.codigo_unico}>
                                            <td className="code-cell">{product.codigo_unico}</td>
                                            <td className="name-cell">
                                                <div>{product.nombre}</div>
                                                {product.tipo && (
                                                    <div className="type-text">{product.tipo}</div>
                                                )}
                                            </td>
                                            <td>
                                                {product.categoria && (
                                                    <span className="category-badge">
                                                        {product.categoria}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="price-cell">
                                                {product.precio ? `$${product.precio}` : '-'}
                                            </td>
                                            <td>
                                                <span className={`stock-badge ${(product.stock || 0) > 0 ? 'stock-available' : 'stock-unavailable'}`}>
                                                    {product.stock || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="action-btn edit-btn"
                                                        title="Editar producto"
                                                    >
                                                        <Edit className="icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.codigo_unico)}
                                                        className="action-btn delete-btn"
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 className="icon" />
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
        </div>
    )
}

export default ProductsPage