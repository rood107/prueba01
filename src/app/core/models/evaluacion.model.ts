/**
 * Modelo: Evaluación
 * Entidad principal del sistema de evaluaciones
 * 
 * ESTRATEGIA DE ALMACENAMIENTO:
 * - Campos principales: Relacionales (id, titulo, docenteId, etc.)
 * - Configuración: JSON (flexible para diferentes opciones)
 * - Preguntas: Relación separada (ver pregunta.model.ts)
 */

export type EstadoEvaluacion = 'BORRADOR' | 'ACTIVA' | 'FINALIZADA' | 'ARCHIVADA';

export interface Evaluacion {
    id: string;
    titulo: string;
    descripcion: string;

    // Relaciones
    materiaId: string; // Nueva: vincula evaluación con materia
    materiaNombre?: string; // Populated para mostrar en UI
    docenteId: string;
    docenteNombre?: string; // Populated para mostrar en UI

    // Estado
    estado: EstadoEvaluacion;

    // Configuración (almacenada como JSON en BD)
    configuracion: ConfiguracionEvaluacion;

    // Metadata
    fechaCreacion: Date;
    fechaModificacion: Date;

    // Relaciones virtuales (no en BD, se cargan bajo demanda)
    preguntas?: Pregunta[];
    cantidadPreguntas?: number;
}

/**
 * Configuración de Evaluación
 * Este objeto se almacena como JSON en una columna de la BD
 * Permite flexibilidad para agregar nuevas opciones sin cambiar esquema
 */
export interface ConfiguracionEvaluacion {
    // Tiempo
    tiempoLimite?: number; // en minutos, null = sin límite

    // Disponibilidad
    fechaHabilitacion: Date;
    fechaCierre: Date;

    // Intentos
    intentosMaximos: number; // 0 = ilimitados
    permitirReanudar: boolean; // continuar intento interrumpido

    // Calificación
    puntajeTotal: number; // calculado automáticamente al agregar preguntas
    puntajeAprobacion: number; // mínimo para aprobar
    mostrarResultadoInmediato: boolean;
    mostrarRespuestasCorrectas: boolean;

    // Presentación
    mezclarPreguntas: boolean;
    mezclarOpciones: boolean;
    preguntasPorPagina: number; // 0 = todas en una página

    // Restricciones
    requiereContrasena?: boolean;
    contrasena?: string;
    navegacionLibre: boolean; // puede volver a preguntas anteriores

    // Metadata adicional (extensible)
    opciones?: Record<string, any>; // para futuras opciones sin cambiar modelo
}

/**
 * DTO para crear/actualizar evaluación
 */
export interface EvaluacionCrearDto {
    materiaId: string;
    titulo: string;
    descripcion: string;
    configuracion: ConfiguracionEvaluacion;
}

export interface EvaluacionActualizarDto extends Partial<EvaluacionCrearDto> {
    estado?: EstadoEvaluacion;
}

/**
 * Filtros para listar evaluaciones
 */
export interface EvaluacionFiltros {
    materiaId?: string;
    docenteId?: string;
    estado?: EstadoEvaluacion;
    fechaDesde?: Date;
    fechaHasta?: Date;
    busqueda?: string; // búsqueda en título/descripción
}

// Re-export Pregunta aquí para conveniencia
import { Pregunta } from './pregunta.model';
export type { Pregunta };
