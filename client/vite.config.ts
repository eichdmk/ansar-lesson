import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Vite treats ':' in paths as invalid on Unix (see isFileLoadingAllowed).
      // Required when the project lives in a directory like deploy-CG-05:5.
      strict: false,
      allow: [rootDir],
    },
  },
})
