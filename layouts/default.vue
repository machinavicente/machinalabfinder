<template>
  <div class="contenedor">
    <Menu />
    <main class="contenido">
      <slot />
    </main>
    <Footer />
    <BottomMenu class="bottom-menu" />
  </div>
</template>

<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
}

.contenido {
  flex: 1;
  padding: 1rem;
}

/* BottomMenu por defecto oculto */
:deep(.bottom-menu) {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  border-top: 1px solid #ccc;
  z-index: 1000;
}

/* Solo en móviles (hasta 768px) se muestra el BottomMenu y se reserva espacio */
@media (max-width: 768px) {
  .contenedor {
    padding-bottom: 60px; /* espacio para el BottomMenu */
  }

  :deep(.bottom-menu) {
    display: block;
  }
}
</style>
