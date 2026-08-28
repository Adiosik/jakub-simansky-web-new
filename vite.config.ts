import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Web běží na vlastní doméně https://jakubsimansky.com/, tedy z kořene —
// `base` proto zůstává "/" ve vývoji i v produkci. Doménu drží soubor
// public/CNAME, který Vite kopíruje do buildu; bez něj by ji GitHub Pages
// při nasazení přes vlastní workflow zapomněl.
// (Dokud web běžel v podcestě /jakub-simansky-web-new/, muselo tu být `base`
// nastavené na ni — v historii gitu to je.)
export default defineConfig({
  base: '/',
  plugins: [react()],
})
