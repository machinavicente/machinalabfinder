export default defineNuxtConfig({
  // Desactivar SSR para manejo del lado del cliente
  ssr: false,

  app: {
    head: {
      title: 'MachinaLab Finder - UNEFA',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Plataforma de simuladores de laboratorio para estudiantes de la UNEFA' }
      ],
      link: [
        { rel: 'stylesheet', href: '/assets/bootstrap/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/index.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css' }
      ],
      script: [
        {
          src: '/assets/bootstrap/bootstrap.bundle.min.js',
          defer: true,
          tagPosition: 'bodyClose'
        }
      ]
    }
  },

  // Configuración de variables de entorno
  runtimeConfig: {
    // 1. Nivel Privado: Solo para el servidor (Cron Job)
    supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
    cronSecret: process.env.CRON_SECRET,

    // 2. Nivel Público: Para el Plugin de Supabase y el Frontend
    public: {
      // Mantenemos los nombres estándar que Nuxt/Vercel inyectan
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
    }
  },

  // Plugins del proyecto
  plugins: [
    '~/plugins/supabase'
  ],

  modules: [],

  // Herramientas de desarrollo
  devtools: { enabled: true }
})