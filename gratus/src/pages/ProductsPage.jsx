/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        codigo_unico: '',
        nombre: '',
        descripcion: '',
        precio: '',
        costo: '',
        stock: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.list(0, 1000);
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                precio: parseFloat(formData.precio),
                costo: parseFloat(formData.costo) || 0,
                stock: parseInt(formData.stock) || 0
            };

            if (editingProduct) {
                await productsAPI.update(editingProduct.codigo_unico, productData);
            } else {
                await productsAPI.create(productData);
            }

            await loadProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            codigo_unico: product.codigo_unico,
            nombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: product.precio || '',
            costo: product.costo || '',
            stock: product.stock || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (codigo_unico) => {
        if (!confirm('¿Está seguro de eliminar este producto?')) return;

        try {
            await productsAPI.delete(codigo_unico);
            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto: ' + (error.response?.data?.detail || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            codigo_unico: '',
            nombre: '',
            descripcion: '',
            precio: '',
            costo: '',
            stock: ''
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const filteredProducts = products.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo_unico?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código Único *
                            </label>
                            <input
                                type="text"
                                value={formData.codigo_unico}
                                onChange={(e) => setFormData({ ...formData, codigo_unico: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={!!editingProduct}
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
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Búsqueda y Lista */}
            <div className="bg-white rounded-lg shadow-sm p-6">
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

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Código</th>
                                <th className="text-left py-3 px-4">Nombre</th>
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
                                        <div>
                                            <div className="font-medium">{product.nombre}</div>
                                            {product.descripcion && (
                                                <div className="text-sm text-gray-600">{product.descripcion}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">${product.precio || 0}</td>
                                    <td className="py-3 px-4">{product.stock || 0}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.codigo_unico)}
                                                className="p-1 text-red-600 hover:text-red-800"
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
            </div>
        </div>
    );
};

export default ProductsPage;