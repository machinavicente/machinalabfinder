<template>
  <div class="layout-wrapper">
    <nav class="navbar navbar-expand-lg navbar-dark" aria-label="Main navbar">
      <div class="container-fluid">
        <!-- Botón hamburguesa (pantallas pequeñas) -->
        <div class="mobile-toggle-container">
          <button
            class="navbar-toggler"
            type="button"
            @click="toggleMenu"
            :aria-expanded="menuOpen.toString()"
            aria-label="Toggle navigation"
            ref="burgerButton"
          >
            <span class="navbar-toggler-icon red-toggler"></span>
          </button>
        </div>

        <!-- Menú lateral (pantallas pequeñas) -->
        <div
          class="navbar-collapse justify-content-md-center collapse"
          :class="{ show: menuOpen }"
          id="navbarsExample10"
          ref="menuRef"
        >
          <ul class="navbar-nav">
            <li class="nav-item d-none d-lg-block desktop-logo-name">
              <!-- Logo solo visible en pantallas grandes -->
              <img src="/logo.png" alt="Logo" class="navbar-logo" />
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/">Inicio</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/dashboard">Dashboard</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/order_simulators">Simuladores Disponibles</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/registro_simuladores">Expande la colección</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Overlay -->
        <div v-if="menuOpen" class="overlay" @click="closeMenu" aria-hidden="true"></div>
      </div>
    </nav>

    <!-- Contenido principal con compensación -->
    <div class="main-content">
      <slot /> <!-- Aquí se inyecta el contenido de la página -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const menuOpen = ref(false)
const menuRef = ref(null)
const burgerButton = ref(null)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleClickOutside = (event) => {
  if (
    menuOpen.value &&
    menuRef.value &&
    burgerButton.value &&
    !menuRef.value.contains(event.target) &&
    !burgerButton.value.contains(event.target)
  ) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background-color: #002147;
  border-bottom: 1px solid #ffc72c;
  position: relative;
  z-index: 1100;
}

a, .nav-link {
  color: #fff;
}

a:hover, .nav-link:hover {
  color: #fff;
}

.mobile-toggle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background-color: #002147;
  z-index: 1110;
  display: flex;
  align-items: center;
  padding-left: 15px;
  border-bottom: 1px solid #ffc72c;
}

.red-toggler {
  filter: invert(26%) sepia(89%) saturate(7456%) hue-rotate(358deg) brightness(101%) contrast(118%);
}

/* Compensar la altura fija del menú en el contenido */
.main-content {
  padding-top: 56px;
}

/* Pantallas grandes */
@media (min-width: 992px) {
  .mobile-toggle-container {
    display: none;
  }

  .navbar-nav {
    flex-direction: row;
  }

  .nav-item {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }

  .desktop-logo-name {
    display: flex !important;
    align-items: center;
  }

  .navbar-logo {
    height: 50px;
  }
}

/* Pantallas pequeñas */
@media (max-width: 991.98px) {
  .navbar-collapse {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 250px;
    padding: 20px;
    background-color: #002147;
    border-right: 1px solid #ffc72c;
    z-index: 1101;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .navbar-collapse.show {
    transform: translateX(0);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .navbar-nav {
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }

  .nav-item {
    display: block;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .nav-link {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .desktop-logo-name {
    display: none !important;
  }

  .overlay {
    position: fixed;
    top: 56px;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1100;
    transition: opacity 0.3s ease;
  }
}
</style>
