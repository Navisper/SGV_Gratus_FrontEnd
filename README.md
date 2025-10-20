
# Gratus SGV Frontend (actualizado)

Frontend React + Vite + TS conectado a los endpoints actuales del backend (ver `apibackend.json`).

## Endpoints usados
- **Auth**: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `GET /auth/google/login`, `POST /auth/google/callback`
- **Productos**: `GET /products/`, `POST /products/`, `GET/PUT/DELETE /products/{codigo_unico}`
- **Ventas**: `POST /sales/`, `GET /sales/`, `GET /sales/{sale_id}`, `GET /sales/kpi/daily?day=YYYY-MM-DD`, `GET /sales/close/day?day=YYYY-MM-DD`, `POST /sales/{sale_id}/cancel`
- **Facturas**: `POST /invoices/{sale_id}`
- **Reportes**: `GET /reports/summary`, `GET /reports/top-products`, `GET /reports/credits/*`, `GET /reports/sales/timeseries`

## UI principal
- **Navbar** visible solo cuando hay token. Enlaces: Panel, Productos, Ventas, POS, Facturas, Reportes.
- **Login** con email/contraseña y botón **“Iniciar con Google”** (redirige a `/auth/google/login` y procesa `/auth/callback?code=...`).
- **Productos** listado, búsqueda local y formulario de creación/edición.
- **POS** agrega por `codigo_unico` y confirma con `POST /sales/`.
- **Ventas** listado y detalle, con anulación y generación de factura.
- **Reportes** top productos; resumen en panel.

## Configuración
1. Copia `.env.example` a `.env` y ajusta `VITE_API_URL` (por defecto `http://localhost:8000`).
2. Instala y corre:
```bash
npm i
npm run dev
```

## Notas
- El backend devuelve `access_token`; lo guardamos en `localStorage.token`.
- Para Google OAuth configura `redirect_uri` hacia `http://localhost:5173/auth/callback` (o tu dominio).
