import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://zestcrm.fr',
  integrations: [tailwind({
    // Configuration Tailwind personnalisée
    config: {
      applyBaseStyles: false, // On gère nous-mêmes les styles de base
    },
  }), sitemap(), partytown({
    // Pour optimiser Google Analytics
    config: {
      forward: ['gtag'],
    },
  }), icon()],
  output: 'static', // Site statique pour de meilleures performances
  compressHTML: true,
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  },
});