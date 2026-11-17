import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seoPlugin from './scripts/seo-plugin.js';

// Vite config: React plugin, build-time SEO files (JSON-LD, sitemap, robots) and
// manual vendor chunks so the main bundle stays small.
// Route-level code-splitting is done with React.lazy in src/App.jsx.
export default defineConfig({
  plugins: [react(), seoPlugin()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
