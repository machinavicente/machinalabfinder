<template>
  <div class="layout-wrapper">
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark" aria-label="Main navbar">
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
          @click.stop
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/" @click="closeMenu">Inicio</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/dashboard" @click="closeMenu">Dashboard</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/order_simulators" @click="closeMenu">Simuladores Disponibles</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/registro_simuladores" @click="closeMenu">Expande la colección</NuxtLink>
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
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  background-color: #002147;
  border-bottom: 1px solid #ffc72c;
}

a, .nav-link {
  color: #fff;
}

a:hover, .nav-link:hover {
  color: #fff;
}

/* Barra horizontal que ocupa todo el ancho y contiene el botón burger */
.mobile-toggle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* ancho total horizontal */
  height: 56px;
  background-color: #002147; /* fondo barra completo */
  z-index: 1115; /* sobre overlay y menú */
  display: flex;
  align-items: center;
  padding-left: 12px; /* espacio a la izquierda */
  border-bottom: 1px solid #ffc72c;
  box-sizing: border-box;
}

/* Botón burger estilo */
.mobile-toggle-container button.navbar-toggler {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icono burger personalizado */
.red-toggler {
  filter: invert(26%) sepia(89%) saturate(7456%) hue-rotate(358deg) brightness(101%) contrast(118%);
  width: 24px;
  height: 24px;
}

/* Contenido principal con compensación */
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

  .navbar-logo {
    height: 50px;
  }
}

/* Pantallas pequeñas */
@media (max-width: 991.98px) {
  /* Menú lateral con fondo y no ocupa todo el ancho */
  .navbar-collapse {
    position: fixed;
    top: 56px; /* justo debajo del burger */
    left: 0;
    width: 280px; /* ancho fijo para el menú lateral */
    height: calc(100vh - 56px);
    padding: 20px;
    background-color: rgba(0, 33, 71, 0.95); /* fondo oscuro con opacidad */
    z-index: 1110; /* menos que burger para que botón esté encima */
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
    border-right: 1px solid #ffc72c;
    border-radius: 0 8px 8px 0;
  }

  .navbar-collapse.show {
    transform: translateX(0);
  }

  .navbar-nav {
    flex-direction: column;
    height: 100%;
  }

  .nav-item {
    display: block;
    margin-bottom: 15px;
  }

  .nav-link {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .desktop-logo-name {
    display: none !important;
  }

  /* Overlay ocupa toda la pantalla menos la parte del burger */
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
