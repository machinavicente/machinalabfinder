export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'MachinaLab Finder - UNEFA',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plataforma de simuladores de laboratorio para estudiantes de la UNEFA' }
      ],
      link: [
        { rel: 'stylesheet', href: '/assets/bootstrap/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/index.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css' }
      ],
      script: [
        { src: '/assets/bootstrap/bootstrap.bundle.min.js', defer: true, tagPosition: 'bodyClose' }
      ]
    }
  },

  runtimeConfig: {
    // Estas son para el server/api (Cron Job)
    supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
    cronSecret: process.env.CRON_SECRET,

    public: {
      // Estas son para el Plugin (Navegador)
      // Forzamos que lea las que tienen el prefijo NUXT_PUBLIC
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
    }
  },

  plugins: ['~/plugins/supabase'],
  devtools: { enabled: true }
})