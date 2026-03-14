import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://ethereal-5x0p.onrender.com/api')
  },
  server: {
    host: true, // Listen on all local IPs (0.0.0.0)
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
  preview: {
    host: true, // Listen on all local IPs
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
  }
})
