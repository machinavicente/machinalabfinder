<template>
  <ClientOnly>
    <div class="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-lg border-0 rounded-4" style="max-width:420px;width:100%;">
        <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
          <i class="bi bi-key me-2 fs-4 text-warning"></i>
          <h3 class="mb-0 fs-5">Verificar Correo</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="onVerify" autocomplete="on" novalidate>
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="ejemplo@correo.com"
                required
                autocomplete="email"
              />
            </div>
            <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
            <button :disabled="loading" type="submit" class="btn btn-success w-100">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-search me-2"></i>Verificar correo</span>
            </button>
          </form>
          <div class="text-center mt-3">
            <NuxtLink to="/login" class="text-decoration-none">
              <i class="bi bi-arrow-left me-1"></i> Volver al inicio de sesión
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const email = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
import type { SupabaseClient } from '@supabase/supabase-js'

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

async function onVerify() {
  error.value = ''
  if (!email.value) {
    error.value = 'Debes ingresar tu correo electrónico.'
    return
  }
  loading.value = true
  try {
    const { data, error: supaError } = await $supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.value)
      .single()
    if (supaError || !data) throw new Error('Correo no encontrado')
    // Si existe, redirige a forgotPassword con el correo en precargado
    router.push({ path: '/forgotPassword', query: { email: email.value } })
  } catch (e: any) {
    error.value = e.message || 'Correo no encontrado.'
  }
  loading.value = false
}
</script>

<style scoped>
.unefa-primary-bg { background-color: #003366; }
.card { border-radius: 16px !important; }
.card-header { border-radius: 13px 13px 0 0 !important; }
.form-control { border-radius: 8px; }
.btn-success { border-radius: 8px; }
</style>