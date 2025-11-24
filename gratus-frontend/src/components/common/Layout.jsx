import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    ShoppingCart,
    Package,
    Users,
    BarChart3,
    LogOut,
    User,
} from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: ShoppingCart, label: 'Ventas' },
        { path: '/products', icon: Package, label: 'Productos' },
        { path: '/customers', icon: Users, label: 'Clientes' },
        { path: '/reports', icon: BarChart3, label: 'Reportes' },
    ];

    return (
        <div className="app">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Gratus</h1>
                    <p className="sidebar-subtitle">Sistema de Gestión</p>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="icon" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="header-content">
                        <div>
                            <h2 className="header-title">
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="user-info">
                            <div className="user-details">
                                <User className="icon" />
                                <span className="user-name">{user?.nombre}</span>
                                <span className="user-role">
                                    {user?.rol}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                <LogOut className="icon" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;