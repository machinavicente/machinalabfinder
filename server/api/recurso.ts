import fs from 'fs'
import path from 'path'

export default defineEventHandler(() => {
  const carpeta = path.resolve('public/guides_png')

  if (!fs.existsSync(carpeta)) return []

  const archivos = fs
    .readdirSync(carpeta)
    .filter((nombre) => /\.(png|jpe?g|gif|jfif)$/i.test(nombre))

  const imagenes = archivos.map((nombre, index) => ({
    id: index + 1,
    nombre: nombre
      .replace(/\.(png|jpe?g|gif|jfif)$/i, '')
      .replace(/[-_]/g, ' '),
    url: `/guides_png/${nombre}`
  }))

  return imagenes
})
