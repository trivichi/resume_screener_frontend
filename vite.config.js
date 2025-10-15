// https://vite.dev/config/
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal, robust config for Vercel. Base can be overridden for GitHub Pages builds.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = (env.VITE_PUBLIC_BASE || '/').trim()

  return {
    base,
    plugins: [react()],
    build: {
      // Let Rollup/Vite decide chunking to avoid missing preload/order issues on Vercel
      chunkSizeWarningLimit: 1500,
      // Use default minifier (esbuild) for speed/stability
    },
  }
})
