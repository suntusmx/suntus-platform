# suntus-core - Panel de Administración

Panel de administración web para gestionar la plataforma suntUS. Construido con Next.js 15.

## Stack Tecnológico

- **Next.js 15:** Framework React con App Router
- **Tailwind CSS:** Estilos
- **Autenticación Local:** Sistema propio (NO Auth0)

## Componentes Clave

### Autenticación
- **useAuth** (`hooks/useAuth.ts`): Hook para autenticación local
  - `login({ email, password })`: Login con credenciales
  - `logout()`: Cierra sesión
  - `getCurrentUser()`: Obtiene admin actual

- **auth.ts** (`lib/auth.ts`): Servicio de autenticación
  - Login local contra endpoint `/api/v1/admin/auth/login`
  - Gestiona tokens JWT en localStorage

- **api.ts** (`lib/api.ts`): Cliente API
  - Agrega automáticamente token JWT a requests
  - Lee token de localStorage (`suntus_admin_token`)

### Estructura de Rutas

```
src/app/
├── layout.tsx      # Root layout
├── page.tsx        # Home
└── dashboard/      # Dashboard admin
    └── page.tsx
```

## Variables de Entorno

Todas las variables son **OBLIGATORIAS**:

- `NEXT_PUBLIC_API_URL`: URL del backend (ej: `http://localhost:7000/api/v1`)
- `NEXT_PUBLIC_APP_URL`: URL de la app (ej: `http://localhost:7001`)

## Desarrollo

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Producción
pnpm start
```

## Notas Importantes

- **NO usa Auth0:** Sistema de autenticación local con `SystemAdmin`
- **NO tiene i18n:** Solo español (hardcoded)
- **Puerto:** 7001 (desarrollo)

## Endpoints Backend Requeridos

- `POST /api/v1/admin/auth/login` - Login admin
- `GET /api/v1/admin/auth/me` - Admin actual
- `POST /api/v1/admin/auth/logout` - Logout
