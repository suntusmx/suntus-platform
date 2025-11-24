# Configuración de Entornos - suntUS Platform

Este documento explica cómo configurar los diferentes entornos (desarrollo, staging, producción) y cómo el proyecto se adapta automáticamente según el entorno.

---

## Arquitectura de Configuración

El proyecto está diseñado para ser **agnóstico al entorno**, usando variables de entorno para determinar la configuración:

- **Desarrollo:** Docker Compose (PostgreSQL + Redis locales)
- **Producción:** Cloud SQL (PostgreSQL) + Upstash (Redis)

---

## Desarrollo Local

### Requisitos

- Docker y Docker Compose instalados
- Node.js >= 20
- pnpm >= 9.15.0

### Configuración Inicial

1. **Copiar archivos de ejemplo:**

```bash
# Desde la raíz del proyecto
# Variables para Docker Compose
cp .env.docker.example .env.docker

# Variables para las apps
cp .env.example .env.local
cp apps/suntus-services/.env.example apps/suntus-services/.env.local
cp apps/suntus-core/.env.example apps/suntus-core/.env.local
cp apps/suntus-landing/.env.example apps/suntus-landing/.env.local
cp apps/suntus-app/.env.example apps/suntus-app/.env.local
cp apps/suntus-pro/.env.example apps/suntus-pro/.env.local
```

**Nota:** El archivo `.env.docker` es usado por `docker-compose.yml`. Puedes editarlo si necesitas cambiar puertos o credenciales de los servicios Docker.

2. **Iniciar servicios con Docker Compose:**

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d

# Verificar que están corriendo
docker-compose ps

# Ver logs
docker-compose logs -f
```

3. **Verificar conexión a PostgreSQL:**

```bash
# Desde el contenedor
docker exec -it suntus-postgres psql -U suntus -d suntus_db

# O desde tu máquina (si tienes psql instalado)
psql -h localhost -U suntus -d suntus_db
```

4. **Verificar conexión a Redis:**

```bash
# Desde el contenedor
docker exec -it suntus-redis redis-cli ping
# Debe responder: PONG
```

### Variables de Entorno en Desarrollo

**Base de Datos:**
```
DATABASE_URL=postgresql://suntus:suntus_dev@localhost:5432/suntus_db
```

**Redis:**
```
REDIS_URL=redis://localhost:6379
```

### Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Ver logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Reiniciar un servicio
docker-compose restart postgres

# Acceder a pgAdmin (si está habilitado)
# http://localhost:5050
# Email: admin@suntus.local
# Password: admin
```

---

## Producción (Google Cloud Platform)

### Base de Datos: Cloud SQL

**Configuración:**

1. Crear instancia de Cloud SQL (PostgreSQL) en GCP
2. Obtener la connection string desde Cloud Console
3. Configurar en Google Secret Manager

**Connection String:**
```
# Formato Unix Socket (recomendado para Cloud Run)
postgresql://user:password@/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE

# Formato TCP (alternativa)
postgresql://user:password@IP_PRIVATE:5432/dbname
```

**Variables de Entorno en Cloud Run:**
- `DATABASE_URL` → Desde Secret Manager
- `DB_INSTANCE_CONNECTION_NAME` → `PROJECT:REGION:INSTANCE`

**VPC Connector:**
- Cloud Run debe tener VPC Connector configurado
- La instancia de Cloud SQL NO debe tener IP pública
- Conexión a través de red privada de Google

### Redis: Upstash

**Configuración:**

1. Crear cuenta en Upstash
2. Crear base de datos Redis
3. Obtener la URL de conexión

**Connection String:**
```
redis://default:PASSWORD@HOST:PORT
```

**Variables de Entorno:**
- `REDIS_URL` → URL completa de Upstash
- O variables individuales: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

**Ventajas de Upstash:**
- Serverless (pago por uso)
- Sin gestión de infraestructura
- Compatible con Redis estándar
- Ideal para MVP y escalado

---

## Configuración por Capas

### Backend (suntus-services)

**Desarrollo:**
```typescript
// Lee de .env.local
DATABASE_URL=postgresql://suntus:suntus_dev@localhost:5432/suntus_db
REDIS_URL=redis://localhost:6379
```

**Producción:**
```typescript
// Lee de Secret Manager (inyectado en Cloud Run)
DATABASE_URL=postgresql://user:pass@/db?host=/cloudsql/...
REDIS_URL=redis://default:pass@upstash-host:port
```

**Código (Agnóstico):**
```typescript
// El código no cambia, solo las variables de entorno
const dbUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;
```

### Frontend (Next.js)

**Desarrollo:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Producción:**
```env
NEXT_PUBLIC_API_URL=https://api.suntus.com
```

**Nota:** Variables `NEXT_PUBLIC_*` se "queman" en el build. Cambiar requiere rebuild.

### Apps Móviles (Expo)

**Desarrollo:**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Producción:**
```env
EXPO_PUBLIC_API_URL=https://api.suntus.com
```

**Nota:** Variables `EXPO_PUBLIC_*` se incluyen en el bundle. Solo usar para valores públicos.

---

## Gestión de Secretos

### Desarrollo

- Archivos `.env.local` (en `.gitignore`)
- Valores de ejemplo en `.env.example`
- Cada desarrollador copia y ajusta según su entorno

### Producción

**Google Secret Manager:**

1. Crear secretos en Secret Manager:
   - `suntus-database-url`
   - `suntus-redis-url`
   - `suntus-auth0-secret`
   - etc.

2. Configurar en Cloud Run:
   ```bash
   gcloud run services update suntus-services \
     --set-secrets="DATABASE_URL=suntus-database-url:latest" \
     --set-secrets="REDIS_URL=suntus-redis-url:latest"
   ```

3. El código lee automáticamente desde `process.env`

**Principio:** Secretos NUNCA en código. Siempre desde variables de entorno o Secret Manager.

---

## Migración de Datos

### Desarrollo → Producción

1. **Exportar datos de desarrollo:**
   ```bash
   # Desde Docker
   docker exec suntus-postgres pg_dump -U suntus suntus_db > backup.sql
   ```

2. **Importar a Cloud SQL:**
   ```bash
   # Usando Cloud SQL Proxy o gcloud
   gcloud sql import sql INSTANCE_NAME gs://BUCKET/backup.sql \
     --database=suntus_db
   ```

### Backup y Restauración

**Cloud SQL:**
- Backups automáticos diarios (configurar en Cloud Console)
- Restauración point-in-time disponible
- Exportar manualmente: `gcloud sql export`

**Upstash:**
- Backups automáticos (configurar en dashboard)
- Exportar datos: `redis-cli --rdb dump.rdb`

---

## Checklist de Configuración

### Desarrollo Local
- [ ] Docker y Docker Compose instalados
- [ ] Archivos `.env.local` creados desde `.env.example`
- [ ] `docker-compose up -d` ejecutado
- [ ] PostgreSQL accesible en `localhost:5432`
- [ ] Redis accesible en `localhost:6379`
- [ ] Backend puede conectarse a BD y Redis
- [ ] Apps frontend pueden conectarse al backend

### Producción
- [ ] Instancia de Cloud SQL creada
- [ ] Base de datos y usuario creados
- [ ] VPC Connector configurado en Cloud Run
- [ ] Upstash Redis creado y URL obtenida
- [ ] Secretos creados en Secret Manager
- [ ] Cloud Run configurado con secretos
- [ ] Variables de entorno públicas configuradas
- [ ] Backups automáticos configurados
- [ ] Monitoreo y alertas configurados

---

## Troubleshooting

### Problema: No puedo conectar a PostgreSQL

**Solución:**
1. Verificar que Docker Compose está corriendo: `docker-compose ps`
2. Verificar logs: `docker-compose logs postgres`
3. Verificar que el puerto no está ocupado: `netstat -an | grep 5432`
4. Verificar variables de entorno: `echo $DATABASE_URL`

### Problema: Redis no responde

**Solución:**
1. Verificar que Redis está corriendo: `docker-compose ps`
2. Probar conexión: `docker exec -it suntus-redis redis-cli ping`
3. Verificar logs: `docker-compose logs redis`

### Problema: Cloud SQL no conecta desde Cloud Run

**Solución:**
1. Verificar VPC Connector está configurado
2. Verificar que Cloud SQL no tiene IP pública
3. Verificar formato de connection string (Unix Socket)
4. Verificar permisos de Service Account

### Problema: Upstash timeout

**Solución:**
1. Verificar que la URL es correcta
2. Verificar que el password es correcto
3. Verificar región (debe estar cerca de Cloud Run)
4. Revisar límites de Upstash (free tier tiene límites)

---

## Mejores Prácticas

1. **Nunca commitees `.env.local`** - Está en `.gitignore` por una razón
2. **Usa `.env.example`** - Documenta todas las variables necesarias
3. **Valida variables al inicio** - El backend debe validar que todas las variables requeridas existen
4. **Usa tipos para variables** - Crear un módulo que valide y tipifique las variables de entorno
5. **Documenta cambios** - Si añades una nueva variable, actualiza `.env.example` y este documento

---

**Última actualización:** Diciembre 2024

