import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngClass

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule], // Importamos CommonModule aquí
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  // Propiedad para guardar el idioma activo. Por defecto 'es'.
  activeLang: 'es' | 'en' = 'es';

  // Método para cambiar el idioma al hacer clic
  setLanguage(lang: 'es' | 'en') {
    this.activeLang = lang;
    // Aquí en el futuro podríamos añadir la lógica para cambiar los textos
    console.log('Idioma cambiado a:', this.activeLang);
  }

  // Método para el botón de login (por ahora solo muestra un mensaje)
  onLogin() {
    console.log('Intento de inicio de sesión...');
    // Más adelante, aquí irá la navegación a la siguiente pantalla
  }
}