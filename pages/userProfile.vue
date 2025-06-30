<template>
  <div class="dashboard-container">
    <!-- Sidebar (solo visible en desktop) -->
    <nav class="unefa-sidebar d-flex flex-column desktop-only">
      <div class="sidebar-logo d-flex align-items-center justify-content-center py-4">
        <h2 class="fs-4 fw-bold text-unefa-accent">Mi Laboratorio</h2>
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
      </ul>
      <div class="mt-auto px-3 pb-4">
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle d-flex align-items-center"
            type="button"
            id="dropdownMenuButtonDesktop"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              width="36"
              class="rounded-circle me-2 border border-light"
              alt="Avatar usuario"
            />
            <span class="fw-bold text-unefa-accent">{{ nombre }}</span>
          </button>
          <ul
            class="dropdown-menu dropdown-menu-dark"
            aria-labelledby="dropdownMenuButtonDesktop"
          >
            <li>
              <button class="dropdown-item text-danger" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <!-- HOME -->
      <div v-if="currentView === 'home'" class="text-center py-5">
        <div class="card p-4 mx-auto shadow-sm" style="max-width: 500px;">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            width="80"
            class="mx-auto mb-3"
            alt="Avatar usuario"
          />
          <h3 class="fw-bold text-dark">
            ¡Bienvenido{{ nombre ? ', ' + nombre : '' }}!
          </h3>
          <p class="text-muted">
            Este es tu panel personal de <strong>MachinaLab Finder</strong>.
            Accede a simuladores, gestiona favoritos y actualiza tu perfil.
          </p>
          <div class="alert alert-info mt-3">
            <i class="bi bi-info-circle me-2"></i>
            Puedes personalizar tu experiencia guardando simuladores favoritos.
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
const simuladores = ref<any[]>([])
const favoritos = ref<number[]>([])
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

  const { data: sims } = await $supabase.from('simuladores').select('*')
  simuladores.value = sims || []

  const { data: favs } = await $supabase
    .from('favoritos')
    .select('simulador_id')
    .eq('user_id', userId)
  favoritos.value = (favs || []).map((f: any) => f.simulador_id)
})

const simuladoresFavoritos = computed(() =>
  simuladores.value.filter(sim => favoritos.value.includes(sim.id))
)

function esFavorito(simId: number) {
  return favoritos.value.includes(simId)
}

async function toggleFavorito(simId: number) {
  if (!userId) return
  if (esFavorito(simId)) {
    await $supabase.from('favoritos').delete().eq('user_id', userId).eq('simulador_id', simId)
    favoritos.value = favoritos.value.filter(id => id !== simId)
  } else {
    await $supabase.from('favoritos').insert({ user_id: userId, simulador_id: simId })
    favoritos.value.push(simId)
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

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString()
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
  min-height: 100vh;
  background: var(--unefa-bg);
}

.unefa-sidebar {
  width: 260px;
  min-height: 100vh;
  background: linear-gradient(160deg, var(--unefa-dark) 80%, #003366 100%);
  color: var(--unefa-accent);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  box-shadow: 2px 0 12px rgba(0,0,0,0.09);
  border-right: 2px solid var(--unefa-accent);
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
  color: var(--unefa-accent);
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
.nav-link.active, .nav-link:hover {
  background: rgba(255, 199, 44, 0.18);
  color: var(--unefa-accent) !important;
  font-weight: 700;
  border-left: 4px solid var(--unefa-accent);
  box-shadow: 0 2px 8px 0 rgba(200,16,46,0.07);
}
.nav-link i {
  font-size: 1.25rem;
  margin-right: 0.7rem;
}

.main-content {
  flex: 1;
  padding: 2rem 2rem 2rem 2.5rem;
  background: var(--unefa-bg);
  min-width: 0;
}

.text-unefa-accent {
  color: var(--unefa-accent) !important;
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
    padding-bottom: 70px !important; /* deja espacio para la navbar fija abajo */
    padding-top: 2rem !important;
  }
  .btn-secondary.dropdown-toggle {
    background-color: transparent !important;
    border: none !important;
    color: var(--unefa-accent) !important;
    box-shadow: none !important;
    padding: 0;
  }
  .btn-secondary.dropdown-toggle:hover,
  .btn-secondary.dropdown-toggle:focus {
    background-color: rgba(255, 199, 44, 0.18) !important;
    color: var(--unefa-accent) !important;
    box-shadow: none !important;
  }
  .dropdown-menu.dropdown-menu-dark {
    background-color: var(--unefa-dark);
    border: none;
  }
  .dropdown-item.text-danger {
    color: #ff5252 !important;
  }
  .dropdown-item.text-danger:hover,
  .dropdown-item.text-danger:focus {
    background-color: rgba(255, 82, 82, 0.2) !important;
    color: #ff5252 !important;
  }
}
</style>
