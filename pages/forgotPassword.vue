<template>
  <ClientOnly>
    <div class="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card shadow-lg border-0 rounded-4" style="max-width:420px;width:100%;">
        <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
          <i class="bi bi-lock me-2 fs-4 text-warning"></i>
          <h3 class="mb-0 fs-5">Restablecer Contraseña</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="onUpdate" autocomplete="off" novalidate>
            <div class="mb-3">
              <label class="form-label">Correo electrónico</label>
              <input
                type="email"
                class="form-control"
                :value="email"
                disabled
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Nueva contraseña</label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  class="form-control"
                  id="password"
                  placeholder="Nueva contraseña"
                  minlength="6"
                  required
                  autocomplete="new-password"
                />
                <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
            </div>
            <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
            <button :disabled="loading" type="submit" class="btn btn-success w-100">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-save me-2"></i>Restablecer contraseña</span>
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

    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Éxito</h5>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center">
              <i class="ri-check-double-line text-success fs-3 me-3"></i>
              <p class="mb-0">Contraseña restablecida correctamente</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="redirectToLogin">
              <i class="bi bi-box-arrow-in-right me-1"></i> Ir al login
            </button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const route = useRoute()
const router = useRouter()
const email = ref('')
import type { SupabaseClient } from '@supabase/supabase-js'

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

onMounted(() => {
  email.value = (route.query.email as string) || ''
  if (!email.value) {
    router.replace('/resetPassword')
  }
})

function redirectToLogin() {
  router.push('/login')
}

async function onUpdate() {
  error.value = ''
  if (!password.value || password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  loading.value = true
  try {
    // Actualiza la tabla usuarios
    const { error: supaError } = await $supabase
      .from('usuarios')
      .update({ password_hash: password.value })
      .eq('email', email.value)
    if (supaError) throw new Error('No se pudo restablecer la contraseña.')
    
    showSuccessModal.value = true
  } catch (e: any) {
    error.value = e.message || 'No se pudo restablecer la contraseña.'
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-y: auto;
}
</style>