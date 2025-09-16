import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src/client',
  plugins: [react()],
  build: {
    outDir: '../../dist/client', 
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
