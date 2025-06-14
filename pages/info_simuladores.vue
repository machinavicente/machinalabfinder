<template>
  <div class="container-fluid py-5">
    <div class="desktop-system-bg rounded-4 p-4">
      <div class="row mb-4">
        <div class="col-12 d-flex align-items-center gap-3">
          <i class="ri-flask-line display-5 text-unefa"></i>
          <div>
            <h1 class="fw-bold text-unefa mb-1">Simuladores de Laboratorio</h1>
            <p class="lead text-muted mb-0">
              Descubre qué son, cómo acceder a ellos y encuentra recursos útiles para potenciar tu aprendizaje.
            </p>
          </div>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <!-- ¿Qué es un simulador online? -->
        <div class="col d-flex">
          <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Simulador Online</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body d-flex flex-column definition-card">
              <div class="d-flex align-items-center mb-3">
                <i class="ri-global-line fs-1 text-primary me-3"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  ¿Qué es un simulador online?
                </h5>
              </div>
              <p class="small text-muted flex-grow-1 definition-text">
                <strong class="definition-title">Definición:</strong><br>
                Un simulador online es una herramienta digital que permite emular procesos, entornos o dispositivos
                reales (como laboratorios, redes, circuitos o lenguajes de programación) sin necesidad de instalación,
                accesible desde un navegador web.
              </p>
              <strong class="small">Ejemplos:</strong>
              <ul class="small text-muted mb-3 ps-3">
                <li>Compiladores de código online <span class="text-primary">(Programiz, OneCompiler)</span>.</li>
                <li>Diagramadores <a href='https://www.smartdraw.com/flowchart/diagramas-de-flujo.htm?srsltid=AfmBOor6puoq-bGZbvl2G8a77DInJWUs6ae792r4NfNe-HvMPQHumiL7' target="_blank" class="text-primary">(SmartDraw - Diagramas)</a>.</li>
                <li>Bases de datos <a  href='https://onecompiler.com/postgresql' target="_blank" class="text-primary">(Online PostgreSQL Editor)</a>.</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Tarjeta grande para el simulador embebido -->
        <div class="col-12 d-flex">
          <div class="ultimo-simulador-card embed card shadow-sm w-100" style="min-height:420px;">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Ejemplo de un Simulador Online</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body">
              <section>
                <h5 class="mb-3"><i class="ri-terminal-box-line text-primary me-2"></i>1. Compilador de Python</h5>
                <ClientOnly>
                  <iframe src="https://onecompiler.com/python" width="100%" height="350px" frameborder="0"
                    style="border-radius: 8px; background: #f8fafc;"></iframe>
                </ClientOnly>
              </section>
            </div>
          </div>
        </div>
        <!-- ¿Por qué usar simuladores online? -->
        <div class="col d-flex">
          <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Ventajas de un Simulador Online</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-cpu fs-1 text-success me-3"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  ¿Por qué usar simuladores online?
                </h5>
              </div>
              <ul class="mb-0 ps-3 small">
                <li><strong>Accesibilidad:</strong> Funcionan en cualquier dispositivo con internet.</li>
                <li><strong>Ahorro de recursos:</strong> No requieren instalación ni hardware potente.</li>
                <li><strong>Aprendizaje interactivo:</strong> Permiten experimentar sin riesgos (ej.: probar código
                  sin romper un sistema real).</li>
                <li><strong>Disponibilidad inmediata:</strong> Acceso 24/7 desde cualquier lugar.</li>
                <li><strong>Variedad de recursos:</strong> Existen simuladores para diferentes áreas y niveles educativos.</li>
                <li><strong>Práctica ilimitada:</strong> Puedes repetir ejercicios y experimentos tantas veces como desees.</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- ¿Cómo buscar simuladores en esta plataforma? -->
        <div class="col d-flex">
          <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Buscar Simuladores</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <i class="ri-search-line fs-1 text-info me-3"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  ¿Cómo buscar simuladores en esta plataforma?
                </h5>
              </div>
              <ul class="mb-0 ps-3 small">
                <li>Usa el buscador por palabras clave (ej.: <em>Python</em>, <em>redes</em>, <em>SQL</em>).</li>
                <li>Filtra por categorías (programación, física, redes, etc.).</li>
                <li>Explora las guías relacionadas (ej.: <em>Tablas de verdad</em>, <em>Modelo OSI</em>).</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- ¿Y los simuladores descargables? -->
        <div class="col d-flex">
          <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Descargables</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <i class="ri-download-2-line fs-1 text-danger me-3"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  ¿Y los simuladores descargables?
                </h5>
              </div>
              <ul class="small mb-0 ps-3 text-muted">
                <li>Algunos recursos (como <span class="text-success">Packet Tracer</span> o <span
                    class="text-success">MySQL</span>) requieren descarga.</li>
                <li>unicamente disponibles descargas directas y enlaces oficiales.</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- ¿Cómo agregar un nuevo simulador online? -->
        <div class="col d-flex">
          <div class="ultimo-simulador-card card shadow-sm h-100 flex-fill">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge text-dark">Agregar Simulador</span>
              <div class="win-window-controls ms-auto d-flex">
                <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                <span class="win-btn win-close"><i class="bi bi-x"></i></span>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <i class="ri-add-circle-line fs-1 text-secondary me-3"></i>
                <h5 class="profesional-title text-unefa-dark mb-0">
                  ¿Cómo agregar un nuevo simulador online?
                </h5>
              </div>
              <ul class="mb-0 ps-3 small">
                <li>Solo puedes sugerir simuladores web.</li>
                <li>Completa el formulario</li>
                <li>¡Aporta recursos útiles para la comunidad!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.definition-text {
  text-align: justify;
  font-size: 1.1em;
  line-height: 1.5;
}
.definition-title {
  text-decoration: underline;
}
.text-unefa {
  color: #002147 !important;
}

.badge {
  font-weight: 900;
}

.desktop-system-bg {
  box-shadow: 0 8px 32px 0 rgba(0, 33, 71, 0.07);
  border-radius: 1.5rem;
  min-height: 80vh;
  border: 1.5px solid #e4e9f2;
}

.ultimo-simulador-card {
  border-radius: 4px em !important;
  background: #fff;
  border: 1.5px solid #dbeafe;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ultimo-simulador-card:hover:not(.embed) {
  box-shadow: 0 8px 32px 0 rgba(0, 33, 71, 0.13);
  background: #f6fafd;
  transform: translateY(-2px) scale(1.01);
}

.ultimo-simulador-card .card-header {
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid #e4e9f2;
  min-height: 38px;
}

.win-window-controls {
  margin-left: auto;
  display: flex;
  gap: 0.4rem;
}

.win-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  color: #444;
  transition: background-color 0.2s, color 0.2s;
}

.win-btn:hover {
  background-color: #0078d7;
  color: white;
}

.win-minimize:hover {
  background-color: #999;
  color: white;
}

.win-maximize:hover {
  background-color: #0078d7;
  color: white;
}

.win-close:hover {
  background-color: #e81123;
  color: white;
}

.card-body {
  background: transparent;
  border-radius: 0.7rem;
  padding: 1.5rem 1.3rem 1.5rem 1.3rem;
  /* Más padding para mejor lectura */
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.icon-square {
  width: 44px;
  height: 44px;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
a{
  text-decoration: none;
}

@media (max-width: 991.98px) {
  .desktop-system-bg {
    padding: 1rem !important;
    border-radius: 1rem;
  }

  .ultimo-simulador-card {
    min-height: unset;
  }

  .card-body {
    padding: 1.1rem 0.8rem 1.1rem 0.8rem;
  }
}
</style>