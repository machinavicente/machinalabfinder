<template>
  <ClientOnly>
    <nav class="bottom-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <i class="ri-home-line"></i>
        <span>Inicio</span>
      </NuxtLink>
      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <i class="ri-dashboard-line"></i>
        <span>Panel</span>
      </NuxtLink>
            <!-- Perfil Dropdown (solo mobile) -->
      <div class="nav-item profile-dropdown mobile-only" @click="toggleDropdown" tabindex="0">
        <i class="bi bi-person-badge"></i>
        <span>Perfil</span>
        <div v-if="dropdownOpen" class="dropdown-menu-bottom show">
          <button @click="goTo('/userProfile', 'home')" class="dropdown-item-bottom">
           <i class="bi bi-person-badge"></i> Perfil
          </button>
          <button @click="goTo('/userProfile', 'simuladores')" class="dropdown-item-bottom">
            <i class="bi bi-cpu"></i> Simuladores
          </button>
          <button @click="goTo('/userProfile', 'favorites')" class="dropdown-item-bottom">
            <i class="bi bi-star"></i> Favoritos
          </button>
          <button @click="goTo('/userProfile', 'settings')" class="dropdown-item-bottom">
            <i class="bi bi-gear"></i> Ajustes
          </button>
          <button @click="logout" class="dropdown-item-bottom text-danger">
            <i class="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>
      <NuxtLink to="/guides" class="nav-item" active-class="active">
        <i class="ri-book-open-line"></i>
        <span>Guías</span>
      </NuxtLink>
      <NuxtLink to="/order_simulators" class="nav-item" active-class="active">
        <i class="bi bi-cpu"></i>
        <span>S-Online</span>
      </NuxtLink>
      <NuxtLink to="/downloads" class="nav-item" active-class="active">
        <i class="ri-download-2-line"></i>
        <span>Descargas</span>
      </NuxtLink>
      <NuxtLink to="/info_simuladores" class="nav-item" active-class="active">
        <i class="bi bi-info-lg"></i>
        <span>Info</span>
      </NuxtLink>
      <NuxtLink to="/registro_simuladores" class="nav-item" active-class="active">
        <i class="bi bi-pencil-square"></i>
        <span>Nuevo</span>
      </NuxtLink>
    </nav>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const dropdownOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function goTo(path: string, view?: string) {
  dropdownOpen.value = false
  if (path === '/userProfile' && view) {
    router.push({ path, query: { view } })
  } else {
    router.push(path)
  }
}

async function logout() {
  // Si usas Supabase:
  const { $supabase } = useNuxtApp()
  await $supabase?.auth.signOut?.()
  router.push('/login')
}

// Cierra el dropdown al hacer click fuera
if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.profile-dropdown')) dropdownOpen.value = false
  })
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #002147;
  /* Azul UNEFA */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #ffc72c;
  z-index: 1200;
  padding: 0 4px;
  gap: 0;
}

.nav-item {
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0 2px;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-item span {
  font-size: 10px;
  margin-top: 0;
  line-height: 1.1;
  max-width: 80px;
  overflow-wrap: break-word;
  display: block;
  white-space: normal;
  word-break: break-word;
}

@media (max-width: 400px) {
  .nav-item span {
    font-size: 9px;
    max-width: 48px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: normal;
    text-align: center;
    line-height: 1.15;
    display: block;
  }
}

@media (max-width: 340px) {
  .nav-item span {
    font-size: 8.5px;
    max-width: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: normal;
    text-align: center;
    line-height: 1.15;
    display: block;
  }
}

@media (min-width: 992px) {
  .bottom-nav {
    display: none !important;
  }
}

.nav-item.active {
  color: #ffc72c;
  /* Amarillo UNEFA */
}

.nav-item:active,
.nav-item:focus,
.nav-item:hover {
  color: #ffc72c;
  /* Amarillo UNEFA al interactuar */
}

.profile-dropdown {
  position: relative;
  cursor: pointer;
  outline: none;
}
.profile-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-bottom: 2px;
  border: 1.5px solid #ffc72c;
  background: #fff;
}
.dropdown-menu-bottom {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  background: #002147;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  min-width: 120px;
  padding: 6px 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dropdown-item-bottom {
  background: none;
  border: none;
  color: #ffc72c;
  text-align: left;
  padding: 8px 16px;
  font-size: 13px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: background 0.18s;
}
.dropdown-item-bottom:hover,
.dropdown-item-bottom:focus {
  background: rgba(255,199,44,0.13);
}
.text-danger {
  color: #ff5252 !important;
}
@media (min-width: 992px) {
  .profile-dropdown {
    display: none !important;
  }
}
@media (max-width: 991.98px) {
  .mobile-only {
    display: flex !important;
  }
}
</style>
