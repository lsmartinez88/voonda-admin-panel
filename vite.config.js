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
});
