// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [],
  app: {
    head: {
      title: 'MachinaSynthLabs - UNEFA',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'stylesheet', href: '/assets/bootstrap/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/index.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css' }
      ]
    }
  },
  modules: [],
  plugins: ['~/plugins/supabase']
})
