import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  isRegisterMode = false;

  constructor(private auth: Auth) {}

  toggleMode(event: Event) {
    event.preventDefault();
    this.isRegisterMode = !this.isRegisterMode;
  }

  async onSubmit() {
    try {
      if (this.isRegisterMode) {
        await createUserWithEmailAndPassword(this.auth, this.email, this.password);
        alert('Cuenta creada con éxito 🎉');
      } else {
        await signInWithEmailAndPassword(this.auth, this.email, this.password);
        alert('Inicio de sesión exitoso ✅');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      alert('Inicio de sesión con Google exitoso 🔥');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }
}
