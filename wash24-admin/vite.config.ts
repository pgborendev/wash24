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
    host: 'localhost', // or your custom domain
    port: 3000,
    strictPort: true,
    open: true // open browser on server start
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

