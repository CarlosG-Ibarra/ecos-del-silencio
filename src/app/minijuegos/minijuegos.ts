import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Juego1Component } from '../juego1/juego1';
import { Juego2Component } from '../juego2/juego2';
import { Juego3Component } from '../juego3/juego3';

@Component({
  selector: 'app-minijuegos',
  standalone: true,
  imports: [CommonModule,  Juego1Component, Juego2Component, Juego3Component],
  templateUrl: './minijuegos.html',
  styleUrls: ['./minijuegos.css']
})
export class MinijuegosComponent {
  juegos = [
    { id: 1, nombre: 'Juego 1', descripcion: 'Haz click para jugar' },
    { id: 2, nombre: 'Juego 2', descripcion: 'Haz click para jugar' },
    { id: 3, nombre: 'Juego 3', descripcion: 'Haz click para jugar' }
  ];

  seleccionado: number | null = null;

  seleccionarJuego(id: number) {
    this.seleccionado = this.seleccionado === id ? null : id;
  }
}
