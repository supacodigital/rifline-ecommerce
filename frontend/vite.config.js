import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toutes les requêtes /api/* sont proxiées vers le backend
      // → même origine, les cookies httpOnly passent sans problème
      '/api': {
        target: 'http://localhost:2000',
        changeOrigin: true,
      },
      // Images uploadées servies par le backend
      '/uploads': {
        target: 'http://localhost:2000',
        changeOrigin: true,
      },
    },
  },
})
