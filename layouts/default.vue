<template>
  <div class="contenedor">
    <Menu />
    <main class="contenido">
      <slot />
    </main>
    <BottomMenu />
    <Footer />  
  </div>
</template>

<style>
.contenedor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;

}
.contenido {
  flex: 1;
}

@media (max-width: 991.98px) {
  .contenedor {
    padding-bottom: 20px;
  }
}
</style>
