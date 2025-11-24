import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Cargar variables de entorno
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],
        server: {
            port: parseInt(env.PORT) || 5173,
            host: true, // Permitir conexiones externas
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
            chunkSizeWarningLimit: 1600,
            // Optimizaciones para producción
            minify: 'esbuild',
            target: 'esnext',
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        router: ['react-router-dom'],
                        utils: ['axios', 'date-fns']
                    },
                    entryFileNames: `[name].js`,
                    chunkFileNames: `[name].js`,
                    assetFileNames: `[name].[ext]`
                }
            }
        },
        // Configuración base
        base: './',

        // Optimizar dependencias
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom', 'axios']
        }
    }
})