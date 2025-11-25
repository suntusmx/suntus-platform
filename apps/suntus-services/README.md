# suntus-services - Backend API

API principal de la plataforma suntUS. Construida con NestJS siguiendo Clean Architecture.

## Arquitectura

El proyecto sigue **Clean Architecture** con las siguientes capas:

- **Domain:** Entidades puras, interfaces, enums (sin dependencias externas)
- **Application:** Use cases, DTOs, lógica de negocio
- **Infrastructure:** Repositorios (Prisma), servicios externos (Storage, etc.)
- **Presentation:** Controllers (REST), Resolvers (GraphQL)

## Componentes Clave

### Autenticación
- **AuthService** (`src/auth/auth.service.ts`): Sincroniza usuarios de Auth0 con la BD y genera JWTs internos
- **JwtStrategy** (`src/auth/strategies/jwt.strategy.ts`): Valida tokens JWT en requests
- **JwtAuthGuard** (`src/common/guards/jwt-auth.guard.ts`): Guard global que protege rutas (usa `@Public()` para bypass)

### Módulos Principales
- **UsersModule:** Gestión de usuarios (REST + GraphQL)
- **AuthModule:** Autenticación y autorización
- **AuditModule:** Auditoría automática de acciones
- **TermsModule:** Gestión de términos y condiciones
- **StorageModule:** Almacenamiento en GCS
- **SchedulerModule:** Jobs programados (payouts, escrow)

### Decoradores Útiles
- `@Public()`: Marca rutas como públicas (bypass de JWT)
- `@Roles('ADMIN', 'EXPERT')`: Restringe acceso por rol
- `@CurrentUser()`: Inyecta el usuario actual del request

### Middleware Global
- **RequestIdMiddleware:** Agrega ID único a cada request
- **I18nMiddleware:** Detecta idioma del usuario

### Interceptores Globales
- **TransformInterceptor:** Formatea respuestas
- **AuditInterceptor:** Registra acciones automáticamente

## Variables de Entorno

Todas las variables son **OBLIGATORIAS** (sin defaults). Ver `src/common/config/env.validation.ts`.

## Desarrollo

```bash
# Desarrollo
pnpm dev

# Migraciones Prisma
pnpm prisma migrate dev
pnpm prisma generate

# Seed
pnpm prisma db seed
```

## Endpoints Principales

- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/callback` - Callback de Auth0
- `GET /api/v1/auth/me` - Usuario actual
