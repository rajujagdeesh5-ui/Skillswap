import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { copyFileSync, cpSync } from 'fs'

export default defineConfig({
  plugins: [
    build({
      emptyOutDir: false
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    {
      name: 'copy-public-files',
      closeBundle() {
        // Copy all public files to dist
        try {
          copyFileSync('public/dashboard.html', 'dist/dashboard.html')
          cpSync('public/static', 'dist/static', { recursive: true })
          console.log('✓ Copied public files to dist')
        } catch (e) {
          console.log('Public files copy skipped:', e.message)
        }
      }
    }
  ],
  publicDir: false // Don't auto-copy public dir since we handle it manually
})
