<template>
  <div>
    <div class="row mb-3">
      <div class="col-12">
        <h4 class="mb-3">Simuladores Online Disponibles</h4>
      </div>

      <div v-if="simuladores.length === 0" class="col-12">
        <div class="alert alert-danger text-center">
          <i class="bi bi-wifi-off fs-4 px-3"></i>
          <span >Error de Conexion, Verifique e intente de nuevo</span>
        </div>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="(sim, idx) in simuladores"
          :key="sim.id"
          class="col-md-4 d-flex"
        >
          <div class="sim-card card shadow-sm h-100 flex-fill position-relative">

            <!-- Estilo tipo ventana de macOS + botón favorito -->
            <div class="mac-header d-flex align-items-center justify-content-between px-3 pt-3 pb-1">
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
                <i :class="esFavorito(sim.id) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                {{ esFavorito(sim.id) ? 'Quitar' : 'Agregar' }}
              </button>
            </div>

            <!-- Encabezado de categoría -->
            <div class="card-header d-flex justify-content-between align-items-center bg-transparent border-0 pt-2 pb-0 px-3">
              <span class="badge category-badge">
                {{ sim.categoria?.charAt(0).toUpperCase() + sim.categoria?.slice(1) }}
              </span>
              <span class="badge bg-light text-secondary">{{ idx + 1 }}</span>
            </div>

            <!-- Cuerpo -->
            <div class="card-body d-flex flex-column px-3 pt-2">
              <div class="d-flex align-items-center mb-2">
                <i :class="['bi', iconoPorAsignatura(sim.asignatura), 'me-3', 'fs-2', 'text-unefa-primary']"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  {{ sim.nombre_del_simulador }}
                </h5>
              </div>

              <p class="small text-muted flex-grow-1 mb-2 card-text">
                {{ sim.descripcion_del_simulador }}
              </p>

              <div class="d-flex justify-content-between align-items-center mt-auto flex-wrap" style="gap: 0.5rem;">
                <span class="badge asignatura-badge flex-shrink-1" :title="sim.asignatura">
                  {{ sim.asignatura }}
                </span>
                <a :href="sim.enlace" target="_blank" class="btn btn-unefa btn-sm text-white flex-shrink-0">
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
</template>

<script setup lang="ts">
defineProps<{
  simuladores: any[],
  esFavorito: (id: number) => boolean,
  toggleFavorito: (id: number) => void,
  iconoPorAsignatura: (asignatura: string) => string,
  formatDate: (dateStr: string) => string
}>()
</script>

<style scoped>
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
</style>
