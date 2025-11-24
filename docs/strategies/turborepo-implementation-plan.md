# Plan de Implementación Turborepo - suntUS

Este documento detalla la estrategia técnica para implementar el Monorepo de **suntUS** utilizando **Turborepo** y **pnpm**.

> [!IMPORTANT]
> **Nota de Moneda:** Todos los costos financieros mencionados en este documento están expresados en **Dólares Estadounidenses (USD)**.

## 1. Visión General de la Arquitectura

La plataforma **suntUS** se compone de 4 aplicaciones frontend y un backend unificado, todos compartiendo lógica y diseño a través de paquetes internos.

### 1.1 Resumen de Proyectos
*   **`apps/suntus-app` (Usuario):** App móvil (iOS/Android) para que los clientes reciban sus planes, registren progresos y chateen.
*   **`apps/suntus-pro` (Experto):** App móvil (iOS/Android) para entrenadores y nutricionistas. Su oficina de bolsillo para gestionar clientes.
*   **`apps/suntus-core` (Admin):** Panel Web para los administradores de la plataforma. Gestión de usuarios, pagos y la "Fitoteca" (base de datos de ejercicios).
*   **`apps/suntus-landing` (Marketing):** Sitio Web público optimizado para SEO. Su misión es atraer tráfico y convertir visitantes en descargas.
*   **`apps/suntus-services` (Backend):** El cerebro. API **NestJS** que centraliza la lógica de negocio, conecta con bases de datos y servicios externos. Diseñado con **Clean Architecture**.

### 1.2 Diagrama de Comunicación
```mermaid
graph TD
    UserApp[📱 suntus-app\n(Usuarios)] -->|API REST/GQL| Backend[⚙️ suntus-services\n(NestJS API)]
    ExpertApp[📱 suntus-pro\n(Expertos)] -->|API REST/GQL| Backend
    AdminPanel[💻 suntus-core\n(Admin Web)] -->|API REST/GQL| Backend
    Landing[🌍 suntus-landing\n(Marketing)] -->|Links| UserApp

    Backend -->|Auth| Auth0[🔐 Auth0]
    Backend -->|Data| Postgres[(🐘 PostgreSQL\nRelacional + JSONB)]
    Backend -->|Cache/Queue| Upstash[(⚡ Upstash Redis)]
    
    UserApp -->|Chat Realtime| Firestore[(🔥 Firebase Firestore)]
    ExpertApp -->|Chat Realtime| Firestore
    Backend -->|Push Notif| FCM[🔔 Firebase Cloud Messaging]
```

## 2. Estructura del Directorio

Seguiremos el estándar de Turborepo, separando aplicaciones desplegables de paquetes de lógica compartida.

```text
/
├── apps/
│   ├── suntus-app/       # App Usuarios (React Native / Expo)
│   ├── suntus-pro/       # App Expertos (React Native / Expo)
│   ├── suntus-core/      # Admin Panel (Next.js)
│   ├── suntus-landing/   # Landing Page (Next.js SSG)
│   └── suntus-services/  # Backend API (NestJS)
├── packages/
│   ├── ui/               # Componentes UI compartidos (Tamagui/Tokens)
│   ├── core/             # Lógica de negocio, tipos, validaciones Zod
│   ├── config/           # Configs de ESLint, TSConfig
│   └── api-client/       # Cliente API generado automáticamente
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 3. Mejores Prácticas por Tecnología

### 3.1 React Native en Monorepo (El Reto del Hoisting)
React Native (Metro Bundler) tradicionalmente tiene problemas para encontrar paquetes fuera de su carpeta raíz (`node_modules` en el root del monorepo).

**Solución Estratégica:**
1.  **Expo Router (Recomendado):** Usaremos Expo, que tiene mejor soporte para monorepos hoy en día.
2.  **Configuración de Metro:** En `apps/suntus-app/metro.config.js`, debemos configurar `watchFolders` para que mire dentro de `../../packages` y `node_modules` raíz.
3.  **No-Hoisting (Si es necesario):** Si alguna librería nativa da problemas, usaremos `.npmrc` para forzar que se instale dentro de la app (`public-hoist-pattern`).

### 3.2 Next.js (suntus-core)
Next.js se integra nativamente con Turborepo.
*   **Transpile Packages:** En `next.config.js`, usaremos `transpilePackages: ['@suntus/ui', '@suntus/core']` para asegurar que el código TS de los paquetes compartidos se compile correctamente.

### 3.3 Backend (suntus-services): NestJS + Clean Architecture
Has pedido **Clean Architecture, SOLID y Velocidad**. La respuesta es **NestJS**.
*   **Framework:** NestJS con **Fastify** (adapter).
    *   *Por qué Fastify:* Es hasta 2x más rápido que Express.
    *   *Por qué NestJS:* Impone una estructura modular (Modules, Controllers, Services) que facilita aplicar SOLID y Dependency Injection desde el día 1.
*   **API Híbrida:**
    *   **REST:** Para endpoints simples (Webhooks, Auth callbacks).
    *   **GraphQL (Apollo Server):** Para el 90% de la data de las apps. Evita over-fetching y under-fetching.
*   **Clean Architecture:**
    *   `Domain`: Entidades puras y reglas de negocio (en `packages/core` o dentro del módulo).
    *   `Application`: Casos de uso (Services).
    *   `Infrastructure`: Implementación de repositorios (Prisma), adaptadores de email, etc.
    *   `Presentation`: Controllers (REST) y Resolvers (GraphQL).

## 4. Definición de Paquetes Compartidos

### `@suntus/core`
El cerebro de la lógica compartida.
*   **Contenido:**
    *   Interfaces de TypeScript (User, Plan, Subscription).
    *   Schemas de Validación (Zod).
    *   Funciones de utilidad (formateo de moneda, fechas).
    *   Constantes globales.
*   **Dependencias:** Cero dependencias de UI (React). Solo librerías puras (date-fns, zod).

### `@suntus/ui`
El sistema de diseño.
*   **Estrategia:** Dado que tenemos React Native y Web (Next.js), tenemos dos caminos:
    1.  **Tamagui / Solito:** Librerías que permiten escribir UI una vez y exportar a Web y Nativo. (Alta complejidad inicial, alto retorno).
    2.  **Componentes Separados:** Exportar componentes lógicos o hooks, y que cada app implemente su vista.
    *   *Recomendación MVP:* Usar una librería base compatible con ambos o mantener componentes simples compartidos y estilos separados si la divergencia visual es alta. Para suntUS, sugiero **Tamagui** si se busca consistencia visual total, o simplemente compartir **Tokens de Diseño** (colores, tipografía) si las UIs son muy distintas.

### `@suntus/api-client`
*   **Generación Automática:** Usaremos herramientas como `graphql-codegen` para leer el schema del backend y generar hooks de React (`useGetUserQuery`) totalmente tipados.
*   **Beneficio:** Si el backend cambia un nombre de campo, el frontend no compila. Error detectado en tiempo de desarrollo, no en producción.

## 5. Configuración de Turborepo (`turbo.json`)

Definiremos un pipeline inteligente que cachea los resultados.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "lint": {},
    "type-check": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

*   **`^build`**: Significa "construye mis dependencias antes que a mí". Si `suntus-app` depende de `@suntus/ui`, Turborepo construirá UI primero.

## 6. Flujo de Trabajo (Developer Experience)

1.  **Setup:** `pnpm install` instala todo el universo de dependencias en segundos.
2.  **Desarrollo:** `pnpm dev` en el root lanza:
    *   Metro Bundler (App Usuario)
    *   Metro Bundler (App Experto)
    *   Next.js Server (Admin)
    *   Express Server (Backend)
    *   *Todo en paralelo, con logs unificados.*
3.  **Crear nuevo paquete:** Copiar template de `packages/config-typescript` y listo.

## 7. Estrategia de CI/CD (Integración y Despliegue Continuo)

El CI/CD es la tubería que lleva el código de tu laptop a producción de forma segura y automática.

### 7.1 ¿Qué es y para qué sirve?
*   **CI (Continuous Integration):** Es el "Guardia de Calidad". Cada vez que subes código (Push), un robot ejecuta tests, linter y verifica tipos. Si algo falla, no te deja mezclar (Merge) el código.
    *   *Beneficio:* Evita que errores tontos rompan la app en producción.
*   **CD (Continuous Deployment):** Es el "Repartidor Automático". Una vez aprobado el código, el robot lo empaqueta y lo sube a los servidores (Cloud Run, Firebase, App Stores).
    *   *Beneficio:* Velocidad. Puedes desplegar 10 veces al día sin esfuerzo manual.

### 7.2 Estrategia de Implementación (GitHub Actions)
Usaremos **GitHub Actions** por su integración nativa y generosa capa gratuita.

#### Pipeline de Pull Request (CI)
Se ejecuta en cada PR hacia `main`.
1.  **Checkout:** Baja el código.
2.  **Setup:** Instala Node.js y pnpm.
3.  **Turborepo Cache:** Descarga el caché de builds anteriores (ahorra minutos).
4.  **Lint & Type-Check:** Ejecuta `pnpm turbo run lint type-check`.
5.  **Test:** Ejecuta `pnpm turbo run test`.

#### Pipeline de Producción (CD)
Se ejecuta al hacer merge a `main`.
1.  **Backend & Admin (`suntus-services`, `suntus-core`):**
    *   Build Docker Image (usando `turbo prune`).
    *   Push a Google Artifact Registry.
    *   Deploy a **Cloud Run**.
2.  **Landing Page (`suntus-landing`):**
    *   Build estático (`next build`).
    *   Deploy a **Firebase Hosting**.
3.  **Apps Móviles (`suntus-app`, `suntus-pro`):**
    *   **EAS Update (Expo):** Para cambios de JS/TS (OTA Updates). El usuario recibe la actualización al abrir la app.
    *   **Native Build:** Para cambios de código nativo, dispara un build en EAS Build (esto suele ser manual o on-tag).

### 7.3 Análisis Financiero: CI/CD

| Concepto | Servicio | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Minutos de Build** | GitHub Actions | **$0.00** | **$0.00** | Fijo | 2,000 min/mes gratis (Suficiente MVP). |
| **Almacenamiento** | GitHub Packages | **$0.00** | **$0.00** | Fijo | 500MB gratis. |
| **TOTAL** | | **$0.00** | **$0.00** | | **Gratis para empezar.** |

## 8. Estrategia de Docker

La implementación de Docker es crítica para la consistencia entre desarrollo y producción (Cloud Run).

### 8.1 Desarrollo Local (`docker-compose.yml`)
Para desarrollo, no dockerizaremos las apps de Node.js (es más rápido usar `pnpm dev` en el host), pero sí la infraestructura de soporte.

**Servicios:**
*   **PostgreSQL 15:** Base de datos principal.
*   **Redis 7:** Para colas de trabajos y caché.
*   **pgAdmin (Opcional):** Interfaz visual para la BD.

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: suntus
      POSTGRES_PASSWORD: password
      POSTGRES_DB: suntus_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 8.2 Producción (Cloud Run) - El Reto del Monorepo
Dockerizar una app dentro de un Monorepo es complejo porque `suntus-services` depende de `packages/core`, que está fuera de su carpeta.

**Solución: Docker Multi-Stage con `turbo prune`**
Usaremos una característica avanzada de Turborepo llamada `prune` que "recorta" el monorepo y deja solo lo necesario para una app específica.

**Ejemplo de `Dockerfile` para `suntus-services`:**

```dockerfile
# Etapa 1: Prune (Recortar el monorepo)
FROM node:18-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Esto genera una carpeta "out" con solo lo necesario para "suntus-services"
RUN turbo prune --scope=suntus-services --docker

# Etapa 2: Install & Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=suntus-services

# Etapa 3: Runner (Imagen final ligera)
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "apps/suntus-services/dist/index.js"]
```

**Ventaja:** Obtenemos una imagen Docker final minúscula y segura, que contiene solo el código compilado y las dependencias de producción, lista para subir a Google Cloud Run.

### 8.3 Análisis Financiero: Cloud Run (Cómputo)

| Concepto | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CPU/Memoria** | < 10 req/seg | **$2.00** | **$24.00** | Variable | Tier gratuito cubre 2M req/mes. |
| **Registry** | Almacenamiento img | **$0.50** | **$6.00** | Variable | Costo por GB almacenado. |
| **TOTAL** | | **~$2.50** | **~$30.00** | | |

## 9. Estrategia de Seguridad y Autenticación

### 9.1 Autenticación: ¿Auth0 o Custom?
**Opinión:** Para **suntUS**, recomiendo iniciar con **Auth0** por velocidad y seguridad, pero diseñar el código para que sea "agnóstico" al proveedor.

*   **Por qué Auth0:**
    *   **Velocidad:** Nos ahorra meses de desarrollo en flujos complejos (Olvidé contraseña, MFA, Social Login con Apple/Google).
    *   **Seguridad:** Ellos se encargan de cumplir con normas (SOC2, GDPR) y proteger las contraseñas.
    *   **Separación de Audiencias:** Permite manejar fácilmente dos bases de usuarios distintas (Usuarios vs Expertos) o usar "Roles" dentro de una misma base.

*   **Implementación Técnica:**
    *   **Frontend:** Usaremos `react-native-auth0` para móvil y `nextjs-auth0` para web.
    *   **Backend:** El backend **NO** manejará usuarios ni contraseñas. Solo validará el `Bearer Token` (JWT) que le envíe el frontend.
    *   **Middleware:** Crearemos un middleware en Express que verifique la firma del JWT contra las claves públicas de Auth0.

### 9.2 Análisis Financiero: Auth0 (Identidad)

| Concepto | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Usuarios** | < 7,000 MAU | **$0.00** | **$0.00** | Fijo (Tier) | Plan B2C Free Tier. |
| **TOTAL** | | **$0.00** | **$0.00** | | Salto a ~$23/mes si excedemos. |

### 9.3 Medidas de Seguridad Globales

#### Backend (suntus-services)
1.  **Helmet:** Configuración estricta de headers HTTP para prevenir ataques XSS y Clickjacking.
2.  **Rate Limiting (Redis):** Limitaremos las peticiones por IP para evitar ataques de fuerza bruta o DDoS.
3.  **Zod Validation:** **NADA** entra al backend sin pasar por un esquema de Zod. Si el dato no tiene la forma correcta, se rechaza inmediatamente.
4.  **Sanitización:** Limpieza de inputs para prevenir inyección SQL (aunque Prisma ya protege de esto) y NoSQL Injection.

#### Frontend (Mobile & Web)
1.  **Secure Storage:** En móviles, **NUNCA** guardaremos tokens en `AsyncStorage` (es inseguro). Usaremos `expo-secure-store` (iOS Keychain / Android Keystore).
2.  **Environment Variables:** Las claves API públicas van en `.env`, pero los secretos reales (Service Accounts, Database Passwords) **NUNCA** tocan el código cliente.

#### Infraestructura (GCP)
1.  **Secret Manager:** Las credenciales de base de datos y claves de Auth0 se inyectan en tiempo de ejecución desde Google Secret Manager.
2.  **VPC Connector:** La base de datos Cloud SQL no tendrá IP pública. El backend se conectará a ella a través de una red privada interna de Google.

## 10. Estrategia de Redis

Redis no es solo un caché, es el "acelerador" de toda la plataforma.

### 10.1 Patrón de Caché con Prisma (Cache-Aside)
Prisma no tiene caché nativo. Implementaremos un patrón **Cache-Aside** en nuestros servicios (`packages/core` o `suntus-services`).

**Flujo:**
1.  **Request:** "Dame el perfil del usuario X".
2.  **Check Redis:** ¿Existe la clave `user:profile:X`?
    *   **SÍ (Hit):** Devuelve el JSON inmediatamente (2ms). **Ahorro:** No tocamos la BD.
    *   **NO (Miss):** Consulta a Prisma/Postgres (50ms) -> Guarda en Redis con TTL (ej: 1 hora) -> Devuelve al cliente.

**Invalidación Inteligente:**
Cuando el usuario actualiza su perfil (Mutation), no esperamos a que expire el TTL. El servicio de `updateProfile` debe ejecutar `redis.del('user:profile:X')` para asegurar consistencia inmediata.

### 10.2 Colas de Trabajo (BullMQ)
Usaremos **BullMQ** para manejar tareas pesadas en segundo plano.
*   **Mitigación de Costos (Upstash):**
    *   BullMQ por defecto revisa la cola constantemente. Esto puede inflar la factura de Upstash.
    *   **Solución:** Configuraremos el `drainDelay` del Worker a **5-10 segundos**.
    *   **Efecto:** Si la cola está vacía, el worker "duerme" 10 segundos antes de volver a preguntar. Esto reduce las peticiones de ~2.5M/mes a ~250k/mes (reducción del 90% en costos).

### 10.3 Rate Limiting Distribuido
Protección contra ataques DDoS y abuso de API.
*   **Implementación:** Middleware que cuenta peticiones por IP en Redis.
*   **Límite:** Ej: 100 peticiones / minuto por usuario.

### 10.4 Pub/Sub para Eventos Internos
Usaremos Redis Pub/Sub para comunicación ligera entre servicios.

### 10.5 Análisis Financiero: Redis

| Opción | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Recomendación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GC Memorystore** | 1GB RAM (Gestionado) | ~$35.00 | ~$420.00 | Fijo | Muy caro. |
| **Redis en VM** | 1GB RAM (e2-micro) | ~$6.00 | ~$72.00 | Fijo | Opción Docker. |
| **Upstash** | Serverless (Pay-per-req) | **~$1.00** | **~$12.00** | Variable | **SELECCIONADA.** |
| **TOTAL** | | **~$1.00** | **~$12.00** | | **Ahorro y Zero Ops.** |

## 11. Estrategia de Base de Datos: PostgreSQL + JSONB (The "One DB" Rule)

Has preguntado por **JSONB** en lugar de MongoDB. **Es la decisión correcta.** Simplifica la infraestructura masivamente.

### 11.1 Por qué PostgreSQL JSONB para la Fitoteca
*   **Lo mejor de dos mundos:** Tienes la rigidez relacional para pagos/usuarios y la flexibilidad de documentos para ejercicios en la misma base de datos.
*   **Performance:** El tipo de dato `JSONB` de Postgres es binario e indexable. Puedes hacer consultas como `SELECT * FROM exercises WHERE data->>'muscle' = 'chest'` a velocidad de rayo.
*   **Menos Mantenimiento:** No hay que gestionar (ni pagar) una instancia de Mongo separada. Backups unificados.

### 11.2 Arquitectura de Datos
*   **Tablas Relacionales (SQL):** `User`, `Subscription`, `Payment`, `TrainerClient`.
*   **Tablas Híbridas (JSONB):**
    *   `Exercise`:
        *   `id`: UUID
        *   `name`: String
        *   `metadata`: JSONB (Aquí va todo: videoUrl, músculos, equipo, tags... estructura flexible).
    *   `AuditLog`:
        *   `payload`: JSONB (Guarda el "antes" y "después" de cualquier cambio).

### 11.3 Análisis Financiero: Base de Datos

| Opción | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Postgres (VM)** | 1 Instancia | **$10.00** | **$120.00** | Fijo | Ya incluida en Sec 8. |
| **MongoDB** | Eliminado | **$0.00** | **$0.00** | - | **Ahorro de complejidad.** |
| **TOTAL** | | **$10.00** | **$120.00** | | **Infraestructura Unificada.** |

## 12. Estrategia Firebase (Chat y Ecosistema)

Has elegido **Firebase** para el chat. Es una excelente decisión estratégica porque nos abre la puerta a todo el ecosistema de Google para móviles.

### 12.1 Chat en Tiempo Real (Firestore)
Usaremos **Cloud Firestore** como backend del chat. Es una base de datos NoSQL que sincroniza datos en tiempo real con los dispositivos conectados.

**Estructura de Datos Propuesta:**
*   `channels/{channelId}`: Documento con metadatos (participantes, último mensaje, fecha de actualización).
*   `channels/{channelId}/messages/{messageId}`: Subcolección con los mensajes.
    *   `text`: String
    *   `senderId`: String (UID del usuario)
    *   `createdAt`: Timestamp
    *   `readBy`: Array<String> (para el "doble check azul")

**Seguridad (Firestore Rules):**
Implementaremos reglas estrictas para que **solo** los participantes de un chat puedan leer o escribir en él.
```javascript
match /channels/{channelId} {
  allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
}
```

**Integración Frontend:**
Usaremos `react-native-firebase` en las apps móviles. La librería maneja automáticamente la conexión WebSocket, el caché offline (para leer chats sin internet) y la reconexión.

### 12.2 Notificaciones Push (FCM)
El chat no sirve si el usuario no se entera de que le escribieron.
*   **Flujo:**
    1.  Cuando el Experto envía un mensaje a Firestore...
    2.  Una **Cloud Function** (o nuestro backend Node.js escuchando cambios) detecta el nuevo mensaje.
    3.  El backend busca el `fcmToken` del usuario destinatario en Redis/Postgres.
    4.  El backend envía la notificación a través de Firebase Cloud Messaging (FCM).
    5.  El celular del usuario recibe la alerta "Nuevo mensaje de tu Entrenador".

### 12.3 Calidad y Monitoreo (Crashlytics & Performance)
*   **Crashlytics:** Lo instalaremos desde el día 1. Nos enviará alertas críticas a Slack/Discord si la app se cierra inesperadamente en el celular de un usuario.
*   **Performance Monitoring:** Nos dirá si la app tarda mucho en abrirse o si las peticiones HTTP son lentas en ciertas regiones.

### 12.4 Modelo Económico (Estimado)
Firebase tiene un "Plan Blaze" (pago por uso) con una capa gratuita generosa.

| Concepto | Capa Gratuita | Costo Excedente | Estimación suntUS (MVP) |
| :--- | :--- | :--- | :--- |
| **Conexiones Simultáneas** | 200k | - | **$0** (Sobrado) |
| **Lecturas de Documentos** | 50k / día | $0.06 / 100k | **$0** (Hasta ~500 usuarios activos diarios chateando) |
| **Escrituras** | 20k / día | $0.18 / 100k | **$0** |
| **Almacenamiento** | 1 GB | $0.18 / GB | **$0** (Texto pesa poco) |

**Conclusión:** Para el lanzamiento y los primeros miles de usuarios, el chat te costará **$0 USD**.

## 13. Estrategia de Almacenamiento (Storage)

Necesitamos dos niveles de seguridad para los archivos. Usaremos **Google Cloud Storage** (compatible con Firebase SDK).

### 13.1 Arquitectura Dual
1.  **Bucket Público (`suntus-public`):**
    *   **Uso:** Fotos de perfil, portadas de videos, imágenes del blog.
    *   **Acceso:** Lectura pública (`allUsers: objectViewer`).
    *   **CDN:** Cacheado automáticamente por Google Edge locations.
2.  **Bucket Privado (`suntus-private`):**
    *   **Uso:** Documentos legales de expertos, reportes médicos, facturas.
    *   **Acceso:** **Denegado por defecto**.
    *   **Mecanismo:** El backend genera **Signed URLs** (URLs firmadas) con validez temporal (ej: 15 min) solo para el usuario autorizado.

### 13.2 Análisis Financiero: Storage

| Concepto | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Storage** | ~10 GB | **$0.20** | **$2.40** | Variable | $0.02 / GB. |
| **Egress** | ~50 GB | **$6.00** | **$72.00** | Variable | Transferencia de datos. |
| **TOTAL** | | **~$6.20** | **~$74.40** | | |

## 14. Estrategia de Landing Page (SEO & Marketing)

El proyecto `apps/suntus-landing` es la cara pública de la empresa. Su único objetivo es **convertir visitantes en usuarios**.

### 14.1 Pila Tecnológica: Next.js + Tailwind
*   **Next.js (App Router):** Usaremos `output: 'export'` para generar un sitio 100% estático (HTML/CSS/JS) que carga instantáneamente.
*   **Tailwind CSS:** Para iterar diseños de marketing rápidamente sin afectar el sistema de diseño de la app.

### 14.2 Estrategia SEO Técnica (The "Google Love" Checklist)
Implementaremos las siguientes reglas estrictas en `suntus-landing`:

1.  **Metadata API:** Cada página (`page.tsx`) exportará su objeto `metadata` con título, descripción y Open Graph (imágenes para compartir en WhatsApp/Twitter).
2.  **Sitemap & Robots.txt:** Generación automática de `sitemap.xml` para que Google indexe todas las rutas.
3.  **JSON-LD (Structured Data):** Inyectaremos schemas de `Organization` y `Product` para que Google muestre "estrellitas" y precios en los resultados de búsqueda.
4.  **Semantic HTML:** Uso estricto de `<header>`, `<main>`, `<article>`, `<footer>` y un solo `<h1>` por página.
5.  **Performance (Core Web Vitals):**
    *   Imágenes optimizadas con `next/image` (WebP/AVIF).
    *   Fuentes optimizadas con `next/font` (Google Fonts sin layout shift).
    *   Objetivo: Puntuación Lighthouse > 95.

## 15. Estrategia de Hosting (Web)

### 15.1 Landing Page vs Admin Panel
*   **Landing Page (`suntus.com`):** Sitio estático de marketing.
    *   **Hosting:** **Firebase Hosting**.
    *   **Por qué:** CDN global gratuito, SSL automático, despliegue con `firebase deploy`.
*   **Admin Panel (`admin.suntus.com`):** Aplicación Next.js dinámica (`suntus-core`).
    *   **Hosting:** **Cloud Run**.
    *   **Por qué:** Necesita servidor Node.js para lógica backend y seguridad. Firebase Hosting solo actuaría como proxy (innecesario).

### 15.2 Análisis Financiero: Hosting

| Servicio | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Firebase** | Landing Page | **$0.00** | **$0.00** | Fijo | Tier gratuito. |
| **Cloud Run** | Admin Panel | **$0.00** | **$0.00** | Variable | Incluido en Sec 7. |
| **TOTAL** | | **$0.00** | **$0.00** | | |

## 16. Estrategia de Testing (Calidad)

Un monorepo sin tests es una bomba de tiempo.

### 16.1 Niveles de Testing
1.  **Unitario (Jest):**
    *   **Dónde:** `packages/core`, `suntus-services` (Services/UseCases).
    *   **Objetivo:** Probar lógica de negocio pura (ej: "Calcular precio de plan").
    *   **Herramienta:** Jest (viene por defecto en NestJS).
2.  **Integración (Supertest):**
    *   **Dónde:** `suntus-services` (Controllers).
    *   **Objetivo:** Probar que la API responde 200 OK y guarda en DB (usando una DB de test en Docker).
3.  **End-to-End (Maestro):**
    *   **Dónde:** `apps/suntus-app`.
    *   **Objetivo:** Simular un usuario real tocando la pantalla del celular.
    *   **Herramienta:** **Maestro** (mucho más estable y fácil que Detox o Appium).

## 17. Estrategia de Logs y Observabilidad

"No console.log". Necesitamos trazabilidad estructurada.

### 17.1 Logger Estructurado (Pino)
Usaremos `nestjs-pino`.
*   **Formato:** JSON.
*   **Por qué:** Los logs en texto plano son difíciles de filtrar. JSON permite búsquedas como `level="error" AND userId="123"`.

### 17.2 Trazabilidad (Correlation ID)
Cada petición HTTP generará un `x-request-id` único. Este ID viajará desde el Frontend -> Nginx -> Backend -> Base de Datos -> Logs. Así podremos seguir la pista de un error a través de todo el sistema.

### 17.3 Destino (GCP Cloud Logging)
Cloud Run captura automáticamente todo lo que sale por `stdout` (consola). Si es JSON, lo indexa automáticamente. **Costo:** Gratis los primeros 50GB/mes.

## 18. Estrategia de Email (Transactional)

Para el MVP, necesitamos enviar correos de "Bienvenida", "Recuperar Contraseña" y "Recibo de Pago".

### 18.1 Proveedor: Resend
*   **Por qué:** Es la opción moderna para desarrolladores. API simple, excelente DX, y capa gratuita generosa (3,000 emails/mes).
*   **Alternativa:** Amazon SES (más barato a escala masiva, pero horrible DX).
*   **Google Workspace:** Tienes el dominio, pero usar el SMTP de Gmail para envíos transaccionales es mala idea (límites bajos, riesgo de spam). Usaremos Resend autenticado con tu dominio.

### 18.2 Análisis Financiero: Email

| Concepto | Volumetría MVP | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Emails** | < 3,000/mes | **$0.00** | **$0.00** | Fijo | Free Tier de Resend. |
| **TOTAL** | | **$0.00** | **$0.00** | | |

## 19. Troubleshooting y Riesgos (Lo que nadie te cuenta)

### 19.1 Metro Bundler & Monorepos
*   **Problema:** "Module not found". Metro se lía con los symlinks de pnpm.
*   **Solución Avanzada:**
    1.  Usar `@expo/metro-config` con la configuración de monorepo oficial.
    2.  Configurar `metro.config.js` con `watchFolders` apuntando a `../../packages`.
    3.  Si usas librerías nativas raras, pre-buildea el "Dev Client" (`npx expo run:android`) en lugar de usar Expo Go.
    4.  Para CI/CD: Usar EAS Build que maneja monorepos nativamente.
*   **Paquetes nativos que requieren linking:** Con Expo, la mayoría se auto-configuran. Si usas algo muy custom, considera `expo-yarn-workspaces` o migrar a bare workflow.
*   **Hot reload con paquetes compartidos:** Funciona bien si Metro está configurado correctamente. Si falla, reinicia el bundler con `r` en la terminal.

### 19.2 Costos Ocultos (Egress de GCS)
*   **Riesgo:** Google cobra por "sacar" datos de su nube (Egress). Si sirves muchas imágenes/videos, esto puede explotar.
*   **Mitigación:**
    *   **Cachear agresivamente:** Configurar `Cache-Control: max-age=31536000` en archivos estáticos.
    *   **CDN:** Firebase Hosting ya tiene CDN incluido. Para GCS, activar Cloud CDN ($0.08/GB vs $0.12/GB de egress directo).
    *   **Videos:** NO servir videos pesados desde GCS directamente. Usar Vimeo/Mux o YouTube embebido.
    *   **Monitoreo:** Configurar alerta de presupuesto en GCP al llegar a $10 USD para detectar picos anormales.

### 19.3 Variables de Entorno (Gestión Detallada)
*   **Local (Desarrollo):**
    *   Archivos `.env` en cada app (no commiteados, en `.gitignore`).
    *   Turborepo los inyecta automáticamente durante `pnpm dev`.
    *   Ejemplo: `apps/suntus-services/.env` con `DATABASE_URL=postgresql://...`
*   **Producción (Backend en Cloud Run):**
    *   **Secret Manager:** Las variables sensibles (DB passwords, Auth0 secrets) se guardan en Google Secret Manager.
    *   **Inyección:** Se configuran como "environment variables" o "mounted secrets" en el servicio de Cloud Run.
    *   **Ejemplo:** `gcloud run services update suntus-services --set-env-vars="NODE_ENV=production" --set-secrets="DATABASE_URL=db-url:latest"`
*   **Producción (Frontend):**
    *   **Next.js:** Variables `NEXT_PUBLIC_*` se "queman" en el build. **Cuidado:** No poner secretos ahí.
    *   **Expo:** Variables `EXPO_PUBLIC_*` se incluyen en el bundle. Igual, solo claves públicas (API endpoints, Auth0 Client ID).

## 20. Resumen Financiero Total (MVP)

Estimación de costos operativos para la fase de lanzamiento (0 - 1,000 usuarios).

| Concepto | Tecnología | Costo Mensual | Costo Anual | Tipo | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cómputo** | Cloud Run | **$2.50** | **$30.00** | Variable | Escala a cero. |
| **Base de Datos** | Postgres (VM) | **$10.00** | **$120.00** | Fijo | VM e2-small. |
| **Caché / Colas** | Upstash (Serverless) | **$1.00** | **$12.00** | Variable | Pay-per-request. |
| **Identidad** | Auth0 | **$0.00** | **$0.00** | Fijo | Free Tier. |
| **Chat** | Firestore | **$0.00** | **$0.00** | Variable | Free Tier. |
| **Storage** | GCS | **$6.20** | **$74.40** | Variable | Depende del uso. |
| **Hosting** | Firebase | **$0.00** | **$0.00** | Fijo | Landing. |
| **Email** | Resend | **$0.00** | **$0.00** | Fijo | Free Tier. |
| **DNS** | Cloud DNS | **$1.00** | **$12.00** | Fijo | Zona DNS. |
| **TOTAL** | | **~$20.70** | **~$248.40** | | **Costo Operativo Base** |

*Nota: Estos precios son estimados y pueden variar según la región de GCP (us-central1 suele ser la más barata).*

## 21. Siguientes Pasos Inmediatos

1.  Inicializar el repo con `npx create-turbo@latest`.
2.  Limpiar las apps de ejemplo que trae por defecto.
3.  Crear la estructura de carpetas definida arriba.
4.  Configurar `pnpm-workspace.yaml`.

## 22. Q&A Técnico (Preguntas Frecuentes)

### ¿Qué es Metro?
Es el "empaquetador" (bundler) oficial de React Native.
*   **Función:** Toma todos tus archivos JavaScript/TypeScript, imágenes y estilos, y los convierte en un solo archivo `.jsbundle` que el teléfono puede ejecutar.
*   **Por qué es importante:** A diferencia de Webpack o Vite (que son para web), Metro está optimizado para recargar cambios en milisegundos en un dispositivo móvil real.

### ¿Qué es Expo Router?
Es el sistema de navegación moderno para React Native, construido sobre React Navigation.
*   **Filosofía:** Copia el modelo de "rutas por archivos" de la web (Next.js).
*   **Cómo funciona:** Si creas un archivo `app/perfil.tsx`, automáticamente tienes una pantalla accesible en la ruta `/perfil`.
*   **Ventaja:** Elimina toneladas de código "boilerplate" de configuración de navegación y hace que los Deep Links funcionen "out of the box".

### ¿Next.js vs React (Vite)? ¿Por qué SSR?
Tienes razón, Next.js es famoso por SSR (Server Side Rendering), pero para un Panel de Administración (`suntus-core`), el SEO no es la prioridad.
*   **¿Por qué Next.js entonces?**
    1.  **Estándar de Industria:** Se integra mejor con el ecosistema moderno (Vercel, Turborepo).
    2.  **Rutas API:** Nos permite crear pequeños endpoints backend dentro del mismo proyecto si necesitamos un "Backend-for-Frontend".
    3.  **Flexibilidad:** Podemos usar `output: 'export'` en Next.js y se comporta exactamente como una SPA de React (sin servidor Node.js), si así lo preferimos para simplificar el hosting.
*   **Veredicto:** Usamos Next.js por su robustez y herramientas, no necesariamente por el SSR.

### Tamagui / Solito
Son el "pegamento" mágico entre Web y Móvil.
*   **Tamagui:** Es una librería de UI que compila tus estilos. Escribes `<Stack padding="$4" />` y en Web se convierte en CSS puro (rápido) y en Móvil se convierte en View nativa (rápido). Evita que la app móvil sea lenta por culpa de estilos complejos.
*   **Solito:** Unifica la navegación. Permite que un link funcione tanto en Next.js (Web) como en Expo Router (Móvil) sin cambiar el código.

### ¿Qué diferencia hay con pnpm?
`pnpm` (Performant NPM) es un gestor de paquetes superior a `npm` o `yarn`.
*   **Ahorro de Disco:** Si tienes 10 proyectos que usan React, `npm` descarga React 10 veces. `pnpm` lo descarga **una sola vez** en tu disco duro y crea enlaces simbólicos.
*   **Monorepos:** Es el estándar de oro para Monorepos porque maneja las dependencias cruzadas (que el backend use una librería local) de forma mucho más estricta y segura que los otros.

### ¿Crees que sea buena idea integrar Docker?
**Absolutamente SÍ, pero con matices.**

1.  **Para el Backend (`suntus-services`) y Web (`suntus-core`):** Es **obligatorio** si vamos a usar Google Cloud Run. Docker empaqueta tu código con la versión exacta de Node.js que necesitas, eliminando el clásico "en mi máquina funciona".
2.  **Para las Apps Móviles (`suntus-app` / `suntus-pro`):** **NO** se usa Docker para *ejecutar* la app (eso corre en el teléfono). Sin embargo, podemos usar Docker en el CI/CD para tener un entorno limpio donde compilar los binarios de Android/iOS sin tener que instalar mil herramientas en el servidor.
3.  **Para Desarrollo Local:** Usaremos `docker-compose` para levantar la Base de Datos (PostgreSQL) y Redis en tu computadora en segundos, sin que tengas que instalar Postgres en Windows. ¡Es limpieza pura!

### ¿Qué opinas de Auth0?
**Es la mejor decisión para un MVP robusto.**
*   **Seguridad:** Delegas la parte más difícil (guardar contraseñas, MFA) a expertos.
*   **Social Login:** Activar "Entrar con Google/Apple" es un clic, en lugar de semanas de configuración.
*   **Escalabilidad:** Soporta millones de usuarios.
*   **Contras:** Puede ser caro si escalas mucho (miles de usuarios activos mensuales), pero para entonces ya tendrás ingresos para pagarlo o recursos para migrar a una solución propia. **Mi consejo:** Úsalo ahora para ir rápido y seguro.

### ¿tRPC?
Es una maravilla para monorepos full-stack TypeScript, pero **NestJS + GraphQL** es más robusto para una "Plataforma".
*   **tRPC:** Acopla fuertemente el frontend al backend. Si mañana quieres abrir tu API a terceros (o hacer una app nativa en Swift/Kotlin), tRPC te limita.
*   **Veredicto:** Nos quedamos con NestJS (REST/GraphQL) porque sigue estándares de industria (OpenAPI/Schema) que permiten escalar el equipo y la plataforma sin dolor.

### ¿Apollo Server?
**Sí, totalmente.**
*   NestJS tiene un módulo oficial `@nestjs/apollo` que es una delicia.
*   Usaremos el enfoque **Code First**: Escribes tus clases de TypeScript (DTOs) y NestJS genera el schema GraphQL (`schema.gql`) automáticamente. ¡Magia pura!

### ¿Akamai para el MVP?
**Respuesta corta: No. Es matar moscas a cañonazos.**

*   **¿Qué es?** Akamai es el líder mundial en CDN y Ciberseguridad Enterprise. Lo usan bancos, gobiernos y Netflix.
*   **Por qué NO para suntUS (ahora):**
    1.  **Costo y Complejidad:** Sus contratos suelen ser anuales y caros (miles de dólares). La configuración es compleja y requiere expertos certificados.
    2.  **Ya tienes CDN:** Firebase Hosting y Cloud Run ya usan la red global de Google (que es igual de buena) de forma nativa y gratuita/barata.
    3.  **Seguridad:** Google Cloud Armor ofrece protección WAF/DDoS similar si la necesitamos en el futuro, integrada en nuestro panel de GCP.
*   **Alternativa:** Si en el futuro necesitas protección extra contra ataques DDoS masivos, **Cloudflare** es mucho más amigable, tiene un plan gratuito excelente y se configura en 5 minutos cambiando los DNS.
*   **Veredicto:** Para la fase 1, quédate con la infraestructura nativa de Google. Es rápida, segura y no te costará extra.

## 23. Estrategia de Internacionalización (i18n)

La plataforma soportará **Español e Inglés** desde el MVP, con arquitectura preparada para escalar a más idiomas.

### 23.1 Librería: i18next

Usaremos **i18next** porque:
*   **Universal:** Funciona en React Native, Next.js y Node.js (todo el monorepo).
*   **Lazy Loading:** Solo carga el idioma activo (reduce bundle size).
*   **Pluralización:** Maneja automáticamente "1 ejercicio" vs "5 ejercicios".
*   **Interpolación:** `t('welcome', { name: 'Juan' })` → "Bienvenido, Juan".

### 23.2 Arquitectura de Traducciones

Crearemos un paquete compartido `@suntus/i18n`:

```text
packages/
  └── i18n/
      ├── locales/
      │   ├── es/
      │   │   ├── common.json    # Botones, errores
      │   │   ├── auth.json      # Login, registro
      │   │   └── fitness.json   # Ejercicios, rutinas
      │   └── en/
      │       ├── common.json
      │       ├── auth.json
      │       └── fitness.json
      └── index.ts               # Config de i18next
```

**Namespaces (common, auth, fitness):**
*   Permiten lazy loading (solo carga `auth.json` en la pantalla de login).
*   Facilitan trabajo en paralelo sin conflictos de merge.

### 23.3 Implementación por Proyecto

#### Mobile (suntus-app / suntus-pro)
```typescript
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';

const { t, i18n } = useTranslation();

// Detectar idioma del dispositivo
useEffect(() => {
  const deviceLang = Localization.locale.split('-')[0]; // 'es' o 'en'
  i18n.changeLanguage(deviceLang);
}, []);
```

#### Web (suntus-core / suntus-landing)
Next.js tiene soporte nativo para rutas i18n:

```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  },
};
```

**Rutas:**
*   `/es/dashboard` → Español
*   `/en/dashboard` → Inglés
*   Google indexa ambas con `hreflang` automático (SEO).

#### Backend (suntus-services)
Emails y notificaciones también traducidos:

```typescript
async sendWelcomeEmail(user: User) {
  const t = i18next.getFixedT(user.language);
  await resend.emails.send({
    subject: t('email:welcome.subject'),
    html: t('email:welcome.body', { name: user.name })
  });
}
```

### 23.4 Contenido Dinámico (Fitoteca)

Los ejercicios en la base de datos tendrán traducciones en JSONB:

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  translations JSONB
);

-- Ejemplo:
{
  "es": { "name": "Sentadilla", "description": "..." },
  "en": { "name": "Squat", "description": "..." }
}
```

**Consulta:**
```typescript
const exercise = await prisma.exercise.findUnique({ where: { id } });
const translated = exercise.translations[userLanguage];
```

### 23.5 Detección de Idioma (UX)

**Prioridad:**
1.  **Preferencia guardada** (si el usuario ya eligió).
2.  **Idioma del dispositivo/navegador**.
3.  **Fallback:** Español (idioma por defecto).

### 23.6 Gestión de Traducciones

**MVP:**
*   Archivos JSON manuales (tú o tu equipo escriben las traducciones).

**Futuro (si escala a +5 idiomas):**
*   **Crowdin** o **Lokalise**: Plataformas donde traductores profesionales trabajan sin tocar código.
*   Integración con GitHub: Traducciones aprobadas crean PRs automáticos.

### 23.7 Análisis Financiero: i18n

| Concepto | Costo Mensual | Costo Anual | Notas |
| :--- | :--- | :--- | :--- |
| **i18next** | $0.00 | $0.00 | Open source. |
| **Traducciones (MVP)** | $0.00 | $0.00 | Manuales (2 idiomas). |
| **Crowdin (futuro)** | ~$50.00 | ~$600.00 | Si escala a +10 idiomas. |
| **TOTAL** | **$0.00** | **$0.00** | |

## 24. Loops de Conversación (Historial de Refinamientos)

Esta sección documenta todas las iteraciones y mejoras realizadas durante la planificación arquitectónica.

### Loop 1: Expansión de CI/CD
**Solicitud:** "Desarrolla más CI/CD, que es, estrategia de implementación, para que nos sirven, análisis financiero."
**Acción:** Expandí la Sección 7 (CI/CD) con:
*   Definición clara de CI (Guardia de Calidad) y CD (Repartidor Automático).
*   Estrategia detallada usando GitHub Actions con pipelines para PR (lint, test) y producción (deploy a Cloud Run, Firebase, EAS).
*   Análisis financiero confirmando $0 USD para el MVP (Free Tier de GitHub Actions con 2,000 min/mes).

### Loop 2: Corrección de Script JSON
**Solicitud:** "Se cortó el plan, en el script de la sección 5 parece que no está bien cerrado."
**Acción:** Reparé el bloque JSON de `turbo.json` en la Sección 5 que estaba malformado y restauré las Secciones 6-17 que se habían perdido.

### Loop 3: Diagrama de Arquitectura
**Solicitud:** "Usa nano banana para crear una imagen del diagrama de comunicación porque no se ve muy claro."
**Acción:** Intenté generar una imagen pero fallé por límite de cuota. El diagrama Mermaid en la Sección 1.2 permanece como la visualización oficial.

### Loop 4: Análisis de Akamai
**Solicitud:** "Dame tu mejor opinión de Akamai, crees que nos funcione? Lo ves para esta fase?"
**Acción:** Añadí análisis detallado en Q&A (Sección 22) concluyendo que Akamai es overkill para el MVP. Recomendé usar la infraestructura nativa de Google (Firebase Hosting + Cloud Run) y considerar Cloudflare si se necesita protección extra en el futuro.

### Loop 5: Cambio a NestJS y PostgreSQL JSONB
**Solicitud:** "Vas a dejar node.js con Express? No es muy lento? Que tal Nest, fastify? Y si en lugar de meter MongoDB metemos JSONB sobre el mismo postgre?"
**Acción:**
*   **Backend:** Cambié de Express a **NestJS con Fastify** (Sección 3.3) para garantizar Clean Architecture, SOLID y mejor performance (2x más rápido).
*   **Base de Datos:** Eliminé MongoDB y adopté **PostgreSQL JSONB** (Sección 11) para la Fitoteca. Esto simplifica la infraestructura (una sola BD) y reduce costos.

### Loop 6: Apollo Server y tRPC
**Solicitud:** "Aquí tiene algo que Ver ApolloServer? Qué opinas de tRPC?"
**Acción:** Añadí en Q&A:
*   **Apollo Server:** Confirmado. NestJS tiene integración oficial (`@nestjs/apollo`) con enfoque Code First.
*   **tRPC:** Descartado. Aunque es excelente para monorepos, acopla demasiado frontend/backend. NestJS + GraphQL es más estándar y escalable.

### Loop 7: Estrategias de Testing, Logging y Email
**Solicitud:** "Dame estrategias de Testing. No veo tu estrategia de Logs. Esto también va a manejar correos, que opciones tienes para el MVP?"
**Acción:** Añadí tres nuevas secciones:
*   **Sección 16 (Testing):** Jest (Unit), Supertest (Integration), Maestro (E2E Mobile).
*   **Sección 17 (Logging):** Pino (JSON logs), Correlation IDs, GCP Cloud Logging.
*   **Sección 18 (Email):** Resend como proveedor (3,000 emails/mes gratis). Explicación de por qué no usar SMTP de Google Workspace para transaccionales.

### Loop 8: Variables de Entorno y Troubleshooting
**Solicitud:** "Como vamos a gestionar las variables de entorno, puedes detallarlo un poco más? La solución de Metro es básica; pueden surgir problemas. Costos ocultos: egress de GCS."
**Acción:** Añadí Sección 19 (Troubleshooting) con:
*   **Metro Bundler:** Solución avanzada con `@expo/metro-config`, watchFolders, y EAS Build para CI/CD.
*   **Costos Ocultos (Egress):** Estrategias de mitigación (CDN, Cloud CDN, no servir videos pesados, alertas de presupuesto).
*   **Variables de Entorno:** Gestión detallada para local (.env), producción backend (Secret Manager), y producción frontend (NEXT_PUBLIC_/EXPO_PUBLIC_).

### Loop 9: Corrección Final
**Solicitud:** "Revisaste lo de Egress y lo de Metro que te pedí? Tampoco veo tu estrategia de emails. El título de Q&A se borró."
**Acción:** Reconstruí completamente las Secciones 16-23 para asegurar que todas las estrategias solicitadas estén presentes y correctamente numeradas. Restauré el título de Q&A (Sección 22) y creé esta sección de "Loops de Conversación" (Sección 23).

### Loop 10: Estrategia de Internacionalización
**Solicitud:** "Esta app será de múltiples lenguajes, por lo pronto español e inglés. Que estrategias tienes para manejar esto?"
**Acción:** Añadí la Sección 23 (Internacionalización) con:
*   **Librería:** i18next (universal para React Native, Next.js y Node.js).
*   **Arquitectura:** Paquete compartido `@suntus/i18n` con namespaces (common, auth, fitness).
*   **Implementación:** Detección automática de idioma del dispositivo/navegador, rutas i18n en Next.js (`/es`, `/en`), emails traducidos en el backend.
*   **Contenido Dinámico:** Traducciones de ejercicios en PostgreSQL JSONB.
*   **Análisis Financiero:** $0 USD para el MVP (i18next es open source, traducciones manuales para 2 idiomas).
