import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Web běží na GitHub Pages v podcestě:
//   https://adiosik.github.io/jakub-simansky-web-new/
// `base` proto musí tu podcestu obsahovat, jinak by prohlížeč hledal assety
// v kořeni domény. Ve vývoji (`npm run dev`) zůstává base "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/jakub-simansky-web-new/' : '/',
  plugins: [react()],
}))
