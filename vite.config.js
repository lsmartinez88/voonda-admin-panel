import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@jumbo', replacement: '/@jumbo' },
      { find: '@assets', replacement: '/@assets' },
      { find: '@', replacement: '/src' },
    ],
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['react-draft-wysiwyg'],
  },
  server: {
    proxy: {
      // Proxy para la API en desarrollo
      '/api': {
        target: 'https://api.fratelli.voonda.net',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
