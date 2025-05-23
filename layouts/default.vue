<template>
    <div class="contenedor">
        <Menu />
        <slot></slot>
        <Footer />
    </div>
</template>

<style>
.contenedor {   
    padding-top: 10em;
    width: 100%;
    min-height: 100vh;
}
</style>
