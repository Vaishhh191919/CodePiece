import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),

  ],
  server:{
    proxy:{
      '/api': "http://localhost:5000",
    }
  },
   optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // for phaser to work
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          react: ['react', 'react-dom'],
        }
      }
    }
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  
})
