/**
 * Modelo: Intento de Evaluación
 * Representa un intento de un estudiante de resolver una evaluación
 */

export type EstadoIntento =
    | 'EN_PROGRESO'   // Estudiante está resolviendo
    | 'PAUSADO'       // Guardado temporalmente
    | 'COMPLETADO'    // Finalizado y calificado
    | 'ABANDONADO'    // Tiempo agotado o abandonado
    | 'CALIFICANDO';  // En proceso de calificación manual

export interface Intento {
    id: string;

    // Relaciones
    evaluacionId: string;
    estudianteId: string;

    // Información de la evaluación (snapshot al momento del intento)
    evaluacionTitulo: string;
    configuracionSnapshot: any; // copia de la configuración

    // Estado
    estado: EstadoIntento;
    numeroIntento: number; // 1, 2, 3... (si permite múltiples intentos)

    // Tiempos
    fechaInicio: Date;
    fechaFinalizacion?: Date;
    tiempoTranscurrido: number; // en segundos
    tiempoRestante?: number; // en segundos (si hay límite)

    // Respuestas
    respuestas: Respuesta[];
    progreso: number; // porcentaje de preguntas respondidas (0-100)

    // Calificación
    puntajeObtenido?: number;
    puntajeTotal: number;
    porcentaje?: number;
    aprobado?: boolean;

    // Metadata
    ipAddress?: string;
    userAgent?: string;
    ultimaActividad: Date; // para detectar inactividad
}

/**
 * Modelo: Respuesta individual
 * Representa la respuesta a una pregunta específica
 */
export interface Respuesta {
    id: string;
    intentoId: string;
    preguntaId: string;

    // Respuesta del estudiante (tipo varía según tipo de pregunta)
    respuestaEstudiante: RespuestaEstudiante;

    // Calificación
    esCorrecta?: boolean;
    puntajeObtenido?: number;
    puntajeMaximo: number;

    // Feedback
    retroalimentacion?: string;

    // Tiempos
    fechaRespuesta: Date;
    tiempoEmpleado?: number; // segundos en esta pregunta

    // Flags
    marcadaParaRevisar: boolean; // estudiante la marcó para revisar después
}

/**
 * Tipos de respuestas según tipo de pregunta
 */
export type RespuestaEstudiante =
    | RespuestaMultipleChoice
    | RespuestaMultipleResponse
    | RespuestaTrueFalse
    | RespuestaShortAnswer
    | RespuestaEssay
    | RespuestaFillBlank
    | RespuestaMatching;

export interface RespuestaMultipleChoice {
    tipo: 'MULTIPLE_CHOICE';
    opcionSeleccionada: string; // id de la opción
    otraRespuesta?: string; // si seleccionó "Otra"
}

export interface RespuestaMultipleResponse {
    tipo: 'MULTIPLE_RESPONSE';
    opcionesSeleccionadas: string[]; // array de ids
}

export interface RespuestaTrueFalse {
    tipo: 'TRUE_FALSE';
    respuesta: boolean;
}

export interface RespuestaShortAnswer {
    tipo: 'SHORT_ANSWER';
    respuesta: string;
}

export interface RespuestaEssay {
    tipo: 'ESSAY';
    respuesta: string;
}

export interface RespuestaFillBlank {
    tipo: 'FILL_BLANK';
    respuestas: { [posicion: number]: string }; // {0: "París", 1: "2.2 millones"}
}

export interface RespuestaMatching {
    tipo: 'MATCHING';
    emparejamientos: { [itemIzquierdaId: string]: string }; // {id1: idA, id2: idB}
}

/**
 * DTOs
 */
export interface IntentoIniciarDto {
    evaluacionId: string;
    contrasena?: string; // si la evaluación requiere contraseña
}

export interface RespuestaGuardarDto {
    preguntaId: string;
    respuestaEstudiante: RespuestaEstudiante;
    marcadaParaRevisar?: boolean;
}

export interface IntentoFinalizarDto {
    forzar?: boolean; // true si se fuerza finalizar (tiempo agotado)
}

/**
 * Resumen de intento para listados
 */
export interface IntentoResumen {
    id: string;
    evaluacionTitulo: string;
    numeroIntento: number;
    estado: EstadoIntento;
    fechaInicio: Date;
    fechaFinalizacion?: Date;
    puntajeObtenido?: number;
    puntajeTotal: number;
    porcentaje?: number;
    aprobado?: boolean;
}
