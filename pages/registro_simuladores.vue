<template>
  <div class="container content py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg border-0 rounded-4">
          <div
            class="card-header unefa-primary-bg text-white d-flex align-items-center"
          >
            <i class="bi bi-plus-square me-2 fs-4 text-danger"></i>
            <h3 class="mb-0 fs-5">Registrar Nuevo Simulador</h3>
          </div>

          <div class="card-body">
            <div
              v-if="successMessage"
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {{ successMessage }}
              <button
                type="button"
                class="btn-close"
                @click="successMessage = null"
              ></button>
            </div>
            <div
              v-if="error"
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {{ error }}
              <button
                type="button"
                class="btn-close"
                @click="error = null"
              ></button>
            </div>

            <div class="mb-3 d-flex align-items-center justify-content-between">
              <label class="form-label fw-semibold mb-0">Progreso del formulario</label>
              <span class="progress-label text-end w-75" style="font-size:1rem;">
                {{ formProgress }}%
                <span v-if="formProgress === 0" class="ms-2 text-danger">Formulario vacío</span>
                <span v-else-if="formProgress < 40" class="ms-2 text-danger">{{ estadoProgreso }}</span>
                <span v-else-if="formProgress < 80" class="ms-2 text-warning">{{ estadoProgreso }}</span>
                <span v-else-if="formProgress < 100" class="ms-2 text-primary">{{ estadoProgreso }}</span>
                <span v-else class="ms-2 text-success fw-bold">¡Listo para guardar!</span>
              </span>
            </div>
            <div class="progress mb-3" style="height: 10px;">
              <div
                v-if="formProgress > 0"
                class=" progress-bar progress-bar-striped progress-bar-animated bg-success"
                role="progressbar"
                :style="{ width: formProgress + '%' }"
                :aria-valuenow="formProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <form @submit.prevent="submitForm">
              <div class="row g-3">
                <!-- Nombre -->
                <div class="col-12 position-relative">
                  <label for="nombre" class="form-label">
                    <i class="ri-file-text-line me-1"></i> Nombre del Simulador <span class="requerided text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-model="simulador.nombre_del_simulador"
                    required
                    placeholder="SQLMaster - Simulador de Bases de Datos"
                  />
                  <small
                    class="text-muted position-absolute"
                    style="bottom: 5px; right: 10px; font-size: 0.8rem"
                  >
                    {{ simulador.nombre_del_simulador.length }}
                  </small>
                </div>

                <!-- Descripción -->
                <div class="col-12 position-relative">
                  <label for="descripcion" class="form-label">
                    <i class="ri-file-description-line me-1"></i> Descripción <span class="requerided text-danger">*</span>
                  </label>
                  <textarea
                    class="form-control"
                    id="descripcion"
                    rows="3"
                    v-model="simulador.descripcion_del_simulador"
                    required
                    placeholder="Entorno seguro para practicar consultas, diseño y optimización..."
                  ></textarea>
                  <small
                    class="text-muted position-absolute"
                    style="bottom: 5px; right: 10px; font-size: 0.8rem"
                  >
                    {{ simulador.descripcion_del_simulador.length }}
                  </small>
                </div>

                <!-- Asignatura -->
                <div class="col-md-6">
                  <label for="asignatura" class="form-label">
                    <i class="ri-book-2-line me-1"></i> Asignatura <span class="requerided text-danger">*</span>
                  </label>
                  <select
                    class="form-select"
                    id="asignatura"
                    v-model="simulador.asignatura"
                    required
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Matemáticas I">Matemáticas I</option>
                    <option value="Matemáticas II">Matemáticas II</option>
                    <option value="Matemáticas III">Matemáticas III</option>
                    <option value="Química">Química</option>
                    <option value="Física I">Física I</option>
                    <option value="Física II">Física II</option>
                    <option value="Programación">Programación</option>
                    <option value="Lenguajes de Programación I">
                      Lenguajes de Programación I
                    </option>
                    <option value="Lenguajes de Programación II">
                      Lenguajes de Programación II
                    </option>
                    <option value="Lenguajes de Programación III">
                      Lenguajes de Programación III
                    </option>
                    <option value="Procesamiento de Datos">
                      Procesamiento de Datos
                    </option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="Redes">Redes</option>
                    <option value="Sistemas Operativos">
                      Sistemas Operativos
                    </option>
                    <option value="Simulación y Modelos">
                      Simulación y Modelos
                    </option>
                    <option value="Otra...">Otra...</option>
                  </select>
                </div>

                <!-- Otra Asignatura -->
                <div v-if="mostrarOtraAsignatura" class="col-md-6">
                  <label for="otra-asignatura" class="form-label">
                    <i class="ri-book-open-line me-1"></i> Otra Asignatura <span class="requerided text-danger">*</span>
                  </label>
                  <select
                    id="otra-asignatura"
                    class="form-select"
                    v-model="simulador.otra_asignatura"
                    required
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Matemática General">
                      Matemática General
                    </option>
                    <option value="Física General">Física General</option>
                    <option value="Cálculo Numérico">Cálculo Numérico</option>
                    <option value="Probabilidad y Estadística">
                      Probabilidad y Estadística
                    </option>
                    <option value="Lógica Matemática">Lógica Matemática</option>
                    <option value="Circuitos Lógicos">Circuitos Lógicos</option>
                    <option value="Investigación de Operaciones">
                      Investigación de Operaciones
                    </option>
                    <option value="Arquitectura del Computador">
                      Arquitectura del Computador
                    </option>
                    <option value="Optimización No Lineal">
                      Optimización No Lineal
                    </option>
                    <option value="Procesos Estocásticos">
                      Procesos Estocásticos
                    </option>
                    <option value="Geometría Analítica">
                      Geometría Analítica
                    </option>
                  </select>
                </div>

                <!-- Enlace -->
                <div class="col-md-6">
                  <label for="enlace" class="form-label">
                    <i class="ri-link-m"></i> Enlace del Simulador <span class="requerided text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    class="form-control"
                    id="enlace"
                    v-model="simulador.enlace"
                    required
                    placeholder="https://www.simulador.com"
                  />
                </div>

                <!-- Categoría -->
                <div class="col-md-6 position-relative">
                  <label for="categoria" class="form-label">
                    <i class="ri-folder-4-line me-1"></i> Categoría <span class="requerided text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="categoria"
                    v-model="simulador.categoria"
                    placeholder="Ej: Compilador, Diagramador, Calculadora..."
                  />
                  <small
                    class="text-muted position-absolute"
                    style="bottom: 5px; right: 10px; font-size: 0.8rem"
                  >
                    {{ simulador.categoria.length }}
                  </small>
                </div>

                <!-- Fecha -->
                <div class="col-md-6">
                  <label for="fecha" class="form-label">
                    <i class="ri-calendar-event-line me-1"></i> Fecha de
                    Registro
                  </label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="fecha"
                    v-model="simulador.created_at"
                    readonly
                  />
                </div>

                <!-- Botones -->
                <div class="col-12 mt-4 d-flex justify-content-between">
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="resetForm"
                  >
                    <i class="ri-close-circle-line me-2"></i> Vaciar
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    :disabled="loading"
                  >
                    <template v-if="loading">
                      <span
                        class="spinner-border"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Procesando...
                    </template>
                    <template v-else>
                      <i class="ri-save-line me-2"></i> Guardar Simulador
                    </template>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de advertencia -->
      <div
        v-if="modalAdvertencia"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0, 0, 0, 0.4)"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title text-dark">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ¡Atención!
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="modalAdvertencia = false"
              ></button>
            </div>
            <div class="modal-body text-dark">
              <p>
                Solo dispones de <b>8 horas</b> para modificar o eliminar este
                simulador en caso de algún error o cambio necesario.
                <br />
                Después de ese tiempo, no podrás realizar cambios.
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success" @click="modalAdvertencia = false">
                Ok!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNuxtApp } from "#app";
import { forbiddenKeywords } from "@/utils/validate_form.js";

function getVenezuelaDateTimeString() {
  const now = new Date();
  const venezuelaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Caracas" })
  );
  const year = venezuelaDate.getFullYear();
  const month = String(venezuelaDate.getMonth() + 1).padStart(2, "0");
  const day = String(venezuelaDate.getDate()).padStart(2, "0");
  const hours = String(venezuelaDate.getHours()).padStart(2, "0");
  const minutes = String(venezuelaDate.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default {
  data() {
    return {
      simulador: {
        nombre_del_simulador: "",
        descripcion_del_simulador: "",
        categoria: "",
        enlace: "",
        asignatura: "",
        otra_asignatura: "",
        created_at: getVenezuelaDateTimeString(),
      },
      loading: false,
      error: null,
      successMessage: null,
      modalAdvertencia: false,
    };
  },

  computed: {
    formProgress() {
      // Campos requeridos 
      const campos = [
        this.simulador.nombre_del_simulador,
        this.simulador.descripcion_del_simulador,
        this.simulador.enlace,
        this.simulador.asignatura,
        this.simulador.categoria,
        this.mostrarOtraAsignatura ? this.simulador.otra_asignatura : null
      ].filter(v => v !== null);

      // Si todos los campos requeridos están vacíos, progreso es 0
      if (campos.every(v => !v || v.trim().length === 0)) return 0;

      // Checks de validez
      const checks = [
        this.simulador.nombre_del_simulador.trim().length >= 7,
        this.simulador.descripcion_del_simulador.trim().length >= 7,
        this.isValidUrl(this.simulador.enlace),
        !!this.simulador.asignatura,
        this.simulador.categoria.trim().length >= 4,
        !this.mostrarOtraAsignatura || (this.simulador.otra_asignatura && this.simulador.otra_asignatura.trim().length >= 5)
      ];
      const total = checks.length;
      const valid = checks.filter(Boolean).length;
      return Math.floor((valid / total) * 100);
    },
    mostrarOtraAsignatura() {
      return this.simulador.asignatura === 'Otra...';
    },
    estadoProgreso() {
      // Mensaje personalizado según el campo que falta
      if (this.formProgress === 0) return "Formulario vacío";
      if (this.simulador.nombre_del_simulador.trim().length < 7)
        return "Ingresa el nombre del simulador";
      if (this.simulador.descripcion_del_simulador.trim().length < 7)
        return "Agrega una descripción";
      if (!this.isValidUrl(this.simulador.enlace))
        return "Coloca un enlace válido";
      if (!this.simulador.asignatura)
        return "Selecciona una asignatura";
      if (this.simulador.categoria.trim().length < 4)
        return "Especifica la categoría";
      if (this.mostrarOtraAsignatura && (!this.simulador.otra_asignatura || this.simulador.otra_asignatura.trim().length < 5))
        return "Selecciona la otra asignatura";
      if (this.formProgress < 100) return "¡Casi listo!";
      return "";
    }
  },

  methods: {
    containsForbiddenKeyword(url, keywords) {
      const lowerUrl = url.toLowerCase();
      return keywords.some((k) => lowerUrl.includes(k.toLowerCase()));
    },

    normalizeUrl(url) {
      return url
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
    },

    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },

    async validateForm() {
      // Validar que ningún campo esté vacío (excepto otra_asignatura)
      const campos = [
        {
          valor: this.simulador.nombre_del_simulador,
          nombre: "nombre del simulador",
        },
        {
          valor: this.simulador.descripcion_del_simulador,
          nombre: "descripción del simulador",
        },
        { valor: this.simulador.categoria, nombre: "categoría" },
        { valor: this.simulador.enlace, nombre: "enlace" },
        { valor: this.simulador.asignatura, nombre: "asignatura" },
      ];

      for (const campo of campos) {
        if (!campo.valor || campo.valor.trim().length === 0) {
          this.error = `El campo ${campo.nombre} no puede estar vacío ni contener solo espacios.`;
          return false;
        }
      }

      // "Otra..." validar el campo otra_asignatura
      if (this.mostrarOtraAsignatura) {
        if (
          !this.simulador.otra_asignatura ||
          this.simulador.otra_asignatura.trim().length === 0
        ) {
          this.error = 'Debe seleccionar una asignatura en "Otra asignatura".';
          return false;
        }
        if (this.simulador.otra_asignatura.trim().length < 5) {
          this.error =
            "La asignatura seleccionada debe tener al menos 5 caracteres.";
          return false;
        }
      }

      if (!this.isValidUrl(this.simulador.enlace)) {
        this.error = "El enlace no es válido.";
        return false;
      }
      if (
        this.containsForbiddenKeyword(this.simulador.enlace, forbiddenKeywords)
      ) {
        this.error =
          "Este enlace contiene contenido no apto para un entorno educativo. Por favor, Intente de nuevo.";
        return false;
      }
      if (
        this.containsForbiddenKeyword(
          this.simulador.nombre_del_simulador,
          forbiddenKeywords
        ) ||
        this.containsForbiddenKeyword(
          this.simulador.descripcion_del_simulador,
          forbiddenKeywords
        )
      ) {
        this.error =
          "Nombre o Descripción no aptos para registrarse como un recurso educativo.";
        return false;
      }

      const nuxtApp = useNuxtApp();
      const supabaseClient = nuxtApp.$supabase;
      const inputUrl = this.normalizeUrl(this.simulador.enlace);

      const { data: existing, error: fetchError } = await supabaseClient
        .from("simuladores")
        .select("enlace");

      if (fetchError) {
        this.error = "No se pudo verificar si el enlace ya existe.";
        return false;
      }

      const urlYaExiste = (existing || []).some(
        (entry) => this.normalizeUrl(entry.enlace) === inputUrl
      );

      if (urlYaExiste) {
        this.error = "Este simulador ya ha sido registrado previamente.";
        return false;
      }

      if (!this.simulador.asignatura) {
        this.error = "Debe seleccionar una asignatura.";
        return false;
      }

      if (this.mostrarOtraAsignatura && !this.simulador.otra_asignatura) {
        this.error = 'Debe seleccionar una asignatura en "Otra asignatura".';
        return false;
      }

      return true;
    },

    async submitForm() {
      if (!(await this.validateForm())) return;

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const created_at = getVenezuelaDateTimeString();

        const asignaturaFinal = this.mostrarOtraAsignatura
          ? this.simulador.otra_asignatura
          : this.simulador.asignatura;

        const nuxtApp = useNuxtApp();
        const supabaseClient = nuxtApp.$supabase;

        const { error } = await supabaseClient.from("simuladores").insert([
          {
            nombre_del_simulador: this.simulador.nombre_del_simulador,
            descripcion_del_simulador: this.simulador.descripcion_del_simulador,
            categoria: this.simulador.categoria,
            enlace: this.simulador.enlace,
            asignatura: asignaturaFinal,
            created_at,
          },
        ]);

        if (error) throw error;

        this.showSuccess("Simulador registrado con éxito!");
        this.modalAdvertencia = true;
        this.resetForm();
      } catch (error) {
        this.error =
          error.message || "Ocurrió un error al registrar el simulador";
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.simulador = {
        nombre_del_simulador: "",
        descripcion_del_simulador: "",
        categoria: "",
        enlace: "",
        asignatura: "",
        otra_asignatura: "",
        created_at: getVenezuelaDateTimeString(),
      };
      this.error = null;
    },

    showSuccess(msg) {
      this.successMessage = msg;
      setTimeout(() => {
        this.successMessage = null;
      }, 4000);
    },
  },
};
</script>

<style scoped>
input {
  text-overflow: ellipsis;
}

.unefa-primary-bg {
  background-color: #003366;
}

.progress-label {
  min-width: 180px;
  display: block;
  text-align: right;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
