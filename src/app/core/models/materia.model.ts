/**
 * Modelo: Materia/Asignatura
 * Representa las materias o cursos del sistema
 */

export interface Materia {
    id: string;
    codigo: string; // Ej: "ARQ-SOFT-2024"
    nombre: string;
    descripcion: string;

    // Información académica
    nivel?: string; // Ej: "1er Año", "2do Semestre", etc.
    creditos?: number;
    departamento?: string;

    // Estado
    activa: boolean;

    // Periodo académico
    periodoAcademico: string; // Ej: "2024-1", "Primer Semestre 2024"
    fechaInicio: Date;
    fechaFin: Date;

    // Metadata
    fechaCreacion: Date;
    fechaModificacion: Date;
}

/**
 * Asignación de Docente a Materia
 */
export interface DocenteMateria {
    id: string;
    materiaId: string;
    docenteId: string;

    // Información de la materia (populated)
    materiaNombre?: string;
    materiaCodigo?: string;

    // Información del docente (populated)
    docenteNombre?: string;
    docenteEmail?: string;

    // Rol del docente en la materia
    rol: RolDocente; // TITULAR, AUXILIAR, AYUDANTE

    // Estado
    activo: boolean;

    // Fechas
    fechaAsignacion: Date;
}

export type RolDocente = 'TITULAR' | 'AUXILIAR' | 'AYUDANTE';

/**
 * Inscripción de Estudiante a Materia
 */
export interface Inscripcion {
    id: string;
    materiaId: string;
    estudianteId: string;

    // Información de la materia (populated)
    materiaNombre?: string;
    materiaCodigo?: string;

    // Información del estudiante (populated)
    estudianteNombre?: string;
    estudianteEmail?: string;

    // Estado de inscripción
    estado: EstadoInscripcion;

    // Notas/Calificaciones
    notaFinal?: number;
    aprobado?: boolean;

    // Fechas
    fechaInscripcion: Date;
    fechaBaja?: Date;
}

export type EstadoInscripcion =
    | 'ACTIVA'       // Estudiante cursando
    | 'APROBADA'     // Completó y aprobó
    | 'REPROBADA'    // Completó pero no aprobó
    | 'RETIRADA'     // Se dio de baja
    | 'PENDIENTE';   // Inscripción pendiente de aprobación

/**
 * DTOs
 */
export interface MateriaCrearDto {
    codigo: string;
    nombre: string;
    descripcion: string;
    nivel?: string;
    creditos?: number;
    departamento?: string;
    periodoAcademico: string;
    fechaInicio: Date;
    fechaFin: Date;
}

export interface MateriaActualizarDto extends Partial<MateriaCrearDto> {
    activa?: boolean;
}

export interface DocenteMateriaAsignarDto {
    materiaId: string;
    docenteId: string;
    rol: RolDocente;
}

export interface InscripcionCrearDto {
    materiaId: string;
    estudianteId: string;
}

export interface InscripcionActualizarDto {
    estado?: EstadoInscripcion;
    notaFinal?: number;
}

/**
 * Vistas y resúmenes
 */
export interface MateriaResumen {
    id: string;
    codigo: string;
    nombre: string;
    periodoAcademico: string;
    docentesPrincipales: string[]; // nombres de docentes titulares
    totalEstudiantes: number;
    totalEvaluaciones: number;
    activa: boolean;
}

export interface MateriaDetalle extends Materia {
    docentes: DocenteMateria[];
    estudiantes: Inscripcion[];
    cantidadEstudiantes: number;
    cantidadDocentes: number;
    cantidadEvaluaciones: number;
}

/**
 * Filtros
 */
export interface MateriaFiltros {
    periodoAcademico?: string;
    docenteId?: string;
    estudianteId?: string;
    activa?: boolean;
    busqueda?: string; // buscar en nombre o código
}
