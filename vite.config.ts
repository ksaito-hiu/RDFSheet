import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/RDFSheet/',
  build: { outDir: 'docs' },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'RDFSheet',
        short_name: 'RDFSheet',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#efd996',
        icons: [
          {
            src: './icons/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icons/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        file_handlers: [
          {
            action: '/RDFSheet/',
            accept: {
              'application/x-rdfsheet+json': ['.rdfs']
            }
          }
        ]
      }
    })
  ],
})
