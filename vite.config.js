import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api-sheets': {
        target: 'https://script.google.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (p) =>
          p.replace(
            /^\/api-sheets/,
            '/macros/s/AKfycby1a3oBOFUZVWdmEIbjhZ-gSIISmRC7mNIFQkLq97lS-1Ou7GgUapbp3xXz7U6UDBSK3w/exec'
          ),
      },
    },
  },
});