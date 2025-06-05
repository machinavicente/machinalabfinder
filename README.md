# MachinaLab Finder

## Descripción

MachinaLab Finder es una plataforma web para la gestión, consulta y registro de simuladores, guías y recursos educativos, orientada a la comunidad UNEFA extension Zaraza. Permite a los usuarios:

- Consultar y descargar simuladores por asignatura y sistema operativo.
- Acceder a una biblioteca de guías visuales.
- Registrar nuevos simuladores para ampliar la colección.
- Visualizar dashboards y reportes.
- Navegar de forma responsiva tanto en escritorio como en dispositivos móviles.

## Tecnologías utilizadas

- **Nuxt 3** (Vue 3 + Vite)
- **TypeScript**
- **Supabase** (Base de datos y almacenamiento)
- **Bootstrap Icons** y **Remix Icons**
- **Vercel** (Despliegue)
- **CSS personalizado** (Glassmorphism, colores UNEFA)

## Estructura principal

- `/pages` — Vistas principales (dashboard, downloads, guides, registro, etc.)
- `/components` — Componentes reutilizables (Menu, BottomMenu, Footer, etc.)
- `/layouts` — Layouts globales (default.vue)
- `/public` — Archivos estáticos (manuales PDF, imágenes públicas, etc.)

## Características

- **Menú superior fijo** en escritorio, oculto en móvil.
- **Menú inferior (BottomMenu)** para navegación rápida en móvil.
- **Filtros y búsqueda** en descargas y guías.
- **Carga y descarga de archivos** desde Supabase Storage y carpeta `/public`.
- **Glassmorphism** en modales y elementos destacados.
- **Colores institucionales UNEFA** (azul #002147 y amarillo #ffc72c).
- **Responsive Design**: experiencia optimizada para escritorio y móvil.

## Instalación y desarrollo

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/machinalabsx.git
   cd machinalabsx
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   - Renombra el archivo `.env.example` a `.env`.
   - Configura tus credenciales de Supabase y Vercel.
4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
5. **Abre tu navegador y visita:**
   ```plaintext
   http://localhost:3000
   ```

## Despliegue

Para desplegar en Vercel:

1. Asegúrate de tener la cuenta de Vercel configurada.
2. Desde el directorio del proyecto, ejecuta:
   ```bash
   vercel
   ```
3. Sigue las instrucciones en pantalla para completar el despliegue.

## Notas

- Este proyecto utiliza [Nuxt Content](https://content.nuxtjs.org/) para la gestión de contenido.
- Asegúrate de revisar la documentación de cada tecnología utilizada para un mejor entendimiento y aprovechamiento del proyecto.

---

¡Gracias por interesarte en MachinaLab Finder!