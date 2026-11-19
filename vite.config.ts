import { defineConfig, runnerImport, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vloží do <head> strukturovaná data (JSON-LD) pro vyhledávače — osobu,
 * desky a nadcházející koncerty. Počítá se při každém buildu z dat webu
 * (src/seo/structuredData.ts); stránku samotnou to nijak nemění.
 * runnerImport, protože soubor je TypeScript s importy dat webu.
 */
function structuredData(): Plugin {
  return {
    name: 'structured-data',
    async transformIndexHtml() {
      const { module } = await runnerImport<{ structuredDataJson: () => string }>(
        './src/seo/structuredData.ts',
      )
      return [{
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        children: module.structuredDataJson(),
        injectTo: 'head',
      }]
    },
  }
}

// https://vite.dev/config/
// Web běží na vlastní doméně https://jakubsimansky.com/, tedy z kořene —
// `base` proto zůstává "/" ve vývoji i v produkci. Doménu drží soubor
// public/CNAME, který Vite kopíruje do buildu; bez něj by ji GitHub Pages
// při nasazení přes vlastní workflow zapomněl.
// (Dokud web běžel v podcestě /jakub-simansky-web-new/, muselo tu být `base`
// nastavené na ni — v historii gitu to je.)
export default defineConfig({
  base: '/',
  plugins: [react(), structuredData()],
})
