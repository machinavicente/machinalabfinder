<template>
  <div class="contenedor">
    <Menu />
    <div class="main">
      <slot></slot>
    </div>
    <slot></slot>
    <BottomMenu />
    <Footer />  
  </div>
</template>

<style>
.contenedor {
  display: flex;
  flex-direction: column;
}

.main{
  height: 100vh;
}
@media (max-width: 991.98px) {
  .contenedor {
    padding-bottom: 20px;
  }
  footer{
    height: ;
  }
}
</style>
