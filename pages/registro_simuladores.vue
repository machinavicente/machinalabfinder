<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-header unefa-primary-bg text-white d-flex align-items-center">
            <i class="bi bi-plus-square me-2 fs-4 text-danger"></i>
            <h3 class="mb-0 fs-5">Registrar Nuevo Simulador</h3>
          </div>

          <div class="card-body">
            <!-- Notificaciones -->
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = null"></button>
            </div>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ error }}
              <button type="button" class="btn-close" @click="error = null"></button>
            </div>

            <!-- Barra de progreso dinámica -->
            <div class="mb-3">
              <label>Progreso del formulario</label>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-unefa" role="progressbar" :style="{ width: formProgress + '%' }"
                  :aria-valuenow="formProgress" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

            <form @submit.prevent="submitForm">
              <div class="row g-3">
                <!-- Nombre -->
                <div class="col-12 position-relative">
                  <label for="nombre" class="form-label">Nombre del Simulador</label>
                  <input type="text" class="form-control" id="nombre" v-model="simulador.nombre_del_simulador" required
                    placeholder="SQLMaster - Simulador de Bases de Datos" />
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.nombre_del_simulador.length }}/100
                  </small>
                </div>

                <!-- Descripción -->
                <div class="col-12 position-relative">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea class="form-control" id="descripcion" rows="3" v-model="simulador.descripcion_del_simulador"
                    required placeholder="Entorno seguro para practicar consultas, diseño y optimización..."></textarea>
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.descripcion_del_simulador.length }}/300
                  </small>
                </div>

                <!-- Asignatura -->
                <div class="col-md-6">
                  <label for="asignatura" class="form-label">Asignatura</label>
                  <select class="form-select" id="asignatura" v-model="simulador.asignatura" required>
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Matemáticas">Matemáticas</option>
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
                  <label for="otra-asignatura" class="form-label">Otra Asignatura</label>
                  <select id="otra-asignatura" class="form-select" v-model="simulador.otra_asignatura" required>
                    <option value="" disabled>Seleccionar...</option>
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
                  <label for="enlace" class="form-label">Enlace del Simulador</label>
                  <input type="url" class="form-control" id="enlace" v-model="simulador.enlace" required
                    placeholder="https://www.ejemplo.com" />
                </div>

                <!-- Categoría -->
                <div class="col-md-6 position-relative">
                  <label for="categoria" class="form-label">Categoría</label>
                  <input type="text" class="form-control" id="categoria" v-model="simulador.categoria"
                    placeholder="Ej: Compilador, Diagramador, IDE..." />
                  <small class="text-muted position-absolute" style="bottom: 5px; right: 10px; font-size: 0.8rem;">
                    {{ simulador.categoria.length }}/50
                  </small>
                </div>

                <!-- Fecha -->
                <div class="col-md-6">
                  <label for="fecha" class="form-label">Fecha de Registro</label>
                  <input type="datetime-local" class="form-control" id="fecha" v-model="simulador.created_at"
                    readonly />
                </div>

                <!-- Botones -->
                <div class="col-12 mt-4 d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-danger" @click="resetForm">
                    <i class="bi bi-x-circle me-2"></i>Cancelar
                  </button>

                  <button type="submit" class="btn btn-unefa" :disabled="loading">
                    <template v-if="loading">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Procesando...
                    </template>
                    <template v-else>
                      <i class="bi bi-save me-2"></i>Guardar Simulador
                    </template>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNuxtApp } from '#app'
import { forbiddenKeywords } from '@/utils/validate_form.js'

export default {
  data() {
    const now = new Date()
    const venezuelaOffsetMinutes = 4 * 60 // UTC-4
    const localOffsetMinutes = now.getTimezoneOffset()
    const adjustedTime = new Date(now.getTime() + (localOffsetMinutes + venezuelaOffsetMinutes) * 60000)
    const formattedNow = adjustedTime.toISOString().slice(0, 16)

    return {
      simulador: {
        nombre_del_simulador: '',
        descripcion_del_simulador: '',
        categoria: '',
        enlace: '',
        asignatura: '',
        otra_asignatura: '',
        created_at: formattedNow,
      },
      loading: false,
      error: null,
      successMessage: null,
    }
  },
  computed: {
    formProgress() {
      let totalFields = 5
      let validCount = 0

      if (this.simulador.nombre_del_simulador.length >= 7) validCount++
      if (this.simulador.descripcion_del_simulador.length >= 7) validCount++
      if (!this.simulador.categoria || this.simulador.categoria.length >= 7) validCount++
      if (this.isValidUrl(this.simulador.enlace)) validCount++
      if (this.simulador.asignatura) validCount++

      return Math.floor((validCount / totalFields) * 100)
    },
    mostrarOtraAsignatura() {
      return this.simulador.asignatura === 'Otra...'
    },
  },
  methods: {
    containsForbiddenKeyword(url, forbiddenKeywords) {
      const lowerUrl = url.toLowerCase()
      return forbiddenKeywords.some(keyword => lowerUrl.includes(keyword.toLowerCase()))
    },

    validateForm() {
      if (this.simulador.nombre_del_simulador.length < 7) {
        this.error = 'El nombre del simulador debe tener al menos 7 caracteres.'
        return false
      }
      if (this.simulador.descripcion_del_simulador.length < 7) {
        this.error = 'La descripción del simulador debe tener al menos 7 caracteres.'
        return false
      }
      if (this.simulador.categoria && this.simulador.categoria.length < 7) {
        this.error = 'Si la categoría está llena, debe tener al menos 7 caracteres.'
        return false
      }
      if (!this.isValidUrl(this.simulador.enlace)) {
        this.error = 'El enlace no es válido.'
        return false
      }
      if (this.containsForbiddenKeyword(this.simulador.enlace, forbiddenKeywords)) {
        this.error = 'Este enlace no es apto para registrarse como recurso educativo. '
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

    isValidUrl(url) {
      try {
        new URL(url)
        return true
      } catch (_) {
        return false
      }
    },

    async submitForm() {
      if (!this.validateForm()) return

      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const now = new Date()
        const venezuelaOffsetMinutes = 4 * 60
        const localOffsetMinutes = now.getTimezoneOffset()
        const venezuelaTime = new Date(now.getTime() + (localOffsetMinutes + venezuelaOffsetMinutes) * 60000)

        const asignaturaFinal = this.mostrarOtraAsignatura
          ? this.simulador.otra_asignatura
          : this.simulador.asignatura

        const nuxtApp = useNuxtApp()
        const supabaseClient = nuxtApp.$supabase

        const { data, error } = await supabaseClient
          .from('simuladores')
          .insert([
            {
              nombre_del_simulador: this.simulador.nombre_del_simulador,
              descripcion_del_simulador: this.simulador.descripcion_del_simulador,
              categoria: this.simulador.categoria,
              enlace: this.simulador.enlace,
              asignatura: asignaturaFinal,
              created_at: venezuelaTime.toISOString(),
            },
          ])
          .select()

        if (error) throw error

        this.showSuccess('Simulador registrado con éxito!')
        this.resetForm()
      } catch (error) {
        this.error = error.message || 'Ocurrió un error al registrar el simulador'
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      const now = new Date()
      const venezuelaOffsetMinutes = 4 * 60
      const localOffsetMinutes = now.getTimezoneOffset()
      const adjustedTime = new Date(now.getTime() + (localOffsetMinutes + venezuelaOffsetMinutes) * 60000)
      const formattedNow = adjustedTime.toISOString().slice(0, 16)

      this.simulador = {
        nombre_del_simulador: '',
        descripcion_del_simulador: '',
        categoria: '',
        enlace: '',
        asignatura: '',
        otra_asignatura: '',
        created_at: formattedNow,
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
>

<style scoped>
.unefa-primary-bg {
  background-color: #003366;
}

.btn-unefa {
  background-color: rgb(34, 197, 74);
  color: white;
}

.btn-unefa:hover {
  background-color: rgb(22, 163, 74);
}
</style>
