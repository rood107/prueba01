import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteModelTs } from '../model/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteServiceTs {
  private apiUrl = 'http://localhost:8080/api/clientes'; // Ajusta tu URL

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los clientes
  getAll(): Observable<ClienteModelTs[]> {
    return this.http.get<ClienteModelTs[]>(this.apiUrl);
  }

  // GET - Obtener cliente por ID
  getById(id: number): Observable<ClienteModelTs> {
    return this.http.get<ClienteModelTs>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nuevo cliente
  create(cliente: ClienteModelTs): Observable<ClienteModelTs> {
    return this.http.post<ClienteModelTs>(this.apiUrl, cliente);
  }

  // PUT - Actualizar cliente completo
  update(id: number, cliente: ClienteModelTs): Observable<ClienteModelTs> {
    return this.http.put<ClienteModelTs>(`${this.apiUrl}/${id}`, cliente);
  }

  // PATCH - Actualizar parcialmente (opcional)
  partialUpdate(id: number, cliente: ClienteModelTs): Observable<ClienteModelTs> {
    return this.http.patch<ClienteModelTs>(`${this.apiUrl}/${id}`, cliente);
  }

  // DELETE - Eliminar cliente
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET - Buscar por documento de identidad
  getByDocumento(documento: string): Observable<ClienteModelTs> {
    return this.http.get<ClienteModelTs>(`${this.apiUrl}/documento/${documento}`);
  }

  // GET - Buscar por email
  getByEmail(email: string): Observable<ClienteModelTs> {
    return this.http.get<ClienteModelTs>(`${this.apiUrl}/email/${email}`);
  }

}
