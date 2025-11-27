# User High-Level Strategy - Flujo de Onboarding

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Audiencia:** Directores y Stakeholders No Técnicos

---

## 1. ¿Qué es el Onboarding?

El **Onboarding** es el proceso de "dar la bienvenida" a un nuevo usuario a la plataforma suntUS. Es como cuando llegas a un gimnasio por primera vez y te hacen una evaluación inicial: necesitamos conocer tus datos básicos, objetivos y preferencias para poder ofrecerte la mejor experiencia.

**Objetivo Principal:** Capturar la información esencial del usuario de forma amigable y rápida, para que pueda comenzar a usar la plataforma inmediatamente.

---

## 2. El Problema que Resolvemos

### 2.1 Antes del Onboarding

Cuando un usuario se registraba en suntUS, solo proporcionaba información básica (email, nombre). Esto significaba que:

- No sabíamos sus objetivos (¿quiere bajar de peso? ¿ganar músculo?)
- No conocíamos su ubicación (importante para recomendar expertos cercanos)
- No teníamos datos biométricos iniciales (peso, estatura) para hacer seguimiento
- No podíamos personalizar su experiencia desde el inicio

**Resultado:** El usuario tenía que navegar "a ciegas" y llenar información más tarde, lo que generaba fricción y abandono.

### 2.2 Con el Onboarding

Ahora, cuando un usuario nuevo se registra, lo guiamos paso a paso para que nos cuente:

- **Quién es:** Nombre completo, fecha de nacimiento
- **Cómo está físicamente:** Peso y estatura inicial
- **Dónde está:** Código postal y ubicación
- **Qué quiere lograr:** Objetivo principal (bajar grasa, ganar músculo, etc.)
- **Cuánto puede invertir:** Presupuesto disponible

**Resultado:** El usuario tiene una experiencia personalizada desde el primer momento, y nosotros tenemos toda la información necesaria para recomendarle los mejores expertos.

---

## 3. El Flujo Completo (Paso a Paso)

### 3.1 Punto de Entrada: Pantalla de Bienvenida

**¿Qué ve el usuario?**

Una pantalla atractiva con una animación de bienvenida que dice "¡Bienvenido a suntUS!".

**¿Qué puede hacer?**

- **Si es nuevo:** Toca "Comenzar" y entra al proceso de onboarding
- **Si ya tiene cuenta:** Toca "Iniciar Sesión" discretamente en la esquina

**¿Por qué es importante?**

Es el primer contacto visual. Queremos que se sienta emocionado y motivado, no abrumado.

---

### 3.2 Paso 1: Identidad (¿Quién Eres?)

**¿Qué información pedimos?**

- Nombre
- Apellidos
- Fecha de nacimiento

**¿Cómo lo hacemos amigable?**

- Campos simples y claros
- Un calendario visual para elegir la fecha
- Calculamos su edad automáticamente (no tiene que hacer matemáticas)

**¿Por qué lo necesitamos?**

Para personalizar la experiencia y calcular métricas importantes (como su edad para recomendaciones de ejercicios).

---

### 3.3 Paso 2: Biometría (¿Cómo Estás Físicamente?)

**¿Qué información pedimos?**

- Peso actual (en kilogramos)
- Estatura (en centímetros)

**¿Cómo lo hacemos amigable?**

- Inputs numéricos fáciles de usar
- Validación inteligente: No puedes poner que pesas 2kg o 500kg (el sistema te avisa)
- Mostramos un cálculo automático de tu índice de masa corporal (BMI) como referencia visual

**¿Por qué lo necesitamos?**

Para hacer seguimiento de tu progreso. Si empiezas pesando 80kg y después de 3 meses pesas 75kg, podemos mostrarte tu evolución. También ayuda a los expertos a crear planes más precisos.

---

### 3.4 Paso 3: Ubicación Inteligente (¿Dónde Estás?)

**¿Qué información pedimos?**

- Código postal (5 dígitos)

**¿Cómo funciona la "magia"?**

1. El usuario escribe su código postal (ej: "44100")
2. El sistema automáticamente busca en nuestra base de datos
3. **Autocompleta:** Estado, Municipio y Ciudad aparecen solos
4. Si hay varias colonias en ese código postal, muestra un selector
5. Si hay una sola colonia, la fija automáticamente

**¿Por qué es "inteligente"?**

- El usuario solo escribe 5 números
- No tiene que buscar manualmente su estado, municipio, etc.
- Reduce errores y acelera el proceso

**¿Por qué lo necesitamos?**

Para recomendar expertos cercanos y personalizar contenido regional (por ejemplo, recetas locales).

---

### 3.5 Paso 4: Objetivos y Presupuesto (¿Qué Quieres Lograr?)

**¿Qué información pedimos?**

- **Objetivo principal:** ¿Qué quieres lograr?
  - Bajar grasa
  - Ganar músculo
  - Mantenimiento
  - Mejorar rendimiento deportivo
- **Presupuesto:** ¿Cuánto puedes invertir?
  - Bajo
  - Medio
  - Alto
  - Sin presupuesto definido
- **Género:** (Opcional)

**¿Cómo lo hacemos visual y motivador?**

- **Objetivos:** Tarjetas grandes con iconos atractivos que puedes tocar
  - Cada objetivo tiene un ícono visual (ej: fuego para "bajar grasa", músculo para "ganar músculo")
  - Al seleccionar, la tarjeta se anima y se resalta
- **Presupuesto:** Un slider o chips visuales fáciles de usar
- **Género:** Botones simples (Masculino, Femenino, Otro)

**¿Por qué lo necesitamos?**

- **Objetivo:** Para filtrar y recomendar expertos especializados en lo que buscas
- **Presupuesto:** Para mostrar opciones que estén dentro de tu rango
- **Género:** Para personalizar lenguaje y recomendaciones (opcional, respetamos privacidad)

---

### 3.6 Paso 5: Términos y Condiciones (El Compromiso Legal)

**¿Qué pedimos?**

Que el usuario lea y acepte nuestros Términos y Condiciones.

**¿Cómo lo hacemos claro?**

- Un checkbox obligatorio: "He leído y acepto los Términos y Condiciones"
- Un botón para leer los términos completos (se abre en un modal)
- Lenguaje claro: "Para continuar, necesitamos que aceptes nuestros términos"

**¿Por qué es obligatorio?**

Por protección legal de la plataforma y del usuario. Es un estándar en todas las aplicaciones.

---

### 3.7 La "Pantalla Mágica" (Feedback Psicológico)

**¿Qué pasa cuando el usuario toca "Finalizar"?**

En lugar de mostrar un spinner aburrido, mostramos una pantalla especial con:

- **Animación atractiva:** Una animación de alta energía que transmite progreso
- **Mensajes rotativos:** Textos que cambian cada 2 segundos:
  - "Calibrando macros..."
  - "Buscando entrenador perfecto..."
  - "Configurando tu perfil..."
  - "¡Casi listo! Preparando tu experiencia..."

**¿Por qué es "mágico"?**

- Da la percepción de que el sistema está trabajando inteligentemente
- Genera expectativa positiva
- Hace que la espera (2-3 segundos) se sienta como parte de la experiencia, no como un "cargando..."

**¿Qué pasa después?**

El usuario es redirigido automáticamente a la pantalla principal (Home) de la aplicación, donde ya puede comenzar a buscar expertos.

---

## 4. ¿Cómo Funciona la Tecnología? (Simplificado)

### 4.1 El "Borrador" (Draft State)

**Concepto Clave:** No guardamos nada en el servidor hasta que el usuario termine todo el proceso.

**¿Cómo funciona?**

- Mientras el usuario llena los pasos, toda la información se guarda **temporalmente en su teléfono**
- Es como escribir un borrador en papel: puedes borrar, corregir, volver atrás
- Si cierra la aplicación antes de terminar, el borrador se borra (por seguridad y limpieza)
- Solo cuando toca "Finalizar", enviamos toda la información al servidor de una vez

**Ventajas:**

- **Rápido:** No hay esperas entre pasos
- **Seguro:** Si cierra la app, no quedan datos a medias
- **Eficiente:** Una sola comunicación con el servidor al final

---

### 4.2 La Validación Inteligente

**¿Qué validamos?**

- **Datos lógicos:** No puedes pesar 2kg ni 500kg
- **Datos completos:** No puedes avanzar si falta información obligatoria
- **Datos correctos:** El código postal debe existir en nuestra base de datos

**¿Cómo lo hacemos?**

- El sistema valida en tiempo real mientras escribes
- Si algo está mal, te muestra un mensaje amigable (ej: "Ese código postal no nos suena, ¿checas de nuevo?")
- No puedes avanzar al siguiente paso hasta corregir los errores

---

### 4.3 La Regla de Bloqueo

**Regla Crítica:** Un usuario **NO puede navegar en la aplicación** (ver Home, buscar expertos, etc.) si no ha completado el onboarding.

**¿Por qué?**

Porque sin esa información, no podemos:
- Recomendar expertos adecuados
- Personalizar la experiencia
- Hacer seguimiento de progreso

**¿Qué pasa si intenta saltarse el onboarding?**

El sistema lo detecta automáticamente y lo redirige de vuelta al proceso de onboarding.

---

## 5. El Flujo de Información (Diagrama Conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO NUEVO                            │
│              (Se registra con Auth0)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PANTALLA DE BIENVENIDA                         │
│         (Splash + Welcome Screen)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PROCESO DE ONBOARDING                          │
│         (Wizard de 5 pasos)                                 │
│                                                              │
│  Paso 1: Identidad ──► Paso 2: Biometría ──►               │
│  Paso 3: Ubicación ──► Paso 4: Objetivos ──►               │
│  Paso 5: Términos                                           │
│                                                              │
│  [Toda la info se guarda temporalmente en el teléfono]     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ Usuario toca "Finalizar"
┌─────────────────────────────────────────────────────────────┐
│           PANTALLA MÁGICA (Magic Loader)                    │
│    (Mensajes rotativos: "Calibrando macros...", etc.)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ Envía toda la info al servidor
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Backend)                        │
│                                                              │
│  1. Valida que el usuario esté autenticado                  │
│  2. Valida que la información sea correcta                   │
│  3. Guarda el perfil completo en la base de datos           │
│  4. Registra la acción en el sistema de auditoría            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ Retorna confirmación
┌─────────────────────────────────────────────────────────────┐
│              REDIRECCIÓN AUTOMÁTICA                          │
│         Usuario va a la pantalla principal (Home)           │
│                                                              │
│  Ahora puede:                                                │
│  - Buscar expertos                                          │
│  - Ver recomendaciones personalizadas                       │
│  - Comenzar a usar la plataforma                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Casos Especiales

### 6.1 Usuario que Cierra la App a Medias

**¿Qué pasa?**

- El borrador se borra (por seguridad)
- Cuando vuelva a abrir la app, debe empezar desde el principio
- Esto es intencional: queremos datos frescos y completos

**¿Por qué no guardamos el borrador?**

Por privacidad y seguridad. No queremos que queden datos a medias guardados.

---

### 6.2 Usuario que Ya Tiene Cuenta

**¿Qué pasa?**

- Ve la pantalla de bienvenida
- Toca "Iniciar Sesión" (botón discreto)
- Se autentica con Auth0
- Si ya tiene perfil completo, va directo a Home
- Si no tiene perfil, entra al onboarding

---

### 6.3 Error en el Código Postal

**¿Qué pasa si el código postal no existe?**

- El sistema muestra un mensaje amigable: "Ese código postal no nos suena, ¿checas de nuevo?"
- El usuario puede corregirlo
- No puede avanzar hasta que el código sea válido

---

### 6.4 Error al Enviar al Servidor

**¿Qué pasa si falla la conexión?**

- El sistema muestra un mensaje claro: "Algo salió mal. Intenta de nuevo."
- El usuario puede tocar "Reintentar"
- Los datos siguen guardados temporalmente, no se pierden

---

## 7. Beneficios del Onboarding

### 7.1 Para el Usuario

- **Experiencia personalizada desde el inicio:** Ve recomendaciones relevantes desde el primer momento
- **Proceso rápido y amigable:** 5 pasos simples, sin fricción
- **Transparencia:** Sabe qué información estamos pidiendo y por qué

### 7.2 Para suntUS

- **Datos completos:** Tenemos toda la información necesaria para personalizar
- **Mejor matching:** Podemos recomendar expertos más adecuados
- **Seguimiento de progreso:** Podemos medir mejoras desde el inicio
- **Reducción de abandono:** Usuarios que completan onboarding tienen mayor retención

### 7.3 Para los Expertos

- **Clientes mejor informados:** Los usuarios que llegan ya tienen objetivos claros
- **Menos fricción:** No tienen que preguntar datos básicos
- **Mejor matching:** Reciben clientes más alineados con su especialidad

---

## 8. Métricas de Éxito

**¿Cómo medimos si el onboarding funciona?**

1. **Tasa de Completación:** ¿Qué porcentaje de usuarios nuevos completan el proceso?
   - Meta: > 80%

2. **Tiempo de Completación:** ¿Cuánto tarda un usuario en completarlo?
   - Meta: < 3 minutos

3. **Tasa de Abandono por Paso:** ¿En qué paso abandonan más usuarios?
   - Nos ayuda a identificar fricciones

4. **Tasa de Retención:** ¿Los usuarios que completan onboarding se quedan más tiempo?
   - Meta: 2x más retención vs usuarios sin onboarding

---

## 9. Próximos Pasos (Futuro)

**Mejoras Planeadas:**

1. **Onboarding Progresivo:** Permitir completar algunos pasos más tarde (no todo de una vez)
2. **Personalización Avanzada:** Preguntas adicionales según el objetivo seleccionado
3. **Integración con IA:** Sugerencias inteligentes basadas en respuestas
4. **Gamificación:** Puntos o badges por completar el onboarding

---

## 10. Resumen Ejecutivo

**¿Qué es?**  
Un proceso guiado de 5 pasos que captura información esencial del usuario de forma amigable.

**¿Por qué lo necesitamos?**  
Para personalizar la experiencia desde el inicio y tener datos completos para hacer mejores recomendaciones.

**¿Cómo funciona?**  
El usuario llena información paso a paso (guardada temporalmente), y al finalizar, se envía al servidor de una vez.

**¿Cuál es el resultado?**  
Usuarios con perfiles completos que pueden comenzar a usar la plataforma inmediatamente con una experiencia personalizada.

---

**Última actualización:** Diciembre 2024  
**Audiencia:** Directores, Stakeholders, Product Managers

