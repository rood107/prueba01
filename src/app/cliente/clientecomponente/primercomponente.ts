import { Component, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClienteModelTs } from '../model/cliente.model';
import { ClienteServiceTs } from '../service/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primercomponente',
  standalone: true,
  templateUrl: './primercomponente.html',
  styleUrls: ['./primercomponente.css'],
  imports: [FormsModule, CommonModule]
})
export class Primercomponente implements OnInit {
  public clientes: ClienteModelTs[] = [];
  searchId: number = 0;
  clienteSeleccionado: ClienteModelTs | null = null;
  nuevoCliente: ClienteModelTs = {
    nombre: '',
    email: '',
    telefono: '',
    documentoIdentidad: ''
  };
  loading = false;
  error: string | null = null;
  saving = false;

  constructor(
    private clienteService: ClienteServiceTs,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadClientes();
  }
  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('Clientes cargados:', data);
        this.loading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (error) => {
        this.error = 'Error al cargar los clientes';
        this.loading = false;
      }
    });
  }
  // Create: Crear un nuevo cliente
  create(): void {
    this.saving = true;
    console.log('Creando cliente:', this.nuevoCliente);

    this.clienteService.create(this.nuevoCliente).subscribe({
      next: (cliente) => {
        console.log('Cliente creado:', cliente);
        // Actualización inmutable para forzar detección de cambios
        this.clientes = [...this.clientes, cliente];
        this.nuevoCliente = { nombre: '', email: '', telefono: '', documentoIdentidad: '' };
        this.saving = false;
        console.log('Lista actualizada. Total clientes:', this.clientes.length);
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        alert('Error al crear cliente: ' + err.message);
        this.saving = false;
      }
    });
  }
  // findById: Buscar cliente por ID
  findById(id: number): void {
    this.clienteService.getById(id).subscribe({
      next: (cliente) => this.clienteSeleccionado = cliente,
      error: (err) => alert('Cliente no encontrado: ' + err.message)
    });
  }
  // Update: Actualizar un cliente existente
  update(cliente: ClienteModelTs): void {
    if (cliente.id) {
      this.saving = true;
      this.clienteService.update(cliente.id, cliente).subscribe({
        next: () => {
          // Actualización inmutable
          this.clientes = this.clientes.map(c =>
            c.id === cliente.id ? cliente : c
          );
          this.clienteSeleccionado = null;
          this.saving = false;
          console.log('Cliente actualizado exitosamente');
          this.cdr.detectChanges(); // Forzar detección de cambios
        },
        error: (err) => {
          alert('Error al actualizar cliente: ' + err.message);
          this.saving = false;
        }
      });
    }
  }
  // Delete: Eliminar un cliente por ID
  delete(id: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== id);
          alert('Cliente eliminado exitosamente');
        },
        error: (err) => alert('Error al eliminar cliente: ' + err.message)
      });
    }
  }

}
