<template>
  <div class="contenedor">
    <Menu />
    <main class="contenido">
      <slot />
    </main>
    <Footer />
    <BottomMenu />
  </div>
</template>

<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 60px; /* altura del BottomMenu */
  box-sizing: border-box;
}

.contenido {
  flex: 1;
}

/* Estilos del BottomMenu */
:deep(.bottom-menu) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  z-index: 1000;
  border-top: 1px solid #ccc;
}
</style>
