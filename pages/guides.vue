<template>
  <div class="container py-4">
    <!-- Encabezado mejorado -->
    <div
      class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="ri-book-open-line fs-3 text-primary"></i>
      </div>
      <input
        v-model="terminoBusqueda"
        class="form-control w-100 w-md-auto"
        style="max-width: 350px"
        placeholder="Buscar guía..."
      />
    </div>

    <!-- Barra de ayuda -->
    <div
      class="alert alert-info d-flex align-items-center gap-2 mb-4"
      role="alert"
    >
      <i class="ri-lightbulb-flash-line fs-4"></i>
      <div>
        Haz clic en una guía para verla en grande y descargarla. Usa el buscador
        para filtrar por nombre.
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <div class="mt-2 text-muted">Cargando guías, por favor espera...</div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-2">
      <i class="bi bi-wifi-off fs-4"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Sin resultados -->
    <div v-else>
      <div v-if="imagenesFiltradas.length === 0" class="text-center text-muted py-5">
        <i class="ri-search-eye-line fs-1 mb-2"></i>
        <div>No se encontraron guías bajo ese criterio.</div>
      </div>

      <!-- Galería de guías -->
      <div class="row g-4" v-else>
        <div
          v-for="nombre in imagenesFiltradas"
          :key="nombre"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div
            class="card h-100 shadow-sm border-0 guide-card position-relative"
          >
            <img
              :src="obtenerURL(nombre)"
              class="card-img-top guide-img"
              :alt="nombre"
              @click="imagenSeleccionada = obtenerURL(nombre)"
              data-bs-toggle="modal"
              data-bs-target="#modalImagen"
            />
            <span
              class="badge bg-primary position-absolute top-0 end-0 m-2 shadow-sm"
              >Guía</span
            >
            <div
              class="card-body text-center d-flex flex-column justify-content-between"
            >
              <p
                class="card-text guide-title mb-2"
                :title="normalizarNombreParaMostrar(nombre)"
              >
                {{ normalizarNombreParaMostrar(nombre) }}
              </p>
              <div class="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  class="btn btn-outline-info btn-sm"
                  @click="imagenSeleccionada = obtenerURL(nombre)"
                  data-bs-toggle="modal"
                  data-bs-target="#modalImagen"
                >
                  <i class="ri-eye-line"></i>
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de imagen -->
    <div class="modal fade" id="modalImagen" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              {{
                imagenSeleccionada
                  ? normalizarNombreParaMostrar(
                      (imagenSeleccionada.split("/").pop() || "").split("?")[0]
                    )
                  : ""
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cerrarModal"
            ></button>
          </div>
          <div
            class="modal-body text-center p-0 d-flex justify-content-center align-items-center bg-light"
          >
            <img
              v-if="imagenSeleccionada"
              :src="imagenSeleccionada"
              class="img-fluid rounded"
              style="max-height: 500px; max-width: 100%; object-fit: contain"
            />
            <div v-else class="text-muted py-5 w-100">
              No hay imagen seleccionada.
            </div>
          </div>
          <div
            class="modal-footer border-0 d-flex justify-content-between flex-wrap gap-2"
          >
            <button
              v-if="imagenSeleccionada"
              type="button"
              class="btn btn-success"
              @click="descargarArchivo(imagenSeleccionada)"
            >
              <i class="ri-download-2-line"></i>
              Descargar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="cerrarModal"
            >
              <i class="ri-close-line"></i>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { SupabaseClient } from "@supabase/supabase-js";

const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

const imagenes = ref<string[]>([]);
const imagenSeleccionada = ref<string | null>(null);
const terminoBusqueda = ref("");
const isLoading = ref(true);
const error = ref<string | null>(null);

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizarNombreParaMostrar(nombre: string) {
  const nombreSinExt = nombre.replace(/\.[^/.]+$/, "");
  return nombreSinExt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2") // Espacio entre letra y grupo de números
    .replace(/([0-9]+)([a-zA-Z])/g, "$1 $2") // Espacio entre grupo de números y letra
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word && !/^\d+$/.test(word)) // Elimina palabras que son solo números
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const imagenesFiltradas = computed(() => {
  const termino = normalizarTexto(terminoBusqueda.value);
  if (!termino) return imagenes.value;
  return imagenes.value.filter((nombre) =>
    normalizarTexto(nombre).includes(termino)
  );
});

async function cargarImagenes() {
  isLoading.value = true;
  error.value = null;
  try {
    const { data, error: bucketError } = await supabase.storage
      .from("biblioteca")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (bucketError) throw bucketError;

    if (!data || data.length === 0) {
      imagenes.value = [];
      error.value = "Error de Conexion, Verifique e intente de nuevo";
      return;
    }

    imagenes.value = data
      .filter((file) => /\.(png|jpe?g|gif|webp|jfif)$/i.test(file.name))
      .map((file) => file.name);

    if (imagenes.value.length === 0) {
      error.value = "No hay imágenes con extensiones soportadas.";
    }
  } catch (err) {
    console.error("Error al cargar imágenes:", err);
    error.value = "No se pudieron cargar las imágenes.";
    imagenes.value = [];
  } finally {
    isLoading.value = false;
  }
}

function obtenerURL(nombre: string): string {
  return supabase.storage.from("biblioteca").getPublicUrl(nombre).data
    .publicUrl;
}

function descargarArchivo(url: string) {
  if (!url) return;
  const nombreOriginal = url.split("/").pop() || "imagen-descarga.png";
  const extension = nombreOriginal.match(/\.[^/.]+$/)?.[0] || "";
  const nombreBase = nombreOriginal.replace(/\.[^/.]+$/, "");
  const nombreArchivo =
    nombreBase
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/\s+/g, " ")
      .trim() + extension;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    })
    .catch((err) => {
      console.error("Error al descargar:", err);
    });
}

// Limpia la imagen seleccionada al cerrar el modal
function cerrarModal() {
  imagenSeleccionada.value = null;
}

onMounted(() => {
  cargarImagenes();
});
</script>

<style scoped>
.modal-dialog {
  max-width: 700px;
  width: 100%;
  margin: 1.75rem auto;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 992px) {
  .modal-dialog {
    max-width: 95vw;
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  overflow: auto;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  flex-wrap: nowrap;
  overflow: hidden;
  min-width: 0;
}

.modal-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.1rem;
}

.btn-close {
  flex-shrink: 0;
}

.modal-body {
  flex: 1 1 auto;
  overflow: auto;
  max-height: 66vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.modal-body img {
  max-width: 100%;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}

.modal-backdrop.show {
  backdrop-filter: blur(5px);
  opacity: 0.85 !important;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.guide-card {
  border-radius: 4px;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px 0 rgba(0, 33, 71, 0.07);
  position: relative;
}

.guide-card:hover {
  box-shadow: 0 8px 32px 0 rgba(0, 33, 71, 0.13);
  background: #f6fafd;
  transform: translateY(-2px) scale(1.01);
}

.guide-img {
  object-fit: contain;
  max-height: 200px;
  min-height: 160px;
  background: #f8fafc;
  cursor: pointer;
  transition: filter 0.2s;
  border-bottom: 1px solid #f1f1f1;
  width: 100%;
}

.guide-img:hover {
  filter: brightness(0.95) blur(1px);
}

.guide-title {
  font-weight: 600;
  font-size: 1rem;
  color: #002147;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0.5rem;
}
</style>
