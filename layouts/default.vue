<template>
  <div class="contenedor">
    <Menu />
    <slot></slot>
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


@media (max-width: 991.98px) {
  .contenedor {
    padding-bottom: 20px;
  }
  footer{
    height: ;
  }
}
</style>
