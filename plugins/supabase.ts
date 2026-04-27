import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // Buscamos en el objeto public que definimos en el config
  // Si no están ahí, intentamos obtenerlas directamente de process.env (fallback)
  const supabaseUrl = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL
  const supabaseKey = config.public.supabaseKey || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("DEBUG - URL:", supabaseUrl)
    console.error("DEBUG - KEY:", supabaseKey)
    throw new Error("Supabase URL o Key no encontradas. Revisa las variables en Vercel.")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Esto hace que puedas usar $supabase en todo tu proyecto
  return {
    provide: {
      supabase
    }
  }
})