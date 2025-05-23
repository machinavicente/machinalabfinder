<template>
    <div class="contenedor">
        <Header />
        <slot></slot>
        <Footer />
    </div>
</template>

<style>
.contenedor {   
    width: 100%;
    min-height: 100vh;
}
</style>
