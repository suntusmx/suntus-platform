# Stack Tecnológico - Plataforma suntUS

## 1. Frontend - Tres Aplicaciones

### 1.1 Arquitectura de Frontend

La plataforma suntUS se compone de **tres aplicaciones frontend independientes**:

1. **suntus-app**: App móvil para usuarios (React Native)
2. **suntus-pro**: App móvil para expertos (React Native)
3. **suntus-core**: Panel web de administración (React/Next.js)

**Arquitectura Recomendada: Monorepo con Código Compartido**
- **Código compartido** para lógica de negocio, servicios API, utilidades, tipos
- **Código separado** para UI/UX específica de cada app
- **Ventajas**: 
  - Desarrollo más rápido al compartir lógica común
  - Mantenimiento simplificado
  - Consistencia en APIs y servicios
  - Type safety compartido entre frontends
  - Costos reducidos de desarrollo

**Estructura sugerida del Monorepo**:
```
suntus-platform/
├── apps/
│   ├── suntus-app/         # App de Usuario (React Native)
│   ├── suntus-pro/          # App de Experto (React Native)
│   └── suntus-core/         # Panel Admin (Next.js)
├── packages/
│   ├── shared/              # Lógica compartida (TypeScript)
│   ├── api-client/          # Cliente API compartido (GraphQL + REST)
│   ├── ui-components/       # Componentes UI compartidos (opcional)
│   ├── types/               # Tipos TypeScript compartidos
│   └── utils/               # Utilidades compartidas
└── services/
    └── suntus-services/     # Backend unificado
```

### 1.2 Stack Específico por App

#### suntus-app (App de Usuario)
- **React Native** con TypeScript
- **Enfoque**: Consumo de contenido, visualización, seguimiento
- **Características clave**: 
  - Integración con wearables (HealthKit, Google Fit)
  - Offline-first para planes y progreso
  - UI optimizada para consumo de información
  - Notificaciones push frecuentes

**Librerías principales**:
- `react-navigation` - Navegación
- `react-query` / `swr` - Data fetching y cache
- `zustand` / `redux-toolkit` - State management
- `react-native-reanimated` - Animaciones
- `react-native-health` - Integración HealthKit
- `@react-native-community/google-fit` - Integración Google Fit
- `victory-native` / `recharts` - Gráficos y visualizaciones
- `apollo-client` - Cliente GraphQL
- `react-native-gesture-handler` - Gestos

#### suntus-pro (App de Experto)
- **React Native** con TypeScript
- **Enfoque**: Creación, gestión, análisis
- **Características clave**:
  - Herramientas de creación de contenido
  - Dashboards y visualizaciones de datos
  - Gestión de múltiples clientes
  - UI optimizada para productividad

**Librerías principales**:
- `react-navigation` - Navegación
- `react-query` / `swr` - Data fetching y cache
- `zustand` / `redux-toolkit` - State management
- `react-native-reanimated` - Animaciones
- `victory-native` / `recharts` - Gráficos y dashboards
- `apollo-client` - Cliente GraphQL
- `react-native-image-picker` - Selección de imágenes/videos
- `react-native-document-picker` - Gestión de archivos

#### suntus-core (Panel de Administración Web)

- **Next.js** con TypeScript (recomendado) o **React + Vite**
- **Enfoque**: Administración, control, análisis ejecutivo
- **Características clave**:
  - Dashboards ejecutivos con métricas globales
  - Gestión completa de usuarios y expertos
  - Transacciones y pagos
  - Moderación de contenido
  - Configuración de plataforma

**Librerías principales**:
- `next.js` - Framework React con SSR/SSG
- `react-query` / `swr` - Data fetching y cache
- `zustand` / `redux-toolkit` - State management
- `apollo-client` - Cliente GraphQL
- `recharts` / `chart.js` - Gráficos y visualizaciones
- `react-table` / `tanstack-table` - Tablas de datos
- `react-hook-form` - Formularios
- `zod` - Validación de formularios
- `tailwindcss` - Estilos (recomendado) o `styled-components`
- `shadcn/ui` o `chakra-ui` - Componentes UI
- `date-fns` - Manejo de fechas
- `react-hot-toast` - Notificaciones

**Stack UI recomendado**:
- **Tailwind CSS** + **shadcn/ui**: Para diseño moderno y rápido
- **React Hook Form** + **Zod**: Para formularios robustos
- **TanStack Table**: Para tablas complejas con filtros y paginación

### 1.3 Alternativa: Desarrollo Nativo

Si se requiere máximo rendimiento y acceso a APIs nativas:
- **iOS**: Swift + SwiftUI para ambas apps
- **Android**: Kotlin + Jetpack Compose para ambas apps
- **Ventajas**: Mejor rendimiento, acceso completo a APIs
- **Desventajas**: Desarrollo duplicado, mayor tiempo y costo
- **Recomendación**: Solo si hay requisitos específicos de rendimiento o APIs nativas críticas

---

## 2. Backend Unificado

### 2.1 Arquitectura General

**Arquitectura Híbrida: GraphQL + REST**

- **GraphQL** para consultas complejas (dashboards, métricas, planes con relaciones)
- **REST** para operaciones simples (CRUD, webhooks, integraciones externas)
- **Backend unificado** que sirve a ambas apps con diferentes permisos según rol

### 2.2 Lenguaje y Framework

**Stack Principal**:
- **Node.js + Express + TypeScript**: Para servicios generales
  - Express para endpoints REST
  - Apollo Server / GraphQL Yoga para GraphQL
  - TypeScript para type safety y mejor DX

**Stack para IA/ML**:
- **Python + FastAPI**: Para servicios de IA/ML
  - FastAPI para APIs de ML
  - TensorFlow / PyTorch para modelos
  - MLflow para gestión de modelos

**Recomendación**: Node.js/TypeScript para servicios generales, Python para servicios de IA/ML.

### 2.3 Base de Datos

#### Base de Datos Principal
- **PostgreSQL**: 
  - Base de datos relacional principal
  - ACID compliance
  - Soporte para JSONB para datos flexibles
  - Extensiones: PostGIS (si se necesita geolocalización)

#### Base de Datos NoSQL (Opcional)
- **MongoDB**: 
  - Para datos no estructurados y flexibles
  - Contenido de Fitoteca, logs de actividad
  - Solo si se requiere flexibilidad extrema

#### Cache y Sesiones
- **Redis**: 
  - Cache de alta velocidad
  - Sesiones de usuario
  - Rate limiting
  - Colas de trabajos (Bull/BullMQ)

#### Series Temporales
- **TimescaleDB** (extensión de PostgreSQL) o **InfluxDB**:
  - Para métricas de actividad física
  - Datos de wearables
  - Series temporales optimizadas

### 2.4 ORM y Database Tools

- **Prisma** (recomendado) o **TypeORM**:
  - Type-safe database access
  - Migrations automáticas
  - Excelente integración con TypeScript
  - Soporte para GraphQL code generation

### 2.5 Almacenamiento de Archivos

- **AWS S3** / **Google Cloud Storage** / **Azure Blob Storage**:
  - Para archivos multimedia (imágenes, videos de ejercicios)
  - CDN integrado para distribución rápida

- **CDN**:
  - CloudFront (AWS) / Cloudflare
  - Distribución global de assets estáticos

### 2.6 GraphQL Implementation

**Stack GraphQL**:
- **Apollo Server** (recomendado) o **GraphQL Yoga**:
  - Servidor GraphQL robusto
  - Soporte para subscriptions (tiempo real)
  - Integración con TypeScript
  - Code generation para types

**Herramientas**:
- `graphql-codegen` - Generación de tipos TypeScript
- `graphql-tools` - Schema composition
- `@graphql-tools/schema` - Schema building

**Estructura GraphQL**:
```
backend/
├── graphql/
│   ├── schema/
│   │   ├── user.graphql
│   │   ├── expert.graphql
│   │   ├── nutrition.graphql
│   │   ├── sports.graphql
│   │   └── metrics.graphql
│   ├── resolvers/
│   │   ├── user.resolver.ts
│   │   ├── expert.resolver.ts
│   │   └── ...
│   └── types/
│       └── generated.ts
```

### 2.7 REST API Implementation

**Stack REST**:
- **Express.js** con TypeScript:
  - Framework web robusto y maduro
  - Middleware ecosystem extenso
  - Fácil integración con servicios externos

**Herramientas**:
- `express-validator` - Validación de requests
- `helmet` - Security headers
- `cors` - CORS configuration
- `compression` - Response compression
- `morgan` - HTTP request logging

**Estructura REST**:
```
backend/
├── rest/
│   ├── routes/
│   │   ├── payments.routes.ts
│   │   ├── webhooks.routes.ts
│   │   └── integrations.routes.ts
│   └── controllers/
│       └── ...
```

---

## 3. Infraestructura y DevOps

### 3.1 Cloud Provider

**Opciones**:
- **AWS** (recomendado): Amplio ecosistema, servicios maduros
- **Google Cloud Platform**: Excelente para ML/AI, Kubernetes nativo
- **Azure**: Buena integración con Microsoft ecosystem

**Servicios Cloud Clave**:
- Compute: EC2 / ECS / Lambda (AWS), Cloud Run (GCP)
- Database: RDS PostgreSQL, ElastiCache Redis
- Storage: S3, Cloud Storage
- CDN: CloudFront, Cloudflare
- Monitoring: CloudWatch, Stackdriver

### 3.2 Contenedores y Orquestación

- **Docker**: Containerización de aplicaciones
- **Kubernetes**: Orquestación de contenedores
  - Auto-scaling
  - Load balancing
  - Service discovery
  - Health checks

**Alternativa más simple**:
- **Docker Compose**: Para desarrollo y staging
- **ECS (AWS)** / **Cloud Run (GCP)**: Managed container services

### 3.3 CI/CD

**Opciones**:
- **GitHub Actions** (recomendado): Integrado con GitHub
- **GitLab CI**: Si se usa GitLab
- **Jenkins**: Para setups más complejos

**Pipeline típico**:
1. Lint y tests
2. Build de imágenes Docker
3. Tests de integración
4. Deploy a staging
5. Tests E2E
6. Deploy a producción

### 3.4 Monitoreo y Observabilidad

**Stack de Monitoreo**:
- **Prometheus**: Métricas y alertas
- **Grafana**: Dashboards y visualización
- **Datadog** / **New Relic**: APM (Application Performance Monitoring)
- **Sentry**: Error tracking y monitoring

**Logging**:
- **ELK Stack** (Elasticsearch, Logstash, Kibana) o
- **CloudWatch Logs** (AWS) / **Stackdriver** (GCP)
- **Winston** / **Pino**: Logging en Node.js

---

## 4. Servicios de IA/ML

### 4.1 Frameworks de ML

- **TensorFlow** / **PyTorch**: 
  - Para modelos de ML personalizados
  - Entrenamiento de modelos

- **Scikit-learn**: 
  - Para modelos más simples
  - Preprocessing y feature engineering

### 4.2 Servicios de IA

- **OpenAI API**: 
  - Para procesamiento de lenguaje natural
  - Chatbot y recomendaciones basadas en texto

- **TensorFlow Serving** / **TorchServe**:
  - Para servir modelos entrenados
  - Inference en producción

### 4.3 ML en Dispositivo Móvil

- **TensorFlow Lite**: 
  - Para inferencia en Android
  - Modelos optimizados para móvil

- **Core ML**:
  - Para inferencia en iOS
  - Integración nativa con iOS

### 4.4 Gestión de Modelos ML

- **MLflow**: 
  - Gestión del ciclo de vida de modelos ML
  - Tracking de experimentos
  - Versionado de modelos
  - Deployment

**Stack Python para ML**:
```
ml-services/
├── fastapi/              # API para servicios ML
├── models/               # Modelos entrenados
├── training/             # Scripts de entrenamiento
└── inference/            # Servicios de inferencia
```

---

## 5. Autenticación y Seguridad

### 5.1 Gestión de Autenticación

**Opciones**:
- **Auth0**: Gestión completa de autenticación (recomendado para MVP)
- **Firebase Auth**: Integración fácil con Firebase
- **AWS Cognito**: Si se usa AWS
- **Custom JWT**: Implementación propia con Express

### 5.2 Tokens y Sesiones

- **JWT (JSON Web Tokens)**: 
  - Tokens de sesión
  - Stateless authentication
  - Refresh tokens para seguridad

- **OAuth 2.0 / OIDC**: 
  - Integración con redes sociales (Google, Apple, Facebook)
  - SSO (Single Sign-On)

### 5.3 Seguridad

- **Helmet.js**: Security headers
- **express-rate-limit**: Rate limiting
- **bcrypt** / **argon2**: Hashing de contraseñas
- **TLS/SSL**: Encriptación de tráfico
- **Encriptación en reposo**: Para datos sensibles en base de datos

### 5.4 Validación y Sanitización

- **express-validator**: Validación de requests
- **joi** / **zod**: Schema validation
- **sanitize-html**: Sanitización de contenido HTML

---

## 6. Notificaciones

### 6.1 Push Notifications

- **Firebase Cloud Messaging (FCM)**: 
  - Push notifications para Android
  - Cross-platform support

- **Apple Push Notification Service (APNs)**: 
  - Push notifications para iOS
  - Integración nativa

**Librerías**:
- `@react-native-firebase/messaging` - React Native
- `node-apn` - Servidor para APNs
- `firebase-admin` - Servidor para FCM

### 6.2 Email

- **SendGrid** / **AWS SES** / **Mailgun**: 
  - Emails transaccionales
  - Templates de email
  - Analytics de email

**Librerías**:
- `nodemailer` - Cliente SMTP
- `@sendgrid/mail` - SendGrid SDK

### 6.3 In-App Notifications

- Implementación propia en backend
- WebSockets o GraphQL Subscriptions para tiempo real
- Almacenamiento en base de datos para historial

---

## 7. Analítica

### 7.1 Product Analytics

- **Mixpanel** / **Amplitude**: 
  - Analítica de producto
  - User behavior tracking
  - Funnels y cohortes

- **Google Analytics**: 
  - Analítica web y móvil
  - Eventos personalizados

### 7.2 Custom Analytics

- **Backend propio**: 
  - Eventos personalizados
  - Métricas de negocio
  - Dashboards internos

**Stack**:
- Event tracking en backend
- Almacenamiento en base de datos de analítica
- Dashboards con Grafana o custom

---

## 8. Integraciones Externas

### 8.1 Wearables

**APIs**:
- **HealthKit** (iOS): `react-native-health`
- **Google Fit** (Android): `@react-native-community/google-fit`
- **Fitbit API**: REST API
- **Garmin API**: REST API

### 8.2 Pagos

- **Stripe** (recomendado): 
  - Pagos y suscripciones
  - Webhooks para eventos
  - Multi-currency support

- **PayPal**: 
  - Alternativa de pago
  - Integración adicional

- **Apple Pay** / **Google Pay**: 
  - Pagos nativos móviles
  - Integración con Stripe

### 8.3 Mapas y Geolocalización

- **Google Maps API** / **Mapbox**: 
  - Para tracking de rutas
  - Visualización de mapas
  - Geocoding

### 8.4 Otros Servicios

- **Twilio**: SMS y llamadas (si se requiere)
- **Cloudinary**: Procesamiento de imágenes (opcional)
- **FFmpeg**: Procesamiento de video (si se requiere)

---

## 9. Arquitectura de Backend para Dos Apps

### 9.1 API Gateway y Routing

- **API Gateway único** que enruta a ambas apps
- **Endpoints diferenciados** por rol (usuario vs. experto)
- **Autenticación basada en roles** (JWT con claims de rol)
- **Rate limiting diferenciado** según tipo de usuario

**Implementación**:
- Express middleware para routing
- `express-jwt` para validación de JWT
- `express-rate-limit` para rate limiting

### 9.2 Microservicios por Portal

El backend debe organizarse según los 12 portales identificados:

- **Servicio de Autenticación**: Portal de acceso y registro
- **Servicio de Perfiles**: Portal de perfil (usuario y experto)
- **Servicio de Directorio**: Portal directorio
- **Servicio de Suscripciones**: Portal de suscripción
- **Servicio de Nutrición**: Portal de nutrición
- **Servicio Deportivo**: Portal deportivo
- **Servicio de Planes**: Portal de planes
- **Servicio de Facturación**: Portal de facturación
- **Servicio de Ayuda**: Portal de ayuda
- **Servicio de Contenido**: Portal fitoteca
- **Servicio de Notificaciones**: Push, email, in-app
- **Servicio de IA/ML**: Recomendaciones y personalización

**Estructura de Microservicios**:
```
backend/
├── services/
│   ├── auth/
│   ├── profiles/
│   ├── directory/
│   ├── subscriptions/
│   ├── nutrition/
│   ├── sports/
│   ├── plans/
│   ├── billing/
│   ├── help/
│   ├── content/
│   ├── notifications/
│   └── ml/
├── shared/
│   ├── database/
│   ├── utils/
│   └── types/
└── api-gateway/
```

### 9.3 Separación de Datos por Rol

- **Base de datos compartida** con tablas diferenciadas por rol
- **Permisos a nivel de API** para acceso a datos
- **Views/Queries optimizadas** para cada tipo de usuario
- **Caché diferenciado** según tipo de consulta

**Estrategia**:
- Row-level security en PostgreSQL
- Middleware de autorización en Express
- GraphQL field-level permissions
- Redis cache keys diferenciados por rol

---

## 10. Stack Completo Resumido

### Frontend
- **suntus-app**: React Native + TypeScript (iOS/Android)
- **suntus-pro**: React Native + TypeScript (iOS/Android)
- **suntus-core**: Next.js + TypeScript (Web)
- **Apollo Client** (GraphQL) - Compartido
- **React Query** (Data fetching) - Compartido
- **Zustand** (State management) - Compartido
- **React Navigation** (Navegación) - Apps móviles
- **Tailwind CSS + shadcn/ui** - suntus-core

### Backend
- **Node.js** + **Express** + TypeScript
- **Apollo Server** (GraphQL)
- **Prisma** (ORM)
- **PostgreSQL** (Base de datos principal)
- **Redis** (Cache y sesiones)
- **TimescaleDB** (Series temporales)

### IA/ML
- **Python** + **FastAPI**
- **TensorFlow** / **PyTorch**
- **MLflow** (Gestión de modelos)

### Infraestructura
- **Docker** + **Kubernetes**
- **AWS** / **GCP** / **Azure**
- **GitHub Actions** (CI/CD)
- **Prometheus** + **Grafana** (Monitoreo)

### Servicios Externos
- **Stripe** (Pagos)
- **Firebase** (Push notifications)
- **SendGrid** (Email)
- **HealthKit** / **Google Fit** (Wearables)

---

## 11. Consideraciones de Implementación

### 11.1 TypeScript en Todo el Stack

- **Frontend**: React Native con TypeScript
- **Backend**: Node.js con TypeScript
- **Shared types**: Tipos compartidos entre frontend y backend
- **GraphQL Code Generation**: Tipos automáticos desde schema

### 11.2 Monorepo vs Multi-repo

**Recomendación: Monorepo** (usando Turborepo o Nx)
- Código compartido fácil
- Versionado coordinado
- CI/CD simplificado
- Refactoring más fácil

### 11.3 Testing

- **Jest**: Unit tests
- **React Native Testing Library**: Tests de componentes
- **Supertest**: Tests de API
- **Detox** / **Appium**: E2E tests móviles
- **Playwright** / **Cypress**: E2E tests de API

### 11.4 Code Quality

- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Husky**: Git hooks
- **TypeScript strict mode**: Type safety máximo

---

## 12. Roadmap de Implementación Tecnológica

### Fase 1: Setup Base
- Monorepo con Turborepo/Nx
- React Native apps (usuario y experto)
- Backend Express básico
- PostgreSQL + Prisma
- Autenticación JWT

### Fase 2: GraphQL + REST
- Apollo Server setup
- GraphQL schema inicial
- REST endpoints para pagos/webhooks
- Redis para cache

### Fase 3: Integraciones
- HealthKit / Google Fit
- Stripe integration
- Push notifications
- Email service

### Fase 4: IA/ML
- Python FastAPI service
- Modelos ML básicos
- MLflow setup
- Integración con backend principal

### Fase 5: Producción
- Kubernetes deployment
- Monitoring completo
- CI/CD pipeline
- Performance optimization

---

## 13. Arquitectura del "Super Stack" - Tres Frontends + Backend

### 13.1 Visión General

El "super stack" de suntUS consiste en:
- **3 aplicaciones frontend** (suntus-app, suntus-pro, suntus-core)
- **1 backend unificado** (suntus-services)
- **Código compartido** entre frontends
- **APIs unificadas** (GraphQL + REST)

### 13.2 Estructura Recomendada del Monorepo

**Opción 1: Turborepo (Recomendado)**

```
suntus-platform/
├── apps/
│   ├── suntus-app/              # React Native - App Usuario
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   ├── suntus-pro/              # React Native - App Experto
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   └── suntus-core/             # Next.js - Panel Admin
│       ├── src/
│       ├── pages/
│       ├── components/
│       └── package.json
├── packages/
│   ├── shared/                  # Lógica compartida
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   ├── helpers/
│   │   │   └── validations/
│   │   └── package.json
│   ├── api-client/              # Cliente API compartido
│   │   ├── src/
│   │   │   ├── graphql/
│   │   │   ├── rest/
│   │   │   └── hooks/
│   │   └── package.json
│   ├── types/                   # Tipos TypeScript compartidos
│   │   ├── src/
│   │   │   ├── user.types.ts
│   │   │   ├── expert.types.ts
│   │   │   └── api.types.ts
│   │   └── package.json
│   └── ui-components/            # Componentes compartidos (opcional)
│       ├── src/
│       └── package.json
├── services/
│   └── suntus-services/         # Backend unificado
│       ├── src/
│       │   ├── graphql/
│       │   ├── rest/
│       │   ├── services/
│       │   └── database/
│       └── package.json
├── turbo.json                   # Configuración Turborepo
├── package.json                 # Root package.json
└── pnpm-workspace.yaml          # Workspace config (pnpm)
```

**Ventajas de Turborepo**:
- Build caching inteligente
- Task orchestration
- Incremental builds
- Parallel execution
- Remote caching (opcional)

**Opción 2: Nx**

Similar estructura pero usando Nx en lugar de Turborepo. Nx ofrece:
- Graph de dependencias
- Affected projects detection
- Code generation
- Plugin ecosystem más amplio

### 13.3 Gestión de Código Compartido

#### 13.3.1 Tipos Compartidos

**packages/types/src/index.ts**:
```typescript
// Tipos compartidos entre todos los frontends y backend
export type User = { ... }
export type Expert = { ... }
export type Plan = { ... }
export type Subscription = { ... }
```

**Uso en frontends**:
```typescript
import { User, Expert } from '@suntus/types'
```

#### 13.3.2 Cliente API Compartido

**packages/api-client/src/graphql/queries.ts**:
```typescript
// Queries GraphQL compartidas
export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) { ... }
  }
`
```

**packages/api-client/src/rest/client.ts**:
```typescript
// Cliente REST compartido
export const apiClient = {
  users: { ... },
  experts: { ... },
  payments: { ... }
}
```

#### 13.3.3 Utilidades Compartidas

**packages/shared/src/utils/format.ts**:
```typescript
// Funciones utilitarias compartidas
export const formatCurrency = (amount: number) => { ... }
export const formatDate = (date: Date) => { ... }
```

### 13.4 Autenticación y Autorización Multi-App

#### 13.4.1 Estrategia de Roles

**Backend (suntus-services)**:
```typescript
enum UserRole {
  USER = 'user',
  EXPERT = 'expert',
  ADMIN = 'admin'
}

// JWT con claims de rol
interface JWTPayload {
  userId: string
  role: UserRole
  app: 'suntus-app' | 'suntus-pro' | 'suntus-core'
}
```

#### 13.4.2 Middleware de Autorización

**Backend**:
```typescript
// Middleware que valida rol y app
const authorize = (allowedRoles: UserRole[], allowedApps?: string[]) => {
  return (req, res, next) => {
    const { role, app } = req.user
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    if (allowedApps && !allowedApps.includes(app)) {
      return res.status(403).json({ error: 'App not allowed' })
    }
    next()
  }
}
```

#### 13.4.3 GraphQL Field-Level Permissions

```typescript
// Resolver con permisos por campo
const resolvers = {
  Query: {
    users: (parent, args, context) => {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }
      return getUsers()
    }
  },
  User: {
    email: (parent, args, context) => {
      // Solo admin puede ver emails
      if (context.user.role !== 'admin') {
        return null
      }
      return parent.email
    }
  }
}
```

### 13.5 Comunicación entre Apps y Backend

#### 13.5.1 GraphQL Endpoints

**Backend**:
```typescript
// Apollo Server con múltiples schemas o schema unificado
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  context: ({ req }) => {
    const user = authenticate(req)
    return { user, app: req.headers['x-app-name'] }
  }
})
```

**Frontends**:
```typescript
// Cliente Apollo compartido
const apolloClient = new ApolloClient({
  uri: process.env.API_URL,
  headers: {
    'x-app-name': 'suntus-app' // o suntus-pro, suntus-core
  }
})
```

#### 13.5.2 REST Endpoints

**Backend**:
```typescript
// Express con routing por app
app.use('/api/v1/users', authorize(['admin'], ['suntus-core']), userRoutes)
app.use('/api/v1/payments', authorize(['admin'], ['suntus-core']), paymentRoutes)
```

### 13.6 CI/CD para Múltiples Apps

#### 13.6.1 Pipeline con Turborepo

**.github/workflows/ci.yml**:
```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm turbo build --filter='...'
      - run: pnpm turbo test --filter='...'
      - run: pnpm turbo lint --filter='...'
```

#### 13.6.2 Deploy Separado por App

```yaml
deploy-app:
  needs: build
  if: contains(github.event.head_commit.message, '[deploy-app]')
  steps:
    - run: pnpm turbo build --filter=suntus-app
    - run: # Deploy a App Store / Play Store

deploy-pro:
  needs: build
  if: contains(github.event.head_commit.message, '[deploy-pro]')
  steps:
    - run: pnpm turbo build --filter=suntus-pro
    - run: # Deploy a App Store / Play Store

deploy-core:
  needs: build
  if: contains(github.event.head_commit.message, '[deploy-core]')
  steps:
    - run: pnpm turbo build --filter=suntus-core
    - run: # Deploy a Vercel / AWS / etc.
```

### 13.7 Gestión de Versiones

#### 13.7.1 Versionado Coordinado

**Estrategia**: Usar cambiosets o Lerna para versionado coordinado

```json
// package.json root
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "services/*"
  ]
}
```

#### 13.7.2 Dependencias entre Paquetes

```json
// apps/suntus-app/package.json
{
  "dependencies": {
    "@suntus/api-client": "workspace:*",
    "@suntus/types": "workspace:*",
    "@suntus/shared": "workspace:*"
  }
}
```

### 13.8 Testing en Monorepo

#### 13.8.1 Tests Unitarios

```bash
# Ejecutar tests de todos los paquetes
pnpm turbo test

# Tests de un app específico
pnpm turbo test --filter=suntus-app

# Tests de packages compartidos
pnpm turbo test --filter='@suntus/*'
```

#### 13.8.2 Tests E2E

```typescript
// Tests E2E que prueban integración entre apps y backend
describe('User Subscription Flow', () => {
  it('should allow user to subscribe to expert', async () => {
    // Test que involucra suntus-app y suntus-services
  })
})
```

### 13.9 Desarrollo Local

#### 13.9.1 Scripts de Desarrollo

**package.json root**:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:app": "turbo run dev --filter=suntus-app",
    "dev:pro": "turbo run dev --filter=suntus-pro",
    "dev:core": "turbo run dev --filter=suntus-core",
    "dev:services": "turbo run dev --filter=suntus-services",
    "dev:all": "turbo run dev --parallel"
  }
}
```

#### 13.9.2 Hot Reload

Turborepo maneja hot reload automáticamente:
- Cambios en packages compartidos → rebuild automático
- Cambios en apps → hot reload
- Cambios en backend → restart automático

### 13.10 Consideraciones de Performance

#### 13.10.1 Code Splitting

**suntus-core (Next.js)**:
```typescript
// Lazy loading de componentes pesados
const AdminDashboard = dynamic(() => import('./AdminDashboard'))
const UserManagement = dynamic(() => import('./UserManagement'))
```

#### 13.10.2 Bundle Size

- **suntus-app / suntus-pro**: Optimizar bundle de React Native
- **suntus-core**: Code splitting por ruta (Next.js)
- **packages compartidos**: Tree-shaking automático

### 13.11 Monitoreo Multi-App

#### 13.11.1 Tracking por App

```typescript
// packages/shared/src/analytics.ts
export const trackEvent = (event: string, data: any) => {
  const app = process.env.APP_NAME // suntus-app, suntus-pro, suntus-core
  analytics.track(event, { ...data, app })
}
```

#### 13.11.2 Error Tracking

```typescript
// Sentry con tags por app
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tags: {
    app: process.env.APP_NAME
  }
})
```

### 13.12 Resumen de Arquitectura

**Estructura Final**:
```
suntus-platform/
├── apps/ (3 frontends)
│   ├── suntus-app/      → React Native (iOS/Android)
│   ├── suntus-pro/      → React Native (iOS/Android)
│   └── suntus-core/     → Next.js (Web)
├── packages/ (código compartido)
│   ├── shared/          → Lógica común
│   ├── api-client/      → Cliente API
│   ├── types/           → Tipos TypeScript
│   └── ui-components/   → Componentes (opcional)
└── services/
    └── suntus-services/ → Backend (Express + GraphQL)
```

**Comunicación**:
- **GraphQL**: Para consultas complejas (dashboards, métricas)
- **REST**: Para operaciones simples (CRUD, webhooks)
- **WebSockets/Subscriptions**: Para tiempo real (opcional)

**Autenticación**:
- **JWT** con claims de rol y app
- **Middleware** de autorización por rol y app
- **Field-level permissions** en GraphQL

**Deployment**:
- **Apps móviles**: App Store / Play Store
- **suntus-core**: Vercel / AWS Amplify / CloudFront
- **suntus-services**: Kubernetes / ECS / Cloud Run

