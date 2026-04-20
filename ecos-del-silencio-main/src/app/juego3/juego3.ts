import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. Importar CommonModule

@Component({
  selector: 'app-juego3',
  templateUrl: './juego3.html',
  styleUrls: ['./juego3.css'],
  standalone: true, // <--- 2. Indicar que es Standalone
  imports: [CommonModule] // <--- 3. Importar CommonModule aquí
})
export class Juego3Component implements OnInit, OnDestroy {
  @Output() juegoCerrado = new EventEmitter<void>();

  vidas: number = 3;
  ronda: number = 1;
  juegoTerminado: boolean = false;
  mostrandoAnomalia: boolean = false;
  mensajeFeedback: string = "Observa con atención...";
  
  private gameTimeout: any;
  private screamerAudio = new Audio('assets/sounds/screamer_fantasma.mp3');
  private audioAmbiente = new Audio('assets/sounds/ambiente_estatica.mp3');
  private audioError = new Audio('assets/sounds/sonido_error.mp3');
  private audioAcierto = new Audio('assets/sounds/sonido_acierto.mp3');

  ngOnInit() {
    this.audioAmbiente.loop = true;
    this.audioAmbiente.volume = 0.5;
    this.audioAmbiente.play();
    this.iniciarRonda();
  }

  iniciarRonda() {
    if (this.juegoTerminado) return;

    this.mensajeFeedback = `Ronda ${this.ronda}. Observa...`;
    // 50% de probabilidad de que haya una anomalía
    this.mostrandoAnomalia = Math.random() > 0.5;
    
    // La ronda dura X segundos (se acorta con las rondas)
    const duracionRonda = Math.max(3000, 10000 - (this.ronda * 200)); // Más rápido cada ronda

    // Si no reporta a tiempo, se evalúa
    this.gameTimeout = setTimeout(() => {
      this.evaluarRonda(false); // false = no reportó
    }, duracionRonda);
  }

  // El jugador hace clic en el botón "Reportar"
  reportarAnomalia() {
    clearTimeout(this.gameTimeout); // Detener el temporizador de la ronda
    this.evaluarRonda(true); // true = sí reportó
  }

  evaluarRonda(reportado: boolean) {
    if (reportado && this.mostrandoAnomalia) {
      // ACIERTO: Reportó y sí había
      this.audioAcierto.play();
      this.ronda++;
      this.mensajeFeedback = "Bien... Siguiente cuarto.";
      this.mostrandoAnomalia = false; // Ocultar antes de la siguiente
      setTimeout(() => this.iniciarRonda(), 1500);

    } else if (reportado && !this.mostrandoAnomalia) {
      // ERROR: Reportó y no había nada
      this.audioError.play();
      this.vidas--;
      this.mensajeFeedback = "Ahí no había nada. Te estás poniendo nervioso.";
      setTimeout(() => this.iniciarRonda(), 1500);

    } else if (!reportado && this.mostrandoAnomalia) {
      // ERROR: No reportó y sí había (se le pasó)
      this.audioError.play();
      this.vidas--;
      this.mensajeFeedback = "Se te pasó... Te está observando.";
      setTimeout(() => this.iniciarRonda(), 1500);

    } else if (!reportado && !this.mostrandoAnomalia) {
      // OK: No reportó y no había nada
      this.ronda++;
      this.mensajeFeedback = "Correcto. El cuarto está limpio. Siguiente...";
      setTimeout(() => this.iniciarRonda(), 1500);
    }

    // Chequear si perdió
    if (this.vidas <= 0 && !this.juegoTerminado) {
      this.lanzarScreamer();
    }
  }

  lanzarScreamer() {
    this.juegoTerminado = true;
    this.limpiarRecursos();
    this.screamerAudio.play();

    setTimeout(() => {
      this.juegoCerrado.emit(); // Volver al menú
    }, 2500);
  }

  limpiarRecursos() {
    clearTimeout(this.gameTimeout);
    this.audioAmbiente.pause();
  }

  ngOnDestroy() {
    this.limpiarRecursos();
  }
}