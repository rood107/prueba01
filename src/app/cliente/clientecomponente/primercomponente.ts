import { Component, NgModule, OnInit } from '@angular/core';
import { ClienteModelTs } from '../model/cliente.model';
import { ClienteServiceTs } from '../service/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primercomponente',
  standalone: true,
  templateUrl: './primercomponente.html',
  styleUrls: ['./primercomponente.css'],
  imports: [FormsModule,CommonModule]
})
export class Primercomponente implements OnInit {
  public clientes:ClienteModelTs[]=[];
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

  constructor(private clienteService: ClienteServiceTs) { }

  ngOnInit(){
    this.loadClientes();
  }
  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log(data);
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los clientes';
        this.loading = false;
      }
    });
  }
  // Create: Crear un nuevo cliente
  create(): void {
    console.log(this.nuevoCliente);
    this.clienteService.create(this.nuevoCliente).subscribe({
      next: (cliente) => {
        this.clientes = [...this.clientes, cliente];
        this.nuevoCliente = { nombre: '', email: '', telefono: '', documentoIdentidad: '' };  // Limpiar formulario
        alert('Cliente creado exitosamente');
      },
      error: (err) => alert('Error al crear cliente: ' + err.message)
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
      this.clienteService.update(cliente.id, cliente).subscribe({
        next: () => {
          const index = this.clientes.findIndex(c => c.id === cliente.id);
          if (index !== -1) this.clientes[index] = cliente;
          alert('Cliente actualizado exitosamente');
        },
        error: (err) => alert('Error al actualizar cliente: ' + err.message)
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
