import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
    // Menú de navegación
  menuItems = [
    { label: 'Cliente', path: '/home', icon: '🏠' },
    { label: 'Habitación', path: '/Habitacion', icon: '🏛️' },
    { label: 'Frontend', path: '/frontend', icon: '🎨' },
    { label: 'Backend', path: '/backend', icon: '⚙️' },
    { label: 'Proyectos', path: '/projects', icon: '📁' },
    { label: 'Recursos', path: '/resources', icon: '📚' },
    { label: 'Contacto', path: '/contact', icon: '✉️' }
  ];

  // Estado del menú móvil
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  // Navegar a una ruta
  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  // Alternar menú móvil
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('📱 Menú móvil:', this.isMobileMenuOpen ? 'Abierto' : 'Cerrado');
  }

  // Cerrar menú móvil
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  // Verificar si la ruta está activa
  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
