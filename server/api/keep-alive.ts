import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Validación de seguridad
  const authHeader = getHeader(event, 'authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return { error: 'No autorizado' }
  }

  // Intentar obtener la URL y KEY de cualquier variable disponible
  const url = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: `Faltan credenciales. URL: ${!!url}, KEY: ${!!key}`,
    })
  }

  try {
    const supabase = createClient(url, key)
    
    // Hacemos la consulta a simuladores
    const { data, error } = await supabase
      .from('simuladores')
      .select('nombre')
      .limit(1)

    if (error) throw error

    return { 
      success: true, 
      message: 'Sistema despertado con éxito',
      data 
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})