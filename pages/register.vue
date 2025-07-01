<template>
  <ClientOnly>
    <div class="container content py-5 min-vh-100 d-flex align-items-center">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
              <i class="bi bi-person-plus me-2 fs-4 text-warning"></i>
              <h3 class="mb-0 fs-5">Registro de Usuario</h3>
            </div>

            <div class="card-body">
              <p class="text-center mb-4 text-muted">Crea tu cuenta para acceder a MachinaLab Finder</p>
              
              <form @submit.prevent="onRegister">
                <div class="row g-3">
                  <!-- Nombre -->
                  <div class="col-12 position-relative">
                    <label for="name" class="form-label">
                      <i class="ri-user-3-line me-1"></i> Nombre completo
                    </label>
                    <input
                      v-model="name"
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Tu nombre"
                      required
                      autocomplete="name"
                    />
                  </div>

                  <!-- Email -->
                  <div class="col-12 position-relative">
                    <label for="email" class="form-label">
                      <i class="ri-mail-line me-1"></i> Correo electrónico
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
                      <i class="ri-lock-2-line me-1"></i> Contraseña
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
                        @click="togglePasswordVisibility"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
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
                      <i class="bi bi-check-circle me-2"></i>{{ success }}
                      <button
                        type="button"
                        class="btn-close"
                        @click="success = ''"
                      ></button>
                    </div>
                  </div>

                  <!-- Botón de registro -->
                  <div class="col-12 mt-2">
                    <button :disabled="loading" type="submit" class="btn btn-success w-100">
                      <template v-if="loading">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Registrando...
                      </template>
                      <template v-else>
                        <i class="ri-user-add-line me-2"></i> Registrarse
                      </template>
                    </button>
                  </div>

                  <!-- Enlace a login -->
                  <div class="col-12 text-center mt-3">
                    <span class="text-muted">¿Ya tienes cuenta?</span>
                    <NuxtLink to="/login" class="ms-2 text-decoration-none">
                      <i class="ri-login-box-line me-1"></i> Inicia sesión aquí
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

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);

import type { SupabaseClient } from '@supabase/supabase-js';

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

async function onRegister() {
  error.value = '';
  success.value = '';

  // Validaciones de campos vacíos
  if (!name.value && !email.value && !password.value) {
    error.value = 'Debes ingresar tu nombre, correo y contraseña.';
    return;
  }
  if (!name.value) {
    error.value = 'Debes ingresar tu nombre completo.';
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

  const { error: signUpError } = await $supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { name: name.value }
    }
  });

  if (signUpError) {
    // Traducción manual de los mensajes más comunes
    let mensaje = signUpError.message;
    if (mensaje === 'User already registered') {
      mensaje = 'Este correo ya está registrado.';
    }
    error.value = mensaje || 'Error al registrar. Intenta de nuevo.';
  } else {
    success.value = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.';
    name.value = '';
    email.value = '';
    password.value = '';
  }
  loading.value = false;
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
</style>