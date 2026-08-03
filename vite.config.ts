import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Web běží na GitHub Pages v podcestě:
//   https://adiosik.github.io/jakub-simansky-web-new/
// `base` proto musí tu podcestu obsahovat, jinak by prohlížeč hledal assety
// v kořeni domény. Ve vývoji (`npm run dev`) zůstává base "/".
// `isPreview` je tu podstatné: `vite preview` běží s command === 'serve', takže
// bez něj by náhled servíroval dist z kořene, zatímco v HTML jsou zapečené cesty
// s podcestou — server by pak na assety vracel index.html a stránka by zůstala
// prázdná. Náhled proto musí běžet na stejné podcestě jako produkce.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/jakub-simansky-web-new/' : '/',
  plugins: [react()],
}))
