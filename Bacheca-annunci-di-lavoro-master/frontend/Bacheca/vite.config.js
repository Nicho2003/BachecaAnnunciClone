import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Assuming backend runs on port 3000
        changeOrigin: true,
        secure: false, // If backend is not HTTPS
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: if backend doesn't expect /api prefix
      }
    }
  }
})
