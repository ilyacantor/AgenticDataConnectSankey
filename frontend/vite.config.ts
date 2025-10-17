import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/state': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/connect': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/reset': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/preview': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/toggle_dev_mode': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
  },
});
