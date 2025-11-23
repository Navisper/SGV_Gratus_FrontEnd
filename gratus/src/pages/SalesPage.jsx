import React, { useState, useEffect } from 'react';
import { productsAPI, customersAPI, salesAPI, invoicesAPI } from '../services/api';
import { Search, Plus, Minus, Trash2, Receipt } from 'lucide-react';

const SalesPage = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCustomers();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.list(0, 1000);
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await customersAPI.list('', 1000);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.codigo_unico === product.codigo_unico);

        if (existingItem) {
            setCart(cart.map(item =>
                item.codigo_unico === product.codigo_unico
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                ...product,
                cantidad: 1,
                precio_unitario: product.precio || 0
            }]);
        }
    };

    const updateQuantity = (codigo_unico, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(codigo_unico);
            return;
        }
        setCart(cart.map(item =>
            item.codigo_unico === codigo_unico
                ? { ...item, cantidad: newQuantity }
                : item
        ));
    };

    const removeFromCart = (codigo_unico) => {
        setCart(cart.filter(item => item.codigo_unico !== codigo_unico));
    };

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return Math.max(0, subtotal - discount);
    };

    const handleSale = async () => {
        if (cart.length === 0) {
            alert('Agregue productos a la venta');
            return;
        }

        setLoading(true);
        try {
            const saleData = {
                metodo_pago: paymentMethod,
                descuento: discount,
                items: cart.map(item => ({
                    codigo_unico: item.codigo_unico,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario
                }))
            };

            if (selectedCustomer && paymentMethod === 'credito') {
                saleData.customer_id = selectedCustomer;
            }

            const response = await salesAPI.create(saleData);

            // Generar factura si no es crédito
            if (paymentMethod !== 'credito') {
                await invoicesAPI.generate(response.data.sale_id);
            }

            alert('Venta realizada exitosamente');
            setCart([]);
            setDiscount(0);
            setSelectedCustomer('');
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Error al realizar la venta: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo_unico?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Productos */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Productos</h2>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.codigo_unico}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => addToCart(product)}
                            >
                                <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
                                <p className="text-sm text-gray-600">{product.codigo_unico}</p>
                                <p className="text-lg font-bold text-green-600 mt-2">
                                    ${product.precio || 0}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Stock: {product.stock || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carrito y Resumen */}
            <div className="space-y-6">
                {/* Carrito */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Carrito de Venta</h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.codigo_unico} className="flex items-center justify-between border-b pb-3">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                                        <p className="text-sm text-gray-600">${item.precio_unitario} x {item.cantidad}</p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.codigo_unico, item.cantidad - 1)}
                                            className="p-1 text-gray-500 hover:text-red-600"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <span className="w-8 text-center">{item.cantidad}</span>

                                        <button
                                            onClick={() => updateQuantity(item.codigo_unico, item.cantidad + 1)}
                                            className="p-1 text-gray-500 hover:text-green-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => removeFromCart(item.codigo_unico)}
                                            className="p-1 text-gray-500 hover:text-red-600 ml-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumen de Venta */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Resumen de Venta</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Descuento:</span>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Método de Pago
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>

                    {/* Cliente para crédito */}
                    {paymentMethod === 'credito' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cliente
                            </label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <Receipt className="w-5 h-5" />
                        <span>{loading ? 'Procesando...' : 'Realizar Venta'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;