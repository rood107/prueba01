# 🎓 FLUJO COMPLETO DEL SISTEMA DE EVALUACIÓN

Este documento describe el flujo completo del sistema de evaluación, desde la configuración inicial hasta la publicación de resultados.

---

## 📋 ÍNDICE

1. [Configuración Inicial del Sistema](#1-configuración-inicial-del-sistema)
2. [Gestión de Materias](#2-gestión-de-materias)
3. [Asignación de Recursos](#3-asignación-de-recursos)
4. [Creación de Evaluaciones](#4-creación-de-evaluaciones)
5. [Resolución de Evaluaciones](#5-resolución-de-evaluaciones)
6. [Calificación](#6-calificación)
7. [Publicación de Resultados](#7-publicación-de-resultados)
8. [Análisis y Estadísticas](#8-análisis-y-estadísticas)

---

## 1. CONFIGURACIÓN INICIAL DEL SISTEMA

### 1.1 Registro de Usuarios
**Responsable:** Administrador del Sistema

**Acciones:**
- Registrar **Docentes** en el sistema
  - Datos: nombre, apellido, email, contraseña
  - Asignar rol: `DOCENTE`
  - Estado: `activo`

- Registrar **Estudiantes** en el sistema
  - Datos: nombre, apellido, email, contraseña
  - Asignar rol: `ESTUDIANTE`
  - Estado: `activo`

**Salida:**
- ✅ Usuarios creados y activados
- ✅ Credenciales de acceso generadas

---

## 2. GESTIÓN DE MATERIAS

### 2.1 Creación de Materias
**Responsable:** Administrador o Coordinador Académico

**Acciones:**
1. Crear materia/asignatura
   - Código (ej: `ARQ-SOFT-2024`)
   - Nombre (ej: `Arquitectura de Software`)
   - Descripción
   - Periodo académico (ej: `2024-1`)
   - Fechas de inicio y fin
   - Nivel, créditos, departamento (opcional)

2. Activar la materia

**Entidad:** `Materia`

**Salida:**
- ✅ Materia creada y disponible para asignaciones

---

## 3. ASIGNACIÓN DE RECURSOS

### 3.1 Asignación de Docentes a Materias
**Responsable:** Administrador o Coordinador Académico

**Acciones:**
1. Seleccionar materia
2. Seleccionar docente(s)
3. Asignar rol del docente:
   - `TITULAR`: Responsable principal
   - `AUXILIAR`: Docente de apoyo
   - `AYUDANTE`: Asistente
4. Confirmar asignación

**Entidad:** `DocenteMateria`

**Validaciones:**
- El docente debe existir y estar activo
- La materia debe existir y estar activa
- Un mismo docente puede estar asignado a múltiples materias

**Salida:**
- ✅ Docente(s) asignado(s) a la materia
- ✅ Docente puede ver la materia en su panel

---

### 3.2 Inscripción de Estudiantes a Materias
**Responsable:** Administrador o Auto-inscripción del Estudiante

**Acciones:**
1. Seleccionar materia
2. Seleccionar estudiante(s) o permitir auto-inscripción
3. Crear inscripción con estado `ACTIVA`
4. Confirmar inscripción

**Entidad:** `Inscripcion`

**Validaciones:**
- El estudiante debe existir y estar activo
- La materia debe estar activa
- No permitir inscripciones duplicadas
- Validar cupos disponibles (si aplica)

**Salida:**
- ✅ Estudiante(s) inscrito(s) en la materia
- ✅ Estudiante puede ver la materia en su panel

---

## 4. CREACIÓN DE EVALUACIONES

### 4.1 Crear Evaluación (Docente)
**Responsable:** Docente asignado a la materia

**Flujo:**

#### Paso 1: Información Básica
- Seleccionar materia
- Ingresar título de la evaluación
- Ingresar descripción
- Estado inicial: `BORRADOR`

#### Paso 2: Configuración
- **Tiempo:**
  - Límite de tiempo (minutos) o ilimitado
  
- **Disponibilidad:**
  - Fecha y hora de habilitación
  - Fecha y hora de cierre
  
- **Intentos:**
  - Cantidad máxima de intentos (0 = ilimitados)
  - ¿Permitir reanudar intento interrumpido?
  
- **Calificación:**
  - Puntaje de aprobación
  - ¿Mostrar resultado inmediato?
  - ¿Mostrar respuestas correctas?
  
- **Presentación:**
  - ¿Mezclar preguntas?
  - ¿Mezclar opciones?
  - Preguntas por página (0 = todas)
  
- **Restricciones:**
  - ¿Requiere contraseña?
  - ¿Navegación libre entre preguntas?

#### Paso 3: Creación de Preguntas
Para cada pregunta:
1. Seleccionar tipo:
   - `MULTIPLE_CHOICE` (opción múltiple)
   - `MULTIPLE_RESPONSE` (múltiple respuesta)
   - `TRUE_FALSE` (verdadero/falso)
   - `SHORT_ANSWER` (respuesta corta)
   - `ESSAY` (ensayo)
   - `FILL_BLANK` (completar espacios)
   - `MATCHING` (emparejar)

2. Configurar pregunta según tipo:
   - Enunciado
   - Puntaje
   - Opciones/respuestas correctas
   - Retroalimentación
   - Ayuda (hint)
   - Tags y dificultad

3. Definir orden de presentación

#### Paso 4: Revisión y Publicación
- Revisar configuración general
- Revisar todas las preguntas
- Validar que puntajes suman correctamente
- Cambiar estado:
  - `BORRADOR` → `ACTIVA` (publicar)
  - o mantener en `BORRADOR` para editar después

**Entidades:** `Evaluacion`, `Pregunta`

**Validaciones:**
- La materia debe pertenecer al docente
- Debe tener al menos 1 pregunta
- Fechas de habilitación/cierre coherentes
- Puntajes válidos

**Salida:**
- ✅ Evaluación creada
- ✅ Si está `ACTIVA`: visible para estudiantes inscritos

---

## 5. RESOLUCIÓN DE EVALUACIONES

### 5.1 Acceso del Estudiante
**Responsable:** Estudiante inscrito en la materia

**Pre-requisitos:**
- Estudiante debe estar inscrito en la materia
- Evaluación debe estar en estado `ACTIVA`
- Debe estar dentro del periodo de disponibilidad
- No debe haber excedido el número de intentos

**Flujo:**

#### Paso 1: Listar Evaluaciones Disponibles
El estudiante ve:
- Evaluaciones de todas sus materias
- Filtros por materia, fecha, estado
- Información de cada evaluación:
  - Título y descripción
  - Fecha límite
  - Intentos disponibles
  - Puntaje total y de aprobación

#### Paso 2: Iniciar Evaluación
1. Estudiante selecciona evaluación
2. Sistema valida:
   - ✅ Evaluación disponible
   - ✅ Intentos disponibles
   - ✅ Contraseña (si aplica)

3. Sistema crea `Intento`:
   - Estado: `EN_PROGRESO`
   - Número de intento (1, 2, 3...)
   - Timestamp de inicio
   - Snapshot de configuración
   - Inicializar cronómetro (si hay límite)

**Entidad:** `Intento`

#### Paso 3: Responder Preguntas
Mientras el intento esté activo:

1. **Presentación:**
   - Mostrar preguntas según configuración
   - Mezclar si está configurado
   - Navegación (libre o secuencial)

2. **Por cada pregunta:**
   - Estudiante lee enunciado
   - Ingresa/selecciona respuesta
   - Puede marcar para revisar después
   - Sistema guarda respuesta automáticamente (autoguardado)

3. **Controles disponibles:**
   - Guardar y continuar
   - Marcar para revisión
   - Navegación (si permitido)
   - Ver tiempo restante
   - Pausar (si permitido)
   - Finalizar evaluación

**Entidad:** `Respuesta`

**Auto-guardado:**
- Cada respuesta se guarda automáticamente
- En caso de desconexión, se puede retomar

#### Paso 4: Finalización
El intento finaliza cuando:
- Estudiante presiona "Finalizar"
- Se agota el tiempo límite (automático)
- Periodo de evaluación cierra

**Acciones al finalizar:**
1. Cambiar estado de intento:
   - `EN_PROGRESO` → `COMPLETADO`
   - o `ABANDONADO` si fue por tiempo

2. Registrar timestamp de finalización
3. Calcular tiempo total empleado
4. Pasar a fase de calificación

**Salida:**
- ✅ Intento completado
- ✅ Respuestas guardadas
- ⏳ En espera de calificación

---

## 6. CALIFICACIÓN

### 6.1 Calificación Automática
**Responsable:** Sistema

**Preguntas auto-calificables:**
- ✅ `MULTIPLE_CHOICE`
- ✅ `MULTIPLE_RESPONSE`
- ✅ `TRUE_FALSE`
- ✅ `SHORT_ANSWER` (con validación exacta)
- ✅ `FILL_BLANK`
- ✅ `MATCHING`

**Proceso:**
1. Para cada respuesta:
   - Comparar respuesta del estudiante con respuesta correcta
   - Aplicar lógica según tipo:
     - **Multiple Choice:** opción seleccionada = opción correcta
     - **Multiple Response:** todas seleccionadas correctas Y ninguna incorrecta
     - **True/False:** valor booleano = correcto
     - **Short Answer:** texto == respuesta correcta (case sensitive/insensitive según config)
     - **Fill Blank:** cada blanco comparado individualmente
     - **Matching:** todos los emparejamientos correctos

2. Asignar puntaje:
   - Si correcta: `puntajeMaximo`
   - Si incorrecta: `0`
   - Parcialmente correcta (Multiple Response): puntaje proporcional

3. Calcular totales:
   - Sumar `puntajeObtenido` de todas las respuestas
   - Calcular `porcentaje = (obtenido / total) * 100`
   - Determinar `aprobado = puntaje >= puntajeAprobacion`

4. Actualizar `Intento`:
   - `puntajeObtenido`
   - `porcentaje`
   - `aprobado`

**Si hay preguntas de ensayo:**
- Estado: `EN_PROGRESO` → `CALIFICANDO`
- Notificar al docente para calificación manual

---

### 6.2 Calificación Manual (Docente)
**Responsable:** Docente

**Preguntas que requieren revisión:**
- 📝 `ESSAY` (ensayos)
- 📝 `SHORT_ANSWER` (si requiere revisión manual)

**Flujo:**
1. Docente accede a "Intentos pendientes de calificar"
2. Ve lista de estudiantes con intentos en estado `CALIFICANDO`
3. Para cada intento:
   - Ver respuestas del estudiante
   - Ver criterios de evaluación (si hay rúbrica)
   - Asignar puntaje a cada pregunta de ensayo
   - Agregar comentarios/retroalimentación

4. Finalizar calificación:
   - Calcular puntaje total
   - Determinar aprobación
   - Estado: `CALIFICANDO` → `COMPLETADO`

**Salida:**
- ✅ Intento completamente calificado
- ✅ Listo para generar resultado

---

### 6.3 Generación de Resultado
**Responsable:** Sistema (automático después de calificación)

**Proceso:**
1. Crear entidad `Resultado` con:
   - Referencia al intento
   - Información del estudiante
   - Información de la evaluación
   - Puntajes y porcentajes
   - Estado (aprobado/reprobado)
   
2. Generar estadísticas:
   - Preguntas correctas/incorrectas/sin responder
   - Tiempo empleado
   - Análisis por dificultad
   - Análisis por categoría/tag

3. Generar detalle de respuestas:
   - Por cada pregunta: respuesta del estudiante vs correcta
   - Retroalimentación (si configurado)
   - Explicación de respuestas

**Entidad:** `Resultado`

**Salida:**
- ✅ Resultado generado
- ⏳ Pendiente de publicación

---

## 7. PUBLICACIÓN DE RESULTADOS

### 7.1 Decisión de Publicación
**Responsable:** Docente

**Opciones:**

#### A) Publicación Automática (configurada desde evaluación)
- Si `mostrarResultadoInmediato = true`
- El resultado se publica inmediatamente después de calificar
- Estudiante puede ver su resultado de inmediato

#### B) Publicación Manual
1. Docente revisa todos los resultados
2. Puede ajustar calificaciones si es necesario
3. Agrega comentarios generales si desea
4. Marca resultados como "Publicados"

**Proceso:**
1. Cambiar estado de resultados o evaluación
2. Notificar a estudiantes (email/notificación)
3. Hacer visible en el panel del estudiante

---

### 7.2 Vista del Estudiante
**Responsable:** Estudiante

**Información visible:**
- ✅ Puntaje obtenido / total
- ✅ Porcentaje
- ✅ Estado: Aprobado/Reprobado
- ✅ Tiempo empleado
- ✅ Estadísticas generales

**Si está configurado mostrar respuestas:**
- ✅ Detalle de cada pregunta
- ✅ Respuesta del estudiante
- ✅ Respuesta correcta
- ✅ Retroalimentación

**Acciones disponibles:**
- Ver resultado detallado
- Descargar certificado (si aprobó)
- Ver estadísticas comparativas
- Si quedan intentos: reintentar evaluación

---

## 8. ANÁLISIS Y ESTADÍSTICAS

### 8.1 Dashboard del Docente
**Responsable:** Docente

**Vista de evaluación:**
- Participación (completados, en progreso, no iniciados)
- Promedio general, mediana, min, max
- Desviación estándar
- Distribución de notas (histograma)
- Tiempo promedio de completado

**Estadísticas por pregunta:**
- % de acierto
- Distribución de respuestas (para multiple choice)
- Preguntas más difíciles/fáciles
- Dificultad real vs esperada
- Tiempo promedio por pregunta

**Estudiantes:**
- Mejores y peores resultados
- Estudiantes que necesitan apoyo
- Comparación entre intentos (si hay múltiples)

---

### 8.2 Exportación de Datos
**Responsable:** Docente

**Formatos disponibles:**
- 📄 CSV (para procesamiento)
- 📊 Excel (con gráficos)
- 📑 PDF (reportes formales)

**Contenido:**
- Lista de estudiantes con resultados
- Estadísticas generales
- Detalle de respuestas
- Análisis gráfico

---

## 📊 RESUMEN DE ENTIDADES Y RELACIONES

```
ADMIN/COORDINADOR
  ↓
  ├─ Crear MATERIA
  ├─ Asignar DOCENTE → MATERIA (DocenteMateria)
  └─ Inscribir ESTUDIANTE → MATERIA (Inscripcion)

DOCENTE (asignado a Materia)
  ↓
  ├─ Crear EVALUACION (vinculada a Materia)
  ├─ Agregar PREGUNTAS a Evaluación
  ├─ Publicar (BORRADOR → ACTIVA)
  └─ Calificar INTENTOS (manual si hay essays)

ESTUDIANTE (inscrito en Materia)
  ↓
  ├─ Ver EVALUACIONES disponibles
  ├─ Iniciar INTENTO
  ├─ Responder PREGUNTAS → crear RESPUESTAS
  └─ Finalizar INTENTO

SISTEMA
  ↓
  ├─ Calificar automáticamente
  ├─ Generar RESULTADO
  └─ Calcular ESTADISTICAS

DOCENTE
  ↓
  └─ Publicar RESULTADOS
  
ESTUDIANTE
  ↓
  └─ Ver RESULTADO
```

---

## 🔄 ESTADOS Y TRANSICIONES

### Materia
- `activa: true/false`

### Inscripción
- `PENDIENTE` → `ACTIVA` → `APROBADA`/`REPROBADA`/`RETIRADA`

### Evaluación
- `BORRADOR` → `ACTIVA` → `FINALIZADA` → `ARCHIVADA`

### Intento
- `EN_PROGRESO` → `COMPLETADO`
- `EN_PROGRESO` → `PAUSADO` → `EN_PROGRESO`
- `EN_PROGRESO` → `ABANDONADO`
- `COMPLETADO` → `CALIFICANDO` → `COMPLETADO` (si hay essays)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración
- [ ] Registro de usuarios (Docentes, Estudiantes)
- [ ] Creación de materias
- [ ] Asignación de docentes a materias
- [ ] Inscripción de estudiantes a materias

### Fase 2: Evaluaciones
- [ ] Crear evaluación (información básica)
- [ ] Configurar evaluación
- [ ] Agregar preguntas (todos los tipos)
- [ ] Publicar evaluación

### Fase 3: Resolución
- [ ] Listar evaluaciones disponibles (estudiante)
- [ ] Iniciar intento
- [ ] Responder preguntas
- [ ] Auto-guardado
- [ ] Finalizar intento

### Fase 4: Calificación
- [ ] Calificación automática
- [ ] Calificación manual (docente)
- [ ] Generación de resultados
- [ ] Cálculo de estadísticas

### Fase 5: Resultados
- [ ] Publicación de resultados
- [ ] Vista de resultados (estudiante)
- [ ] Dashboard de docente
- [ ] Exportación de datos

---

## 🎯 PRÓXIMOS PASOS

Con este flujo definido, los siguientes pasos son:

1. **Diseño de Base de Datos**
   - Esquema SQL con relaciones
   - Índices y optimizaciones

2. **Arquitectura de Servicios**
   - APIs REST para cada entidad
   - Lógica de negocio
   - Validaciones

3. **Diseño de UI/UX**
   - Wireframes por rol (Admin, Docente, Estudiante)
   - Flujos de navegación
   - Prototipos interactivos

4. **Implementación**
   - Backend (API)
   - Frontend (Angular)
   - Testing
   - Deploy

---

**Documento creado el:** 2025-12-20  
**Versión:** 1.0  
**Estado:** Diseño Aprobado ✅
