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
import { forbiddenKeywords } from '@/utils/validate_form.js'
import { createClient } from '@supabase/supabase-js'

export default {
  data() {
    const now = new Date()
    const venezuelaOffset = -4 * 60 * 60 * 1000
    const venezuelaTime = new Date(now.getTime() + venezuelaOffset)
    const formattedNow = venezuelaTime.toISOString().slice(0, 16)

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
      supabase: null,
    }
  },
  created() {
    this.initializeSupabase()
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
    initializeSupabase() {
      const supabaseUrl = 'https://nthgofwioyfrjvocyvrs.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aGdvZndpb3lmcmp2b2N5dnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDcyOTQsImV4cCI6MjA2MTEyMzI5NH0.J80rYjQg6NWbo_yNNxcVnTbPavKmpxwZIi5UNrBTG84'
      this.supabase = createClient(supabaseUrl, supabaseKey)
    },
    async submitForm() {
      if (!this.validateForm()) return

      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const now = new Date()
        const venezuelaOffset = -4 * 60 * 60 * 1000
        const venezuelaTime = new Date(now.getTime() + venezuelaOffset)

        const asignaturaFinal = this.mostrarOtraAsignatura
          ? this.simulador.otra_asignatura
          : this.simulador.asignatura

        const { data, error } = await this.supabase
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
      const venezuelaOffset = -4 * 60 * 60 * 1000
      const venezuelaTime = new Date(now.getTime() + venezuelaOffset)
      const formattedNow = venezuelaTime.toISOString().slice(0, 16)

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
    validateForm() {
      const fieldsToCheck = [
        this.simulador.enlace,
        this.simulador.nombre_del_simulador,
        this.simulador.descripcion_del_simulador,
      ]

      for (const field of fieldsToCheck) {
        if (!field) continue
        for (const keyword of forbiddenKeywords) {
          if (field.toLowerCase().includes(keyword)) {
            this.error = 'Este tipo de enlaces no pueden ser registrados.'
            return false
          }
        }
      }

      if (!this.simulador.nombre_del_simulador || this.simulador.nombre_del_simulador.length < 7) {
        this.error = 'El nombre del simulador debe tener al menos 7 caracteres'
        return false
      }

      if (!this.simulador.descripcion_del_simulador || this.simulador.descripcion_del_simulador.length < 7) {
        this.error = 'La descripción debe tener al menos 7 caracteres'
        return false
      }

      if (this.simulador.categoria && this.simulador.categoria.length < 7) {
        this.error = 'La categoría debe tener al menos 7 caracteres si se ingresa'
        return false
      }

      if (!this.simulador.enlace || !this.isValidUrl(this.simulador.enlace)) {
        this.error = 'Por favor ingrese un enlace válido'
        return false
      }

      if (!this.simulador.asignatura) {
        this.error = 'Debe seleccionar una asignatura'
        return false
      }

      if (this.mostrarOtraAsignatura && !this.simulador.otra_asignatura) {
        this.error = 'Debe seleccionar una opción para "Otra Asignatura"'
        return false
      }

      return true
    },
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },
    showSuccess(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = null
      }, 5000)
    },
  },
}
</script>

<style scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-bottom: 2px solid #ffc72c;
}

.unefa-primary-bg {
  background-color: #003366;
}

.btn-unefa {
  background-color: rgb(34, 197, 74);
  color: white;
  border: none;
}

.btn-unefa:hover {
  background-color: rgb(22, 163, 74);
}

.form-control:focus,
.form-select:focus {
  border-color: #ffc72c;
  box-shadow: 0 0 0 0.2rem rgba(255, 199, 44, 0.25);
}

.alert {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.25rem 1rem;
}

.progress-bar.bg-unefa {
  background-color: rgb(34, 197, 74);
}
</style>
