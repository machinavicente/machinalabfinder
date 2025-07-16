<template>
  <div v-if="currentView === 'settings'" class="dashboard-settings">
    <div class="row">
      <div class="col-lg-8">
        <div class="card mb-5">
          <div class="card-header">
            <h2 class="mb-0">Configuración de tu cuenta</h2>
          </div>
          <div class="card-body">
            <div class="settings-container">
              <div class="row">
                <div class="col-md-4">
                  <div class="profile-card text-center">
                    <div class="avatar-container mx-auto mb-4">
                      <img
                        :src="userAvatar"
                        class="rounded-circle border border-unefa-accent shadow-sm"
                        width="150"
                        alt="Avatar"
                      />
                    </div>

                    <!-- Nombre del usuario -->
                    <div class="user-name mb-5">
                      <h3 class="fw-semibold text-dark font-monospace">
                        {{ nuevoNombre}} {{ nuevoApellido }}
                      </h3>
                    </div>

                    <!-- Información de contacto -->
                    <div class="contact-info bg-light p-2 rounded-3 shadow-sm">
                      <!-- Email principal -->
                      <div class="email-item mb-3">
                        <div class="d-flex align-items-center">
                          <i
                            class="bi bi-envelope-fill text-unefa-accent me-2"
                          ></i>
                          <div class="text-start">
                            <p class="mb-0 small text-muted fw-semibold">
                              Email principal
                            </p>
                            <p class="mb-0 text-dark small">{{ userEmail }}</p>
                          </div>
                        </div>
                      </div>
                      <hr class="my-3" />
                      <!-- Email de recuperación -->
                      <div class="email-item">
                        <div class="d-flex align-items-center">
                          <i
                            class="bi bi-envelope-exclamation-fill text-unefa-accent me-2"
                          ></i>
                          <div class="text-start">
                            <p class="mb-0 small text-muted fw-semibold">
                              Email de recuperación
                            </p>
                            <p class="mb-0 text-dark small">{{ emailAlternativo }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-8">
                  <form
                    @submit.prevent="guardarPerfil"
                    autocomplete="off"
                    novalidate
                  >
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="nombre"
                        >Nombre completo
                        <span class="text-danger">*</span></label
                      >
                      <input
                        id="nombre"
                        v-model.trim="nuevoNombre"
                        class="form-control"
                        :class="{ 'is-invalid': nombreError }"
                        maxlength="32"
                        required
                        autocomplete="off"
                      />
                      <div v-if="nombreError" class="invalid-feedback">
                        {{ nombreError }}
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="apellido"
                        >Apellido <span class="text-danger">*</span></label
                      >
                      <input
                        id="apellido"
                        v-model.trim="nuevoApellido"
                        class="form-control"
                        :class="{ 'is-invalid': apellidoError }"
                        maxlength="32"
                        required
                        autocomplete="off"
                      />
                      <div v-if="apellidoError" class="invalid-feedback">
                        {{ apellidoError }}
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="email"
                        >Correo electrónico</label
                      >
                      <input
                        id="email"
                        type="email"
                        v-model="userEmail"
                        class="form-control"
                        disabled
                      />
                    </div>
                    <div class="mb-3">
                      <label
                        class="form-label fw-semibold"
                        for="emailAlternativo"
                        >Correo alternativo
                        <span class="text-danger">*</span></label
                      >
                      <input
                        id="emailAlternativo"
                        type="email"
                        v-model="emailAlternativo"
                        class="form-control"
                        :class="{ 'is-invalid': emailAlternativoError }"
                        placeholder="Ingresa un correo alternativo"
                      />
                      <div
                        v-if="emailAlternativoError"
                        class="invalid-feedback"
                      >
                        {{ emailAlternativoError }}
                      </div>
                    </div>
                    <hr />
                    <div class="mb-3">
                      <label class="form-label fw-semibold" for="password"
                        >Nueva contraseña
                        <span class="text-danger">*</span></label
                      >
                      <div class="input-group">
                        <input
                          :type="mostrarPassword ? 'text' : 'password'"
                          id="password"
                          v-model="nuevaPassword"
                          class="form-control"
                          :class="{ 'is-invalid': passwordError }"
                          minlength="6"
                          autocomplete="new-password"
                          placeholder="Nueva contraseña"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          tabindex="-1"
                          @click="mostrarPassword = !mostrarPassword"
                        >
                          <i
                            :class="mostrarPassword ? 'bi-eye-slash' : 'bi-eye'"
                          ></i>
                        </button>
                        <div
                          v-if="passwordError"
                          class="invalid-feedback d-block"
                        >
                          {{ passwordError }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center mt-4"
                    >
                      <button
                        class="btn btn-unefa-primary btn-success"
                        type="submit"
                        :disabled="loading"
                      >
                        <span v-if="loading"
                          ><i class="bi bi-arrow-repeat spin"></i>
                          Guardando...</span
                        >
                        <span v-else
                          ><i class="bi bi-save"></i> Guardar Cambios</span
                        >
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger ms-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEliminarCuenta"
                      >
                        <i class="bi bi-trash"></i> Eliminar cuenta
                      </button>
                    </div>
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
                <div class="security-label">Última sesión activa</div>
                <div class="security-value">
                  {{ formatDate(actualizadoEn) }}
                </div>
              </div>
            </div>
            <div class="security-item d-flex align-items-center">
              <div class="security-icon bg-info-light text-info">
                <i class="bi bi-clock-history"></i>
              </div>
              <div class="ms-3">
                <div class="security-label">Cuenta creada</div>
                <div class="security-value">{{ formatDate(creadoEn) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar Cuenta -->
    <div
      class="modal fade"
      id="modalEliminarCuenta"
      tabindex="-1"
      aria-labelledby="modalEliminarCuentaLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="modalEliminarCuentaLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>Confirmar
              eliminación
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
              puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmarEliminarCuenta"
            >
              <i class="bi bi-trash"></i> Eliminar definitivamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Mensaje -->
    <div
      class="modal fade"
      id="modalMensaje"
      tabindex="-1"
      aria-labelledby="modalMensajeLabel"
      aria-hidden="true"
      ref="modalMensajeRef"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div
            class="modal-header"
            :class="{
              'bg-success text-white': mensajeTipo === 'alert-success',
              'bg-warning text-dark': mensajeTipo === 'alert-warning',
              'bg-danger text-white': mensajeTipo === 'alert-danger',
              'bg-info text-white': mensajeTipo === 'alert-info',
            }"
          >
            <h5 class="modal-title" id="modalMensajeLabel">
              <i
                :class="{
                  'bi-check-circle': mensajeTipo === 'alert-success',
                  'bi-exclamation-triangle': mensajeTipo === 'alert-warning',
                  'bi-x-circle': mensajeTipo === 'alert-danger',
                  'bi-info-circle': mensajeTipo === 'alert-info',
                }"
                class="me-2"
              ></i>
              <span>
                {{
                  mensajeTipo === "alert-danger" &&
                  mensaje.includes("eliminada")
                    ? "Cuenta eliminada"
                    : "Aviso!"
                }}
              </span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Cerrar"
              v-if="
                !(
                  mensajeTipo === 'alert-danger' &&
                  mensaje.includes('eliminada')
                )
              "
              @click="cerrarModalMensaje"
            ></button>
          </div>
          <div class="modal-body">
            {{ mensaje }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              :class="
                mensajeTipo === 'alert-danger' && mensaje.includes('eliminada')
                  ? 'btn-danger'
                  : 'btn-primary'
              "
              @click="
                mensajeTipo === 'alert-danger' && mensaje.includes('eliminada')
                  ? irLogin()
                  : cerrarModalMensaje()
              "
            >
              {{
                mensajeTipo === "alert-danger" && mensaje.includes("eliminada")
                  ? "Ir al inicio de sesión"
                  : "Aceptar"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import type { SupabaseClient } from "@supabase/supabase-js";

const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };

const currentView = ref("settings");
const nuevoNombre = ref("");
const nuevoApellido = ref("");
const userEmail = ref("");
const emailAlternativo = ref("");
const emailAlternativoError = ref("");
const userAvatar = ref(
  "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
);
const userId = ref<number | null>(null);
const creadoEn = ref("");
const actualizadoEn = ref("");

const nuevaPassword = ref("");
const confirmarPassword = ref("");
const passwordError = ref("");

const loading = ref(false);
const mensaje = ref("");
const mensajeTipo = ref("alert-info");
const nombreError = ref("");
const apellidoError = ref("");
const mostrarPassword = ref(false);

const router = useRouter();

const originalNombre = ref("");
const originalApellido = ref("");
const originalEmailAlternativo = ref("");

let modalMensajeInstance: bootstrap.Modal | null = null;
const modalMensajeRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) {
    router.push("/login");
    return;
  }
  const usuario = JSON.parse(usuarioStr);
  userId.value = usuario.id;
  nuevoNombre.value = usuario.nombre;
  nuevoApellido.value = usuario.apellido;
  userEmail.value = usuario.email;

  const { data: userData } = await $supabase
    .from("usuarios")
    .select("creado_en, actualizado_en, emailAlternativo")
    .eq("id", userId.value)
    .single();

  creadoEn.value = userData?.creado_en || "";
  actualizadoEn.value = userData?.actualizado_en || "";
  emailAlternativo.value = userData?.emailAlternativo || "";
  originalEmailAlternativo.value = userData?.emailAlternativo || "";

  originalNombre.value = usuario.nombre;
  originalApellido.value = usuario.apellido;

  await nextTick();
  if (modalMensajeRef.value) {
    modalMensajeInstance = new bootstrap.Modal(modalMensajeRef.value, {
      backdrop: "static",
      keyboard: false,
    });
  }
});

function validar() {
  nombreError.value = "";
  apellidoError.value = "";
  passwordError.value = "";
  emailAlternativoError.value = "";
  let valido = true;

  if (!nuevoNombre.value || nuevoNombre.value.length < 3) {
    nombreError.value = "El nombre debe tener al menos 3 caracteres.";
    valido = false;
  }
  if (!nuevoApellido.value || nuevoApellido.value.length < 3) {
    apellidoError.value = "El apellido debe tener al menos 3 caracteres.";
    valido = false;
  }
  if (nuevaPassword.value && nuevaPassword.value.length < 6) {
    passwordError.value = "La contraseña debe tener al menos 6 caracteres.";
    valido = false;
  }
  if (
    emailAlternativo.value &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAlternativo.value)
  ) {
    emailAlternativoError.value =
      "Por favor ingresa un correo electrónico válido.";
    valido = false;
  }
  return valido;
}

async function guardarPerfil() {
  if (
    nuevoNombre.value === originalNombre.value &&
    nuevoApellido.value === originalApellido.value &&
    !nuevaPassword.value &&
    emailAlternativo.value === originalEmailAlternativo.value
  ) {
    mostrarMensaje(
      "No has realizado ningún cambio en tu perfil.",
      "alert-warning"
    );
    return;
  }

  if (!validar() || !userId.value) return;

  loading.value = true;
  mensaje.value = "";
  mensajeTipo.value = "alert-info";

  const updateData: any = {
    nombre: nuevoNombre.value,
    apellido: nuevoApellido.value,
    actualizado_en: new Date().toISOString(),
    emailAlternativo: emailAlternativo.value || null,
  };
  if (nuevaPassword.value) {
    updateData.password_hash = nuevaPassword.value;
  }

  const { error } = await $supabase
    .from("usuarios")
    .update(updateData)
    .eq("id", userId.value);

  loading.value = false;

  if (!error) {
    mostrarMensaje("Perfil actualizado correctamente.", "alert-success");
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      usuario.nombre = nuevoNombre.value;
      usuario.apellido = nuevoApellido.value;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
    originalNombre.value = nuevoNombre.value;
    originalApellido.value = nuevoApellido.value;
    originalEmailAlternativo.value = emailAlternativo.value;
    nuevaPassword.value = "";
    confirmarPassword.value = "";
  } else {
    mostrarMensaje("Error al actualizar el perfil.", "alert-danger");
  }
}

async function confirmarEliminarCuenta() {
  if (!userId.value) return;
  const { error } = await $supabase
    .from("usuarios")
    .delete()
    .eq("id", userId.value);

  const modal = document.getElementById("modalEliminarCuenta");
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal && bsModal.hide();
  }

  if (!error) {
    localStorage.removeItem("usuario");
    mostrarMensaje("Cuenta eliminada correctamente.", "alert-danger");
  } else {
    mostrarMensaje("Error al eliminar la cuenta.", "alert-danger");
  }
}

function mostrarMensaje(texto: string, tipo: string) {
  mensaje.value = texto;
  mensajeTipo.value = tipo;
  nextTick(() => {
    modalMensajeInstance?.show();
  });
}

function cerrarModalMensaje() {
  modalMensajeInstance?.hide();
}

function irLogin() {
  modalMensajeInstance?.hide();
  setTimeout(() => {
    router.push("/login");
  }, 300);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "...";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
</script>
