// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  
  // Otimizações de build
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'animations': ['framer-motion'],
          'icons': ['react-icons', 'lucide-react'],
          'contentful': ['contentful']
        }
      }
    },
    chunkSizeWarningLimit: 2000
  },

  // Otimizações do servidor de desenvolvimento
  server: {
    hmr: {
      overlay: false
    }
  },

  // Otimizar dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'contentful',
      'react-icons',
      'lucide-react'
    ]
  }
})