import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    port: 23519,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue': ['vue'],
          'vue-router': ['vue-router'],
          'vue-i18n': ['vue-i18n'],
        },
      },
    },
  },
})