<template>
  <ClientOnly>
    <div class="container content py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-lg-6 d-flex justify-content-center">
          <div class="card shadow-lg border-0 rounded-4" style="min-width:340px;max-width:420px;width:100%;">
            <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
              <i class="bi bi-key me-2 fs-4 text-warning"></i>
              <h3 class="mb-0 fs-5">Recuperar Contraseña</h3>
            </div>

            <div class="card-body">
              <p class="text-center mb-4 text-muted">Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña</p>
              
              <form @submit.prevent="onReset" autocomplete="on" novalidate>
                <div class="row g-3">
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

                  <!-- Alertas -->
                  <div v-if="error" class="col-12 d-flex justify-content-center">
                    <div class="alert alert-danger alert-dismissible fade show py-3 mx-auto" role="alert" style="max-width: 420px; width:100%; display: flex; align-items: center; flex-direction: column;">
                      <button
                        type="button"
                        class="btn-close align-self-end"
                        @click="error = ''"
                      ></button>
                      <div class="d-flex align-items-center justify-content-center w-100">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <span>{{ error }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="success" class="col-12 d-flex justify-content-center">
                    <div class="alert alert-success alert-dismissible fade show py-2 mx-auto" role="alert" style="max-width: 420px; width:100%; display: flex; align-items: center; flex-direction: column;">
                      <button
                        type="button"
                        class="btn-close align-self-end"
                        @click="success = ''"
                      ></button>
                      <div class="d-flex align-items-center justify-content-center w-100">
                        <i class="bi bi-envelope-check me-2"></i>
                        <span>{{ success }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Botón de envío -->
                  <div class="col-12 mt-2">
                    <button :disabled="loading" type="submit" class="btn btn-success w-100">
                      <template v-if="loading">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Enviando...
                      </template>
                      <template v-else>
                        <i class="ri-send-plane-line me-2"></i> Enviar instrucciones
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
import { ref } from 'vue';
import type { SupabaseClient } from '@supabase/supabase-js';

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };

async function onReset() {
  error.value = '';
  success.value = '';

  // Validación de campo vacío
  if (!email.value) {
    error.value = 'Debes ingresar tu correo electrónico.';
    return;
  }

  loading.value = true;

  const { error: resetError } = await $supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: window.location.origin + '/updatePassword'
  });

  if (resetError) {
    // Traducción manual de los mensajes más comunes
    let mensaje = resetError.message;
    if (mensaje === 'User not found') {
      mensaje = 'No existe una cuenta con ese correo.';
    }
    error.value = mensaje || 'No se pudo enviar el correo. Intenta de nuevo.';
    loading.value = false;
    return;
  }

  success.value = '¡Revisa tu correo para continuar con el restablecimiento!';
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