import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const spaFallback = () => ({
  name: 'spa-fallback',
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      // If the request is for a file (has an extension) or API, skip it
      if (req.url.includes('.') || req.url.startsWith('/api')) {
        return next();
      }
      // Otherwise rewrite to index.html for SPA routing
      req.url = '/index.html';
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api' 
        : 'https://ethereal-5x0p.onrender.com/api'
    )
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
