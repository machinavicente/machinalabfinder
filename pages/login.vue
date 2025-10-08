<template>
  <ClientOnly>
    <div class="container content py-5 min-vh-100 d-flex align-items-center">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
              <i class="bi bi-box-arrow-in-right me-2 fs-4 text-warning"></i>
              <h3 class="mb-0 fs-5">Acceso</h3>
            </div>

            <div class="card-body">
              <p class="text-center mb-4 text-muted">Ingresa tus credenciales para continuar</p>
              
              <form @submit.prevent="onLogin" autocomplete="on" novalidate>
                <div class="row g-3">
                  <!-- Email -->
                  <div class="col-12 position-relative">
                    <label for="email" class="form-label">
                      <i class="ri-mail-line me-1"></i> Correo electrónico <span class="requerided text-danger">*</span>
                    </label>
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

                  <!-- Password -->
                  <div class="col-12 position-relative">
                    <label for="password" class="form-label">
                      <i class="ri-lock-2-line me-1"></i> Contraseña <span class="requerided text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <input
                        v-model="password"
                        :type="showPass ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        placeholder="Contraseña"
                        required
                        autocomplete="current-password"
                        minlength="6"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showPass = !showPass"
                      >
                        <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Alertas -->
                  <div v-if="error" class="col-12">
                    <div class="alert alert-danger alert-dismissible fade show py-3 jus" role="alert">
                      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                      <button
                        type="button"
                        class="btn-close"
                        @click="error = ''"
                      ></button>
                    </div>
                  </div>
                  <div v-if="success" class="col-12">
                    <div class="alert alert-success alert-dismissible fade show py-2" role="alert">
                      <i class="bi bi-person-check me-2"></i>{{ success }}
                    </div>
                  </div>

                  <!-- Botón de login -->
                  <div class="col-12 mt-2">
                    <button :disabled="loading" type="submit" class="btn btn-success w-100">
                      <template v-if="loading">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Iniciando...
                      </template>
                      <template v-else>
                        <i class="ri-login-box-line me-2 text-success"></i> Iniciar sesión
                      </template>
                    </button>
                  </div>

                  <!-- Enlaces adicionales -->
                  <div class="col-12 text-center mt-3">
                    <NuxtLink to="/resetPassword" class="text-decoration-none small">
                      <i class="ri-question-line me-1"></i> ¿Olvidaste tu contraseña?
                    </NuxtLink>
                  </div>
                  <div class="col-12 text-center mt-1">
                    <span class="text-muted small">¿No tienes cuenta?</span>
                    <NuxtLink to="/register" class="ms-2 text-decoration-none small">
                      <i class="ri-user-add-line me-1"></i> Regístrate
                    </NuxtLink>
                  </div>
                  <div class="col-12 text-center mt-3">
                    <NuxtLink to="/" class="text-decoration-none small">
                      <i class="bi bi-arrow-left me-1"></i> Volver al inicio
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPass = ref(false);

import type { SupabaseClient } from '@supabase/supabase-js';

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };
const router = useRouter();

async function onLogin() {
  error.value = '';
  success.value = '';

  // Validaciones de campos vacíos
  if (!email.value && !password.value) {
    error.value = 'Debes ingresar tu correo y tu contraseña.';
    return;
  }
  if (!email.value) {
    error.value = 'Debes ingresar tu correo electrónico.';
    return;
  }
  if (!password.value) {
    error.value = 'Debes ingresar tu contraseña.';
    return;
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  loading.value = true;

  // Buscar usuario por email
  const { data, error: queryError } = await $supabase
    .from('usuarios')
    .select('id, nombre, apellido, email, password_hash')
    .eq('email', email.value)
    .single();

  if (queryError || !data) {
    error.value = 'Correo o contraseña incorrectos.';
    loading.value = false;
    return;
  }

  // Comparar contraseña (texto plano, solo ejemplo)
  if (data.password_hash !== password.value) {
    error.value = 'Correo o contraseña incorrectos.';
    loading.value = false;
    return;
  }

  // Guardar sesión simple en localStorage (solo ejemplo)
  localStorage.setItem('usuario', JSON.stringify({
    id: data.id,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email
  }));

  success.value = `¡Bienvenido, ${data.nombre}!`;
  email.value = '';
  password.value = '';
  loading.value = false;

  setTimeout(() => {
    router.push('/userProfile');
  }, 1000);
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
}


.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

.btn-outline-secondary {
  border-radius: 0 8px 8px 0;
}

.input-group .form-control {
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
</style>