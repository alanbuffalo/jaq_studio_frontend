import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  logLevel: 'info',
  server: {
    port: 7606,
    strictPort: true,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8839',
        changeOrigin: true,
      },
      '/core': {
        target: 'http://127.0.0.1:8839',
        changeOrigin: true,
      },
      '/home': {
        target: 'http://127.0.0.1:8839',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:8839',
        changeOrigin: true,
      },
    },
  },
})

