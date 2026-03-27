import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['marked', 'marked-highlight', 'highlight.js', 'juice', 'dompurify'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('highlight.js') || id.includes('marked')) {
            return 'markdown'
          }
          if (id.includes('@uiw/react-codemirror') || id.includes('@codemirror')) {
            return 'editor'
          }
          if (id.includes('react-dom') || id.includes('react/') || id.includes('zustand')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
