import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(nuxtApp => {
  const supabaseUrl = 'https://nthgofwioyfrjvocyvrs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGdvZndpb3lmcmp2b2N5dnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDcyOTQsImV4cCI6MjA2MTEyMzI5NH0.J80rYjQg6NWbo_yNNxcVnTbPavKmpxwZIi5UNrBTG84' // Usa variable de entorno real en producción
  const supabase = createClient(supabaseUrl, supabaseKey)

  nuxtApp.provide('supabase', supabase)
})
