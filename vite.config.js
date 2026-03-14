import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfiguracja zoptymalizowana pod Vite 8.0+
export default defineConfig({
  plugins: [react()],
  // Usuwamy ręczne definicje esbuild/jsx, pozwalając wtyczce na automatyzację
})