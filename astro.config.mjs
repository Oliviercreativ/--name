import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://zestcrm.fr',
  integrations: [
    tailwind({
      // Configuration Tailwind personnalisée
      config: {
        applyBaseStyles: false, // On gère nous-mêmes les styles de base
      },
    }),
    sitemap(),
    partytown({
      // Pour optimiser Google Analytics
      config: {
        forward: ['gtag'],
      },
    }),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  compressHTML: true,
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  server: {
    port: 4321,
    host: true,
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