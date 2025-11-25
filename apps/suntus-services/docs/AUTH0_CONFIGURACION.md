# Configuración de Auth0 para suntUS Platform

Este documento describe la configuración completa de Auth0 para la plataforma suntUS.

## 📋 Requisitos Previos

1. Cuenta de Auth0 (gratis hasta 7,000 usuarios activos)
2. Aplicación creada en Auth0 Dashboard
3. Variables de entorno configuradas en el backend

---

## 🔧 Configuración en Auth0 Dashboard

### 1. Crear Aplicación

1. Ir a [Auth0 Dashboard](https://manage.auth0.com/)
2. Navegar a **Applications** → **Applications**
3. Click en **Create Application**
4. Nombre: `suntUS Platform`
5. Tipo: **Single Page Application** (para React Native y Next.js)
6. Click **Create**

### 2. Configurar URLs de Callback y Logout

En la configuración de la aplicación, ir a la sección **Application URIs**:

#### **Allowed Callback URLs:**
```
http://localhost:7000/api/v1/auth/callback,
http://localhost:7001/auth/callback,
http://localhost:7002/auth/callback,
https://api.suntus.com/api/v1/auth/callback,
https://app.suntus.com/auth/callback,
https://admin.suntus.com/auth/callback,
https://suntus.com/auth/callback
```

**Explicación:**
- `http://localhost:7000/api/v1/auth/callback` - Backend API (desarrollo)
- `http://localhost:7001/auth/callback` - suntus-core (admin web, desarrollo)
- `http://localhost:7002/auth/callback` - suntus-landing (desarrollo)
- URLs de producción con tus dominios reales

#### **Allowed Logout URLs:**
```
http://localhost:7000,
http://localhost:7001,
http://localhost:7002,
https://api.suntus.com,
https://app.suntus.com,
https://admin.suntus.com,
https://suntus.com
```

#### **Allowed Web Origins:**
```
http://localhost:7000,
http://localhost:7001,
http://localhost:7002,
https://api.suntus.com,
https://app.suntus.com,
https://admin.suntus.com,
https://suntus.com
```

#### **Allowed Origins (CORS):**
```
http://localhost:7000,
http://localhost:7001,
http://localhost:7002,
https://api.suntus.com,
https://app.suntus.com,
https://admin.suntus.com,
https://suntus.com
```

### 3. Configurar APIs (Opcional pero Recomendado)

1. Ir a **APIs** → **Create API**
2. Nombre: `suntUS API`
3. Identifier: `https://api.suntus.com` (o tu dominio de API)
4. Signing Algorithm: **RS256**
5. Click **Create**

**Nota:** El Identifier será tu `AUTH0_AUDIENCE` en las variables de entorno.

### 4. Obtener Credenciales

En la configuración de la aplicación, encontrarás:

- **Domain:** `tu-tenant.auth0.com`
  - Backend: `AUTH0_DOMAIN=tu-tenant.auth0.com`
  - React Native: `EXPO_PUBLIC_AUTH0_DOMAIN=tu-tenant.auth0.com`
  - Next.js: `AUTH0_ISSUER_BASE_URL=https://tu-tenant.auth0.com`

- **Client ID:** `xxxxxxxxxxxxxxxxxxxx`
  - Backend: `AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx`
  - React Native: `EXPO_PUBLIC_AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx`
  - Next.js: `AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx`

- **Client Secret:** `xxxxxxxxxxxxxxxxxxxx` (solo para aplicaciones confidenciales)
  - Backend: `AUTH0_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx`
  - Next.js: `AUTH0_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx`
  - React Native: ❌ **NO usar** (aplicación pública)

- **Audience:** `https://api.suntus.com` (si creaste una API)
  - Backend: `AUTH0_AUDIENCE=https://api.suntus.com`
  - React Native: `EXPO_PUBLIC_AUTH0_AUDIENCE=https://api.suntus.com`
  - Next.js: `AUTH0_AUDIENCE=https://api.suntus.com`

---

## 🔐 Variables de Entorno

### Convención de Nombres

**Estandarización:**
- Todas las variables de Auth0 usan el prefijo `AUTH0_`
- Variables públicas en Expo usan `EXPO_PUBLIC_` (requerido por Expo)
- Variables de Next.js Auth0 SDK usan sus nombres estándar
- Backend usa nombres directos sin prefijo especial

### Backend (`apps/suntus-services/.env`)

```env
# Auth0 Configuration
AUTH0_DOMAIN=tu-tenant.auth0.com
AUTH0_AUDIENCE=https://api.suntus.com
AUTH0_CLIENT_ID=tu-client-id-aqui
AUTH0_CLIENT_SECRET=tu-client-secret-aqui

# JWT Secret (generar con script)
JWT_SECRET=tu-jwt-secret-generado
```

**Mapeo de valores:**
- `AUTH0_DOMAIN` → Domain de Auth0 Dashboard
- `AUTH0_AUDIENCE` → Identifier de la API (si creaste una)
- `AUTH0_CLIENT_ID` → Client ID de la aplicación
- `AUTH0_CLIENT_SECRET` → Client Secret de la aplicación
- `JWT_SECRET` → Secret para firmar tokens internos (generar con script)

### Frontend - React Native (`apps/suntus-app/.env` y `apps/suntus-pro/.env`)

```env
# Auth0 Configuration (EXPO_PUBLIC_ es requerido por Expo para variables públicas)
EXPO_PUBLIC_AUTH0_DOMAIN=tu-tenant.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=tu-client-id-aqui
EXPO_PUBLIC_AUTH0_AUDIENCE=https://api.suntus.com

# API Backend
EXPO_PUBLIC_API_URL=http://localhost:7000/api/v1
```

**Mapeo de valores:**
- `EXPO_PUBLIC_AUTH0_DOMAIN` → Mismo que `AUTH0_DOMAIN` del backend
- `EXPO_PUBLIC_AUTH0_CLIENT_ID` → Mismo que `AUTH0_CLIENT_ID` del backend
- `EXPO_PUBLIC_AUTH0_AUDIENCE` → Mismo que `AUTH0_AUDIENCE` del backend
- `EXPO_PUBLIC_API_URL` → URL base del backend API

**Nota:** En Expo, todas las variables públicas deben tener el prefijo `EXPO_PUBLIC_` para ser accesibles en el código.

### Frontend - Next.js - suntus-core (`apps/suntus-core/.env.local`)

**⚠️ IMPORTANTE:** `suntus-core` **NO usa Auth0**. Usa autenticación local (email/password) con JWT propio para `SystemAdmin`.

```env
# Autenticación Local (NO Auth0)
JWT_SECRET=tu-jwt-secret-generado
NEXTAUTH_URL=http://localhost:7001
NEXT_PUBLIC_API_URL=http://localhost:7000/api/v1
```

**Mapeo de valores:**
- `JWT_SECRET` → Mismo que `JWT_SECRET` del backend (para firmar tokens JWT de admin)
- `NEXTAUTH_URL` → URL base de la aplicación Next.js
- `NEXT_PUBLIC_API_URL` → URL del backend API

**Nota:** 
- `suntus-core` usa `SystemAdmin` con autenticación local (email/password + Bcrypt/Argon2)
- Los admins se crean mediante seed o por otro Super Admin
- NO necesita configuración de Auth0

### Frontend - Next.js - suntus-landing (`apps/suntus-landing/.env.local`)

```env
# Auth0 Configuration (nombres estándar de @auth0/nextjs-auth0)
AUTH0_SECRET=tu-auth0-secret-generado
AUTH0_BASE_URL=http://localhost:7002
AUTH0_ISSUER_BASE_URL=https://tu-tenant.auth0.com
AUTH0_CLIENT_ID=tu-client-id-aqui
AUTH0_CLIENT_SECRET=tu-client-secret-aqui
AUTH0_AUDIENCE=https://api.suntus.com
```

**Mapeo de valores:**
- `AUTH0_SECRET` → Secret para encriptar cookies (generar con script, diferente de JWT_SECRET)
- `AUTH0_BASE_URL` → URL base de la aplicación Next.js
- `AUTH0_ISSUER_BASE_URL` → Mismo que `AUTH0_DOMAIN` pero con `https://` (ej: `https://tu-tenant.auth0.com`)
- `AUTH0_CLIENT_ID` → Mismo que `AUTH0_CLIENT_ID` del backend
- `AUTH0_CLIENT_SECRET` → Mismo que `AUTH0_CLIENT_SECRET` del backend
- `AUTH0_AUDIENCE` → Mismo que `AUTH0_AUDIENCE` del backend

**Nota:** `AUTH0_SECRET` es diferente de `JWT_SECRET`. Se usa para encriptar cookies de sesión en Next.js.

### Tabla de Correspondencia

| Valor | Backend | React Native | Next.js |
|-------|---------|--------------|---------|
| Domain | `AUTH0_DOMAIN` | `EXPO_PUBLIC_AUTH0_DOMAIN` | `AUTH0_ISSUER_BASE_URL` (con https://) |
| Client ID | `AUTH0_CLIENT_ID` | `EXPO_PUBLIC_AUTH0_CLIENT_ID` | `AUTH0_CLIENT_ID` |
| Client Secret | `AUTH0_CLIENT_SECRET` | ❌ No usar (público) | `AUTH0_CLIENT_SECRET` |
| Audience | `AUTH0_AUDIENCE` | `EXPO_PUBLIC_AUTH0_AUDIENCE` | `AUTH0_AUDIENCE` |
| JWT Secret | `JWT_SECRET` | ❌ No necesario | ❌ No necesario |
| Auth0 Secret | ❌ No necesario | ❌ No necesario | `AUTH0_SECRET` |
| Base URL | ❌ No necesario | `EXPO_PUBLIC_API_URL` | `AUTH0_BASE_URL` |

---

## 🔄 Flujo de Autenticación

### 1. Frontend (React Native / Next.js)

```typescript
// Usuario hace login con Auth0 SDK
const credentials = await auth0.webAuth.authorize({
  scope: 'openid profile email',
  audience: 'https://api.suntus.com',
});

// Obtener token de Auth0
const auth0Token = credentials.idToken;
```

### 2. Backend Callback

```typescript
// Frontend envía token de Auth0 al backend
// Usar EXPO_PUBLIC_API_URL en React Native o variable de entorno en Next.js
const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1';

const response = await fetch(`${apiUrl}/auth/callback`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: auth0Token }),
});

const { accessToken, user } = await response.json();
// accessToken es el JWT interno que se usa en todas las peticiones
```

### 3. Peticiones Autenticadas

```typescript
// Usar token interno en todas las peticiones
const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1';

fetch(`${apiUrl}/users/me`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

---

## 📱 Configuración por Aplicación

### React Native (suntus-app / suntus-pro)

**Instalar dependencias:**
```bash
pnpm add react-native-auth0
```

**Configuración:**
```typescript
// lib/auth0.ts
import Auth0 from 'react-native-auth0';

export const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!, // Mismo valor que AUTH0_DOMAIN del backend
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!, // Mismo valor que AUTH0_CLIENT_ID del backend
});
```

**Login:**
```typescript
const credentials = await auth0.webAuth.authorize({
  scope: 'openid profile email',
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE, // Mismo valor que AUTH0_AUDIENCE del backend
});
```

### Next.js - suntus-landing (SÍ usa Auth0)

**Instalar dependencias:**
```bash
pnpm add @auth0/nextjs-auth0
```

**Configuración:**
```typescript
// app/api/auth/[...auth0]/route.ts
import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE, // Mismo valor que AUTH0_AUDIENCE del backend
      scope: 'openid profile email',
    },
  }),
  callback: handleCallback({
    afterCallback: async (req, res, session) => {
      // Sincronizar con backend
      await syncUserToBackend(session);
      return session;
    },
  }),
});
```

**Nota:** `AUTH0_ISSUER_BASE_URL` debe incluir el protocolo `https://` (ej: `https://tu-tenant.auth0.com`), mientras que `AUTH0_DOMAIN` en backend solo tiene el dominio (ej: `tu-tenant.auth0.com`).

### Next.js - suntus-core (NO usa Auth0 - Autenticación Local)

**⚠️ IMPORTANTE:** `suntus-core` usa autenticación local con `SystemAdmin`. NO necesita `@auth0/nextjs-auth0`.

**Configuración:**
```typescript
// Usa autenticación local con email/password
// Los admins se autentican directamente contra el backend
// Backend valida con SystemAdmin (passwordHash con Bcrypt/Argon2)
// Backend genera JWT interno para sesión de admin
```

**Nota:** 
- Los admins se crean mediante seed o por otro Super Admin
- Autenticación: email/password → Backend valida → JWT interno
- NO usa Auth0 en absoluto

---

## 🚪 URLs de Logout

### React Native

```typescript
await auth0.webAuth.clearSession();
// Redirigir a pantalla de login
```

### Next.js

```typescript
// Automático con @auth0/nextjs-auth0
// GET /api/auth/logout
```

### Backend

```typescript
// No requiere logout específico, el token expira automáticamente
// O invalidar token en Redis si usas blacklist
```

---

## 🔒 Seguridad

### Recomendaciones

1. **Nunca exponer Client Secret en frontend**
   - Solo usar en backend o aplicaciones confidenciales
   - React Native y Next.js usan Client ID público

2. **Usar HTTPS en producción**
   - Todas las URLs de callback deben ser HTTPS

3. **Validar Audience en backend**
   - Asegurar que el token viene de tu aplicación

4. **Rotar secrets regularmente**
   - Cambiar JWT_SECRET periódicamente
   - Actualizar Client Secret si se compromete

5. **Usar RS256 en producción**
   - Cambiar de HS256 (desarrollo) a RS256 con JWKS

---

## 🧪 Testing

### Probar Login

```bash
# 1. Iniciar backend
cd apps/suntus-services
pnpm start:dev

# 2. Probar callback (simulado)
curl -X POST http://localhost:7000/api/v1/auth/callback \
  -H "Content-Type: application/json" \
  -d '{"token": "token-de-auth0-aqui"}'
```

### Verificar Token

```bash
# Decodificar JWT (sin verificar firma)
echo "tu-jwt-token" | cut -d. -f2 | base64 -d | jq
```

---

## 📝 Checklist de Configuración

- [ ] Aplicación creada en Auth0 Dashboard
- [ ] URLs de callback configuradas
- [ ] URLs de logout configuradas
- [ ] CORS configurado
- [ ] API creada (opcional)
- [ ] Variables de entorno configuradas en backend
- [ ] Variables de entorno configuradas en frontend
- [ ] SDK de Auth0 instalado en frontend
- [ ] Flujo de login probado
- [ ] Flujo de logout probado
- [ ] Token interno generado correctamente
- [ ] Peticiones autenticadas funcionando

---

## 🆘 Troubleshooting

### Error: "Invalid token"

- Verificar que el token viene de Auth0
- Verificar que el Audience coincide
- Verificar que el Domain es correcto

### Error: "CORS blocked"

- Verificar Allowed Origins en Auth0 Dashboard
- Verificar CORS_ORIGIN en backend

### Error: "Callback URL mismatch"

- Verificar que la URL de callback está en Allowed Callback URLs
- Verificar que no hay trailing slashes

---

## 📚 Recursos

- [Auth0 Documentation](https://auth0.com/docs)
- [React Native Auth0 SDK](https://github.com/auth0/react-native-auth0)
- [Next.js Auth0 SDK](https://github.com/auth0/nextjs-auth0)
- [JWT.io](https://jwt.io/) - Para debuggear tokens

---

**Última actualización:** Diciembre 2024

