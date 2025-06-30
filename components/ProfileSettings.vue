<template>
  <div class="settings-card card p-4 mx-auto animate__animated animate__fadeIn" style="max-width: 420px;">
    <div class="d-flex flex-column align-items-center mb-4">
      <div class="avatar-wrapper mb-2" @click="cambiarAvatar" title="Cambiar avatar" tabindex="0">
        <img :src="avatarUrl" alt="Avatar" class="profile-avatar" />
        <span class="avatar-edit"><i class="bi bi-camera"></i></span>
      </div>
      <h5 class="mb-0 fw-bold">{{ nuevoNombre || 'Usuario' }}</h5>
      <small class="text-muted">Editar perfil</small>
    </div>
    <form @submit.prevent="guardarPerfil" autocomplete="off" novalidate>
      <div class="mb-3">
        <label class="form-label fw-semibold" for="nombre">Nombre</label>
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
      <button class="btn btn-unefa w-100 mt-2" type="submit" :disabled="loading">
        <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i> Guardando...</span>
        <span v-else><i class="bi bi-save"></i> Guardar Cambios</span>
      </button>
    </form>
    <transition name="fade">
      <div v-if="mensaje" :class="['alert', mensajeTipo, 'mt-3', 'text-center']" role="alert">
        {{ mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ nombre: string }>()
const emit = defineEmits(['updateNombre'])

const { $supabase } = useNuxtApp()
const nuevoNombre = ref(props.nombre)
const nuevaPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('alert-info')
const nombreError = ref('')
const passwordError = ref('')
const avatarUrl = ref('https://cdn-icons-png.flaticon.com/512/3135/3135715.png') // Puedes cambiar por el avatar real

watch(() => props.nombre, (val) => {
  nuevoNombre.value = val
})

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

function cambiarAvatar() {
  // Aquí puedes abrir un modal o input file para cambiar el avatar
  // Por ahora solo muestra un mensaje
  mensaje.value = 'Función de cambio de avatar próximamente.'
  mensajeTipo.value = 'alert-info'
}
</script>

<style scoped>
.settings-card {
  background: rgba(255,255,255,0.98);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 33, 71, 0.10);
  border: none;
}
.avatar-wrapper {
  position: relative;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid #ffc72c;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-wrapper:hover, .avatar-wrapper:focus {
  box-shadow: 0 0 0 4px rgba(255,199,44,0.13);
}
.profile-avatar {
  width: 78px;
  height: 78px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #ffc72c;
  color: #002147;
  border-radius: 50%;
  padding: 4px 6px;
  font-size: 1.1rem;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.09);
  transition: background 0.18s;
}
.avatar-wrapper:hover .avatar-edit,
.avatar-wrapper:focus .avatar-edit {
  background: #002147;
  color: #ffc72c;
}
input.form-control.is-invalid,
.input-group .form-control.is-invalid {
  border-color: #ff5252;
}
.invalid-feedback {
  font-size: 0.92em;
}
.btn-unefa {
  background: #ffc72c;
  color: #002147;
  font-weight: 600;
  border: none;
  transition: background 0.18s, color 0.18s;
}
.btn-unefa:hover, .btn-unefa:focus {
  background: #002147;
  color: #ffc72c;
}
.btn-outline-secondary {
  border-color: #ffc72c;
  color: #002147;
}
.btn-outline-secondary:hover, .btn-outline-secondary:focus {
  background: #ffc72c;
  color: #002147;
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
@media (max-width: 600px) {
  .settings-card {
    padding: 1.2rem !important;
  }
  .profile-avatar, .avatar-wrapper {
    width: 62px;
    height: 62px;
  }
}
</style>