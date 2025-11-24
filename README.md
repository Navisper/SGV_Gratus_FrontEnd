# 🏪 Gratus - Sistema de Gestión de Ventas

## 📖 Descripción del Proyecto
Gratus es un sistema moderno de gestión de ventas desarrollado para pequeñas y medianas empresas. Proporciona una solución completa para administrar productos, clientes, ventas y reportes financieros con una interfaz intuitiva y responsive.

## ✨ Características Principales
- 🛍️ **Gestión de Ventas:** Punto de venta intuitivo con carrito en tiempo real  
- 📦 **Gestión de Productos:** CRUD completo con búsqueda avanzada  
- 👥 **Gestión de Clientes:** Base de datos de clientes con historial  
- 💳 **Múltiples Métodos de Pago:** Efectivo, tarjeta, transferencia y crédito  
- 📊 **Reportes y Analytics:** Dashboard con métricas de ventas y productos  
- 🔐 **Autenticación Segura:** Login con email/password y Google OAuth  
- 🧾 **Sistema de Facturación:** Generación automática de facturas  
- 📱 **Diseño Responsive:** Funciona en desktop, tablet y móvil  

## 🏗️ Arquitectura

### Frontend (Este repositorio)
- React 18 con hooks modernos  
- Vite como build tool  
- React Router para navegación  
- Axios para llamadas API  
- CSS personalizado con diseño moderno  
- Lucide React para iconografía  

### Backend (Repositorio separado)
- FastAPI con Python  
- PostgreSQL como base de datos  
- Prisma como ORM  
- JWT para autenticación  
- OAuth2 con Google  

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+  
- npm o yarn  
- Backend Gratus ejecutándose (puerto 8000)  

### 🛠️ Instalación y Desarrollo

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/gratus-frontend.git
cd gratus-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en:  
http://localhost:5173

## 🏗️ Build para Producción
```bash
npm run build
npm run preview
```

## 🐳 Deploy con Docker

### Build local
```bash
docker build -t gratus-frontend .
docker run -p 3000:80 -e VITE_API_BASE_URL=https://tu-api.onrender.com gratus-frontend
```

### Docker Compose (desarrollo completo)
```bash
docker-compose up --build
```

## 🌐 Deploy en Render

### Opción 1: Static Site (Recomendado)
- Conectar repositorio
- Crear Static Site
- Configurar:
  - **Build Command:** `npm run build`
  - **Publish Directory:** `dist`
  - **Environment Variables:**
    - `VITE_API_BASE_URL=https://tu-api-gratus.onrender.com`

### Opción 2: Docker
- Crear Web Service
- Especificar Dockerfile
- Configurar variables de entorno

## 📁 Estructura del Proyecto
```
src/
├── components/
│   ├── common/
│   ├── sales/
│   └── ...
├── pages/
│   ├── SalesPage.jsx
│   ├── ProductsPage.jsx
│   ├── CustomersPage.jsx
│   └── ReportsPage.jsx
├── services/
│   └── api.js
├── context/
│   └── AuthContext.jsx
└── styles/
    └── SalesPage.css
```

## 🔐 Autenticación

### 1. Email/Password
- Registro e inicio de sesión
- Validación de campos
- Tokens JWT

### 2. Google OAuth
- Login social
- Flujo seguro con estado anti‑CSRF
- Creación automática de usuarios

## 🎯 Funcionalidades por Módulo

### 🛒 Módulo de Ventas
- Búsqueda en tiempo real  
- Carrito interactivo  
- Cálculo automático  
- Múltiples métodos de pago  
- Ventas a crédito  
- Facturación automática  

### 📦 Módulo de Productos
- CRUD completo  
- Búsqueda por nombre y código  
- Gestión de stock  
- Categorización  
- Validación de datos  

### 👥 Módulo de Clientes
- Registro y gestión  
- Búsqueda avanzada  
- Historial de compras  
- Créditos  

### 📊 Módulo de Reportes
- Dashboard  
- Productos más vendidos  
- Ventas por período  
- Cartera de créditos  

## 🔧 Configuración de API
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Endpoints principales
// POST /auth/login
// POST /auth/register
// GET  /products
// POST /sales
// GET  /customers
```

## 🐛 Troubleshooting
- **CORS:** Revisar configuración en backend  
- **Autenticación:** Limpiar localStorage  
- **Build falla:** Verificar Node >= 18  
- **Imágenes:** Verificar rutas en producción  

## 🤝 Contribución
1. Fork  
2. Crear rama feature  
3. Commit  
4. Push  
5. Pull Request  

## 📝 Roadmap
- PWA offline  
- Notificaciones  
- App móvil  
- Más pasarelas de pago  
- Reportes avanzados  
- Multi‑almacén  

## 🛡️ Seguridad
- Validación en frontend y backend  
- JWT con expiración  
- Protección XSS y CSRF  
- Sanitización de inputs  

## 📄 Licencia
Proyecto bajo Licencia MIT.

## 👥 Equipo
Desarrollado con ❤️ por el equipo de Gratus.

## 📞 Soporte
- Revisar documentación  
- Abrir issue en GitHub  
- Contactar al equipo  
