<template>
  <ClientOnly>
    <div class="container content py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-lg-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
              <i class="bi bi-shield-lock me-2 fs-4 text-warning"></i>
              <h3 class="mb-0 fs-5">Actualizar Contraseña</h3>
            </div>

            <div class="card-body">
              <p class="text-center mb-4 text-muted">Ingresa tu nueva contraseña para completar el proceso</p>
              
              <form @submit.prevent="onUpdatePassword" autocomplete="on" novalidate>
                <div class="row g-3">
                  <!-- Nueva Contraseña -->
                  <div class="col-12 position-relative">
                    <label for="password" class="form-label">
                      <i class="ri-lock-password-line me-1"></i> Nueva contraseña
                    </label>
                    <div class="input-group">
                      <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                        minlength="6"
                        autocomplete="new-password"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Confirmar Contraseña -->
                  <div class="col-12 position-relative">
                    <label for="confirm" class="form-label">
                      <i class="ri-lock-2-line me-1"></i> Confirmar contraseña
                    </label>
                    <div class="input-group">
                      <input
                        v-model="confirm"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        id="confirm"
                        placeholder="Repite la nueva contraseña"
                        required
                        minlength="6"
                        autocomplete="new-password"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Alertas -->
                  <div v-if="error" class="col-12">
                    <div class="alert alert-danger alert-dismissible fade show py-2" role="alert">
                      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                      <button
                        type="button"
                        class="btn-close"
                        @click="error = ''"
                      ></button>
                    </div>
                  </div>
                  <div v-if="success" class="col-12">
                    <div class="alert alert-success alert-dismissible fade show py-3" role="alert">
                      <i class="bi bi-person-check me-2"></i>{{ success }}
                      <button
                        type="button"
                        class="btn-close"
                        @click="success = ''"
                      ></button>
                    </div>
                  </div>

                  <!-- Botón de actualización -->
                  <div class="col-12 mt-2">
                    <button :disabled="loading" type="submit" class="btn btn-success w-100">
                      <template v-if="loading">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </template>
                      <template v-else>
                        <i class="ri-save-line me-2"></i> Guardar nueva contraseña
                      </template>
                    </button>
                  </div>

                  <!-- Enlace de regreso -->
                  <div class="col-12 text-center mt-3">
                    <NuxtLink to="/login" class="text-decoration-none">
                      <i class="ri-arrow-left-line me-1"></i> Volver al inicio de sesión
                    </NuxtLink>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { SupabaseClient } from '@supabase/supabase-js';

const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };
const router = useRouter();

onMounted(async () => {
  const { data } = await $supabase.auth.getSession();
  if (!data.session) {
    error.value = '¡Sesión de recuperación no encontrada! Usa el enlace enviado a tu correo.';
  }
});

async function onUpdatePassword() {
  error.value = '';
  success.value = '';

  // Validaciones de campos vacíos
  if (!password.value && !confirm.value) {
    error.value = 'Debes ingresar y confirmar tu nueva contraseña.';
    return;
  }
  if (!password.value) {
    error.value = 'Debes ingresar tu nueva contraseña.';
    return;
  }
  if (!confirm.value) {
    error.value = 'Debes confirmar tu nueva contraseña.';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (password.value !== confirm.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }

  loading.value = true;

  const { error: updateError } = await $supabase.auth.updateUser({
    password: password.value
  });

  if (updateError) {
    error.value = updateError.message || 'No se pudo actualizar la contraseña.';
    loading.value = false;
    return;
  }

  success.value = '¡Contraseña actualizada correctamente!';
  loading.value = false;

  setTimeout(() => {
    router.push('/login');
  }, 1500);
}
</script>

<style scoped>
.unefa-primary-bg {
  background-color: #003366;
}

.card {
  border-radius: 16px !important;
}

.card-header {
  border-radius: 13px 13px 0 0 !important;
}

.form-control {
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #ced4da;
}

.form-control:focus {
  border-color: #003366;
  box-shadow: 0 0 0 0.25rem rgba(0, 51, 102, 0.25);
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  padding: 10px;
  border-radius: 8px;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

.btn-outline-secondary {
  border-radius: 0 8px 8px 0;
  border-left: none;
}

.input-group .form-control:not(:first-child) {
  border-radius: 0 8px 8px 0 !important;
}

.input-group .form-control:first-child {
  border-radius: 8px 0 0 8px !important;
}

a {
  color: #003366;
  transition: color 0.2s;
}

a:hover {
  color: #002147;
  text-decoration: underline;
}

.text-muted {
  color: #6c757d !important;
}

.position-relative {
  position: relative;
}

.container.content {
  max-width: 100%;
  padding: 0 15px;
}
</style>