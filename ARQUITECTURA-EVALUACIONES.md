# 📚 Sistema de Evaluaciones - Arquitectura del Proyecto

## 🎯 Objetivo del Sistema
Sistema web que permite a los docentes crear evaluaciones y a los estudiantes resolverlas, con calificación automática.

---

## 🏗️ Estructura del Proyecto

### **Módulos Principales**

#### 1️⃣ **Módulo de Autenticación** (`features/auth/`)
- Login para Docentes y Estudiantes
- Registro de usuarios
- Recuperación de contraseña
- Guard para protección de rutas

#### 2️⃣ **Módulo de Docente** (`features/docente/`)
- **Crear Evaluación**: Formulario para crear nuevas evaluaciones
- **Gestionar Preguntas**: CRUD de preguntas con diferentes tipos
- **Mis Evaluaciones**: Lista de evaluaciones creadas
- **Configuración**: Configurar tiempo, intentos, fecha de habilitación
- **Estadísticas**: Ver resultados y análisis de evaluaciones

#### 3️⃣ **Módulo de Estudiante** (`features/estudiante/`)
- **Evaluaciones Disponibles**: Lista de evaluaciones habilitadas
- **Resolver Evaluación**: Interfaz para responder evaluaciones
- **Mis Resultados**: Historial de evaluaciones completadas
- **Detalle de Resultado**: Ver respuestas y correcciones

#### 4️⃣ **Módulo de Evaluación** (`features/evaluacion/`)
- **Componentes de Preguntas**: 
  - Opción múltiple
  - Verdadero/Falso
  - Respuesta corta
  - Completar espacios
- **Motor de Corrección**: Lógica para calificación automática
- **Servicios Compartidos**: API calls y lógica de negocio

---

## 📊 Modelos de Datos

### **Usuario**
```typescript
interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'DOCENTE' | 'ESTUDIANTE';
  fechaCreacion: Date;
}
```

### **Evaluación**
```typescript
interface Evaluacion {
  id: string;
  titulo: string;
  descripcion: string;
  docenteId: string;
  preguntas: Pregunta[];
  configuracion: ConfiguracionEvaluacion;
  estado: 'BORRADOR' | 'ACTIVA' | 'FINALIZADA';
  fechaCreacion: Date;
}

interface ConfiguracionEvaluacion {
  tiempoLimite?: number; // en minutos
  intentosMaximos: number;
  fechaHabilitacion: Date;
  fechaCierre: Date;
  mostrarResultadoInmediato: boolean;
  mezclarPreguntas: boolean;
  puntajeTotal: number;
}
```

### **Pregunta**
```typescript
interface Pregunta {
  id: string;
  tipo: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'FILL_BLANK';
  enunciado: string;
  puntaje: number;
  orden: number;
  opciones?: OpcionPregunta[]; // Para multiple choice
  respuestaCorrecta: string | string[];
  retroalimentacion?: string;
}

interface OpcionPregunta {
  id: string;
  texto: string;
  esCorrecta: boolean;
}
```

### **Intento de Evaluación**
```typescript
interface IntentoEvaluacion {
  id: string;
  evaluacionId: string;
  estudianteId: string;
  respuestas: Respuesta[];
  fechaInicio: Date;
  fechaFinalizacion?: Date;
  puntajeObtenido?: number;
  estado: 'EN_PROGRESO' | 'COMPLETADA' | 'ABANDONADA';
}

interface Respuesta {
  preguntaId: string;
  respuestaEstudiante: string | string[];
  esCorrecta?: boolean;
  puntajeObtenido?: number;
  fechaRespuesta: Date;
}
```

### **Resultado**
```typescript
interface Resultado {
  id: string;
  intentoId: string;
  estudianteId: string;
  evaluacionId: string;
  puntajeObtenido: number;
  puntajeTotal: number;
  porcentaje: number;
  aprobado: boolean;
  tiempoEmpleado: number; // en minutos
  fechaFinalizacion: Date;
  detalleRespuestas: DetalleRespuesta[];
}

interface DetalleRespuesta {
  preguntaId: string;
  enunciado: string;
  respuestaEstudiante: string | string[];
  respuestaCorrecta: string | string[];
  esCorrecta: boolean;
  puntajeObtenido: number;
  puntajeMaximo: number;
  retroalimentacion?: string;
}
```

---

## 🔄 Flujos Principales

### **Flujo 1: Docente Crea Evaluación**
1. Docente inicia sesión
2. Navega a "Crear Evaluación"
3. Completa información básica (título, descripción)
4. Agrega preguntas una por una
5. Configura opciones (tiempo, fechas, intentos)
6. Guarda como borrador o publica
7. Sistema valida y guarda la evaluación

### **Flujo 2: Estudiante Resuelve Evaluación**
1. Estudiante inicia sesión
2. Ve lista de evaluaciones habilitadas
3. Selecciona una evaluación
4. Sistema verifica:
   - Evaluación está habilitada
   - No ha excedido intentos máximos
   - Está dentro del período de disponibilidad
5. Inicia evaluación (se crea un "Intento")
6. Responde preguntas (se guardan respuestas automáticamente)
7. Finaliza evaluación
8. Sistema califica automáticamente
9. Muestra resultado (si está configurado)

### **Flujo 3: Calificación Automática**
1. Estudiante finaliza evaluación
2. Sistema recorre todas las respuestas
3. Para cada pregunta:
   - Compara respuesta del estudiante con respuesta correcta
   - Asigna puntaje según tipo de pregunta
   - Genera retroalimentación
4. Suma puntajes totales
5. Calcula porcentaje
6. Determina si aprobó (según criterio)
7. Guarda resultado en base de datos
8. Muestra resultado al estudiante

---

## 🛣️ Rutas del Sistema

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Docente (protegido por DocenteGuard)
  { 
    path: 'docente', 
    canActivate: [DocenteGuard],
    children: [
      { path: 'dashboard', component: DocenteDashboardComponent },
      { path: 'evaluaciones', component: ListaEvaluacionesComponent },
      { path: 'evaluaciones/crear', component: CrearEvaluacionComponent },
      { path: 'evaluaciones/:id/editar', component: EditarEvaluacionComponent },
      { path: 'evaluaciones/:id/estadisticas', component: EstadisticasComponent },
    ]
  },
  
  // Estudiante (protegido por EstudianteGuard)
  { 
    path: 'estudiante', 
    canActivate: [EstudianteGuard],
    children: [
      { path: 'dashboard', component: EstudianteDashboardComponent },
      { path: 'evaluaciones', component: EvaluacionesDisponiblesComponent },
      { path: 'evaluaciones/:id/resolver', component: ResolverEvaluacionComponent },
      { path: 'resultados', component: MisResultadosComponent },
      { path: 'resultados/:id', component: DetalleResultadoComponent },
    ]
  },
];
```

---

## 🔧 Servicios Principales

### 1. **AuthService**
- `login(email, password)`
- `logout()`
- `register(usuario)`
- `getCurrentUser()`
- `isDocente()`
- `isEstudiante()`

### 2. **EvaluacionService**
- `crearEvaluacion(evaluacion)`
- `actualizarEvaluacion(id, evaluacion)`
- `eliminarEvaluacion(id)`
- `obtenerEvaluacion(id)`
- `listarEvaluacionesDocente(docenteId)`
- `listarEvaluacionesHabilitadas()` // Para estudiantes

### 3. **PreguntaService**
- `agregarPregunta(evaluacionId, pregunta)`
- `actualizarPregunta(id, pregunta)`
- `eliminarPregunta(id)`
- `obtenerPreguntas(evaluacionId)`

### 4. **IntentoService**
- `iniciarIntento(evaluacionId, estudianteId)`
- `guardarRespuesta(intentoId, respuesta)`
- `finalizarIntento(intentoId)`
- `obtenerIntentos(estudianteId, evaluacionId)`

### 5. **CalificacionService**
- `calificarIntento(intentoId)`
- `calcularPuntaje(respuestas, preguntas)`
- `validarRespuesta(respuesta, pregunta)`

### 6. **ResultadoService**
- `obtenerResultado(intentoId)`
- `listarResultadosEstudiante(estudianteId)`
- `obtenerEstadisticas(evaluacionId)`

---

## 💾 Estrategia de Backend

### **Opción 1: Backend Real (Recomendado)**
- **Framework**: NestJS, Spring Boot, o Express.js
- **Base de Datos**: PostgreSQL o MongoDB
- **Autenticación**: JWT
- **API RESTful** con los siguientes endpoints:

```
# Autenticación
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

# Evaluaciones
GET    /api/evaluaciones
POST   /api/evaluaciones
GET    /api/evaluaciones/:id
PUT    /api/evaluaciones/:id
DELETE /api/evaluaciones/:id

# Preguntas
GET    /api/evaluaciones/:id/preguntas
POST   /api/evaluaciones/:id/preguntas
PUT    /api/preguntas/:id
DELETE /api/preguntas/:id

# Intentos
POST   /api/evaluaciones/:id/iniciar
POST   /api/intentos/:id/responder
POST   /api/intentos/:id/finalizar
GET    /api/intentos/:id

# Resultados
GET    /api/estudiantes/resultados
GET    /api/resultados/:id
GET    /api/evaluaciones/:id/estadisticas
```

### **Opción 2: Mock Backend (Para Desarrollo Rápido)**
- Usar **json-server** o **mirage.js**
- Crear servicios con datos simulados
- Migrar a backend real posteriormente

---

## 📱 Componentes UI Principales

### **Componentes Compartidos**
- `QuestionCardComponent` - Tarjeta para mostrar pregunta
- `QuestionFormComponent` - Formulario para crear/editar pregunta
- `EvaluacionCardComponent` - Tarjeta de evaluación
- `TimerComponent` - Temporizador para evaluaciones
- `ProgressBarComponent` - Barra de progreso
- `ScoreDisplayComponent` - Mostrar puntaje

### **Componentes de Tipos de Pregunta**
- `MultipleChoiceComponent`
- `TrueFalseComponent`
- `ShortAnswerComponent`
- `FillBlankComponent`

---

## 🎨 Tecnologías Recomendadas

### **Frontend**
- ✅ **Angular 21** (ya lo tienes)
- ✅ **Bootstrap 5** (ya lo tienes)
- 🔄 **Angular Material** o **PrimeNG** (para componentes UI avanzados)
- 🔄 **RxJS** (para manejo de estado y eventos)
- 🔄 **Chart.js** o **ApexCharts** (para estadísticas)

### **Backend** (a definir)
- **NestJS** (TypeScript, similar a Angular)
- **Spring Boot** (Java, robusto)
- **Express.js** (Node.js, ligero)

### **Base de Datos**
- **PostgreSQL** (relacional, ideal para este tipo de datos)
- **MongoDB** (NoSQL, flexible)

---

## 📋 Plan de Implementación

### **Fase 1: Preparación (Semana 1)**
1. ✅ Definir arquitectura (este documento)
2. 🔲 Crear estructura de carpetas
3. 🔲 Instalar dependencias necesarias
4. 🔲 Configurar enrutamiento
5. 🔲 Crear modelos/interfaces

### **Fase 2: Módulo de Autenticación (Semana 1-2)**
1. 🔲 Componente de login
2. 🔲 Componente de registro
3. 🔲 AuthService con JWT
4. 🔲 Guards para protección de rutas
5. 🔲 Interceptor para tokens

### **Fase 3: Módulo de Docente (Semana 2-3)**
1. 🔲 Dashboard del docente
2. 🔲 Lista de evaluaciones
3. 🔲 Formulario crear evaluación
4. 🔲 Gestión de preguntas
5. 🔲 Configuración de evaluación

### **Fase 4: Módulo de Estudiante (Semana 3-4)**
1. 🔲 Dashboard del estudiante
2. 🔲 Lista de evaluaciones disponibles
3. 🔲 Interfaz para resolver evaluación
4. 🔲 Temporizador y guardado automático
5. 🔲 Vista de resultados

### **Fase 5: Sistema de Calificación (Semana 4)**
1. 🔲 Motor de corrección automática
2. 🔲 Cálculo de puntajes
3. 🔲 Generación de resultados
4. 🔲 Estadísticas y reportes

### **Fase 6: Pulido y Testing (Semana 5)**
1. 🔲 Testing de componentes
2. 🔲 Testing de servicios
3. 🔲 Validaciones y manejo de errores
4. 🔲 Optimización de rendimiento
5. 🔲 Documentación

---

## 🚀 Próximos Pasos Inmediatos

1. **Revisar y aprobar esta arquitectura**
2. **Decidir estrategia de backend** (real o mock inicial)
3. **Crear estructura de carpetas** según lo propuesto
4. **Instalar dependencias adicionales** si es necesario
5. **Comenzar con la Fase 1** de implementación

---

## 📝 Notas Adicionales

- **Guardado Automático**: Implementar autosave cada 30 segundos durante una evaluación
- **Validaciones**: Implementar validaciones robustas en formularios
- **Responsive**: Asegurar que funcione en móviles y tablets
- **Accesibilidad**: Seguir pautas WCAG para accesibilidad
- **Seguridad**: Validar permisos en cada acción (backend y frontend)

---

## 🤝 Consideraciones de UX

1. **Feedback visual** en cada acción
2. **Confirmaciones** para acciones destructivas
3. **Mensajes claros** de error y éxito
4. **Carga progresiva** para datos grandes
5. **Modo oscuro** (opcional pero recomendado)
6. **Tutorial inicial** para nuevos usuarios
