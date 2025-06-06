<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'

interface Descarga {
    id: number
    nombre_del_programa: string
    enlace_del_programa: string
    sistema_operativo: string
    descripcion_del_programa: string
    asignatura: string
}

const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

const descargas = ref<Descarga[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const terminoBusqueda = ref('')
const filtroAsignatura = ref('')

async function cargarDescargas() {
    try {
        isLoading.value = true
        error.value = null

        const { data, error: supabaseError } = await supabase
            .from('descargas')
            .select('*')
            .order('nombre_del_programa', { ascending: true })

        if (supabaseError) throw supabaseError

        // Conversión explícita de tipos
        descargas.value = (data || []).map(item => ({
            id: Number(item.id),
            nombre_del_programa: String(item.nombre_del_programa),
            enlace_del_programa: String(item.enlace_del_programa),
            sistema_operativo: String(item.sistema_operativo),
            descripcion_del_programa: String(item.descripcion_del_programa),
            asignatura: String(item.asignatura)
        }))
    } catch (err) {
        console.error('Error al cargar descargas:', err)
        error.value = err instanceof Error ? err.message : 'Error al cargar los datos'
    } finally {
        isLoading.value = false
    }
}

function normalizarTexto(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/gi, '')
        .trim()
}

const sistemasOperativosDisponibles = computed<string[]>(() => {
    if (descargas.value.length === 0) return []
    return [...new Set(descargas.value.map(d => d.sistema_operativo))].sort()
})

const asignaturasDisponibles = computed(() =>
    [...new Set(descargas.value.map(d => d.asignatura))].sort()
)

const descargasFiltradas = computed<Descarga[]>(() => {
    const termino = normalizarTexto(terminoBusqueda.value)

    if (descargas.value.length === 0) return []

    return descargas.value.filter(descarga => {
        const textoCompleto = [
            descarga.nombre_del_programa,
            descarga.descripcion_del_programa,
            descarga.sistema_operativo,
            descarga.asignatura
        ].join(' ')

        const coincideBusqueda = normalizarTexto(textoCompleto).includes(termino)
        const coincideAsignatura = filtroAsignatura.value === '' || descarga.asignatura === filtroAsignatura.value

        return coincideBusqueda && coincideAsignatura
    })
})

const descargasPorSO = computed<Record<string, Descarga[]>>(() => {
    const agrupados: Record<string, Descarga[]> = {}

    descargasFiltradas.value.forEach(descarga => {
        const so = descarga.sistema_operativo || 'Otros'
        if (!agrupados[so]) agrupados[so] = []
        agrupados[so].push(descarga)
    })

    return Object.fromEntries(
        Object.entries(agrupados).sort(([soA], [soB]) => soA.localeCompare(soB))
    )
})

function iconoPorSO(sistemaOperativo: string): string {
    const mapaIconos: Record<string, string> = {
        'Windows': 'bi-windows',
        'Linux': 'bi-tux',
        'macOS': 'bi-apple',
        'Multiplataforma': 'bi-layers',
        'Android': 'bi-android2',
        'iOS': 'bi-phone',
        'Otros': 'bi-question-circle'
    }
    return mapaIconos[sistemaOperativo] || mapaIconos['Otros']
}

function toggleAsignatura(asignatura: string) {
  filtroAsignatura.value = filtroAsignatura.value === asignatura ? '' : asignatura
}

onMounted(() => {
    cargarDescargas()
})
</script>

<template>
    <div class="container py-4 content">
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-else>
            <!-- Barra de búsqueda -->
            <div class="mb-4">
                <input v-model="terminoBusqueda" type="text" class="form-control" placeholder="Buscar programas..."
                    autocomplete="off" />
            </div>

            <!-- Filtros por asignatura -->
            <div class="mb-4">
                <h6 class="text-dark fw-bold mb-2">Filtrar por asignatura:</h6>
                <div class="d-flex flex-wrap gap-2 mb-3">
                    <button 
                        v-for="asig in asignaturasDisponibles" 
                        :key="asig" 
                        @click="toggleAsignatura(asig)" 
                        class="btn btn-sm"
                        :class="filtroAsignatura === asig ? 'btn-success text-white' : 'btn-outline-secondary'"
                    >
                        {{ asig }}
                    </button>
                </div>
            </div>

            <!-- Descargas agrupadas por SO -->
            <template v-if="descargas.length > 0">
                <div v-for="(grupoDescargas, so) in descargasPorSO" :key="so" class="mb-5">
                    <h4 class="mb-3 text-uppercase text-dark font-weight-bold titulo">
                        <i :class="['bi', iconoPorSO(so), 'me-2']"></i>
                        {{ so }}
                    </h4>

                    <div class="row g-4">
                        <div v-for="descarga in grupoDescargas" :key="descarga.id" class="col-md-4 d-flex">
                            <div class="card shadow-sm h-100 w-100">
                                <div class="card-header bg-light d-flex justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <i
                                            :class="['bi', iconoPorSO(descarga.sistema_operativo), 'me-2 text-muted']"></i>
                                        <small class="text-muted">{{ descarga.sistema_operativo }}</small>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <span class="win-btn win-minimize"><i class="bi bi-dash"></i></span>
                                        <span class="win-btn win-maximize"><i class="bi bi-square"></i></span>
                                        <span class="win-btn win-close"><i class="bi bi-x"></i></span>
                                    </div>
                                </div>

                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">{{ descarga.nombre_del_programa }}</h5>
                                    <p class="card-text text-muted small flex-grow-1">
                                        {{ descarga.descripcion_del_programa }}
                                    </p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">
                                            {{ descarga.asignatura }}
                                        </small>
                                        <a :href="descarga.enlace_del_programa" class="btn btn-success btn-sm"
                                            target="_blank">
                                            <i class="ri-mobile-download-line"></i> Descargar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <div v-else class="text-center text-muted py-4">
                No se encontraron programas disponibles.
            </div>
        </div>
    </div>
</template>

<style scoped>
.win-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 22px;
    font-size: 0.8rem;
    color: #495057;
    border-radius: 3px;
    cursor: default;
    transition: all 0.2s;
}

/* Diferentes colores al pasar el mouse para cada botón */
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
}
.card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
    border-radius: 8px;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
small{
    font-weight: 800;
}
.titulo {
    font-weight: 800;
}

/* Estilo para los botones de filtro */
.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
.content{
  height: 100vh;
}
</style>