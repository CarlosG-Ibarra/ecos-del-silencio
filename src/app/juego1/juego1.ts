import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. Importar CommonModule

@Component({
  selector: 'app-juego1',
  templateUrl: './juego1.html',
  styleUrls: ['./juego1.css'],
  standalone: true, // <--- 2. Indicar que es Standalone
  imports: [CommonModule] // <--- 3. Importar CommonModule aquí
})
export class Juego1Component implements OnInit, OnDestroy {
  @Output() juegoCerrado = new EventEmitter<void>();

  nivelDeRuido: number = 0;
  nivelDePeligro: number = 0;
  vision: number = 0.05; // Opacidad inicial (casi ciego)
  juegoTerminado: boolean = false;

  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private gameLoopInterval: any;

  private screamerAudio = new Audio('assets/sounds/screamer_grito.mp3');
  private ambienteAudio = new Audio('assets/sounds/ambiente_cueva.mp3');

  ngOnInit() {
    this.iniciarJuego();
  }

  async iniciarJuego() {
    try {
      // 1. Pedir permiso de micrófono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Configurar Analizador de Audio
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.ambienteAudio.loop = true;
      this.ambienteAudio.play();

      // 3. Iniciar Game Loop
      this.gameLoopInterval = setInterval(() => {
        if (this.juegoTerminado) return;

        // Obtener volumen
        this.analyser?.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((a, b) => a + b, 0);
        this.nivelDeRuido = (sum / dataArray.length) || 0;

        // 4. Lógica del juego
        this.actualizarLogicaJuego();

      }, 100); // Revisar cada 100ms

    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('Necesitas dar permiso al micrófono para jugar.');
      this.juegoCerrado.emit(); // Volver al menú si no hay permiso
    }
  }

  actualizarLogicaJuego() {
    const umbralRuido = 10; // Qué tan sensible es
    
    if (this.nivelDeRuido > umbralRuido) {
      // Si haces ruido, el peligro aumenta RÁPIDO
      let ruidoExceso = (this.nivelDeRuido - umbralRuido);
      this.nivelDePeligro += ruidoExceso / 10; // Ajusta este valor
      // Ganas visión a costa de peligro
      this.vision = Math.min(1, (this.nivelDeRuido / 50)); 
    } else {
      // Si estás callado, el peligro baja LENTO
      this.nivelDePeligro -= 0.2;
      // Pierdes la visión
      this.vision -= 0.01;
    }

    // Mantener valores dentro de los límites
    this.nivelDePeligro = Math.max(0, Math.min(100, this.nivelDePeligro));
    this.vision = Math.max(0.05, Math.min(1, this.vision)); // Mínimo 5% de visión

    // 5. Condición de pérdida
    if (this.nivelDePeligro >= 100) {
      this.lanzarScreamer();
    }
  }

  lanzarScreamer() {
    this.juegoTerminado = true;
    this.screamerAudio.play();
    this.ambienteAudio.pause();
    this.limpiarRecursos(); // Detener todo

    setTimeout(() => {
      this.juegoCerrado.emit(); // Volver al menú después del susto
    }, 2500); // Duración del screamer
  }

  limpiarRecursos() {
    clearInterval(this.gameLoopInterval);
    this.mediaStream?.getTracks().forEach(track => track.stop()); // Apagar micrófono
    this.audioContext?.close();
    this.ambienteAudio.pause();
  }

  ngOnDestroy() {
    // IMPORTANTE: Limpiar todo al salir del componente
    this.limpiarRecursos();
  }
}