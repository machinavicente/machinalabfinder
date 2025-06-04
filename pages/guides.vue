<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Declaración para window.bootstrap
declare global {
  interface Window {
    bootstrap: any
  }
}

interface Recurso {
  id: number
  nombre: string
  url: string
}

const recursos = ref<Recurso[]>([])
const recursoSeleccionado = ref<Recurso | null>(null)
const busqueda = ref('')

async function cargarRecursos() {
  try {
    const res = await fetch('/api/recurso')
    if (!res.ok) throw new Error('Error cargando recursos')
    recursos.value = await res.json()
  } catch (error) {
    console.error(error)
  }
}

// Normalizar texto para búsqueda (quita tildes y pone minúsculas)
function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[^\w\s]/g, '') // elimina signos de puntuación
}

// Capitalizar cada palabra (Primera letra mayúscula)
function capitalizarTitulo(texto: string) {
  return texto
    .split(' ')
    .filter(Boolean)
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ')
}

const recursosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return recursos.value
  const termino = normalizar(busqueda.value)
  return recursos.value.filter((r) =>
    normalizar(r.nombre).includes(termino)
  )
})

// Para mostrar nombres normalizados y capitalizados en la UI
const recursosFormateados = computed(() => {
  return recursosFiltrados.value.map(r => ({
    ...r,
    nombre: capitalizarTitulo(
      r.nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // elimina acentos para mostrar limpio
        .replace(/[^\w\s]/g, '') // elimina signos de puntuación para mostrar limpio
        .trim()
    )
  }))
})

function abrirModal(recurso: Recurso) {
  recursoSeleccionado.value = recurso
  const modalEl = document.getElementById('modalRecurso')
  if (modalEl && window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalEl)
    modal.show()
  }
}

onMounted(() => {
  cargarRecursos()
})
</script>

<template>
  <div class="container py-4">
    <div class="mb-4">
      <input
        type="search"
        v-model="busqueda"
        class="form-control form-control-lg"
        placeholder="Buscar recurso..."
        aria-label="Buscar recurso"
        autofocus
      />
    </div>

    <div class="row g-4">
      <template v-if="recursosFormateados.length">
        <div v-for="recurso in recursosFormateados" :key="recurso.id" class="col-md-4 d-flex">
          <div class="card shadow-sm w-100 h-100" @click="abrirModal(recurso)">
            <div class="card-body d-flex flex-column align-items-center text-center">
              <img :src="recurso.url" class="img-fluid mb-2 rounded border" />
              <h6 class="fw-bold">{{ recurso.nombre }}</h6>
              <button class="btn btn-info btn-sm mt-auto" @click.stop="abrirModal(recurso)">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Mostrar spinner grow cuando hay búsqueda y no hay resultados -->
        <div v-if="busqueda.trim()" class="d-flex justify-content-center w-100 my-5">
          <div class="spinner-grow text-danger" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Buscando...</span>
          </div>
        </div>
        <!-- Si no hay búsqueda, no mostrar nada -->
      </template>
    </div>

    <!-- Modal Bootstrap simple -->
    <div class="modal fade" id="modalRecurso" tabindex="-1" aria-labelledby="modalRecursoLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalRecursoLabel">{{ recursoSeleccionado?.nombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="recursoSeleccionado?.url" class="img-fluid rounded border" style="max-height: 500px;" />
          </div>
          <div class="modal-footer">
            <a :href="recursoSeleccionado?.url" :download="recursoSeleccionado?.nombre" class="btn btn-success">
              Descargar
            </a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos UNEFA para la card */
.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  border: 2px solid transparent;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: #C8102E; /* rojo UNEFA */
  box-shadow: 0 8px 15px rgba(200, 16, 46, 0.4);
}

.card img {
  border-radius: 8px;
  border: 2px solid #002147; /* azul oscuro UNEFA */
  margin-bottom: 1rem;
  max-height: 180px;
  object-fit: contain;
}

.card h6 {
  color: #002147; /* azul oscuro UNEFA */
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  flex-grow: 1;
}
</style>
