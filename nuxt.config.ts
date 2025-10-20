// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    databaseUrl: process.env.DATABASE_URL,

    public: {
      // Variables publiques (accessible côté client)
      appName: 'Restaurant Réservation'
    }
  },

  colorMode: {
    preference: 'light'
  }
})
