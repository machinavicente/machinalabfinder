<template>
  <ClientOnly>
    <section class="py-xl-8 py-6 unefa-primary-bg text-white content">
      <div class="container py-5">
        <div class="row align-items-center gy-6 gy-xl-0">
          <!-- Texto principal y botones -->
          <div class="col-lg-5 col-xxl-5 col-12">
            <div class="d-flex flex-column gap-5">
              <div class="d-flex flex-row gap-2 align-items-center">
                <i class="bi bi-rocket-fill fs-4"></i>
                <span class="text-unefa-accent fw-semibold">
                  Potencia tu aprendizaje en la UNEFA - Extensión Zaraza
                </span>
              </div>

              <div class="d-flex flex-column gap-3">
                <div class="d-flex flex-column gap-2">
                  <h1 class="mb-0 display-2 fw-bolder">
                    MachinaLab Finder
                  </h1>
                  <p class="mb-0">
                    <strong>MachinaLab Finder. </strong>Es una plataforma innovadora diseñada para facilitar la búsqueda y acceso a simuladores virtuales de laboratorios. Inspirada en la necesidad de optimizar la formación práctica en entornos educativos, esta herramienta permite a estudiantes y docentes encontrar de manera rápida y sencilla recursos digitales que complementan el aprendizaje teórico.
                  </p>
                </div>
              </div>

              <div class="d-grid d-md-flex flex-row gap-2 mb-5">
                <NuxtLink to="/order_simulators" class="btn btn-unefa btn-lg">
                  Comenzar
                </NuxtLink>
                <button class="btn btn-outline-unefa btn-lg" @click="toggleHelp" :aria-expanded="showHelp.toString()" aria-controls="helpPanel">
                  ¿Cómo usar?
                </button>
              </div>
            </div>
          </div>

          <!-- Imagen o panel lateral con info -->
          <div class="col-xxl-6 offset-xxl-1 col-lg-7 col-12">
            <transition name="fade">
              <div
                v-if="showHelp"
                id="helpPanel"
                class="info-panel p-4 rounded bg-light text-dark mb-5"
                style="max-width: 700px;"
                role="region"
                aria-live="polite"
              >
                <p>
                  Para iniciar, presiona el botón <strong>Comenzar</strong> y accede a la colección
                  de simuladores virtuales disponibles. Explora, practica y potencia tu aprendizaje.
                </p>
                <p>
                  Explora simuladores y guías diseñados para ayudarte a
                  maximizar tu experiencia en la UNEFA Zaraza.
                </p>
                <button class="btn btn-sm btn-unefa mt-3" @click="showHelp = false">
                  Cerrar
                </button>
              </div>
            </transition>

            <div class="row gx-4 gy-4">
              <div
                v-for="(feature, index) in features"
                :key="index"
                class="col-6 col-md-6"
              >
                <div class="feature-card d-flex flex-column align-items-center text-center p-4 rounded">
                  <i :class="feature.icon" class="feature-icon mb-3" aria-hidden="true"></i>
                  <h5 class="feature-title mb-1">{{ feature.title }}</h5>
                  <p class="feature-desc mb-0">{{ feature.description }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue'

const showHelp = ref(false)
const toggleHelp = () => {
  showHelp.value = !showHelp.value
}

// Datos para las características
const features = [
  {
    icon: 'bi bi-laptop',
    title: 'Acceso multiplataforma',
    description: 'Utiliza la plataforma desde cualquier dispositivo, sin importar donde estés.',
  },
  {
    icon: 'bi bi-book',
    title: 'Material didáctico',
    description: 'Guías y recursos diseñados para facilitar tu aprendizaje práctico.',
  },
  {
    icon: 'bi bi-code-square',
    title: 'Entornos de programación',
    description: 'Simuladores con compiladores y editores para practicar código en tiempo real.',
  },
]
</script>

<style scoped>
.unefa-primary-bg {
  padding-bottom: ;
  background-color: #002147;
}

.text-unefa-accent {
  color: #ffc72c;
}

.btn-unefa {
  background-color: #c8102e;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-unefa:hover {
  background-color: #a00d26;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-outline-unefa {
  border: 2px solid white;
  color: white;
  transition: all 0.3s ease;
}

.btn-outline-unefa:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  cursor: pointer;
}

.info-panel {
  border-left: 5px solid #ffc72c;
  box-shadow: 0 0 15px rgba(255, 199, 44, 0.6);
  font-size: 1rem;
  line-height: 1.5;
  color: #000;
}

.feature-card {
  background-color: rgba(255, 199, 44, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: default;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-card:hover {
  background-color: rgba(255, 199, 44, 0.3);
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.5);
  transform: translateY(-6px) scale(1.05);
}

.feature-icon {
  font-size: 4rem;
  color: #ffc72c;
  transition: color 0.3s ease;
}

.feature-title {
  color: #ffc72c;
  font-weight: 700;
  font-size: 1.25rem;
}

.feature-desc {
  color: #fff;
  font-weight: 400;
  font-size: 0.9rem;
  max-width: 220px;
  margin: 0 auto;
}

/* Animación fade para el panel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
