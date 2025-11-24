import React, { useState, useEffect } from 'react'
import { customersAPI } from '../services/api'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

const CustomersPage = () => {
    const [customers, setCustomers] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [loading, setLoading] = useState(false)

    // Usar SOLO los campos que existen en la base de datos
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        direccion: ''
    })

    useEffect(() => {
        loadCustomers()
    }, [])

    useEffect(() => {
        filterCustomers()
    }, [customers, searchTerm])

    const loadCustomers = async () => {
        try {
            const response = await customersAPI.list('', 1000)
            setCustomers(response.data)
        } catch (error) {
            console.error('Error loading customers:', error)
            alert('Error al cargar clientes: ' + (error.response?.data?.detail || error.message))
        }
    }

    const filterCustomers = () => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers)
            return
        }

        const filtered = customers.filter(customer =>
            customer.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.telefono?.includes(searchTerm)
        )

        setFilteredCustomers(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos SOLO con campos que existen en la base de datos
            const customerData = {
                nombre: formData.nombre,
                telefono: formData.telefono || null,
                email: formData.email || null,
                direccion: formData.direccion || null
            }

            if (editingCustomer) {
                await customersAPI.update(editingCustomer.id, customerData)
            } else {
                await customersAPI.create(customerData)
            }

            await loadCustomers()
            resetForm()
            alert(editingCustomer ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente')
        } catch (error) {
            console.error('Error saving customer:', error)
            alert('Error al guardar el cliente: ' + (error.response?.data?.detail || error.message))
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (customer) => {
        setEditingCustomer(customer)
        setFormData({
            nombre: customer.nombre || '',
            telefono: customer.telefono || '',
            email: customer.email || '',
            direccion: customer.direccion || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Está seguro de eliminar este cliente?')) return

        try {
            await customersAPI.delete(id)
            await loadCustomers()
            alert('Cliente eliminado exitosamente')
        } catch (error) {
            console.error('Error deleting customer:', error)
            alert('Error al eliminar el cliente: ' + (error.response?.data?.detail || error.message))
        }
    }

    const resetForm = () => {
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            direccion: ''
        })
        setEditingCustomer(null)
        setShowForm(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Cliente</span>
                </button>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar clientes por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre Completo *
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
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
                                maxLength={150}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <textarea
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Opcional"
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
                                    <span>{editingCustomer ? 'Actualizar' : 'Crear'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Lista de Clientes {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
                </h2>

                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Nombre</th>
                                    <th className="text-left py-3 px-4">Teléfono</th>
                                    <th className="text-left py-3 px-4">Email</th>
                                    <th className="text-left py-3 px-4">Dirección</th>
                                    <th className="text-left py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{customer.nombre}</td>
                                        <td className="py-3 px-4">
                                            {customer.telefono ? (
                                                <span className="text-blue-600">{customer.telefono}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {customer.email ? (
                                                <span className="text-blue-600">{customer.email}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {customer.direccion ? (
                                                <span className="text-sm text-gray-600">{customer.direccion}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(customer)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                    title="Editar cliente"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    title="Eliminar cliente"
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

export default CustomersPage