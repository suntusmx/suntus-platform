# Especificación Funcional - suntUS Platform

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Tipo:** Documento de Requisitos Funcionales y Procesos de Negocio

---

## 1. Introducción a suntUS

### 1.1 ¿Qué es suntUS?

suntUS es una plataforma digital que conecta a personas que buscan mejorar su salud y condición física con profesionales especializados en nutrición y entrenamiento deportivo. La plataforma funciona como un **centro de servicios** donde los usuarios pueden encontrar, contratar y trabajar con expertos certificados.

### 1.2 Propósito

Facilitar el acceso a servicios profesionales de nutrición y entrenamiento, permitiendo que:
- Los usuarios encuentren expertos que se adapten a sus necesidades, presupuesto y objetivos
- Los expertos ofrezcan sus servicios de forma profesional y escalable
- La plataforma garantice transacciones seguras y un seguimiento completo del progreso

### 1.3 Principios Fundamentales

1. **Centralización de Pagos:** Todos los pagos se realizan dentro de la plataforma de forma segura
2. **Transparencia:** Los usuarios pueden ver calificaciones, precios y validaciones de expertos antes de contratar
3. **Portabilidad de Datos:** La información de salud del usuario le pertenece y viaja con él si cambia de experto
4. **Escalabilidad:** Los expertos pueden trabajar inmediatamente sin esperar aprobaciones manuales
5. **Meritocracia:** Los mejores expertos aparecen primero en las búsquedas

---

## 2. Actores del Sistema

### 2.1 Usuario Final (Cliente)

**Definición:** Persona que busca servicios de nutrición y/o entrenamiento deportivo.

**Características:**
- Puede contratar servicios de nutrición, entrenamiento, o ambos
- Tiene acceso a su historial médico y deportivo completo
- Puede cambiar de experto en cualquier momento
- Su información de salud le pertenece y es portable
- Puede calificar y opinar sobre los servicios recibidos

**Responsabilidades:**
- Completar información personal y de salud al registrarse
- Realizar pagos puntuales por los servicios contratados
- Seguir los planes asignados por su experto
- Reportar su progreso y adherencia a los planes

### 2.2 Experto

**Definición:** Profesional certificado en nutrición y/o entrenamiento deportivo que ofrece sus servicios a través de la plataforma.

**Características:**
- Puede ofrecer servicios de nutrición, entrenamiento, o ambos
- Establece sus propios precios y planes de servicio
- Puede trabajar inmediatamente después de registrarse (sin esperar validación)
- Su visibilidad en el directorio mejora si está validado oficialmente
- Puede crear contenido educativo y ejercicios personalizados
- Recibe pagos automáticos por sus servicios

**Responsabilidades:**
- Crear y personalizar planes nutricionales y/o deportivos para sus clientes
- Monitorear el progreso de sus clientes
- Responder consultas y brindar seguimiento
- Mantener información profesional actualizada
- Subir documentos oficiales para validación (opcional, pero recomendado)

**Tipos de Experto:**
- **Nutriólogo:** Especializado en planes nutricionales
- **Entrenador:** Especializado en planes deportivos
- **Combinado:** Ofrece ambos servicios

### 2.3 Administrador de suntUS

**Definición:** Personal autorizado de suntUS que gestiona y monitorea la plataforma.

**Características:**
- Acceso exclusivo a métricas generales del negocio
- Puede validar documentos oficiales de expertos
- Monitorea ingresos, usuarios activos y crecimiento
- Gestiona términos y condiciones de la plataforma
- Tiene acceso a registros de auditoría para protección legal

**Responsabilidades:**
- Validar documentos de expertos cuando sea posible
- Monitorear el funcionamiento general de la plataforma
- Gestionar términos y condiciones
- Revisar reportes y métricas del negocio
- Asegurar el cumplimiento de políticas de la plataforma

**Limitaciones:**
- NO crea usuarios manualmente (los usuarios se registran solos)
- NO crea ejercicios (suntUS provee ejercicios base, expertos crean los suyos)
- NO gestiona planes de usuarios (eso lo hace cada experto)

---

## 3. Características Principales de la Plataforma

### 3.1 Sistema de Registro y Acceso

#### 3.1.1 Registro de Usuarios

**Proceso:**
1. El usuario ingresa su información básica (nombre, email, teléfono)
2. Selecciona su país de residencia
3. Acepta los Términos y Condiciones de la plataforma
4. Crea una cuenta con email/teléfono o usando redes sociales (Google, Apple, Facebook)
5. Puede comenzar a usar la plataforma inmediatamente

**Información Requerida:**
- Nombre completo
- Email o teléfono
- País de residencia
- Orientación sexual (opcional)
- Idioma preferido (español o inglés)

#### 3.1.2 Registro de Expertos

**Proceso:**
1. El experto completa el registro básico como usuario
2. Indica que desea ofrecer servicios como experto
3. Selecciona su especialidad (nutrición, entrenamiento, o ambos)
4. Sube documentos oficiales:
   - Identificación oficial (ID, pasaporte)
   - Documento acreditante (cédula profesional, certificado)
5. Establece sus precios y planes de servicio
6. Puede comenzar a ofrecer servicios inmediatamente

**Estado de Validación:**
- **Pendiente:** El experto está registrado pero sus documentos no han sido revisados
- **Validado:** Un administrador ha verificado sus documentos oficiales
- **Rechazado:** Los documentos no cumplen con los requisitos

**Importante:** La validación NO es obligatoria para trabajar. Los expertos pueden ofrecer servicios sin validación, pero aparecerán con menor visibilidad en el directorio.

#### 3.1.3 Acceso al Sistema

**Opciones de Login:**
- Email y contraseña
- Teléfono y código de verificación
- Inicio de sesión con redes sociales (Google, Apple, Facebook)

**Recuperación de Conta:**
- El usuario puede solicitar recuperar su contraseña por email o teléfono
- Recibe un código de verificación para restablecer su contraseña

**Bloqueo por Términos y Condiciones:**
- Si suntUS actualiza los Términos y Condiciones, el usuario debe aceptarlos nuevamente
- Hasta que acepte, no puede usar la plataforma (excepto para leer y aceptar los términos)

---

### 3.2 Directorio de Expertos

#### 3.2.1 Búsqueda y Filtros

**Funcionalidades:**
- Los usuarios pueden buscar expertos por:
  - Especialidad (nutrición, entrenamiento, ambos)
  - Ubicación geográfica
  - Rango de precios
  - Calificación promedio
  - Nombre del experto

**Ordenamiento:**
- Los expertos aparecen ordenados por un sistema de ranking inteligente (NO alfabético)
- Factores que determinan el orden:
  1. **Validación oficial:** Expertos validados aparecen primero (+100 puntos)
  2. **Reputación:** Basada en calificaciones de usuarios (+50 puntos máximo)
  3. **Volumen de clientes:** Número de usuarios activos (+30 puntos máximo)
  4. **Participación educativa:** Artículos y contenido creado (+20 puntos máximo)

**Indicadores Visuales:**
- Badge de "Verificado" para expertos con documentos validados
- Calificación promedio visible
- Número de clientes activos
- Precio de sus servicios

#### 3.2.2 Perfil del Experto

**Información Visible:**
- Nombre y foto profesional
- Especialidades y certificaciones
- Biografía y experiencia
- Precios de sus servicios
- Calificaciones y comentarios de usuarios
- Evidencias de resultados (fotos, testimonios)
- Estado de validación (verificado o no)

**Importante:** Los usuarios pueden contratar servicios de CUALQUIER experto, validado o no. La validación es solo un indicador de confiabilidad adicional.

---

### 3.3 Sistema de Suscripciones y Pagos

#### 3.3.1 Proceso de Suscripción

**Paso 1: Selección del Experto**
- El usuario navega el directorio y selecciona un experto
- Revisa su perfil, precios y planes disponibles
- Decide contratar sus servicios

**Paso 2: Tipo de Servicio**
- El usuario selecciona qué servicio desea:
  - Solo nutrición
  - Solo entrenamiento
  - Ambos servicios

**Paso 3: Pago**
- El usuario ingresa su información de pago
- El pago se procesa de forma segura dentro de la plataforma
- El usuario paga a suntUS, no directamente al experto

**Paso 4: Cuestionarios Iniciales**
- El usuario completa cuestionarios personalizados que el experto ha configurado:
  - Información personal (objetivos, preferencias, restricciones)
  - Información nutricional (alergias, preferencias alimentarias)
  - Información deportiva (lesiones previas, nivel de condición física)
- Estos cuestionarios ayudan al experto a crear un plan personalizado

**Paso 5: Activación**
- Una vez completados los cuestionarios, la suscripción se activa
- El experto comienza a crear el plan personalizado
- El usuario puede cancelar dentro de las primeras 48 horas sin penalización

#### 3.4.2 Ciclos de Facturación

**Opciones:**
- **Mensual:** Pago cada mes
- **Trimestral:** Pago cada 3 meses (con descuento)
- **Anual:** Pago anual (con mayor descuento)

**Renovación:**
- La suscripción se renueva automáticamente al final de cada ciclo
- El usuario puede cancelar en cualquier momento
- Si cancela, mantiene acceso hasta el final del período pagado

#### 3.3.3 Sistema de Monetización "Pay-Per-Seat" con Wallet (Rolling T+7)

**Cómo Funciona:**
- suntUS cobra una comisión por cada usuario activo que tenga el experto
- El experto establece sus precios, y suntUS calcula la comisión automáticamente
- **Sistema de Wallet (Rolling T+7):**
  - Los fondos entran en estado "Pendiente" cuando se recibe el pago
  - Después de 7 días, los fondos se mueven a estado "Disponible"
  - Los fondos disponibles se pagan al experto cada miércoles automáticamente

**"La Beca del 6to":**
- Si un experto tiene 5 usuarios o menos, paga comisión normal por todos
- Si un experto tiene 6 o más usuarios, el 6to usuario y siguientes NO generan comisión
- Esto incentiva a los expertos a crecer su base de clientes

**Ejemplo:**
- Experto con 4 usuarios: Paga comisión por los 4
- Experto con 6 usuarios: Paga comisión por los primeros 5, el 6to es ingreso neto para el experto
- Experto con 10 usuarios: Paga comisión por los primeros 5, los otros 5 son ingreso neto

**Escrow para Packs (Goteo):**
- Si el usuario paga 6 meses por adelantado, el sistema solo libera 1/6 del valor al experto cada mes
- Esto protege al usuario y al experto: el experto recibe ingresos mensuales, no todo de golpe
- Ejemplo: Usuario paga $600 por 6 meses → Experto recibe $100 cada mes durante 6 meses

#### 3.3.4 Grandfathering (Protección de Precios)

**Cómo Funciona:**
- Cuando un experto cambia sus precios, los usuarios que ya están suscritos NO ven el cambio automáticamente
- Cada suscripción mantiene el precio original con el que se contrató (snapshot inmutable)
- Esto protege a los usuarios de aumentos de precio inesperados

**Migración de Precio:**
- Si el experto quiere aumentar el precio, debe ofrecerlo como "Opt-in" (opción)
- El usuario puede:
  - Aceptar el nuevo precio (su suscripción se actualiza)
  - Rechazar y mantener el precio actual hasta cancelar
  - Cancelar inmediatamente

#### 3.3.5 Política de Reembolsos "Digital Seal" (Anti-Robo)

**Ventana de Reembolso:**
- Reembolso automático permitido solo en los primeros 7 días después de contratar
- Después de 7 días, requiere aprobación manual

**El Candado (Protección contra Robo):**
- Si el usuario abre o ve el plan (nutricional o deportivo), se marca como "contenido consumido"
- Si se detecta un screenshot del plan, también se marca como consumido
- **Bloqueo Inmediato:** Si el contenido fue consumido, el reembolso automático se BLOQUEA
- Esto anula la ventana de 7 días: aunque sea día 2, si ya vio el contenido, no hay reembolso automático
- Solo reembolso manual con justificación válida

**Protección Visual (Watermark):**
- Todos los planes (rutinas y dietas) tienen un watermark invisible pero trazable
- El watermark contiene: email del usuario, ID del usuario, y timestamp
- Si alguien comparte una captura de pantalla, se puede rastrear quién la filtró
- El watermark es sutil (opacidad 10%) y no interfiere con la lectura

#### 3.3.6 Prorrateo y Cancelación

**Cancelación:**
- No hay reembolsos parciales en efectivo por cancelar a mitad de mes
- Al cancelar, la suscripción se marca para cancelar al final del período pagado
- El usuario mantiene acceso hasta el final del período que ya pagó

**Cambio de Experto:**
- Si el usuario cambia de experto a mitad de ciclo:
  - El sistema calcula los días restantes no usados del período pagado
  - Crea un "Crédito Interno" equivalente al valor de esos días
  - Este crédito se aplica automáticamente al pago del nuevo experto
  - El usuario no pierde dinero, solo transfiere el crédito

---

### 3.4 Planes Nutricionales

#### 3.4.1 Creación del Plan

**Proceso del Experto:**
1. El experto revisa las respuestas del cuestionario del usuario
2. Crea un plan nutricional personalizado que incluye:
   - Calendario semanal (lunes a domingo)
   - Comidas por día (desayuno, comida, cena, snacks)
   - Recetas específicas con instrucciones
   - Fotos de platos sugeridos
   - Horarios recomendados para cada comida
   - Lista de compras semanal

**Herramientas del Experto:**
- **Mago Nutricional:** El experto puede indicar objetivos de macros (proteínas, carbohidratos, grasas) o "equivalentes" (ej: "2 porciones de proteína"), y el sistema sugiere recetas que cumplen esos objetivos
- **Base de Recetas:** Acceso a recetas pre-cargadas con información nutricional completa
- **Plantillas:** Puede guardar planes tipo y aplicarlos a múltiples usuarios con ajustes personalizados

#### 3.4.2 Visualización del Plan (Usuario)

**Pantalla Principal:**
- Calendario semanal interactivo
- Al hacer clic en un día, ve:
  - Todas las comidas del día
  - Recetas con fotos e instrucciones
  - Horarios sugeridos
  - Información nutricional (calorías, macros)

**Funcionalidades:**
- Marcar comidas como "completadas"
- Ver lista de compras consolidada
- Acceder a recetas favoritas
- Ver historial de adherencia al plan

#### 3.4.3 Seguimiento y Ajustes

**Seguimiento del Usuario:**
- El usuario puede reportar su adherencia al plan
- Puede subir fotos de sus comidas
- Puede registrar su peso y medidas

**Ajustes del Experto:**
- El experto puede modificar el plan según el progreso del usuario
- Puede agregar o quitar comidas
- Puede ajustar porciones según resultados

---

### 3.5 Planes Deportivos

#### 3.5.1 Creación del Plan

**Proceso del Experto:**
1. El experto revisa las respuestas del cuestionario del usuario
2. Crea un plan deportivo personalizado que incluye:
   - Calendario semanal (lunes a domingo)
   - Ejercicios por día
   - Series, repeticiones y carga para cada ejercicio
   - Videos explicativos de cada ejercicio
   - Tiempos de descanso
   - Instrucciones de ejecución

**Herramientas del Experto:**
- **Constructor de Rutinas:** El experto selecciona ejercicios de un catálogo (sin escribir), configura series/repeticiones/peso, y arma la rutina visualmente
- **Baúl de Ejercicios:** Acceso a ejercicios base provistos por suntUS + ejercicios propios del experto + ejercicios compartidos por otros expertos
- **Plantillas:** Puede guardar "semanas tipo" y aplicarlas a múltiples usuarios con un clic

**Prioridad en el Baúl de Ejercicios:**
1. Mis ejercicios (creados por el experto)
2. Ejercicios base de suntUS (placeholder de alta calidad)
3. Ejercicios compartidos por otros expertos

#### 3.5.2 Visualización del Plan (Usuario)

**Pantalla Principal:**
- Calendario semanal interactivo
- Al hacer clic en un día, ve:
  - Lista de ejercicios del día
  - Videos de ejecución de cada ejercicio
  - Series, repeticiones y peso asignado
  - Tiempos de descanso
  - Notas del experto

**Funcionalidades:**
- Marcar ejercicios como "completados"
- Registrar peso levantado y repeticiones realizadas
- Subir fotos de progreso
- Ver historial de entrenamientos
- **Watermark de protección:** Rutina visible con watermark trazable (email, ID, timestamp)
- **Detección de screenshots:** Si se detecta screenshot, se marca como contenido consumido

#### 3.5.3 Seguimiento y Ajustes

**Seguimiento del Usuario:**
- El usuario registra su ejecución de cada ejercicio
- Puede reportar dificultades o lesiones
- Puede subir fotos de progreso

**Ajustes del Experto:**
- El experto puede modificar la rutina según el progreso
- Puede aumentar o disminuir carga
- Puede cambiar ejercicios si hay lesiones o limitaciones

---

### 3.6 Cardex Médico Deportivo

#### 3.6.1 Concepto

El Cardex Médico Deportivo es el historial completo de salud y condición física del usuario. **La información le pertenece al usuario**, no al experto.

#### 3.6.2 Contenido del Cardex

**Tipos de Información:**
- **Mediciones:** Peso, talla, porcentaje de grasa, masa muscular, etc.
- **Lesiones:** Historial de lesiones y recuperaciones
- **Notas Médicas:** Observaciones del experto sobre el estado de salud
- **Fotos de Progreso:** Evolución física del usuario
- **Planes Asignados:** Historial de planes nutricionales y deportivos recibidos

**Auditoría:**
- Cada entrada muestra quién la creó (qué experto)
- Cada entrada tiene fecha y hora de creación
- El historial es permanente e inmutable

#### 3.6.3 Portabilidad

**Cambio de Experto:**
- Si el usuario cambia de experto, todo su historial viaja con él
- El nuevo experto puede ver el historial completo (incluyendo entradas de expertos anteriores)
- Esto permite continuidad en el seguimiento sin perder información

**Acceso:**
- El usuario siempre puede ver su historial completo
- Solo los expertos que tienen o tuvieron relación con el usuario pueden ver su historial
- El usuario puede exportar su historial completo en cualquier momento

---

### 3.7 Sistema de Facturación

#### 3.7.1 Historial de Pagos (Usuario)

**Información Disponible:**
- Lista de todos los pagos realizados
- Fechas de pago y montos
- Servicios contratados
- Comprobantes de pago descargables
- Próximos pagos programados

**Gestión:**
- El usuario puede ver métodos de pago guardados
- Puede agregar o eliminar métodos de pago
- Puede cambiar el ciclo de facturación (mensual, trimestral, anual)
- Puede solicitar reembolsos (según políticas de la plataforma)

#### 3.7.2 Finanzas del Experto

**Dashboard de Monetización:**
- Número de usuarios activos
- **Wallet:**
  - Fondos Pendientes (en espera de T+7 días)
  - Fondos Disponibles (listos para retiro)
  - Total Ganado (histórico)
  - Total Pagado (histórico)
- Ingresos totales recibidos
- Comisión de suntUS (calculada automáticamente)
- Pago neto recibido (después de comisiones)
- Indicador visual de "Beca del 6to" (si aplica)
- Próximos pagos programados (cada miércoles)

**Retiro de Fondos:**
- Los fondos se dispersan automáticamente cada miércoles
- Solo se dispersan los fondos "Disponibles" (que pasaron el período T+7)
- El experto NO puede retirar manualmente (es automático)
- Historial completo de retiros y pagos recibidos

**Escrow (Packs):**
- Si tiene usuarios con pagos anticipados (packs), ve el desglose:
  - Total del pack pagado
  - Meses restantes por liberar
  - Próxima liberación programada

---

### 3.8 Fitoteca (Centro de Conocimiento)

#### 3.8.1 Concepto

La Fitoteca es un repositorio de artículos educativos sobre nutrición, entrenamiento, farmacología y psicología del deporte, creados por expertos de la plataforma.

#### 3.8.2 Contenido

**Tipos de Artículos:**
- **Nutrición:** Alimentación, suplementación, dietas especiales
- **Entrenamiento:** Técnicas, metodologías, programas de ejercicio
- **Farmacología:** Suplementos, medicamentos, interacciones
- **Psicología:** Motivación, mentalidad, bienestar mental

**Características:**
- Artículos escritos por expertos verificados
- Algunos artículos tienen "check azul" de suntUS (información científicamente validada)
- Sistema de calificación por la comunidad (upvotes/downvotes)
- Métricas de engagement (vistas, likes, compartidos)

#### 3.8.3 Búsqueda y Navegación

**Funcionalidades:**
- Búsqueda por palabras clave
- Filtros por categoría
- Artículos más relevantes destacados
- Artículos más populares
- Artículos recientes

**Para Expertos:**
- Los expertos pueden crear artículos
- Pueden ver estadísticas de sus artículos (vistas, engagement)
- La participación en la Fitoteca mejora su ranking en el directorio

---

### 3.9 Sistema de Ayuda y Soporte

#### 3.9.1 Recursos Disponibles

**Tutoriales:**
- Guías paso a paso para usar la plataforma
- Videos explicativos
- Preguntas frecuentes (FAQ)

**Contacto:**
- Formulario de contacto con suntUS
- Sistema de reporte de errores
- Enlace al sitio oficial de suntUS

#### 3.9.2 Soporte

**Canales:**
- Chat de soporte (si está disponible)
- Email de soporte
- Centro de ayuda con documentación

---

### 3.10 Métricas y Analytics

#### 3.10.1 Métricas para Expertos

**Métricas de Negocio:**
- Servicios no creados (usuarios que pagaron pero aún no tienen plan)
- Servicios pendientes de renovación
- Planes en alerta (usuarios con bajo progreso)
- Servicios en espera de pago
- Servicios cancelados
- Servicios activos

**Métricas Globales (Planes Premium):**
- Comparación con otros expertos
- Métricas agregadas de la industria
- Tendencias del mercado

#### 3.10.2 Métricas para Administradores

**Dashboard Ejecutivo:**
- Usuarios activos (total, nuevos hoy/semana/mes)
- Expertos activos (total, validados, no validados)
- Ingresos totales de la plataforma
- Comisiones totales recibidas
- Pagos totales a expertos
- Suscripciones activas
- Tasa de conversión (visitas → suscripciones)
- Tasa de cancelación
- Top expertos por ingresos
- Top expertos por número de suscriptores
- Métricas de "Beca del 6to" (cuántos expertos tienen 5+ usuarios)

---

## 4. Procesos de Negocio Principales

### 4.1 Proceso de Registro y Validación de Experto

**Flujo Completo:**

1. **Registro Inicial:**
   - El experto se registra como usuario normal
   - Indica que desea ofrecer servicios
   - Completa información profesional básica

2. **Subida de Documentos:**
   - Sube identificación oficial (ID, pasaporte)
   - Sube documento acreditante (cédula, certificado)
   - Los documentos se almacenan de forma segura y privada

3. **Configuración de Servicios:**
   - Establece precios para sus servicios
   - Define sus planes disponibles
   - Configura cuestionarios personalizados

4. **Estado Inicial:**
   - Estado: "Pendiente de validación"
   - Puede comenzar a trabajar inmediatamente
   - Aparece en el directorio pero con menor visibilidad

5. **Validación (Opcional):**
   - Un administrador revisa los documentos cuando es posible
   - Si aprueba: Estado cambia a "Validado", mejora su ranking
   - Si rechaza: Se notifica al experto con razón, puede corregir y volver a enviar
   - **Importante:** La validación NO es bloqueante, el experto puede seguir trabajando

### 4.2 Proceso de Suscripción de Usuario

**Flujo Completo:**

1. **Búsqueda:**
   - El usuario navega el directorio
   - Aplica filtros (especialidad, precio, ubicación, calificación)
   - Revisa perfiles de expertos

2. **Selección:**
   - El usuario selecciona un experto
   - Revisa su perfil completo
   - Decide contratar sus servicios

3. **Pago:**
   - Selecciona tipo de servicio (nutrición, entrenamiento, ambos)
   - Selecciona ciclo de facturación (mensual, trimestral, anual)
   - Ingresa información de pago
   - Confirma el pago

4. **Cuestionarios:**
   - Completa cuestionarios personalizados del experto
   - Proporciona información de salud, objetivos y preferencias

5. **Activación:**
   - Una vez completados los cuestionarios, la suscripción se activa
   - El experto comienza a crear el plan personalizado
   - El usuario puede cancelar dentro de 48 horas sin penalización

6. **Creación del Plan:**
   - El experto crea el plan basado en las respuestas
   - El usuario recibe notificación cuando el plan está listo
   - Puede comenzar a seguir el plan

### 4.3 Proceso de Creación de Plan Nutricional

**Flujo del Experto:**

1. **Revisión de Información:**
   - El experto revisa las respuestas del cuestionario del usuario
   - Revisa el historial médico del usuario (si existe)
   - Identifica objetivos y restricciones

2. **Diseño del Plan:**
   - Usa el "Mago Nutricional" para sugerir recetas según macros objetivo
   - O indica equivalentes (ej: "2 porciones de proteína") y el sistema sugiere recetas
   - Selecciona recetas de la base de datos o crea recetas personalizadas
   - Asigna comidas a cada día de la semana

3. **Personalización:**
   - Ajusta porciones según necesidades del usuario
   - Agrega instrucciones específicas
   - Incluye fotos de platos sugeridos
   - Define horarios recomendados

4. **Publicación:**
   - El experto publica el plan
   - El usuario recibe notificación
   - El plan aparece en el calendario del usuario

5. **Seguimiento:**
   - El experto monitorea la adherencia del usuario
   - Ajusta el plan según progreso y feedback

### 4.4 Proceso de Creación de Plan Deportivo

**Flujo del Experto:**

1. **Revisión de Información:**
   - El experto revisa las respuestas del cuestionario del usuario
   - Revisa historial de lesiones y condición física
   - Identifica objetivos y limitaciones

2. **Diseño de Rutina:**
   - Accede al baúl de ejercicios
   - Selecciona ejercicios (prioridad: propios, base de suntUS, compartidos)
   - Usa el constructor visual para armar la rutina
   - Configura series, repeticiones, peso y descanso sin escribir

3. **Aplicación de Plantillas (Opcional):**
   - Si tiene una "semana tipo" guardada, puede aplicarla con un clic
   - Ajusta parámetros según el usuario específico
   - Puede aplicar la misma plantilla a múltiples usuarios

4. **Personalización:**
   - Ajusta carga según nivel del usuario
   - Agrega notas de ejecución
   - Incluye videos explicativos si es necesario

5. **Publicación:**
   - El experto publica la rutina
   - El usuario recibe notificación
   - La rutina aparece en el calendario del usuario

6. **Seguimiento:**
   - El experto monitorea la ejecución del usuario
   - Ajusta la rutina según progreso y feedback

### 4.5 Proceso de Pago y Dispersión de Fondos

**Flujo Completo:**

1. **Pago del Usuario:**
   - El usuario realiza el pago dentro de la plataforma
   - El pago se procesa de forma segura
   - El dinero llega a suntUS, no directamente al experto

2. **Cálculo de Comisión:**
   - El sistema cuenta cuántos usuarios activos tiene el experto
   - Aplica la regla de "Beca del 6to":
     - Si tiene 5 o menos usuarios: comisión normal por todos
     - Si tiene 6 o más: comisión solo por los primeros 5, el resto es ingreso neto
   - Calcula la comisión de suntUS
   - Calcula el pago al experto (monto total - comisión)

3. **Registro:**
   - Se registra la transacción completa:
     - Monto total pagado
     - Comisión de suntUS
     - Pago al experto
   - Esta información es permanente para contabilidad

4. **Dispersión:**
   - El pago al experto se agrega a su cuenta
   - El experto puede retirar sus fondos según el ciclo configurado
   - Los fondos se dispersan automáticamente

### 4.6 Proceso de Cambio de Experto

**Flujo Completo:**

1. **Cancelación:**
   - El usuario cancela su suscripción con el experto actual
   - Mantiene acceso hasta el final del período pagado

2. **Búsqueda de Nuevo Experto:**
   - El usuario busca un nuevo experto en el directorio
   - Puede contratar servicios de otro experto inmediatamente

3. **Portabilidad del Historial:**
   - Todo el historial médico y deportivo del usuario viaja con él
   - El nuevo experto puede ver:
     - Todas las mediciones históricas
     - Historial de lesiones
     - Notas de expertos anteriores
     - Fotos de progreso
     - Planes anteriores
   - Cada entrada muestra qué experto la creó (auditoría)

4. **Continuidad:**
   - El nuevo experto tiene contexto completo del usuario
   - Puede crear planes que continúen el trabajo anterior
   - No se pierde información

### 4.7 Proceso de Validación de Experto (Administrador)

**Flujo Completo:**

1. **Revisión de Pendientes:**
   - El administrador accede al panel de validación
   - Ve lista de expertos con documentos pendientes de revisar

2. **Revisión de Documentos:**
   - El administrador puede ver los documentos subidos:
     - Identificación oficial
     - Documento acreditante
   - Los documentos se muestran de forma segura y temporal

3. **Decisión:**
   - **Aprobar:**
     - El estado del experto cambia a "Validado"
     - Su ranking en el directorio mejora automáticamente
     - Aparece con badge de "Verificado"
     - Se registra la acción en el sistema de auditoría
   - **Rechazar:**
     - Se notifica al experto con la razón del rechazo
     - El experto puede corregir y volver a enviar documentos
     - Se registra la acción en el sistema de auditoría

4. **Registro:**
   - Todas las acciones se registran permanentemente
   - Se guarda quién aprobó/rechazó, cuándo y por qué

---

## 5. Reglas de Negocio Críticas

### 5.1 Validación de Expertos

**Regla 1:** La validación NO es bloqueante
- Los expertos pueden trabajar sin validación
- La validación solo afecta visibilidad en el directorio

**Regla 2:** Validación mejora ranking
- Expertos validados reciben +100 puntos de ranking
- Aparecen primero en las búsquedas

**Regla 3:** Validación es opcional pero recomendada
- Los expertos pueden subir documentos en cualquier momento
- Pueden trabajar mientras esperan validación

### 5.2 Sistema de Ranking

**Regla 1:** NO es alfabético
- El orden se basa en un algoritmo de puntos
- Factores: Validación (+100), Reputación (+50), Volumen (+30), Fitoteca (+20)

**Regla 2:** Expertos no validados aparecen después
- Tienen ranking normal pero sin el bonus de validación
- Pueden aparecer primero si tienen excelente reputación y volumen

**Regla 3:** Meritocracia
- Los mejores expertos (por puntos) aparecen primero
- El usuario decide con quién trabajar

### 5.3 Propiedad de Datos

**Regla 1:** El Cardex pertenece al usuario
- La información de salud es propiedad del usuario
- El usuario puede exportar su historial completo

**Regla 2:** Portabilidad total
- Si el usuario cambia de experto, su historial viaja con él
- El nuevo experto ve todo el historial (incluyendo entradas de expertos anteriores)

**Regla 3:** Auditoría permanente
- Cada entrada muestra quién la creó
- El historial es inmutable (no se puede borrar ni modificar)

### 5.4 Monetización "Pay-Per-Seat" con Wallet

**Regla 1:** Centralización de pagos
- Todos los pagos van a suntUS (vía Stripe Checkout)
- suntUS dispersa fondos a expertos automáticamente cada miércoles

**Regla 2:** Wallet Model (Rolling T+7)
- Los fondos entran en estado "Pendiente" cuando se recibe el pago
- Después de 7 días, se mueven a estado "Disponible"
- Solo los fondos "Disponibles" se pagan al experto

**Regla 3:** "Beca del 6to"
- Primeros 5 usuarios: comisión normal
- 6to usuario y siguientes: sin comisión (ingreso neto para experto)

**Regla 4:** Escrow para Packs (Goteo)
- Si usuario paga pack (ej: 6 meses), se libera 1/6 cada mes
- Protege al usuario y al experto

**Regla 5:** Transparencia
- El experto ve desglose completo: ingresos, comisión, pago neto
- Ve fondos pendientes vs disponibles
- Todas las transacciones se registran permanentemente

### 5.7 Grandfathering (Protección de Precios)

**Regla 1:** Inmutabilidad de precios
- Cuando experto cambia precio, NO afecta suscripciones existentes
- Cada suscripción mantiene el precio original (snapshot)

**Regla 2:** Migración Opt-in
- Si experto quiere aumentar precio, debe ofrecerlo como opción
- Usuario decide: aceptar nuevo precio, mantener actual, o cancelar

### 5.8 Política de Reembolsos "Digital Seal"

**Regla 1:** Ventana de 7 días
- Reembolso automático solo en primeros 7 días

**Regla 2:** Bloqueo por consumo
- Si usuario ve/abre el plan, se marca como "consumido"
- Si se detecta screenshot, también se marca como consumido
- Si contenido fue consumido, reembolso automático se BLOQUEA inmediatamente

**Regla 3:** Watermark obligatorio
- Todos los planes tienen watermark trazable
- Contiene: email, ID, timestamp del usuario
- Permite rastrear fugas de información

### 5.9 Prorrateo y Créditos

**Regla 1:** Sin reembolso parcial en efectivo
- Al cancelar, no hay reembolso por días no usados
- Usuario mantiene acceso hasta fin del período pagado

**Regla 2:** Créditos internos por cambio de experto
- Si cambia de experto a mitad de ciclo, recibe crédito interno
- Crédito se aplica automáticamente al nuevo experto
- Usuario no pierde dinero

### 5.5 Términos y Condiciones

**Regla 1:** Versionado
- Los Términos y Condiciones tienen versiones (1.0, 1.1, 2.0, etc.)
- Solo una versión está activa a la vez

**Regla 2:** Aceptación obligatoria
- El usuario debe aceptar los Términos al registrarse
- Si suntUS publica una nueva versión, el usuario debe aceptarla para continuar

**Regla 3:** Bloqueo de app
- Si el usuario no acepta la nueva versión, no puede usar la plataforma
- Solo puede acceder a la pantalla de aceptación de términos

**Regla 4:** Registro permanente
- Cada aceptación se registra permanentemente
- Se guarda: usuario, versión, fecha, IP, dispositivo

### 5.6 Ejercicios y Contenido

**Regla 1:** suntUS provee ejercicios base
- suntUS carga ejercicios placeholder de alta calidad
- Estos ejercicios son globales y disponibles para todos

**Regla 2:** Expertos crean sus propios ejercicios
- Cada experto puede crear ejercicios personalizados
- Pueden compartirlos con otros expertos o mantenerlos privados

**Regla 3:** Prioridad en el baúl
1. Ejercicios propios del experto
2. Ejercicios base de suntUS
3. Ejercicios compartidos por otros expertos

**Regla 4:** Admin NO crea ejercicios
- Los administradores solo monitorean, no crean contenido

---

## 6. Flujos de Usuario Principales

### 6.1 Flujo: Usuario Nuevo Contrata Servicio

1. Usuario se registra en la plataforma
2. Acepta Términos y Condiciones
3. Navega el directorio de expertos
4. Aplica filtros (precio, especialidad, calificación)
5. Revisa perfiles de expertos
6. Selecciona un experto
7. Contrata servicio (nutrición, entrenamiento, o ambos)
8. Realiza el pago
9. Completa cuestionarios personalizados
10. Espera a que el experto cree su plan
11. Recibe notificación cuando el plan está listo
12. Comienza a seguir el plan

### 6.2 Flujo: Experto Crea Plan para Cliente

1. Experto recibe notificación de nuevo cliente
2. Revisa respuestas del cuestionario
3. Revisa historial médico del cliente (si existe)
4. Crea plan personalizado:
   - **Si es nutrición:** Usa Mago Nutricional, selecciona recetas, arma calendario
   - **Si es deportivo:** Accede a baúl de ejercicios, construye rutina, aplica plantilla si tiene
5. Publica el plan
6. Cliente recibe notificación
7. Monitorea adherencia del cliente
8. Ajusta plan según progreso

### 6.3 Flujo: Usuario Cambia de Experto

1. Usuario cancela suscripción con experto actual
2. Mantiene acceso hasta fin de período pagado
3. **Sistema calcula crédito interno:**
   - Calcula días restantes del período pagado
   - Crea crédito interno equivalente al valor de esos días
4. Busca nuevo experto en directorio
5. Contrata servicios del nuevo experto
6. **Crédito se aplica automáticamente:**
   - El crédito interno se descuenta del pago del nuevo experto
   - Usuario solo paga la diferencia (si el nuevo experto es más caro)
7. Nuevo experto puede ver historial completo del usuario
8. Nuevo experto crea plan considerando historial anterior
9. Usuario continúa su progreso sin perder información ni dinero

### 6.4 Flujo: Experto Valida sus Documentos

1. Experto se registra y sube documentos
2. Estado: "Pendiente de validación"
3. Puede trabajar normalmente
4. Administrador revisa documentos (cuando es posible)
5. Administrador aprueba o rechaza
6. Si aprueba: Estado cambia a "Validado", mejora ranking
7. Si rechaza: Experto recibe notificación con razón, puede corregir

---

## 7. Características Especiales

### 7.1 Mago Nutricional

**Descripción:**
Herramienta que permite al experto indicar objetivos nutricionales (macros o equivalentes) y el sistema sugiere recetas que cumplen esos objetivos.

**Ejemplo de Uso:**
- Experto dice: "Necesito 30g de proteína, 50g de carbohidratos, 20g de grasa"
- Sistema sugiere: Lista de recetas que cumplen esos macros
- Experto selecciona recetas y las agrega al plan

**Equivalencias:**
- Experto dice: "2 porciones de proteína, 3 porciones de carbohidratos"
- Sistema convierte a gramos y sugiere recetas
- Facilita la comunicación con el usuario (más intuitivo que gramos)

### 7.2 Constructor de Rutinas

**Descripción:**
Herramienta visual que permite al experto crear rutinas seleccionando ejercicios de un catálogo, sin necesidad de escribir.

**Características:**
- Selección visual de ejercicios
- Configuración de parámetros (series, repeticiones, peso, descanso) con controles
- Arrastrar y soltar ejercicios al calendario
- Guardar como plantilla para reutilizar

**Ventajas:**
- Rapidez: Crear rutina en minutos
- Precisión: Sin errores de escritura
- Reutilización: Aplicar plantilla a múltiples usuarios

### 7.3 Plantillas y Clonación

**Descripción:**
Sistema que permite al experto guardar "semanas tipo" y aplicarlas a múltiples usuarios con un clic.

**Uso:**
- Experto crea una semana de entrenamiento tipo
- La guarda como plantilla "Semana Tipo - Principiantes"
- Cuando tiene un nuevo cliente principiante, aplica la plantilla con un clic
- Ajusta parámetros según el cliente específico

**Aplicación Masiva:**
- Experto puede seleccionar múltiples usuarios
- Aplicar la misma plantilla a todos con un clic
- Ahorra tiempo significativo

### 7.4 Sistema de Reputación por Fitoteca

**Descripción:**
Los expertos que escriben artículos educativos en la Fitoteca mejoran su ranking en el directorio.

**Cómo Funciona:**
- Experto escribe artículo en Fitoteca
- Artículo recibe engagement (vistas, likes, compartidos)
- Sistema calcula "contribución a Fitoteca" del experto
- Esto suma hasta +20 puntos al ranking del experto

**Incentivo:**
- Mejor ranking = más visibilidad = más clientes
- Fomenta contenido educativo de calidad

### 7.5 Protección Visual (Watermark)

**Descripción:**
Sistema de watermark invisible pero trazable en todos los planes (rutinas y dietas) para prevenir y rastrear fugas de información.

**Características:**
- Watermark contiene: Email del usuario, ID del usuario, y Timestamp
- Patrón repetido en toda la pantalla
- Opacidad muy baja (10%) para no interferir con la lectura
- No bloquea interacciones (pointerEvents: none)
- Siempre visible (zIndex: 999)

**Propósito:**
- Si alguien comparte una captura de pantalla, se puede rastrear quién la filtró
- Disuade compartir contenido de forma no autorizada
- Protege la propiedad intelectual del experto

**Implementación:**
- Componente obligatorio en pantallas de rutinas y dietas
- Se genera automáticamente cuando el usuario abre el plan
- No se puede desactivar ni ocultar

---

## 8. Seguridad y Privacidad

### 8.1 Protección de Datos Personales

**Medidas:**
- Información personal encriptada
- Acceso restringido según roles
- Historial médico solo visible para el usuario y sus expertos

### 8.2 Protección de Documentos Oficiales

**Medidas:**
- Documentos de expertos almacenados de forma privada
- Solo administradores pueden acceder
- Acceso temporal y auditado

### 8.3 Registro de Auditoría

**Medidas:**
- Todas las acciones críticas se registran permanentemente
- Registro incluye: quién, qué, cuándo, desde dónde
- Registros no se pueden borrar ni modificar
- Protección legal para la plataforma y usuarios

---

## 9. Soporte Multilenguaje

### 9.1 Idiomas Soportados

- Español (principal)
- Inglés

### 9.2 Contenido Traducido

**Interfaz:**
- Todos los textos de la plataforma están en ambos idiomas
- El usuario selecciona su idioma preferido

**Contenido Dinámico:**
- Ejercicios tienen nombres y descripciones en ambos idiomas
- Recetas tienen instrucciones en ambos idiomas
- Artículos de Fitoteca pueden estar en ambos idiomas
- Países y ubicaciones tienen nombres en ambos idiomas

---

## 10. Resumen Ejecutivo

### 10.1 ¿Qué Hace suntUS?

suntUS conecta personas que buscan mejorar su salud y condición física con profesionales especializados, facilitando la contratación, el seguimiento y el pago de servicios de nutrición y entrenamiento.

### 10.2 ¿Cómo Funciona?

1. **Usuarios** buscan expertos en el directorio
2. **Contratan servicios** y realizan pagos dentro de la plataforma
3. **Expertos** crean planes personalizados para sus clientes
4. **Usuarios** siguen los planes y reportan progreso
5. **Expertos** reciben pagos automáticos después de comisiones
6. **suntUS** facilita todo el proceso y garantiza seguridad

### 10.3 Ventajas Clave

**Para Usuarios:**
- Acceso a múltiples expertos en un solo lugar
- Transparencia en precios y calificaciones
- Seguimiento completo de su progreso
- Propiedad de sus datos de salud
- Facilidad para cambiar de experto

**Para Expertos:**
- Plataforma para ofrecer servicios de forma profesional
- Escalabilidad sin cuellos de botella
- Herramientas que aceleran su trabajo
- Pagos automáticos y transparentes
- Incentivos para crecer (Beca del 6to)

**Para suntUS:**
- Modelo de negocio escalable
- Centralización de pagos
- Sistema de comisiones automático
- Protección legal con auditoría completa

---

**Fin del Documento**

---

**Notas:**
- Este documento describe las funcionalidades desde la perspectiva del usuario final
- No incluye detalles técnicos de implementación
- Se actualiza según evoluciona la plataforma
- Para detalles técnicos, consultar el Plan de Desarrollo MVP

