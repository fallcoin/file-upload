import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3300',
        changeOrigin: true,
        ws: true,
        secure: false
      },
    }
  }
})
