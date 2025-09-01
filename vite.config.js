import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/synaptic/',
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'src/views/*.html', dest: '' }
      ]
    })
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true
  }
});