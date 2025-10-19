# Gratus SGV — Frontend (React + Vite + TS)

Incluye: OAuth Google, RHF+Zod, Toasts, Productos con búsqueda/filtros/paginación/CSV, POS, Detalle de venta e impresión de factura.

## Inicio
```bash
cp .env.example .env
# ajusta VITE_API_URL

npm install
npm run dev
```

## Endpoints esperados
- `POST /auth/login`
- `POST /auth/register`
- `GET /products` / `GET /products/{codigo_unico}` / `POST /products` / `PUT /products/{codigo_unico}` / `DELETE /products/{codigo_unico}`
- `POST /sales` / `GET /sales/{id}`
- `POST /invoices/{sale_id}` / `GET /invoices/{invoice_id}`
- `GET /reports/summary`
- `GET /reports/top-products?limit=10`
- `GET /auth/google/login` → redirige a Google → callback: `http://localhost:5173/auth/callback?token=...`

## Notas
- JWT en `localStorage` (considera cookies httpOnly en producción)
- Habilita CORS para `http://localhost:5173`
