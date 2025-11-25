# Estrategia de Autenticación con Auth0

## Resumen

La plataforma suntUS utiliza **Auth0** para autenticación de usuarios finales (clientes y expertos) y un **sistema de autenticación local** para administradores del sistema.

## Arquitectura de Autenticación

### Usuarios Finales (Auth0)

**Flujo:**
1. Usuario inicia sesión con Auth0 (web o mobile)
2. Auth0 retorna token JWT
3. Frontend envía token a backend (`/api/v1/auth/callback`)
4. Backend valida token, sincroniza usuario en BD, genera token interno
5. Frontend almacena token interno para requests futuros

**Aplicaciones:**
- `suntus-app` (React Native - Usuarios)
- `suntus-pro` (React Native - Expertos)
- `suntus-landing` (Next.js - Landing)

### Administradores (Autenticación Local)

**Flujo:**
1. Admin ingresa email/password
2. Frontend envía credenciales a backend (`/api/v1/admin/auth/login`)
3. Backend valida contra `SystemAdmin` (passwordHash)
4. Backend genera JWT interno
5. Frontend almacena token en localStorage

**Aplicación:**
- `suntus-core` (Next.js - Admin Panel)

## Implementación Técnica

### Backend (suntus-services)

**Módulo:** `src/auth/`

- **AuthService:**
  - `validateAuth0Token()`: Valida token de Auth0
  - `syncUserFromAuth0()`: Sincroniza/crea usuario en BD
  - `generateInternalToken()`: Genera JWT interno

- **AuthController:**
  - `POST /api/v1/auth/callback`: Callback de Auth0
  - `GET /api/v1/auth/me`: Perfil del usuario autenticado

- **JwtStrategy:**
  - Valida tokens JWT en requests
  - Extrae usuario del payload

- **JwtAuthGuard:**
  - Guard global que protege rutas
  - Bypass con decorador `@Public()`

### React Native (suntus-app, suntus-pro)

**Archivos clave:**
- `lib/auth0.ts`: Configuración de Auth0
- `lib/auth.ts`: Servicio de autenticación
- `lib/api.ts`: Cliente API con manejo de tokens
- `hooks/useAuth.ts`: Hook principal

**Almacenamiento:**
- Tokens en `expo-secure-store` (almacenamiento seguro)

### Next.js (suntus-landing)

**Archivos clave:**
- `src/app/api/auth/[...auth0]/route.ts`: Rutas de Auth0
- `src/app/providers.tsx`: Auth0Provider wrapper

**Almacenamiento:**
- Sesión manejada por Auth0 (cookies)

### Next.js (suntus-core)

**Archivos clave:**
- `lib/auth.ts`: Servicio de autenticación local
- `lib/api.ts`: Cliente API

**Almacenamiento:**
- Tokens en `localStorage` (key: `suntus_admin_token`)

## Variables de Entorno

### Backend
- `AUTH0_DOMAIN`: Dominio de Auth0
- `AUTH0_CLIENT_ID`: Client ID
- `AUTH0_CLIENT_SECRET`: Client Secret
- `AUTH0_AUDIENCE`: Audience
- `JWT_SECRET`: Secret para tokens internos

### React Native
- `EXPO_PUBLIC_AUTH0_DOMAIN`
- `EXPO_PUBLIC_AUTH0_CLIENT_ID`
- `EXPO_PUBLIC_AUTH0_AUDIENCE`
- `EXPO_PUBLIC_API_URL`

### Next.js (Landing)
- `AUTH0_SECRET`: Secret para cookies
- `AUTH0_BASE_URL`: URL de la app
- `AUTH0_ISSUER_BASE_URL`: Dominio de Auth0
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_AUDIENCE`
- `NEXT_PUBLIC_API_URL`

### Next.js (Core)
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

**Importante:** Todas las variables son **OBLIGATORIAS** (sin valores por defecto).

## Seguridad

- Tokens JWT firmados con secret seguro
- Validación de tokens en cada request
- Almacenamiento seguro en mobile (SecureStore)
- Variables de entorno validadas con Zod
- Guards globales con bypass explícito (`@Public()`)

## Próximos Pasos

- [ ] Implementar endpoints de admin en backend (`/admin/auth/login`, `/admin/auth/me`)
- [ ] Validación de tokens Auth0 con JWKS en producción
- [ ] Refresh tokens para sesiones largas
- [ ] Rate limiting en endpoints de autenticación

