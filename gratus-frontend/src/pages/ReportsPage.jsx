import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { BarChart3, TrendingUp, Users, Package, Calendar, Filter } from 'lucide-react';
import './ReportsPage.css';

const ReportsPage = () => {
    const [summary, setSummary] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        loadReports();
    }, [timeRange]);

    const loadReports = async () => {
        try {
            const [summaryRes, topProductsRes] = await Promise.all([
                reportsAPI.summary(),
                reportsAPI.topProducts()
            ]);

            setSummary(summaryRes.data);
            setTopProducts(topProductsRes.data);
            
            // Datos de ejemplo para la gráfica (en una app real vendrían del API)
            generateSampleSalesData();
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSampleSalesData = () => {
        // Datos de ejemplo para demostración
        const sampleData = [
            { day: 'Lun', sales: 450, revenue: 1250 },
            { day: 'Mar', sales: 520, revenue: 1420 },
            { day: 'Mié', sales: 480, revenue: 1350 },
            { day: 'Jue', sales: 610, revenue: 1680 },
            { day: 'Vie', sales: 720, revenue: 1950 },
            { day: 'Sáb', sales: 680, revenue: 1820 },
            { day: 'Dom', sales: 550, revenue: 1520 }
        ];
        setSalesData(sampleData);
    };

    const getMaxRevenue = () => {
        return Math.max(...salesData.map(item => item.revenue));
    };

    const calculateBarHeight = (revenue, maxRevenue) => {
        const maxHeight = 160; // altura máxima en px
        return (revenue / maxRevenue) * maxHeight;
    };

    if (loading) {
        return (
            <div className="reports-page">
                <div className="reports-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    const maxRevenue = getMaxRevenue();

    return (
        <div className="reports-page">
            <div className="reports-container">
                {/* Header */}
                <div className="reports-header">
                    <h1 className="reports-title">Reportes y Estadísticas</h1>
                    <p className="reports-subtitle">Análisis detallado del rendimiento de tu negocio</p>
                </div>

                {/* Filtros */}
                <div className="filters-panel">
                    <div className="filter-controls">
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-500" size={18} />
                            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
                        </div>
                        <select 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="filter-select"
                        >
                            <option value="week">Última Semana</option>
                            <option value="month">Último Mes</option>
                            <option value="quarter">Último Trimestre</option>
                            <option value="year">Último Año</option>
                        </select>
                    </div>
                </div>

                {/* Resumen General */}
                {summary && (
                    <div className="metrics-grid">
                        <div className="metric-card products">
                            <div className="metric-content">
                                <div className="metric-icon products">
                                    <Package size={24} />
                                </div>
                                <div className="metric-info">
                                    <div className="metric-value">{summary.num_productos}</div>
                                    <div className="metric-label">Total Productos</div>
                                    <div className="metric-change positive">+12% vs mes anterior</div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card sales">
                            <div className="metric-content">
                                <div className="metric-icon sales">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="metric-info">
                                    <div className="metric-value">{summary.num_ventas}</div>
                                    <div className="metric-label">Ventas Totales</div>
                                    <div className="metric-change positive">+8% vs mes anterior</div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card revenue">
                            <div className="metric-content">
                                <div className="metric-icon revenue">
                                    <BarChart3 size={24} />
                                </div>
                                <div className="metric-info">
                                    <div className="metric-value">
                                        ${parseFloat(summary.total_vendido).toFixed(2)}
                                    </div>
                                    <div className="metric-label">Ingresos Totales</div>
                                    <div className="metric-change positive">+15% vs mes anterior</div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card customers">
                            <div className="metric-content">
                                <div className="metric-icon customers">
                                    <Users size={24} />
                                </div>
                                <div className="metric-info">
                                    <div className="metric-value">{(summary.num_ventas * 0.8).toFixed(0)}</div>
                                    <div className="metric-label">Clientes Activos</div>
                                    <div className="metric-change positive">+5% vs mes anterior</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gráficas y Análisis */}
                <div className="analytics-grid">
                    {/* Gráfica de Ventas */}
                    <div className="chart-panel">
                        <h2 className="panel-title">
                            <TrendingUp size={20} />
                            Tendencia de Ventas
                        </h2>
                        <div className="chart-container">
                            <div className="simple-chart">
                                <div className="chart-bars">
                                    {salesData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="chart-bar"
                                            style={{ 
                                                height: `${calculateBarHeight(item.revenue, maxRevenue)}px`,
                                                background: `linear-gradient(to top, #4f46e5, #8b5cf6)`
                                            }}
                                            title={`${item.day}: $${item.revenue}`}
                                        >
                                            <div className="chart-bar-tooltip">
                                                {item.day}: ${item.revenue}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="chart-labels">
                                    {salesData.map((item, index) => (
                                        <div key={index} className="chart-label">
                                            {item.day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos Top */}
                    <div className="side-panel">
                        <h2 className="panel-title">
                            <Package size={20} />
                            Top 5 Productos
                        </h2>
                        <div className="top-products-list">
                            {topProducts.slice(0, 5).map((product, index) => (
                                <div key={product.codigo_unico} className="top-product-item">
                                    <div className={`product-rank ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="product-info">
                                        <div className="product-name">{product.nombre}</div>
                                        <div className="product-code">{product.codigo_unico}</div>
                                    </div>
                                    <div className="product-stats">
                                        <div className="units-sold">{product.unidades} und</div>
                                        <div className="revenue">${parseFloat(product.vendido).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla Completa de Productos Más Vendidos */}
                <div className="products-table-panel">
                    <h2 className="panel-title">
                        <BarChart3 size={20} />
                        Productos Más Vendidos
                    </h2>
                    {topProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <div className="empty-title">No hay datos de ventas disponibles</div>
                            <div className="empty-subtitle">Los productos más vendidos aparecerán aquí</div>
                        </div>
                    ) : (
                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Unidades Vendidas</th>
                                        <th>Total Vendido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, index) => (
                                        <tr key={product.codigo_unico}>
                                            <td>
                                                <div className={`product-rank ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="product-cell">
                                                    <div className="product-main">{product.nombre}</div>
                                                    <div className="product-secondary">{product.codigo_unico}</div>
                                                </div>
                                            </td>
                                            <td className="units-cell">{product.unidades} unidades</td>
                                            <td className="revenue-cell">${parseFloat(product.vendido).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;