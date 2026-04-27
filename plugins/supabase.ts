import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
<<<<<<< HEAD

  const url = config.public.supabaseUrl
  const key = config.public.supabaseKey

  // Validación de seguridad
  if (!url || !key) {
    throw new Error("Error: Supabase URL o Key no encontradas en runtimeConfig.")
  }

  const supabase = createClient(url, key)

  // El nombre '$supabase' es el que usas en tus componentes (login.vue, etc.)
  nuxtApp.provide('supabase', supabase)
})
=======
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)

  nuxtApp.provide('supabase', supabase)
})
>>>>>>> 65f12d4795b9284c5cf986ae2453462f7b064921
