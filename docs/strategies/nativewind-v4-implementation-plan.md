# Plan de Implementación NativeWind v4 - Sistema de Diseño Compartido

## Objetivo

Configurar NativeWind v4 como sistema de diseño compartido entre `suntus-app` (React Native), `suntus-pro` (React Native) y `suntus-core` (Next.js), utilizando `packages/ui` como proveedor central de estilos y componentes.

## Arquitectura Propuesta

```
packages/ui/                    # Sistema de Diseño Central
├── src/
│   ├── styles/
│   │   └── global.css          # Directivas Tailwind (@tailwind base/components/utilities)
│   ├── components/             # Componentes compartidos (Button, Card, etc.)
│   │   └── Button.tsx          # Ejemplo: Componente con className (NativeWind)
│   └── index.ts                # Exportaciones públicas
├── tailwind.config.js          # Configuración Tailwind (Preset para apps)
└── package.json                # Dependencias: nativewind, tailwindcss

apps/suntus-app/                # React Native (Expo)
├── metro.config.js             # Configurado con withNativeWind()
├── babel.config.js             # Preset nativewind/babel
├── app.json                    # Metro bundler para web
└── global.css                  # Importa desde packages/ui

apps/suntus-pro/                # React Native (Expo)
├── metro.config.js             # Configurado con withNativeWind()
├── babel.config.js             # Preset nativewind/babel
├── app.json                    # Metro bundler para web
└── global.css                  # Importa desde packages/ui

apps/suntus-core/               # Next.js
├── next.config.js              # transpilePackages: ['@suntus/ui']
└── tailwind.config.js          # Extiende preset de packages/ui
```

## Estrategia de Implementación

### Fase 1: Configuración de `packages/ui`

**Objetivo:** Convertir `packages/ui` en el proveedor central de estilos.

1. **Instalar dependencias:**
   - `nativewind` (v4)
   - `tailwindcss@^3.4.17`
   - `react-native-reanimated@~3.17.4` (peer dependency)
   - `react-native-safe-area-context@5.4.0` (peer dependency)
   - `prettier-plugin-tailwindcss@^0.5.11` (dev)

2. **Crear `tailwind.config.js`:**
   - Configuración base con preset de NativeWind
   - Content paths para escanear componentes
   - Exportar como preset para que las apps lo extiendan

3. **Crear `src/styles/global.css`:**
   - Directivas `@tailwind base`, `@tailwind components`, `@tailwind utilities`
   - Este archivo será importado por las apps

4. **Configurar `package.json`:**
   - Exportar `tailwind.config.js` como preset
   - Exportar `global.css` para consumo de apps

### Fase 2: Configuración de Apps Móviles (suntus-app y suntus-pro)

**Objetivo:** Integrar NativeWind v4 en React Native con Expo.

1. **Instalar dependencias:**
   - `nativewind` (ya instalado en packages/ui, pero necesario en app también)
   - `react-native-reanimated@~3.17.4`
   - `react-native-safe-area-context@5.4.0` (ya instalado)

2. **Configurar `babel.config.js`:**
   - Agregar `nativewind/babel` preset
   - Configurar `babel-preset-expo` con `jsxImportSource: "nativewind"`

3. **Configurar `metro.config.js`:**
   - Usar `withNativeWind()` wrapper
   - Apuntar `input` a `packages/ui/src/styles/global.css`
   - Configurar `watchFolders` para monorepo

4. **Crear `global.css` local:**
   - Importar desde `packages/ui/src/styles/global.css`
   - Importar en `app/_layout.tsx` (Expo Router)

5. **Configurar `app.json`:**
   - Cambiar bundler a Metro para web: `"web": { "bundler": "metro" }`

6. **Configurar TypeScript:**
   - Crear `nativewind-env.d.ts` con `/// <reference types="nativewind/types" />`

### Fase 3: Configuración de Next.js (suntus-core)

**Objetivo:** Integrar Tailwind CSS con preset de `packages/ui`.

1. **Instalar dependencias:**
   - `tailwindcss@^3.4.17` (si no está)
   - `autoprefixer` y `postcss` (si no están)

2. **Configurar `tailwind.config.js`:**
   - Extender preset de `@suntus/ui`
   - Agregar content paths de Next.js

3. **Configurar `next.config.js`:**
   - `transpilePackages: ['@suntus/ui']` para compilar TS del paquete

4. **Configurar `postcss.config.js`:**
   - Plugins: `tailwindcss`, `autoprefixer`

5. **Importar estilos:**
   - Importar `packages/ui/src/styles/global.css` en `app/globals.css` o `app/layout.tsx`

### Fase 4: Prueba de Concepto (Smoke Test)

**Objetivo:** Verificar que el sistema funciona end-to-end.

1. **Crear componente `Button` en `packages/ui`:**
   - Usar `className` con clases Tailwind
   - Exportar desde `packages/ui/src/index.ts`

2. **Importar en `suntus-app`:**
   - Crear pantalla de prueba o modificar `app/index.tsx`
   - Importar y renderizar `<Button />`
   - Verificar que se ve estilizado

3. **Importar en `suntus-core`:**
   - Crear página de prueba o modificar `app/page.tsx`
   - Importar y renderizar `<Button />`
   - Verificar que se ve estilizado (mismo estilo que mobile)

4. **Verificar compilación:**
   - `pnpm --filter suntus-app build` (si aplica)
   - `pnpm --filter suntus-core build`
   - Verificar que no hay errores de TypeScript

## Archivos Clave a Crear/Modificar

### `packages/ui/package.json`
```json
{
  "name": "@suntus/ui",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./styles": "./src/styles/global.css",
    "./tailwind-preset": "./tailwind.config.js"
  },
  "dependencies": {
    "nativewind": "^4.0.0",
    "react": "^18.3.1",
    "react-native": "^0.76.5"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "prettier-plugin-tailwindcss": "^0.5.11"
  },
  "peerDependencies": {
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.4.0"
  }
}
```

### `packages/ui/tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-app/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-pro/**/*.{js,jsx,ts,tsx}",
    "../../apps/suntus-core/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Tokens de diseño de suntUS
      colors: {
        primary: {
          50: '#...',
          500: '#...',
          900: '#...',
        },
      },
    },
  },
  plugins: [],
}
```

### `packages/ui/src/styles/global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `apps/suntus-app/metro.config.js`
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configurar para monorepo
config.watchFolders = [
  __dirname,
  ...require('path').resolve(__dirname, '../../packages'),
];

module.exports = withNativeWind(config, { 
  input: '../../packages/ui/src/styles/global.css' 
});
```

### `apps/suntus-app/babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### `apps/suntus-core/next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@suntus/ui', '@suntus/core', 'nativewind', 'react-native-css-interop'],
  webpack: (config, { isServer }) => {
    // CRÍTICO: Alias react-native a react-native-web para compartir componentes
    // Esto permite que TouchableOpacity, Text, etc. funcionen en Next.js
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Asegurar que react-native-web se resuelva correctamente
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    return config;
  },
};

export default nextConfig;
```

**IMPORTANTE:** 
1. Instalar `react-native-web` en `suntus-core`:
   ```bash
   pnpm --filter suntus-core add react-native-web
   ```

2. Crear `nativewind-env.d.ts` en `apps/suntus-core/`:
   ```ts
   /// <reference types="nativewind/types" />
   ```

3. **NO duplicar componentes**: El mismo componente `Button` de `@suntus/ui` funciona en ambas plataformas gracias a `react-native-web`.

### `apps/suntus-core/tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [
    require("@suntus/ui/tailwind-preset"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Orden de Ejecución

1. ✅ **Configurar `packages/ui`** (base del sistema)
2. ✅ **Configurar `suntus-app`** (React Native)
3. ✅ **Configurar `suntus-pro`** (React Native - similar a suntus-app)
4. ✅ **Configurar `suntus-core`** (Next.js)
5. ✅ **Crear componente Button** (prueba de concepto)
6. ✅ **Smoke test** (verificar que funciona en ambas plataformas)

## Comandos de Verificación

```bash
# Instalar dependencias
pnpm install

# Verificar que compila
pnpm --filter @suntus/ui build
pnpm --filter suntus-app start
pnpm --filter suntus-core dev

# Smoke test manual
# 1. Abrir suntus-app en Expo Go
# 2. Abrir suntus-core en navegador
# 3. Verificar que Button se ve igual en ambas
```

## Consideraciones Importantes

1. **Monorepo:** Metro debe configurarse para resolver `packages/ui` correctamente
2. **TypeScript:** Tipos de NativeWind deben estar disponibles en todas las apps
3. **Hot Reload:** Verificar que cambios en `packages/ui` se reflejan en apps
4. **Bundle Size:** Monitorear tamaño de bundle después de integrar NativeWind
5. **Performance:** Probar en dispositivos reales, no solo simuladores
6. **Tailwind v4 vs v3:** `suntus-core` usa Tailwind v4, pero NativeWind v4 requiere Tailwind v3.4.17. Solución: `packages/ui` usará Tailwind v3.4.17, y `suntus-core` puede mantener v4 para sus estilos propios (no compartidos)
7. **Babel Config:** Las apps móviles no tienen `babel.config.js` - necesitamos crearlos
8. **app.json:** Necesitamos agregar `"web": { "bundler": "metro" }` en las apps móviles

## Próximos Pasos (Post-Implementación)

1. Crear sistema de tokens de diseño (colores, tipografía, espaciado)
2. Crear componentes base (Button, Card, Input, etc.)
3. Documentar guía de uso de componentes
4. Configurar Storybook (opcional) para documentación visual

