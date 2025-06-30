<template>
  <!-- ... (resto del dashboard) ... -->

  <!-- AJUSTES -->
  <div v-if="currentView === 'settings'" class="dashboard-settings">
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h2 class="mb-0">Configuración de tu cuenta</h2>
          </div>
          <div class="card-body">
            <div class="settings-container">
              <div class="row">
                <div class="col-md-4">
                  <div class="profile-card text-center">
                    <div class="avatar-container mx-auto mb-3" @click="triggerAvatarUpload">
                      <img 
                        :src="userAvatar" 
                        class="rounded-circle border border-unefa-accent" 
                        width="150"
                        alt="Avatar"
                      >

                    </div>
                    <h4 class="mb-1">{{ nombre || 'Usuario' }}</h4>
                    <p class="text-muted mb-3">{{ userEmail }}</p>
                  </div>
                </div>
                
                <div class="col-md-8">
                  <form @submit.prevent="guardarPerfil" autocomplete="off" novalidate>
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="nombre">Nombre completo</label>
                      <input
                        id="nombre"
                        v-model.trim="nuevoNombre"
                        class="form-control"
                        :class="{ 'is-invalid': nombreError }"
                        maxlength="32"
                        required
                        autocomplete="off"
                      />
                      <div v-if="nombreError" class="invalid-feedback">{{ nombreError }}</div>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="email">Correo electrónico</label>
                      <input
                        id="email"
                        type="email"
                        v-model="userEmail"
                        class="form-control"
                        disabled
                      />
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="password">Nueva Contraseña</label>
                      <div class="input-group">
                        <input
                          id="password"
                          v-model="nuevaPassword"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': passwordError }"
                          minlength="6"
                          maxlength="32"
                          autocomplete="new-password"
                        />
                        <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword" tabindex="-1">
                          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <div v-if="passwordError" class="invalid-feedback d-block">{{ passwordError }}</div>
                      <small class="text-muted">Mínimo 6 caracteres. Déjalo vacío si no deseas cambiarla.</small>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-4">
                      <button class="btn btn-unefa-primary btn-success" type="submit" :disabled="loading">
                        <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> Guardando...</span>
                        <span v-else><i class="bi bi-save"></i> Guardar Cambios</span>
                      </button>
                      
                      
                    </div>
                    
                    <transition name="fade">
                      <div v-if="mensaje" :class="['alert', mensajeTipo, 'mt-3', 'mb-0']" role="alert">
                        <i class="bi me-2" :class="{
                          'bi-check-circle': mensajeTipo === 'alert-success',
                          'bi-exclamation-triangle': mensajeTipo === 'alert-warning',
                          'bi-x-circle': mensajeTipo === 'alert-danger',
                          'bi-info-circle': mensajeTipo === 'alert-info'
                        }"></i>
                        {{ mensaje }}
                      </div>
                    </transition>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Seguridad</h5>
          </div>
          <div class="card-body">
            <div class="security-item d-flex align-items-center mb-3">
              <div class="security-icon bg-success-light text-success">
                <i class="bi bi-shield-check"></i>
              </div>
              <div class="ms-3">
                <div class="security-label">Último inicio de sesión</div>
                <div class="security-value">{{ formatDate(lastSignInAt) }}</div>
              </div>
            </div>
            
            <div class="security-item d-flex align-items-center">
              <div class="security-icon bg-info-light text-info">
                <i class="bi bi-clock-history"></i>
              </div>
              <div class="ms-3">
                <div class="security-label">Cuenta creada</div>
                <div class="security-value">{{ formatDate(createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import { useRouter } from 'vue-router'


const router = useRouter()
const props = defineProps<{ nombre: string }>()
const emit = defineEmits(['updateNombre'])

import type { SupabaseClient } from '@supabase/supabase-js'
const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

// Vista actual del dashboard
const currentView = ref('settings')

// Datos del usuario
const nuevoNombre = ref(props.nombre)
const userEmail = ref('')
const userAvatar = ref('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
const userId = ref<string | null>(null)
const lastSignInAt = ref('')
const createdAt = ref('')

// Contraseña y configuración
const nuevaPassword = ref('')
const showPassword = ref(false)


// Estado y mensajes
const loading = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('alert-info')
const nombreError = ref('')
const passwordError = ref('')

// Inicialización
onMounted(async () => {
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }
  
  userId.value = user.id
  nuevoNombre.value = user.user_metadata?.name || user.user_metadata?.userName || ''
  userEmail.value = user.email || ''
  userAvatar.value = user.user_metadata?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  lastSignInAt.value = user.last_sign_in_at || ''
  createdAt.value = user.created_at || ''
 
})



// Validación del formulario
function validar() {
  nombreError.value = ''
  passwordError.value = ''
  let valido = true
  
  if (!nuevoNombre.value || nuevoNombre.value.length < 3) {
    nombreError.value = 'El nombre debe tener al menos 3 caracteres.'
    valido = false
  }
  
  if (nuevaPassword.value && nuevaPassword.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres.'
    valido = false
  }
  
  return valido
}

// Guardar cambios del perfil
async function guardarPerfil() {
  if (!validar()) return
  
  loading.value = true
  mensaje.value = ''
  mensajeTipo.value = 'alert-info'
  let cambios = false

  // Cambiar nombre en metadatos de auth
  if (nuevoNombre.value && nuevoNombre.value !== props.nombre) {
    const { error } = await $supabase.auth.updateUser({
      data: { name: nuevoNombre.value }
    })
    
    if (!error) {
      emit('updateNombre', nuevoNombre.value)
      mensaje.value = 'Nombre actualizado correctamente.'
      mensajeTipo.value = 'alert-success'
      cambios = true
    } else {
      mensaje.value = 'Error al actualizar el nombre.'
      mensajeTipo.value = 'alert-danger'
    }
  }

  // Cambiar contraseña si se ingresó una nueva
  if (nuevaPassword.value) {
    const { error } = await $supabase.auth.updateUser({
      password: nuevaPassword.value
    })
    
    if (!error) {
      mensaje.value += (cambios ? ' ' : '') + 'Contraseña actualizada correctamente.'
      mensajeTipo.value = 'alert-success'
      nuevaPassword.value = ''
      cambios = true
    } else {
      mensaje.value += (cambios ? ' ' : '') + 'Error al actualizar la contraseña.'
      mensajeTipo.value = 'alert-danger'
    }
  }

  if (!cambios && !mensaje.value) {
    mensaje.value = 'No hay cambios para guardar.'
    mensajeTipo.value = 'alert-warning'
  }
  
  loading.value = false
}







// Formatear fechas
function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelativeTime(dateStr: string) {
  if (!dateStr) return 'N/A'
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  
  return `hace ${Math.floor(diffInSeconds / 86400)} días`
}
</script>

<style scoped>
.settings-container {
  padding: 0.5rem;
}

.profile-card {
  padding: 1.5rem;
  background: rgba(0, 33, 71, 0.03);
  border-radius: 0.75rem;
}

.avatar-container {
  position: relative;
  width: fit-content;
  cursor: pointer;
}

.btn-avatar-edit {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--unefa-accent);
  color: var(--unefa-dark);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.security-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(0,0,0,0.02);
}

.security-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.security-label {
  font-size: 0.85rem;
  color: #6c757d;
}

.security-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.session-item {
  padding: 0.75rem 0;
}

.session-time {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.bg-success-light {
  background: rgba(40, 167, 69, 0.1);
}

.bg-info-light {
  background: rgba(23, 162, 184, 0.1);
}

.text-success {
  color: #28a745;
}

.text-info {
  color: #17a2b8;
}

.alert {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
}

.alert-info {
  background-color: rgba(23, 162, 184, 0.1);
  border-color: rgba(23, 162, 184, 0.2);
  color: #0c5460;
}

.alert-success {
  background-color: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.2);
  color: #155724;
}

.alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
  color: #721c24;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 767.98px) {
  .profile-card {
    margin-bottom: 1.5rem;
  }
}
</style>