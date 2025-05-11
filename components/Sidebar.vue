<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar fijo -->
      <div class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse" style="min-height: 100vh; position: fixed;">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <nuxt-link class="nav-link active text-white" to="/">
                Inicio
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link text-white" to="/dashboard">
                Dashboard
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link text-white" to="/example">
                Ejemplo
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contenido principal -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4" style="margin-left: 16.666667%;">
        <nuxt />
      </main>
    </div>
  </div>
</template>

<style>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.nav-link {
  border-radius: 0;
  padding: 10px 15px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>