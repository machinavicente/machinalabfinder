<template>
  <nav class="navbar navbar-expand-lg navbar-dark" aria-label="Twelfth navbar example">
    <div class="container-fluid">
      <!-- Botón hamburguesa a la izquierda -->
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        :aria-expanded="menuOpen.toString()"
        aria-label="Toggle navigation"
        ref="burgerButton"
      >
        <span class="navbar-toggler-icon text-danger"></span>
      </button>

      <!-- Logo visible solo en móviles -->

      <div
        class="navbar-collapse justify-content-md-center collapse"
        :class="{ show: menuOpen }"
        id="navbarsExample10"
        ref="menuRef"
      >
        <ul class="navbar-nav">
          <!-- Logo visible solo en desktop (oculto en responsive) -->
          <li class="nav-item d-none d-lg-block desktop-logo-name">
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/dashboard">Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/order_simulators" tabindex="-1" aria-disabled="true"
              >Simuladores Disponibles</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/registro_simuladores" tabindex="-1" aria-disabled="true"
              >Expande la colección</a
            >
          </li>
        </ul>
      </div>

      <!-- Overlay para cerrar menú al hacer click fuera -->
      <div
        v-if="menuOpen"
        class="overlay"
        @click="closeMenu"
        aria-hidden="true"
      ></div>
    </div>
  </nav>
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

a {
  color: #fff;
}

a:hover {
  color: #fff;
}

/* Estilos para pantallas grandes (horizontal) */
@media (min-width: 992px) {
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

  /* Mostrar logo + nombre desktop */
  .desktop-logo-name {
    display: flex !important;
  }
}

/* Estilos para pantallas pequeñas (menú lateral izquierdo) */
@media (max-width: 991.98px) {
  .navbar-collapse {
    position: fixed;
    top: 0;
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
  }

  .navbar-nav {
    flex-direction: column;
    height: 100%;
    padding-top: 60px; /* Espacio para el logo móvil */
  }

  .nav-item {
    display: block;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .nav-link {
    padding: 0.8rem 1rem;
    display: block;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Ocultar logo + nombre desktop en responsive */
  .desktop-logo-name {
    display: none !important;
  }

  /* Logo en móviles */
  .mobile-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
  }

  /* Botón de toggle a la izquierda y fijo */
  .navbar-toggler {
    position: fixed; /* fijo para que no desaparezca al hacer scroll */
    top: 15px;
    left: 15px; /* cambiado de right a left */
    z-index: 1110;
  }

  /* Overlay para el fondo cuando el menú está abierto */
  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 250px; /* deja espacio para el menú a la izquierda */
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1100;
  }
}
</style>
