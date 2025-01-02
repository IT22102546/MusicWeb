import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true, // Ensure requests are forwarded properly
      },
    },
  },
  build: {
    outDir: 'dist', // Ensures static files are placed in "dist" after build
  },
});
