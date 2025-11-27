# NativeWind v4 Design System - Estrategia de Implementación

## Resumen

Implementación de un Design System compartido usando **NativeWind v4** que permite compartir componentes y estilos entre aplicaciones React Native (Expo) y Next.js (Web), siguiendo el patrón **Atomic Design**.

## Arquitectura

### Estructura del Design System (`@suntus/ui`)

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── atoms/          # Componentes base indivisibles
│   │   │   ├── Typography.tsx
│   │   │   ├── ButtonBase.tsx
│   │   │   ├── Input.native.tsx / Input.web.tsx
│   │   │   └── Icon.tsx
│   │   ├── molecules/      # Composiciones simples
│   │   │   ├── FormField.tsx
│   │   │   ├── SocialButton.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── SuntusButton.native.tsx / SuntusButton.web.tsx
│   │   └── ThemeToggle.native.tsx / ThemeToggle.web.tsx
│   ├── hooks/
│   │   ├── useSuntusTheme.native.ts
│   │   └── useSuntusTheme.web.ts
│   ├── styles/
│   │   └── global.css      # Variables CSS HSL
│   └── index.ts           # Exports + cssInterop config
├── tailwind.config.js     # Configuración central
└── package.json
```

## Principios de Diseño

### 1. Atomic Design
- **Atoms:** Componentes base indivisibles (Typography, ButtonBase, Input, Icon)
- **Molecules:** Composiciones simples (FormField, SocialButton, SearchInput)
- **Organisms:** (Pendiente de implementación)

### 2. Platform-Specific Files
- **NO usar `Platform.OS`** - Usar extensiones `.native.tsx` y `.web.tsx`
- **Webpack/Next.js** resuelve automáticamente `.web.tsx` en web
- **Metro/Expo** resuelve automáticamente `.native.tsx` en móvil

### 3. Variables Semánticas
- **NO colores hardcodeados** - Usar variables CSS semánticas
- Ejemplos: `bg-primary`, `text-foreground`, `bg-card`, `border-border`
- **Soporte de opacidad:** `hsl(var(--primary) / <alpha-value>)`

### 4. Dark Mode Forzado
- **Full Dark Mode** - Todas las apps inician en dark mode
- **Web:** HTML con `className="dark"` hardcodeado
- **Mobile:** `useSuntusTheme` fuerza dark mode al inicio, ignora preferencia del sistema

## Configuración Técnica

### Tailwind CSS v3.4.18
- **Versión crítica:** NativeWind v4 solo soporta Tailwind v3 (no v4)
- **Homologación:** Todas las apps usan la misma versión (v3.4.18)
- **Configuración central:** `packages/ui/tailwind.config.js` exporta preset

### NativeWind v4
- **cssInterop:** Configurado globalmente en `packages/ui/src/index.ts`
- **Componentes configurados:** TouchableOpacity, Text, TextInput, Pressable, Icon
- **Dark Mode:** `darkMode: 'class'` en todos los `tailwind.config.js`

### react-native-web
- **Integración en Next.js:** Webpack alias `react-native$` → `react-native-web`
- **Transpilación:** `transpilePackages: ['@suntus/ui', 'lucide-react-native']`
- **Extensiones:** Priorizar `.web.tsx` en Webpack resolve.extensions

### Monorepo Hoisting (.npmrc)
```ini
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*react-native*
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=*reanimated*
public-hoist-pattern[]=*worklets*
public-hoist-pattern[]=*nativewind*
public-hoist-pattern[]=*css-interop*
public-hoist-pattern[]=*tailwindcss*
shamefully-hoist=true
```

## Flujos Críticos

### 1. Importación de Componentes
```
App → import { SuntusButton } from '@suntus/ui'
     → packages/ui/src/index.ts
     → Configura cssInterop (si es necesario)
     → Exporta componente (.native.tsx o .web.tsx según plataforma)
```

### 2. Aplicación de Estilos
```
Componente → className="bg-primary"
           → Tailwind procesa variables CSS
           → NativeWind aplica a React Native (móvil)
           → react-native-web aplica a DOM (web)
```

### 3. Dark Mode
```
App inicia → useSuntusTheme() fuerza dark mode
          → NativeWind actualiza colorScheme
          → Tailwind aplica clases dark:
          → Variables CSS cambian (--background, --foreground, etc.)
```

## Reglas de Desarrollo

### ✅ HACER
- Usar extensiones `.native.tsx` y `.web.tsx` para lógica específica
- Usar variables semánticas (`bg-primary`, no `bg-[#18CB96]`)
- Configurar `cssInterop` globalmente en `index.ts`
- Documentar componentes con JSDoc
- Usar `forwardRef` para compatibilidad con animaciones

### ❌ NO HACER
- NO usar `Platform.OS` conditionals
- NO hardcodear colores (usar variables semánticas)
- NO configurar `cssInterop` en componentes individuales
- NO mezclar Tailwind v3 y v4
- NO usar colores hardcodeados en componentes

## Color System

### Variables CSS (HSL)
```css
:root {
  --primary: 162 79% 45%;           /* #18CB96 - Color institucional */
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --border: 240 5.9% 90%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
}

.dark {
  --primary: 162 79% 50%;            /* Más claro en dark mode */
  --background: 240 10% 3.9%;       /* Zinc-950 */
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Uso en Tailwind
```javascript
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
  },
  // ...
}
```

## Troubleshooting

### Botones no se ven con colores
1. Verificar que `cssInterop` esté configurado en `index.ts`
2. Verificar que `tailwind.config.js` tenga `darkMode: 'class'`
3. Verificar que las variables CSS estén importadas en `global.css`

### Dark Mode no funciona
1. Verificar `darkMode: 'class'` en todos los `tailwind.config.js`
2. Verificar que `useSuntusTheme` fuerce dark mode al inicio
3. Verificar que HTML tenga `className="dark"` (web) o `app.json` tenga `userInterfaceStyle: 'dark'` (mobile)

### Componentes no se comparten entre web y mobile
1. Verificar que existan `.native.tsx` y `.web.tsx`
2. Verificar `transpilePackages` en `next.config.ts`
3. Verificar Webpack alias `react-native$` → `react-native-web`

## Referencias

- [NativeWind v4 Docs](https://www.nativewind.dev/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [react-native-web](https://necolas.github.io/react-native-web/)
- [Tailwind CSS v3](https://tailwindcss.com/docs)

