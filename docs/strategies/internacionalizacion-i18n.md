# Estrategia de Internacionalización (i18n)

## Resumen

La plataforma suntUS soporta múltiples idiomas con diferentes estrategias según el tipo de aplicación.

## Implementación por Proyecto

### Backend (suntus-services)

**Librería:** `i18next` con `i18next-fs-backend`

**Configuración:**
- Módulo: `src/common/i18n/i18n.module.ts`
- Servicio: `src/common/i18n/i18n.service.ts`
- Middleware: `src/common/i18n/i18n.middleware.ts`

**Detección de idioma:**
1. Query parameter `?lang=es`
2. Header `Accept-Language`
3. Perfil del usuario (si está autenticado)
4. Default: `es`

**Traducciones:**
- `locales/es/` - Español
- `locales/en/` - Inglés

**Uso:**
```typescript
// En servicios
constructor(private readonly i18n: I18nService) {}

this.i18n.t('common.welcome');
```

### React Native (suntus-app, suntus-pro)

**Librería:** `i18next` con `react-i18next` y `expo-localization`

**Configuración:**
- Archivo: `lib/i18n.ts`
- Detecta automáticamente idioma del dispositivo
- Fallback a español si no se detecta

**Traducciones:**
- `locales/es/` - Español
- `locales/en/` - Inglés

**Uso:**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('auth');
t('login.title');
```

### Next.js (suntus-landing)

**Estrategia:** Solución simple compatible con static export

**Configuración:**
- Archivo: `lib/i18n.ts`
- Helper simple para obtener traducciones

**Limitaciones:**
- No usa `next-intl` (incompatible con static export)
- No hay routing por idioma
- Detección manual del idioma

**Traducciones:**
- `messages/es.json`
- `messages/en.json`

### Next.js (suntus-core)

**Estado:** Sin i18n

**Razón:** Panel de administración solo en español (hardcoded `lang="es"`)

## Estructura de Traducciones

### Backend
```
locales/
├── es/
│   ├── common.json
│   └── auth.json
└── en/
    ├── common.json
    └── auth.json
```

### React Native
```
locales/
├── es/
│   ├── common.json
│   └── auth.json
└── en/
    ├── common.json
    └── auth.json
```

### Next.js Landing
```
messages/
├── es.json
└── en.json
```

## Mejores Prácticas

1. **Claves de traducción:** Usar nombres descriptivos con namespace
   - `common.welcome` ✅
   - `auth.login.title` ✅
   - `welcome` ❌ (muy genérico)

2. **Namespaces:** Agrupar por contexto
   - `common`: Mensajes generales
   - `auth`: Autenticación
   - `errors`: Mensajes de error

3. **Parámetros:** Usar interpolación para valores dinámicos
   ```json
   {
     "welcome": "Bienvenido, {{name}}"
   }
   ```

4. **Pluralización:** Usar formato de i18next
   ```json
   {
     "items": "{{count}} item",
     "items_plural": "{{count}} items"
   }
   ```

## Mantenimiento

- Agregar nuevas traducciones en ambos idiomas simultáneamente
- Revisar consistencia de claves entre proyectos
- Validar que todas las traducciones estén completas antes de deploy

## Próximos Pasos

- [ ] Agregar más namespaces según necesidad (workouts, nutrition, etc.)
- [ ] Implementar detección automática mejorada en Next.js
- [ ] Considerar migración a `next-intl` si se abandona static export

