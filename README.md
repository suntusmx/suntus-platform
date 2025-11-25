# suntUS Platform

Plataforma completa de fitness y nutrición con arquitectura monorepo moderna.

## 🏗️ Arquitectura

Monorepo construido con **Turborepo** y **pnpm**, implementando Clean Architecture y mejores prácticas de desarrollo.

### Estructura del Proyecto

```
suntus-platform/
├── apps/
│   ├── suntus-services/     # Backend API (NestJS + Fastify + GraphQL)
│   ├── suntus-core/          # Web Admin (Next.js)
│   ├── suntus-landing/       # Landing Page (Next.js)
│   ├── suntus-app/           # App Móvil Usuario (React Native + Expo)
│   └── suntus-pro/           # App Móvil Experto (React Native + Expo)
├── packages/
│   ├── core/                 # Schemas Zod, tipos TypeScript compartidos
│   └── ui/                   # Componentes UI compartidos
└── docker-compose.yml        # Servicios Docker (PostgreSQL, Redis)
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 20
- pnpm >= 9.15.0
- Docker y Docker Compose

### Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servicios Docker (PostgreSQL, Redis)
docker-compose up -d

# Generar Prisma Client
pnpm --filter suntus-services prisma:generate

# Ejecutar migraciones
pnpm --filter suntus-services prisma:migrate dev
```

### Iniciar Servicios de Desarrollo

#### Opción 1: Iniciar todo de una vez
```bash
pnpm dev
```

#### Opción 2: Iniciar servicios individuales

**Backend API:**
```bash
pnpm --filter suntus-services start:dev
```

**Web Admin:**
```bash
pnpm --filter suntus-core dev
```

**Landing Page:**
```bash
pnpm --filter suntus-landing dev
```

**App Móvil Usuario:**
```bash
pnpm --filter suntus-app dev
```

**App Móvil Experto:**
```bash
pnpm --filter suntus-pro dev
```

## 📍 Puertos y URLs

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend API | 7000 | http://localhost:7000 |
| GraphQL Playground | 7000 | http://localhost:7000/graphql |
| Health Check | 7000 | http://localhost:7000/api/v1/health |
| Web Admin | 7001 | http://localhost:7001 |
| Landing Page | 7002 | http://localhost:7002 |
| App Usuario (Metro) | 7003 | http://localhost:7003 |
| App Experto (Metro) | 7004 | http://localhost:7004 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6380 | localhost:6380 |

## 🔐 Variables de Entorno

### Backend (suntus-services)

Crea un archivo `.env` en `apps/suntus-services/` con las siguientes variables **OBLIGATORIAS**:

```env
NODE_ENV=development
PORT=7000
DATABASE_URL=postgresql://suntus:suntus_dev@localhost:5432/suntus_db
CORS_ORIGIN=*
LOG_LEVEL=info
REDIS_URL=redis://localhost:6380  # Opcional
```

**⚠️ Importante:** Si falta alguna variable obligatoria, la aplicación lanzará un error al iniciar.

## 🛠️ Stack Tecnológico

### Backend
- **NestJS 11** con Fastify adapter
- **GraphQL** (Apollo Server) + REST API
- **Prisma** (ORM) + PostgreSQL
- **Zod** para validación (nestjs-zod)
- **Pino** para logging estructurado
- **@fastify/helmet** para seguridad HTTP
- **@fastify/compress** para compresión de respuestas

### Frontend Web
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **sharp** para optimización de imágenes

### Mobile
- **React Native 0.76**
- **Expo 52** con Expo Router
- **TypeScript**
- **expo-secure-store** para almacenamiento seguro

### Infraestructura
- **Turborepo** para monorepo
- **pnpm** para gestión de paquetes
- **Docker Compose** para servicios locales
- **PostgreSQL 15** (base de datos)
- **Redis 7** (caché)

## 🏛️ Arquitectura del Backend

Implementación de **Clean Architecture**:

```
src/
├── domain/              # Entidades y lógica de negocio
├── application/         # Casos de uso y DTOs
├── infrastructure/      # Implementaciones (Prisma, servicios externos)
└── presentation/       # Controllers REST y Resolvers GraphQL
```

### Características Principales

- ✅ **Validación global con Zod** - Todas las rutas validadas automáticamente
- ✅ **Manejo de errores centralizado** - Exception Filters globales
- ✅ **Logging estructurado** - Request ID tracking
- ✅ **API versionada** - `/api/v1` prefix
- ✅ **Seguridad HTTP** - Helmet configurado
- ✅ **Compresión** - Gzip/Brotli habilitado

## 📱 Apps Móviles

### Bundle IDs Configurados

- **suntus-app**: `com.suntus.app`
- **suntus-pro**: `com.suntus.pro`

### Desarrollo

Las apps móviles usan **Expo** con **Expo Router** para navegación basada en archivos.

**Para ver el QR code:**
1. Ejecuta `pnpm --filter suntus-app dev`
2. Abre http://localhost:7003 en el navegador
3. Escanea el QR code con Expo Go (iOS/Android)

**Almacenamiento seguro:**
- Usa `expo-secure-store` para tokens y datos sensibles
- Nunca uses `AsyncStorage` para información crítica

## 🗄️ Base de Datos

### Prisma

```bash
# Generar Prisma Client
pnpm --filter suntus-services prisma:generate

# Crear migración
pnpm --filter suntus-services prisma:migrate dev --name nombre_migracion

# Abrir Prisma Studio
pnpm --filter suntus-services prisma:studio
```

## 🧪 Scripts Disponibles

### Desde la raíz del proyecto

```bash
pnpm dev              # Iniciar todos los servicios en desarrollo
pnpm build            # Compilar todos los proyectos
pnpm lint             # Linter en todos los proyectos
pnpm format           # Formatear código con Prettier
pnpm test             # Ejecutar tests
pnpm clean            # Limpiar builds y node_modules
```

### Por servicio

```bash
# Backend
pnpm --filter suntus-services start:dev    # Desarrollo
pnpm --filter suntus-services build        # Compilar
pnpm --filter suntus-services prisma:studio # Prisma Studio

# Web
pnpm --filter suntus-core dev              # Desarrollo
pnpm --filter suntus-landing dev           # Desarrollo

# Mobile
pnpm --filter suntus-app dev               # Desarrollo
pnpm --filter suntus-app android           # Android
pnpm --filter suntus-app ios               # iOS
pnpm --filter suntus-app web               # Web
```

## 🔒 Seguridad Implementada

- ✅ **Helmet** - Headers de seguridad HTTP
- ✅ **Validación Zod global** - Prevención de datos inválidos
- ✅ **expo-secure-store** - Almacenamiento seguro en móviles
- ✅ **CORS configurado** - Control de orígenes permitidos
- ✅ **Variables de entorno obligatorias** - Sin valores por defecto inseguros

## ⚡ Performance

- ✅ **Compresión HTTP** - Gzip/Brotli automático
- ✅ **sharp** - Optimización de imágenes en Next.js
- ✅ **Fastify** - Servidor HTTP de alto rendimiento
- ✅ **Prisma** - ORM optimizado con conexiones pool

## 📚 Recursos

- [Documentación NestJS](https://docs.nestjs.com/)
- [Documentación Expo](https://docs.expo.dev/)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Prisma](https://www.prisma.io/docs)
- [Documentación Turborepo](https://turbo.build/repo/docs)

## 🤝 Contribuir

1. Crea una rama desde `main`
2. Realiza tus cambios
3. Ejecuta `pnpm lint` y `pnpm format`
4. Crea un Pull Request

## 🔄 Cambios Recientes

### FASE 0.2, 0.3, 0.4 - Configuración Base (Noviembre 2025)

#### Autenticación (FASE 0.4)
- **Backend (suntus-services):**
  - Integración con Auth0 para usuarios finales
  - Sistema de autenticación local para administradores (SystemAdmin)
  - JWT Strategy con Passport para validación de tokens
  - Endpoints: `/api/v1/auth/callback`, `/api/v1/auth/me`
  - Sincronización automática de usuarios Auth0 con base de datos

- **React Native (suntus-app, suntus-pro):**
  - Integración completa con Auth0 usando `react-native-auth0`
  - Cliente API con manejo automático de tokens (expo-secure-store)
  - Hooks de autenticación (`useAuth`) listos para usar
  - Flujo: Auth0 → Backend callback → Token interno → SecureStore

- **Next.js (suntus-landing):**
  - Integración con Auth0 usando `@auth0/nextjs-auth0`
  - Rutas automáticas de Auth0 (`/api/auth/[...auth0]`)
  - Sincronización con backend después del callback

- **Next.js (suntus-core):**
  - Sistema de autenticación local (NO Auth0)
  - Cliente API para login de administradores
  - Estructura lista para endpoints de admin en backend

#### Internacionalización (FASE 0.3)
- **Backend:**
  - i18next configurado con middleware automático
  - Detección de idioma desde query params, headers o perfil de usuario
  - Traducciones en `locales/es/` y `locales/en/`

- **React Native:**
  - i18next con detección automática del idioma del dispositivo
  - Traducciones para common y auth

- **Next.js (suntus-landing):**
  - Solución simple de i18n compatible con static export

- **Next.js (suntus-core):**
  - Sin i18n (solo español, hardcoded)

#### Mejoras de Seguridad
- **Variables de entorno obligatorias:** Todas las variables de entorno son requeridas (sin valores por defecto)
- **Validación con Zod:** Todas las variables se validan al inicio de la aplicación
- **Almacenamiento seguro:** Tokens en SecureStore (mobile) y localStorage (web admin)

#### Documentación
- **context.md:** Archivos con información crítica de cada proyecto (no en git)
- **README.md:** Documentación técnica para desarrolladores en cada proyecto
- **Estrategias:** Documentación de arquitectura y mejores prácticas

#### Estructura de Archivos Clave
```
apps/
├── suntus-services/
│   ├── src/auth/              # Módulo de autenticación
│   ├── src/common/i18n/       # Internacionalización
│   └── context.md            # Info crítica (local)
├── suntus-app/
│   ├── lib/                  # Auth0, API, i18n
│   ├── hooks/useAuth.ts      # Hook principal
│   └── context.md
├── suntus-pro/               # Similar a suntus-app
├── suntus-core/
│   ├── lib/auth.ts           # Auth local (NO Auth0)
│   └── context.md
└── suntus-landing/
    ├── src/app/api/auth/     # Rutas Auth0
    └── context.md
```

## 📝 Licencia

UNLICENSED - Proyecto privado
