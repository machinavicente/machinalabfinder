<template>
  <button class="btn btn-danger" @click="generarPDF">
    <i class="bi bi-file-earmark-pdf me-1"></i> Generar Reporte
  </button>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps<{
  simuladores: Array<{
    id: number
    nombre_del_simulador: string
    descripcion_del_simulador: string
    enlace: string
    asignatura: string
    categoria: string
    created_at: string
  }>
}>()

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function generarPDF() {
  const doc = new jsPDF({ orientation: 'portrait' })
  let y = 20

  // Identidad institucional
  doc.setTextColor(0, 32, 68)
  doc.setFontSize(10)
  doc.text('UNEFA - Extensión Zaraza', 14, y)

  y += 6
  doc.setFontSize(16)
  doc.setTextColor(0, 32, 68)
  doc.text('MachinaLab', 14, y)
  doc.text('Finder', 46, y)

  y += 10
  doc.setTextColor(0)
  doc.setFontSize(12)
  const today = formatDate(new Date().toISOString())
  doc.text(`Fecha de generación: ${today}`, 14, y)
  y += 10

  // Resumen general
  const totalSimuladores = props.simuladores.length

  const asignaturasMap = new Map<string, string>()
  props.simuladores.forEach(s => {
    const key = normalizarTexto(s.asignatura)
    if (!asignaturasMap.has(key)) {
      asignaturasMap.set(key, s.asignatura)
    }
  })
  const totalAsignaturas = asignaturasMap.size

  doc.setFontSize(14)
  doc.text('Resumen general', 14, y)
  y += 8
  doc.setFontSize(12)
  doc.text(`• Total de simuladores: ${totalSimuladores}`, 20, y)
  y += 6
  doc.text(`• Total de asignaturas: ${totalAsignaturas}`, 20, y)
  y += 10

  // Simuladores por asignatura
  doc.setFontSize(14)
  doc.text('Simuladores por asignatura', 14, y)
  y += 6

  const simuladoresPorAsignatura: [string, number][] = []
  asignaturasMap.forEach((valorOriginal, claveNormalizada) => {
    const total = props.simuladores.filter(s => normalizarTexto(s.asignatura) === claveNormalizada).length
    simuladoresPorAsignatura.push([valorOriginal, total])
  })

  autoTable(doc, {
    head: [['Asignatura', 'Total de simuladores']],
    body: simuladoresPorAsignatura,
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 32, 68],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [0, 32, 68],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableLineColor: [0, 32, 68],
    tableLineWidth: 0.1,
  })

  y = (doc as any).lastAutoTable.finalY + 10

  // Simuladores por tipo (categoría)
  doc.setFontSize(14)
  doc.text('Simuladores por tipo', 14, y)
  y += 6

  const categoriasMap = new Map<string, string>()
  props.simuladores.forEach(s => {
    const key = normalizarTexto(s.categoria)
    if (!categoriasMap.has(key)) {
      categoriasMap.set(key, s.categoria)
    }
  })

  const simuladoresPorTipo: [string, number][] = []
  categoriasMap.forEach((valorOriginal, claveNormalizada) => {
    const total = props.simuladores.filter(s => normalizarTexto(s.categoria) === claveNormalizada).length
    simuladoresPorTipo.push([valorOriginal, total])
  })

  autoTable(doc, {
    head: [['Tipo de simulador', 'Total']],
    body: simuladoresPorTipo,
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 32, 68],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [0, 32, 68],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableLineColor: [0, 32, 68],
    tableLineWidth: 0.1,
  })

  y = (doc as any).lastAutoTable.finalY + 10

  // Tabla completa
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text('Listado completo de simuladores', 14, y)
  y += 6

  autoTable(doc, {
    head: [['Nombre', 'Descripción', 'Enlace', 'Categoría', 'Asignatura']],
    body: props.simuladores.map(s => [
      s.nombre_del_simulador,
      s.descripcion_del_simulador,
      s.enlace,
      s.categoria,
      s.asignatura,
    ]),
    startY: y,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      halign: 'left',
      lineColor: [0, 32, 68],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [0, 32, 68],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 70 },
      2: { cellWidth: 40 },
      3: { cellWidth: 22 },
      4: { cellWidth: 21 },
    },
    margin: { top: 10, bottom: 20, left: 14, right: 14 },
    tableWidth: 'auto',
    pageBreak: 'auto',
  })

  y = (doc as any).lastAutoTable.finalY + 10

  // Notas adicionales
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.text('Notas adicionales:', 14, y)
  y += 6
  const left = 14
  const right = 190
  for (let i = 0; i < 4; i++) {
    doc.line(left, y, right, y)
    y += 8
  }

  doc.save(`Reporte_Simuladores_${today.replace(/\//g, '-')}.pdf`)
}
</script>
