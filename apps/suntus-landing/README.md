# suntus-landing - Landing Page

Landing page pública de suntUS. Construida con Next.js 15 con static export.

## Stack Tecnológico

- **Next.js 15:** Framework React con App Router
- **Auth0:** Autenticación de usuarios
- **Tailwind CSS:** Estilos
- **Static Export:** Genera sitio estático

## Componentes Clave

### Autenticación
- **AuthProvider** (`src/app/providers.tsx`): Wrapper de Auth0Provider
  - Componente cliente que envuelve la app
  - Proporciona contexto de Auth0

- **useUser** (de `@auth0/nextjs-auth0/client`): Hook para usuario
  - `user`: Usuario actual
  - `error`: Errores de autenticación
  - `isLoading`: Estado de carga

- **Auth Routes** (`src/app/api/auth/[...auth0]/route.ts`):
  - Maneja `/api/auth/login`, `/api/auth/callback`, `/api/auth/logout`
  - Sincroniza usuario con backend después del callback

### Internacionalización

- **i18n.ts** (`lib/i18n.ts`): Helper simple para i18n
- Compatible con static export (no usa next-intl)
- Traducciones en `messages/es.json` y `messages/en.json`

### Estructura de Rutas

```
src/app/
├── layout.tsx              # Root layout
├── page.tsx                # Home
├── providers.tsx            # Auth0Provider wrapper
└── api/auth/[...auth0]/     # Auth0 routes
    └── route.ts
```

## Variables de Entorno

Todas las variables son **OBLIGATORIAS**:

- `AUTH0_SECRET`: Secret para cookies de Auth0
- `AUTH0_BASE_URL`: URL de la app (ej: `http://localhost:7002`)
- `AUTH0_ISSUER_BASE_URL`: Dominio de Auth0
- `AUTH0_CLIENT_ID`: Client ID de Auth0
- `AUTH0_CLIENT_SECRET`: Client Secret de Auth0
- `AUTH0_AUDIENCE`: Audience de Auth0
- `NEXT_PUBLIC_API_URL`: URL del backend
- `NEXT_PUBLIC_APP_URL`: URL de la app

## Desarrollo

```bash
# Desarrollo
pnpm dev

# Build (static)
pnpm build

# Preview build
pnpm start
```

## Notas Importantes

- **Static Export:** La app se genera como sitio estático
- **Auth0:** Maneja sesión con cookies (no localStorage)
- **Puerto:** 7002 (desarrollo)

## Uso de Auth0

```tsx
'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Profile() {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <a href="/api/auth/login">Login</a>;
  
  return <div>Hola, {user.name}</div>;
}
```
