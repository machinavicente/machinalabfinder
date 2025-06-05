<template>
  <ClientOnly>
    <nav v-if="isMobile" class="bottom-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <i class="ri-home-line"></i>
        <span>Inicio</span>
      </NuxtLink>
      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <i class="ri-dashboard-line"></i>
        <span>Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/guides" class="nav-item" active-class="active">
        <i class="ri-book-open-line"></i>
        <span>Biblioteca</span>
      </NuxtLink>
      <NuxtLink to="/order_simulators" class="nav-item" active-class="active">
        <i class="ri-rocket-line"></i>
        <span>Online</span>
      </NuxtLink>
      <NuxtLink to="/downloads" class="nav-item" active-class="active">
        <i class="ri-download-2-line"></i>
        <span>Descargas</span>
      </NuxtLink>
      <NuxtLink to="/registro_simuladores" class="nav-item" active-class="active">
        <i class="ri-edit-box-line"></i>
        <span>Nuevo Simulador</span>
      </NuxtLink>
    </nav>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)

onMounted(() => {
  // Detecta si el ancho de pantalla es menor a 992px (móvil)
  isMobile.value = window.innerWidth < 992

  // También actualiza si redimensionan la pantalla
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 992
  })
})
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #002147; /* Azul UNEFA */
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 2px solid #ffc72c; /* Amarillo UNEFA */
  z-index: 1200;
}

.nav-item {
  flex-grow: 1;
  text-align: center;
  color: #fff; /* Blanco */
  text-decoration: none;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.nav-item i {
  font-size: 20px;
}

.nav-item span {
  font-size: 11px;
  margin-top: 2px;
}

.nav-item.active {
  color: #ffc72c; /* Amarillo UNEFA */
}

.nav-item:active,
.nav-item:focus,
.nav-item:hover {
  color: #ffc72c; /* Amarillo UNEFA al interactuar */
}
</style>
