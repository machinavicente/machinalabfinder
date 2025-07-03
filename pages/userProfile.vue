<template>
  <div class="dashboard-container row g-0">
    <!-- Sidebar -->
    <nav class="col-lg-3 unefa-sidebar d-flex flex-column min-vh-100 p-0">
      <div class="sidebar-logo d-flex align-items-center justify-content-center py-4 flex-column">
        <h2 class="fs-4 fw-bold text-unefa-accent mb-2">Mi Laboratorio</h2>
      </div>
      <ul class="nav flex-column nav-custom mt-4 px-3">
        <li class="nav-item mb-2">
          <a href="#" class="nav-link" :class="{ active: currentView === 'home' }" @click.prevent="currentView = 'home'">
            <i class="bi bi-person-badge me-2"></i> Mi Perfil
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="#" class="nav-link" :class="{ active: currentView === 'simuladores' }" @click.prevent="currentView = 'simuladores'">
            <i class="bi bi-cpu me-2"></i> Simuladores
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="#" class="nav-link" :class="{ active: currentView === 'favorites' }" @click.prevent="currentView = 'favorites'">
            <i class="bi bi-star me-2"></i> Favoritos
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="#" class="nav-link" :class="{ active: currentView === 'settings' }" @click.prevent="currentView = 'settings'">
            <i class="bi bi-gear me-2"></i> Ajustes
          </a>
        </li>
        <li class="nav-item mt-4">
          <button class="nav-link text-danger w-100 text-start logout-btn" style="background: none; border: none;" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main content -->
    <main class="col-lg-9 main-content py-4 px-3">
      <!-- HOME - Vista de perfil -->
      <div v-if="currentView === 'home'" class="profile-view">
        <div class="row g-4">
          <!-- Perfil del usuario -->
          <div class="col-md-5">
            <div class="card profile-card shadow-sm mb-4">
              <div class="card-body text-center">
                <img :src="userAvatar" width="110" class="rounded-circle border border-3 border-unefa-accent mb-3" alt="Avatar usuario" />
                <h3 class="fw-bold mb-1">¡{{ nombre }} {{ apellido }}!</h3>
                <p class="text-muted mb-3">{{ userEmail }}</p>
                <div class="user-stats text-start mt-4">
                  <div class="stat-item mb-2">
                    <i class="bi bi-calendar-check me-2"></i>
                    <span>Miembro desde {{ formatDate(createdAt, true) }}</span>
                  </div>
                  <div class="stat-item mb-2">
                    <i class="bi bi-activity me-2"></i>
                    <span>Último acceso: {{ formatRelativeTime(lastSignInAt) }}</span>
                  </div>
                  <div class="stat-item">
                    <i class="bi bi-star-fill me-2"></i>
                    <span>{{ simuladoresFavoritos.length }} simuladores favoritos</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Asignaturas favoritas -->
            <div class="card shadow-sm" v-if="asignaturasFavoritas.length">
              <div class="card-header bg-unefa-dark text-white">
                <h5 class="mb-0"><i class="bi bi-book me-2"></i>Asignaturas vistas</h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li v-for="asig in asignaturasFavoritas" :key="asig" class="mb-2">
                    <i class="bi bi-dot text-unefa-primary"></i> {{ asig }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Últimos favoritos -->
          <div class="col-md-7">
            <div class="card favorites-card shadow-sm h-100">
              <div class="card-header bg-unefa-dark text-white">
                <h4 class="mb-0"><i class="bi bi-star-fill me-2"></i>Tus últimos 6 simuladores favoritos</h4>
              </div>
              <div class="card-body p-0">
                <div v-if="ultimosFavoritos.length > 0" class="favorites-list p-3">
                  <div
                    v-for="sim in ultimosFavoritos"
                    :key="sim.id"
                    class="favorite-item d-flex align-items-center mb-3 p-2 rounded bg-light flex-column flex-md-row"
                  >
                    <div class="sim-icon me-md-3 mb-2 mb-md-0">
                      <i :class="['bi', iconoPorAsignatura(sim.asignatura), 'fs-3', 'text-unefa-primary']"></i>
                    </div>
                    <div class="sim-info flex-grow-1 w-100 mb-2 mb-md-0">
                      <div class="sim-title-row d-flex align-items-center flex-wrap">
                        <span class="sim-title fw-semibold me-2">{{ sim.nombre_del_simulador }}</span>
                        <span class="badge bg-unefa-dark">{{ sim.asignatura }}</span>
                      </div>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        Creado el {{ formatDate(sim.created_at, true) }}
                      </small>
                    </div>
                    <div class="d-flex gap-2">
                      <a
                        class="btn btn-sm btn-unefa-primary"
                        :href="sim.enlace"
                        target="_blank"
                        rel="noopener"
                      >
                        Usar <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                      <button class="btn btn-sm btn-outline-danger" @click="toggleFavorito(sim.id)">
                        <i class="bi bi-star-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-favorites text-center py-4">
                  <i class="bi bi-star text-muted fs-1"></i>
                  <p class="mt-3">Aún no tienes simuladores favoritos</p>
                  <router-link to="" class="btn btn-unefa-primary btn-sm">
                    <i class="bi bi-cpu me-1"></i>
                    <span :class="{ active: currentView === 'simuladores' }" @click.prevent="currentView = 'simuladores'">Explorar Simuladores</span>
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
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SimulatorList from "~/components/SimulatorList.vue";
import ProfileSettings from "~/components/ProfileSettings.vue";
import FavoriteSimulators from "~/components/FavoriteSimulators.vue";

function iconoPorAsignatura(asignatura: string) {
  switch (asignatura?.toLowerCase()) {
    case "física":
      return "bi-lightning-charge";
    case "química":
      return "bi-beaker";
    case "biología":
      return "bi-flower2";
    case "matemáticas":
      return "bi-calculator";
    case "informática":
      return "bi-cpu";
    case "electrónica":
      return "bi-plug";
    default:
      return "bi-book";
  }
}

import type { SupabaseClient } from "@supabase/supabase-js";
const { $supabase } = useNuxtApp() as unknown as { $supabase: SupabaseClient };

const nombre = ref("");
const apellido = ref("");
const userEmail = ref("");
const userAvatar = ref("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
const createdAt = ref("");
const lastSignInAt = ref("");
const simuladores = ref<any[]>([]);
const favoritos = ref<any[]>([]);
const router = useRouter();
const route = useRoute();

const simuladoresFavoritos = computed(() => favoritos.value);
const currentView = ref("home");

const asignaturasFavoritas = computed(() => {
  const asignaturasSet = new Set<string>();
  favoritos.value.forEach(fav => {
    if (fav && fav.asignatura) {
      asignaturasSet.add(fav.asignatura);
    }
  });
  return Array.from(asignaturasSet);
});

const ultimosFavoritos = computed(() => {
  return [...favoritos.value]
    .sort((a, b) => new Date(b.favorito_created_at || b.created_at).getTime() - new Date(a.favorito_created_at || a.created_at).getTime())
    .slice(0, 6);
});

let userId: number | null = null;

watch(
  () => route.query.view,
  (view) => {
    if (
      typeof view === "string" &&
      ["home", "simuladores", "favorites", "settings"].includes(view)
    ) {
      currentView.value = view;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) {
    router.replace("/login");
    return;
  }
  const usuario = JSON.parse(usuarioStr);
  userId = usuario.id;
  nombre.value = usuario.nombre;
  apellido.value = usuario.apellido;
  userEmail.value = usuario.email;

  const { data: userData } = await $supabase
    .from("usuarios")
    .select("creado_en, actualizado_en")
    .eq("id", userId)
    .single();
  createdAt.value = userData?.creado_en || "";
  lastSignInAt.value = userData?.actualizado_en || "";

  const { data: sims } = await $supabase.from("simuladores").select("*");
  simuladores.value = sims || [];

  const { data: favs } = await $supabase
    .from("favoritos")
    .select("simulador_id, created_at")
    .eq("user_id", userId);

  favoritos.value = (favs || []).map(fav => {
    const sim = simuladores.value.find(s => s.id === fav.simulador_id);
    if (sim) {
      return {
        ...fav,
        ...sim,
        favorito_created_at: fav.created_at
      };
    }
    return null;
  }).filter(Boolean);
});

function esFavorito(simId: number) {
  return favoritos.value.some(f => f.id === simId);
}

function formatDate(dateStr: string, corto = false) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  if (corto) {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("es-ES");
}

async function toggleFavorito(simId: number) {
  if (!userId) return;

  if (esFavorito(simId)) {
    await $supabase
      .from("favoritos")
      .delete()
      .eq("user_id", userId)
      .eq("simulador_id", simId);
  } else {
    await $supabase
      .from("favoritos")
      .insert({
        user_id: userId,
        simulador_id: simId,
      });
  }

  const { data: favs } = await $supabase
    .from("favoritos")
    .select("simulador_id, created_at")
    .eq("user_id", userId);

  favoritos.value = (favs || []).map(fav => {
      const sim = simuladores.value.find(s => s.id === fav.simulador_id);
      if (sim) {
        return {
          ...fav,
          ...sim,
          favorito_created_at: fav.created_at
        };
      }
      return null;
    }).filter(Boolean);
}

function formatRelativeTime(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  return "hace unos segundos";
}

function logout() {
  localStorage.removeItem("usuario");
  router.replace("/login");
  setTimeout(() => window.location.reload(), 100);
}
</script>

<style scoped>
@media (max-width: 991.98px) {
  nav {
    display: none !important;
  }
  .favorites-card {
    max-height: 350px;
    min-height: 220px;
  }
}
.dashboard-container {
  background: #f8f9fa;
  min-height: 100vh;
}
.unefa-sidebar {
  background: #003366;
  color: #fff;
  min-width: 220px;
  max-width: 260px;
}
.unefa-sidebar .nav-link {
  color: #fff;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  transition: background 0.2s;
}
.unefa-sidebar .nav-link.active,
.unefa-sidebar .nav-link:hover {
  background: #ffc72c;
  color: #003366 !important;
}
/* Quitar hover solo a cerrar sesión */
.unefa-sidebar .logout-btn,
.unefa-sidebar .logout-btn:hover,
.unefa-sidebar .logout-btn:focus {
  background: none !important;
  color: #dc3545 !important;
  cursor: pointer;
}
.unefa-accent {
  color: #ffc72c !important;
}
.bg-unefa-dark {
  background: #002147 !important;
}
.text-unefa-primary {
  color: #003366 !important;
}
.profile-card {
  border-radius: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
}
.favorites-card {
  border-radius: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
  max-height: 420px;
  min-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.favorites-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.favorite-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.sim-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.sim-info {
  min-width: 0;
  flex: 1 1 0%;
  overflow: hidden;
}
.sim-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-width: 0;
}
.sim-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
  display: inline-block;
}
.btn-unefa-primary {
  background: #003366;
  color: #ffc72c;
  border: none;
}
.btn-unefa-primary:hover {
  background: #002147;
  color: #ffc72c;
}
</style>