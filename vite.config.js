import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Three.js core library (largest)
            if (id.includes('three') && !id.includes('@react-three')) {
              return 'three-core';
            }
            // React Three Fiber integration
            if (id.includes('@react-three/fiber')) {
              return 'three-fiber';
            }
            // React Three Drei helpers
            if (id.includes('@react-three/drei')) {
              return 'three-drei';
            }
            // Framer Motion animations
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('react-dropzone') || id.includes('axios')) {
              return 'ui-vendor';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit to 1500kb to accommodate Three.js
    chunkSizeWarningLimit: 1500,
    // Enable minification with terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
})
