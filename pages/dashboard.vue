<template>
  <ClientOnly>
    <div class="dashboard-container unefa-primary-bg text-white content">
      <!-- Header del Dashboard -->
      <header class="dashboard-header py-3 shadow-sm">
        <div class="container">
          <div class="row align-items-center text-center text-md-start">
            <!-- Logo + Título -->
            <div
              class="col-12 col-md-8 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0"
            >
              <img
                src="/assets/images/logo.png"
                alt="logo"
                width="50"
                height="70"
                class="dashboard-logo me-md-3 mb-2 mb-md-0"
              />
              <h1 class="ms-md-3 mt-3 mt-md-0 mb-0 dashboard-title">
                <span class="text-unefa-accent">Dashboard</span>
              </h1>
            </div>

            <!-- Fecha y hora -->
            <div class="col-12 col-md-4">
              <div class="current-time">
                <div class="date">
                  <i class="ri-calendar-todo-fill me-1"></i>{{ currentDate }}
                </div>
                <div class="time">
                  <i class="ri-time-line me-1"></i>{{ currentTime }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido principal del Dashboard -->
      <main class="dashboard-main">
        <div class="container">
          <!-- Sección de métricas -->
          <section class="metrics-section mb-5">
            <div class="row g-4">
              <!-- Total de Simuladores -->
              <div class="col-md-6 col-lg-3">
                <NuxtLink class="nav-link" to="/order_simulators">
                  <div class="metric-card glass-card h-100">
                    <div class="metric-icon">
                      <i class="bi bi-cpu"></i>
                    </div>
                    <div class="metric-content">
                      <h3>Total de Simuladores Online</h3>
                      <p class="metric-value">{{ totalSimuladores }}</p>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <!-- Simuladores descargables -->
              <div class="col-md-6 col-lg-3">
                <NuxtLink class="nav-link" to="/downloads">
                  <div class="metric-card glass-card h-100">
                    <div class="metric-icon">
                      <i class="bi bi-filetype-exe"></i>
                    </div>
                    <div class="metric-content">
                      <h3>Total de Simuladores Descargables</h3>
                      <p class="metric-value">{{ totalDescargables }}</p>
                    </div>
                  </div>
                </NuxtLink>
              </div>
              <!-- Asignaturas con Simuladores -->
              <div class="col-md-6 col-lg-3">
                <div class="metric-card glass-card h-100">
                  <div class="metric-icon">
                    <i class="bi bi-window-stack"></i>
                  </div>
                  <div class="metric-content">
                    <h3>Asignaturas con Simuladores</h3>
                    <p class="metric-value">
                      {{ asignaturasConSimuladores.length }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Promedio de Simuladores por Asignatura -->
              <div class="col-md-6 col-lg-3">
                <div
                  class="metric-card glass-card h-100 d-flex align-items-center"
                >
                  <div class="metric-icon">
                    <i class="bi bi-graph-up"></i>
                  </div>
                  <div class="metric-content">
                    <h3>Promedio de Simuladores<br />por Asignatura</h3>
                    <p class="metric-value">{{ promedio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección de los 3 simuladores más recientes -->
          <section class="ultimos-simuladores-section mb-5">
            <h2 class="section-title mb-4 d-flex align-items-center">
              <i class="bi bi-clock-history me-2 text-warning"></i>
              Últimos Simuladores Agregados
            </h2>

            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-2">
              <i class="bi bi-wifi-off fs-4"></i>
              <span>{{ error }}</span>
            </div>

            <div v-else class="row g-4">
              <div
                v-for="sim in ultimosSimuladores"
                :key="sim.id"
                class="col-md-4"
              >
                <div class="ultimo-simulador-card glass-card h-100">
                  <!-- Header: Contiene los badges de categoría -->
                  <div class="card-header d-flex gap-2">
                    <span class="badge bg-warning text-dark">Nuevo</span>
                    <span class="badge category-badge">{{
                      sim.categoria
                    }}</span>
                  </div>

                  <!-- Body: Contiene el título y descripción (parte variable) -->
                  <div class="card-body">
                    <h5 class="sim-title mb-2">
                      <i class="bi bi-terminal me-1"></i
                      >{{ sim.nombre_del_simulador }}
                    </h5>
                    <p class="small description-text">
                      {{ sim.descripcion_del_simulador }}
                    </p>
                  </div>

                  <!-- Footer: Contiene los elementos fijos (asignatura, botón y fecha) -->
                  <div class="card-footer d-flex flex-column gap-1">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span class="badge asignatura-badge">{{
                        sim.asignatura
                      }}</span>
                      <a
                        :href="sim.enlace"
                        target="_blank"
                        class="btn btn-sm btn-success btn-simulator"
                      >
                        Ejecutar  <i class="ri-terminal-box-line"></i>
                      </a>
                    </div>
                    <span class="small text-success date"
                      ><i class="bi bi-calendar-plus me-1"></i>Agregado:
                      {{ formatDate(sim.created_at) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección de Acciones -->
          <section class="actions-section">
            <div class="row">
              <div class="col-md-6 mt-3">
                <div class="action-card download-card glass-card h-100">
                  <div class="action-icon">
                    <i class="bi bi-file-earmark-arrow-down"></i>
                  </div>
                  <div class="action-content">
                    <h3>Manual de Usuario</h3>
                    <p>Descarga la guía completa para usar MachinaLab Finder</p>
                    <button class="btn btn-download" @click="descargarManual">
                      <i class="bi bi-download me-2"></i> Descargar
                    </button>
                  </div>
                </div>
              </div>
              <!-- Reporte de Simuladores -->
              <div class="col-md-6 mt-3">
                <div class="action-card stats-card glass-card h-100">
                  <div class="action-icon">
                    <i class="bi bi-journal-arrow-down"></i>
                  </div>
                  <div class="action-content">
                    <h3>Descargar Lista de Simuladores</h3>
                    <p>
                      Descarga la lista detallada de tus simuladores de
                      laboratorio en formato PDF para su revisión y análisis.
                    </p>
                    <ReporteSimuladores :simuladores="simuladores" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import ReporteSimuladores from "@/components/reporteSimuladores.vue";
import type { SupabaseClient } from "@supabase/supabase-js";

interface Simulador {
  id: number;
  nombre_del_simulador: string;
  enlace: string;
  categoria: string;
  asignatura: string;
  descripcion_del_simulador: string;
  created_at: string;
}

const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

// Datos del dashboard
const simuladores = ref<Simulador[]>([]);
const totalDescargables = ref(0);
const ultimosSimuladores = ref<Simulador[]>([]);
const totalSimuladores = ref(0);
const totalAsignaturas = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref("");

// Fecha y hora actual
const currentDate = ref("");
const currentTime = ref("");
const timeInterval = ref<NodeJS.Timeout>();

// Cargar datos
async function cargarDatosDashboard() {
  try {
    isLoading.value = true;
    error.value = null;

    // 1. Contar total de simuladores
    const { count: countSimuladores, error: countError } = await supabase
      .from("simuladores")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;
    totalSimuladores.value = countSimuladores || 0;

    // 1b. Contar total de simuladores descargables
    const { count: countDescargables, error: countDescargablesError } =
      await supabase
        .from("descargas")
        .select("*", { count: "exact", head: true });

    if (countDescargablesError) throw countDescargablesError;
    totalDescargables.value = countDescargables || 0;

    // 2. Obtener asignaturas únicas
    const { data: asignaturasData, error: asignaturasError } = await supabase
      .from("simuladores")
      .select("asignatura")
      .not("asignatura", "is", null);

    if (asignaturasError) throw asignaturasError;

    // Calcular asignaturas únicas
    const asignaturasUnicas = new Set<string>();
    asignaturasData?.forEach((item) => {
      if (item.asignatura) {
        asignaturasUnicas.add(item.asignatura);
      }
    });
    totalAsignaturas.value = asignaturasUnicas.size;

    // 3. Cargar los 3 simuladores más recientes
    const { data: ultimosTresData, error: ultimosTresError } = await supabase
      .from("simuladores")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (ultimosTresError) throw ultimosTresError;
    ultimosSimuladores.value = ultimosTresData || [];

    // 4. Cargar todos los simuladores para el listado completo
    const { data: simuladoresData, error: simuladoresError } = await supabase
      .from("simuladores")
      .select("*")
      .order("nombre_del_simulador", { ascending: true });

    if (simuladoresError) throw simuladoresError;
    simuladores.value = simuladoresData || [];
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : "Error de Conexion, Verifique e intente de nuevo";
    console.error("Error al cargar datos del dashboard:", err);
  } finally {
    isLoading.value = false;
  }
}

// Computed properties
const asignaturasConSimuladores = computed(() => {
  const asignaturas = new Set<string>();
  simuladores.value.forEach((sim) => {
    if (sim.asignatura) {
      asignaturas.add(sim.asignatura);
    }
  });
  return Array.from(asignaturas);
});

const simuladoresRecientes = computed(() => {
  return simuladores.value.slice(0, 3);
});

const filteredSimuladores = computed(() => {
  if (!searchTerm.value) return simuladores.value;

  const term = searchTerm.value.toLowerCase();
  return simuladores.value.filter(
    (sim) =>
      sim.nombre_del_simulador.toLowerCase().includes(term) ||
      sim.categoria.toLowerCase().includes(term) ||
      sim.asignatura.toLowerCase().includes(term)
  );
});

const promedio = computed(() => {
  if (asignaturasConSimuladores.value.length === 0) return 0;
  return Math.floor(
    totalSimuladores.value / asignaturasConSimuladores.value.length
  );
});
// Funciones auxiliares
function countSimuladoresPorAsignatura(asignatura: string) {
  return simuladores.value.filter((sim) => sim.asignatura === asignatura)
    .length;
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}

function updateDateTime() {
  const now = new Date();
  currentDate.value = now.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Formato de 12 horas con AM/PM
  currentTime.value = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function descargarManual() {
  // Cambia el nombre si tu archivo PDF tiene otro nombre
  const url = "/Manual_MachinaLab_Finder.pdf";
  // Esto fuerza la descarga en la mayoría de navegadores
  const link = document.createElement("a");
  link.href = url;
  link.download = "Manual_MachinaLab_Finder.pdf"; // Nombre sugerido para el usuario
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Inicialización
onMounted(() => {
  cargarDatosDashboard();
  updateDateTime();
  timeInterval.value = setInterval(updateDateTime, 60000);
});

onBeforeUnmount(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value);
  }
});
</script>

<style scoped>
.date {
  font-weight: 800;
}
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(120deg, #002147 70%, #003366 100%);
}

.dashboard-header {
  background: rgba(0, 33, 71, 0.98);
  border-bottom: 2px solid #ffc72c;
  box-shadow: 0 2px 12px 0 rgba(0, 33, 71, 0.07);
}

.dashboard-logo {
  border-radius: 0.5rem;
  background: #fff;
  padding: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.08);
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.text-unefa-accent {
  color: #ffc72c;
}

.dashboard-main {
  padding: 2rem 0;
}

.current-time {
  text-align: right;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: "Segoe UI", Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.04);
}

.current-time .date {
  font-size: 0.95rem;
  opacity: 0.85;
}

.current-time .time {
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Tarjetas de métricas */
.metric-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  height: 100%;
  transition: transform 0.3s, background 0.3s;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
  border: none;
}

.metric-card:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-5px) scale(1.03);
}

.metric-icon {
  font-size: 2.2rem;
  color: #ffc72c;
  margin-right: 1.5rem;
  filter: drop-shadow(0 2px 4px #ffc72c33);
}

.metric-content h3 {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
  font-weight: 600;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0;
  color: #ffc72c;
  text-shadow: 0 1px 2px #00214733;
}

/* Glass effect */
.glass-card {
  background: rgba(255, 255, 255, 0.13) !important;
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Sección de últimos simuladores */
.ultimos-simuladores-section {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.05);
}

.ultimo-simulador-card {
  background: rgba(255, 255, 255, 0.13);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.13);
}

.ultimo-simulador-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 24px rgba(0, 33, 71, 0.13);
  background: rgba(255, 255, 255, 0.18);
}

.ultimo-simulador-card .card-header {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.13);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.sim-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffc72c;
  text-shadow: 0 1px 2px #00214733;
}

.ultimo-simulador-card .card-body {
  padding: 1.5rem 1rem 1rem 1rem;
  flex-grow: 1;
}

.ultimo-simulador-card .card-footer {
  padding: 0.65rem 0.85rem;
  background: rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

/* Badges */
.bg-warning {
  background-color: #ffc72c !important;
}

.category-badge {
  background-color: #5b7c35 !important;
  color: #fff;
  font-weight: 500;
}

.asignatura-badge {
  background-color: #c8102e !important;
  color: #fff;
  font-weight: 500;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
  padding: 0.35em 0.8em;
}

/* Tarjetas de acciones */
.action-card {
  display: flex;
  border-radius: 0.75rem;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 33, 71, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.13);
}

.download-card {
  background: rgba(255, 255, 255, 0.09);
}

.stats-card {
  background: rgba(0, 0, 0, 0.09);
}

.action-icon {
  background: rgba(255, 199, 44, 0.18);
  color: #ffc72c;
  font-size: 2.2rem;
  padding: 1.5rem 1.2rem;
  display: flex;
  align-items: center;
  border-radius: 0.75rem 0 0 0.75rem;
}

.action-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.action-content h3 {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.action-content p {
  opacity: 0.85;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.btn-download {
  background-color: #c8102e;
  color: white;
  border: none;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-download:hover {
  background-color: #a00d26;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  color: #ffc72c;
  letter-spacing: 1px;
}

/* Spinner de carga */
.spinner-border,
.spinner-grow {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 1024px) {
  .d-flex.justify-content-between.align-items-center {
    flex-wrap: nowrap !important;
    gap: 0.5rem;
  }

  .asignatura-badge {
    max-width: 50%;
    font-size: 0.85rem;
  }

  .btn.btn-sm.btn-primary {
    flex-shrink: 0;
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 767px) {
  .dashboard-title {
    font-size: 1.4rem;
  }
  .metric-card,
  .glass-card,
  .action-card,
  .ultimos-simuladores-section {
    padding: 1rem !important;
  }
  .action-icon {
    padding: 1rem 0.7rem;
    font-size: 1.5rem;
  }
  .sim-title {
    font-size: 1rem;
  }
}
</style>
