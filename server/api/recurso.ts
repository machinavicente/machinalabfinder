export default defineEventHandler(async () => {
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://TU_DOMINIO.vercel.app' // cambia esto por tu dominio real

  const res = await fetch(`${baseURL}/guides_png/index.json`)
  const archivos: string[] = await res.json()

  const imagenes = archivos.map((nombre, index) => ({
    id: index + 1,
    nombre: nombre
      .replace(/\.(png|jpg|jpeg|gif|jfif)$/i, '')
      .replace(/[-_]/g, ' '),
    url: `/guides_png/${nombre}`
  }))

  return imagenes
})
