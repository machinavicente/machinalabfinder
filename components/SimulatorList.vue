<template>
  <div class="sim-list-container d-flex flex-column min-vh-100 align-items-center">
    <div class="w-100" style="max-width:1200px;">
      <div class="row mb-3">
        <div class="col-12">
          <h4 class="mb-3 text-center">Simuladores Online Disponibles</h4>
        </div>
      </div>
      <div>
        <div v-if="simuladores.length === 0" class="col-12">
          <div class="alert alert-danger text-center">
            <i class="bi bi-wifi-off fs-4 px-3"></i>
            <span>Error de Conexion, Verifique e intente de nuevo</span>
          </div>
        </div>
        <div v-else class="row g-4 justify-content-center">
          <div
            v-for="(sim, idx) in simuladoresPaginados"
            :key="sim.id"
            class="col-12 col-sm-6 col-md-4 col-lg-4 d-flex"
          >
            <div
              class="sim-card card shadow-sm h-100 flex-fill position-relative"
            >
              <!-- Estilo tipo ventana de macOS + botón favorito -->
              <div
                class="mac-header d-flex align-items-center justify-content-between px-3 pt-3 pb-1"
              >
                <div class="d-flex align-items-center gap-2">
                  <span class="mac-dot bg-danger"></span>
                  <span class="mac-dot bg-warning"></span>
                  <span class="mac-dot bg-success"></span>
                </div>
                <button
                  class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  :class="{ 'btn-success text-white': esFavorito(sim.id) }"
                  @click="toggleFavorito(sim.id)"
                >
                  <i
                    :class="esFavorito(sim.id) ? 'bi bi-star-fill' : 'bi bi-star'"
                  ></i>
                  {{ esFavorito(sim.id) ? "Quitar" : "Agregar" }}
                </button>
              </div>

              <!-- Encabezado de categoría -->
              <div
                class="card-header d-flex justify-content-between align-items-center bg-transparent border-0 pt-2 pb-0 px-3"
              >
                <span class="badge category-badge">
                  {{
                    sim.categoria?.charAt(0).toUpperCase() +
                    sim.categoria?.slice(1)
                  }}
                </span>
                <span class="badge bg-light text-secondary">{{
                  (paginaActual - 1) * simuladoresPorPagina + idx + 1
                }}</span>
              </div>

              <!-- Cuerpo -->
              <div class="card-body d-flex flex-column px-3 pt-2">
                <div class="d-flex align-items-center mb-2">
                  <i
                    :class="[
                      'bi',
                      iconoPorAsignatura(sim.asignatura),
                      'me-3',
                      'fs-2',
                      'text-unefa-primary',
                    ]"
                  ></i>
                  <h5 class="profesional-title text-unefa-dark mb-0">
                    {{ sim.nombre_del_simulador }}
                  </h5>
                </div>

                <p class="small text-muted flex-grow-1 mb-2 card-text">
                  {{ sim.descripcion_del_simulador }}
                </p>

                <div
                  class="d-flex justify-content-between align-items-center mt-auto flex-wrap"
                  style="gap: 0.5rem"
                >
                  <span
                    class="badge asignatura-badge flex-shrink-1"
                    :title="sim.asignatura"
                  >
                    {{ sim.asignatura }}
                  </span>
                  <a
                    :href="sim.enlace"
                    target="_blank"
                    class="btn btn-unefa btn-sm text-white flex-shrink-0"
                  >
                    Ejecutar <i class="ri-terminal-box-line"></i>
                  </a>
                </div>

                <span class="small date text-muted mt-2">
                  Agregado: {{ formatDate(sim.created_at, true) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPaginas > 1" class="mt-4">
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center align-items-center gap-2">
          <li class="page-item" :class="{ disabled: paginaActual === 1 }">
            <a
              class="page-link d-flex align-items-center"
              href="#"
              @click.prevent="cambiarPagina(paginaActual - 1)"
            >
              <i class="bi bi-chevron-left me-1"></i>
            </a>
          </li>
          <li class="page-item disabled">
            <span
              class="page-link bg-light border-0 text-unefa-dark fw-bold"
              style="pointer-events: none"
            >
              {{ paginaActual }} de {{ totalPaginas }}
            </span>
          </li>
          <li
            class="page-item"
            :class="{ disabled: paginaActual === totalPaginas }"
          >
            <a
              class="page-link d-flex align-items-center"
              href="#"
              @click.prevent="cambiarPagina(paginaActual + 1)"
            >
              <i class="bi bi-chevron-right ms-1"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  simuladores: any[];
  esFavorito: (id: number) => boolean;
  toggleFavorito: (id: number) => void;
  iconoPorAsignatura: (asignatura: string) => string;
  formatDate: (dateStr: string) => string;
}>();

const simuladoresPorPagina = 6;
const paginaActual = ref(1);

const totalPaginas = computed(() =>
  Math.ceil(props.simuladores.length / simuladoresPorPagina)
);

const simuladoresPaginados = computed(() =>
  props.simuladores.slice(
    (paginaActual.value - 1) * simuladoresPorPagina,
    paginaActual.value * simuladoresPorPagina
  )
);

watch(
  () => props.simuladores.length,
  () => {
    if (paginaActual.value > totalPaginas.value) {
      paginaActual.value = totalPaginas.value || 1;
    }
  }
);

function cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina;
  }
}
</script>

<style scoped>
.sim-list-container {
  min-height: 100vh;
  background: #f6f8fa;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}
.sim-card {
  border-radius: 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
  transition: box-shadow 0.3s, transform 0.2s;
  overflow: hidden;
}
.sim-card:hover {
  box-shadow: 0 8px 28px rgba(0, 33, 71, 0.13);
  transform: translateY(-2px) scale(1.01);
}
.mac-header {
  min-height: 38px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}
.mac-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.category-badge {
  background: #ffc72c;
  color: #002147;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 1rem;
  padding: 0.35em 1em;
}
.asignatura-badge {
  background: #003366;
  color: #ffc72c;
  font-weight: 500;
  border-radius: 1rem;
  padding: 0.35em 1em;
  font-size: 0.85rem;
}
.text-unefa-primary {
  color: #003366 !important;
}
.text-unefa-dark {
  color: #002147 !important;
}
.btn-unefa {
  background-color: #c8102e;
  border: none;
  color: #fff;
  transition: background 0.2s;
}
.btn-unefa:hover {
  background-color: #a00d26;
  color: #fff;
}
.date {
  font-size: 0.85rem;
}
.pagination .page-item.active .page-link {
  background-color: #003366;
  border-color: #003366;
  color: #ffc72c;
}
.pagination .page-link {
  color: #003366;
  border-radius: 0.5rem;
}
.pagination .page-link:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 51, 102, 0.25);
}
</style>
