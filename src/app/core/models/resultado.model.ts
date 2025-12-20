/**
 * Modelo: Resultado de Evaluación
 * Representa el resultado final de un intento completado
 */

export interface Resultado {
    id: string;

    // Relaciones
    intentoId: string;
    evaluacionId: string;
    estudianteId: string;

    // Información del estudiante
    estudianteNombre: string;
    estudianteEmail: string;

    // Información de la evaluación
    evaluacionTitulo: string;
    numeroIntento: number;

    // Calificación
    puntajeObtenido: number;
    puntajeTotal: number;
    porcentaje: number;
    aprobado: boolean;
    calificacionLetra?: string; // A, B, C, D, F (opcional)

    // Estadísticas
    preguntasCorrectas: number;
    preguntasIncorrectas: number;
    preguntasSinResponder: number;
    totalPreguntas: number;

    // Tiempos
    tiempoEmpleado: number; // en segundos
    tiempoDisponible?: number; // en segundos (si había límite)
    fechaFinalizacion: Date;

    // Detalle de respuestas
    detalleRespuestas: DetalleRespuesta[];

    // Análisis por dificultad/categoría
    analisis?: AnalisisResultado;

    // Feedback general
    feedbackGeneral?: string;
    comentarioDocente?: string;

    // Metadata
    fechaGeneracion: Date;
}

/**
 * Detalle de cada respuesta
 */
export interface DetalleRespuesta {
    preguntaId: string;
    preguntaTipo: string;
    enunciado: string;
    orden: number;

    // Respuestas
    respuestaEstudiante: any; // tipo varía según tipo de pregunta
    respuestaCorrecta: any;

    // Calificación
    esCorrecta: boolean;
    puntajeObtenido: number;
    puntajeMaximo: number;

    // Feedback
    retroalimentacion?: string;
    explicacion?: string;

    // Metadata
    tiempoEmpleado?: number;
    dificultad?: string;
    tags?: string[];
}

/**
 * Análisis estadístico del resultado
 */
export interface AnalisisResultado {
    porDificultad: {
        facil: EstadisticaDificultad;
        media: EstadisticaDificultad;
        dificil: EstadisticaDificultad;
    };
    porCategoria?: { [tag: string]: EstadisticaCategoria };
    tiempoPromedioPorPregunta: number; // segundos
}

export interface EstadisticaDificultad {
    total: number;
    correctas: number;
    incorrectas: number;
    porcentajeAcierto: number;
}

export interface EstadisticaCategoria {
    tag: string;
    total: number;
    correctas: number;
    porcentajeAcierto: number;
}

/**
 * Estadísticas de evaluación (vista del docente)
 */
export interface EstadisticasEvaluacion {
    evaluacionId: string;
    evaluacionTitulo: string;

    // Participación
    totalEstudiantes: number;
    estudiantesCompletaron: number;
    estudiantesEnProgreso: number;
    estudiantesNoIniciaron: number;

    // Calificaciones
    promedioGeneral: number;
    mediaGeneral: number;
    notaMaxima: number;
    notaMinima: number;
    desviacionEstandar: number;

    // Distribución
    distribucionNotas: {
        rango: string; // "0-20", "21-40", etc.
        cantidad: number;
    }[];

    // Por pregunta
    estadisticasPorPregunta: EstadisticaPregunta[];

    // Tiempos
    tiempoPromedioCompletado: number; // segundos
    tiempoMinimo: number;
    tiempoMaximo: number;

    // Top/Bottom estudiantes
    mejoresResultados: ResultadoResumen[];
    peoresResultados: ResultadoResumen[];

    // Fecha de generación
    fechaGeneracion: Date;
}

export interface EstadisticaPregunta {
    preguntaId: string;
    enunciado: string;
    tipo: string;
    orden: number;

    // Estadísticas
    totalRespuestas: number;
    respuestasCorrectas: number;
    respuestasIncorrectas: number;
    porcentajeAcierto: number;

    // Dificultad real vs esperada
    dificultadEsperada?: string;
    dificultadReal: 'FACIL' | 'MEDIA' | 'DIFICIL'; // basado en % acierto

    // Tiempo
    tiempoPromedioRespuesta: number;

    // Distribución de respuestas (para multiple choice)
    distribucionOpciones?: {
        opcionId: string;
        texto: string;
        vecesSeleccionada: number;
        porcentaje: number;
        esCorrecta: boolean;
    }[];
}

export interface ResultadoResumen {
    estudianteId: string;
    estudianteNombre: string;
    puntajeObtenido: number;
    porcentaje: number;
    fechaFinalizacion: Date;
}

/**
 * Comparación entre intentos (si hay múltiples)
 */
export interface ComparacionIntentos {
    estudianteId: string;
    evaluacionId: string;
    intentos: {
        numero: number;
        fecha: Date;
        puntaje: number;
        porcentaje: number;
        mejora?: number; // % de mejora respecto al intento anterior
    }[];
    mejorIntento: number;
    peorIntento: number;
    tendencia: 'MEJORANDO' | 'EMPEORANDO' | 'ESTABLE';
}

/**
 * DTOs
 */
export interface ResultadoFiltros {
    evaluacionId?: string;
    estudianteId?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    aprobadoSolamente?: boolean;
    ordenarPor?: 'fecha' | 'puntaje' | 'estudiante';
    orden?: 'asc' | 'desc';
}

export interface ExportarResultadosDto {
    evaluacionId: string;
    formato: 'CSV' | 'EXCEL' | 'PDF';
    incluirDetalles: boolean;
    incluirEstadisticas: boolean;
}
