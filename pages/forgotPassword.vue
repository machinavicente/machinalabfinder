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
              <label class="form-label">Correo electrónico <span class="requerided text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                :value="email"
                disabled
              />
            </div>

            <div class="mb-3">
              <label for="emailAlternativo" class="form-label">Correo electrónico alternativo <span class="requerided text-danger">*</span></label>
              <input
                type="email"
                id="emailAlternativo"
                class="form-control"
                v-model="emailAlternativo"
                placeholder="Introduce tu correo alternativo"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Nueva contraseña <span class="requerided text-danger">*</span></label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  class="form-control"
                  id="password"
                  placeholder="Nueva contraseña"
                  minlength="6"
                  :disabled="!isAlternativeEmailCorrect"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                  :disabled="!isAlternativeEmailCorrect"
                >
                  <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
            </div>

            <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

            <button
              :disabled="loading || !isAlternativeEmailCorrect || !password"
              type="submit"
              class="btn btn-success w-100"
            >
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const password = ref('')
const emailAlternativo = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const route = useRoute()
const router = useRouter()
const email = ref('')
import type { SupabaseClient } from '@supabase/supabase-js'

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

// Obtiene email desde query al montar
onMounted(() => {
  email.value = (route.query.email as string) || ''
  if (!email.value) {
    router.replace('/resetPassword')
  }
})

// Valida que el email alternativo tenga formato básico correcto
const isEmailAlternativoValid = computed(() => {
  // simple regex para validar email
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(emailAlternativo.value.trim())
})

const isAlternativeEmailCorrect = ref(false)

// Evita hacer llamadas cada vez que cambia el input con debounce manual simple
let debounceTimeout: any = null
watch(emailAlternativo, (newEmail) => {
  error.value = ''
  isAlternativeEmailCorrect.value = false
  clearTimeout(debounceTimeout)

  if (!isEmailAlternativoValid.value) return

  debounceTimeout = setTimeout(async () => {
    loading.value = true
    try {
      // Busca al usuario por su email principal para obtener el alternativo
      const { data, error: fetchError } = await $supabase
        .from('usuarios')
        .select('emailAlternativo')
        .eq('email', email.value)
        .single()

      if (fetchError) {
        // This can happen if RLS fails, or if multiple users have the same email.
        console.error('Error de Supabase al verificar el correo:', fetchError)
        throw new Error('Ocurrió un error al verificar la cuenta.')
      }

      if (!data) {
        // This happens when .single() returns 0 rows.
        error.value = 'La cuenta de correo principal no fue encontrada.'
        isAlternativeEmailCorrect.value = false
      } else if (data.emailAlternativo === newEmail.trim()) { // User found, check alternative email
        error.value = '' // El correo alternativo es correcto
        isAlternativeEmailCorrect.value = true
      } else {
        error.value = 'El correo alternativo no coincide con el registrado para esta cuenta.'
        isAlternativeEmailCorrect.value = false
      }
    } catch (e: any) {
      error.value = e.message || 'Error al validar correo alternativo.'
      isAlternativeEmailCorrect.value = false
    } finally {
      loading.value = false
    }
  }, 500) // medio segundo de debounce
})

function redirectToLogin() {
  router.push('/login')
}

async function onUpdate() {
  error.value = ''

  if (!isAlternativeEmailCorrect.value) {
    error.value = 'Por favor, ingresa un correo electrónico alternativo válido y registrado.'
    return
  }
  if (!password.value || password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  loading.value = true
  try {
    // Actualiza la contraseña para el email original (considera hashear la contraseña antes)
    const { error: supaError } = await $supabase
      .from('usuarios')
      .update({ password_hash: password.value }) 
      .eq('email', email.value)

    if (supaError) throw new Error('No se pudo restablecer la contraseña.')

    showSuccessModal.value = true
  } catch (e: any) {
    error.value = e.message || 'No se pudo restablecer la contraseña.'
  } finally {
    loading.value = false
  }
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
