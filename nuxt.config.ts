// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Desactivar SSR si prefieres que todo se maneje del lado del cliente (opcional)
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
        // Recursos locales (asegúrate de que existan en la carpeta /public/assets/...)
        { rel: 'stylesheet', href: '/assets/bootstrap/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/css/index.css' },
        // Iconos externos
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

  // Configuración de variables de entorno accesibles desde el cliente
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUX_SUPABASE_URL || process.env.NUXT_SUPABASE_URL,
      supabaseKey: process.env.NUX_SUPABASE_KEY || process.env.NUXT_SUPABASE_KEY
    }
  },

  // Plugins del proyecto
  plugins: [
    '~/plugins/supabase'
  ],

  // Módulos (si instalas @nuxtjs/supabase en el futuro, iría aquí)
  modules: [],

  // Compatibilidad de herramientas
  devtools: { enabled: true }
})