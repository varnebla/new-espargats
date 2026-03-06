# Agent Context — Espargats

## Sobre el proyecto

**Espargats** es el sitio web de una asociación sin ánimo de lucro ubicada en Esparreguera (Barcelona) dedicada a ayudar a los gatos callejeros. Sus actividades principales son:

- Rescate y atención veterinaria de gatos callejeros
- Alimentación y cuidado en colonias felinas
- Gestión de adopciones responsables
- Difusión de guías de actuación ciudadana (qué hacer si encuentras un gato herido, muerto, etc.)
- Captación de colaboradores y donaciones

El sitio es **completamente estático** (no hay backend ni base de datos). Todo el contenido es gestionado directamente en el código fuente.

**URL de producción**: https://www.espargats.com  
**Idioma del contenido**: Español

---

## Stack tecnológico

### Astro 6 (beta)
- Framework principal de generación de sitios estáticos.
- Versión activa: `6.0.0-beta.19`.
- Sin modo SSR: todo se genera en build time.
- Las páginas están en `src/pages/`. Cada archivo `.astro` es una ruta.
- Los layouts están en `src/layouts/`. El layout principal es `Layout.astro`.
- Los componentes están en `src/components/`.
- Las rutas dinámicas usan `getStaticPaths()` (p.ej. `guias/[slug].astro`).
- Se usa `astro:content` para las colecciones de contenido (`guias`).
- **Content config**: en `src/content.config.ts` (raíz de `src/`, no dentro de `content/`). Las colecciones usan loaders (`glob` de `astro/loaders`).
- Integración activa: `@astrojs/sitemap` (genera `sitemap-index.xml` automáticamente).
- **Font API** (nativa de Astro 6): dos fuentes servidas desde **Fontshare**, configuradas en `astro.config.mjs` con `fontProviders.fontshare()`. Se descargan en build y se sirven como assets locales (`dist/_astro/fonts/`). Se inyectan en el `<head>` via `<Font>` de `astro:assets`.
  - **Sora** (`--font-sora`, pesos 600/700/800) → headings (`h1`–`h6`) y `--font-display`
  - **General Sans** (`--font-general-sans`, pesos 400/500/600) → cuerpo de texto, botones y UI (`--font-sans`)

### Tailwind CSS 4
- Integrado via plugin de Vite: `@tailwindcss/vite` (no hay `tailwind.config.js`).
- La configuración se hace **enteramente en CSS**, en `src/styles/global.css`.
- Se importa con `@import "tailwindcss";` al inicio del CSS global.
- Los tokens personalizados se definen en el bloque `@theme { ... }`.
- Plugin de tipografía activo: `@plugin "@tailwindcss/typography"` (clases `prose`).
- **No usar sintaxis de Tailwind v3** (no `theme()`, no `tailwind.config.js`, no `@apply` salvo casos justificados).

### DaisyUI 5
- Librería de componentes encima de Tailwind.
- Activada como plugin CSS en `global.css` con `@plugin "daisyui"`.
- Tema activo: **`fantasy`** (definido como tema personalizado en `global.css`).
  - `data-theme="fantasy"` está en el `<html>` del Layout.
  - Colores principales:
    - `primary`: púrpura `hsl(275, 42%, 30%)`
    - `primary-content`: lila claro `hsl(275, 42%, 90%)`
    - `secondary`: dorado `hsl(42, 100%, 70%)`
    - `secondary-content`: igual que `primary`
- Usar **componentes DaisyUI** (`btn`, `navbar`, `menu`, `dropdown`, `card`, `badge`, etc.) siempre que sea posible antes de construir componentes custom.
- Las clases de DaisyUI y Tailwind conviven sin conflicto.

### Iconos — Lucide (`@lucide/astro`)
- Los iconos se importan como componentes Astro directamente:
  ```astro
  import { Menu } from '@lucide/astro';
  ```
- No usar otros paquetes de iconos.

---

## Estructura de carpetas

```
src/
  assets/           # Assets estáticos (procesados por Astro)
  components/       # Componentes Astro reutilizables
  content/
    config.ts       # Definición de colecciones (Astro Content Collections)
    gatosEnAdopcion.ts  # Array estático con los gatos disponibles para adopción
    guias/          # Archivos JSON con contenido de guías (colección "guias")
  layouts/
    Layout.astro    # Layout principal (HTML base, Header, Footer)
  pages/            # Rutas del sitio
    index.astro
    about.astro
    adopta.astro
    colabora.astro
    gatos-en-adopcion.astro
    guias/[slug].astro
  styles/
    global.css      # Punto de entrada CSS (Tailwind + DaisyUI + @theme)
public/             # Archivos servidos tal cual (imágenes, favicon, robots.txt)
  images/           # Imágenes del sitio (formato .avif y .webp preferidos)
```

---

## Alias de paths (TypeScript)

Definidos en `tsconfig.json`:

| Alias | Ruta real |
|---|---|
| `@/*` | `./src/*` |
| `@components/*` | `./src/components/*` |
| `@layouts/*` | `./src/layouts/*` |
| `@styles/*` | `./src/styles/*` |

Usar **siempre los alias** al importar, nunca rutas relativas largas.

---

## Datos del sitio

### Colección `guias`
- Tipo: `data` (JSON).
- Schema: `{ title: string, content: string }`.
- El campo `content` contiene HTML como string (se renderiza con `set:html`).
- Los archivos están en `src/content/guias/*.json`.
- Se accede con `getCollection('guias')` de `astro:content`.

### Gatos en adopción
- Datos estáticos en `src/content/gatosEnAdopcion.ts`, exportados como array `gatosEnAdopcion`.
- Cada gato tiene: `name`, `age`, `gender`, `description`, `image`, `tags[]`.
- Las imágenes se sirven desde `/public/images/gatos/`.

---

## SEO y meta

- El `<Layout>` acepta props `title` y `description`.
- El `<title>` se renderiza como `{title} | Espargats en Barcelona`.
- Hay Open Graph y Twitter Cards en el `<head>`.
- El sitemap se genera automáticamente por `@astrojs/sitemap`.

---

## Convenciones y buenas prácticas

- **Todo el texto visible es en español.**
- Usar **imágenes en formato `.avif` o `.webp`** para optimizar el rendimiento. El atributo `loading="eager"` solo para la imagen principal del hero; el resto con `loading="lazy"`.
- Mantener los componentes en `src/components/` como secciones independientes (cada sección de la página es su propio componente).
- El sitio es estático: no añadir integraciones SSR (`output: 'server'`), ni llamadas a APIs en runtime.
- Los scripts de cliente (JavaScript en el navegador) deben usarse con moderación; preferir la interactividad nativa de HTML/CSS (DaisyUI usa CSS puro para muchos componentes interactivos como dropdowns).
- Para nuevas páginas, seguir el patrón: importar `Layout` y pasarle `title` y `description`.

---

## Comandos útiles

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Build estático en /dist
pnpm preview   # Previsualizar el build
```
