# User Strategy - Arquitectura Técnica de Onboarding

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Tipo:** Especificación Técnica de Arquitectura

---

## 1. Modelo de Datos (Backend)

### 1.1 Extensión del Schema Prisma

**Modelo ClientProfile (Extensión):**

```prisma
model ClientProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  
  // Datos de Identidad
  firstName     String
  lastName      String
  dateOfBirth   DateTime
  
  // Datos Biométricos
  initialWeight Decimal? @db.Decimal(5, 2) // Precisión: 999.99 kg
  height        Decimal? @db.Decimal(4, 2)  // Precisión: 999.99 cm
  
  // Datos Geográficos
  postalCode    String?
  stateId       String?
  municipalityId String?
  cityId        String?
  neighborhood  String?  // Colonia
  
  // Datos de Preferencia (Enums)
  goal          ClientGoal?
  budget        ClientBudget?
  gender        ClientGender?
  
  // Relación con experto activo
  activeExpertId String?
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relaciones
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  state         State?   @relation(fields: [stateId], references: [id])
  municipality  Municipality? @relation(fields: [municipalityId], references: [id])
  city          City?    @relation(fields: [cityId], references: [id])
  activeExpert  ExpertProfile? @relation("ActiveExpertClients", fields: [activeExpertId], references: [id])
  
  @@index([stateId])
  @@index([municipalityId])
  @@index([postalCode])
  @@map("client_profiles")
}

enum ClientGoal {
  LOSE_FAT      // Bajar grasa
  BUILD_MUSCLE // Músculo
  MAINTENANCE   // Mantenimiento
  PERFORMANCE   // Rendimiento
}

enum ClientBudget {
  LOW           // Bajo
  MEDIUM        // Medio
  HIGH          // Alto
  NO_BUDGET     // Sin presupuesto
}

enum ClientGender {
  MALE          // Masculino
  FEMALE        // Femenino
  OTHER         // Otro
}
```

### 1.2 Regla de Integridad

**Middleware de Validación (Backend):**

```typescript
// Guard que valida existencia de ClientProfile
@Injectable()
export class ClientProfileGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || user.role !== UserRole.CLIENT) {
      return true; // No aplica a expertos
    }
    
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (!profile) {
      throw new ForbiddenException('CLIENT_PROFILE_REQUIRED');
    }
    
    return true;
  }
}
```

**Aplicación en Rutas:**

- Rutas protegidas (Home, Directorio, etc.) deben usar `@UseGuards(JwtAuthGuard, ClientProfileGuard)`
- Si no tiene perfil, retorna error `CLIENT_PROFILE_REQUIRED` que el frontend interpreta como redirección a onboarding

---

## 2. Arquitectura Frontend (Zustand Store)

### 2.1 Estructura del Store

**Store: `useOnboardingStore`**

```typescript
// stores/onboarding.store.ts

interface OnboardingState {
  // Slice: Identity
  identity: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
  };
  
  // Slice: Biometrics
  biometrics: {
    weight: number | null;
    height: number | null;
  };
  
  // Slice: Location
  location: {
    postalCode: string;
    stateId: string | null;
    municipalityId: string | null;
    cityId: string | null;
    neighborhood: string | null;
  };
  
  // Slice: Preferences
  preferences: {
    goal: ClientGoal | null;
    budget: ClientBudget | null;
    gender: ClientGender | null;
  };
  
  // Estado del wizard
  currentStep: number;
  isSubmitting: boolean;
  
  // Acciones
  setIdentity: (data: Partial<OnboardingState['identity']>) => void;
  setBiometrics: (data: Partial<OnboardingState['biometrics']>) => void;
  setLocation: (data: Partial<OnboardingState['location']>) => void;
  setPreferences: (data: Partial<OnboardingState['preferences']>) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  submit: () => Promise<void>;
}
```

### 2.2 Implementación del Store

**Funciones Críticas:**

1. **Validación por Step:**
   - `validateStep(step: number): boolean` - Valida que el step actual tenga datos completos
   - Bloquea `nextStep()` si no pasa validación

2. **Persistencia:**
   - NO usar AsyncStorage (requerimiento de seguridad)
   - Store solo en memoria
   - Si cierra app, se resetea (empieza de nuevo)

3. **Submit Final:**
   - `submit()`: Consolida todos los slices
   - Valida datos completos con Zod
   - Llama a endpoint `/api/v1/client-profile` (POST)
   - Maneja errores y éxito

---

## 3. Flujo de Navegación (Expo Router)

### 3.1 Estructura de Rutas

```
app/
├── (auth)/
│   ├── welcome.tsx          # Punto de entrada
│   └── login.tsx            # Login para usuarios recurrentes
├── (onboarding)/
│   ├── _layout.tsx          # Layout del wizard
│   ├── identity.tsx         # Step 1: Identidad
│   ├── biometrics.tsx       # Step 2: Biometría
│   ├── location.tsx         # Step 3: Ubicación
│   ├── preferences.tsx      # Step 4: Objetivos y Presupuesto
│   ├── terms.tsx            # Step 5: Términos y Condiciones
│   └── loading.tsx          # Magic Loader (transición)
└── (tabs)/
    └── ...                  # Rutas protegidas (requieren ClientProfile)
```

### 3.2 Guard de Navegación

**Hook: `useOnboardingGuard`**

```typescript
// hooks/useOnboardingGuard.ts

export function useOnboardingGuard() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useClientProfile();
  
  useEffect(() => {
    if (!isLoading && user && user.role === 'CLIENT' && !profile) {
      router.replace('/(onboarding)/identity');
    }
  }, [user, profile, isLoading]);
}
```

**Aplicación:**
- Se usa en `app/(tabs)/_layout.tsx` para proteger todas las rutas de tabs
- Si no tiene perfil, redirige automáticamente a onboarding

---

## 4. Pantallas del Wizard

### 4.1 Step 1: Identidad

**Componente: `IdentityStep`**

**Funciones:**
- `handleDatePicker()`: Abre date picker nativo
- `validateIdentity()`: Valida con Zod (nombres requeridos, fecha válida)
- `calculateAge()`: Calcula edad dinámicamente desde fecha de nacimiento

**Validaciones:**
- Nombres: mínimo 2 caracteres, máximo 50
- Fecha: debe ser en el pasado, edad mínima 13 años

### 4.2 Step 2: Biometría

**Componente: `BiometricsStep`**

**Funciones:**
- `handleWeightChange()`: Valida rango lógico (30-300 kg)
- `handleHeightChange()`: Valida rango lógico (100-250 cm)
- `calculateBMI()`: Calcula BMI en tiempo real (solo visual, no se guarda)

**Validaciones:**
- Peso: Decimal(5,2), rango 30-300 kg
- Estatura: Decimal(4,2), rango 100-250 cm

### 4.3 Step 3: Ubicación Inteligente

**Componente: `LocationStep`**

**Funciones Críticas:**

1. **Búsqueda por Código Postal:**
   ```typescript
   async function searchByPostalCode(code: string) {
     if (code.length === 5) {
       const result = await api.get(`/locations/postal-code/${code}`);
       // Autocompleta: stateId, municipalityId, cityId
       // Si hay múltiples colonias, muestra Select
       // Si hay una sola, la fija automáticamente
     }
   }
   ```

2. **Selector de Colonia:**
   - Si `postalCode` tiene múltiples `neighborhoods`, muestra dropdown
   - Si tiene una sola, la fija y oculta el selector

**Lógica de Negocio:**
- Input primario: Código Postal (5 dígitos)
- Al detectar 5 dígitos, dispara búsqueda automática
- Autocompleta Estado/Municipio/Ciudad desde catálogo de ubicaciones
- Colonia es opcional si el CP tiene una sola

### 4.4 Step 4: Objetivos y Presupuesto

**Componente: `PreferencesStep`**

**UI Gamificada:**

1. **Objetivos (Tiles Seleccionables):**
   - Cards grandes con iconos (Lucide React Native)
   - Animación al seleccionar (scale + border color)
   - Solo uno seleccionable

2. **Presupuesto (Slider o Chips):**
   - Slider con valores: Bajo, Medio, Alto, Sin Presupuesto
   - O Chips seleccionables (más visual)
   - Solo uno seleccionable

3. **Género (Radio Buttons):**
   - Masculino, Femenino, Otro
   - Opcional (puede ser null)

### 4.5 Step 5: Términos y Condiciones

**Componente: `TermsStep`**

**Funciones:**
- `fetchCurrentTerms()`: Obtiene versión actual de T&C desde backend
- `handleAccept()`: Marca checkbox como aceptado
- `openTermsModal()`: Muestra modal con T&C completo (scrollable)

**Validación:**
- Checkbox obligatorio para continuar
- Al aceptar, se registra en AuditLog (backend)

---

## 5. Magic Loader (Feedback Psicológico)

### 5.1 Pantalla de Transición

**Componente: `OnboardingLoader`**

**Funciones:**

1. **Mensajes Rotativos:**
   ```typescript
   const messages = [
     "Calibrando macros...",
     "Buscando entrenador perfecto...",
     "Configurando tu perfil...",
     "¡Casi listo! Preparando tu experiencia..."
   ];
   
   // Rota cada 2 segundos
   useEffect(() => {
     const interval = setInterval(() => {
       setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
     }, 2000);
     return () => clearInterval(interval);
   }, []);
   ```

2. **Animación:**
   - Lottie animation de alta energía
   - Fade in/out de mensajes
   - Progress bar sutil (opcional)

3. **Lógica:**
   - Se muestra mientras `isSubmitting === true`
   - Al completar submit, redirige a `/(tabs)/home`
   - Si hay error, muestra mensaje amigable y permite reintentar

---

## 6. Endpoint Backend

### 6.1 Creación de ClientProfile

**Ruta: `POST /api/v1/client-profile`**

**Controller: `ClientProfileController.create()`**

**Funciones:**

1. **Validación:**
   - Valida que el usuario esté autenticado
   - Valida que no tenga ClientProfile existente
   - Valida datos con Zod schema

2. **Creación:**
   ```typescript
   async create(@CurrentUser() user: User, @Body() dto: CreateClientProfileDto) {
     // Validar ubicación existe en catálogo
     await this.validateLocation(dto);
     
     // Crear perfil
     const profile = await this.prisma.clientProfile.create({
       data: {
         userId: user.id,
         ...dto,
         // Calcular edad desde dateOfBirth
         // Validar rangos de peso/estatura
       }
     });
     
     // Registrar en AuditLog
     await this.auditService.log({
       entityType: 'ClientProfile',
       entityId: profile.id,
       action: AuditAction.CREATE,
       actorId: user.id,
       actorType: ActorType.USER,
       snapshot: { after: profile }
     });
     
     return profile;
   }
   ```

3. **Validación de Ubicación:**
   - Verifica que `stateId`, `municipalityId`, `cityId` existan en catálogo
   - Verifica que `postalCode` sea válido para esa ubicación

---

## 7. Validaciones y Schemas Zod

### 7.1 Schema de Validación (Frontend)

```typescript
// schemas/onboarding.schema.ts

export const IdentitySchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dateOfBirth: z.date().refine((date) => {
    const age = calculateAge(date);
    return age >= 13 && age <= 120;
  })
});

export const BiometricsSchema = z.object({
  weight: z.number().min(30).max(300).optional(),
  height: z.number().min(100).max(250).optional()
});

export const LocationSchema = z.object({
  postalCode: z.string().length(5).regex(/^\d+$/),
  stateId: z.string().uuid(),
  municipalityId: z.string().uuid().optional(),
  cityId: z.string().uuid().optional(),
  neighborhood: z.string().optional()
});

export const PreferencesSchema = z.object({
  goal: z.nativeEnum(ClientGoal),
  budget: z.nativeEnum(ClientBudget),
  gender: z.nativeEnum(ClientGender).optional()
});

export const OnboardingCompleteSchema = IdentitySchema
  .merge(BiometricsSchema)
  .merge(LocationSchema)
  .merge(PreferencesSchema);
```

### 7.2 Schema Backend (DTO)

```typescript
// dto/create-client-profile.dto.ts

export class CreateClientProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;
  
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
  
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;
  
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  initialWeight?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;
  
  @IsString()
  @Length(5)
  @Matches(/^\d+$/)
  postalCode: string;
  
  @IsUUID()
  stateId: string;
  
  @IsOptional()
  @IsUUID()
  municipalityId?: string;
  
  @IsOptional()
  @IsUUID()
  cityId?: string;
  
  @IsOptional()
  @IsString()
  neighborhood?: string;
  
  @IsEnum(ClientGoal)
  goal: ClientGoal;
  
  @IsEnum(ClientBudget)
  budget: ClientBudget;
  
  @IsOptional()
  @IsEnum(ClientGender)
  gender?: ClientGender;
}
```

---

## 8. Manejo de Errores

### 8.1 Errores del Backend

**Códigos de Error:**

- `CLIENT_PROFILE_ALREADY_EXISTS`: Usuario ya tiene perfil
- `INVALID_LOCATION`: Ubicación no válida en catálogo
- `VALIDATION_ERROR`: Datos no válidos (Zod)
- `UNAUTHORIZED`: Usuario no autenticado

### 8.2 Manejo en Frontend

**Hook: `useOnboardingError`**

```typescript
function handleError(error: ApiError) {
  switch (error.code) {
    case 'CLIENT_PROFILE_ALREADY_EXISTS':
      router.replace('/(tabs)/home'); // Ya tiene perfil, redirige
      break;
    case 'INVALID_LOCATION':
      showError('Ese código postal no nos suena, ¿checas de nuevo?');
      break;
    default:
      showError('Algo salió mal. Intenta de nuevo.');
  }
}
```

---

## 9. Integración con Sistema Existente

### 9.1 Auth0 Flow

**Flujo Completo:**

1. Usuario se autentica con Auth0 (login/registro)
2. Backend sincroniza usuario en BD (modelo `User`)
3. Frontend verifica si tiene `ClientProfile`
4. Si NO tiene: Redirige a onboarding
5. Si SÍ tiene: Redirige a Home

### 9.2 Términos y Condiciones

**Integración:**

- El Step 5 del wizard usa el mismo sistema de T&C existente
- Al aceptar, se registra en `TermsAcceptance` y `AuditLog`
- Si cambian T&C después, el usuario debe re-aceptar (App Blocker)

---

## 10. Consideraciones de Performance

### 10.1 Optimizaciones

1. **Búsqueda de Código Postal:**
   - Debounce de 500ms en input
   - Cache de resultados en memoria (solo durante onboarding)
   - No persistir cache

2. **Validación:**
   - Validación en tiempo real (onChange) para mejor UX
   - Validación completa solo al avanzar step

3. **Submit:**
   - Loading state durante submit
   - No permitir múltiples submits (disable button)

---

## 11. Testing

### 11.1 Tests Unitarios

- Store de Zustand (acciones y estado)
- Validaciones Zod (schemas)
- Cálculo de edad y BMI

### 11.2 Tests de Integración

- Flujo completo de onboarding
- Integración con endpoint backend
- Manejo de errores

### 11.3 Tests E2E

- Flujo completo desde Welcome hasta Home
- Validación de redirección si no tiene perfil

---

## 12. Migración de Base de Datos

### 12.1 Script de Migración

```prisma
// Migración: add_client_profile_fields

// 1. Agregar campos a ClientProfile
// 2. Crear Enums: ClientGoal, ClientBudget, ClientGender
// 3. Agregar índices
// 4. Agregar relaciones con State, Municipality, City
```

### 12.2 Datos Existentes

- Si hay usuarios sin ClientProfile, no se crea automáticamente
- Deben completar onboarding para acceder a la app
- No hay migración de datos (requerimiento de seguridad)

---

**Última actualización:** Diciembre 2024  
**Mantenedor:** Equipo de Desarrollo suntUS

