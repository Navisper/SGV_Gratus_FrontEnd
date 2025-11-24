import React, { useState, useEffect } from 'react'
import { customersAPI } from '../services/api'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import './CustomersPage.css'

const CustomersPage = () => {
    const [customers, setCustomers] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [loading, setLoading] = useState(false)

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
        <div className="customers-page">
            <div className="customers-container">
                {/* Header */}
                <div className="customers-header">
                    <div>
                        <h1 className="customers-title">Gestión de Clientes</h1>
                        <p className="sales-subtitle">Administra la información de tus clientes</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="new-customer-btn"
                    >
                        <Plus className="icon" />
                        <span>Nuevo Cliente</span>
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="search-panel">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar clientes por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Formulario */}
                {showForm && (
                    <div className="customer-form-panel">
                        <h2 className="form-title">
                            {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h2>

                        <form onSubmit={handleSubmit} className="customer-form">
                            <div className="form-group full-width">
                                <label className="form-label">
                                    Nombre Completo *
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
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="form-input"
                                    placeholder="Opcional"
                                    maxLength={50}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                    placeholder="Opcional"
                                    maxLength={150}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Dirección
                                </label>
                                <textarea
                                    value={formData.direccion}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    rows="3"
                                    className="form-input form-textarea"
                                    placeholder="Opcional"
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
                                        <span>{editingCustomer ? 'Actualizar' : 'Crear'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de Clientes */}
                <div className="customers-list-panel">
                    <h2 className="list-title">
                        Lista de Clientes {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
                    </h2>

                    {filteredCustomers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <div className="empty-title">
                                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                            </div>
                            <div className="empty-subtitle">
                                {!searchTerm && 'Comienza agregando tu primer cliente'}
                            </div>
                        </div>
                    ) : (
                        <div className="customers-table-container">
                            <table className="customers-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Dirección</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="name-cell">{customer.nombre}</td>
                                            <td>
                                                {customer.telefono ? (
                                                    <a href={`tel:${customer.telefono}`} className="phone-link">
                                                        {customer.telefono}
                                                    </a>
                                                ) : (
                                                    <span className="empty-field">No especificado</span>
                                                )}
                                            </td>
                                            <td>
                                                {customer.email ? (
                                                    <a href={`mailto:${customer.email}`} className="email-link">
                                                        {customer.email}
                                                    </a>
                                                ) : (
                                                    <span className="empty-field">No especificado</span>
                                                )}
                                            </td>
                                            <td>
                                                {customer.direccion ? (
                                                    <span className="address-text">{customer.direccion}</span>
                                                ) : (
                                                    <span className="empty-field">No especificada</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className="action-btn edit-btn"
                                                        title="Editar cliente"
                                                    >
                                                        <Edit className="icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer.id)}
                                                        className="action-btn delete-btn"
                                                        title="Eliminar cliente"
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

export default CustomersPage