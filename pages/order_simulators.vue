<template>
  <!-- Contenedor principal -->
  <div class="container containerr content py-4">
    <!-- Spinner de carga -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-grow  text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <!-- Mensaje de error de conexión -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-2">
      <i class="bi bi-wifi-off fs-4"></i>
      <span>{{ error }}</span>
    </div>
    <!-- Contenido principal cuando hay datos -->
    <div v-else>
      <!-- Buscador de simuladores -->
      <div class="mb-4">
        <input v-model="terminoBusqueda" type="text" class="form-control" placeholder="Buscar simuladores..." autocomplete="off" />
      </div>
      <!-- Botones para ordenar por fecha -->
      <div class="mb-4">
        <h6 class="text-unefa-dark fw-bold mb-2">Ordenar por fecha:</h6>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm" :class="ordenFecha === 'desc' ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'" @click="ordenFecha = ordenFecha === 'desc' ? '' : 'desc'">
            Más recientes
          </button>
          <button class="btn btn-sm" :class="ordenFecha === 'asc' ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'" @click="ordenFecha = ordenFecha === 'asc' ? '' : 'asc'">
            Más antiguos
          </button>
        </div>
      </div>
      <!-- Filtros por asignatura y categoría -->
      <div class="mb-4">
        <h6 class="text-unefa-dark fw-bold mb-2">Filtrar por asignatura:</h6>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <!-- Botones de asignaturas -->
          <button v-for="asig in asignaturasDisponibles" :key="asig" @click="toggleAsignatura(asig)" class="btn btn-sm"
            :class="filtroAsignatura === asig ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'">
            {{ asig }}
          </button>
        </div>
        <h6 class="text-unefa-dark fw-bold mb-2">Filtrar por categoría:</h6>
        <div class="d-flex flex-wrap gap-2">
          <!-- Botones de categorías -->
          <button v-for="cat in categoriasDisponibles" :key="cat" @click="toggleCategoria(cat)" class="btn btn-sm"
            :class="normalizarTexto(filtroCategoria) === normalizarTexto(cat) ? 'btn-unefa-primary text-white' : 'btn-outline-secondary'">
            {{ cat }}
          </button>
        </div>
      </div>
      <!-- Mensaje si no hay simuladores filtrados -->
      <div v-if="Object.keys(simuladoresPorAsignatura).length === 0" class="text-muted text-center">
        <i class="ri-search-eye-line fs-1 mb-2"></i>
        <div>No se encontraron simuladores bajo ese criterio.</div>
      </div>
      <!-- Listado de simuladores agrupados por asignatura -->
      <div v-for="(simGroup, asignatura) in simuladoresPorAsignatura" :key="asignatura" class="mb-5">
        <h4 class="mb-3 text-uppercase text-unefa-primary font-weight-bold profesional-title">
          {{ asignatura }}
        </h4>
        <div class="row g-4">
          <!-- Tarjeta de cada simulador -->
          <div v-for="sim in simGroup" :key="sim.id" class="col-md-4 d-flex">
            <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
              <!-- Encabezado de la tarjeta -->
              <div class="card-header d-flex justify-content-between align-items-center">
                <span class="badge category-badge">{{ sim.categoria.charAt(0).toUpperCase() + sim.categoria.slice(1) }}</span>
                <div class="win-window-controls ms-auto d-flex">
                  <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                  <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                  <span class="win-btn win-close"><i class="bi bi-x"></i></span>
                </div>
              </div>
              <!-- Cuerpo de la tarjeta -->
              <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center mb-3">
                  <i :class="['bi', iconoPorAsignatura(sim.asignatura), 'me-3', 'fs-1', 'text-unefa-primary', 'text-info']" aria-hidden="true"></i>
                  <h5 class="profesional-title text-unefa-dark">
                    {{ sim.nombre_del_simulador }}
                  </h5>
                </div>
                <p class="small text-muted flex-grow-1 card-text">
                  {{ sim.descripcion_del_simulador }}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap" style="gap: 0.5rem;">
                  <span class="badge asignatura-badge flex-shrink-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; display: inline-block;" :title="sim.asignatura">
                    {{ sim.asignatura }}
                  </span>
                  <a :href="sim.enlace" target="_blank" class="btn btn-primary btn-sm btn-unefa-primary text-white flex-shrink-0">
                    Ejecutar  <i class="ri-terminal-box-line"></i> 
                  </a>
                </div>
                <span class="small date text-danger mt-2">
                  Agregado: {{ formatDate(sim.created_at) }}
                </span>
                <!-- Botones de acción para modificar/eliminar si es reciente -->
                <div v-if="puedeEditarEliminar(sim.created_at)" class="botones-accion mt-3 d-flex gap-2 flex-wrap">
                  <button @click="abrirModificar(sim)" class="btn btn-outline-warning" type="button" title="Modificar">
                    <i class="bi bi-pencil-square"></i> Modificar
                  </button>
                  <button @click="abrirEliminar(sim)" class="btn btn-outline-danger" type="button" title="Eliminar">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para modificar simulador -->
    <transition name="modal-fade">
      <div v-if="modalModificarVisible" class="modal-backdrop" @click.self="cerrarModales">
        <div class="modal-window">
          <h5 class="modal-title text-warning">Modificar Simulador</h5>
          <form @submit.prevent="guardarCambios">
            <div class="mb-3">
              <label for="nombreSim" class="form-label">Nombre</label>
              <input id="nombreSim" v-model="formNombre" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="enlaceSim" class="form-label">Enlace</label>
              <input id="enlaceSim" v-model="formEnlace" type="url" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="categoriaSim" class="form-label">Categoría</label>
              <input id="categoriaSim" v-model="formCategoria" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="asignaturaSim" class="form-label">Asignatura</label>
              <select id="asignaturaSim" v-model="formAsignatura" class="form-select" required>
                <option value="" disabled>Seleccione asignatura</option>
                <option v-for="asig in asignaturasOpciones" :key="asig" :value="asig">
                  {{ asig }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="descSim" class="form-label">Descripción</label>
              <textarea id="descSim" v-model="formDescripcion" class="form-control" rows="3" required></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
              <button type="submit" class="btn btn-warning text-dark">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
    <!-- Modal para confirmar eliminación -->
    <transition name="modal-fade">
      <div v-if="modalEliminarVisible" class="modal-backdrop" @click.self="cerrarModales">
        <div class="modal-window">
          <h5 class="modal-title text-danger">Confirmar Eliminación</h5>
          <p>¿Está seguro que desea eliminar el simulador <strong>{{ simuladorSeleccionado?.nombre_del_simulador }}</strong>?</p>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="cerrarModales">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirmarEliminar">Eliminar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import { forbiddenKeywords } from '@/utils/validate_form.js'

// Definición de la interfaz de simuladores
interface simuladores {
  id: number
  nombre_del_simulador: string
  enlace: string
  categoria: string
  asignatura: string
  descripcion_del_simulador: string
  created_at: string
}

// Inicialización de Supabase
const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

// Estados reactivos principales
const simuladores = ref<simuladores[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Filtros y controles de búsqueda
const filtroAsignatura = ref('')
const filtroCategoria = ref('')
const terminoBusqueda = ref('')
const ordenFecha = ref<'desc' | 'asc' | ''>('')

// Estados para modales y formularios
const modalModificarVisible = ref(false)
const modalEliminarVisible = ref(false)
const simuladorSeleccionado = ref<simuladores | null>(null)

const formNombre = ref('')
const formEnlace = ref('')
const formCategoria = ref('')
const formAsignatura = ref('')
const formDescripcion = ref('')

// Opciones de asignaturas predefinidas
const asignaturasOpciones = [
  "Matemáticas", "Quimica", "Física I", "Cálculo Numérico", "Probabilidad y Estadística", "Lógica Matemática",
  "Circuitos Lógicos", "Investigación de Operaciones", "Arquitectura del Computador", "Optimización No Lineal",
  "Procesos Estocásticos", "Geometría Analítica", "Física II", "Programación", "Lenguajes de Programación I",
  "Lenguajes de Programación II", "Lenguajes de Programación III", "Procesamiento de Datos", "Bases de Datos",
  "Redes", "Sistemas Operativos", "Simulación y Modelos"
]

// Función para normalizar texto (sin acentos, minúsculas, sin caracteres especiales)
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase() 
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
}

// Verifica si un enlace contiene palabras prohibidas
function contieneContenidoInapropiado(url: string): boolean {
  const lowerUrl = url.toLowerCase()
  return forbiddenKeywords.some(keyword => lowerUrl.includes(keyword.toLowerCase()))
}

// Carga los simuladores desde la base de datos
async function cargarSimuladores() {
  try {
    isLoading.value = true
    error.value = null
    const { data, error: supabaseError } = await supabase
      .from('simuladores')
      .select('*')
      .order('nombre_del_simulador', { ascending: true })
    if (supabaseError) throw supabaseError
    simuladores.value = (data || [])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error de Conexion, Verifique e intente de nuevo'
  } finally {
    isLoading.value = false
  }
}
// Ejecuta la carga al montar el componente
onMounted(() => cargarSimuladores())

// Computed para obtener asignaturas únicas y ordenadas
const asignaturasDisponibles = computed(() =>
  [...new Set(simuladores.value.map(sim => sim.asignatura))].sort()
)

// Computed para obtener categorías únicas (sin duplicados por acentos)
const categoriasDisponibles = computed(() => {
  const map = new Map<string, string>()
  simuladores.value.forEach(sim => {
    const norm = normalizarTexto(sim.categoria)
    if (!map.has(norm)) {
      map.set(norm, sim.categoria)
    }
  })
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
})

// Computed para filtrar simuladores según búsqueda y filtros
const simuladoresFiltrados = computed(() => {
  const termino = normalizarTexto(terminoBusqueda.value)
  const filtroCatNorm = normalizarTexto(filtroCategoria.value)
  let filtrados = simuladores.value.filter(sim => {
    const textoCompleto =
      sim.nombre_del_simulador + ' ' +
      sim.descripcion_del_simulador + ' ' +
      sim.asignatura + ' ' +
      sim.categoria
    const coincideBusqueda = normalizarTexto(textoCompleto).includes(termino)
    const coincideCategoria = !filtroCategoria.value || normalizarTexto(sim.categoria) === filtroCatNorm
    return (
      (filtroAsignatura.value === '' || sim.asignatura === filtroAsignatura.value) &&
      coincideCategoria &&
      (termino === '' || coincideBusqueda)
    )
  })
  // Ordena por fecha si corresponde
  if (ordenFecha.value === 'desc') {
    filtrados = filtrados.slice().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } else if (ordenFecha.value === 'asc') {
    filtrados = filtrados.slice().sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }
  return filtrados
})

// Computed para agrupar simuladores por asignatura
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

// Formatea la fecha a formato es
function formatDate(fechaISO: string) {
  const date = new Date(fechaISO)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Devuelve el icono correspondiente a la asignatura
function iconoPorAsignatura(asignatura: string) {
  const mapaIconos: Record<string, string> = {
    'Matemáticas': 'bi-calculator',
    'Matemática General': 'bi-calculator',
    'Lógica Matemática': 'bi-file-binary',
    'Química': 'bi-flask',
    'Física I': 'bi-lightning-charge',
    'Física II': 'bi-lightning-charge-fill',
    'Programación': 'bi-code-slash',
    'Lenguajes de Programación I': 'bi-terminal',
    'Lenguajes de Programación II': 'bi-terminal-dash',
    'Lenguajes de Programación III': 'bi-terminal-split',
    'Procesamiento de Datos': 'bi-diagram-3',
    'Bases de Datos': 'bi-database',
    'Redes': 'bi-wifi',
    'Sistemas Operativos': 'bi-window-stack',
    'Simulación y Modelos': 'bi-diagram-3-fill',
    'Otra...': 'bi-journals'
  }
  return mapaIconos[asignatura] || mapaIconos['Otra...']
}

// Cambia el filtro de asignatura (selección/deselección)
function toggleAsignatura(asignatura: string) {
  filtroAsignatura.value = filtroAsignatura.value === asignatura ? '' : asignatura
}

// Cambia el filtro de categoría (selección/deselección)
function toggleCategoria(categoria: string) {
  const catNorm = normalizarTexto(categoria)
  filtroCategoria.value = filtroCategoria.value === catNorm ? '' : catNorm
}

// Permite editar/eliminar solo si el simulador fue creado hace menos de 8 horas
function puedeEditarEliminar(fechaCreacion: string) {
  const fecha = new Date(fechaCreacion)
  const ahora = new Date()
  const diffHoras = (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60)
  return diffHoras <= 8
}

// Abre el modal de modificación y carga los datos del simulador seleccionado
function abrirModificar(sim: simuladores) {
  simuladorSeleccionado.value = sim
  formNombre.value = sim.nombre_del_simulador
  formEnlace.value = sim.enlace
  formCategoria.value = sim.categoria
  formAsignatura.value = sim.asignatura
  formDescripcion.value = sim.descripcion_del_simulador
  modalModificarVisible.value = true
  modalEliminarVisible.value = false
}

// Guarda los cambios del simulador editado
async function guardarCambios() {
  if (!simuladorSeleccionado.value) return
  if (contieneContenidoInapropiado(formEnlace.value)) {
    alert('Este enlace contiene contenido no apto para un entorno educativo. Por favor, Intente de nuevo.')
    return
  }
  const { error: updateError } = await supabase
    .from('simuladores')
    .update({
      nombre_del_simulador: formNombre.value,
      enlace: formEnlace.value,
      categoria: formCategoria.value,
      asignatura: formAsignatura.value,
      descripcion_del_simulador: formDescripcion.value
    })
    .eq('id', simuladorSeleccionado.value.id)
  if (updateError) {
    alert('Error al actualizar: ' + updateError.message)
  } else {
    const index = simuladores.value.findIndex(s => s.id === simuladorSeleccionado.value?.id)
    if (index !== -1) {
      simuladores.value[index] = {
        ...simuladorSeleccionado.value,
        nombre_del_simulador: formNombre.value,
        enlace: formEnlace.value,
        categoria: formCategoria.value,
        asignatura: formAsignatura.value,
        descripcion_del_simulador: formDescripcion.value
      }
    }
    modalModificarVisible.value = false
  }
}

// Abre el modal de confirmación para eliminar un simulador
function abrirEliminar(sim: simuladores) {
  simuladorSeleccionado.value = sim
  modalEliminarVisible.value = true
  modalModificarVisible.value = false
}

// Elimina el simulador seleccionado de la base de datos
async function confirmarEliminar() {
  if (!simuladorSeleccionado.value) return
  const { error: deleteError } = await supabase
    .from('simuladores')
    .delete()
    .eq('id', simuladorSeleccionado.value.id)
  if (deleteError) {
    alert('Error al eliminar: ' + deleteError.message)
  } else {
    simuladores.value = simuladores.value.filter(s => s.id !== simuladorSeleccionado.value?.id)
    modalEliminarVisible.value = false
  }
}

// Cierra todos los modales y limpia la selección
function cerrarModales() {
  modalModificarVisible.value = false
  modalEliminarVisible.value = false
  simuladorSeleccionado.value = null
}
</script>
<style scoped>
.win-btn:hover {
  background-color: #0078d7;
  color: white;
}

.win-minimize:hover {
  background-color: #999;
  color: white;
}

.win-maximize:hover {
  background-color: #0078d7;
  color: white;
}

.win-close:hover {
  background-color: #e81123;
  color: white;
}
/* Estilos generales del contenedor */
.container.containerr {
  margin: 0 auto;
}
/* Efecto hover en las tarjetas */
.card:hover {
  transform: translateY(-5px) scale(1.02);
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 10px 24px rgba(0, 33, 71, 0.13);
  background: rgba(255, 255, 255, 0.18);
}
/* Fondo del modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
}
/* Ventana del modal */
.modal-window {
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 400px;
  max-width: 95vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
/* Transiciones del modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
/* Botón de advertencia en la tarjeta */
.ultimo-simulador-card .btn-warning {
  font-weight: 800;
  box-shadow: 0 0 4px #f0ad4ecc;
  border-radius: 3px;
}
/* Botón de eliminar en la tarjeta */
.ultimo-simulador-card .btn-outline-danger {
  border-width: 2px;
  font-weight: 600;
  border-radius: 3px;
}
/* Badge de categoría */
.category-badge {
  color: #000;
  font-weight: 800;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  text-transform: capitalize;
}
/* Badge de asignatura */
.asignatura-badge {
  font-size: 14px;
  text-decoration: underline;
  color: gray;
  font-weight: 900;
  padding: 0.3rem 0.6rem;
  text-transform: none;
}
/* Botones de acción en la tarjeta */
.ultimo-simulador-card .btn-outline-warning,
.ultimo-simulador-card .btn-outline-danger {
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  font-size: 0.85rem;
  border-width: 1.5px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}
.ultimo-simulador-card .btn-outline-warning:hover {
  background-color: #ffc107;
  color: #212529;
  border-color: #ffc107;
}
.ultimo-simulador-card .btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}
.ultimo-simulador-card .botones-accion {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
/* Encabezado de la tarjeta */
.ultimo-simulador-card .card-header {
  padding: 0.3rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  overflow: hidden;
}
/* Controles de ventana estilo Windows */
.win-window-controls {
  margin-left: auto;
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  flex-wrap: nowrap;
  max-width: 100%;
}
.win-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  color: #444;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
}
/* Botón principal personalizado */
.btn-unefa-primary {
  background-color: #007a3d;
  border: none;
  transition: background-color .3s ease;
}
/* Texto de la tarjeta */
.card-text {
  text-align: justify;
}
/* Estilo de la fecha */
.date {
  font-weight: 800;
}

@media (max-width: 994px) {
  .ultimo-simulador-card .card-header {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.2rem;
    padding: 0.3rem 0.4rem;
  }
  .category-badge {
    margin-bottom: 0.2rem;
    width: 100%;
    max-width: 100%;
    text-align: left;
  }
  .win-window-controls {
    margin-left: 0;
    margin-top: 0.1rem;
    align-self: flex-end;
    flex-wrap: nowrap;
    width: auto;
    max-width: 100%;
  }
  .win-btn {
    width: 20px;
    height: 18px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .ultimo-simulador-card .card-header {
    padding: 0.2rem 0.2rem;
    gap: 0.1rem;
  }
  .category-badge {
    font-size: 0.92rem;
    margin-bottom: 0.15rem;
  }
  .win-btn {
    width: 18px;
    height: 16px;
    font-size: 11px;
  }
}
</style>
