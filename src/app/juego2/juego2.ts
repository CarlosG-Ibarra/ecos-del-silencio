import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. Importar CommonModule

type EstadoJuego = 'descansando' | 'cazando' | 'terminado';

@Component({
  selector: 'app-juego2',
  templateUrl: './juego2.html',
  styleUrls: ['./juego2.css'],
  standalone: true, // <--- 2. Indicar que es Standalone
  imports: [CommonModule] // <--- 3. Importar CommonModule aquí
})
export class Juego2Component implements OnInit, OnDestroy {
  @Output() juegoCerrado = new EventEmitter<void>();

  estado: EstadoJuego = 'descansando';
  juegoTerminado: boolean = false;
  tiempoRestante: number = 5; // Tiempo en segundos para cada estado

  private gameInterval: any;
  private screamerAudio = new Audio('assets/sounds/screamer_monstruo.mp3');
  private audioDescanso = new Audio('assets/sounds/safe_music_box.mp3');
  private audioCaza = new Audio('assets/sounds/tense_violin.mp3');

  // Escuchar movimientos del mouse en TODO el componente
  @HostListener('mousemove')
  onMouseMove() {
    if (this.estado === 'cazando' && !this.juegoTerminado) {
      this.lanzarScreamer();
    }
  }

  ngOnInit() {
    this.audioDescanso.loop = true;
    this.audioCaza.loop = true;
    this.iniciarEstado('descansando');
  }

  iniciarEstado(nuevoEstado: 'descansando' | 'cazando') {
    this.estado = nuevoEstado;
    // Tiempo aleatorio para el estado (entre 3 y 7 segundos)
    this.tiempoRestante = Math.floor(Math.random() * 5) + 3; 

    if (nuevoEstado === 'descansando') {
      this.audioCaza.pause();
      this.audioDescanso.play();
    } else {
      this.audioDescanso.pause();
      this.audioCaza.play();
    }

    // Iniciar contador
    this.gameInterval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.gameInterval);
        // Cambiar al otro estado
        this.iniciarEstado(this.estado === 'descansando' ? 'cazando' : 'descansando');
      }
    }, 1000);
  }

  lanzarScreamer() {
    this.juegoTerminado = true;
    this.estado = 'terminado';
    this.limpiarRecursos();
    this.screamerAudio.play();

    setTimeout(() => {
      this.juegoCerrado.emit(); // Volver al menú
    }, 2500);
  }

  limpiarRecursos() {
    clearInterval(this.gameInterval);
    this.audioCaza.pause();
    this.audioDescanso.pause();
  }

  ngOnDestroy() {
    this.limpiarRecursos();
  }
}