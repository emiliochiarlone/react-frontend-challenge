# FakeStore — React Frontend Challenge

E-commerce SPA desarrollado como challenge técnico. Catálogo con filtros, carrito persistente, autenticación y UX cuidada.

## Inicio rápido

```bash
git clone <repo-url>
cd react-frontend-challenge
npm install
npm run dev
```

Se levanta en `http://localhost:5173`.

### Otros comandos

```bash
npm run build      # Build de producción (TypeScript + Vite)
npm run preview    # Previsualizar el build
npm run lint       # ESLint
npm test           # Tests con Vitest
```

### Credenciales de prueba

| Email                | Contraseña |
| -------------------- | ---------- |
| `demo@fakestore.com` | `demo1234` |

---

## Stack

| Tecnología                | Uso                                                             |
| ------------------------- | --------------------------------------------------------------- |
| React 19 + TypeScript 5   | UI y tipado                                                     |
| Vite 7                    | Dev server y build                                              |
| Zustand                   | Estado global (cart, auth, UI) con persistencia en localStorage |
| TanStack Query            | Data fetching, cache, infinite scroll                           |
| React Router 6            | Routing SPA con layouts anidados                                |
| SCSS Modules              | Estilos por componente, mobile-first                            |
| Vitest + Testing Library  | 65 unit tests                                                   |
| ESLint + Prettier + Husky | Calidad y formateo en pre-commit                                |

---

## Funcionalidades

- **Home** — Carousel de banners (autoplay 5s), categorías, destacados y ofertas
- **Catálogo** — Infinite scroll, filtros por categoría/precio/ofertas, ordenamiento
- **Buscador** — Sugerencias con miniaturas, debounce 500ms, navegación por teclado
- **URLs compartibles** — Todos los filtros sincronizados en query params + botón compartir (Web Share API)
- **Detalle de producto** — Reviews, stock, descuentos, productos relacionados
- **Vista rápida** — Modal con info del producto sin salir del catálogo
- **Carrito** — Persistente en localStorage, control de cantidades, resumen
- **Auth** — Login con validación, perfil protegido, sesión persistente
- **Shimmer loading** — Skeleton animado + fade-in en todas las imágenes
- **Responsive** — Mobile-first, hamburger menu, dropdown de categorías
- **i18n** — Categorías y productos traducidos al español via JSON

---

## Arquitectura

```
src/
├── components/       # UI compartida (ProductCard, Header, Footer, ShimmerImage, etc.)
├── features/         # Páginas por feature (home, catalog, product-detail, cart, auth, quick-view)
├── hooks/            # Custom hooks (useInfiniteScroll)
├── i18n/             # Traducciones ES (categories.json, products.json)
├── layouts/          # MainLayout, AuthLayout
├── routes/           # Configuración de rutas
├── services/         # FakeStore API + cache en memoria + traducciones
├── stores/           # Zustand (cart, auth, ui)
├── styles/           # Variables, mixins, reset SCSS
├── test/             # Setup de tests (Vitest + RTL)
├── types/            # Interfaces TypeScript
└── utils/            # Utilidades (formatPrice)
```

### Patrones de diseño

- **Smart / Dumb components** — La lógica (stores, side effects) vive en containers (`ProductCardContainer`); la UI pura en presentacionales (`ProductCard`)
- **Service layer con cache** — `fetchAllProducts()` descarga los 20 productos de FakeStore API, los enriquece y cachea en memoria. Todas las queries (`getProducts`, `searchProducts`, `getRelatedProducts`) operan sobre ese cache sin requests adicionales
- **Barrel exports** — Cada módulo expone su API pública a través de `index.ts`

---

## Detalles técnicos

### Caching

El proyecto usa tres capas de cache complementarias:

1. **In-memory** (`productsCache`) — Los productos se descargan una sola vez y se almacenan en una variable de módulo. Todas las operaciones de filtro, búsqueda y paginación trabajan sobre este array
2. **TanStack Query** — `staleTime` de 5 minutos global, 1 minuto para sugerencias de búsqueda. Evita refetches mientras los datos sean frescos
3. **localStorage** (Zustand persist) — Carrito (`fakestore-cart`) y sesión (`fakestore-auth`) sobreviven al refresh del navegador

### Infinite scroll

`useInfiniteScroll` usa `IntersectionObserver` con `rootMargin: '200px'` — dispara el fetch 200px antes de que el sentinel sea visible. Paginación de 12 productos por página via `useInfiniteQuery`.

### Búsqueda con sugerencias

`SearchSuggestions` muestra hasta 6 resultados con miniatura y precio. Debounce de 500ms, mínimo 2 caracteres. Soporta navegación con ↑/↓/Enter/Escape y cierre al hacer click afuera.

### Shimmer loading

`ShimmerImage` reemplaza todos los `<img>` del proyecto. Muestra un skeleton animado (gradiente pulsante de 1.4s) y hace fade-in de 250ms al cargar. Extiende `ImgHTMLAttributes` para ser drop-in replacement.

### Filtros con URL sync

Todos los filtros del catálogo (`category`, `search`, `sortBy`, `deals`, `minPrice`, `maxPrice`) se sincronizan bidireccionalmente con `useSearchParams`. URLs limpias: los params falsy se eliminan automáticamente. El slider de precio tiene debounce de 300ms.

### API — FakeStore + enrichment

Consume `https://fakestoreapi.com/products` (20 productos, 4 categorías). Los productos se enriquecen con stock y descuento determinísticos usando el `id` como seed. Categorías y textos se traducen al español via archivos JSON en `src/i18n/`.

### Productos relacionados

Algoritmo de 3 niveles: (1) misma categoría por rating, (2) palabras comunes en título (filtra stop words ES/EN), (3) random con shuffle determinístico. Hasta 6 resultados.

### Responsive — Mobile-first

Estilos base para mobile, escalados con `min-width` breakpoints (`@tablet-up` ≥768px, `@desktop` ≥1024px, `@wide` ≥1280px). Sin ningún `max-width` media query en el proyecto.

### Performance

| Técnica                   | Uso                                                      |
| ------------------------- | -------------------------------------------------------- |
| `useMemo` / `useCallback` | Query keys, handlers de filtros, scroll, navegación      |
| `loading="lazy"`          | Todas las imágenes excepto el primer banner              |
| `ShimmerImage`            | Skeleton + fade-in durante la carga de imágenes          |
| Zustand selectors         | Cada componente suscribe solo a los valores que necesita |
| `staleTime`               | Evita refetches innecesarios en TanStack Query           |
| In-memory cache           | `productsCache` elimina requests duplicados              |

### CRO (Conversion Rate Optimization)

El proyecto aplica conceptos avanzados de **CRO** — la disciplina de optimizar la experiencia para maximizar la tasa de conversión (visitante → comprador):

| Técnica CRO                       | Implementación                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| **Reducción de fricción**         | Quick View modal permite ver producto y agregar al carrito sin cambiar de página          |
| **Urgencia y escasez**            | Badges de "¡Últimas unidades!" (stock ≤ 5) y "¡Oferta!" incentivan la compra inmediata    |
| **Carrito persistente**           | localStorage evita que el usuario pierda su selección al cerrar el navegador              |
| **Perceived performance**         | Shimmer loading y lazy images eliminan la sensación de lentitud, reduciendo el abandono   |
| **Búsqueda inteligente**          | Sugerencias con miniatura y precio (debounce 500ms) acortan el camino al producto deseado |
| **Cross-sell / Related products** | Algoritmo de 3 niveles muestra productos relacionados, aumentando el ticket promedio      |
| **URLs compartibles**             | Filtros en query params + Web Share API facilitan compartir catálogos filtrados           |
| **Mobile-first responsive**       | Experiencia optimizada para el dispositivo con mayor tasa de tráfico                      |
| **CTAs claros**                   | Botones "Agregar al carrito" visibles y accesibles en cards, detalle y quick view         |
