import vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: './', // Ensure assets use relative paths
  optimizeDeps: {
    exclude: ['oxigraph'],
  },
  worker: {
    format: 'es',
  },
  define: {
    'global': {},
  },
  plugins: [
    vue(), nodePolyfills({
      include: ['path', 'stream', 'util'], exclude: ['http'], globals: {
        Buffer: true, global: true, process: true,
      }, overrides: {
        fs: 'memfs',
      }, protocolImports: true,
    })],
})
