# Plan de Desarrollo MVP - suntUS Platform

Este documento establece el orden de desarrollo de los portales basado en el análisis de dependencias entre funcionalidades. El objetivo es evitar desarrollar funcionalidades que dependen de otras aún no implementadas.

---

## 1. Modelo de Negocio y Filosofía de Desarrollo

### 1.1 suntUS como Hub/Marketplace Central

**suntUS es el "Hub Central" del Fitness - Marketplace de Servicios de Salud y Fitness:**

**Principios Fundamentales:**
- **Centralización Financiera:** Todo pago ocurre DENTRO de la plataforma. El usuario paga a suntUS, no al experto. suntUS dispersa los fondos automáticamente.
- **Monetización "Pay-Per-Seat":** Cobramos una renta fija por cada usuario activo que tenga el experto.
- **Incentivo de Crecimiento (La Beca del 6to):** Si un experto trae 5 usuarios pagando, el 6to slot no genera comisión para suntUS (es ingreso neto para el experto).
- **Split de Pagos Automático:** El sistema resta nuestra comisión antes de que el dinero llegue al experto.
- Usuarios buscan expertos en el directorio (por rating, precio, nombre, etc.)
- Expertos ofrecen sus servicios con sus propios precios y planes
- El usuario decide con quién se suscribe (validado o no)

### 1.2 Sistema de Validación y Ranking Dinámico

**Filosofía:** Escalabilidad sin cuello de botella manual + Meritocracia.

**Cómo funciona:**
1. Experto se registra y sube documentos (ID oficial + documento acreditante)
2. Estado inicial: `validationStatus: 'pending'`
3. **Puede dar servicio INMEDIATAMENTE** (no espera validación)
4. **Shadowban:** Si no está verificado, existe en la plataforma pero está "escondido" al final del ranking
5. Admin (suntus-core) valida cuando puede (no es requisito)
6. Una vez validado: `validationStatus: 'validated'` → **ranking alto** (mayor visibilidad)

**Ranking Dinámico (NO alfabético):**
El orden en que aparecen los expertos se basa en:
1. **Verificación** (Documentos aprobados por Admin) - +100 puntos
2. **Reputación** (Calificación promedio de usuarios) - Hasta +50 puntos
3. **Volumen de Ventas** (Número de usuarios activos) - Hasta +30 puntos
4. **Participación en Fitoteca** (Artículos escritos, calidad) - Hasta +20 puntos

**Ventajas:**
- Escala sin límite (10,000 expertos en un día = no hay problema)
- Experto puede empezar a trabajar inmediatamente
- Validación es incentivo, no barrera
- Meritocracia: Los mejores expertos aparecen primero
- Usuario decide con quién trabajar (validación es solo indicador)

### 1.3 Ejercicios: Base de suntUS + Creación de Expertos

**Estructura:**
- **Ejercicios base de suntUS:** Placeholder provistos por suntUS (cargados en FASE 0)
- **Ejercicios de expertos:** Cada experto crea los suyos (algunos bien pedorros, como mencionaste)
- **Prioridad en baúl:**
  1. Mis ejercicios (propios del experto)
  2. Ejercicios de suntUS (base)
  3. Ejercicios compartidos (de otros expertos)

**Admin NO crea ejercicios:** Solo monitorea datos del negocio.

### 1.4 Panel de Administración (suntus-core)

**Rol:** Monitoreo y validación, NO gestión manual.

**Funcionalidades:**
- ✅ Dashboard con métricas del negocio (usuarios activos, ingresos, etc.)
- ✅ Validación de expertos (aprobar/rechazar cuando sea posible)
- ✅ Monitoreo de ingresos y crecimiento
- ✅ Gestión de comisiones y split de pagos
- ❌ NO dar de alta usuarios manualmente (imposible con 10,000 registros)
- ❌ NO crear ejercicios (suntUS provee base, expertos crean los suyos)

### 1.5 Propiedad del Dato: El Cardex Médico Deportivo

**Filosofía:** Usuario-céntrico - La información pertenece al usuario, no al experto.

**Principios:**
- **Usuario-Céntrico:** La información clínica (mediciones, lesiones, historial, fotos de progreso) PERTENECE al Usuario Final, no al Experto.
- **Portabilidad:** Si un usuario cambia de experto, su historial viaja con él. El nuevo experto hereda la visión del historial completo.
- **Auditoría:** Cada nota médica o plan debe llevar la firma de QUIÉN la creó. Si el Experto anterior hizo algo incorrecto, debe quedar registrado que fue él, no el sistema ni el nuevo experto.

**Implementación Técnica:**
- Tabla `userMedicalHistory` con `userId` como owner
- Campo `createdBy` (expertId) en cada entrada
- Campo `createdAt` para auditoría temporal
- Campo `metadata` (JSONB) para datos clínicos estructurados
- Relación many-to-many: Usuario puede tener múltiples expertos a lo largo del tiempo

### 1.6 Productividad del Experto: Adiós al Texto Plano

**Objetivo:** El experto usa la app por velocidad, no por obligación.

**Funcionalidades Clave:**
- **Constructor de Rutinas (No Escribir):** Armar rutinas seleccionando bloques pre-existentes (Ejercicios) y parámetros (Series/Reps), evitando escritura manual.
- **Plantillas y Clonación:** Guardar "Semana Tipo" y replicarla en N usuarios con un clic.
- **Mago Nutricional (Equivalencias):** El experto dicta "macros" o "equivalentes" (ej. 2 Proteínas), y el sistema sugiere platos reales (Recetas) al usuario final.

### 1.7 La Fitoteca: Autoridad y Comunidad

**Funcionalidades:**
- **Fuente de Verdad:** Repositorio de conocimientos (Artículos, Wikis) alimentado por expertos.
- **Reputación:** La participación en la Fitoteca (escribir artículos buenos) suma puntos al "Ranking de Búsqueda" del experto.
- **Contenido Híbrido:** Ejercicios de Sistema (Alta Calidad, creados por suntUS) y Ejercicios de Experto (Creados por ellos). Ambos conviven pero se distinguen visualmente.

---

## 2. Análisis de Dependencias entre Portales

### 1.1 Mapa de Dependencias

```
Portal de Acceso (Login)
  └─> Portal de Registro
      └─> Portal de Perfil
          └─> Portal de Inicio
              ├─> Portal Directorio
              │   └─> Portal de Suscripción
              │       ├─> Portal de Nutrición
              │       └─> Portal Deportivo
              └─> Portal de Facturación
                  └─> Portal de Planes (suntUS)

Portal de Ayuda (Independiente)
Portal Fitoteca (Independiente)
```

### 1.2 Dependencias Críticas Identificadas

#### Dependencia 1: Sistema de Ubicaciones Geográficas
**Problema:** El registro requiere "País de residencia" (línea 13 del CSV). Si en el futuro se requiere domicilio completo (País, Ciudad, Municipio, Colonia, Código Postal), necesitamos tener este sistema ANTES del registro.

**Solución:** Implementar catálogo de ubicaciones geográficas como base de datos de referencia.

#### Dependencia 2: Autenticación y Autorización
**Problema:** Todos los portales requieren usuario autenticado, excepto acceso y registro.

**Solución:** Implementar Auth0 y sistema de roles (CLIENT, EXPERT) PRIMERO. SystemAdmin usa autenticación local separada (NO Auth0).

#### Dependencia 3: Sistema de Pagos
**Problema:** Portal de suscripción requiere pasarela de pagos, que a su vez requiere facturación.

**Solución:** Implementar integración con Stripe y sistema de facturación ANTES de suscripciones.

#### Dependencia 4: Templates de Preguntas
**Problema:** Portal de suscripción requiere templates configurables por experto.

**Solución:** Sistema de templates debe estar listo ANTES de permitir suscripciones.

#### Dependencia 5: Perfil de Experto
**Problema:** Portal directorio muestra expertos, que requieren perfil completo.

**Solución:** Portal de perfil (experto) debe estar listo ANTES del directorio.

#### Dependencia 6: Sistema de Validación de Expertos (No Bloqueante)
**Problema:** Expertos deben poder registrarse y dar servicio SIN validación manual (escalabilidad).

**Solución:** 
- Validación NO es bloqueante. Expertos pueden dar servicio sin validación.
- Validación solo afecta ranking/visibilidad en directorio.
- Expertos validados aparecen primero, no validados después.
- Admin (suntus-core) solo monitorea y valida cuando puede, no es requisito.

#### Dependencia 7: Ejercicios Base de suntUS
**Problema:** Expertos necesitan ejercicios base para crear planes.

**Solución:** 
- suntUS provee ejercicios base (placeholder) cargados en FASE 0.
- Expertos pueden crear sus propios ejercicios.
- Admin NO crea ejercicios, solo monitorea.

#### Dependencia 8: Sistema de Monetización Pay-Per-Seat
**Problema:** Necesitamos sistema de comisiones automático con "Beca del 6to".

**Solución:**
- Implementar sistema de contabilidad de usuarios activos por experto
- Calcular comisión según número de usuarios (5 primeros = comisión, 6to+ = gratis)
- Split de pagos automático antes de dispersar fondos

#### Dependencia 9: Cardex Médico Deportivo (Propiedad del Dato)
**Problema:** Historial médico debe pertenecer al usuario y ser portable.

**Solución:**
- Diseñar esquema de datos usuario-céntrico
- Implementar auditoría con `createdBy` en cada entrada
- Sistema de portabilidad al cambiar de experto

#### Dependencia 10: Constructor de Rutinas y Plantillas
**Problema:** Expertos necesitan crear rutinas rápidamente sin escribir.

**Solución:**
- Sistema de bloques pre-existentes (ejercicios)
- Plantillas de "Semana Tipo" clonables
- Constructor visual de rutinas

#### Dependencia 11: Mago Nutricional (Equivalencias)
**Problema:** Expertos dictan macros, sistema debe sugerir platos reales.

**Solución:**
- Base de datos de recetas con macros
- Algoritmo de matching: macros → recetas sugeridas
- Sistema de equivalencias (ej. "2 Proteínas" = X gramos)

---

## 3. Orden de Desarrollo por Fases

### FASE 0: Infraestructura Base (Semana 1-2)

**Objetivo:** Establecer la base técnica que soportará todo el desarrollo.

#### 0.1 Setup del Monorepo
- [x] Configurar Turborepo
- [x] Configurar pnpm workspaces
- [x] Estructura de carpetas base
- [x] Configuración de TypeScript compartido
- [x] Configuración de ESLint/Prettier

#### 0.2 Base de Datos y Esquemas Base
- [x] Setup de PostgreSQL con Prisma
- [x] Esquema base de usuarios (User, Expert)
- [x] **Sistema de Usuarios y Roles (RBAC):**
  - Modelo `SystemAdmin` (independiente, NO usa Auth0):
    - Campos: `id`, `email` (unique), `passwordHash` (Bcrypt/Argon2), `name`, `role` (SUPER_ADMIN, SUPPORT)
    - Auth Strategy: LocalAuthGuard con JWT exclusivo para panel administrativo (suntus-core)
    - Solo se crean mediante seed o por otro Super Admin
  - Modelo `User` (solo Auth0):
    - Enum `UserRole`: CLIENT, EXPERT (NO ADMIN)
    - Campos: `id`, `auth0Id` (unique), `email`, `phone`, `name`, `role`, `countryCode`, `language`, etc.
  - Modelo `ExpertProfile`:
    - Campos: `stripeAccountId`, `isVerified`, `verificationStatus`, `rankingScore`, `documentsUrl` (JSONB - Private Bucket)
- [x] **Sistema de Validación de Expertos:**
  - Campo `isVerified` (boolean) en ExpertProfile
  - Campo `documentsUrl` (JSONB) para almacenar:
    - `officialId`: URL del documento en bucket privado (ID, pasaporte)
    - `accreditationDoc`: URL del documento en bucket privado (cédula profesional, certificado)
  - Campo `verificationStatus` (PENDING, VALIDATED, REJECTED)
  - **IMPORTANTE:** La validación NO es bloqueante. Expertos no validados pueden dar servicio pero tienen ranking bajo
  - **SEGURIDAD:** Documentos almacenados en bucket privado de GCS, solo accesible por `suntus-admin`
- [x] **Catálogo de Ubicaciones Geográficas** (CRÍTICO) ✅
  - **Estructura ajustada para México:**
    - Country → State → Municipality → City → PostalCode
    - Municipios pertenecen directamente a estados (no a ciudades)
  - Tabla `countries`:
    - `code` (ISO 3166-1 alpha-2): PK
    - `name` (JSONB): `{"es": "México", "en": "Mexico", "native": "México"}`
    - `capital`, `currency`, `phone`, `continent`
  - Tabla `states` (estados):
    - `id`: PK
    - `countryCode`: FK a countries
    - `name` (JSONB): `{"es": "Jalisco", "en": "Jalisco"}`
    - `code`: Código del estado (ej: "JAL", "CDMX")
  - Tabla `municipalities` (municipios):
    - `id`: PK
    - `stateId`: FK a states (municipios pertenecen a estados)
    - `name` (JSONB): `{"es": "Guadalajara", "en": "Guadalajara"}`
  - Tabla `cities` (ciudades/localidades):
    - `id`: PK
    - `municipalityId`: FK a municipalities (ciudades pertenecen a municipios)
    - `name` (JSONB): `{"es": "Centro", "en": "Downtown"}`
  - Tabla `postal_codes` (códigos postales):
    - `code`: PK
    - `municipalityId`: FK a municipalities (opcional)
    - `cityId`: FK a cities (opcional)
  - **Script de seed:** `seed-mexico.ts` consume API de ubicaciones
  - ✅ **Datos cargados:** México completo (32 estados, 2,478 municipios, 151,480 ciudades, 156,192 códigos postales)
- [x] **Sistema de Auditoría Immutable (CRÍTICO):**
  - Tabla `auditLog` (APPEND ONLY - nunca se borra ni edita):
    - `id`: PK (UUID)
    - `entityType`: String (ej. "WorkoutPlan", "TermsAndConditions", "User", "Expert")
    - `entityId`: UUID (Referencia al objeto modificado)
    - `action` (enum: CREATE, UPDATE, DELETE, ACCEPT, REJECT, APPROVE, SUSPEND, PAYMENT, REFUND, ACCESS)
    - `actorId`: UUID (Quién ejecutó la acción)
    - `actorType` (enum: USER, EXPERT, ADMIN, SYSTEM)
    - `snapshot` (JSONB): Copia exacta del dato antes y después del cambio
    - `ipAddress`: String (Dirección IP del actor)
    - `userAgent`: String (Dispositivo usado)
    - `metadata` (JSONB): Datos adicionales
    - `timestamp`: DateTime (UTC)
    - **Índices:** entityType+entityId, actorId, action, timestamp
    - **Regla:** Tabla APPEND ONLY. Nunca se borra ni se edita.
- [x] **Sistema de Términos y Condiciones (Versionado):**
  - Tabla `termsAndConditions`:
    - `id`: PK
    - `version`: String (semantic versioning: "1.0", "1.1", "2.0")
    - `title` (JSONB): Título traducido
    - `content` (JSONB): Contenido traducido
    - `isActive`: Boolean (solo una versión activa)
    - `publishedAt`: DateTime
  - Tabla `termsAcceptance` (APPEND ONLY):
    - `id`: PK
    - `userId`: FK
    - `termsId`: FK
    - `version`: String (versión aceptada)
    - `acceptedAt`: DateTime
    - `ipAddress`, `userAgent`: Para tracking
    - **Registro en AuditLog:** Cada aceptación genera entrada en AuditLog
    - **Bloqueo:** Si cambian T&C, usuario debe re-aceptar antes de continuar
- [ ] **Sistema de Monetización Pay-Per-Seat:**
  - Tabla `expertSubscriptions`:
    - `expertId`: FK (único)
    - `activeUsersCount`: Contador de usuarios activos
    - `totalRevenue`: Ingresos totales
    - `totalCommission`: Comisión total de suntUS
    - `totalPayout`: Pago total a experto
  - Tabla `payments`:
    - `id`: PK
    - `userId`, `expertId`: FKs
    - `amount`: Monto total pagado
    - `suntusCommission`: Comisión de suntUS (calculada según "Beca del 6to")
    - `expertPayout`: Pago al experto (después de comisión)
    - `status`: pending, completed, refunded
  - Tabla `expertPayouts`:
    - `id`: PK
    - `expertId`: FK
    - `totalAmount`: Monto a pagar
    - `status`: pending, processed
    - `processedAt`: Fecha de dispersión
- [ ] **Cardex Médico Deportivo:**
  - Tabla `userMedicalHistory`:
    - `id`: PK
    - `userId`: FK (OWNER del dato)
    - `expertId`: FK (quién creó la entrada) - **Auditoría**
    - `entryType` (enum: measurement, injury, note, progress_photo, plan)
    - `data` (JSONB): Datos estructurados (mediciones, notas, etc.)
    - `createdAt`: Timestamp
    - `createdBy`: expertId (firma de quién lo creó)
  - Tabla `userExpertHistory`:
    - `id`: PK
    - `userId`, `expertId`: FKs
    - `startDate`, `endDate`: Período de relación
    - Para portabilidad: Cuando usuario cambia de experto, nuevo experto puede ver historial completo
- [ ] **Constructor de Rutinas y Plantillas:**
  - Tabla `routineTemplates`:
    - `id`: PK
    - `expertId`: FK
    - `name`: Nombre de la plantilla
    - `weekStructure` (JSONB): Estructura de la semana (L-D con ejercicios)
    - `isDefault`: Si es "Semana Tipo" por defecto
  - Tabla `routineBlocks`:
    - `id`: PK
    - `exerciseId`: FK (bloque pre-existente)
    - `sets`, `reps`, `weight`, `rest`: Parámetros
    - Para constructor visual: Seleccionar bloques, no escribir
- [ ] **Mago Nutricional (Equivalencias):**
  - Tabla `recipes`:
    - `id`: PK
    - `name` (JSONB): Nombre traducido
    - `macros` (JSONB): `{"protein": 30, "carbs": 50, "fat": 20, "calories": 400}`
    - `equivalents` (JSONB): `{"proteins": 2, "carbs": 3}` (equivalencias)
    - `ingredients`, `instructions` (JSONB): Traducidos
    - `source` (enum: system, expert)
  - Tabla `macroEquivalents`:
    - `id`: PK
    - `type` (enum: protein, carb, fat)
    - `unit`: "2 Proteínas" = X gramos
    - Para matching: macros objetivo → recetas sugeridas
  - **Datos iniciales:** Cargar recetas base de suntUS con macros
- [ ] **Sistema de Ranking Dinámico:**
  - Tabla `expertRanking`:
    - `id`: PK
    - `expertId`: FK (único)
    - `verificationScore`: +100 si verificado, 0 si no
    - `reputationScore`: Hasta +50 (basado en rating)
    - `salesVolumeScore`: Hasta +30 (basado en usuarios activos)
    - `fitotecaContribution`: Hasta +20 (basado en artículos)
    - `totalScore`: Suma de todos los scores
    - `lastUpdated`: Timestamp de última actualización
  - Índice en `totalScore` para ordenamiento rápido
- [ ] **Catálogo de Ejercicios (Herramienta de Trabajo):**
  - Tabla `exercises`:
    - `id`: PK
    - `creatorId`: UUID (Nullable)
      - Si es NULL = Ejercicio de Sistema (Suntus HD). Global.
      - Si tiene UUID = Ejercicio 'Custom' del Experto.
    - `visibility`: Enum (SYSTEM, PRIVATE, PUBLIC_COMMUNITY)
      - Los del experto son PRIVATE por defecto (solo él y sus clientes lo ven)
    - `name` (JSONB): Nombre traducido
    - `description` (JSONB): Descripción traducida
    - `mediaUrl`: String (URL del video/imagen en bucket público)
    - `metadata` (JSONB): Tags, Músculos, Equipo
    - **Separación conceptual:** Exercise es herramienta de trabajo, NO es Fitoteca
- [ ] **Fitoteca (Wiki & Comunidad):**
  - Tabla `wikiArticles`:
    - `id`: PK
    - `authorId`: UUID (Experto) - **Siempre tiene autor, no es de sistema**
    - `title`: String
    - `content`: Text (Markdown)
    - `category`: Enum (NUTRITION, TRAINING, PHARMACOLOGY, PSYCHOLOGY)
    - `tags`: String[] (Array para búsquedas)
    - `reputationScore`: Int (Upvotes - Downvotes, default 0)
    - `isVerifiedInfo`: Boolean (Check azul de Suntus para artículos científicos validados)
    - `views`, `likes`, `shares`: Contadores de engagement
    - `publishedAt`: DateTime (opcional, null si es borrador)
    - **Separación conceptual:** WikiArticle es contenido educativo/comunitario, NO es catálogo de ejercicios
- [ ] **Sistema de Monetización Pay-Per-Seat:**
  - Tabla `expertSubscriptions`:
    - `expertId`: FK
    - `activeUsersCount`: Contador de usuarios activos
    - `commissionRate`: Tasa de comisión (calculada según "Beca del 6to")
    - `totalRevenue`: Ingresos totales
    - `suntusCommission`: Comisión de suntUS
    - `expertPayout`: Pago al experto (después de comisión)
  - Lógica: Si `activeUsersCount <= 5` → comisión normal, si `> 5` → 6to+ sin comisión
- [ ] **Cardex Médico Deportivo (Propiedad del Dato):**
  - Tabla `userMedicalHistory`:
    - `id`: PK
    - `userId`: FK (OWNER del dato)
    - `expertId`: FK (quién creó la entrada) - **Auditoría**
    - `entryType` (enum: measurement, injury, note, progress_photo, plan)
    - `data` (JSONB): Datos estructurados (mediciones, notas, etc.)
    - `createdAt`: Timestamp
    - `createdBy`: expertId (firma de quién lo creó)
  - Tabla `userExpertHistory`:
    - `userId`: FK
    - `expertId`: FK
    - `startDate`, `endDate`: Período de relación
    - Para portabilidad: Cuando usuario cambia de experto, nuevo experto puede ver historial completo
- [ ] **Sistema de Plantillas y Constructor de Rutinas:**
  - Tabla `routineTemplates`:
    - `id`: PK
    - `expertId`: FK
    - `name`: Nombre de la plantilla
    - `weekStructure` (JSONB): Estructura de la semana (L-D con ejercicios)
    - `isDefault`: Si es "Semana Tipo" por defecto
  - Tabla `routineBlocks`:
    - `id`: PK
    - `exerciseId`: FK (bloque pre-existente)
    - `sets`, `reps`, `weight`, `rest`: Parámetros
    - Para constructor visual: Seleccionar bloques, no escribir
- [ ] **Mago Nutricional (Equivalencias):**
  - Tabla `recipes`:
    - `id`: PK
    - `name` (JSONB): Nombre traducido
    - `macros` (JSONB): `{"protein": 30, "carbs": 50, "fat": 20, "calories": 400}`
    - `equivalents` (JSONB): `{"proteins": 2, "carbs": 3}` (equivalencias)
    - `ingredients`, `instructions` (JSONB): Traducidos
  - Tabla `macroEquivalents`:
    - `id`: PK
    - `type` (enum: protein, carb, fat)
    - `unit`: "2 Proteínas" = X gramos
    - Para matching: macros objetivo → recetas sugeridas

#### 0.3 Sistema de Internacionalización (i18n)
- [x] Setup de i18next en backend
  - `I18nModule` y `I18nService` implementados
  - `I18nMiddleware` para detección automática de idioma
  - Archivos de traducción en `apps/suntus-services/locales/{{lng}}/{{ns}}.json`
- [x] Setup de i18next en frontend (React Native)
  - `suntus-app`: i18next con `expo-localization` configurado
  - `suntus-pro`: i18next con `expo-localization` configurado
  - Integración en `_layout.tsx` de Expo Router
- [x] Setup de i18n en Next.js
  - `suntus-landing`: Solución simple de i18n para static export (`lib/i18n.ts`)
  - `suntus-core`: **NO tiene i18n** (siempre en español según requerimiento)
- [x] Estructura de archivos de traducción (es/en)
  - Backend: `locales/es/common.json`, `locales/en/common.json`, `locales/es/auth.json`, `locales/en/auth.json`
  - Apps móviles: `locales/es/common.json`, `locales/en/common.json`, `locales/es/auth.json`, `locales/en/auth.json`
  - Landing: `messages/es.json`, `messages/en.json`
- [x] Namespaces: `common`, `auth`, `profile`, `subscription`, `nutrition`, `sports`, `billing`, `metrics`, `help`, `fitoteca`, `directory`, `plans`, `admin`
- [x] Detección automática de idioma del dispositivo/navegador
  - Backend: Desde query params, `Accept-Language` header o perfil de usuario
  - Apps móviles: `expo-localization` detecta idioma del dispositivo
  - Landing: `localStorage` o detección del navegador
- [x] Fallback a español
  - Configurado en todos los proyectos (backend, apps móviles, landing)
- [x] **Estrategia de i18n en Base de Datos:**
  - Usar **JSONB** para campos traducibles: `{"es": "Texto", "en": "Text"}`
  - Campos que usan JSONB:
    - `exercises.name`, `exercises.description`
    - `countries.name`, `states.name`, `cities.name`
    - `nutritionPlans.recipes` (recetas)
    - `fitotecaEntries.content`
  - Función helper en backend: `getTranslatedField(field: JSONB, lang: 'es' | 'en')` ✅
  - Validación con Zod: Schema que valida estructura JSONB de traducciones ✅

#### 0.4 Autenticación Base (Auth0 y Local)
- [x] Configuración de Auth0
  - Variables de entorno normalizadas en todos los proyectos
  - Documentación de configuración creada (`AUTH0_CONFIGURACION.md`)
- [x] Integración en backend (NestJS)
  - `AuthModule` con `AuthService` y `JwtStrategy` implementados
  - Endpoint `/api/v1/auth/callback` para recibir tokens de Auth0 y generar JWT interno
  - Endpoint `/api/v1/auth/me` para obtener perfil del usuario autenticado
  - Sincronización de usuarios desde Auth0 a base de datos (modelo `User` con `auth0Id`)
- [x] Integración en apps móviles (React Native)
  - `suntus-app`: `lib/auth0.ts`, `lib/auth.ts` con funciones `login`, `logout`, `getCurrentUser`, `checkAuth`
  - `suntus-pro`: `lib/auth0.ts`, `lib/auth.ts` con funciones `login`, `logout`, `getCurrentUser`, `checkAuth`
  - Uso de `react-native-auth0` y `expo-secure-store` para almacenamiento seguro de tokens
- [x] Integración en landing page (Next.js)
  - `suntus-landing`: `AuthProvider` con `@auth0/nextjs-auth0/client`
  - **Nota:** Rutas de API de Auth0 comentadas debido a incompatibilidad con static export
- [x] Autenticación local para administradores (suntus-core)
  - **NO usa Auth0** (según `plan-desarrollo-mvp.md`)
  - `lib/auth.ts` y `lib/api.ts` configurados para autenticación local con `SystemAdmin`
  - Endpoints esperados: `/admin/auth/login`, `/admin/auth/me`
- [x] Middleware de autenticación
  - `JwtAuthGuard` global implementado
  - Decorador `@Public()` para rutas públicas
  - Decorador `@CurrentUser()` para inyectar usuario autenticado
- [x] Sistema de roles (user, expert, admin)
  - Modelo `User` con `role`: CLIENT, EXPERT
  - Modelo `SystemAdmin` con `role`: SUPER_ADMIN, SUPPORT
  - JWT incluye `role` en el payload
- [x] Guards de autorización
  - `JwtAuthGuard` para validar tokens JWT internos
  - Soporte para rutas públicas con decorador `@Public()`
- [x] Refresh tokens
  - Implementado: `generateRefreshToken()`, `refreshAccessToken()`
  - Endpoint `/api/v1/auth/refresh` disponible
  - Variables ENV: `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

#### 0.6 Sistema de Auditoría y Términos (CRÍTICO)
- [x] Implementar `AuditService` con métodos para:
  - Logging genérico de acciones
  - Logging de aceptación de T&C
  - Logging de validación de expertos
  - Logging de pagos
  - Logging de acceso a datos sensibles
- [x] Crear `AuditInterceptor` global (NestJS)
- [x] Crear `AuditGuard` para auditoría manual
- [x] Implementar `TermsService`:
  - Gestión de versiones de T&C
  - Verificación de aceptación
  - Aceptación de términos (con registro en AuditLog)
  - Publicación de nueva versión
- [x] Crear `TermsAcceptanceGuard` (App Blocker)
- [x] Configurar middleware en `main.ts`:
  - `AuditInterceptor` global
  - `TermsAcceptanceGuard` en rutas protegidas
- [x] Endpoints de T&C:
  - GET `/api/v1/terms/current` - Obtener versión actual
  - GET `/api/v1/terms/status` - Verificar aceptación del usuario
  - POST `/api/v1/terms/accept` - Aceptar términos

#### 0.5 Almacenamiento de Archivos (Google Cloud Storage)
- [x] Configuración de buckets:
  - **Bucket público** (`suntus-public`):
    - Fotos de perfil, imágenes de ejercicios, videos
    - Acceso: Lectura pública
  - **Bucket privado** (`suntus-private`):
    - Documentos oficiales de expertos (ID, certificados)
    - Acceso: **SOLO `suntus-admin`** (Service Account con permisos específicos)
    - Política IAM restrictiva
    - Encriptación en reposo habilitada
- [x] Generación de Signed URLs para documentos privados (solo admin)
- [x] Validación de permisos antes de acceso a bucket privado
- [x] `StorageService` implementado con soporte para GCS opcional (graceful degradation)

#### 0.7 Cron Jobs y Tareas Programadas
- [x] Configuración de scheduler (NestJS ScheduleModule)
- [x] **Cron Job T+7 (Diario):**
  - Busca `PaymentTransaction` con `walletStatus = PENDING` y `pendingUntil <= hoy`
  - Mueve fondos de `pendingBalance` a `availableBalance` en `ExpertWallet`
  - Actualiza `walletStatus = AVAILABLE` en transacciones
  - Actualiza `movedToAvailableAt` timestamp
- [x] **Cron Job de Payouts (Miércoles):**
  - Ejecuta cada miércoles
  - Busca expertos con `availableBalance > 0`
  - Crea transferencia en Stripe Connect para cada experto
  - Actualiza `totalPaidOut` y limpia `availableBalance`
  - Registra en `ExpertPayout` con status `PROCESSED`
- [x] **Cron Job de Escrow (Mensual):**
  - Ejecuta el primer día de cada mes
  - Busca transacciones con `isEscrow = true` y `escrowCurrentMonth < escrowTotalMonths`
  - Libera `escrowReleaseAmount` a `pendingBalance` (T+7)
  - Incrementa `escrowCurrentMonth`
  - Cuando `escrowCurrentMonth = escrowTotalMonths`, marca como `RELEASED`

**Entregables:**
- [x] Monorepo funcional
- [x] Base de datos con esquemas base (Schema Prisma completo con todos los modelos)
- [x] **Script de seed para países** (usando `countries-list`)
- [x] **Catálogo de ubicaciones poblado** ✅
  - México: 32 estados, 2,478 municipios, 151,480 ciudades/localidades, 156,192 códigos postales
  - Script `seed-mexico.ts` consume API de ubicaciones (`http://localhost:4000/api/locations/hierarchy`)
  - Estructura: Country → State → Municipality → City → PostalCode
- [x] **i18n configurado** (es/en)
  - Backend: i18next con `i18next-fs-backend` funcionando
  - Apps móviles: i18next con `expo-localization` funcionando
  - Landing: Solución simple de i18n para static export
  - Core: Sin i18n (siempre en español)
  - ✅ Helper para JSONB en base de datos (`getTranslatedField()`)
  - ✅ Schema Zod para validación de campos traducibles (`TranslatedFieldSchema`)
- [x] **Auth0 funcionando**
  - Backend: `AuthModule`, `AuthService`, `JwtStrategy` implementados
  - Apps móviles: Integración completa con `react-native-auth0`
  - Landing: Integración con `@auth0/nextjs-auth0` (nota: API routes no compatibles con static export)
  - Core: Autenticación local (NO Auth0) configurada
  - ✅ Refresh tokens implementados (`JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`)
- [x] **Buckets de GCS configurados** (público y privado con seguridad) - `StorageService` implementado
- [x] **Sistema de Auditoría funcionando** (AuditLog append-only) - `AuditService`, `AuditInterceptor`, `AuditModule`
- [x] **Sistema de Términos y Condiciones** (versionado y tracking) - `TermsService`, `TermsAcceptanceGuard`, `TermsModule`
- [x] **App Blocker** implementado (bloquea si no acepta T&C) - `TermsAcceptanceGuard`
- [x] **Cron Jobs configurados** - `SchedulerModule` con jobs T+7, Payouts, Escrow
- [x] **Validación estricta de variables de entorno** ✅
  - Backend: Zod schema sin defaults (falla si falta variable crítica)
  - Frontends: Schemas Zod para validación en `suntus-app`, `suntus-pro`, `suntus-core`, `suntus-landing`
  - Variables nuevas: `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

---

### FASE 1: Acceso y Registro (Semana 3-4)

**Objetivo:** Permitir que usuarios y expertos se registren y accedan al sistema.

#### 1.1 Portal de Acceso (Backend + Frontend)
**Prioridad:** CRÍTICA - Sin esto, nada funciona.

**Backend:**
- [ ] Endpoint de login con email/teléfono
- [ ] Endpoint de login con SSO (Google, Apple, Facebook)
- [ ] Endpoint de recuperación de contraseña
- [ ] Validación de usuario suspendido
- [ ] Sincronización de perfiles (usuario puede ser experto)
- [ ] Generación de JWT con roles
- [ ] **Auditoría:**
  - Registrar login exitoso/fallido en AuditLog
  - Registrar cambio de contraseña
  - Registrar recuperación de contraseña
- [ ] **Términos y Condiciones:**
  - Verificar aceptación de T&C al login
  - Si no acepta, bloquear acceso (excepto ruta de aceptación)

**Frontend (suntus-app y suntus-pro):**
- [ ] Pantalla de login (email/teléfono)
- [ ] Integración con Auth0 SSO
- [ ] Pantalla de recuperación de contraseña
- [ ] Manejo de errores (usuario suspendido, credenciales inválidas)
- [ ] Navegación post-login según rol
- [ ] **App Blocker de T&C:**
  - Componente `TermsBlocker` que envuelve la app
  - Si no acepta T&C, mostrar modal obligatorio
  - No permitir navegación hasta aceptar
  - Pantalla de visualización de T&C (traducida)
  - Botón de aceptación (registra en AuditLog)

**Traducciones necesarias:**
- `auth:login.title`
- `auth:login.email`
- `auth:login.password`
- `auth:login.forgotPassword`
- `auth:login.errors.invalidCredentials`
- `auth:login.errors.suspended`

#### 1.2 Portal de Registro (Backend + Frontend)
**Prioridad:** CRÍTICA - Depende de: FASE 0 (ubicaciones, i18n, auth)

**Backend:**
- [ ] Endpoint de registro con email/teléfono
- [ ] Endpoint de registro con SSO
- [ ] Validación de email/teléfono no registrado
- [ ] **Auditoría:**
  - Registrar creación de cuenta en AuditLog
  - Registrar registro como experto
- [ ] Endpoint de datos personales básicos:
  - Nombre
  - Teléfono
  - Email
  - **País de residencia** (usar catálogo de `countries-list`)
  - Orientación sexual
- [ ] Endpoint de registro como experto:
  - Subida de **identificación oficial** (ID, pasaporte) → **bucket privado**
  - Subida de **documento acreditante** (cédula profesional, certificado) → **bucket privado**
  - Guardar URLs en `validationDocuments` (JSONB)
  - Estado inicial: `validationStatus: 'pending'`
  - **IMPORTANTE:** El experto puede registrarse y dar servicio SIN validación, pero con ranking bajo
  - **SEGURIDAD:** Validar que solo admin puede acceder a documentos en bucket privado
- [ ] Sincronización email/SSO

**Frontend (suntus-app y suntus-pro):**
- [ ] Pantalla de registro (email/teléfono)
- [ ] Pantalla de registro con SSO
- [ ] Formulario de datos personales:
  - Selector de país (con búsqueda, traducido)
  - Campos básicos
- [ ] **Aceptación de Términos y Condiciones:**
  - Mostrar T&C actual al registrarse
  - Checkbox obligatorio "Acepto Términos y Condiciones"
  - Al aceptar, registrar en AuditLog (con IP y User Agent)
- [ ] Formulario de registro como experto:
  - Subida de **identificación oficial** (cámara/galería)
  - Subida de **documento acreditante** (cámara/galería)
  - Preview de documentos
  - **Upload a bucket privado** (solo admin puede acceder después)
  - **Mensaje claro:** "Puedes dar servicio sin validación, pero aparecerás con menor visibilidad en el directorio"
- [ ] Validación de formularios (Zod)
- [ ] Manejo de estados (validado/no validado - NO bloqueante)

**Traducciones necesarias:**
- `auth:register.title`
- `auth:register.personalData`
- `auth:register.country`
- `auth:register.expert.title`
- `auth:register.expert.document`

**Dependencias críticas:**
- ✅ Catálogo de ubicaciones (FASE 0)
- ✅ i18n (FASE 0)
- ✅ Auth0 (FASE 0)

**Entregables:**
- Usuarios pueden registrarse y hacer login
- Expertos pueden registrarse y **dar servicio inmediatamente** (sin esperar validación)
- Sistema de recuperación de contraseña funcional
- **Sistema de validación no bloqueante implementado**

**Nota Importante sobre Validación:**
- Expertos suben documentos al registrarse (ID oficial + documento acreditante)
- Estado inicial: `validationStatus: 'pending'`
- **Pueden dar servicio y aparecer en directorio SIN validación**
- Validación solo mejora su ranking/visibilidad
- Admin valida cuando puede (no es cuello de botella)

---

### FASE 2: Perfil y Inicio (Semana 5-6)

**Objetivo:** Usuarios pueden ver y editar su perfil, y tener un landing después del login.

#### 2.1 Portal de Perfil (Backend + Frontend)
**Prioridad:** ALTA - Depende de: FASE 1 (registro)

**Backend:**
- [ ] Endpoint GET perfil de usuario
- [ ] Endpoint GET perfil de experto
- [ ] Endpoint PATCH perfil de usuario
- [ ] Endpoint PATCH perfil de experto
- [ ] Notificaciones a expertos cuando usuario cambia datos clave
- [ ] Endpoint para crear perfil de experto desde usuario
- [ ] Endpoint para crear perfil de usuario desde experto
- [ ] Validación de cambios en costos de planes (notificar usuarios)

**Frontend (suntus-app):**
- [ ] Pantalla de perfil de usuario
- [ ] Edición de datos personales
- [ ] Visualización de datos clave del plan (peso, talla, PR, objetivo)
- [ ] Botón para crear perfil de experto

**Frontend (suntus-pro):**
- [ ] Pantalla de perfil de experto
- [ ] Edición de información pública (nombre, fotos, evidencias)
- [ ] Edición de costos y planes
- [ ] Preview de cómo se ve en directorio
- [ ] Botón para crear perfil de usuario

**Traducciones necesarias:**
- `profile:user.title`
- `profile:user.edit`
- `profile:expert.title`
- `profile:expert.costs`
- `profile:expert.preview`

#### 2.2 Portal de Inicio (Backend + Frontend)
**Prioridad:** ALTA - Depende de: FASE 1 (login), FASE 2.1 (perfil)

**Backend:**
- [ ] Endpoint de resumen de servicios contratados
- [ ] Lógica de redirección según:
  - Usuario sin servicios → Directorio
  - Usuario con servicios → Resumen
  - Usuario con ambos servicios → Nutrición (o Deportivo si es horario de entrenamiento)
- [ ] Endpoint de resumen de actividades (experto)

**Frontend (suntus-app):**
- [ ] Pantalla de inicio usuario
- [ ] Lógica de redirección automática
- [ ] Resumen de servicios activos

**Frontend (suntus-pro):**
- [ ] Pantalla de inicio experto
- [ ] Resumen de actividades
- [ ] Estado de registro (pendiente/validado)

**Traducciones necesarias:**
- `home:user.title`
- `home:user.noServices`
- `home:expert.title`
- `home:expert.pendingValidation`

**Entregables:**
- Usuarios pueden ver y editar su perfil
- Expertos pueden configurar su perfil público
- Landing inteligente después del login

---

### FASE 3: Directorio y Suscripciones (Semana 7-9)

**Objetivo:** Usuarios pueden buscar expertos y suscribirse a sus servicios.

#### 3.1 Portal Directorio (Backend + Frontend)
**Prioridad:** ALTA - Depende de: FASE 2 (perfil de experto)

**Backend:**
- [ ] Endpoint de listado de expertos con filtros:
  - Especialidad (nutrición/deportivo)
  - Ubicación
  - Precio
  - Rating
  - Estado de validación (opcional, para admin)
- [ ] **Sistema de Ranking Dinámico (NO alfabético):**
  - **Shadowban:** Expertos no validados aparecen al final (escondidos)
  - Factores de ranking (orden de importancia):
    1. **Verificación** (Documentos aprobados) = +100 puntos
    2. **Reputación** (Calificación promedio) = Hasta +50 puntos
    3. **Volumen de Ventas** (Usuarios activos) = Hasta +30 puntos
    4. **Participación en Fitoteca** (Artículos escritos, calidad) = Hasta +20 puntos
  - Algoritmo: `totalScore = verification + reputation + salesVolume + fitotecaContribution`
  - Ordenar por `totalScore DESC`, luego por `rating DESC`
- [ ] Endpoint de detalle de experto
- [ ] Sistema de posicionamiento orgánico y pagado
- [ ] Endpoint de ranking/rating de expertos
- [ ] Endpoint de evidencias de experto
- [ ] **Indicador visual de validación** en respuesta (badge "Verificado" o similar)
- [ ] **Indicador de fuente de ejercicio** (Sistema vs Experto) en respuesta

**Frontend (suntus-app):**
- [ ] Pantalla de directorio con búsqueda y filtros
- [ ] Tarjeta de experto (lista) con:
  - Badge de "Verificado" si está validado
  - Indicador visual si NO está validado (opcional, discreto)
  - **Ranking visible:** Mostrar posición en ranking (opcional)
- [ ] Pantalla de detalle de experto
- [ ] Botón de suscripción (disponible para TODOS los expertos, validados o no)
- [ ] Navegación de regreso
- [ ] **Mensaje informativo:** "Los expertos verificados han sido validados por suntUS"
- [ ] **Cardex Médico Deportivo:**
  - Vista de mi historial médico completo (mediciones, lesiones, notas, fotos de progreso)
  - Ver quién creó cada entrada (auditoría)
  - **Portabilidad:** Al cambiar de experto, historial se mantiene visible para nuevo experto

**Traducciones necesarias:**
- `directory:title`
- `directory:filters.specialty`
- `directory:expert.card`
- `directory:expert.subscribe`

#### 3.2 Sistema de Pagos y Monetización (Backend) - Stripe Connect
**Prioridad:** CRÍTICA - Depende de: Nada (puede desarrollarse en paralelo)

**Arquitectura:**
- **Stripe Connect:** Motor único de pagos
- **Cobro vía Web:** Stripe Checkout (evita comisiones IAP)
- **App Móvil:** Refleja estado de suscripción (no procesa pagos)

**Backend - Integración Stripe Connect:**
- [ ] Configuración de Stripe Connect
- [ ] Endpoint para crear cuenta Connect del experto (`stripeAccountId`)
- [ ] Endpoint para onboarding de experto (Stripe Express)
- [ ] Webhook de Stripe para eventos de pago y suscripciones
- [ ] Endpoint de creación de Checkout Session (Stripe Checkout)
- [ ] Endpoint de verificación de estado de pago

**Backend - Wallet Model (Rolling T+7):**
- [ ] Modelo `ExpertWallet`:
  - `pendingBalance`: Fondos en espera (T+7)
  - `availableBalance`: Fondos disponibles para payout
  - `totalEarned`: Total histórico ganado
  - `totalPaidOut`: Total histórico pagado
- [ ] **Cron Job T+7:**
  - Ejecuta diariamente
  - Busca transacciones con `walletStatus = PENDING` y `pendingUntil <= hoy`
  - Mueve fondos de `pendingBalance` a `availableBalance`
  - Actualiza `walletStatus = AVAILABLE` en `PaymentTransaction`
- [ ] **Cron Job de Payouts (Miércoles):**
  - Ejecuta cada miércoles
  - Busca expertos con `availableBalance > 0`
  - Crea transferencia en Stripe Connect
  - Actualiza `totalPaidOut` y limpia `availableBalance`
  - Registra en `ExpertPayout`

**Backend - Escrow para Packs (Goteo):**
- [ ] Lógica de escrow para pagos anticipados (ej: 6 meses):
  - Si usuario paga 6 meses por adelantado:
    - `isEscrow = true`
    - `escrowTotalMonths = 6`
    - `escrowCurrentMonth = 1`
    - `escrowReleaseAmount = totalAmount / 6`
  - Cada mes, cron job libera 1/6 del valor:
    - Incrementa `escrowCurrentMonth`
    - Mueve `escrowReleaseAmount` a `pendingBalance` (T+7)
    - Cuando `escrowCurrentMonth = escrowTotalMonths`, marca como `RELEASED`

**Backend - Grandfathering (Snapshot de Precios):**
- [ ] Modelo `SubscriptionSnapshot`:
  - Snapshot inmutable del precio al momento de contratar
  - Campos: `stripePriceId`, `amount`, `cycle`, `serviceType`
  - `archivedAt`: Fecha en que el precio fue archivado
- [ ] **Lógica de Inmutabilidad:**
  - Cuando experto cambia precio:
    1. NO actualizar Price existente en Stripe
    2. Archivar Price actual (marcar como inactivo)
    3. Crear nuevo Price en Stripe
    4. Crear `SubscriptionSnapshot` del precio anterior
    5. Actualizar `ExpertProfile` con nuevo `stripePriceId`
- [ ] **Grandfathering en Suscripciones:**
  - Al crear suscripción, guardar `snapshotId` (FK a `SubscriptionSnapshot`)
  - Suscripciones activas mantienen `stripePriceId` original
  - NO se actualiza automáticamente el precio
- [ ] **Migración de Precio (Opt-in):**
  - Endpoint para ofrecer nuevo precio al usuario
  - Usuario puede aceptar nuevo precio o cancelar al final del período
  - Si acepta: Crear nueva suscripción con nuevo precio, cancelar antigua

**Backend - Política de Reembolsos "Digital Seal" (Anti-Robo):**
- [ ] Campo `isContentConsumed` en `Subscription` y `AssignedPlan`
- [ ] **Ventana de Reembolso:**
  - Reembolso automático permitido solo en primeros 7 días
  - Después de 7 días, requiere aprobación manual
- [ ] **El Candado (Consumed Content):**
  - Endpoint para marcar contenido como consumido:
    - `POST /api/v1/subscriptions/:id/mark-consumed` (cuando usuario abre plan)
    - `POST /api/v1/subscriptions/:id/screenshot-detected` (desde app móvil)
  - Si `isContentConsumed = true`:
    - Bloquea reembolso automático inmediatamente
    - Anula ventana de 7 días
    - Solo reembolso manual con justificación
- [ ] Endpoint de solicitud de reembolso:
  - Verifica `isContentConsumed`
  - Verifica días transcurridos desde `startDate`
  - Si cumple condiciones: Procesa reembolso automático
  - Si no: Requiere aprobación manual

**Backend - Protección Visual (Watermark):**
- [ ] Endpoint para generar watermark:
  - Input: `userId`, `userEmail`, `timestamp`
  - Output: Patrón de texto repetido: `{userEmail} | {userId} | {timestamp}`
- [ ] **Especificación para Frontend:**
  - Componente `FloatingWatermark` obligatorio
  - Props: `userEmail`, `userId`, `timestamp`
  - Estilos: `pointerEvents: none`, `opacity: 0.1`, `zIndex: 999`
  - Contenido: Patrón repetido para trazar fugas

**Backend - Prorrateo y Cancelación:**
- [ ] **Cancelación sin Reembolso Parcial:**
  - Al cancelar: `cancelsAtPeriodEnd = true`
  - `cancelAt = endDate` (final del período actual)
  - NO hay reembolso en efectivo por días no usados
  - Usuario mantiene acceso hasta `endDate`
- [ ] **Switch de Experto (Créditos Internos):**
  - Al cambiar de experto a mitad de ciclo:
    1. Calcula días restantes: `daysRemaining = (endDate - hoy)`
    2. Calcula valor proporcional: `creditAmount = (amount / totalDays) * daysRemaining`
    3. Crea `UserCredit`:
       - `amount = creditAmount`
       - `reason = EXPERT_SWITCH`
       - `sourceSubscriptionId = suscripción anterior`
    4. Al crear nueva suscripción:
       - Aplica crédito disponible automáticamente
       - Reduce monto a pagar
       - Marca crédito como `APPLIED`
- [ ] Modelo `UserCredit`:
  - `userId`, `amount`, `reason`, `status`
  - `sourceSubscriptionId`, `appliedToSubscriptionId`
  - `expiresAt` (opcional)

**Backend - Sistema de Monetización Pay-Per-Seat:**
- [ ] Endpoint de cálculo de comisión según número de usuarios activos
- [ ] Lógica "Beca del 6to":
  - Si experto tiene 5 usuarios o menos: comisión normal por todos
  - Si experto tiene 6 o más: comisión solo por los primeros 5, resto es ingreso neto
- [ ] Endpoint de split de pagos automático:
  1. Usuario paga a suntUS (Stripe Checkout)
  2. Sistema calcula comisión (según regla del 6to)
  3. Sistema resta comisión
  4. Sistema agrega a `pendingBalance` del experto (T+7)
  5. Cron job mueve a `availableBalance` después de 7 días
  6. Cron job dispersa fondos cada miércoles

**Modelos de Base de Datos:**
- [ ] `ExpertWallet`: Wallet del experto (pendingBalance, availableBalance)
- [ ] `PaymentTransaction`: Transacciones con walletStatus (PENDING, AVAILABLE, RELEASED, PAID_OUT)
- [ ] `SubscriptionSnapshot`: Snapshot inmutable de precios (Grandfathering)
- [ ] `UserCredit`: Créditos internos por cambio de experto o cancelación
- [ ] `Subscription`: Campos para Grandfathering (snapshotId, stripePriceId) y Digital Seal (isContentConsumed)
- [ ] `AssignedPlan`: Campos para Digital Seal (isContentConsumed, screenshotDetected)

**Nota:** Esta funcionalidad puede desarrollarse en paralelo a otras fases.

#### 3.3 Portal de Suscripción (Backend + Frontend)
**Prioridad:** CRÍTICA - Depende de: FASE 3.1 (directorio), FASE 3.2 (pagos), Templates

**Backend:**
- [ ] Sistema de templates de preguntas:
  - Templates personales (configurables por experto)
  - Templates de nutrición (configurables por experto)
  - Templates deportivos (configurables por experto)
- [ ] Endpoint de templates por experto
- [ ] Endpoint de creación de suscripción
- [ ] Endpoint de respuestas a templates
- [ ] Lógica de estado "Pendiente" hasta completar templates
- [ ] Endpoint de cancelación (48 horas)

**Frontend (suntus-app):**
- [ ] Pantalla de pasarela de pago:
  - Redirección a Stripe Checkout (pago vía web)
  - Manejo de retorno después del pago
  - Sincronización de estado de suscripción
- [ ] Formulario de template de preguntas personales
- [ ] Formulario de template de nutrición
- [ ] Formulario de template deportivo
- [ ] Lógica de flujo (nutrición primero si doble servicio)
- [ ] Estado "Pendiente" visible
- [ ] Botón de cancelación (habilitado después de 48h)
- [ ] **Aplicación de Créditos:**
  - Mostrar créditos internos disponibles
  - Aplicar automáticamente al crear nueva suscripción
  - Mostrar descuento aplicado

**Traducciones necesarias:**
- `subscription:payment.title`
- `subscription:templates.personal`
- `subscription:templates.nutrition`
- `subscription:templates.sports`
- `subscription:status.pending`
- `subscription:cancel.title`

**Dependencias críticas:**
- ✅ Perfil de experto (FASE 2)
- ✅ Sistema de pagos (FASE 3.2)
- ✅ Templates configurables

**Entregables:**
- Usuarios pueden buscar expertos (validados y no validados)
- **Sistema de ranking inteligente:** Validados primero, no validados después
- Usuarios pueden suscribirse a CUALQUIER experto (validado o no)
- Usuarios pueden suscribirse y pagar
- Usuarios completan templates de preguntas
- Sistema de pagos funcional

**Nota sobre Ranking:**
- Expertos validados: +100 puntos de ranking, aparecen primero
- Expertos no validados: Ranking normal, aparecen después
- Factores adicionales: Rating, suscriptores activos, posicionamiento pagado
- **El usuario decide con quién se suscribe**, validación es solo indicador de calidad

---

### FASE 4: Planes Nutricionales y Deportivos (Semana 10-13)

**Objetivo:** Expertos crean planes y usuarios los visualizan.

#### 4.1 Portal de Nutrición (Backend + Frontend)
**Prioridad:** ALTA - Depende de: FASE 3 (suscripciones)

**Backend:**
- [ ] Modelo de plan nutricional:
  - Calendario semanal (L-D)
  - Comidas por día (desayuno, comida, cena, snacks)
  - Recetas e instrucciones
  - Fotos
  - Horarios
- [ ] **Mago Nutricional (Equivalencias):**
  - Endpoint de sugerencia de recetas por macros:
    - Input: `{"protein": 30, "carbs": 50, "fat": 20}`
    - Output: Lista de recetas que cumplen los macros
  - Endpoint de sugerencia por equivalentes:
    - Input: `{"proteins": 2, "carbs": 3}` (equivalencias)
    - Output: Lista de recetas que cumplen equivalentes
  - Algoritmo de matching: Buscar recetas en base de datos que más se acerquen a macros objetivo
- [ ] Endpoint de creación de plan nutricional
- [ ] Endpoint de actualización de plan
- [ ] Endpoint de visualización de plan (usuario)
- [ ] Endpoint de listado de usuarios (experto)
- [ ] Endpoint de detalle de usuario (experto)
- [ ] Endpoint de seguimiento de adherencia
- [ ] Lógica de estados: blank, en progreso, plan emitido
- [ ] **Cardex Médico Deportivo:**
  - Tabla `userMedicalHistory` (propiedad del usuario)
  - Campo `createdBy` (expertId) en cada entrada para auditoría
  - Endpoint de historial médico del usuario (solo usuario y sus expertos pueden ver)
  - Endpoint de agregar entrada médica (mediciones, lesiones, notas, fotos de progreso)
  - Endpoint de portabilidad: Cuando usuario cambia de experto, nuevo experto hereda historial completo
  - Tabla `userExpertHistory` para rastrear relaciones usuario-experto
- [ ] **Cardex Médico Deportivo:**
  - Endpoint de historial médico del usuario (solo el usuario y sus expertos actuales/pasados pueden ver)
  - Endpoint de agregar entrada médica (mediciones, lesiones, notas)
  - Campo `createdBy` (expertId) en cada entrada para auditoría
  - Endpoint de portabilidad: Cuando usuario cambia de experto, nuevo experto hereda historial completo

**Frontend (suntus-app):**
- [ ] Pantalla blank (sin suscripción)
- [ ] Pantalla "en progreso" (con contador de 48h)
- [ ] Pantalla de plan nutricional:
  - Calendario semanal interactivo
  - Detalle de comidas por día
  - Recetas con fotos
  - Lista de compras
- [ ] Seguimiento de adherencia

**Frontend (suntus-pro):**
- [ ] Pantalla blank (sin usuarios)
- [ ] Listado de usuarios (tabla/tarjetas)
- [ ] Filtros de búsqueda
- [ ] Pantalla de detalle de usuario:
  - Perfil del usuario
  - Plan nutricional actual
  - Respuestas a templates
  - Historial clínico/nutrimental
- [ ] Editor de plan nutricional:
  - Calendario semanal
  - Asignación de comidas
  - Subida de recetas/fotos
- [ ] Acción de dar de baja usuario

**Traducciones necesarias:**
- `nutrition:user.blank`
- `nutrition:user.inProgress`
- `nutrition:user.plan.title`
- `nutrition:expert.users.title`
- `nutrition:expert.plan.editor`

#### 4.2 Portal Deportivo (Backend + Frontend)
**Prioridad:** ALTA - Depende de: FASE 3 (suscripciones), FASE 4.1 (similar estructura)

**Backend:**
- [ ] Modelo de plan deportivo:
  - Calendario semanal (L-D)
  - Ejercicios por día
  - Repeticiones, sets, carga
  - Videos explicativos
  - Instrucciones
- [ ] **Constructor de Rutinas (No Escribir):**
  - Endpoint de creación de rutina usando bloques pre-existentes:
    - Input: Array de `routineBlocks` (ejercicios con parámetros)
    - Output: Rutina completa
  - Endpoint de plantillas de rutina:
    - Guardar "Semana Tipo" como plantilla
    - Clonar plantilla a N usuarios con un clic
  - Endpoint de listado de plantillas del experto
- [ ] Endpoint de creación de plan deportivo
- [ ] Endpoint de actualización de plan
- [ ] Endpoint de visualización de plan (usuario)
- [ ] Endpoint de listado de usuarios (experto)
- [ ] Endpoint de detalle de usuario (experto)
- [ ] Endpoint de seguimiento de ejecución
- [ ] **Constructor de Rutinas (No Escribir):**
  - Tabla `routineTemplates` (plantillas de "Semana Tipo")
  - Tabla `routineBlocks` (bloques pre-existentes con ejercicios y parámetros)
  - Endpoint de creación de rutina usando bloques pre-existentes
  - Endpoint de guardar plantilla de rutina
  - Endpoint de clonar plantilla a N usuarios con un clic
  - Endpoint de listado de plantillas del experto
- [ ] **Baúl de ejercicios:**
  - Endpoint de listado con prioridad:
    1. Ejercicios propios del experto
    2. Ejercicios base de suntUS (placeholder)
    3. Ejercicios compartidos por otros expertos
  - Endpoint de creación de ejercicio (experto):
    - Subida de foto/video → bucket público
    - `name` (JSONB): `{"es": "Sentadilla", "en": "Squat"}`
    - `description` (JSONB): `{"es": "...", "en": "..."}`
    - `muscles` (JSONB): Array de músculos trabajados
    - Opción de compartir con otros expertos
  - Endpoint de compartir/no compartir ejercicio
  - **IMPORTANTE:** suntUS provee ejercicios base, expertos crean los suyos
  - **i18n:** Ejercicios traducidos usando JSONB

**Frontend (suntus-app):**
- [ ] Pantalla blank (sin suscripción)
- [ ] Pantalla "en progreso" (con contador de 48h)
- [ ] Pantalla de plan deportivo:
  - Calendario semanal interactivo
  - Detalle de ejercicios por día
  - Videos de ejecución
  - Seguimiento de progreso
- [ ] **Componente FloatingWatermark (OBLIGATORIO):**
  - Props: `userEmail`, `userId`, `timestamp`
  - Estilos: `pointerEvents: 'none'`, `opacity: 0.1`, `zIndex: 999`
  - Contenido: Patrón repetido `{userEmail} | {userId} | {timestamp}`
  - Se muestra en todas las pantallas de rutinas deportivas
- [ ] **Detección de Screenshots:**
  - Listener para eventos de screenshot (si la plataforma lo soporta)
  - Al detectar: Enviar evento al backend para marcar `screenshotDetected = true`
- [ ] **Marcado de Contenido Consumido:**
  - Al abrir el plan por primera vez, enviar evento al backend
  - Marca `isContentConsumed = true` en `AssignedPlan` y `Subscription`

**Frontend (suntus-pro):**
- [ ] Pantalla blank (sin usuarios)
- [ ] Listado de usuarios (tabla/tarjetas)
- [ ] Pantalla de detalle de usuario
- [ ] Editor de plan deportivo:
  - **Constructor de Rutinas (No Escribir):**
    - Vista de bloques pre-existentes (ejercicios)
    - Arrastrar y soltar ejercicios al calendario
    - Configurar parámetros (series, reps, peso, descanso) sin escribir
    - Guardar como plantilla ("Semana Tipo")
  - **Plantillas y Clonación:**
    - Listado de plantillas guardadas
    - Botón "Aplicar a Usuario" → clona plantilla con un clic
    - Botón "Aplicar a Múltiples Usuarios" → seleccionar N usuarios
  - Calendario semanal
  - Asignación de ejercicios
  - Subida de videos/fotos
- [ ] **Baúl de ejercicios:**
  - Listado de ejercicios con prioridad visual:
    1. **Mis ejercicios** (propios del experto)
    2. **Ejercicios de suntUS** (base/placeholder) - **Distinción visual: Badge "Sistema"**
    3. **Ejercicios compartidos** (de otros expertos)
  - **Distinción visual importante:** Ejercicios de sistema vs ejercicios de experto
  - Creación de ejercicio (foto/video):
    - Cámara o galería → upload a bucket público
    - Formulario de datos:
      - Nombre (español e inglés)
      - Descripción (español e inglés)
      - Músculos trabajados
    - Opción de compartir con otros expertos
  - Visualización de ejercicios base de suntUS (solo lectura)
  - **i18n:** Mostrar nombre/descripción según idioma del usuario

**Traducciones necesarias:**
- `sports:user.blank`
- `sports:user.inProgress`
- `sports:user.plan.title`
- `sports:expert.exercises.title`
- `sports:expert.exercises.create`

**Entregables:**
- Expertos pueden crear planes nutricionales y deportivos
- Usuarios pueden visualizar sus planes
- Sistema de baúl de ejercicios funcional

---

### FASE 5: Facturación y Planes suntUS (Semana 14-15)

**Objetivo:** Sistema completo de pagos, facturación y planes premium.

#### 5.1 Portal de Facturación y Monetización Pay-Per-Seat (Backend + Frontend)
**Prioridad:** MEDIA - Depende de: FASE 3.2 (pagos base)

**Backend:**
- [ ] Endpoint de historial de pagos (usuario)
- [ ] Endpoint de comprobantes de pago
- [ ] Endpoint de métodos de pago guardados
- [ ] Endpoint de renovación de suscripción
- [ ] Endpoint de historial de pagos recibidos (experto)
- [ ] Endpoint de historial de transacciones del wallet (con estados: PENDING, AVAILABLE, PAID_OUT)
- [ ] Endpoint de cambio de ciclo de facturación
- [ ] Endpoint de solicitud de reembolso:
  - Verificar `isContentConsumed` (bloquea si es true)
  - Verificar días transcurridos (solo primeros 7 días para automático)
  - Procesar reembolso automático o requerir aprobación manual
- [ ] Lógica de bloqueo si no paga (no puede pedir plan, subir evidencia, chatear)
- [ ] **Sistema de Monetización Pay-Per-Seat (ya implementado en FASE 3.2):**
  - Ver sección 3.2 para detalles completos
- [ ] **Dashboard de Monetización (experto):**
  - Mostrar número de usuarios activos
  - Mostrar wallet: pendingBalance, availableBalance, totalEarned, totalPaidOut
  - Mostrar cálculo de comisión (con indicador de "Beca del 6to")
  - Mostrar ingresos totales vs comisión vs payout
  - Mostrar próximos payouts (cada miércoles, automático)
  - Mostrar escrow (packs) con meses restantes

**Frontend (suntus-app):**
- [ ] Pantalla de historial de pagos
- [ ] Descarga de comprobantes
- [ ] Gestión de métodos de pago
- [ ] Renovación de suscripción
- [ ] Solicitud de reembolso:
  - Verificar si `isContentConsumed = true` (bloquea reembolso automático)
  - Verificar días transcurridos (solo primeros 7 días para automático)
  - Mostrar mensaje claro si no es elegible para reembolso automático
- [ ] **Visualización de Créditos:**
  - Mostrar créditos internos disponibles
  - Historial de créditos aplicados
  - Créditos por cambio de experto o cancelación

**Frontend (suntus-pro):**
- [ ] Pantalla de finanzas
- [ ] **Dashboard de Monetización:**
  - Cards: Usuarios activos, Ingresos totales, Comisión suntUS, Payout neto
  - Indicador visual de "Beca del 6to" (si tiene 5+ usuarios, mostrar que 6to+ no genera comisión)
  - Gráfico de ingresos vs comisiones
- [ ] Historial de pagos recibidos
- [ ] Retiro de fondos
- [ ] Cambio de ciclo de facturación

**Traducciones necesarias:**
- `billing:payments.history`
- `billing:payments.receipt`
- `billing:expert.finances`
- `billing:refund.request`

#### 5.2 Portal de Planes suntUS (Backend + Frontend)
**Prioridad:** BAJA - Depende de: FASE 5.1 (facturación)

**Backend:**
- [ ] Modelo de planes suntUS:
  - Características desbloqueadas
  - Precios
  - Ciclos de facturación
- [ ] Endpoint de listado de planes
- [ ] Endpoint de suscripción a plan
- [ ] Endpoint de cambio de plan
- [ ] Lógica de activación en siguiente ciclo

**Frontend (suntus-pro):**
- [ ] Pantalla de planes disponibles
- [ ] Comparación de características
- [ ] Suscripción a plan
- [ ] Cambio de plan

**Traducciones necesarias:**
- `plans:suntus.title`
- `plans:suntus.features`
- `plans:suntus.subscribe`

**Entregables:**
- Sistema completo de facturación
- Usuarios y expertos pueden gestionar pagos
- Planes premium de suntUS funcionales

---

### FASE 6: Métricas y Analytics (Semana 16-17)

**Objetivo:** Expertos pueden ver métricas de negocio y globales. **Admin (suntus-core) monitorea datos generales del negocio.**

#### 6.1 Métricas de Negocio (Backend + Frontend)
**Prioridad:** MEDIA - Depende de: FASE 4 (planes)

**Backend:**
- [ ] Endpoint de métricas de negocio:
  - Servicios no creados y nuevos
  - Servicios pendientes de renovación
  - Planes en alerta
  - Servicios en espera de pago
  - Servicios cancelados
  - Servicios activos
- [ ] Endpoint de filtrado por métrica

**Frontend (suntus-pro):**
- [ ] Dashboard de métricas (cards)
- [ ] Filtrado de usuarios por métrica
- [ ] Visualizaciones (gráficos)

**Traducciones necesarias:**
- `metrics:business.title`
- `metrics:business.cards.*`

#### 6.2 Métricas Globales (Backend + Frontend)
**Prioridad:** BAJA - Depende de: FASE 6.1, Planes premium

**Backend:**
- [ ] Endpoint de métricas globales (solo para planes avanzados)
- [ ] Comparación con otros expertos
- [ ] Métricas agregadas de la base de datos

**Frontend (suntus-pro):**
- [ ] Pantalla de métricas globales
- [ ] Comparación con hasta 3 expertos
- [ ] Visualizaciones avanzadas

**Traducciones necesarias:**
- `metrics:global.title`
- `metrics:global.comparison`

#### 6.3 Panel de Administración (suntus-core) - Métricas del Negocio
**Prioridad:** MEDIA - Depende de: FASE 3 (suscripciones), FASE 5 (facturación)

**Backend:**
- [ ] Endpoint de métricas generales del negocio:
  - Usuarios activos (total, nuevos hoy/semana/mes)
  - Expertos activos (total, validados, no validados)
  - Ingresos totales (MRR, ARR, histórico)
  - **Comisiones totales** (ingresos de suntUS)
  - **Payouts totales** (pagos a expertos)
  - Suscripciones activas
  - Tasa de conversión (visitas → suscripciones)
  - Churn rate
  - Top expertos por ingresos
  - Top expertos por suscriptores
  - **Métricas de "Beca del 6to":** Cuántos expertos tienen 5+ usuarios (sin comisión en 6to+)
- [ ] Endpoint de validación de expertos (admin):
  - Listado de expertos pendientes de validación
  - Aprobar/rechazar validación
  - **Auditoría:** Registrar aprobación/rechazo en AuditLog (con razón)
  - **Ver documentos subidos:**
    - Generar Signed URLs temporales (15 min) para documentos en bucket privado
    - Validar que solo admin puede acceder
    - **Auditoría:** Registrar acceso a documentos privados en AuditLog
    - Mostrar preview de documentos (ID oficial + certificado)
- [ ] **IMPORTANTE:** Admin NO crea ejercicios, solo monitorea
- [ ] **Dashboard de Auditoría:**
  - Endpoint de consulta de AuditLog (solo admin)
  - Filtros: por entidad, por actor, por acción, por fecha
  - Exportación de logs (para casos legales)

**Frontend (suntus-core):**
- [ ] Dashboard ejecutivo con KPIs principales:
  - Cards de métricas clave (usuarios activos, ingresos, etc.)
  - Gráficos de tendencias (ingresos, crecimiento de usuarios)
  - Tabla de top expertos
- [ ] Sección de validación de expertos:
  - Listado de expertos pendientes
  - Vista de documentos subidos
  - Botones de aprobar/rechazar (con campo de razón)
- [ ] **Sección de Auditoría:**
  - Consulta de AuditLog con filtros
  - Visualización de historial de cambios
  - Exportación de logs
- [ ] **Sección de Términos y Condiciones:**
  - Crear nueva versión de T&C
  - Publicar nueva versión (desactiva anterior)
  - Ver estadísticas de aceptaciones por versión
- [ ] **NO incluir:** Gestión manual de usuarios, creación de ejercicios

**Traducciones necesarias:**
- `admin:dashboard.title`
- `admin:dashboard.metrics.*`
- `admin:validation.title`
- `admin:validation.approve`

**Entregables:**
- Dashboard de métricas para expertos
- Métricas globales para planes premium
- **Panel de admin para monitoreo del negocio (suntus-core)**

---

### FASE 7: Ayuda y Fitoteca (Semana 18-19)

**Objetivo:** Contenido de soporte y blog.

#### 7.1 Portal de Ayuda (Backend + Frontend)
**Prioridad:** BAJA - Independiente

**Backend:**
- [ ] Endpoint de tutoriales
- [ ] Endpoint de FAQ
- [ ] Endpoint de reporte de errores
- [ ] Endpoint de contacto con suntUS

**Frontend (suntus-app y suntus-pro):**
- [ ] Pantalla de tutoriales
- [ ] Pantalla de FAQ
- [ ] Formulario de reporte de errores (con capturas)
- [ ] Pantalla de contacto
- [ ] Enlace a sitio oficial de suntUS

**Traducciones necesarias:**
- `help:tutorials.title`
- `help:faq.title`
- `help:report.title`
- `help:contact.title`

#### 7.2 Portal Fitoteca (Backend + Frontend)
**Prioridad:** BAJA - Independiente

**Backend:**
- [ ] Modelo `WikiArticle` (ya definido en FASE 0):
  - `authorId`: Experto que escribe el artículo
  - `title`: Título del artículo
  - `content`: Contenido en Markdown
  - `category`: NUTRITION, TRAINING, PHARMACOLOGY, PSYCHOLOGY
  - `tags`: Array de tags para búsqueda
  - `reputationScore`: Upvotes - Downvotes
  - `isVerifiedInfo`: Check azul de Suntus (artículos científicos validados)
  - `views`, `likes`, `shares`: Métricas de engagement
- [ ] Endpoint de entradas de relevancia (top 5)
- [ ] Endpoint de búsqueda con filtros
- [ ] Endpoint de detalle de entrada
- [ ] Endpoint de "mis entradas" (usuario)
- [ ] Endpoint de creación de entrada (experto)
- [ ] Endpoint de edición/publicación (experto)
- [ ] **Sistema de Reputación por Fitoteca:**
  - Campo `qualityScore` en `fitotecaEntry` (basado en engagement: views, likes, shares)
  - Calcular `fitotecaContribution` del experto:
    - Número de artículos escritos (hasta 10 puntos)
    - Calidad promedio (qualityScore) (hasta 10 puntos)
    - Total máximo: 20 puntos
  - Actualizar ranking del experto cuando publica artículo
  - Endpoint de métricas de fitoteca por experto
  - Integración con sistema de ranking dinámico

**Frontend (suntus-app):**
- [ ] Pantalla de entradas de relevancia
- [ ] Búsqueda y filtros
- [ ] Pantalla de detalle de entrada
- [ ] Compartir entrada
- [ ] Pantalla "mis entradas"

**Frontend (suntus-pro):**
- [ ] Editor de entrada
- [ ] Listado de entradas creadas
- [ ] Estadísticas de entrada (views, engagement)
- [ ] **Indicador de contribución a ranking:** Mostrar cuántos puntos suma la participación en Fitoteca

**Traducciones necesarias:**
- `fitoteca:relevance.title`
- `fitoteca:entry.detail`
- `fitoteca:expert.create`

**Entregables:**
- Sistema de ayuda completo
- Fitoteca funcional (lectura y creación)

---

## 4. Consideraciones de Internacionalización (i18n)

### 4.1 Estrategia de i18n en Base de Datos con JSONB

**Decisión:** Usar **JSONB en PostgreSQL** para campos traducibles.

**Estructura:**
```typescript
// Ejemplo en Prisma Schema
model Exercise {
  id          String  @id @default(uuid())
  name        Json    // {"es": "Sentadilla", "en": "Squat"}
  description Json    // {"es": "...", "en": "..."}
  muscles     Json    // Array de músculos
}

model Country {
  code String @id // ISO 3166-1 alpha-2
  name Json       // {"es": "México", "en": "Mexico", "native": "México"}
}
```

**Ventajas:**
- ✅ Flexible: Agregar nuevos idiomas sin cambiar esquema
- ✅ Indexable: PostgreSQL puede indexar campos JSONB
- ✅ Validable: Zod puede validar estructura
- ✅ Consultable: Queries como `WHERE name->>'es' = 'Sentadilla'`

**Helper en Backend:**
```typescript
// packages/core/src/utils/i18n.ts
export function getTranslatedField(
  field: Record<string, string>,
  lang: 'es' | 'en' = 'es'
): string {
  return field[lang] || field['es'] || Object.values(field)[0] || '';
}

// Uso:
const exerciseName = getTranslatedField(exercise.name, userLanguage);
```

**Validación con Zod:**
```typescript
// packages/core/src/schemas/exercise.schema.ts
import { z } from 'zod';

export const TranslatedFieldSchema = z.object({
  es: z.string(),
  en: z.string().optional(),
});

export const ExerciseSchema = z.object({
  name: TranslatedFieldSchema,
  description: TranslatedFieldSchema,
  muscles: z.array(z.string()),
});
```

### 4.2 Catálogo de Ubicaciones con `countries-list`

**Paquete:** [`countries-list`](https://github.com/annexare/Countries) por Annexare Studio

**Instalación:**
```bash
pnpm add countries-list
```

**Datos que proporciona:**
- ✅ Códigos ISO 3166-1 (alpha-2 y alpha-3)
- ✅ Nombres en inglés y nativos
- ✅ Capitales
- ✅ Monedas (ISO 4217)
- ✅ Códigos de llamada telefónica
- ✅ Continentes
- ✅ Idiomas (ISO 639-1)
- ✅ Formatos: JSON, CSV, SQL

**Estructura de datos:**
```typescript
import { countries } from 'countries-list';

// Ejemplo de uso
const mexico = countries['MX'];
// {
//   name: 'Mexico',
//   native: 'México',
//   phone: [52],
//   continent: 'NA',
//   capital: 'Mexico City',
//   currency: ['MXN'],
//   languages: ['es']
// }
```

**Script de migración:**
```typescript
// scripts/seed-countries.ts
import { countries } from 'countries-list';
import { prisma } from '../packages/core/src/database';

async function seedCountries() {
  for (const [code, data] of Object.entries(countries)) {
    await prisma.country.upsert({
      where: { code },
      update: {
        name: {
          es: data.name, // O usar traducción manual
          en: data.name,
          native: data.native,
        },
        capital: data.capital,
        currency: data.currency,
        phone: data.phone,
        continent: data.continent,
      },
      create: {
        code,
        name: {
          es: data.name,
          en: data.name,
          native: data.native,
        },
        capital: data.capital,
        currency: data.currency,
        phone: data.phone,
        continent: data.continent,
      },
    });
  }
}
```

**Complemento para México:**
- Usar datos del INEGI para estados, ciudades, municipios
- O usar API de Google Places para autocompletar
- Guardar en tablas `states`, `cities`, `municipalities` con JSONB para nombres

### 4.3 Campos que Usan JSONB para i18n

**Lista completa:**
- `exercises.name`, `exercises.description`
- `countries.name`, `states.name`, `cities.name`, `municipalities.name`
- `nutritionPlans.recipes` (cada receta con nombre y descripción traducidos)
- `sportsPlans.exercises` (referencias a ejercicios ya traducidos)
- `fitotecaEntries.title`, `fitotecaEntries.content`
- `expertProfiles.specialties` (array de especialidades traducidas)

---

### 3.1 Estructura de Traducciones

```
packages/i18n/
├── locales/
│   ├── es/
│   │   ├── common.json       # Botones, errores, validaciones
│   │   ├── auth.json         # Login, registro
│   │   ├── profile.json      # Perfiles
│   │   ├── directory.json    # Directorio
│   │   ├── subscription.json  # Suscripciones
│   │   ├── nutrition.json    # Nutrición
│   │   ├── sports.json       # Deportivo
│   │   ├── billing.json      # Facturación
│   │   ├── metrics.json      # Métricas
│   │   ├── help.json         # Ayuda
│   │   └── fitoteca.json     # Fitoteca
│   └── en/
│       └── (misma estructura)
```

### 4.4 Contenido Dinámico Multilenguaje

**Base de Datos:**
- Ejercicios en baúl: `name` y `description` JSONB con `{"es": "...", "en": "..."}`
- Planes nutricionales: Recetas e instrucciones en ambos idiomas (JSONB)
- Entradas de fitoteca: `title` y `content` JSONB
- Países/ciudades: `name` JSONB con `{"es": "...", "en": "...", "native": "..."}`

**Backend:**
- Detectar idioma del usuario desde perfil o header `Accept-Language`
- Usar helper `getTranslatedField()` para extraer traducción correcta
- Devolver contenido en idioma correcto

**Frontend:**
- Detectar idioma del dispositivo automáticamente
- Permitir cambio manual de idioma
- Guardar preferencia en perfil
- Mostrar contenido traducido desde JSONB

### 4.5 Seguridad del Bucket Privado para Documentos

**Configuración de Google Cloud Storage:**

**Bucket Privado (`suntus-private`):**
- **Propósito:** Almacenar documentos oficiales de expertos (ID, certificados)
- **Acceso:** SOLO `suntus-admin` (Service Account con permisos específicos)
- **Política IAM:**
  ```json
  {
    "bindings": [
      {
        "role": "roles/storage.objectAdmin",
        "members": ["serviceAccount:suntus-admin@project.iam.gserviceaccount.com"]
      }
    ]
  }
  ```
- **Encriptación:** Habilitada en reposo (CSEK o CMEK)
- **Auditoría:** Cloud Audit Logs habilitado para rastrear accesos

**Implementación en Backend:**
```typescript
// packages/core/src/services/storage.service.ts
import { Storage } from '@google-cloud/storage';

export class StorageService {
  private privateBucket = 'suntus-private';
  private publicBucket = 'suntus-public';

  // Upload de documento privado (solo experto puede subir)
  async uploadPrivateDocument(
    file: Buffer,
    fileName: string,
    expertId: string
  ): Promise<string> {
    const storage = new Storage();
    const bucket = storage.bucket(this.privateBucket);
    
    const filePath = `experts/${expertId}/documents/${fileName}`;
    const file = bucket.file(filePath);
    
    await file.save(file, {
      metadata: {
        contentType: 'application/pdf', // o image/jpeg
      },
    });
    
    return filePath; // Guardar en BD, NO URL pública
  }

  // Generar Signed URL temporal (solo admin)
  async getPrivateDocumentUrl(
    filePath: string,
    userRole: 'admin' | 'expert' | 'user'
  ): Promise<string> {
    if (userRole !== 'admin') {
      throw new Error('Unauthorized: Solo admin puede acceder a documentos privados');
    }
    
    const storage = new Storage();
    const bucket = storage.bucket(this.privateBucket);
    const file = bucket.file(filePath);
    
    // Signed URL válida por 15 minutos
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
    });
    
    return url;
  }
}
```

**Validación en Endpoints:**
```typescript
// Backend: Validar rol antes de generar Signed URL
@Get('expert/:id/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async getExpertDocuments(@Param('id') expertId: string) {
  const expert = await this.expertService.findById(expertId);
  const documents = expert.validationDocuments;
  
  // Generar Signed URLs temporales
  const urls = await Promise.all(
    Object.entries(documents).map(([key, filePath]) =>
      this.storageService.getPrivateDocumentUrl(filePath, 'admin')
    )
  );
  
  return { documents: urls };
}
```

**Frontend (suntus-core):**
- Solo admin puede ver documentos
- Mostrar preview usando Signed URLs temporales
- URLs expiran después de 15 minutos
- No cachear URLs en frontend

---

## 5. Dependencias Técnicas Críticas

### 4.1 Orden de Implementación de Servicios Base

1. **Auth0** → Necesario para FASE 1
2. **Catálogo de Ubicaciones** → Necesario para FASE 1 (registro)
3. **Stripe** → Necesario para FASE 3 (suscripciones)
4. **Firebase (Chat)** → Necesario para FASE 4 (comunicación usuario-experto)
5. **Cloud Storage** → Necesario para FASE 4 (fotos/videos de ejercicios)

### 4.2 Modelos de Datos Críticos

**Orden de creación:**
1. `User`, `Expert` (FASE 0)
2. `Location` (países, ciudades) (FASE 0)
3. `Subscription` (FASE 3)
4. `NutritionPlan`, `SportsPlan` (FASE 4)
5. `Exercise` (baúl) (FASE 4)
6. `Payment`, `Invoice` (FASE 5)
7. `FitotecaEntry` (FASE 7)

---

## 6. Plan de Desarrollo por Sprint (Sugerido)

### Sprint 1-2 (Semana 1-2): FASE 0
- Infraestructura base
- i18n setup
- Auth0
- Catálogo de ubicaciones

### Sprint 3-4 (Semana 3-4): FASE 1
- Portal de acceso
- Portal de registro

### Sprint 5-6 (Semana 5-6): FASE 2
- Portal de perfil
- Portal de inicio

### Sprint 7-9 (Semana 7-9): FASE 3
- Portal directorio
- Sistema de pagos
- Portal de suscripción

### Sprint 10-13 (Semana 10-13): FASE 4
- Portal de nutrición
- Portal deportivo
- Baúl de ejercicios

### Sprint 14-15 (Semana 14-15): FASE 5
- Portal de facturación
- Portal de planes suntUS

### Sprint 16-17 (Semana 16-17): FASE 6
- Métricas de negocio
- Métricas globales

### Sprint 18-19 (Semana 18-19): FASE 7
- Portal de ayuda
- Portal fitoteca

---

## 7. Riesgos y Mitigaciones

### Riesgo 1: Catálogo de Ubicaciones Incompleto
**Mitigación:** Usar paquete `countries-list` (https://github.com/annexare/Countries) que proporciona datos completos de países (ISO 3166-1, nombres nativos, capitales, monedas). Para estados/ciudades de México, usar datos oficiales del INEGI o similar.

### Riesgo 2: Integración de Stripe Compleja
**Mitigación:** Implementar en paralelo a otras fases, usar modo test desde el inicio.

### Riesgo 3: Templates de Preguntas Muy Flexibles
**Mitigación:** Empezar con templates fijos, luego hacer configurables.

### Riesgo 4: Validación de Expertos Bloqueante
**Mitigación:** La validación NO es bloqueante. Expertos pueden dar servicio sin validación, solo afecta ranking. Esto permite escalar sin cuello de botella manual.

### Riesgo 5: Carga de Ejercicios Base de suntUS
**Mitigación:** Crear script de migración para cargar ejercicios base iniciales. Estos son solo placeholder, expertos crearán los suyos.

### Riesgo 6: i18n No Considerado desde el Inicio
**Mitigación:** Setup de i18n en FASE 0, todas las strings desde el inicio con traducciones. Usar JSONB en PostgreSQL para contenido dinámico traducido (ejercicios, planes, etc.).

### Riesgo 7: Seguridad de Documentos en Bucket Privado
**Mitigación:** 
- Configurar bucket privado con política IAM restrictiva (solo `suntus-admin`)
- Validar permisos en backend antes de generar Signed URLs
- Encriptación en reposo habilitada
- Auditoría de accesos al bucket privado

### Riesgo 8: Complejidad del Sistema de Monetización Pay-Per-Seat
**Mitigación:**
- Implementar lógica de "Beca del 6to" de forma clara y testeable
- Usar transacciones de base de datos para split de pagos (atomicidad)
- Validar cálculos de comisión antes de dispersar fondos
- Logs detallados de cada transacción para auditoría

### Riesgo 9: Portabilidad del Cardex Médico
**Mitigación:**
- Diseñar esquema de datos usuario-céntrico desde el inicio
- Implementar `createdBy` en cada entrada para auditoría
- Tests de portabilidad: Cambiar de experto y verificar que historial se mantiene
- Documentar claramente que datos pertenecen al usuario

### Riesgo 10: Constructor de Rutinas y Plantillas
**Mitigación:**
- Empezar con sistema simple de bloques pre-existentes
- Plantillas básicas primero, luego avanzadas
- Validar que clonación funciona correctamente (no duplicar referencias)

### Riesgo 11: Mago Nutricional (Matching de Macros)
**Mitigación:**
- Crear base de datos de recetas con macros desde el inicio
- Algoritmo de matching simple primero (búsqueda por rangos), luego optimizar
- Validar que sugerencias son nutricionalmente correctas

### Riesgo 12: Falta de Auditoría Legal
**Mitigación:**
- Implementar AuditLog desde FASE 0 (crítico para protección legal)
- Auditar TODAS las acciones críticas (pagos, validaciones, acceso a datos sensibles)
- Términos y Condiciones versionados con tracking completo
- App blocker obligatorio si no acepta T&C
- Backup diario de AuditLog (evidencia legal)

### Riesgo 13: Crecimiento Excesivo de AuditLog
**Mitigación:**
- Índices optimizados desde el inicio
- Considerar particionamiento por fecha si crece mucho (> 10M registros)
- Archivar logs antiguos (> 7 años) a almacenamiento frío
- Monitorear tamaño de tabla y performance

---

## 8. Checklist de Validación por Fase

### FASE 0 ✅ COMPLETADA
- [x] Monorepo funcional
- [x] Base de datos con esquemas base (Schema Prisma completo)
- [x] Script de seed para países (countries-list)
- [x] Base de datos con ubicaciones ✅ (México completo cargado: 32 estados, 2,478 municipios, 151,480 ciudades, 156,192 códigos postales)
- [x] **i18n configurado (es/en)**
  - [x] Backend: i18next con `i18next-fs-backend` funcionando
  - [x] Apps móviles: i18next con `expo-localization` funcionando
  - [x] Landing: Solución simple de i18n para static export
  - [x] Core: Sin i18n (siempre en español)
  - [x] Helper para JSONB en base de datos ✅ (`getTranslatedField()`)
  - [x] Schema Zod para validación de campos traducibles ✅ (`TranslatedFieldSchema`)
- [x] **Auth0 funcionando**
  - [x] Backend: `AuthModule`, `AuthService`, `JwtStrategy` implementados
  - [x] Apps móviles: Integración completa con `react-native-auth0`
  - [x] Landing: Integración con `@auth0/nextjs-auth0` (nota: API routes no compatibles con static export)
  - [x] Core: Autenticación local (NO Auth0) configurada
  - [x] Refresh tokens implementados ✅ (`JWT_REFRESH_SECRET`, endpoints `/auth/refresh`)
- [x] **Sistema de Auditoría funcionando** (AuditLog append-only)
- [x] **Sistema de Términos y Condiciones** (versionado y tracking)
- [x] **App Blocker** implementado
- [x] **Almacenamiento de Archivos (GCS)** configurado
- [x] **Cron Jobs** configurados (T+7, Payouts, Escrow)
- [x] **Validación de variables de entorno con Zod** ✅ (sin defaults, falla si falta variable crítica)
  - [x] Backend: `env.validation.ts` con validación estricta
  - [x] Frontends: Schemas Zod para `suntus-app`, `suntus-pro`, `suntus-core`, `suntus-landing`

### FASE 1 ✅
- [ ] Usuario puede registrarse con país
- [ ] Usuario puede hacer login
- [ ] Experto puede registrarse
- [ ] Recuperación de contraseña funciona
- [ ] **Aceptación de T&C en registro** (registrado en AuditLog)
- [ ] **App Blocker funciona** (bloquea si no acepta T&C)
- [ ] **Auditoría de login/registro** funcionando

### FASE 2 ✅
- [ ] Usuario puede ver/editar perfil
- [ ] Experto puede configurar perfil público
- [ ] Landing inteligente funciona

### FASE 3 ✅
- [ ] Usuario puede buscar expertos
- [ ] Usuario puede suscribirse y pagar
- [ ] Templates de preguntas funcionan

### FASE 4 ✅
- [ ] Experto puede crear planes
- [ ] Usuario puede ver planes
- [ ] Baúl de ejercicios funciona

### FASE 5 ✅
- [ ] Sistema de facturación completo
- [ ] Reembolsos funcionan
- [ ] Planes suntUS disponibles

### FASE 6 ✅
- [ ] Métricas de negocio visibles (expertos)
- [ ] Métricas globales para planes premium
- [ ] **Panel de admin (suntus-core) funcional:**
  - [ ] Dashboard con métricas del negocio
  - [ ] Validación de expertos (aprobar/rechazar) - **con auditoría**
  - [ ] Monitoreo de ingresos y usuarios activos
  - [ ] **Dashboard de Auditoría** (consulta de AuditLog)
  - [ ] **Gestión de Términos y Condiciones** (crear/publicar nuevas versiones)

### FASE 7 ✅
- [ ] Portal de ayuda completo
- [ ] Fitoteca funcional

---

## 9. Complementos MVP: Funcionalidades Estratégicas

### 9.1 Sistema de Monetización "Pay-Per-Seat" con "Beca del 6to"

**Objetivo:** Centralización financiera total. Todo pago dentro de la plataforma.

**Implementación Técnica:**

**Backend (suntus-services):**
```typescript
// packages/core/src/services/payment.service.ts
export class PaymentService {
  async processSubscriptionPayment(
    userId: string,
    expertId: string,
    amount: number
  ): Promise<PaymentResult> {
    // 1. Usuario paga a suntUS
    const payment = await stripe.charges.create({ amount });
    
    // 2. Calcular comisión según "Beca del 6to"
    const expert = await this.expertService.findById(expertId);
    const activeUsersCount = await this.getActiveUsersCount(expertId);
    
    let commissionRate = 0.20; // 20% por defecto
    let suntusCommission = amount * commissionRate;
    
    // Si tiene 5 o menos usuarios, cobramos comisión normal
    // Si tiene 6 o más, el 6to+ no genera comisión
    if (activeUsersCount > 5) {
      // Los primeros 5 generan comisión, el resto no
      const usersWithCommission = Math.min(activeUsersCount, 5);
      const usersWithoutCommission = activeUsersCount - 5;
      
      // Calcular comisión solo para los primeros 5
      suntusCommission = (amount * commissionRate) * (usersWithCommission / activeUsersCount);
    }
    
    const expertPayout = amount - suntusCommission;
    
    // 3. Guardar en base de datos
    await prisma.payment.create({
      data: {
        userId,
        expertId,
        amount,
        suntusCommission,
        expertPayout,
        status: 'completed',
      },
    });
    
    // 4. Actualizar contador de usuarios activos
    await prisma.expertSubscription.update({
      where: { expertId },
      data: {
        activeUsersCount: activeUsersCount + 1,
      },
    });
    
    // 5. Agregar a cola de payout (dispersar fondos al experto)
    await this.queueExpertPayout(expertId, expertPayout);
    
    return { payment, suntusCommission, expertPayout };
  }
}
```

**Modelo de Datos:**
```prisma
model Payment {
  id              String   @id @default(uuid())
  userId          String
  expertId        String
  amount          Decimal  // Monto total pagado
  suntusCommission Decimal // Comisión de suntUS
  expertPayout    Decimal  // Pago al experto (después de comisión)
  status          PaymentStatus
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id])
  expert          Expert   @relation(fields: [expertId], references: [id])
}

model ExpertSubscription {
  id                String   @id @default(uuid())
  expertId          String   @unique
  activeUsersCount  Int      @default(0)
  totalRevenue      Decimal  @default(0)
  totalCommission   Decimal  @default(0)
  totalPayout       Decimal  @default(0)
  
  expert            Expert   @relation(fields: [expertId], references: [id])
}
```

**Frontend (suntus-pro):**
- Dashboard de monetización mostrando:
  - Usuarios activos (con indicador visual de "Beca del 6to")
  - Ingresos totales
  - Comisión de suntUS (calculada)
  - Payout neto
  - Próximos pagos programados

### 9.2 Cardex Médico Deportivo: Propiedad del Dato

**Objetivo:** La información clínica pertenece al usuario, no al experto. Portabilidad total.

**Implementación Técnica:**

**Modelo de Datos:**
```prisma
model UserMedicalHistory {
  id          String   @id @default(uuid())
  userId      String   // OWNER del dato
  expertId    String   // Quién creó la entrada (auditoría)
  entryType   EntryType
  data        Json     // Datos estructurados (mediciones, notas, etc.)
  createdAt   DateTime @default(now())
  createdBy   String   // Firma: expertId que lo creó
  
  user        User     @relation(fields: [userId], references: [id])
  expert      Expert   @relation(fields: [expertId], references: [id])
  
  @@index([userId]) // Para portabilidad rápida
}

enum EntryType {
  MEASUREMENT      // Mediciones (peso, talla, etc.)
  INJURY          // Lesiones
  NOTE            // Notas médicas
  PROGRESS_PHOTO  // Fotos de progreso
  PLAN            // Plan nutricional/deportivo
}

model UserExpertHistory {
  id        String   @id @default(uuid())
  userId    String
  expertId  String
  startDate DateTime
  endDate   DateTime?
  
  user      User     @relation(fields: [userId], references: [id])
  expert    Expert   @relation(fields: [expertId], references: [id])
  
  @@index([userId]) // Para portabilidad
}
```

**Backend:**
```typescript
// Endpoint de portabilidad: Cuando usuario cambia de experto
@Get('user/:userId/medical-history')
async getUserMedicalHistory(@Param('userId') userId: string) {
  // Retornar TODO el historial del usuario (sin importar qué experto lo creó)
  return await prisma.userMedicalHistory.findMany({
    where: { userId },
    include: {
      expert: {
        select: { id: true, name: true }, // Auditoría: quién creó cada entrada
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Endpoint para nuevo experto: Ver historial completo del usuario
@Get('expert/:expertId/user/:userId/history')
async getUserHistoryForExpert(
  @Param('expertId') expertId: string,
  @Param('userId') userId: string
) {
  // Verificar que el experto tiene relación con el usuario
  const relationship = await prisma.userExpertHistory.findFirst({
    where: {
      userId,
      expertId,
      OR: [
        { endDate: null }, // Relación activa
        { endDate: { gte: new Date() } }, // Relación reciente
      ],
    },
  });
  
  if (!relationship) {
    throw new ForbiddenException('No tienes acceso a este historial');
  }
  
  // Retornar historial completo (incluyendo entradas de otros expertos)
  return await this.getUserMedicalHistory(userId);
}
```

**Frontend:**
- Usuario puede ver su historial completo (propiedad del dato)
- Experto puede ver historial completo del usuario (si tiene relación activa)
- Cada entrada muestra quién la creó (auditoría)
- Al cambiar de experto, nuevo experto hereda historial completo

### 9.3 Constructor de Rutinas y Plantillas

**Objetivo:** Experto crea rutinas sin escribir, usando bloques pre-existentes.

**Implementación Técnica:**

**Modelo de Datos:**
```prisma
model RoutineTemplate {
  id            String   @id @default(uuid())
  expertId      String
  name          String
  weekStructure Json     // Estructura L-D con ejercicios
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())
  
  expert        Expert   @relation(fields: [expertId], references: [id])
}

model RoutineBlock {
  id          String   @id @default(uuid())
  exerciseId String
  sets        Int?
  reps        Int?
  weight      Decimal?
  rest        Int?     // Segundos de descanso
  notes       String?
  
  exercise    Exercise @relation(fields: [exerciseId], references: [id])
}
```

**Backend:**
```typescript
// Endpoint de creación de rutina usando bloques
@Post('expert/:expertId/routine')
async createRoutine(
  @Param('expertId') expertId: string,
  @Body() dto: CreateRoutineDto
) {
  // dto.blocks = Array de { exerciseId, sets, reps, weight, rest }
  const blocks = await Promise.all(
    dto.blocks.map(block =>
      prisma.routineBlock.create({
        data: {
          exerciseId: block.exerciseId,
          sets: block.sets,
          reps: block.reps,
          weight: block.weight,
          rest: block.rest,
        },
      })
    )
  );
  
  // Crear rutina con bloques
  return await prisma.routine.create({
    data: {
      expertId,
      blocks: { connect: blocks.map(b => ({ id: b.id })) },
      weekStructure: dto.weekStructure, // L-D con bloques asignados
    },
  });
}

// Endpoint de clonación de plantilla
@Post('expert/:expertId/template/:templateId/clone')
async cloneTemplate(
  @Param('expertId') expertId: string,
  @Param('templateId') templateId: string,
  @Body() dto: { userIds: string[] } // Aplicar a N usuarios
) {
  const template = await prisma.routineTemplate.findUnique({
    where: { id: templateId },
  });
  
  // Clonar plantilla a múltiples usuarios
  return await Promise.all(
    dto.userIds.map(userId =>
      this.createRoutineFromTemplate(template, userId)
    )
  );
}
```

**Frontend (suntus-pro):**
- Constructor visual: Arrastrar ejercicios del baúl al calendario
- Configurar parámetros (series, reps, peso) sin escribir
- Guardar como plantilla ("Semana Tipo")
- Botón "Aplicar a Usuario" → clona con un clic
- Botón "Aplicar a Múltiples" → seleccionar N usuarios

### 9.4 Mago Nutricional: Equivalencias y Sugerencias

**Objetivo:** Experto dicta macros, sistema sugiere platos reales.

**Implementación Técnica:**

**Modelo de Datos:**
```prisma
model Recipe {
  id          String   @id @default(uuid())
  name        Json     // {"es": "Pechuga de pollo", "en": "Chicken breast"}
  macros      Json     // {"protein": 30, "carbs": 50, "fat": 20, "calories": 400}
  equivalents Json     // {"proteins": 2, "carbs": 3} (equivalencias)
  ingredients Json     // Lista de ingredientes traducida
  instructions Json    // Instrucciones traducidas
  imageUrl    String?
  source      RecipeSource @default(SYSTEM)
  
  @@index([macros]) // Para búsqueda rápida por macros
}

enum RecipeSource {
  SYSTEM  // Recetas de suntUS
  EXPERT  // Recetas creadas por expertos
}

model MacroEquivalent {
  id    String   @id @default(uuid())
  type  MacroType
  unit  String   // "2 Proteínas" = 30 gramos
  grams Decimal  // Gramos equivalentes
  
  @@unique([type, unit])
}

enum MacroType {
  PROTEIN
  CARB
  FAT
}
```

**Backend:**
```typescript
// Endpoint de sugerencia de recetas por macros
@Post('recipes/suggest-by-macros')
async suggestRecipesByMacros(@Body() dto: MacroTargetDto) {
  // dto = { protein: 30, carbs: 50, fat: 20, tolerance: 10 }
  
  const recipes = await prisma.recipe.findMany({
    where: {
      macros: {
        path: ['protein'],
        gte: dto.protein - dto.tolerance,
        lte: dto.protein + dto.tolerance,
      },
      // Similar para carbs y fat
    },
    take: 10, // Top 10 sugerencias
  });
  
  // Ordenar por cercanía a macros objetivo
  return recipes.sort((a, b) => {
    const scoreA = this.calculateMacroMatch(a.macros, dto);
    const scoreB = this.calculateMacroMatch(b.macros, dto);
    return scoreB - scoreA;
  });
}

// Endpoint de sugerencia por equivalentes
@Post('recipes/suggest-by-equivalents')
async suggestRecipesByEquivalents(@Body() dto: EquivalentTargetDto) {
  // dto = { proteins: 2, carbs: 3 }
  
  // Convertir equivalentes a gramos
  const proteinGrams = await this.getGramsFromEquivalent('PROTEIN', dto.proteins);
  const carbGrams = await this.getGramsFromEquivalent('CARB', dto.carbs);
  
  // Buscar recetas que cumplan
  return await this.suggestRecipesByMacros({
    protein: proteinGrams,
    carbs: carbGrams,
    fat: 0, // O calcular según necesidad
    tolerance: 5,
  });
}
```

**Frontend (suntus-pro):**
- Input de macros objetivo (proteína, carbs, grasa)
- O input de equivalentes ("2 Proteínas", "3 Carbs")
- Botón "Sugerir Recetas" → muestra lista de recetas que cumplen
- Seleccionar recetas para agregar al plan nutricional

### 9.5 Fitoteca con Sistema de Reputación

**Objetivo:** Repositorio de conocimientos que suma puntos al ranking del experto.

**Implementación Técnica:**

**Modelo de Datos:**
```prisma
model FitotecaEntry {
  id          String   @id @default(uuid())
  expertId    String
  title       Json     // {"es": "...", "en": "..."}
  content     Json     // Contenido traducido
  qualityScore Decimal @default(0) // Basado en engagement
  views       Int      @default(0)
  likes       Int      @default(0)
  shares      Int      @default(0)
  publishedAt DateTime?
  
  expert      Expert   @relation(fields: [expertId], references: [id])
  
  @@index([expertId])
  @@index([qualityScore])
}

// Actualizar ranking del experto cuando escribe en Fitoteca
model ExpertRanking {
  id                    String   @id @default(uuid())
  expertId              String   @unique
  verificationScore     Int      @default(0) // +100 si verificado
  reputationScore       Int      @default(0) // Hasta +50 (rating)
  salesVolumeScore      Int      @default(0) // Hasta +30 (usuarios activos)
  fitotecaContribution  Int      @default(0) // Hasta +20 (artículos)
  totalScore            Int      @default(0) // Suma de todos
  
  expert                Expert   @relation(fields: [expertId], references: [id])
  
  @@index([totalScore]) // Para ordenamiento rápido
}
```

**Backend:**
```typescript
// Calcular contribución de Fitoteca al ranking
async calculateFitotecaContribution(expertId: string): Promise<number> {
  const entries = await prisma.fitotecaEntry.findMany({
    where: { expertId, publishedAt: { not: null } },
  });
  
  let score = 0;
  
  // Puntos por número de artículos (hasta 10 puntos)
  score += Math.min(entries.length * 0.5, 10);
  
  // Puntos por calidad promedio (hasta 10 puntos)
  const avgQuality = entries.reduce((sum, e) => sum + e.qualityScore, 0) / entries.length;
  score += Math.min(avgQuality / 10, 10);
  
  return Math.min(score, 20); // Máximo 20 puntos
}

// Actualizar ranking cuando experto publica artículo
@Post('fitoteca/entry')
async createFitotecaEntry(@Body() dto: CreateFitotecaEntryDto) {
  const entry = await prisma.fitotecaEntry.create({
    data: {
      expertId: dto.expertId,
      title: dto.title,
      content: dto.content,
    },
  });
  
  // Recalcular contribución de Fitoteca
  const fitotecaContribution = await this.calculateFitotecaContribution(dto.expertId);
  
  // Actualizar ranking del experto
  await prisma.expertRanking.update({
    where: { expertId: dto.expertId },
    data: {
      fitotecaContribution: fitotecaContribution,
      totalScore: {
        // Recalcular total
      },
    },
  });
  
  return entry;
}
```

**Frontend (suntus-pro):**
- Indicador de contribución a ranking: "Escribir artículos suma hasta +20 puntos"
- Métricas de artículos: views, likes, shares
- Calidad del contenido afecta puntos

---

## 10. Blindaje Legal & Auditoría (CRÍTICO) 🛡️

**Esta sección es MANDATORIA para protección legal de la plataforma.**

### 10.1 Sistema de Auditoría Immutable (AuditLog)

**Objetivo:** Registrar cada acción crítica de forma imposible de borrar o modificar.

**Principio:** Tabla APPEND ONLY - Nunca se borra ni se edita. Solo se inserta.

**Estructura de Base de Datos (Prisma Schema):**

```prisma
model AuditLog {
  id          String   @id @default(uuid())
  entityType  String   // "WorkoutPlan", "TermsAndConditions", "User", "Expert", "Payment", etc.
  entityId    String   // UUID del objeto modificado
  action      AuditAction
  actorId     String   // UUID de quién ejecutó la acción (User, ExpertProfile, SystemAdmin)
  actorType   ActorType // Tipo de actor (USER, EXPERT, ADMIN, SYSTEM)
  snapshot    Json     // JSONB: Copia exacta del dato antes y después
  ipAddress   String?  // Dirección IP del actor
  userAgent   String?  // Dispositivo/navegador usado
  metadata    Json?    // JSONB: Datos adicionales (razón del cambio, etc.)
  timestamp   DateTime @default(now())
  
  // Índices para búsqueda rápida
  @@index([entityType, entityId])
  @@index([actorId])
  @@index([action])
  @@index([timestamp])
  
  // IMPORTANTE: Esta tabla NO tiene relaciones de eliminación en cascada
  // Los registros son permanentes
}

enum AuditAction {
  CREATE      // Creación de entidad
  UPDATE      // Actualización de entidad
  DELETE      // Eliminación (soft delete también se registra)
  ACCEPT      // Aceptación (T&C, términos, etc.)
  REJECT      // Rechazo (validación de experto, etc.)
  APPROVE     // Aprobación (validación, etc.)
  SUSPEND     // Suspensión de cuenta
  UNSUSPEND   // Reactivación de cuenta
  PAYMENT     // Procesamiento de pago
  REFUND      // Reembolso
  ACCESS      // Acceso a datos sensibles (documentos privados)
  EXPORT      // Exportación de datos
}

enum ActorType {
  USER        // Usuario final (User con role CLIENT)
  EXPERT      // Experto (ExpertProfile)
  ADMIN       // SystemAdmin (suntus-admin, NO usa Auth0)
  SYSTEM      // Acción automática del sistema
}
```

**Estrategia de Implementación:**

**1. Middleware Global de Auditoría (NestJS):**

```typescript
// packages/core/src/common/interceptors/audit.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, body, params, query } = request;
    
    // Obtener datos antes del cambio
    const beforeSnapshot = this.getBeforeSnapshot(request);
    
    return next.handle().pipe(
      tap(async (response) => {
        // Registrar después del cambio
        await this.auditService.log({
          entityType: this.getEntityType(request),
          entityId: params.id || body.id,
          action: this.getAction(method),
          actorId: user?.id || 'system',
          actorType: this.getActorType(user),
          snapshot: {
            before: beforeSnapshot,
            after: response,
          },
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          metadata: {
            method,
            path: request.path,
            query,
          },
        });
      })
    );
  }
}
```

**2. Service de Auditoría:**

```typescript
// packages/core/src/services/audit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    entityType: string;
    entityId: string;
    action: AuditAction;
    actorId: string;
    actorType: ActorType;
    snapshot: { before?: any; after?: any };
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }): Promise<void> {
    // IMPORTANTE: No usar transacciones que puedan hacer rollback
    // Esta operación debe ser atómica e independiente
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          actorId: data.actorId,
          actorType: data.actorType,
          snapshot: data.snapshot,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata,
        },
      });
    } catch (error) {
      // Log error pero NO fallar la operación principal
      // Auditoría no debe bloquear funcionalidad
      console.error('Error en auditoría:', error);
    }
  }

  // Métodos helper para casos específicos
  async logTermsAcceptance(
    userId: string,
    termsVersion: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      entityType: 'TermsAndConditions',
      entityId: termsVersion,
      action: AuditAction.ACCEPT,
      actorId: userId,
      actorType: ActorType.USER,
      snapshot: {
        after: {
          userId,
          termsVersion,
          acceptedAt: new Date(),
        },
      },
      ipAddress,
      userAgent,
    });
  }

  async logExpertValidation(
    expertId: string,
    adminId: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string
  ): Promise<void> {
    await this.log({
      entityType: 'Expert',
      entityId: expertId,
      action: action === 'APPROVE' ? AuditAction.APPROVE : AuditAction.REJECT,
      actorId: adminId,
      actorType: ActorType.ADMIN,
      snapshot: {
        after: {
          expertId,
          validationStatus: action === 'APPROVE' ? 'validated' : 'rejected',
          validatedBy: adminId,
          validatedAt: new Date(),
          reason,
        },
      },
      metadata: { reason },
    });
  }

  async logPayment(
    paymentId: string,
    userId: string,
    amount: number,
    suntusCommission: number,
    expertPayout: number
  ): Promise<void> {
    await this.log({
      entityType: 'Payment',
      entityId: paymentId,
      action: AuditAction.PAYMENT,
      actorId: userId,
      actorType: ActorType.USER,
      snapshot: {
        after: {
          paymentId,
          amount,
          suntusCommission,
          expertPayout,
          processedAt: new Date(),
        },
      },
    });
  }

  async logDataAccess(
    entityType: string,
    entityId: string,
    actorId: string,
    actorType: ActorType,
    ipAddress: string
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action: AuditAction.ACCESS,
      actorId,
      actorType,
      snapshot: {
        after: {
          accessedAt: new Date(),
          entityType,
          entityId,
        },
      },
      ipAddress,
    });
  }
}
```

**3. Decorator para Auditoría Manual:**

```typescript
// packages/core/src/common/decorators/audit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export const Audit = (entityType: string, action?: AuditAction) =>
  SetMetadata(AUDIT_KEY, { entityType, action });
```

**4. Guard para Aplicar Auditoría:**

```typescript
// packages/core/src/common/guards/audit.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUDIT_KEY } from '../decorators/audit.decorator';
import { AuditService } from '../../services/audit.service';

@Injectable()
export class AuditGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auditMetadata = this.reflector.get(AUDIT_KEY, context.getHandler());
    if (!auditMetadata) return true;

    const request = context.switchToHttp().getRequest();
    const { user, body, params } = request;

    // Registrar acceso/acción
    await this.auditService.log({
      entityType: auditMetadata.entityType,
      entityId: params.id || body.id,
      action: auditMetadata.action || AuditAction.ACCESS,
      actorId: user?.id || 'system',
      actorType: this.getActorType(user),
      snapshot: { before: body },
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return true;
  }
}
```

### 10.2 Sistema de Términos y Condiciones (Versionado y Tracking)

**Objetivo:** Versionar T&C y rastrear aceptaciones con registro inmutable.

**Estructura de Base de Datos:**

```prisma
model TermsAndConditions {
  id          String   @id @default(uuid())
  version     String   // "1.0", "1.1", "2.0" (semantic versioning)
  title       Json     // {"es": "...", "en": "..."}
  content     Json     // Contenido traducido
  isActive    Boolean  @default(false) // Solo una versión activa
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  
  // Relación con aceptaciones
  acceptances TermsAcceptance[]
  
  @@unique([version])
  @@index([isActive])
}

model TermsAcceptance {
  id        String   @id @default(uuid())
  userId    String
  termsId   String
  version   String   // Versión aceptada
  acceptedAt DateTime @default(now())
  ipAddress String?
  userAgent String?
  
  user      User     @relation(fields: [userId], references: [id])
  terms     TermsAndConditions @relation(fields: [termsId], references: [id])
  
  // IMPORTANTE: Esta tabla también es append-only
  // No se puede "des-aceptar", solo aceptar nueva versión
  @@unique([userId, termsId]) // Un usuario solo puede aceptar una versión una vez
  @@index([userId])
  @@index([version])
}
```

**Estrategia de Implementación:**

**1. Service de Términos y Condiciones:**

```typescript
// packages/core/src/services/terms.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class TermsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService
  ) {}

  async getCurrentVersion(): Promise<TermsAndConditions> {
    return await this.prisma.termsAndConditions.findFirst({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async checkUserAcceptance(userId: string): Promise<{
    hasAccepted: boolean;
    currentVersion: string;
    acceptedVersion?: string;
    needsAcceptance: boolean;
  }> {
    const currentTerms = await this.getCurrentVersion();
    if (!currentTerms) {
      return {
        hasAccepted: false,
        currentVersion: null,
        needsAcceptance: false,
      };
    }

    const acceptance = await this.prisma.termsAcceptance.findFirst({
      where: {
        userId,
        termsId: currentTerms.id,
      },
      orderBy: { acceptedAt: 'desc' },
    });

    const hasAccepted = !!acceptance;
    const needsAcceptance = !hasAccepted || acceptance.version !== currentTerms.version;

    return {
      hasAccepted,
      currentVersion: currentTerms.version,
      acceptedVersion: acceptance?.version,
      needsAcceptance,
    };
  }

  async acceptTerms(
    userId: string,
    termsId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<TermsAcceptance> {
    const terms = await this.prisma.termsAndConditions.findUnique({
      where: { id: termsId },
    });

    if (!terms || !terms.isActive) {
      throw new ForbiddenException('Términos no válidos o inactivos');
    }

    // Crear aceptación
    const acceptance = await this.prisma.termsAcceptance.create({
      data: {
        userId,
        termsId,
        version: terms.version,
        ipAddress,
        userAgent,
      },
    });

    // Registrar en AuditLog (CRÍTICO)
    await this.auditService.logTermsAcceptance(
      userId,
      terms.version,
      ipAddress,
      userAgent
    );

    return acceptance;
  }

  async publishNewVersion(
    version: string,
    title: Json,
    content: Json,
    adminId: string
  ): Promise<TermsAndConditions> {
    // Desactivar versión anterior
    await this.prisma.termsAndConditions.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Crear nueva versión
    const newTerms = await this.prisma.termsAndConditions.create({
      data: {
        version,
        title,
        content,
        isActive: true,
        publishedAt: new Date(),
      },
    });

    // Registrar en AuditLog
    await this.auditService.log({
      entityType: 'TermsAndConditions',
      entityId: newTerms.id,
      action: AuditAction.CREATE,
      actorId: adminId,
      actorType: ActorType.ADMIN,
      snapshot: {
        after: {
          version,
          publishedAt: newTerms.publishedAt,
        },
      },
    });

    return newTerms;
  }
}
```

**2. Guard para Bloquear App si No Acepta T&C:**

```typescript
// packages/core/src/common/guards/terms-acceptance.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TermsService } from '../../services/terms.service';

@Injectable()
export class TermsAcceptanceGuard implements CanActivate {
  constructor(private termsService: TermsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // Si no está autenticado, otro guard lo maneja

    // Rutas excluidas (no requieren aceptación)
    const excludedRoutes = [
      '/api/v1/auth',
      '/api/v1/terms',
      '/api/v1/health',
    ];

    if (excludedRoutes.some(route => request.path.startsWith(route))) {
      return true;
    }

    const { needsAcceptance, currentVersion } = await this.termsService.checkUserAcceptance(user.id);

    if (needsAcceptance) {
      // App Blocker: Lanzar error que el frontend debe manejar
      throw new ForbiddenException({
        code: 'TERMS_NOT_ACCEPTED',
        message: 'Debes aceptar los nuevos Términos y Condiciones para continuar',
        currentVersion,
        redirectTo: '/terms/accept',
      });
    }

    return true;
  }
}
```

**3. Endpoint de Aceptación de T&C:**

```typescript
// apps/suntus-services/src/terms/terms.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TermsService } from './terms.service';

@Controller('api/v1/terms')
export class TermsController {
  constructor(private termsService: TermsService) {}

  @Get('current')
  async getCurrentTerms() {
    return await this.termsService.getCurrentVersion();
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async checkAcceptance(@Req() req) {
    return await this.termsService.checkUserAcceptance(req.user.id);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  async acceptTerms(@Req() req, @Body() dto: { termsId: string }) {
    const request = req;
    return await this.termsService.acceptTerms(
      req.user.id,
      dto.termsId,
      request.ip,
      request.headers['user-agent']
    );
  }
}
```

**4. Frontend: App Blocker:**

```typescript
// apps/suntus-app/src/hooks/useTermsAcceptance.ts
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@suntus/api-client';

export function useTermsAcceptance() {
  const { user } = useAuth();
  const [needsAcceptance, setNeedsAcceptance] = useState(false);
  const [currentTerms, setCurrentTerms] = useState(null);

  useEffect(() => {
    if (!user) return;

    const checkTerms = async () => {
      try {
        const status = await apiClient.terms.checkAcceptance();
        if (status.needsAcceptance) {
          setNeedsAcceptance(true);
          const terms = await apiClient.terms.getCurrent();
          setCurrentTerms(terms);
        }
      } catch (error) {
        if (error.code === 'TERMS_NOT_ACCEPTED') {
          setNeedsAcceptance(true);
        }
      }
    };

    checkTerms();
  }, [user]);

  return { needsAcceptance, currentTerms };
}

// Componente de bloqueo
// apps/suntus-app/src/components/TermsBlocker.tsx
export function TermsBlocker({ children }) {
  const { needsAcceptance, currentTerms } = useTermsAcceptance();

  if (needsAcceptance) {
    return <TermsAcceptanceModal terms={currentTerms} />;
  }

  return <>{children}</>;
}
```

### 10.3 Acciones Críticas que DEBEN Auditarse

**Lista Completa de Acciones que Generan AuditLog:**

1. **Autenticación:**
   - Login exitoso/fallido
   - Cambio de contraseña
   - Recuperación de contraseña

2. **Gestión de Usuarios:**
   - Creación de cuenta
   - Actualización de perfil
   - Suspensión/activación de cuenta
   - Eliminación de cuenta

3. **Gestión de Expertos:**
   - Registro de experto
   - Validación (aprobar/rechazar)
   - Cambio de estado (activo/inactivo)
   - Modificación de tarifas

4. **Pagos y Transacciones:**
   - Procesamiento de pago
   - Cálculo de comisión
   - Dispersión de fondos
   - Reembolsos

5. **Planes y Contenido:**
   - Creación de plan nutricional/deportivo
   - Modificación de plan
   - Eliminación de plan
   - Creación de ejercicio

6. **Datos Sensibles:**
   - Acceso a documentos privados (bucket privado)
   - Visualización de historial médico
   - Exportación de datos

7. **Términos y Condiciones:**
   - Aceptación de T&C
   - Publicación de nueva versión

8. **Administración:**
   - Cualquier acción de admin (suntus-core)
   - Cambios en configuración de plataforma
   - Modificación de comisiones

### 10.4 Estrategia de Retención y Consulta

**Retención:**
- **AuditLog:** Retención permanente (nunca se borra)
- **Índices:** Optimizados para búsquedas frecuentes
- **Particionamiento:** Considerar particionamiento por fecha si crece mucho (> 10M registros)

**Consultas Comunes:**
```typescript
// Obtener historial de cambios de una entidad
async getEntityHistory(entityType: string, entityId: string) {
  return await prisma.auditLog.findMany({
    where: { entityType, entityId },
    orderBy: { timestamp: 'desc' },
  });
}

// Obtener acciones de un usuario
async getUserActions(userId: string) {
  return await prisma.auditLog.findMany({
    where: { actorId: userId },
    orderBy: { timestamp: 'desc' },
  });
}

// Obtener aceptaciones de T&C por versión
async getTermsAcceptances(version: string) {
  return await prisma.auditLog.findMany({
    where: {
      entityType: 'TermsAndConditions',
      action: AuditAction.ACCEPT,
      snapshot: {
        path: ['after', 'termsVersion'],
        equals: version,
      },
    },
  });
}
```

### 10.5 Integración en el Plan de Desarrollo

**FASE 0 (Infraestructura Base):**
- [x] Crear modelo `AuditLog` en Prisma
- [x] Crear modelo `TermsAndConditions` y `TermsAcceptance`
- [x] Implementar `AuditService`
- [x] Implementar `TermsService`
- [x] Crear `AuditInterceptor` global
- [x] Crear `TermsAcceptanceGuard`
- [x] Configurar middleware de auditoría en `main.ts`

**FASE 1 (Acceso y Registro):**
- [ ] Auditar login/logout
- [ ] Auditar registro de usuarios/expertos
- [ ] Implementar aceptación de T&C en registro
- [ ] App blocker si no acepta T&C

**FASE 3 (Suscripciones):**
- [ ] Auditar procesamiento de pagos
- [ ] Auditar cálculo de comisiones
- [ ] Auditar dispersión de fondos

**FASE 4 (Planes):**
- [ ] Auditar creación/modificación de planes
- [ ] Auditar acceso a historial médico

**FASE 6 (Admin):**
- [ ] Auditar validación de expertos
- [ ] Auditar acceso a documentos privados
- [ ] Dashboard de auditoría en suntus-core

### 10.6 Consideraciones de Seguridad

**Protección de AuditLog:**
- **Permisos:** Solo admin puede consultar AuditLog
- **Encriptación:** Considerar encriptar campos sensibles en `snapshot` (PII)
- **Backup:** Backup diario de AuditLog (crítico para evidencia legal)
- **Integridad:** Hash de cada registro para detectar modificaciones (aunque no deberían existir)

**Compliance:**
- **GDPR:** AuditLog puede contener PII, considerar anonimización después de X años
- **Retención Legal:** Consultar con legal sobre período de retención requerido
- **Exportación:** Endpoint para exportar logs (solo admin) para casos legales

---

## 11. Notas Finales

1. **i18n desde el inicio:** Todas las strings deben estar en archivos de traducción desde FASE 0.
2. **JSONB para contenido dinámico:** Usar JSONB en PostgreSQL para campos traducibles: `{"es": "Texto", "en": "Text"}`. Aplicar a ejercicios, planes nutricionales, países, etc.
3. **Catálogo de ubicaciones con `countries-list`:** Usar paquete npm `countries-list` (https://github.com/annexare/Countries) para datos de países. Proporciona ISO 3166-1, nombres nativos, capitales, monedas. Complementar con datos de México (estados, ciudades, municipios).
4. **Pagos en paralelo:** El sistema de pagos puede desarrollarse en paralelo a otras fases.
5. **Templates configurables después:** Empezar con templates fijos, hacer configurables en FASE 3.
6. **Métricas al final:** Las métricas requieren datos, desarrollarlas después de tener planes activos.
7. **Validación de expertos NO bloqueante:** Los expertos pueden dar servicio sin validación. La validación solo afecta su ranking/visibilidad en el directorio. Esto permite escalar sin cuello de botella manual.
8. **suntUS provee ejercicios base:** Los ejercicios base son placeholder provistos por suntUS. Los expertos crean sus propios ejercicios (algunos bien pedorros, como mencionaste). Admin NO crea ejercicios.
9. **suntus-core es solo monitoreo:** El panel de admin (suntus-core) es para monitorear datos generales, usuarios activos, ingresos, validar expertos. NO para dar de alta usuarios manualmente (eso sería imposible con 10,000 registros).
10. **suntUS es un hub/marketplace:** Conectamos usuarios con expertos. Los usuarios buscan por rating, precio, nombre, etc. El experto decide sus precios y planes.
11. **Seguridad de documentos:** Documentos oficiales de expertos van en **bucket privado** de GCS. Solo `suntus-admin` puede acceder. Configurar políticas IAM restrictivas, encriptación en reposo, y Signed URLs temporales para visualización en admin.
12. **Monetización Pay-Per-Seat:** Todo pago ocurre DENTRO de la plataforma. Usuario paga a suntUS, suntUS dispersa fondos. Sistema de comisiones automático con "Beca del 6to" (5 primeros usuarios = comisión, 6to+ = gratis para experto).
13. **Ranking Dinámico:** NO alfabético. Basado en: Verificación (+100), Reputación (+50), Volumen de Ventas (+30), Participación en Fitoteca (+20). Shadowban para no verificados.
14. **Cardex Médico Deportivo:** Propiedad del usuario. Historial viaja con el usuario al cambiar de experto. Auditoría con `createdBy` en cada entrada.
15. **Productividad del Experto:** Constructor de rutinas con bloques pre-existentes (no escribir). Plantillas clonables. Mago Nutricional: macros → sugerencias de recetas.
16. **Fitoteca con Reputación:** Participación en Fitoteca suma puntos al ranking del experto. Contenido híbrido: Ejercicios de Sistema vs Ejercicios de Experto (distinción visual).
17. **Blindaje Legal & Auditoría (CRÍTICO):** Sistema de AuditLog append-only para protección legal. Todas las acciones críticas se registran (pagos, validaciones, acceso a datos sensibles). Términos y Condiciones versionados con tracking completo. App blocker obligatorio si no acepta nueva versión de T&C.
18. **Lógica Financiera Completa (Stripe Connect):**
    - **Wallet Model (Rolling T+7):** Fondos entran en pending, se mueven a available después de 7 días, se dispersan cada miércoles automáticamente
    - **Escrow para Packs:** Pagos anticipados se liberan en goteo mensual (ej: 6 meses = 1/6 cada mes)
    - **Grandfathering:** Precios inmutables para suscripciones existentes. Cambio de precio requiere Opt-in del usuario
    - **Digital Seal (Anti-Robo):** Reembolso automático solo primeros 7 días. Si contenido fue consumido (abierto o screenshot), se bloquea inmediatamente
    - **Watermark:** Componente obligatorio en pantallas de planes con patrón trazable (email, ID, timestamp)
    - **Créditos Internos:** Cambio de experto a mitad de ciclo genera crédito que se aplica automáticamente al nuevo experto
    - **Prorrateo:** Cancelación no genera reembolso parcial, pero cambio de experto sí genera crédito interno

---

## 12. Resumen de Lógica Financiera - Stripe Connect

### 12.1 Arquitectura de Pagos

**Motor Único:** Stripe Connect
- Todos los pagos se procesan a través de Stripe Connect
- Cobro vía Web (Stripe Checkout) para evitar comisiones IAP
- App móvil refleja estado de suscripción (no procesa pagos)

**Flujo de Pago:**
1. Usuario selecciona experto y servicio
2. Se crea Checkout Session en Stripe (vía web)
3. Usuario completa pago en Stripe Checkout
4. Webhook de Stripe notifica el pago exitoso
5. Sistema calcula comisión (Beca del 6to)
6. Se crea `PaymentTransaction` con `walletStatus = PENDING`
7. Se agrega a `pendingBalance` del experto
8. Después de 7 días, cron job mueve a `availableBalance`
9. Cada miércoles, cron job dispersa fondos disponibles

### 12.2 Wallet Model (Rolling T+7)

**Estados de Fondos:**
- **PENDING:** Fondos recién recibidos (esperando 7 días)
- **AVAILABLE:** Fondos disponibles para retiro (pasaron T+7)
- **PAID_OUT:** Fondos ya dispersados al experto

**Cron Jobs:**
- **T+7 (Diario):** Mueve fondos de PENDING a AVAILABLE
- **Payouts (Miércoles):** Dispersa fondos AVAILABLE a expertos

### 12.3 Escrow para Packs (Goteo)

**Ejemplo: Usuario paga 6 meses ($600)**
- Mes 1: Libera $100 a pendingBalance (T+7)
- Mes 2: Libera $100 a pendingBalance (T+7)
- ... hasta Mes 6
- Protege al usuario y al experto

### 12.4 Grandfathering (Snapshot de Precios)

**Proceso:**
1. Experto cambia precio → NO actualiza Price existente
2. Archiva Price anterior en Stripe
3. Crea nuevo Price en Stripe
4. Crea `SubscriptionSnapshot` del precio anterior
5. Suscripciones existentes mantienen `snapshotId` original
6. Nuevas suscripciones usan nuevo precio

**Migración Opt-in:**
- Experto ofrece nuevo precio a usuarios existentes
- Usuario decide: aceptar, mantener actual, o cancelar

### 12.5 Digital Seal (Anti-Robo)

**Ventana de Reembolso:**
- Primeros 7 días: Reembolso automático permitido
- Después de 7 días: Requiere aprobación manual

**El Candado:**
- Si `isContentConsumed = true` → Bloquea reembolso automático INMEDIATAMENTE
- Anula ventana de 7 días
- Solo reembolso manual con justificación

**Triggers:**
- Usuario abre plan → `isContentConsumed = true`
- Screenshot detectado → `screenshotDetected = true` + `isContentConsumed = true`

### 12.6 Watermark (Protección Visual)

**Especificación Frontend:**
- Componente: `FloatingWatermark`
- Props: `userEmail`, `userId`, `timestamp`
- Estilos: `pointerEvents: 'none'`, `opacity: 0.1`, `zIndex: 999`
- Contenido: Patrón repetido `{userEmail} | {userId} | {timestamp}`
- Obligatorio en pantallas de rutinas y dietas

### 12.7 Prorrateo y Créditos

**Cancelación:**
- No hay reembolso parcial en efectivo
- `cancelsAtPeriodEnd = true`
- Usuario mantiene acceso hasta `endDate`

**Cambio de Experto:**
- Calcula días restantes: `daysRemaining = (endDate - hoy)`
- Calcula crédito: `creditAmount = (amount / totalDays) * daysRemaining`
- Crea `UserCredit` con `reason = EXPERT_SWITCH`
- Se aplica automáticamente al nuevo experto

---

**Última actualización:** Diciembre 2024  
**Mantenedor:** Equipo de Desarrollo suntUS


