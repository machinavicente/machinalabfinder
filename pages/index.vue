<template>
  <ClientOnly>
    <section class="py-xl-8 py-6 unefa-primary-bg text-white">
      <div class="container py-5">
        <div class="row align-items-center gy-6 gy-xl-0">
          <!-- Texto principal y botones -->
          <div class="col-lg-5 col-xxl-5 col-12">
            <div class="d-flex flex-column gap-5">
              <div class="d-flex flex-row gap-2 align-items-center">
                <i class="bi bi-rocket-fill fs-4 text-unefa-accent"></i>
                <span class="text-unefa-accent fw-semibold">
                  Potencia tu aprendizaje en la UNEFA - Extensión Zaraza
                </span>
              </div>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex flex-column gap-2">
                  <h1 class="mb-0 display-2 fw-bolder">
                    MachinaLab Finder
                  </h1>
                  <p class="mb-0 presentation-text">
                    <strong class="text-unefa-accent">MachinaLab Finder</strong> es la plataforma innovadora para acceder a simuladores de laboratorios. 
                    <span class="d-block mt-2">Crea tu cuenta para personalizar tu experiencia o <strong>úsala como invitado</strong> para explorar los recursos disponibles.</span>
                  </p>
                </div>
              </div>
              <div class="d-grid d-md-flex flex-row gap-2 mb-5">
                <NuxtLink to="/order_simulators" class="btn btn-unefa btn-lg">
                  <i class="bi bi-play-fill me-2"></i>Comenzar
                </NuxtLink>
                <NuxtLink to="/register" class="btn btn-unefa-outline btn-lg">
                  <i class="bi bi-person-plus me-2"></i>Crear cuenta
                </NuxtLink>
                <button class="btn btn-outline-unefa btn-lg" data-bs-toggle="modal" data-bs-target="#helpModal">
                  <i class="bi bi-question-circle me-2"></i>¿Cómo usar?
                </button>
              </div>
              <div class="alert alert-info border-0 glass-card p-3">
                <i class="bi bi-info-circle-fill text-unefa-accent me-2"></i>
                <strong>¿Sabías que?</strong> Con una cuenta puedes guardar tus simuladores favoritos y crear tu <strong>Laboratorio Personal.</strong>
              </div>
            </div>
          </div>
          
          <!-- Panel lateral de features -->
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
      
      <!-- Modal "¿Cómo usar?" -->
      <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 glass-card">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="helpModalLabel">¿Cómo usar MachinaLab Finder?</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-dark">
              <ul class="list-unstyled mb-3">
                <li class="mb-3 d-flex align-items-start">
                  <i class="bi bi-play-circle text-unefa-accent me-2 mt-1"></i>
                  <div>
                    <strong>Comenzar como invitado</strong> - Explora los simuladores sin necesidad de cuenta
                  </div>
                </li>
                <li class="mb-3 d-flex align-items-start">
                  <i class="bi bi-person-plus text-unefa-accent me-2 mt-1"></i>
                  <div>
                    <strong>Crear cuenta</strong> - Desbloquea funciones avanzadas como favoritos y progreso personalizado
                  </div>
                </li>
                <li class="mb-3 d-flex align-items-start">
                  <i class="bi bi-search text-unefa-accent me-2 mt-1"></i>
                  <div>
                    <strong>Buscar simuladores</strong> - Encuentra recursos por nombre o materia
                  </div>
                </li>
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
const features = [
  {
    icon: 'bi bi-laptop',
    title: 'Acceso multiplataforma',
    description: 'Disponible en cualquier dispositivo, con o sin cuenta',
  },
  {
    icon: 'bi bi-bookmark-star',
    title: 'Experiencia personalizada',
    description: 'Guarda favoritos y sigue tu progreso al crear una cuenta',
  },
  {
    icon: 'bi bi-code-square',
    title: 'Entornos interactivos',
    description: 'Practica con simuladores de programación en tiempo real',
  },
]
</script>

<style scoped>
.unefa-primary-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #002147 70%, #003366 100%);
  display: flex;
  align-items: center;
}

.presentation-text {
  text-align: justify;
  font-size: 1.1rem;
  line-height: 1.6;
}

.text-unefa-accent {
  color: #ffc72c;
}

.btn-unefa {
  background-color: #c8102e;
  color: white;
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-unefa:hover {
  background-color: #a00d26;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-unefa-outline {
  border: 2px solid #ffc72c;
  color: #ffc72c;
  background: transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-unefa-outline:hover {
  background-color: rgba(255, 199, 44, 0.1);
  color: #ffc72c;
  transform: translateY(-2px);
}

.btn-outline-unefa {
  border: 2px solid white;
  color: white;
  background: transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-outline-unefa:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
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

.modal-content.glass-card {
  background: #fff !important;
  color: #222;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 1px solid #eee;
}

.feature-icon {
  font-size: 2.5rem;
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
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  font-size: 0.98rem;
  max-width: 260px;
  margin: 0 auto;
}

.alert-info {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white;
  border-left: 3px solid #ffc72c;
}

@media (max-width: 991.98px) {
  /* Ajusta el orden para que los botones queden arriba y no interfieran con las cards */
  .d-grid.d-md-flex.flex-row.gap-2.mb-5 {
    flex-direction: column !important;
    gap: 0.5rem !important;
    margin-bottom: 2rem !important;
  }
  .btn-unefa, .btn-unefa-outline, .btn-outline-unefa {
    width: 100%;
    margin-bottom: 0.5rem;
    justify-content: center;
  }
  .col-xxl-6.offset-xxl-1.col-lg-7.col-12 {
    margin-top: 2rem;
  }
}

@media (max-width: 1200px) and (min-width: 768px) {
  .d-grid.d-md-flex.flex-row.gap-2.mb-5 {
    flex-direction: column !important;
    gap: 0.5rem !important;
    margin-bottom: 2rem !important;
  }
  .btn-unefa, .btn-unefa-outline, .btn-outline-unefa {
    width: 100%;
    margin-bottom: 0.5rem;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .display-2 {
    font-size: 2.2rem;
  }
  .btn-lg {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  .presentation-text {
    font-size: 1rem;
  }
  .d-grid.d-md-flex.flex-row.gap-2.mb-5 {
    margin-bottom: 1.5rem !important;
  }
}

@media (max-width: 575.98px) {
  .feature-card {
    padding: 1.5rem 1rem !important;
  }
  .btn-unefa, .btn-unefa-outline, .btn-outline-unefa {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .d-grid.d-md-flex.flex-row.gap-2.mb-5 {
    gap: 0.5rem !important;
    margin-bottom: 1rem !important;
  }
}
</style>