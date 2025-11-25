import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. Importar CommonModule
import { Juego1Component } from '../juego1/juego1'; // <--- 2. Importar Juego1
import { Juego2Component } from '../juego2/juego2'; // <--- 3. Importar Juego2
import { Juego3Component } from '../juego3/juego3'; // <--- 4. Importar Juego3

@Component({
  selector: 'app-minijuegos',
  templateUrl: './minijuegos.html',
  styleUrls: ['./minijuegos.css'],
  standalone: true, // <--- 5. Indicar que es Standalone
  imports: [
    CommonModule,     // <--- 6. Añadir CommonModule (para *ngIf, [ngSwitch])
    Juego1Component,  // <--- 7. Añadir Juego1Component (para <app-juego1>)
    Juego2Component,  // <--- 8. Añadir Juego2Component (para <app-juego2>)
    Juego3Component   // <--- 9. Añadir Juego3Component (para <app-juego3>)
  ]
})
export class MinijuegosComponent {

  juegoActivo: 'juego1' | 'juego2' | 'juego3' | null = null;
  
  // Audio para el menú, opcional
  private menuAudio = new Audio('assets/sounds/Theme.mp3');

  constructor() {
    // Para que el ambiente suene en loop
    this.menuAudio.loop = true;
    this.menuAudio.volume = 0.3;
  }

  seleccionarJuego(juego: 'juego1' | 'juego2' | 'juego3') {
    if (this.juegoActivo === juego) {
      // Si se hace clic en el juego activo, se cierra
      this.juegoActivo = null;
      this.menuAudio.play().catch(e => console.log("Audio no pudo iniciarse"));
    } else {
      // Si se selecciona uno nuevo, se activa
      this.juegoActivo = juego;
      this.menuAudio.pause(); // Pausamos el ambiente del menú
    }
  }

  // Si los componentes hijos emiten un evento de 'juegoCerrado', volvemos al menú
  onJuegoCerrado() {
    this.juegoActivo = null;
    this.menuAudio.play().catch(e => console.log("Audio no pudo iniciarse"));
  }
}