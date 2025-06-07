<template>
  <div class="container content py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
            <i class="bi bi-plus-square me-2 fs-4 text-danger"></i>
            <h3 class="mb-0 fs-5">Registrar Nuevo Simulador</h3>
          </div>

          <div class="card-body">
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = null"></button>
            </div>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ error }}
              <button type="button" class="btn-close" @click="error = null"></button>
            </div>

            <div class="mb-3">
              <label>Progreso del formulario</label>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                  :style="{ width: formProgress + '%' }" :aria-valuenow="formProgress" aria-valuemin="0"
                  aria-valuemax="100" style="background-color: rgb(34, 197, 74);">
                </div>
              </div>
            </div>

            <form @submit.prevent="submitForm">
              <div class="row g-3">
                <!-- Nombre -->
                <div class="col-12 position-relative">
                  <label for="nombre" class="form-label">
                    <i class="ri-file-text-line me-1"></i> Nombre del Simulador
                  </label>
                  <input type="text" class="form-control" id="nombre" v-model="simulador.nombre_del_simulador" required
                    placeholder="SQLMaster - Simulador de Bases de Datos" />
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.nombre_del_simulador.length }}
                  </small>
                </div>

                <!-- Descripción -->
                <div class="col-12 position-relative">
                  <label for="descripcion" class="form-label">
                    <i class="ri-file-description-line me-1"></i> Descripción
                  </label>
                  <textarea class="form-control" id="descripcion" rows="3" v-model="simulador.descripcion_del_simulador"
                    required placeholder="Entorno seguro para practicar consultas, diseño y optimización..."></textarea>
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.descripcion_del_simulador.length }}
                  </small>
                </div>

                <!-- Asignatura -->
                <div class="col-md-6">
                  <label for="asignatura" class="form-label">
                    <i class="ri-book-2-line me-1"></i> Asignatura
                  </label>
                  <select class="form-select" id="asignatura" v-model="simulador.asignatura" required>
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Matemáticas I">Matemáticas I</option>
                    <option value="Matemáticas II">Matemáticas II</option>
                    <option value="Matemáticas III">Matemáticas III</option>
                    <option value="Quimica">Química</option>
                    <option value="Física I">Física I</option>
                    <option value="Física II">Física II</option>
                    <option value="Programación">Programación</option>
                    <option value="Lenguajes de Programacion I">Lenguajes de Programación I</option>
                    <option value="Lenguajes de Programacion II">Lenguajes de Programación II</option>
                    <option value="Lenguajes de Programacion III">Lenguajes de Programación III</option>
                    <option value="Procesamiento de Datos">Procesamiento de Datos</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="Redes">Redes</option>
                    <option value="Sistemas Operativos">Sistemas Operativos</option>
                    <option value="Simulacion y Modelos">Simulación y Modelos</option>
                    <option value="Otra...">Otra...</option>
                  </select>
                </div>

                <!-- Otra Asignatura -->
                <div v-if="mostrarOtraAsignatura" class="col-md-6">
                  <label for="otra-asignatura" class="form-label">
                    <i class="ri-book-open-line me-1"></i> Otra Asignatura
                  </label>
                  <select id="otra-asignatura" class="form-select" v-model="simulador.otra_asignatura" required>
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Matemática General">Matemática General</option>
                    <option value="Física General">Física General</option>
                    <option value="Cálculo Numérico">Cálculo Numérico</option>
                    <option value="Probabilidad y Estadística">Probabilidad y Estadística</option>
                    <option value="Lógica Matemática">Lógica Matemática</option>
                    <option value="Circuitos Lógicos">Circuitos Lógicos</option>
                    <option value="Investigación de Operaciones">Investigación de Operaciones</option>
                    <option value="Arquitectura del Computador">Arquitectura del Computador</option>
                    <option value="Optimización No Lineal">Optimización No Lineal</option>
                    <option value="Procesos Estocásticos">Procesos Estocásticos</option>
                    <option value="Geometría Analítica">Geometría Analítica</option>
                  </select>
                </div>

                <!-- Enlace -->
                <div class="col-md-6">
                  <label for="enlace" class="form-label">
                    <i class="ri-link-m"></i> Enlace del Simulador
                  </label>
                  <input type="url" class="form-control" id="enlace" v-model="simulador.enlace" required
                    placeholder="https://www.ejemplo.com" />
                </div>

                <!-- Categoría -->
                <div class="col-md-6 position-relative">
                  <label for="categoria" class="form-label">
                    <i class="ri-folder-4-line me-1"></i> Categoría
                  </label>
                  <input type="text" class="form-control" id="categoria" v-model="simulador.categoria"
                    placeholder="Ej: Compilador, Diagramador, Calculadora..." />
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.categoria.length }}
                  </small>
                </div>

                <!-- Fecha -->
                <div class="col-md-6">
                  <label for="fecha" class="form-label">
                    <i class="ri-calendar-event-line me-1"></i> Fecha de Registro
                  </label>
                  <input type="datetime-local" class="form-control" id="fecha" v-model="simulador.created_at"
                    readonly />
                </div>

                <!-- Botones -->
                <div class="col-12 mt-4 d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-danger" @click="resetForm">
                    <i class="ri-close-circle-line me-2"></i> Vaciar
                  </button>
                  <button type="submit" class="btn btn-success" :disabled="loading">
                    <template v-if="loading">
                      <span class="spinner-border" role="status" aria-hidden="true"></span>
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
      <div v-if="modalAdvertencia" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.4)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title text-dark">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ¡Atención!
              </h5>
              <button type="button" class="btn-close" @click="modalAdvertencia = false"></button>
            </div>
            <div class="modal-body text-dark">
              <p>
                Solo dispones de <b>8 horas</b> para modificar o eliminar este simulador en caso de algún
                error o cambio necesario.
                <br />
                Después de ese tiempo, no podrás realizar cambios.
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success" @click="modalAdvertencia = false">Ok!</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useNuxtApp } from '#app'
import { forbiddenKeywords } from '@/utils/validate_form.js'

// ✅ Función confiable que usa la zona horaria de Venezuela correctamente
function getVenezuelaDateTimeString() {
  const now = new Date()
  const venezuelaDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Caracas' }))
  const year = venezuelaDate.getFullYear()
  const month = String(venezuelaDate.getMonth() + 1).padStart(2, '0')
  const day = String(venezuelaDate.getDate()).padStart(2, '0')
  const hours = String(venezuelaDate.getHours()).padStart(2, '0')
  const minutes = String(venezuelaDate.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default {
  data() {
    return {
      simulador: {
        nombre_del_simulador: '',
        descripcion_del_simulador: '',
        categoria: '',
        enlace: '',
        asignatura: '',
        otra_asignatura: '',
        created_at: getVenezuelaDateTimeString(),
      },
      loading: false,
      error: null,
      successMessage: null,
      modalAdvertencia: false,
    }
  },

  computed: {
    formProgress() {
      const camposRequeridos = [
        this.simulador.nombre_del_simulador.length >= 7,
        this.simulador.descripcion_del_simulador.length >= 7,
        this.isValidUrl(this.simulador.enlace),
        !!this.simulador.asignatura,
      ]

      if (camposRequeridos.every(campo => !campo)) {
        return 0
      }

      const totalFields = 5
      let validCount = 0

      if (camposRequeridos[0]) validCount++
      if (camposRequeridos[1]) validCount++
      if (this.simulador.categoria?.length >= 7) validCount++
      if (camposRequeridos[2]) validCount++
      if (camposRequeridos[3]) validCount++

      return Math.floor((validCount / totalFields) * 100)
    },
    mostrarOtraAsignatura() {
      return this.simulador.asignatura === 'Otra...'
    },
  },

  methods: {
    containsForbiddenKeyword(url, keywords) {
      const lowerUrl = url.toLowerCase()
      return keywords.some(k => lowerUrl.includes(k.toLowerCase()))
    },


    normalizeUrl(url) {
      return url.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
    },

    isValidUrl(url) {
      try {
        new URL(url)
        return true
      } catch (_) {
        return false
      }
    },

    async validateForm() {
      // Validar que ningún campo esté vacío (excepto otra_asignatura si no aplica y created_at)
      const campos = [
        { valor: this.simulador.nombre_del_simulador, nombre: 'nombre del simulador' },
        { valor: this.simulador.descripcion_del_simulador, nombre: 'descripción del simulador' },
        { valor: this.simulador.categoria, nombre: 'categoría' },
        { valor: this.simulador.enlace, nombre: 'enlace' },
        { valor: this.simulador.asignatura, nombre: 'asignatura' }
      ];

      for (const campo of campos) {
        if (!campo.valor || campo.valor.trim().length === 0) {
          this.error = `El campo ${campo.nombre} no puede estar vacío.`;
          return false;
        }
        if (campo.valor.trim().length < 5) {
          this.error = `El campo ${campo.nombre} debe tener al menos 5 caracteres.`;
          return false;
        }
      }

      // Si se selecciona "Otra..." validar el campo otra_asignatura
      if (this.mostrarOtraAsignatura) {
        if (!this.simulador.otra_asignatura || this.simulador.otra_asignatura.trim().length === 0) {
          this.error = 'Debe seleccionar una asignatura en "Otra asignatura".';
          return false;
        }
        if (this.simulador.otra_asignatura.trim().length < 5) {
          this.error = 'La asignatura seleccionada debe tener al menos 5 caracteres.';
          return false;
        }
      }

      if (!this.isValidUrl(this.simulador.enlace)) {
        this.error = 'El enlace no es válido.'
        return false
      }
      if (this.containsForbiddenKeyword(this.simulador.enlace, forbiddenKeywords)) {
        this.error = 'Este enlace no es apto para registrarse como recurso educativo.'
        return false
      }

      const nuxtApp = useNuxtApp()
      const supabaseClient = nuxtApp.$supabase
      const inputUrl = this.normalizeUrl(this.simulador.enlace)

      const { data: existing, error: fetchError } = await supabaseClient
        .from('simuladores')
        .select('enlace')

      if (fetchError) {
        this.error = 'No se pudo verificar si el enlace ya existe.'
        return false
      }

      const urlYaExiste = (existing || []).some(entry =>
        this.normalizeUrl(entry.enlace) === inputUrl
      )

      if (urlYaExiste) {
        this.error = 'Este enlace ya ha sido registrado previamente.'
        return false
      }

      if (!this.simulador.asignatura) {
        this.error = 'Debe seleccionar una asignatura.'
        return false
      }

      if (this.mostrarOtraAsignatura && !this.simulador.otra_asignatura) {
        this.error = 'Debe seleccionar una asignatura en "Otra asignatura".'
        return false
      }

      return true
    },

    async submitForm() {
      if (!(await this.validateForm())) return

      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const created_at = getVenezuelaDateTimeString()

        const asignaturaFinal = this.mostrarOtraAsignatura
          ? this.simulador.otra_asignatura
          : this.simulador.asignatura

        const nuxtApp = useNuxtApp()
        const supabaseClient = nuxtApp.$supabase

        const { error } = await supabaseClient
          .from('simuladores')
          .insert([{
            nombre_del_simulador: this.simulador.nombre_del_simulador,
            descripcion_del_simulador: this.simulador.descripcion_del_simulador,
            categoria: this.simulador.categoria,
            enlace: this.simulador.enlace,
            asignatura: asignaturaFinal,
            created_at,
          }])

        if (error) throw error

        this.showSuccess('Simulador registrado con éxito!')
        this.modalAdvertencia = true
        this.resetForm()
      } catch (error) {
        this.error = error.message || 'Ocurrió un error al registrar el simulador'
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.simulador = {
        nombre_del_simulador: '',
        descripcion_del_simulador: '',
        categoria: '',
        enlace: '',
        asignatura: '',
        otra_asignatura: '',
        created_at: getVenezuelaDateTimeString(),
      }
      this.error = null
    },

    showSuccess(msg) {
      this.successMessage = msg
      setTimeout(() => {
        this.successMessage = null
      }, 4000)
    },
  },
}
</script>


<style scoped>
input{
     text-overflow: ellipsis;
}
.unefa-primary-bg {
  background-color: #003366;
}

</style>
