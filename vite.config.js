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
            '/macros/s/AKfycbzdQG-lOYDZqEGHKrSYYndAnxSmqvJM35bFbFhNsjOqRswcNfuFwQnsJILKSO3cF7RkBg/exec'
          ),
      },
    },
  },
});