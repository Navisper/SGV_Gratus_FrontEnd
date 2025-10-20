# Gratus SGV — Frontend (React + Vite)

> Estado actual: app React con Vite y TypeScript; usa React Query para datos, Recharts para graficas y una API FastAPI al fondo. Se han hecho refactors recientes (carpetas `services/api` y `pages/Reports.tsx`).

## Descripcion
Interfaz para el sistema de ventas e inventario "Gratus". Permite gestionar productos, ventas, reportes (top productos, resumen, etc.) y un dashboard con graficos.

## Arquitectura
- React 18 + TypeScript
- Vite para bundling/SSR de desarrollo
- React Router para navegacion
- @tanstack/react-query para fetching y cacheo
- Recharts para visualizaciones
- TailwindCSS (opcional, si esta activado en el proyecto)
- .env manejado por Vite (import.meta.env)

## Requisitos
- Node.js 18+ (recomendado 20)
- pnpm / npm / yarn (elige uno)
- Backend corriendo (ver README backend) o una URL de API valida

## TL;DR (arranque rapido)
```bash
# 1) Clona y entra
git clone <repo-frontend-url> gratus-sgv-frontend
cd gratus-sgv-frontend

# 2) Instala
npm i   # (o pnpm i / yarn)

# 3) Variables de entorno
cp .env.example .env
# Edita VITE_API_URL con la URL real del backend

# 4) Corre en desarrollo
npm run dev

# 5) Build de produccion
npm run build
npm run preview  # para probar el build localmente
```

## Variables de entorno
Crea un archivo `.env` en la raiz (basado en `.env.example`):
```ini
# URL base del backend FastAPI
VITE_API_URL=http://localhost:8000

# Opcional: habilitar logs verbosos en consola
VITE_DEBUG=false
```
Importante: En Vite todas las variables que quieras exponer al cliente deben empezar por `VITE_`.

## Estructura sugerida
```
src/
  api/                 # clientes HTTP por recurso (opcional)
  services/
    api/               # cliente HTTP central (ej. axios/fetch) y endpoints
      index.ts
      products.ts
      sales.ts
      reports.ts
  components/
  pages/
    Dashboard.tsx
    Products.tsx
    Sales.tsx
    Reports.tsx
  hooks/
  types/
  App.tsx
  main.tsx
```

### Nota sobre imports recientes
- En `src/pages/Reports.tsx` asegurate de que el import coincida con la ruta real:
```ts
// Si tus endpoints viven en src/services/api/reports.ts
import { ReportsAPI } from "../services/api/reports";
// Si estan en src/api/reports.ts
// import { ReportsAPI } from "../api/reports";
```
- Si Vite muestra:  
  Failed to resolve import "../api/reports" from "src/pages/Reports.tsx". Does the file exist?
  -> Verifica el path y que el archivo exista.

## Scripts
En `package.json` (ejemplo):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

## Cliente HTTP de ejemplo
`src/services/api/index.ts`
```ts
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[HTTP ${res.status}] ${text}`);
  }
  return res.json();
}
```

`src/services/api/reports.ts`
```ts
import { http } from "./index";

export const ReportsAPI = {
  summary: () => http<{ num_productos: number; num_ventas: number; total_vendido: number }>("/reports/summary"),
  topProducts: (limit = 10) => http<Array<{ codigo_unico: string; nombre: string; unidades: number; vendido: number }>>(`/reports/top-products?limit=${limit}`),
};
```

## Comprobacion rapida
- Abre `http://localhost:5173` (por defecto Vite).
- Asegurate de que el backend responda en `VITE_API_URL` (ej. `http://localhost:8000`).

## Troubleshooting
- `Cannot find package '@vitejs/plugin-react'`  
  Instala el plugin:  
  ```bash
  npm i -D @vitejs/plugin-react
  ```
  y comprueba que tu `vite.config.ts` lo importe y use.

- Error al importar `../api/reports`  
  Ajusta la ruta del import o mueve el archivo a la ubicacion esperada.

- CORS al llamar la API  
  Configura el backend para permitir el origen `http://localhost:5173` (ver README backend).

- Tema claro con estilos oscuros  
  Si usas Tailwind, activa `darkMode: "class"` y aplica estilos condicionados. Para CSS puro, usa media queries `@media (prefers-color-scheme: light)`; conserva el gradiente morado en ambos temas.

## Licencia
MIT (o la que definas para el proyecto).

## Autores
- Julian Rubiano Santofimio (@DuelDEV-s / "Gratus") y colaboradores.
