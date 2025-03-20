import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path";
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '$lib': path.join(__dirname, 'src/lib'),
      '@globalStore': path.join(__dirname, 'src/stores/globalStore.js'),    
    }
  },
  plugins: [tailwindcss(),svelte()],
})
