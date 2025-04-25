import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // Hace disponibles expect, describe, etc. sin imports
    environment: 'jsdom',   // Entorno de testing para componentes React
    setupFiles: './src/setupTests.ts', // Archivo de configuración inicial
    css: true,             // Procesa CSS/Tailwind en los tests
    clearMocks: true,      // Limpia automáticamente los mocks entre tests
    mockReset: true,       // Resetea los mocks completamente entre tests
    coverage: {
      provider: 'v8',      // Usa el proveedor de cobertura V8
      reporter: ['text', 'json', 'html'], // Formatos de reporte
    },
    // Opcional: excluir node_modules de transformación
    exclude: ['**/node_modules/**'],
    // Opcional: incluir solo ciertos patrones de archivos
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})