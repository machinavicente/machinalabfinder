<template>
  <div class="layout-wrapper">
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark" aria-label="Main navbar">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/">
              <i class="ri-home-line"></i>
              Inicio
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/dashboard">
              <i class="ri-dashboard-line"></i>
              Dashboard
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/guides">
              <i class="ri-book-open-line"></i>
              Biblioteca
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/order_simulators">
              <i class="bi bi-cpu"></i>
              Simuladores Online
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/downloads">
              <i class="ri-download-2-line"></i>
              Simuladores Descargables
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/info_simuladores">
              <i class="bi bi-info-lg"></i>
              Info
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/registro_simuladores">
              <i class="ri-edit-box-line"></i>
              Expande la colección
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/userProfile">
              <i class="bi bi-person-badge"></i>
              Perfil de Usuario
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  background-color: #002147;
}

.navbar-nav {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 0.5rem;

}

a,
.nav-link {
  color: #fff;
}

a:hover,
.nav-link:hover {
  color: #fff;
}

.main-content {
  padding-top: 56px;
}

.nav-item:active,
.nav-item:focus,
.nav-item:hover {
  color: #ffc72c;
  /* Amarillo UNEFA al interactuar */
}

.nav-link.active {
  color: #ffc72c !important;
}

.nav-link.router-link-active,
.nav-link.router-link-active:focus,
.nav-link.router-link-active:hover {
  color: #ffc72c !important;
}

@media (max-width: 1100px) and (min-width: 992px) {
  .navbar-nav {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    white-space:nowrap;
    flex-wrap:wrap;
  }

  .nav-link {
    font-size: 0.93rem;
    padding: 0.5rem 0.7rem;
  }
}

/* Pantallas pequeñas */
@media (max-width: 991.98px) {
  .navbar-nav {
    display: none !important;
  }

  .navbar {
    min-height: 56px;
    height: 56px;
    background-color: #002147;
    display: flex !important;
    align-items: center;
  }
}
</style>
