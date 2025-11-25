import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-juego1',
  templateUrl: './juego1.html',
  styleUrls: ['./juego1.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Juego1Component implements OnInit, OnDestroy {

  @Output() juegoCerrado = new EventEmitter<void>();

  nivelDeRuido: number = 0;         // Nivel de volumen (0–10 aprox)
  nivelDePeligro: number = 0;       // Barra de peligro 0–100
  vision: number = 0.05;            // Opacidad del pasillo (0.05–1)
  juegoTerminado: boolean = false;  

  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private gameLoopInterval: any;

  private screamerAudio = new Audio('assets/sounds/screamer_grito.mp3');
  private ambienteAudio = new Audio('assets/sounds/ambiente_cueva.mp3');

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iniciarJuego();
  }

  async iniciarJuego() {
    try {
      // Solicitar acceso al micrófono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.audioContext = new AudioContext();
      await this.audioContext.resume();

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;

      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Música ambiente
      this.ambienteAudio.loop = true;
      this.ambienteAudio.play();

      // Loop del juego (cada 100ms)
      this.gameLoopInterval = setInterval(() => {

        if (this.juegoTerminado || !this.analyser) return;

        // ---- DETECCIÓN DE VOLUMEN ----
        this.analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += Math.abs(dataArray[i] - 128);
        }

        this.nivelDeRuido = sum / dataArray.length;

        // ---- LÓGICA DEL JUEGO ----
        this.actualizarLogicaJuego();

        // ---- FORZAR ACTUALIZACIÓN DE LA UI ----
        this.cdr.detectChanges();

      }, 100);

    } catch (err) {
      alert('Debes permitir el micrófono para jugar.');
      this.juegoCerrado.emit();
    }
  }

  actualizarLogicaJuego() {
    const umbralRuido = 2.5;   // Sensibilidad del ruido

    if (this.nivelDeRuido > umbralRuido) {

      // Aumenta el peligro proporcionalmente
      const exceso = this.nivelDeRuido - umbralRuido;
      this.nivelDePeligro += exceso * 3;   // Más agresivo para que se note

      // Mejora visión
      this.vision = Math.min(1, this.nivelDeRuido / 5);

    } else {

      // Reduce peligro lentamente
      this.nivelDePeligro -= 0.7;

      // Reduce visión lentamente
      this.vision -= 0.015;
    }

    // Limitar valores
    this.nivelDePeligro = Math.max(0, Math.min(100, this.nivelDePeligro));
    this.vision = Math.max(0.05, Math.min(1, this.vision));

    // Si llegas al máximo → screamer
    if (this.nivelDePeligro >= 100) {
      this.lanzarScreamer();
    }
  }

  lanzarScreamer() {
    this.juegoTerminado = true;

    this.screamerAudio.play();
    this.ambienteAudio.pause();

    this.limpiarRecursos();

    setTimeout(() => {
      this.juegoCerrado.emit();
    }, 2500);
  }

  limpiarRecursos() {
    clearInterval(this.gameLoopInterval);
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
    this.ambienteAudio.pause();
  }

  ngOnDestroy() {
    this.limpiarRecursos();
  }
}
