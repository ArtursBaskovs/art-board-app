import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/art-board-app/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', 
    },
  },
})
