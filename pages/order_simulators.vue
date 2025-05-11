<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

interface simuladores {
  id: number
  nombre_del_simulador: string
  enlace: string
  categoria: string
  asignatura: string
  descripcion_del_simulador: string
  created_at: string
}

const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

const simuladores = ref<simuladores[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const filtroAsignatura = ref('')
const filtroCategoria = ref('')
const terminoBusqueda = ref('')

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD') // Elimina acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .replace(/[^a-z0-9\s]/gi, '') // Elimina caracteres especiales
    .trim() // Elimina espacios al inicio y final
}

async function cargarSimuladores() {
  try {
    isLoading.value = true
    error.value = null
    const { data, error: supabaseError } = await supabase
      .from('simuladores')
      .select('*')
      .order('nombre_del_simulador', { ascending: true })
    if (supabaseError) throw supabaseError

    // Normalizar categoria para evitar diferencias por mayúsculas o espacios
    simuladores.value = (data || []).map(sim => ({
      ...sim,
      categoria: normalizarTexto(sim.categoria)
    }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error de conexión, intente de nuevo'
  } finally {
    isLoading.value = false
  }
}
onMounted(() => cargarSimuladores())

const asignaturasDisponibles = computed(() =>
  [...new Set(simuladores.value.map(sim => sim.asignatura))].sort()
)

const categoriasDisponibles = computed(() => {
  const catsNorm = [...new Set(simuladores.value.map(sim => sim.categoria))]
  // Capitalizar primera letra para mostrar mejor la categoría
  return catsNorm.sort().map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
})

const simuladoresFiltrados = computed(() => {
  const termino = normalizarTexto(terminoBusqueda.value)
  const filtroCatNorm = normalizarTexto(filtroCategoria.value)

  return simuladores.value.filter(sim => {
    const textoCompleto =
      sim.nombre_del_simulador + ' ' +
      sim.descripcion_del_simulador + ' ' +
      sim.asignatura + ' ' +
      sim.categoria

    const coincideBusqueda = normalizarTexto(textoCompleto).includes(termino)

    return (
      (filtroAsignatura.value === '' || sim.asignatura === filtroAsignatura.value) &&
      (filtroCategoria.value === '' || sim.categoria === filtroCatNorm) &&
      (termino === '' || coincideBusqueda)
    )
  })
})

const simuladoresPorAsignatura = computed(() => {
  const agrupados: Record<string, simuladores[]> = {}
  simuladoresFiltrados.value.forEach(sim => {
    if (!agrupados[sim.asignatura]) agrupados[sim.asignatura] = []
    agrupados[sim.asignatura].push(sim)
  })
  const asignaturasOrdenadas = Object.keys(agrupados).sort()
  const resultado: Record<string, simuladores[]> = {}
  asignaturasOrdenadas.forEach(asig => {
    resultado[asig] = agrupados[asig]
  })
  return resultado
})

function formatDate(fechaISO: string) {
  const date = new Date(fechaISO)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

function iconoPorAsignatura(asignatura: string) {
  const mapaIconos: Record<string, string> = {
    'Matemáticas': 'bi-calculator',
    'Química': 'bi-flask',
    'Física I': 'bi-lightning-charge',
    'Física II': 'bi-lightning-charge-fill',
    'Programación': 'bi-code-slash',
    'Lenguajes de Programacion I': 'bi-terminal',
    'Lenguajes de Programacion II': 'bi-terminal-dash',
    'Lenguajes de Programacion III': 'bi-terminal-split',
    'Procesamiento de Datos': 'bi-diagram-3',
    'Bases de Datos': 'bi-database',
    'Redes': 'bi-wifi',
    'Sistemas Operativos': 'bi-hdd-network',
    'Simulacion y Modelos': 'bi-diagram-3-fill',
    'Otra...': 'bi-question-circle'
  }
  return mapaIconos[asignatura] || mapaIconos['Otra...']
}

function toggleAsignatura(asignatura: string) {
  filtroAsignatura.value = filtroAsignatura.value === asignatura ? '' : asignatura
}

function toggleCategoria(categoria: string) {
  // Normalizamos para que funcione igual que los datos
  const catNorm = normalizarTexto(categoria)
  filtroCategoria.value = filtroCategoria.value === catNorm ? '' : catNorm
}
</script>

<template>
  <div class="container containerr py-4">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-unefa-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <!-- Barra de búsqueda -->
      <div class="mb-4">
        <input
          v-model="terminoBusqueda"
          type="text"
          class="form-control"
          placeholder="Buscar simuladores..."
          autocomplete="off"
        />
      </div>

      <!-- Filtros tipo chip -->
      <div class="mb-4">
        <h6 class="text-unefa-dark fw-bold mb-2">Filtrar por asignatura:</h6>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button
            v-for="asig in asignaturasDisponibles"
            :key="asig"
            @click="toggleAsignatura(asig)"
            class="btn btn-sm"
            :class="filtroAsignatura === asig ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'"
          >
            {{ asig }}
          </button>
        </div>

        <h6 class="text-unefa-dark fw-bold mb-2">Filtrar por categoría:</h6>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="cat in categoriasDisponibles"
            :key="cat"
            @click="toggleCategoria(cat)"
            class="btn btn-sm"
            :class="normalizarTexto(filtroCategoria) === normalizarTexto(cat) ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Mensaje si no hay resultados -->
      <div v-if="Object.keys(simuladoresPorAsignatura).length === 0" class="text-muted text-center">
        No se encontraron simuladores.
      </div>

      <!-- Simuladores -->
      <div v-for="(simGroup, asignatura) in simuladoresPorAsignatura" :key="asignatura" class="mb-5">
        <h4 class="mb-3 text-uppercase text-unefa-primary font-weight-bold profesional-title">
          {{ asignatura }}
        </h4>
        <div class="row g-4">
          <div v-for="sim in simGroup" :key="sim.id" class="col-md-4 d-flex">
            <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span class="badge category-badge">{{ sim.categoria.charAt(0).toUpperCase() + sim.categoria.slice(1) }}</span>
                <div class="win-window-controls ms-auto d-flex">
                  <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                  <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                  <span class="win-btn win-close"><i class="bi bi-x"></i></span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center mb-3">
                  <i
                    :class="[
                      'bi',
                      iconoPorAsignatura(sim.asignatura),
                      'me-3',
                      'fs-1',
                      'text-unefa-primary'
                    ]"
                    aria-hidden="true"
                  ></i>
                  <h5 class="mb-0 profesional-title text-unefa-dark">
                    {{ sim.nombre_del_simulador }}
                  </h5>
                </div>
                <p class="small text-muted flex-grow-1">
                  {{ sim.descripcion_del_simulador }}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="badge asignatura-badge">{{ sim.asignatura }}</span>
                  <a :href="sim.enlace" target="_blank" class="btn btn-sm btn-unefa-primary text-white">
                    <i class="bi bi-play-fill"></i> Usar
                  </a>
                </div>
                <span class="small text-danger mt-2">
                  Agregado: {{ formatDate(sim.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Colores UNEFA */
.text-unefa-primary {
  color: #003366 !important;
}

.text-unefa-dark {
  color: #1a1a1a;
}

.btn-unefa-primary {
  background-color: #007A3D;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-unefa-primary:hover {
  background-color: #005A28;
  color: white;
}

.unefa-gradient {
  background: linear-gradient(40deg, #003366, #007A3D) !important;
}

.unefa-hr {
  border-top: 2px solid #007A3D;
}

/* Fondo y card */
body {
  background-color: #f5f7fa;
}

.ultimo-simulador-card {
  border-radius: 0.25rem;
  background: white;
  box-shadow: 0 4px 15px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.profesional-title {
  font-weight: 600;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.category-badge {
  background-color: #003366;
  color: white;
  font-weight: 600;
  padding: 0.3em 0.6em;
  border-radius: 0.25rem;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.asignatura-badge {
  background-color: gray;
  color: white;
  font-weight: 600;
  padding: 0.2em 0.5em;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.win-window-controls span {
  cursor: pointer;
  padding: 0 6px;
  font-size: 1.2rem;
  color: #888;
  user-select: none;
}

.win-window-controls span:hover {
  color: #000;
}

/* Input de búsqueda */
input.form-control {
  border-radius: 0.375rem;
  border: 1px solid #ced4da;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: border-color 0.3s ease;
}

input.form-control:focus {
  border-color: #007A3D;
  box-shadow: 0 0 0 0.2rem rgba(0, 122, 61, 0.25);
  outline: none;
}
</style>
