/**
 * Barrel file para exportar todos los modelos
 * Uso: import { Usuario, Evaluacion, Pregunta } from '@core/models';
 */

// Usuario y autenticación
export * from './usuario.model';

// Estructura académica
export * from './materia.model';

// Evaluación y preguntas
export * from './evaluacion.model';
export * from './pregunta.model';

// Intentos y respuestas
export * from './intento.model';

// Resultados y estadísticas
export * from './resultado.model';
