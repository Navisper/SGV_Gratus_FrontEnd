import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';

const ReportsPage = () => {
    const [summary, setSummary] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const [summaryRes, topProductsRes] = await Promise.all([
                reportsAPI.summary(),
                reportsAPI.topProducts()
            ]);

            setSummary(summaryRes.data);
            setTopProducts(topProductsRes.data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>

            {/* Resumen General */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Productos</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.num_productos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.num_ventas}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Vendido</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${parseFloat(summary.total_vendido).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Productos Más Vendidos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Productos Más Vendidos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Producto</th>
                                <th className="text-left py-3 px-4">Unidades Vendidas</th>
                                <th className="text-left py-3 px-4">Total Vendido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={product.codigo_unico} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="font-medium">{product.nombre}</div>
                                            <div className="text-sm text-gray-600">{product.codigo_unico}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">{product.unidades}</td>
                                    <td className="py-3 px-4">${parseFloat(product.vendido).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;