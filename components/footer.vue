<template>
  <footer class="unefa-footer unefa-primary-bg text-white py-5 ">
    <div class="container text-center">
      <h5 class="mb-4 fw-bold text-uppercase unefa-accent-text">UNEFA - Extensión Zaraza</h5>
      <div class="d-flex justify-content-center gap-4 flex-wrap mb-4">
        <NuxtLink to="/registro_simuladores" class="footer-link">
          <i class="bi bi-plus-circle me-1"></i> Agrega un Simulador Nuevo
        </NuxtLink>
        <NuxtLink to="/order_simulators" class="footer-link">
          <i class="bi bi-cpu me-1"></i> Simuladores Online
        </NuxtLink>
      </div>
      <p class="small mb-0 text-white-50">© 2025 - Vicente Machina. Todos los derechos
        reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: #ffffffcc;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
}
.footer-link:hover {
  color: #FFC72C;
  transform: translateY(-2px);
}
.unefa-accent-text {
  color: #FFC72C;
}
</style>
