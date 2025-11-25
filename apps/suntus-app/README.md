# suntus-app - App Móvil de Usuario

Aplicación React Native para usuarios finales de suntUS. Construida con Expo y Expo Router.

## Stack Tecnológico

- **Expo:** Framework React Native
- **Expo Router:** Navegación basada en archivos
- **Auth0:** Autenticación de usuarios
- **i18next:** Internacionalización (español/inglés)

## Componentes Clave

### Autenticación
- **useAuth** (`hooks/useAuth.ts`): Hook principal para autenticación
  - `login()`: Inicia flujo de Auth0
  - `logout()`: Cierra sesión y limpia tokens
  - `getCurrentUser()`: Obtiene usuario actual
  - `checkAuth()`: Verifica si hay sesión activa

- **auth.ts** (`lib/auth.ts`): Servicio de autenticación
  - Maneja el flujo completo Auth0 → Backend
  - Sincroniza usuario con backend
  - Gestiona tokens internos

- **api.ts** (`lib/api.ts`): Cliente API
  - Agrega automáticamente token JWT a requests
  - Maneja errores de autenticación
  - Usa `expo-secure-store` para persistir tokens

### Navegación

La app usa **Expo Router** con estructura basada en archivos:

```
app/
├── (auth)/          # Stack de autenticación
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/          # Tabs principales
    ├── index.tsx    # Home
    ├── workouts.tsx
    └── profile.tsx
```

### Internacionalización

- **i18n.ts** (`lib/i18n.ts`): Configuración de i18next
- Detecta automáticamente el idioma del dispositivo
- Traducciones en `locales/es/` y `locales/en/`

## Variables de Entorno

Todas las variables son **OBLIGATORIAS** (prefijo `EXPO_PUBLIC_`):

- `EXPO_PUBLIC_API_URL`: URL del backend
- `EXPO_PUBLIC_AUTH0_DOMAIN`: Dominio de Auth0
- `EXPO_PUBLIC_AUTH0_CLIENT_ID`: Client ID de Auth0
- `EXPO_PUBLIC_AUTH0_AUDIENCE`: Audience de Auth0

## Desarrollo

```bash
# Desarrollo
pnpm dev

# iOS
pnpm ios

# Android
pnpm android
```

## Estructura de Carpetas

- `app/`: Rutas (Expo Router)
- `lib/`: Utilidades y servicios
- `hooks/`: Hooks personalizados
- `components/`: Componentes reutilizables
- `locales/`: Traducciones

