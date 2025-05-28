<template>
  <div class="metric-card">
    <div class="metric-icon">
      <i class="bi bi-graph-up text-warning"></i>
    </div>
    <div class="metric-content">
      <h3>Promedio de Simuladores por Asignatura</h3>
      <p class="metric-value">{{ Math.round(promedio) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface Simulador {
  id: number
  asignatura: string
}

const props = defineProps<{
  simuladores: Simulador[]
  asignaturas: string[]
}>()

const promedio = computed(() => {
  const totalSimuladores = props.simuladores.length
  const totalAsignaturas = props.asignaturas.length
  return totalAsignaturas > 0 ? totalSimuladores / totalAsignaturas : 0
})
</script>

<style scoped>
.metric-card {
   background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.metric-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}
.metric-icon {
  font-size: 2.5rem;
}
.metric-content h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}
.metric-value {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0;
}
</style>
