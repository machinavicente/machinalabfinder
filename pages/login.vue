<template>
  <ClientOnly>
    <section class="py-5 unefa-primary-bg text-white min-vh-100 d-flex align-items-center">
      <div class="container">
        <h2 class="text-center mb-4 text-unefa-accent fw-bold">Accede a tu cuenta</h2>
        <p class="text-center mb-4">Ingresa tus credenciales para continuar.</p>
        <form @submit.prevent="onLogin" autocomplete="on" novalidate class="register-form p-4 rounded mx-auto" style="max-width: 420px;">
          <div class="mb-3">
            <label for="email" class="form-label fw-bold text-unefa-accent">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              class="form-control input-glass"
              id="email"
              placeholder="ejemplo@correo.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label fw-bold text-unefa-accent">Contraseña</label>
            <input
              v-model="password"
              type="password"
              class="form-control input-glass"
              id="password"
              placeholder="Contraseña"
              required
              autocomplete="current-password"
              minlength="6"
            />
          </div>
          <button :disabled="loading" type="submit" class="btn btn-unefa w-100 fw-bold">
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Iniciando...
            </span>
            <span v-else>
              Iniciar sesión
            </span>
          </button>
          <div v-if="error" class="alert alert-danger mt-3 py-2 px-3 small text-center">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
          </div>
          <div v-if="success" class="alert alert-success mt-3 py-2 px-3 small text-center">
            <i class="bi bi-person-check me-2"></i>{{ success }}
          </div>
        </form>
        <div class="text-center mt-4">
          <span class="text-white-50">¿No tienes cuenta?</span>
          <NuxtLink to="/register" class="ms-2 fw-bold text-unefa-accent text-decoration-underline">
            Regístrate
          </NuxtLink>
        </div>
        <div class="text-center mt-3">
          <NuxtLink to="/" class="text-unefa-accent small text-decoration-none">
            <i class="bi bi-arrow-left"></i> Volver al inicio
          </NuxtLink>
        </div>
      </div>
    </section>
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

const { $supabase } = useNuxtApp();
const router = useRouter();

async function onLogin() {
  error.value = '';
  success.value = '';
  loading.value = true;

  const { data, error: loginError } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (loginError) {
    error.value = loginError.message || 'Error al iniciar sesión. Verifica tus datos.';
    loading.value = false;
    return;
  }

  const user = data?.user;
  const userName = user?.user_metadata?.name || 'Usuario';

  success.value = `¡Bienvenido, ${userName}!`;
  email.value = '';
  password.value = '';
  loading.value = false;

  setTimeout(() => {
    router.push('/userProfile');
  }, 1000);
}
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

/* Usa las mismas clases y estilos de registro */

.unefa-primary-bg {
  background: linear-gradient(120deg, #002147 70%, #003366 100%);
  min-height: 100vh;
  padding: 2rem 0;
  display: flex;
  align-items: center;
}

.register-form {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px) saturate(110%);
  border: 1.3px solid rgba(255, 199, 44, 0.4);
  box-shadow: none;
  border-radius: 1rem;
  transition: background-color 0.3s ease;
  margin: 0 auto;
}

.register-form:hover {
  background: rgba(255,255,255,0.09);
}

.input-glass {
  background: rgba(255,255,255,0.12);
  border: 1.5px solid #ffc72c;
  color: #fff;
  font-weight: 500;
  border-radius: 0.7rem;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;
  padding: 0.5rem 1rem;
}

.input-glass::placeholder {
  color: #fff;
  font-weight: 400;
}

.input-glass:focus {
  border-color: #c8102e;
  box-shadow: 0 0 6px rgba(200,16,46,0.3);
  background: rgba(255,255,255,0.20);
  color: #fff;
  outline: none;
}

.show-pass-btn {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: #ffc72c;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 2;
}

.show-pass-btn:hover {
  color: #c8102e;
}

.text-unefa-accent {
  color: #ffc72c !important;
}

.btn-unefa {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 0.7rem;
  padding: 0.65rem;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.btn-unefa:hover, .btn-unefa:focus {
  background-color: #a00d26;
  color: white;
}

.alert {
  border-radius: 0.7rem;
  font-size: 0.85rem;
  margin-bottom: 0;
}

.alert-danger {
  background-color: rgba(200, 16, 46, 0.15);
  color: #c8102e;
  border: none;
}

.alert-success {
  background-color: rgba(255, 199, 44, 0.15);
  color: #ffc72c;
  border: none;
}

.text-center {
  text-align: center;
}

.text-white-50 {
  color: rgba(255,255,255,0.6) !important;
}

.text-decoration-underline {
  text-decoration: underline !important;
}

@media (max-width: 575.98px) {
  .register-form {
    padding: 2rem 1.5rem;
  }
}
</style>
