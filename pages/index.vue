<template>
  <ClientOnly>
    <section class="py-xl-8 py-6 unefa-primary-bg text-white">
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
                    <strong>MachinaLab Finder. </strong>Es una plataforma innovadora diseñada para facilitar la búsqueda
                    y acceso a simuladores virtuales de laboratorios. Inspirada en la necesidad de optimizar la
                    formación práctica en entornos educativos, esta herramienta permite a estudiantes y docentes
                    encontrar de manera rápida y sencilla recursos digitales que complementan el aprendizaje teórico.
                  </p>
                </div>
              </div>

              <div class="d-grid d-md-flex flex-row gap-2 mb-5">
                <NuxtLink to="/order_simulators" class="btn btn-unefa btn-lg">
                  Comenzar
                </NuxtLink>
                <button class="btn btn-outline-unefa btn-lg" data-bs-toggle="modal" data-bs-target="#helpModal">
                  ¿Cómo usar?
                </button>
              </div>
            </div>
          </div>

          <!-- Panel lateral con features -->
          <div class="col-xxl-6 offset-xxl-1 col-lg-7 col-12">
            <div class="row gx-4 gy-4">
              <div v-for="(feature, index) in features" :key="index" class="col-12 col-md-6">
                <div class="feature-card glass-card d-flex flex-column align-items-center text-center p-4 rounded h-100">
                  <div class="feature-icon-wrap mb-3">
                    <i :class="feature.icon" class="feature-icon" aria-hidden="true"></i>
                  </div>
                  <h5 class="feature-title mb-1">{{ feature.title }}</h5>
                  <p class="feature-desc mb-0">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal  "¿Cómo usar?" -->
      <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 glass-card">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="helpModalLabel">¿Cómo usar MachinaLab Finder?</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-dark">
              <ul class="list-unstyled mb-3">
                <li class="mb-2"><i class="bi bi-play-circle text-unefa-accent me-2"></i>Haz clic en <b>Comenzar</b> para explorar los simuladores online.</li>
                <li class="mb-2"><i class="bi bi-search text-unefa-accent me-2"></i>Utiliza el buscador para encontrar simuladores por nombre o materia.</li>
                <li class="mb-2"><i class="bi bi-download text-unefa-accent me-2"></i>Descarga recursos y guías desde la sección correspondiente.</li>
              </ul>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-unefa" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

    </section>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue'

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
  min-height: 100vh;
  background: linear-gradient(120deg, #002147 70%, #003366 100%);
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
  border: 2px solid #ffc72c;
  color: #ffc72c;
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-unefa:hover {
  background-color: #ffc72c;
  color: #002147;
  border-color: #ffc72c;
  transform: translateY(-2px);
  cursor: pointer;
}

.feature-card {
  background-color: rgba(255, 199, 44, 0.10);
  border-radius: 1rem;
  transition: all 0.3s ease;
  cursor: default;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  word-break: break-word;
  box-shadow: 0 2px 8px 0 rgba(0, 33, 71, 0.07);
  position: relative;
}

.feature-card:hover {
  background-color: rgba(255, 199, 44, 0.18);
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.18);
  transform: translateY(-6px) scale(1.04);
}

.glass-card {
  background: rgba(255,255,255,0.13) !important;
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  border: 1px solid rgba(255,255,255,0.18);
}



.feature-icon {
  font-size: 2.8rem;
  color: #ffc72c;
  transition: color 0.3s ease;
}

.feature-title {
  color: #ffc72c;
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: #fff;
  font-weight: 400;
  font-size: 0.98rem;
  max-width: 260px;
  margin: 0 auto;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
}

@media (max-width: 575.98px) {
  .feature-card {
    padding: 1rem 0.5rem !important;
    min-width: 0;
    max-width: 100%;
  }
  .feature-desc {
    font-size: 0.98rem;
    max-width: 100%;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    text-align: center;
  }
}

.modal-content.glass-card {
  background: rgba(255,255,255,0.93) !important;
  color: #002147;
}

.modal-header, .modal-footer {
  border: none !important;
  background: transparent !important;
}

.alert-info {
  background: rgba(255, 199, 44, 0.13);
  color: #002147;
  border: none;
}

.list-unstyled li i {
  vertical-align: middle;
}

@media (max-width: 767px) {
  .display-2 {
    font-size: 2rem;
  }
  .feature-icon-wrap {
    padding: 0.7rem;
  }
}
</style>
