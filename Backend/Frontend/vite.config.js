import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001, // Vite development server runs on port 4001
    proxy: {
      '/user': {
        target: 'http://localhost:5002', // Backend server (API) running on port 5002
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, '') // Optional: removes '/user' from the API request path
      },
    },
  },
})
