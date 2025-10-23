import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Caracteristicas } from './caracteristicas/caracteristicas';
import { Historia } from './historia/historia';
import { Contacto } from './contacto/contacto';
import { MinijuegosComponent } from './minijuegos/minijuegos';

export const routes: Routes = [
  { path: '', component: Inicio }, 
  { path: 'caracteristicas', component: Caracteristicas },
  { path: 'historia', component: Historia },
  { path: 'contacto', component: Contacto },
  { path: 'minijuegos', component: MinijuegosComponent }, 
];
