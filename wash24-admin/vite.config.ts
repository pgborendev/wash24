import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  publicDir: 'public',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
   server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem'))
    },
    host: '0.0.0.0', // Changed from 'localhost' to allow network access
    port: 3000,
    strictPort: true,
    open: true,
    hmr: {
      host: 'localhost', // Ensures HMR works correctly when accessing from other devices
      protocol: 'wss' // WebSocket secure for HMR over HTTPS
    }
  },
  preview: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem'))
    },
    port: 443,
    strictPort: true
  }
})

