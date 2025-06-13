import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Muat env file berdasarkan mode (development, production)
  const env = loadEnv(mode, process.cwd())
  
  return {
  plugins: [vue()],
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      host: true
    }
  }
})
