import { Routes } from '@angular/router';
import { Primercomponente } from './cliente/clientecomponente/primercomponente';
import { HabitacionComponent } from './habitacion.component/habitacion.component';

export const routes: Routes = [
  { path: 'home', component: Primercomponente },
  { path: 'Habitacion', component: HabitacionComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
