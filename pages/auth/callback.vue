<template>
  <ClientOnly>
    <div class="container content py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-lg-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
              <i class="bi bi-shield-lock me-2 fs-4 text-warning"></i>
              <h3 class="mb-0 fs-5">Autenticación</h3>
            </div>
            <div class="card-body">
              <div v-if="status === 'recovery'">
                <p class="text-center mb-4 text-muted">Ingresa tu nueva contraseña para completar el proceso</p>
                <form @submit.prevent="onUpdatePassword" autocomplete="on" novalidate>
                  <div class="mb-3">
                    <label for="password" class="form-label">Nueva contraseña</label>
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" id="password" required minlength="6" autocomplete="new-password" />
                    <button type="button" class="btn btn-outline-secondary mt-2" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div class="mb-3">
                    <label for="confirm" class="form-label">Confirmar contraseña</label>
                    <input v-model="confirm" :type="showConfirmPassword ? 'text' : 'password'" class="form-control" id="confirm" required minlength="6" autocomplete="new-password" />
                    <button type="button" class="btn btn-outline-secondary mt-2" @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="error" class="alert alert-danger">{{ error }}</div>
                  <div v-if="success" class="alert alert-success">{{ success }}</div>
                  <button :disabled="loading" type="submit" class="btn btn-success w-100">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Guardar nueva contraseña
                  </button>
                </form>
              </div>
              <div v-else-if="status === 'confirmation'">
                <div class="alert alert-success text-center">
                  <i class="bi bi-check-circle me-2"></i>
                  ¡Correo confirmado correctamente! Ya puedes iniciar sesión.
                </div>
                <NuxtLink to="/login" class="btn btn-primary w-100 mt-3">Ir al inicio de sesión</NuxtLink>
              </div>
              <div v-else>
                <div class="text-center py-5">
                  <span class="spinner-border"></span>
                  <p class="mt-3">Procesando...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import type { SupabaseClient } from '@supabase/supabase-js';

const route = useRoute();
const router = useRouter();
const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };

const status = ref<'recovery' | 'confirmation' | 'loading'>('loading');
const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  const type = route.query.type;
  if (type === 'recovery') {
    status.value = 'recovery';
  } else if (type === 'signup' || type === 'email_confirm') {
    status.value = 'confirmation';
  } else {
    status.value = 'loading';
  }
});

async function onUpdatePassword() {
  error.value = '';
  success.value = '';

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