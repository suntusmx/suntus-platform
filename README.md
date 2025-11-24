# suntUS Platform

Plataforma completa de fitness y bienestar construida con un monorepo moderno usando **Turborepo** y **pnpm**.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Desarrollo](#desarrollo)
- [Build y Producción](#build-y-producción)
- [Configuración](#configuración)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

**suntUS** es una plataforma integral que conecta usuarios con expertos en fitness y nutrición. El proyecto está organizado como un monorepo que contiene:

- **2 Apps Móviles** (React Native / Expo) para usuarios y expertos
- **2 Aplicaciones Web** (Next.js) para administración y marketing
- **1 Backend API** (NestJS) que centraliza la lógica de negocio
- **Packages Compartidos** para lógica común, UI y configuración

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    suntUS Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  suntus-app (Usuarios)    ──┐                           │
│  suntus-pro (Expertos)    ──┼──►  suntus-services       │
│  suntus-core (Admin)      ──┤     (NestJS API)          │
│  suntus-landing (Marketing)─┘                           │
│                                                             │
│  packages/                                                 │
│    ├── @suntus/core    (Lógica compartida, Zod schemas)     │
│    ├── @suntus/ui      (Componentes UI compartidos)        │
│    └── @suntus/config  (Configs ESLint, TypeScript)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Diagrama de Comunicación

```
┌─────────────┐         ┌─────────────┐
│ suntus-app │────────▶│             │
│ (Usuarios)  │         │             │
└─────────────┘         │             │
                        │  suntus-    │
┌─────────────┐         │  services   │
│ suntus-pro │────────▶│  (NestJS)   │
│ (Expertos)  │         │             │
└─────────────┘         │             │
                        │             │
┌─────────────┐         │             │
│ suntus-core │────────▶│             │
│ (Admin Web) │         └─────────────┘
└─────────────┘
```

## Tecnologías

### Frontend
- **React Native** `^0.76.5` - Apps móviles multiplataforma
- **Expo SDK** `~52.0.0` - Framework y herramientas para React Native
- **Next.js** `^15.1.6` - Framework React para web (SSR/SSG)
- **React** `^18.3.1` - Biblioteca UI
- **TypeScript** `^5.7.3` - Tipado estático

### Backend
- **NestJS** `^11.0.1` - Framework Node.js con arquitectura modular
- **Fastify** (próximamente) - Adapter HTTP de alto rendimiento
- **GraphQL** (próximamente) - API con Apollo Server
- **Prisma** (próximamente) - ORM para PostgreSQL

### Herramientas
- **Turborepo** `^2.6.1` - Build system para monorepos
- **pnpm** `9.15.0` - Gestor de paquetes rápido y eficiente
- **ESLint** `^9.18.0` - Linter de código
- **Prettier** `^3.4.2` - Formateador de código

### Packages Compartidos
- **Zod** `^3.23.8` - Validación de esquemas TypeScript-first
- **date-fns** `^4.1.0` - Utilidades para manejo de fechas

## Estructura del Proyecto

```
suntus-platform/
├── apps/
│   ├── suntus-app/          # App móvil para usuarios (Expo)
│   ├── suntus-pro/          # App móvil para expertos (Expo)
│   ├── suntus-core/         # Panel de administración (Next.js)
│   ├── suntus-landing/      # Landing page marketing (Next.js SSG)
│   └── suntus-services/     # Backend API (NestJS)
│
├── packages/
│   ├── core/                # Lógica de negocio compartida
│   │   └── src/
│   │       ├── schemas/     # Schemas Zod
│   │       ├── types/        # Tipos TypeScript
│   │       └── utils/        # Utilidades
│   │
│   ├── ui/                  # Componentes UI compartidos
│   │   └── src/
│   │       ├── components/   # Componentes React
│   │       └── tokens/       # Design tokens
│   │
│   └── config/              # Configuraciones compartidas
│       ├── eslint-preset.js
│       └── tsconfig.json
│
├── docs/                    # Documentación
├── .gitignore
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # Configuración de workspace
├── turbo.json              # Configuración de Turborepo
└── README.md
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** `>=20` (LTS recomendado)
- **pnpm** `>=9.15.0`
- **Git**

### Instalación de pnpm

```bash
npm install -g pnpm@9.15.0
```

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd suntus-platform
```

2. **Configurar variables de entorno**

```bash
# Variables para Docker Compose
cp .env.docker.example .env.docker

# Variables para las apps
cp .env.example .env.local
cp apps/suntus-services/.env.example apps/suntus-services/.env.local

# Editar .env.docker si necesitas cambiar puertos o credenciales de Docker
# Editar .env.local con tus valores según sea necesario
```

3. **Iniciar servicios de desarrollo (PostgreSQL y Redis)**

```bash
# Iniciar Docker Compose
docker-compose up -d

# Verificar que están corriendo
docker-compose ps
```

4. **Instalar dependencias**

```bash
pnpm install
```

Esto instalará todas las dependencias de todas las apps y packages en el monorepo.

5. **Verificar la instalación**

```bash
pnpm turbo run build
```

**Nota:** Para más detalles sobre configuración de entornos (desarrollo vs producción), ver [Configuración de Entornos](./docs/strategies/configuracion-entornos.md)

## Scripts Disponibles

### Scripts del Root (Monorepo)

```bash
# Desarrollo - Inicia todas las apps en modo desarrollo
pnpm dev

# Build - Construye todas las apps y packages
pnpm build

# Lint - Ejecuta ESLint en todo el monorepo
pnpm lint

# Formatear código - Ejecuta Prettier
pnpm format

# Limpiar - Elimina node_modules y archivos de build
pnpm clean
```

### Scripts por App

#### Apps Móviles (suntus-app, suntus-pro)

```bash
# Desde la raíz
pnpm --filter suntus-app dev
pnpm --filter suntus-pro dev

# O desde la carpeta de la app
cd apps/suntus-app
pnpm start          # Inicia Expo
pnpm android        # Inicia en Android
pnpm ios            # Inicia en iOS
pnpm web            # Inicia en web
```

#### Apps Web (suntus-core, suntus-landing)

```bash
# Desde la raíz
pnpm --filter suntus-core dev
pnpm --filter suntus-landing dev

# O desde la carpeta de la app
cd apps/suntus-core
pnpm dev            # Desarrollo (puerto 3000)
pnpm build          # Build de producción
pnpm start          # Servidor de producción
```

#### Backend (suntus-services)

```bash
# Desde la raíz
pnpm --filter suntus-services dev

# O desde la carpeta de la app
cd apps/suntus-services
pnpm start:dev      # Desarrollo con hot reload
pnpm build          # Build de producción
pnpm start:prod     # Servidor de producción
pnpm test           # Ejecutar tests
```

## Desarrollo

### Iniciar todas las apps en desarrollo

```bash
pnpm dev
```

Esto iniciará:
- Metro Bundler para las apps móviles
- Next.js dev server para las apps web
- NestJS dev server para el backend

### Desarrollo de una app específica

```bash
# App móvil
pnpm --filter suntus-app dev

# App web
pnpm --filter suntus-core dev

# Backend
pnpm --filter suntus-services dev
```

### Trabajar con packages compartidos

Los packages compartidos (`@suntus/core`, `@suntus/ui`, `@suntus/config`) se pueden importar directamente en cualquier app:

```typescript
// En cualquier app
import { UserSchema } from '@suntus/core';
import { Button } from '@suntus/ui';
```

Turborepo maneja automáticamente las dependencias y reconstruye los packages cuando cambian.

### Hot Reload

- **Apps Móviles**: Metro Bundler recarga automáticamente los cambios
- **Next.js**: Fast Refresh está habilitado por defecto
- **NestJS**: `start:dev` recarga automáticamente con `--watch`

## Build y Producción

### Build completo

```bash
pnpm build
```

Esto construye todas las apps y packages en el orden correcto (Turborepo maneja las dependencias).

### Build de una app específica

```bash
pnpm --filter suntus-core build
```

### Outputs de Build

- **Apps Móviles**: Preparadas para EAS Build (Expo)
- **suntus-core**: `.next/` (Next.js)
- **suntus-landing**: `out/` (Next.js SSG)
- **suntus-services**: `dist/` (NestJS compilado)
- **Packages**: No generan build (TypeScript se transpila en tiempo de ejecución)

## Configuración

### Variables de Entorno

Cada app tiene su propio archivo `.env.local` (no commiteado). Copia desde `.env.example`:


**Nota:** 
- Los archivos `.env.local` están en `.gitignore`. 
- Usa `.env.example` como template.
- Para desarrollo: `docker-compose up -d` inicia PostgreSQL y Redis.
- Para producción: Configurar Cloud SQL y Upstash según [Configuración de Entornos](./docs/strategies/configuracion-entornos.md)

### Configuración de Metro (React Native)

Las apps móviles tienen `metro.config.js` configurado para trabajar con el monorepo. Esto permite que Metro encuentre los packages compartidos.

### Configuración de Next.js

Las apps Next.js tienen `transpilePackages` configurado para compilar los packages compartidos:

```typescript
// apps/suntus-core/next.config.ts
transpilePackages: ['@suntus/ui', '@suntus/core']
```

### Configuración de Turborepo

El archivo `turbo.json` define el pipeline de build:

- `dependsOn: ["^build"]` - Construye dependencias primero
- `outputs` - Define qué carpetas cachear
- `cache: false` para `dev` - No cachear en desarrollo

## Testing

```bash
# Ejecutar todos los tests
pnpm turbo run test

# Tests de una app específica
pnpm --filter suntus-services test
```

## Linting y Formateo

```bash
# Lint todo el monorepo
pnpm lint

# Formatear código
pnpm format
```

## Troubleshooting

### Problemas con Metro (React Native)

Si Metro no encuentra los packages compartidos:

1. Verifica que `metro.config.js` existe en la app
2. Reinicia Metro: `r` en la terminal de Metro
3. Limpia el cache: `pnpm --filter suntus-app start --clear`

### Problemas con dependencias

Si hay problemas con dependencias:

```bash
# Limpiar todo
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f pnpm-lock.yaml

# Reinstalar
pnpm install
```

### Problemas con TypeScript

Si TypeScript no encuentra los packages:

1. Verifica que los packages están en `pnpm-workspace.yaml`
2. Ejecuta `pnpm install` de nuevo
3. Reinicia el servidor de TypeScript en tu IDE

## Contribución

1. Crea una rama desde `main`
2. Realiza tus cambios
3. Asegúrate de que los tests pasen: `pnpm turbo run test`
4. Asegúrate de que el lint pase: `pnpm lint`
5. Crea un Pull Request

### Convenciones de Código

- Usa TypeScript estricto
- Sigue las reglas de ESLint
- Formatea con Prettier antes de commitear
- Escribe tests para nueva funcionalidad
- Documenta funciones complejas

## Documentación Adicional

- [Plan de Implementación](./docs/strategies/turborepo-implementation-plan.md)
- [Mejores Prácticas de Arquitectura](./docs/strategies/mejores-practicas-arquitectura.md)
- [Configuración de Entornos](./docs/strategies/configuracion-entornos.md)


**Desarrollado para suntUS**

