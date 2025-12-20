/**
 * Modelo: Usuario
 * Representa tanto a Docentes como a Estudiantes
 */

export type RolUsuario = 'DOCENTE' | 'ESTUDIANTE' | 'ADMIN';

export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: RolUsuario;
    activo: boolean;
    fechaCreacion: Date;
    ultimoAcceso?: Date;
}

export interface UsuarioCrearDto {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: RolUsuario;
}

export interface UsuarioLoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    usuario: Usuario;
    token: string;
    expiresIn: number;
}
