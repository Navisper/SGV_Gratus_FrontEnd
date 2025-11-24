import React, { useState, useEffect } from 'react'
import { productsAPI, customersAPI, salesAPI, invoicesAPI } from '../services/api'
import { Search, Plus, Minus, Trash2, Receipt, Barcode, X } from 'lucide-react'
import './SalesPage.css'

const SalesPage = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [cart, setCart] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState('nombre')
    const [selectedCustomer, setSelectedCustomer] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('efectivo')
    const [discount, setDiscount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showAddById, setShowAddById] = useState(false)
    const [productId, setProductId] = useState('')

    useEffect(() => {
        loadProducts()
        loadCustomers()
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
        }
    }

    const loadCustomers = async () => {
        try {
            const response = await customersAPI.list('', 1000)
            setCustomers(response.data)
        } catch (error) {
            console.error('Error loading customers:', error)
        }
    }

    const filterProducts = () => {
        if (!searchTerm.trim()) {
            setFilteredProducts([])
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

    const addToCart = (product) => {
        if ((product.stock || 0) <= 0) {
            alert('Producto sin stock disponible')
            return
        }

        const existingItem = cart.find(item => item.codigo_unico === product.codigo_unico)

        if (existingItem) {
            if (existingItem.cantidad >= (product.stock || 0)) {
                alert('No hay suficiente stock disponible')
                return
            }
            setCart(cart.map(item =>
                item.codigo_unico === product.codigo_unico
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ))
        } else {
            setCart([...cart, {
                ...product,
                cantidad: 1,
                precio_unitario: product.precio || 0
            }])
        }

        setSearchTerm('')
        setFilteredProducts([])
    }

    const addProductById = async () => {
        if (!productId.trim()) {
            alert('Por favor ingrese un código de producto')
            return
        }

        try {
            const response = await productsAPI.getByCode(productId.trim())
            const product = response.data
            addToCart(product)
            setProductId('')
            setShowAddById(false)
        } catch (error) {
            console.error('Error fetching product:', error)
            alert('Producto no encontrado: ' + (error.response?.data?.detail || 'Código inválido'))
        }
    }

    const updateQuantity = (codigo_unico, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(codigo_unico)
            return
        }

        const product = products.find(p => p.codigo_unico === codigo_unico)
        if (newQuantity > (product?.stock || 0)) {
            alert('No hay suficiente stock disponible')
            return
        }

        setCart(cart.map(item =>
            item.codigo_unico === codigo_unico
                ? { ...item, cantidad: newQuantity }
                : item
        ))
    }

    const removeFromCart = (codigo_unico) => {
        setCart(cart.filter(item => item.codigo_unico !== codigo_unico))
    }

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubtotal()
        return Math.max(0, subtotal - discount)
    }

    const handleSale = async () => {
        if (cart.length === 0) {
            alert('Agregue productos a la venta')
            return
        }

        setLoading(true)
        try {
            const saleData = {
                metodo_pago: paymentMethod,
                descuento: discount,
                items: cart.map(item => ({
                    codigo_unico: item.codigo_unico,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario
                }))
            }

            if (selectedCustomer && paymentMethod === 'credito') {
                saleData.customer_id = selectedCustomer
            }

            const response = await salesAPI.create(saleData)

            if (paymentMethod !== 'credito') {
                await invoicesAPI.generate(response.data.sale_id)
            }

            alert('Venta realizada exitosamente')
            setCart([])
            setDiscount(0)
            setSelectedCustomer('')
            setPaymentMethod('efectivo')
            setSearchTerm('')
            setFilteredProducts([])
        } catch (error) {
            console.error('Error creating sale:', error)
            alert('Error al realizar la venta: ' + (error.response?.data?.detail || error.message))
        } finally {
            setLoading(false)
        }
    }

    const clearSearch = () => {
        setSearchTerm('')
        setFilteredProducts([])
    }

    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)

    return (
        <div className="sales-page">
            <div className="sales-container">
                {/* Panel Principal */}
                <div className="sales-main-panel">
                    {/* Header */}
                    <div className="sales-header">
                        <h1 className="sales-title">Punto de Venta</h1>
                        <p className="sales-subtitle">Busque y agregue productos para realizar una venta</p>
                    </div>

                    {/* Panel de Búsqueda */}
                    <div className="search-panel">
                        <div className="search-header">
                            <h2 className="search-title">Buscar Productos</h2>
                            <div className="search-toggle">
                                <button
                                    className={`toggle-btn ${!showAddById ? 'active' : ''}`}
                                    onClick={() => setShowAddById(false)}
                                >
                                    <Search className="w-4 h-4" />
                                    Búsqueda
                                </button>
                                <button
                                    className={`toggle-btn ${showAddById ? 'active' : ''}`}
                                    onClick={() => setShowAddById(true)}
                                >
                                    <Barcode className="w-4 h-4" />
                                    Por Código
                                </button>
                            </div>
                        </div>

                        {/* Búsqueda por ID */}
                        {showAddById && (
                            <div className="id-search-panel">
                                <div className="id-search-title">
                                    <Barcode className="w-4 h-4" />
                                    Ingresar Código de Producto
                                </div>
                                <div className="id-search-input">
                                    <input
                                        type="text"
                                        placeholder="Ej: PROD-001"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addProductById()}
                                        className="id-input"
                                    />
                                    <button
                                        onClick={addProductById}
                                        className="id-add-btn"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Búsqueda Normal */}
                        {!showAddById && (
                            <div className="normal-search">
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="search-type-select"
                                >
                                    <option value="nombre">Por Nombre</option>
                                    <option value="codigo">Por Código</option>
                                </select>

                                <div className="search-input-container">
                                    <Search className="search-icon w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder={`Buscar por ${searchType === 'nombre' ? 'nombre del producto' : 'código'}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="clear-search"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resultados de Búsqueda */}
                    {!showAddById && filteredProducts.length > 0 && (
                        <div className="search-panel">
                            <h3 className="search-title">
                                Productos Encontrados ({filteredProducts.length})
                            </h3>
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.codigo_unico}
                                        className="product-card"
                                        onClick={() => addToCart(product)}
                                    >
                                        <h4 className="product-name">{product.nombre}</h4>
                                        <p className="product-code">{product.codigo_unico}</p>
                                        <div className="product-footer">
                                            <span className="product-price">${product.precio || 0}</span>
                                            <span className={`product-stock ${(product.stock || 0) > 0 ? 'stock-available' : 'stock-unavailable'
                                                }`}>
                                                Stock: {product.stock || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estados Vacíos */}
                    {!showAddById && searchTerm && filteredProducts.length === 0 && (
                        <div className="search-panel">
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3 className="empty-title">No se encontraron productos</h3>
                                <p className="empty-subtitle">Intente con otros términos de búsqueda</p>
                            </div>
                        </div>
                    )}

                    {!showAddById && !searchTerm && (
                        <div className="search-panel">
                            <div className="empty-state">
                                <div className="empty-icon">🛒</div>
                                <h3 className="empty-title">Busque productos para comenzar</h3>
                                <p className="empty-subtitle">
                                    Use la búsqueda por nombre o código para encontrar productos
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel Lateral */}
                <div className="sales-sidebar">
                    {/* Carrito */}
                    <div className="cart-panel">
                        <div className="cart-header">
                            <h2 className="cart-title">Carrito de Venta</h2>
                            {cart.length > 0 && (
                                <span className="cart-count">{totalItems} items</span>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <div className="cart-empty">
                                <div className="cart-empty-icon">🛒</div>
                                <p className="empty-title">Carrito vacío</p>
                                <p className="empty-subtitle">Agregue productos para continuar</p>
                            </div>
                        ) : (
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.codigo_unico} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4 className="cart-item-name">{item.nombre}</h4>
                                            <p className="cart-item-price">${item.precio_unitario} c/u</p>
                                            <p className="cart-item-code">{item.codigo_unico}</p>
                                        </div>

                                        <div className="cart-item-controls">
                                            <button
                                                onClick={() => updateQuantity(item.codigo_unico, item.cantidad - 1)}
                                                className="quantity-btn decrease"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>

                                            <span className="quantity-display">{item.cantidad}</span>

                                            <button
                                                onClick={() => updateQuantity(item.codigo_unico, item.cantidad + 1)}
                                                className="quantity-btn increase"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>

                                            <button
                                                onClick={() => removeFromCart(item.codigo_unico)}
                                                className="remove-btn"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resumen */}
                    <div className="summary-panel">
                        <h2 className="summary-title">Resumen de Venta</h2>

                        <div className="summary-line">
                            <span className="summary-label">Subtotal:</span>
                            <span className="summary-value">${calculateSubtotal().toFixed(2)}</span>
                        </div>

                        <div className="summary-line">
                            <span className="summary-label">Descuento:</span>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                className="discount-input"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="summary-line summary-total">
                            <span className="summary-label">Total:</span>
                            <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Método de Pago</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-select"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="credito">Crédito</option>
                            </select>
                        </div>

                        {paymentMethod === 'credito' && (
                            <div className="form-group">
                                <label className="form-label">Cliente</label>
                                <select
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleSale}
                            disabled={loading || cart.length === 0 || (paymentMethod === 'credito' && !selectedCustomer)}
                            className="sale-btn"
                        >
                            <Receipt className="w-5 h-5" />
                            {loading ? 'Procesando...' : 'Realizar Venta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesPage