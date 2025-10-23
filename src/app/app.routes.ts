import { Routes } from '@angular/router';
import { MinijuegosComponent } from './minijuegos/minijuegos';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'minijuegos', component: MinijuegosComponent },
  // Aquí podrás agregar más rutas después:
  // { path: 'contacto', component: ContactoComponent },
  // { path: 'historia', component: HistoriaComponent },
];
