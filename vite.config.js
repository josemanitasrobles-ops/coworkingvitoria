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
            '/macros/s/AKfycbwJ9aUxJljsml0SB6BulrU7sJmbt37nMo98bLE5lpTwtY_TtzGctCrl2YVdpYKrSMuXmQ/exec'
          ),
      },
    },
  },
});