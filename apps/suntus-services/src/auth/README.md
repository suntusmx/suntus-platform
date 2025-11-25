# Módulo de Autenticación

Este módulo implementa la autenticación usando Auth0.

## Configuración

### Variables de Entorno

Agregar al archivo `.env`:

```env
# Auth0 (Opcional - para producción)
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_AUDIENCE=https://api.suntus.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret

# JWT Interno (Obligatorio)
JWT_SECRET=tu-secret-key-super-segura
```

## Flujo de Autenticación

1. **Frontend autentica con Auth0** (usando SDK de Auth0)
2. **Frontend envía token de Auth0** al endpoint `/api/v1/auth/callback`
3. **Backend valida token de Auth0** y sincroniza usuario en BD
4. **Backend genera token JWT interno** y lo retorna
5. **Frontend usa token interno** en todas las peticiones siguientes

## Endpoints

### POST `/api/v1/auth/callback`
Callback de Auth0. Recibe el token de Auth0 y retorna token interno.

**Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CLIENT",
    "name": "John Doe",
    "language": "es"
  }
}
```

### GET `/api/v1/auth/me`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "CLIENT",
  "language": "es"
}
```

## Uso en Controladores

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('example')
export class ExampleController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute(@CurrentUser() user: any) {
    return { message: `Hola ${user.email}` };
  }
}
```

## Notas

- En desarrollo, se usa JWT simétrico (HS256) con secret key.
- En producción, se debe configurar Auth0 y usar RS256 con JWKS.
- El token interno expira en 7 días (configurable en `JwtModule.register`).

