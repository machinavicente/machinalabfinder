<template>
  <ClientOnly>
    <nav v-if="isMobile" class="bottom-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <i class="ri-home-line"></i>
        <span>Inicio</span>
      </NuxtLink>
      <NuxtLink to="/dashboard" class="nav-item" active-class="active">
        <i class="ri-dashboard-line"></i>
        <span>Panel</span>
      </NuxtLink>
      <NuxtLink to="/guides" class="nav-item" active-class="active">
        <i class="ri-book-open-line"></i>
        <span>Guías</span>
      </NuxtLink>
      <NuxtLink to="/order_simulators" class="nav-item" active-class="active">
        <i class="bi bi-cpu"></i>
        <span>Online Sim</span>
      </NuxtLink>
      <NuxtLink to="/downloads" class="nav-item" active-class="active">
        <i class="ri-download-2-line"></i>
        <span>Descargas</span>
      </NuxtLink>
      <NuxtLink to="/info_simuladores" class="nav-item" active-class="active">
        <i class="bi bi-info-square"></i>
        <span>Info</span>
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
  height: 64px;
  background-color: #002147;
  /* Azul UNEFA */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid #ffc72c;
  /* Amarillo UNEFA */
  z-index: 1200;
  padding: 0 4px;
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
  font-size: 11px;
  margin-top: 0;
  line-height: 1.1;
  max-width: 80px;
  overflow-wrap: break-word;
  display: block;
  white-space: normal;
  /* Permite saltos de línea */
  word-break: break-word;
  /* Rompe palabras largas si es necesario */
}

@media (max-width: 400px) {
  .nav-item {
    padding: 0 1px;
  }

  .nav-item span {
    font-size: 9.5px;
    max-width: 48px;
    white-space: normal;
    word-break: break-word;
    text-align: center;
    line-height: 1.15;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Máximo 2 líneas */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@media (max-width: 340px) {
  .nav-item span {
    font-size: 8.5px;
    max-width: 40px;
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
</style>
