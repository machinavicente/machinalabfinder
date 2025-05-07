<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'

interface simuladores {
  id: number
  nombre_del_simulador: string
  enlace: string
  categoria: string
  asignatura: string
}

// Obtén el cliente Supabase con el tipo correcto
const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

// Estados reactivos
const simuladores = ref<simuladores[]>([])
const searchTerm = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)
const asignaturaActual = ref('Todas las asignaturas')

// Función para cargar datos
async function cargarSimuladores() {
  try {
    isLoading.value = true;
    error.value = null;
    
    // 1. Verificar conexión básica
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Sesión Supabase:', sessionData);
    
    // 2. Verificar existencia de la tabla
    const { data: tableInfo } = await supabase
      .rpc('get_table_info', { table_name: 'simuladores' })
      .single();
    console.log('Información de tabla:', tableInfo);
    
    // 3. Consulta con conteo exacto
    const { data, error: supabaseError, count } = await supabase
      .from('simuladores')
      .select('*', { count: 'exact' })
      .order('nombre_del_simulador', { ascending: true });
    
    console.log('Respuesta completa:', { data, error: supabaseError, count });
    
    if (supabaseError) throw supabaseError;
    
    if (count === 0) {
      console.warn('La tabla existe pero está vacía');
      error.value = 'No se encontraron simuladores en la base de datos';
    }
    
    simuladores.value = data || [];
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
    console.error('Error completo:', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  cargarSimuladores()
})

const filteredSimuladores = computed(() => {
  if (!simuladores.value) return []
  
  const term = searchTerm.value.toLowerCase().trim()
  return term
    ? simuladores.value.filter(sim =>
        sim.nombre_del_simulador.toLowerCase().includes(term) ||
        sim.categoria.toLowerCase().includes(term))
    : simuladores.value
})
</script>
<template>
  <!-- Barra de navegación -->
  <nav class="navbar navbar-expand-lg navbar-dark navbar-unefa">
    <div class="container d-flex justify-content-center">
      <NuxtLink class="navbar-brand d-flex align-items-center" to="/">
        <div class="me-3"><img src="/assets/images/logo.png" alt="logo" width="40" height="60"></div>
        <span>Machina<span style="color: #FFC72C;">Synth</span>Labs</span>
      </NuxtLink>
    </div>
  </nav>

  <!-- Barra de búsqueda -->
  <div class="search-container text-white">
    <div class="container">
      <div class="search-box">
        <h2 class="text-center mb-4">Encuentra el simulador que necesitas</h2>
        <div class="input-group mb-3">
          <input 
            v-model="searchTerm"
            type="text" 
            class="search-input" 
            placeholder="Buscar simuladores..."
          >
        </div>
        <div class="text-center">
          <small>Ejemplo: redes, programación, bases de datos</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Sección por asignatura -->
  <div class="container py-4">
    <h3 class="section-title mb-4">{{ asignaturaActual }}</h3>
    
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else class="row g-4 mb-5">
      <!-- Card Individual -->
      <div 
        v-for="sim in filteredSimuladores" 
        :key="sim.id" 
        class="col-md-4 col-lg-3"
      >
        <div class="card shadow-sm h-100">
          <div class="card-body text-center d-flex flex-column">
            <i class="bi bi-terminal fs-1 my-4"></i>
            <span class="badge category-badge mb-3">{{ sim.categoria }}</span>
            <h5 class="card-title">{{ sim.nombre_del_simulador }}</h5>
            <hr>
            <p class="card-text text-muted mb-4">Simulador interactivo</p>
            <a 
              :href="sim.enlace" 
              target="_blank" 
              class="btn btn-simulator mt-auto"
            >
              Ejecutar
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Estilos para la barra de navegación */
.navbar-unefa {
  background-color: #1a365d;
}

/* Estilos para la barra de búsqueda */
.search-container {
  background-color: #2c5282;
  padding: 2rem 0;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
  border: none;
  color: rgb(255, 255, 255);
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  width: 100%;
}

.search-input::placeholder {
  color: rgba(255, 217, 0, 0.986);
}

/* Estilos para las cards */
.card {
  border: none;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.category-badge {
  background-color: #4299e1;
  color: white;
  font-size: 0.8rem;
  padding: 0.35em 0.65em;
  border-radius: 50rem;
  align-self: center;
}

.btn-simulator {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-simulator:hover {
  background-color: #2c5282;
  color: white;
}

.section-title {
  color: #2d3748;
  font-weight: 600;
  padding-top: 1rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}
</style>