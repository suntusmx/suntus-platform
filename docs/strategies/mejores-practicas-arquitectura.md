# Mejores Prácticas de Arquitectura - suntUS Platform

Este documento establece las reglas y principios de alto nivel para el desarrollo en la plataforma suntUS. Estas prácticas garantizan consistencia, mantenibilidad y escalabilidad del código.

---

## 1. Mejores Prácticas de React Native

### 1.1 Arquitectura de Componentes

**Regla:** Organizar componentes siguiendo una estructura jerárquica clara.

- **Componentes Presentacionales:** Solo reciben props y renderizan UI. No manejan lógica de negocio.
- **Componentes Contenedores:** Manejan estado y lógica, delegan renderizado a componentes presentacionales.
- **Hooks Personalizados:** Extraer lógica reutilizable en hooks custom (`useAuth`, `useWorkout`, etc.).

**Estructura de Carpetas:**
```
screens/
  ├── Home/
  │   ├── HomeScreen.tsx        # Contenedor
  │   ├── HomeScreen.test.tsx
  │   └── components/            # Componentes específicos de esta pantalla
  │       ├── WorkoutCard.tsx
  │       └── ProgressChart.tsx
  └── Profile/
      └── ProfileScreen.tsx
```

### 1.2 Manejo de Estado

**Regla:** Usar el patrón de estado apropiado según la complejidad.

- **Estado Local:** `useState` para estado de UI simple (modales, toggles).
- **Estado Compartido:** Context API para estado que se comparte entre pocos componentes.
- **Estado Global:** Zustand o Redux Toolkit para estado complejo que cruza múltiples pantallas.
- **Estado del Servidor:** React Query o SWR para datos del backend (cache, sincronización automática).

**Principio:** Evitar prop drilling. Si pasas props más de 2 niveles, considera Context o estado global.

### 1.3 Navegación

**Regla:** Usar Expo Router para navegación basada en archivos.

- **Rutas por Archivo:** `app/(tabs)/home.tsx` → `/home`
- **Deep Linking:** Configurar automáticamente con Expo Router.
- **Navegación Tipada:** Usar tipos generados para rutas y parámetros.

**Estructura:**
```
app/
  ├── (tabs)/              # Tabs principales
  │   ├── home.tsx
  │   ├── workouts.tsx
  │   └── profile.tsx
  ├── (auth)/              # Stack de autenticación
  │   ├── login.tsx
  │   └── register.tsx
  └── workout/[id].tsx     # Ruta dinámica
```

### 1.4 Performance

**Regla:** Optimizar renderizado y memoria desde el día 1.

- **Memoización:** `React.memo` para componentes que reciben props que cambian frecuentemente.
- **Lazy Loading:** `React.lazy` o `expo-router` lazy loading para pantallas pesadas.
- **FlatList Optimizada:** Siempre usar `keyExtractor`, `getItemLayout` cuando sea posible.
- **Imágenes:** Usar `expo-image` con `cachePolicy` y tamaños optimizados.
- **Evitar Re-renders:** No crear objetos/funciones nuevas en el render (usar `useMemo`, `useCallback`).

**Métrica Objetivo:** 60 FPS constante, tiempo de carga inicial < 2 segundos.

### 1.5 Gestión de Assets

**Regla:** Organizar assets de forma escalable.

- **Assets Locales:** En `assets/` de cada app. Solo para assets específicos de la app.
- **Assets Compartidos:** En `packages/ui/assets/` si se comparten entre apps.
- **Imágenes Remotas:** Usar CDN (Cloud Storage) para imágenes dinámicas.
- **Optimización:** Comprimir imágenes antes de commitear. Usar formatos modernos (WebP, AVIF).

### 1.6 Manejo de Errores

**Regla:** Implementar manejo de errores a nivel de aplicación.

- **Error Boundaries:** Crear un componente que capture errores de renderizado.
- **Try-Catch:** En funciones async y llamadas a API.
- **Logging:** Usar Sentry o similar para tracking de errores en producción.
- **Feedback al Usuario:** Mostrar mensajes de error amigables, nunca stack traces.

**Estructura:**
```
components/
  └── ErrorBoundary.tsx    # Captura errores de React
utils/
  └── errorHandler.ts      # Utilidades para manejo de errores
```

### 1.7 Testing

**Regla:** Escribir tests para lógica crítica y componentes complejos.

- **Unit Tests:** Para hooks, utilidades, funciones puras.
- **Component Tests:** Para componentes con lógica compleja.
- **E2E Tests:** Para flujos críticos (login, checkout, creación de plan).

**Cobertura Mínima:** 70% para lógica de negocio, 50% para componentes UI.

### 1.8 Accesibilidad

**Regla:** Hacer la app accesible desde el inicio.

- **Labels:** Siempre usar `accessibilityLabel` en botones e imágenes.
- **Roles:** Definir `accessibilityRole` apropiado.
- **Contraste:** Verificar que colores cumplan WCAG AA mínimo.
- **Tamaños Táctiles:** Botones mínimo 44x44 puntos.

---

## 2. Mejores Prácticas de Next.js

### 2.1 Arquitectura de Rutas (App Router)

**Regla:** Aprovechar el App Router de Next.js 15 para organización clara.

- **Rutas por Archivo:** `app/dashboard/page.tsx` → `/dashboard`
- **Layouts Anidados:** Usar `layout.tsx` para compartir UI entre rutas.
- **Loading States:** `loading.tsx` para estados de carga automáticos.
- **Error Handling:** `error.tsx` para manejo de errores por ruta.

**Estructura:**
```
app/
  ├── layout.tsx              # Layout raíz
  ├── page.tsx                # Homepage
  ├── dashboard/
  │   ├── layout.tsx          # Layout del dashboard
  │   ├── page.tsx
  │   └── settings/
  │       └── page.tsx
  └── api/                    # API Routes
      └── users/
          └── route.ts
```

### 2.2 Renderizado

**Regla:** Elegir la estrategia de renderizado correcta.

- **Static (SSG):** Para contenido que no cambia (landing pages, blogs). Usar `output: 'export'`.
- **Server Components (Default):** Para contenido dinámico que requiere datos del servidor.
- **Client Components:** Solo cuando necesitas interactividad (hooks, eventos, estado).

**Principio:** Por defecto Server Components. Marcar con `'use client'` solo cuando sea necesario.

### 2.3 Data Fetching

**Regla:** Usar las APIs nativas de Next.js para fetching.

- **Server Components:** Fetch directo (Next.js cachea automáticamente).
- **Client Components:** React Query o SWR para datos que cambian.
- **API Routes:** Solo para webhooks, autenticación, o lógica que no puede ir en Server Components.

**Caching:**
- `fetch()` con `cache: 'force-cache'` para datos estáticos.
- `revalidate` para ISR (Incremental Static Regeneration).
- `cache: 'no-store'` para datos siempre frescos.

### 2.4 Optimización de Performance

**Regla:** Aplicar optimizaciones desde el inicio.

- **Imágenes:** Siempre usar `next/image` con `priority` para above-the-fold.
- **Fuentes:** Usar `next/font` para optimización automática.
- **Code Splitting:** Automático con App Router. No necesitas configurar manualmente.
- **Bundle Analysis:** Revisar periódicamente con `@next/bundle-analyzer`.

**Métricas Objetivo:**
- Lighthouse Performance > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### 2.5 SEO

**Regla:** Implementar SEO técnico desde el día 1.

- **Metadata API:** Exportar `metadata` en cada `page.tsx`.
- **Structured Data:** JSON-LD para rich snippets.
- **Sitemap:** Generar automáticamente con `sitemap.ts`.
- **Robots.txt:** Configurar en `robots.ts`.

**Ejemplo Mínimo:**
```typescript
export const metadata = {
  title: 'Página',
  description: 'Descripción',
  openGraph: { ... }
}
```

### 2.6 Seguridad

**Regla:** Proteger datos sensibles y endpoints.

- **Variables de Entorno:** `NEXT_PUBLIC_*` solo para valores públicos. Secretos en servidor.
- **API Routes:** Validar autenticación y autorización.
- **CSRF Protection:** Next.js lo maneja automáticamente.
- **XSS Prevention:** No usar `dangerouslySetInnerHTML` sin sanitizar.

### 2.7 Manejo de Estado

**Regla:** Usar el patrón correcto según el caso.

- **Server State:** React Query o SWR (datos del servidor).
- **Client State:** `useState` o Zustand (UI state, formularios).
- **URL State:** `useSearchParams` para filtros, paginación (shareable).

**Principio:** Minimizar estado global. Preferir estado local o en URL.

### 2.8 Testing

**Regla:** Tests enfocados en funcionalidad crítica.

- **Unit Tests:** Para utilidades, helpers, funciones puras.
- **Component Tests:** Para componentes con lógica compleja.
- **E2E Tests:** Para flujos críticos (Playwright recomendado).

---

## 3. Mejores Prácticas de NestJS + Fastify + GraphQL/Apollo

### 3.1 Arquitectura Clean Architecture

**Regla:** Organizar código siguiendo Clean Architecture con capas bien definidas.

**Estructura de Carpetas:**
```
src/
  ├── domain/                 # Entidades puras, reglas de negocio
  │   ├── entities/
  │   │   └── user.entity.ts
  │   └── value-objects/
  │       └── email.vo.ts
  │
  ├── application/            # Casos de uso, servicios de aplicación
  │   ├── use-cases/
  │   │   ├── create-user.use-case.ts
  │   │   └── get-user.use-case.ts
  │   └── dto/
  │       └── create-user.dto.ts
  │
  ├── infrastructure/          # Implementaciones técnicas
  │   ├── database/
  │   │   └── prisma/
  │   │       └── user.repository.ts
  │   ├── external/
  │   │   └── auth0/
  │   │       └── auth0.service.ts
  │   └── cache/
  │       └── redis.service.ts
  │
  └── presentation/           # Controllers, Resolvers, Middleware
      ├── rest/
      │   └── users.controller.ts
      └── graphql/
          ├── users.resolver.ts
          └── users.type.ts
```

**Principio:** Las dependencias apuntan hacia adentro. Domain no depende de nada, Infrastructure depende de Application, Presentation depende de Application.

### 3.2 Organización por Módulos

**Regla:** Un módulo por dominio de negocio.

- **Feature Modules:** `users.module.ts`, `workouts.module.ts`, `payments.module.ts`
- **Shared Modules:** `database.module.ts`, `cache.module.ts`, `auth.module.ts`
- **Core Module:** `app.module.ts` importa todos los módulos.

**Estructura:**
```
src/
  ├── users/
  │   ├── users.module.ts
  │   ├── users.controller.ts
  │   ├── users.resolver.ts
  │   ├── users.service.ts
  │   └── dto/
  └── workouts/
      └── ...
```

### 3.3 Fastify Adapter

**Regla:** Usar Fastify para mejor performance.

- **Configuración:** Usar `NestFastifyApplication` en lugar de `NestApplication`.
- **Plugins:** Aprovechar el ecosistema de Fastify (rate limiting, compression, etc.).
- **Validación:** Usar `@fastify/type-provider-typebox` o Zod para validación de requests.

**Principio:** Fastify es 2x más rápido que Express. Usar siempre que sea posible.

### 3.4 GraphQL con Apollo Server

**Regla:** Implementar GraphQL siguiendo Code First approach.

- **Code First:** Escribir clases TypeScript, NestJS genera el schema.
- **Resolvers:** Un resolver por entidad principal.
- **DataLoader:** Usar para evitar N+1 queries.
- **Subscriptions:** Para datos en tiempo real (chat, notificaciones).

**Estructura:**
```
graphql/
  ├── users/
  │   ├── users.resolver.ts      # Resolvers
  │   ├── users.type.ts          # Object Types
  │   └── users.input.ts         # Input Types
  └── workouts/
      └── ...
```

**Principios:**
- Un resolver = una responsabilidad.
- Usar `@Field()` decorators para tipado automático.
- Validar inputs con class-validator.

### 3.5 REST API (Complementaria)

**Regla:** REST para endpoints simples, GraphQL para queries complejas.

- **REST:** Webhooks, callbacks de pago, endpoints de autenticación.
- **GraphQL:** 90% de las queries de las apps (evita over-fetching).

**Convenciones REST:**
- `GET /users` - Listar
- `GET /users/:id` - Obtener uno
- `POST /users` - Crear
- `PATCH /users/:id` - Actualizar parcial
- `DELETE /users/:id` - Eliminar

### 3.6 Validación y DTOs

**Regla:** Validar TODO lo que entra al backend.

- **Zod Schemas:** En `@suntus/core` para validación compartida frontend/backend.
- **class-validator:** Para DTOs de NestJS (decorators).
- **Pipes:** Usar `ValidationPipe` globalmente.

**Principio:** Nada entra al backend sin validación. Si falla, rechazar inmediatamente.

### 3.7 Manejo de Errores

**Regla:** Implementar manejo de errores consistente.

- **Exception Filters:** Crear filtros personalizados por tipo de error.
- **HTTP Exceptions:** Usar `HttpException` de NestJS para errores HTTP.
- **GraphQL Errors:** Usar `GraphQLException` para errores de GraphQL.
- **Logging:** Loggear todos los errores con contexto (userId, requestId, stack trace).

**Estructura:**
```
common/
  ├── filters/
  │   ├── http-exception.filter.ts
  │   └── graphql-exception.filter.ts
  └── exceptions/
      ├── not-found.exception.ts
      └── unauthorized.exception.ts
```

### 3.8 Autenticación y Autorización

**Regla:** Separar autenticación (quién eres) de autorización (qué puedes hacer).

- **Autenticación:** Auth0 valida el JWT. Middleware verifica el token.
- **Autorización:** Guards de NestJS verifican roles/permissions.
- **Context:** Inyectar usuario autenticado en el contexto de GraphQL/REST.

**Implementación:**
- `@UseGuards(JwtAuthGuard)` en controllers/resolvers.
- `@Roles('admin', 'trainer')` para autorización basada en roles.
- `@CurrentUser()` decorator para obtener usuario del request.

### 3.9 Caché y Performance

**Regla:** Cachear datos que se leen frecuentemente.

- **Redis:** Cache-Aside pattern para datos de BD.
- **TTL Inteligente:** Datos que cambian poco (perfiles) → TTL largo. Datos dinámicos → TTL corto.
- **Invalidación:** Eliminar cache cuando se actualiza (mutation).

**Estrategia:**
1. Check Redis
2. Si hit → devolver
3. Si miss → consultar BD → guardar en Redis → devolver

### 3.10 Logging

**Regla:** Logging estructurado con contexto.

- **Pino:** Logger estructurado (JSON) para fácil parsing.
- **Niveles:** `error`, `warn`, `info`, `debug`.
- **Contexto:** Incluir `userId`, `requestId`, `timestamp` en cada log.
- **Destino:** Cloud Logging (GCP) en producción.

**Principio:** Logs deben ser buscables y parseables. JSON es mejor que texto plano.

### 3.11 Testing

**Regla:** Tests en todas las capas.

- **Unit Tests:** Services, use cases, utilidades.
- **Integration Tests:** Controllers/Resolvers con BD de test.
- **E2E Tests:** Flujos completos (crear usuario, crear plan, etc.).

**Cobertura Mínima:** 80% para lógica de negocio, 60% para controllers/resolvers.

---

## 4. Mejores Prácticas de Base de Datos

### 4.1 Diseño de Esquema

**Regla:** Diseñar esquema pensando en queries, no solo en normalización.

- **Normalización:** Hasta 3NF para datos relacionales (usuarios, pagos).
- **Denormalización Controlada:** Para performance (contadores, agregados).
- **JSONB:** Usar para datos flexibles (metadata de ejercicios, traducciones).

**Principio:** Balance entre normalización (consistencia) y denormalización (performance).

### 4.2 Índices

**Regla:** Crear índices estratégicos desde el inicio.

- **Primary Keys:** Automáticos, no tocar.
- **Foreign Keys:** Índices automáticos en Prisma.
- **Búsquedas Frecuentes:** Índices en campos que se filtran/buscan.
- **Composites:** Índices compuestos para queries con múltiples WHERE.

**Cuándo Indexar:**
- Campos en WHERE frecuentes
- Campos en ORDER BY
- Campos en JOIN
- Campos únicos (email, username)

**Cuándo NO Indexar:**
- Campos que cambian constantemente
- Tablas pequeñas (< 1000 registros)
- Campos con baja cardinalidad (género, estado booleano)

### 4.3 Migraciones

**Regla:** Migraciones como código, versionadas y reversibles.

- **Prisma Migrate:** Usar para todas las migraciones.
- **Naming:** `YYYYMMDDHHMMSS_description/migration.sql`
- **Reversibilidad:** Siempre poder hacer rollback.
- **Testing:** Probar migraciones en staging antes de producción.

**Workflow:**
1. Modificar schema.prisma
2. `prisma migrate dev --name description`
3. Revisar SQL generado
4. Commit de migración
5. Aplicar en staging
6. Aplicar en producción

### 4.4 Queries Optimizadas

**Regla:** Escribir queries eficientes desde el inicio.

- **Select Específico:** No usar `SELECT *`. Seleccionar solo campos necesarios.
- **Evitar N+1:** Usar `include` o `select` en Prisma para cargar relaciones.
- **Paginación:** Siempre paginar listas grandes (cursor-based o offset-based).
- **Batching:** Agrupar queries cuando sea posible.

**Anti-patterns a Evitar:**
- N+1 queries (hacer query en loop)
- SELECT * en tablas grandes
- Queries sin límite
- JOINs innecesarios

### 4.5 Transacciones

**Regla:** Usar transacciones para operaciones atómicas.

- **Cuándo Usar:** Operaciones que deben ser todo-o-nada (crear usuario + suscripción, pago + actualizar saldo).
- **Prisma Transactions:** `prisma.$transaction()` para múltiples operaciones.
- **Isolation Levels:** Usar el nivel apropiado (READ COMMITTED por defecto es suficiente).

**Principio:** Si falla una parte, debe fallar todo. No dejar datos inconsistentes.

### 4.6 JSONB (PostgreSQL)

**Regla:** Usar JSONB para datos flexibles y estructurados.

- **Cuándo Usar:** Metadata, traducciones, configuraciones, logs de auditoría.
- **Índices:** Crear índices GIN en campos JSONB que se consultan frecuentemente.
- **Validación:** Validar estructura con Zod antes de guardar.

**Ejemplo de Uso:**
- Ejercicios: `metadata` JSONB con músculos, equipamiento, video URL
- Traducciones: `translations` JSONB con `{es: {...}, en: {...}}`
- Logs: `payload` JSONB con datos del evento

### 4.7 Backups y Recuperación

**Regla:** Backups automáticos y probados.

- **Frecuencia:** Backups diarios como mínimo.
- **Retención:** 30 días de backups diarios, 12 meses de backups mensuales.
- **Testing:** Probar restauración periódicamente (trimestral).
- **Point-in-Time Recovery:** Habilitar WAL archiving para recuperación granular.

### 4.8 Monitoreo

**Regla:** Monitorear performance y salud de la BD.

- **Métricas Clave:** Query time, conexiones activas, tamaño de BD, locks.
- **Slow Queries:** Identificar y optimizar queries > 100ms.
- **Alertas:** Configurar alertas para conexiones altas, espacio bajo, queries lentas.

### 4.9 Seguridad

**Regla:** Proteger datos sensibles.

- **Conexión:** Usar SSL/TLS siempre.
- **Credenciales:** Variables de entorno, nunca en código.
- **Principle of Least Privilege:** Usuario de aplicación con permisos mínimos necesarios.
- **Encriptación:** Encriptar datos sensibles (PII, tarjetas) a nivel de aplicación.

### 4.10 Escalabilidad

**Regla:** Diseñar para escalar desde el inicio.

- **Read Replicas:** Para distribuir carga de lectura.
- **Connection Pooling:** Configurar pool apropiado (PgBouncer recomendado).
- **Particionamiento:** Considerar particionamiento para tablas muy grandes (> 10M registros).
- **Archiving:** Mover datos antiguos a almacenamiento frío.

---

## 5. Principios Generales Aplicables a Todas las Capas

### 5.1 SOLID

**Regla:** Aplicar principios SOLID consistentemente.

- **S - Single Responsibility:** Una clase/función = una responsabilidad.
- **O - Open/Closed:** Abierto para extensión, cerrado para modificación.
- **L - Liskov Substitution:** Subtipos deben ser sustituibles por sus tipos base.
- **I - Interface Segregation:** Interfaces pequeñas y específicas.
- **D - Dependency Inversion:** Depender de abstracciones, no de implementaciones.

### 5.2 DRY (Don't Repeat Yourself)

**Regla:** No duplicar código. Extraer a funciones/componentes/hooks reutilizables.

**Cuándo Extraer:**
- Código usado en 2+ lugares
- Lógica compleja que merece su propia función
- Componentes UI que se repiten

**Cuándo NO Extraer:**
- Código usado una sola vez (YAGNI - You Aren't Gonna Need It)
- Abstracciones prematuras

### 5.3 YAGNI (You Aren't Gonna Need It)

**Regla:** No construir funcionalidad hasta que sea necesaria.

- Implementar solo lo que se necesita ahora
- Evitar over-engineering
- Refactorizar cuando surja la necesidad real

### 5.4 KISS (Keep It Simple, Stupid)

**Regla:** La solución más simple que funcione es la mejor.

- Elegir la herramienta más simple que resuelva el problema
- Evitar complejidad innecesaria
- Código legible > código "inteligente"

### 5.5 Code Review

**Regla:** Todo código debe ser revisado antes de merge.

- Mínimo 1 aprobación para merge
- Revisar funcionalidad, tests, performance, seguridad
- Feedback constructivo y respetuoso

### 5.6 Documentación

**Regla:** Documentar lo que no es obvio.

- README en cada módulo/feature complejo
- Comentarios para "por qué", no "qué" (el código explica el qué)
- JSDoc/TSDoc para APIs públicas

---

## 6. Checklist de Implementación

### React Native
- [ ] Estructura de carpetas por feature/screen
- [ ] Estado local vs global definido
- [ ] Expo Router configurado
- [ ] Performance optimizada (memo, lazy loading)
- [ ] Error boundaries implementados
- [ ] Tests para lógica crítica

### Next.js
- [ ] App Router con estructura clara
- [ ] Server Components por defecto
- [ ] Metadata API configurado
- [ ] Imágenes optimizadas
- [ ] SEO implementado
- [ ] Variables de entorno seguras

### NestJS
- [ ] Clean Architecture implementada
- [ ] Fastify adapter configurado
- [ ] GraphQL Code First
- [ ] Validación en todos los inputs
- [ ] Manejo de errores consistente
- [ ] Autenticación/autorización
- [ ] Logging estructurado
- [ ] Tests con buena cobertura

### Base de Datos
- [ ] Esquema normalizado apropiadamente
- [ ] Índices en campos críticos
- [ ] Migraciones versionadas
- [ ] Queries optimizadas
- [ ] Transacciones donde necesario
- [ ] Backups configurados
- [ ] Monitoreo activo

---

**Última actualización:** Diciembre 2024  
**Mantenedor:** Equipo de Desarrollo suntUS

