/**
 * Modelo: Pregunta
 * Representa las diferentes tipos de preguntas en una evaluación
 * 
 * ESTRATEGIA DE ALMACENAMIENTO:
 * - Campos principales: Relacionales (id, tipo, enunciado, puntaje)
 * - Contenido específico del tipo: JSON (opciones, validaciones, etc.)
 */

export type TipoPregunta =
    | 'MULTIPLE_CHOICE'    // Opción múltiple (solo una correcta)
    | 'MULTIPLE_RESPONSE'  // Múltiple respuesta (varias correctas)
    | 'TRUE_FALSE'         // Verdadero/Falso
    | 'SHORT_ANSWER'       // Respuesta corta
    | 'ESSAY'              // Respuesta larga/ensayo
    | 'FILL_BLANK'         // Completar espacios
    | 'MATCHING';          // Emparejar/relacionar

export interface Pregunta {
    id: string;
    evaluacionId: string;

    // Información básica
    tipo: TipoPregunta;
    enunciado: string;
    orden: number; // orden de presentación
    puntaje: number;
    requerida: boolean;

    // Contenido específico del tipo (almacenado como JSON)
    contenido: ContenidoPregunta;

    // Feedback
    retroalimentacion?: string; // mostrar después de responder
    ayuda?: string; // hint disponible durante la evaluación

    // Metadata
    tags?: string[]; // para categorización
    dificultad?: 'FACIL' | 'MEDIA' | 'DIFICIL';

    fechaCreacion: Date;
    fechaModificacion: Date;
}

/**
 * Contenido de Pregunta (polimórfico según tipo)
 * Este objeto se almacena como JSON en la BD
 */
export type ContenidoPregunta =
    | ContenidoMultipleChoice
    | ContenidoMultipleResponse
    | ContenidoTrueFalse
    | ContenidoShortAnswer
    | ContenidoEssay
    | ContenidoFillBlank
    | ContenidoMatching;

/**
 * OPCIÓN MÚLTIPLE (solo una correcta)
 */
export interface ContenidoMultipleChoice {
    tipo: 'MULTIPLE_CHOICE';
    opciones: OpcionPregunta[];
    permitirOtraRespuesta?: boolean; // opción "Otra: _____"
}

/**
 * MÚLTIPLE RESPUESTA (varias correctas)
 */
export interface ContenidoMultipleResponse {
    tipo: 'MULTIPLE_RESPONSE';
    opciones: OpcionPregunta[];
    minimoSelecciones?: number;
    maximoSelecciones?: number;
}

export interface OpcionPregunta {
    id: string;
    texto: string;
    esCorrecta: boolean;
    retroalimentacion?: string; // feedback específico para esta opción
    orden: number;
}

/**
 * VERDADERO/FALSO
 */
export interface ContenidoTrueFalse {
    tipo: 'TRUE_FALSE';
    respuestaCorrecta: boolean;
}

/**
 * RESPUESTA CORTA
 */
export interface ContenidoShortAnswer {
    tipo: 'SHORT_ANSWER';
    respuestasCorrectas: string[]; // puede haber múltiples respuestas válidas
    caseSensitive: boolean;
    ignorarEspacios: boolean;
    longitudMaxima?: number;
    validacionRegex?: string; // para validaciones avanzadas
}

/**
 * ENSAYO/RESPUESTA LARGA
 */
export interface ContenidoEssay {
    tipo: 'ESSAY';
    longitudMinima?: number;
    longitudMaxima?: number;
    criteriosEvaluacion?: string[]; // rúbrica para calificación manual
    calificacionManual: boolean; // requiere revisión del docente
}

/**
 * COMPLETAR ESPACIOS
 */
export interface ContenidoFillBlank {
    tipo: 'FILL_BLANK';
    plantilla: string; // Ej: "La capital de Francia es {0} y tiene {1} habitantes"
    blancos: BlancoRespuesta[];
}

export interface BlancoRespuesta {
    id: string;
    posicion: number; // índice del blanco {0}, {1}, etc.
    respuestasCorrectas: string[];
    caseSensitive: boolean;
}

/**
 * EMPAREJAR/RELACIONAR
 */
export interface ContenidoMatching {
    tipo: 'MATCHING';
    columnaIzquierda: ItemMatching[];
    columnaDerecha: ItemMatching[];
    permitirReutilizar: boolean; // un item derecho puede usarse múltiples veces
}

export interface ItemMatching {
    id: string;
    texto: string;
    pareja?: string; // id del item correspondiente
    orden: number;
}

/**
 * DTOs para crear/actualizar preguntas
 */
export interface PreguntaCrearDto {
    tipo: TipoPregunta;
    enunciado: string;
    puntaje: number;
    contenido: ContenidoPregunta;
    retroalimentacion?: string;
    ayuda?: string;
    tags?: string[];
    dificultad?: 'FACIL' | 'MEDIA' | 'DIFICIL';
}

export interface PreguntaActualizarDto extends Partial<PreguntaCrearDto> {
    orden?: number;
}

/**
 * Helper Types
 */
export interface PreguntaConRespuesta extends Pregunta {
    respuestaEstudiante?: any; // tipo depende del tipo de pregunta
}
