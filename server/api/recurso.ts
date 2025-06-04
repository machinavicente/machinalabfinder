// server/api/recursos.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(() => {
  const publicPath = path.resolve('public/guides_png')
  const archivos = fs.readdirSync(publicPath)

  const imagenes = archivos
    .filter((nombre) => /\.(png|jpg|jpeg|gif|jfif)$/i.test(nombre))
    .map((nombre, index) => ({
      id: index + 1,
      nombre: nombre.replace(/\.(png|jpg|jpeg|gif|jfif)$/i, '').replace(/[-_]/g, ' '),
      url: `/guides_png/${nombre}`
    }))

  return imagenes
})
