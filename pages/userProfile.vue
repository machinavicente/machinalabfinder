<template>
  <div class="dashboard-container">
    <!-- Sidebar (actualiza esta sección) -->
    <nav class="unefa-sidebar d-flex flex-column desktop-only">
      <div class="sidebar-logo d-flex align-items-center justify-content-center py-4 flex-column">
        <h2 class="fs-4 fw-bold text-unefa-accent mb-2">Mi Laboratorio</h2>
        <div class="sidebar-user-name text-center w-100">
          <span class="fw-bold text-white" style="font-size:1.08rem;">
            {{ nombre }}
          </span>
        </div>
      </div>
      <ul class="nav flex-column nav-custom mt-4">
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: currentView === 'home' }"
            @click.prevent="currentView = 'home'"
          >
            <i class="bi bi-person-badge"></i>
            Mi Perfil
          </a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: currentView === 'simuladores' }"
            @click.prevent="currentView = 'simuladores'"
          >
            <i class="bi bi-cpu me-2"></i>
            Simuladores
          </a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: currentView === 'favorites' }"
            @click.prevent="currentView = 'favorites'"
          >
            <i class="bi bi-star me-2"></i>
            Favoritos
          </a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: currentView === 'settings' }"
            @click.prevent="currentView = 'settings'"
          >
            <i class="bi bi-gear me-2"></i>
            Ajustes
          </a>
        </li>
        <li class="nav-item mt-2">
          <button class="nav-link text-danger" style="background:none;border:none;text-align:left;width:100%;"
            @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <!-- HOME - Vista de perfil mejorada -->
      <div v-if="currentView === 'home'" class="profile-view">
        <div class="row">
          <!-- Columna izquierda - Perfil del usuario -->
          <div class="col-lg-5">
            <div class="card profile-card shadow-sm">
              <div class="card-body text-center">
                <img
                  :src="userAvatar"
                  width="120"
                  class="rounded-circle border border-3 border-unefa-accent mb-4"
                  alt="Avatar usuario"
                />
                <h3 class="fw-bold mb-1">
                  ¡Bienvenido{{ nombre ? ', ' + nombre : '' }}!
                </h3>
                <p class="text-muted mb-4">{{ userEmail }}</p>
                
                <div class="user-stats">
                  <div class="stat-item">
                    <i class="bi bi-calendar-check"></i>
                    <span>Miembro desde {{ formatDate(createdAt, true) }}</span>
                  </div>
                  <div class="stat-item">
                    <i class="bi bi-activity"></i>
                    <span>Último acceso: {{ formatRelativeTime(lastSignInAt) }}</span>
                  </div>
                  <div class="stat-item">
                    <i class="bi bi-star-fill"></i>
                    <span>{{ simuladoresFavoritos.length }} simuladores favoritos</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nueva sección: Asignaturas de simuladores favoritos -->
            <div class="card mt-4 shadow-sm" v-if="asignaturasFavoritas.length">
              <div class="card-header bg-unefa-dark text-white">
                <h5 class="mb-0">
                  <i class="bi bi-book me-2"></i>
                 Asignaturas vistas
                </h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li v-for="asig in asignaturasFavoritas" :key="asig" class="mb-2">
                    <i class="bi bi-dot text-unefa-primary"></i>
                    {{ asig }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Columna derecha - Últimos favoritos -->
          <div class="col-lg-7">
            <div class="card favorites-card shadow-sm">
              <div class="card-header bg-unefa-dark text-white">
                <h4 class="mb-0">
                  <i class="bi bi-star-fill me-2"></i>
                  Tus últimos 5 simuladores favoritos
                </h4>
              </div>
              <div class="card-body">
                <div v-if="ultimosFavoritos.length > 0" class="favorites-list">
                  <div 
                    v-for="sim in ultimosFavoritos" 
                    :key="sim.id" 
                    class="favorite-item"
                  >
                    <div class="sim-icon">
                      <i :class="['bi', iconoPorAsignatura(sim.asignatura)]"></i>
                    </div>
                    <div class="sim-info">
                      <div class="d-flex align-items-center mb-1">
                        <h5 class="sim-title mb-0 me-2">{{ sim.nombre_del_simulador }}</h5>
                        <span class="badge bg-unefa-dark text-unefa-accent ms-1">{{ sim.asignatura }}</span>
                      </div>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        Creado el {{ formatDate(sim.created_at, true) }}
                      </small>
                    </div>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      @click="toggleFavorito(sim.id)"
                    >
                      <i class="bi bi-star-fill"></i>
                    </button>
                  </div>
                </div>
                <div v-else class="empty-favorites">
                  <i class="bi bi-star text-muted"></i>
                  <p class="mt-3">Aún no tienes simuladores favoritos</p>
                  <router-link 
                    to="/simuladores" 
                    class="btn btn-unefa-primary btn-sm"
                  >
                    <i class="bi bi-cpu me-1"></i> Explorar simuladores
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SIMULADORES -->
      <div v-else-if="currentView === 'simuladores'">
        <SimulatorList
          :simuladores="simuladores"
          :esFavorito="esFavorito"
          :toggleFavorito="toggleFavorito"
          :iconoPorAsignatura="iconoPorAsignatura"
          :formatDate="formatDate"
        />
      </div>

      <!-- FAVORITOS -->
      <div v-else-if="currentView === 'favorites'">
        <FavoriteSimulators
          :simuladoresFavoritos="simuladoresFavoritos"
          :esFavorito="esFavorito"
          :toggleFavorito="toggleFavorito"
          :iconoPorAsignatura="iconoPorAsignatura"
          :formatDate="formatDate"
        />
      </div>

      <!-- SETTINGS -->
      <div v-else-if="currentView === 'settings'">
        <ProfileSettings :nombre="nombre" @updateNombre="nombre = $event" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SimulatorList from '~/components/SimulatorList.vue'
import ProfileSettings from '~/components/ProfileSettings.vue'
import FavoriteSimulators from '~/components/FavoriteSimulators.vue'

import type { SupabaseClient } from '@supabase/supabase-js'
const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient }

const nombre = ref('')
const userEmail = ref('')
const userAvatar = ref('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
const lastSignInAt = ref('')
const createdAt = ref('')
const simuladores = ref<any[]>([])
const favoritos = ref<any[]>([])
const router = useRouter()
const route = useRoute()
const currentView = ref('home')

// Sincroniza currentView con la query 'view'
watch(
  () => route.query.view,
  (view) => {
    if (typeof view === 'string' && ['home', 'simuladores', 'favorites', 'settings'].includes(view)) {
      currentView.value = view
    }
  },
  { immediate: true }
)

let userId: string | null = null

onMounted(async () => {
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }
  
  userId = user.id
  nombre.value = user.user_metadata?.name || user.user_metadata?.userName || ''
  userEmail.value = user.email || ''
  userAvatar.value = user.user_metadata?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  lastSignInAt.value = user.last_sign_in_at || ''
  createdAt.value = user.created_at || ''

  // Cargar simuladores
  const { data: sims } = await $supabase.from('simuladores').select('*')
  simuladores.value = sims || []

  // Cargar favoritos con información de fecha de creación
  const { data: favs } = await $supabase
    .from('favoritos')
    .select('*, simuladores(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  favoritos.value = favs || []
})

// Simuladores favoritos with full info
const simuladoresFavoritos = computed(() => {
  return favoritos.value.map(fav => ({
    ...fav.simuladores,
    favorito_created_at: fav.created_at
  }))
})

// Últimos 5 favoritos ordenados por fecha descendente
const ultimosFavoritos = computed(() => {
  return [...simuladoresFavoritos.value].slice(0, 5)
})

const asignaturasFavoritas = computed(() => {
  const asignaturas = simuladoresFavoritos.value
    .map(sim => sim.asignatura)
    .filter(Boolean)
  // Eliminar duplicados
  return [...new Set(asignaturas)]
})

function esFavorito(simId: number) {
  return favoritos.value.some(f => f.simulador_id === simId)
}

async function toggleFavorito(simId: number) {
  if (!userId) return
  
  if (esFavorito(simId)) {
    await $supabase.from('favoritos').delete().eq('user_id', userId).eq('simulador_id', simId)
    favoritos.value = favoritos.value.filter(f => f.simulador_id !== simId)
  } else {
    const { data } = await $supabase.from('favoritos').insert({ 
      user_id: userId, 
      simulador_id: simId 
    }).select('*, simuladores(*)').single()
    
    if (data) {
      favoritos.value.unshift(data) // Agregar al inicio para mantener orden
    }
  }
}

async function logout() {
  await $supabase.auth.signOut()
  router.push('/login')
}

function iconoPorAsignatura(asignatura: string) {
  switch (asignatura?.toLowerCase()) {
    case 'programación': return 'bi-code-slash'
    case 'redes': return 'bi-diagram-3'
    case 'electrónica': return 'bi-cpu'
    default: return 'bi-window'
  }
}

function formatDate(dateStr: string, short = false) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  
  if (short) {
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    })
  }
  
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelativeTime(dateStr: string) {
  if (!dateStr) return 'N/A'
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  
  return formatDate(dateStr, true)
}
</script>

<style scoped>
:root {
  --unefa-primary: #c8102e;
  --unefa-dark: #002147;
  --unefa-accent: #ffc72c;
  --unefa-bg: #f8f9fa;
}

.dashboard-container {
  display: flex;
  height: 100vh;         /* Cambia min-height por height */
  overflow: hidden;      /* Evita que algo se salga */
  background: var(--unefa-bg);
}

.unefa-sidebar {
  width: 260px;
  min-height: 100vh;
  background: #002147; /* Azul UNEFA sólido */
  color: #fff;         /* Texto blanco */
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  box-shadow: 2px 0 12px rgba(0,0,0,0.09);
  border-right: 2px solid #ffc72c;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.sidebar-logo {
  background: rgba(255,255,255,0.03);
  border-bottom: 1.5px solid var(--unefa-accent);
}

.nav-custom {
  padding: 0;
}

.nav-link {
  color: #fff; /* Texto blanco */
  font-weight: 500;
  padding: 0.95rem 2rem;
  border-radius: 0.7rem 0 0 0.7rem;
  margin-bottom: 0.3rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  border-left: 4px solid transparent;
}
.nav-link.active, .nav-link:hover {   /* Fondo amarillo UNEFA */
  color: #ffc72c;  /* Texto azul UNEFA */
  font-weight: 700;;
  box-shadow: 0 2px 8px 0 rgba(200,16,46,0.07);
}

.nav-link i {
  font-size: 1.25rem;
  margin-right: 0.7rem;
}

.main-content {
  flex: 1;
  height: 100vh;         /* Ocupa todo el alto de la pantalla */
  overflow-y: auto;      /* Scroll solo aquí */
  padding: 2rem 2rem 2rem 2.5rem;
  background: var(--unefa-bg);
  min-width: 0;
  box-sizing: border-box;
}

/* Estilos para la vista de perfil mejorada */
.profile-view {
  padding-top: 1rem;
}

.profile-card {
  border-radius: 0.75rem;
  border: none;
  margin-bottom: 1.5rem;
}

.profile-card img {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-stats {
  text-align: left;
  margin: 1.5rem 0;
  padding: 0 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

.stat-item i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
  color: var(--unefa-dark);
}

.favorites-card {
  border-radius: 0.75rem;
  border: none;
  height: 100%;
}

.favorites-card .card-header {
  border-radius: 0.75rem 0.75rem 0 0 !important;
  background: var(--unefa-dark) !important;
  padding: 1.25rem;
}

.card-header h4,
.card-header h5 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffc72c !important;      /* Texto amarillo UNEFA */
  background: #002147;              /* Fondo azul UNEFA */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  letter-spacing: 0.5px;
  margin-bottom: 0;
  text-shadow: none;
}

.bg-unefa-dark {
  background-color: var(--unefa-dark) !important;
}

/* Mejora para títulos en mobile */
@media (max-width: 991.98px) {
  .card-header h4,
  .card-header h5 {
    font-size: 1.15rem;
  }
}

.favorites-list {
  padding: 0.5rem;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.favorite-item:hover {
  background: rgba(0, 33, 71, 0.05);
  transform: translateY(-2px);
}

.sim-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(200, 16, 46, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: var(--unefa-primary);
  font-size: 1.25rem;
}

.sim-info {
  flex: 1;
  text-align: left;
}

.sim-title {
  font-size: 1.05rem;
  color: var(--unefa-dark);
  margin-bottom: 0.25rem;
}

.sim-subject {
  font-size: 0.85rem;
  color: #666;
}

.empty-favorites {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-favorites i {
  font-size: 3rem;
  opacity: 0.3;
}

.btn-unefa-primary {
  background-color: var(--unefa-primary);
  color: white;
  border: none;
}

.btn-unefa-primary:hover {
  background-color: #a50d26;
  color: white;
}

/* Mostrar/Ocultar según resolución */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 991.98px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: flex !important;
    width: 100%;
    z-index: 1050;
  }
  .main-content {
    padding-bottom: 70px !important;
    padding-top: 2rem !important;
  }
  .profile-view .row {
    flex-direction: column;
  }
  .profile-view .col-lg-5,
  .profile-view .col-lg-7 {
    width: 100%;
    max-width: 100%;
    padding: 0;
  }
  .profile-card,
  .favorites-card {
    margin-bottom: 1.5rem;
  }
}

.badge.bg-unefa-dark {
  background: var(--unefa-dark) !important;
  color: var(--unefa-accent) !important;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35em 0.7em;
  border-radius: 0.5em;
  margin-left: 0.5em;
}
</style>