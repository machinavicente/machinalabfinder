export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  // 1. Verificación de seguridad simple
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return { status: 'error', message: 'No autorizado' }
  }

  // 2. Usamos fetch directo (más ligero que el cliente de Supabase para esta tarea)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { 
      status: 'error', 
      message: 'Faltan variables',
      check: { url: !!supabaseUrl, key: !!supabaseKey }
    }
  }

  try {
    // Solo pedimos 1 fila de la tabla simuladores
    const response = await fetch(`${supabaseUrl}/rest/v1/simuladores?select=nombre&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Supabase respondió con status: ${response.status}`)
    }

    return { success: true, message: 'Keep-alive exitoso' }
  } catch (error: any) {
    return { status: 'error', message: error.message }
  }
})