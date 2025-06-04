// utils/generarIndexJson.ts
import fs from 'fs'
import path from 'path'

const carpeta = path.resolve('public/guides_png')

const archivos = fs
  .readdirSync(carpeta)
  .filter((nombre) => /\.(png|jpg|jpeg|gif|jfif)$/i.test(nombre))

const rutaSalida = path.join(carpeta, 'index.json')

fs.writeFileSync(rutaSalida, JSON.stringify(archivos, null, 2))

console.log(`✅ Se generó index.json con ${archivos.length} recursos.`)
