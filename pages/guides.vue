<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'

const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

const imagenes = ref<string[]>([])
const imagenSeleccionada = ref<string | null>(null)
const terminoBusqueda = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
}

// Función que quita extensión y normaliza nombre para mostrar
function normalizarNombreParaMostrar(nombre: string): string {
  const nombreSinExt = nombre.replace(/\.[^/.]+$/, '')
  return nombreSinExt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-zA-Z0-9\s]/g, '') // solo letras, números y espacios
    .trim()
}

const imagenesFiltradas = computed(() => {
  const termino = normalizarTexto(terminoBusqueda.value)
  if (!termino) return imagenes.value
  return imagenes.value.filter(nombre =>
    normalizarTexto(nombre).includes(termino)
  )
})

async function cargarImagenes() {
  isLoading.value = true
  error.value = null
  try {
    const { data, error: bucketError } = await supabase.storage.from('biblioteca').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

    if (bucketError) throw bucketError

    if (!data || data.length === 0) {
      imagenes.value = []
      error.value = 'No se encontraron imágenes en el bucket.'
      return
    }

    imagenes.value = data
      .filter(file => /\.(png|jpe?g|gif|webp|jfif)$/i.test(file.name))
      .map(file => file.name)

    if (imagenes.value.length === 0) {
      error.value = 'No hay imágenes con extensiones soportadas.'
    }
  } catch (err) {
    console.error('Error al cargar imágenes:', err)
    error.value = 'No se pudieron cargar las imágenes.'
    imagenes.value = []
  } finally {
    isLoading.value = false
  }
}

function obtenerURL(nombre: string): string {
  return supabase.storage.from('biblioteca').getPublicUrl(nombre).data.publicUrl
}

// Función para descargar el archivo cuando se presione el botón
function descargarArchivo(url: string) {
  const nombreOriginal = url.split('/').pop() || 'imagen-descarga.png'
  const extension = nombreOriginal.match(/\.[^/.]+$/)?.[0] || ''
  
  // Reutilizar normalización pero sin quitar extensión para descarga
  const nombreArchivo = normalizarNombreParaMostrar(nombreOriginal.replace(/\.[^/.]+$/, '')) + extension

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const urlBlob = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = urlBlob
      link.download = nombreArchivo
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(urlBlob)
    })
    .catch(err => {
      console.error('Error al descargar:', err)
    })
}

onMounted(() => {
  cargarImagenes()
})
</script>

<template>
  <div class="container py-4">
    <div class="mb-3">
      <input v-model="terminoBusqueda" class="form-control" placeholder="Buscar guia..." />
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <div v-if="imagenesFiltradas.length === 0" class="text-center text-muted py-4">
        No se encontraron imágenes.
      </div>

      <div class="row g-4" v-else>
        <div v-for="nombre in imagenesFiltradas" :key="nombre" class="col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img
              :src="obtenerURL(nombre)"
              class="card-img-top"
              :alt="nombre"
              style="object-fit: cover; height: 200px;"
            />
            <div class="card-body text-center">
              <p class="card-text text-truncate">{{ normalizarNombreParaMostrar(nombre) }}</p>
              <button
                class="btn btn-info btn-sm"
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

    <!-- Modal de imagen -->
    <div class="modal fade" id="modalImagen" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <img v-if="imagenSeleccionada" :src="imagenSeleccionada" class="img-fluid rounded" />
          </div>
          <div class="modal-footer">
            <button
              v-if="imagenSeleccionada"
              type="button"
              class="btn btn-success"
              @click="descargarArchivo(imagenSeleccionada)"
            >
            <i class="ri-download-2-line"></i>
              Descargar
            </button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                <i class="ri-close-circle-line"></i>
                Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
