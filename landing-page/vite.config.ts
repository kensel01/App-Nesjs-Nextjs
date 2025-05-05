import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/client/status': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/client\/status/, '/api/v1/clientes/client/status'),
      },
      '/api/payment/intent': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payment\/intent/, '/api/v1/payments/payment/intent'),
      },
      '/api/payments/create': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payments\/create/, '/api/v1/payments/create'),
      }
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
          form: ['./src/components/StatusCheckForm.tsx', './src/hooks/useThrottle.ts'],
        },
      },
    },
    // Ensure sourcemaps are generated for debugging
    sourcemap: true,
    // Create smaller chunks to improve performance
    cssCodeSplit: true,
    // Target modern browsers for better performance
    target: 'es2015',
    // Warning limit for chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize images
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  }
});
