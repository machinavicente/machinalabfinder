import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(nuxtApp => {
  const supabaseUrl = 'https://nihjruyujqysshpsgnpp.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paGpydXl1anF5c3NocHNnbnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODM1OTMsImV4cCI6MjA2MTk1OTU5M30.i6uNOxlxMNcuvvr5tT5dVCPHivtvFgcGzEy_FcVbHIg' // Usa variable de entorno real en producción
  const supabase = createClient(supabaseUrl, supabaseKey)

  nuxtApp.provide('supabase', supabase)
})
