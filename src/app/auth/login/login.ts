import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  activeLang: 'es' | 'en' = 'es';

  // Objeto con el contenido completo de las traducciones
  private translations = {
    es: {
      greeting: 'Hola de nuevo!',
      subtitle: 'Accede para ver el pronóstico del tiempo al instante.',
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholder: 'Contraseña',
      loginButton: 'Iniciar Sesión'
    },
    en: {
      greeting: 'Welcome back!',
      subtitle: 'Log in to see the weather forecast instantly.',
      emailPlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      loginButton: 'Sign In'
    }
  };

  // Ahora this.translations.es sí existe
  texts = this.translations.es;

  constructor(private router: Router) {}

  setLanguage(lang: 'es' | 'en') {
    this.activeLang = lang;
    this.texts = this.translations[lang];
  }

  onLogin() {
    console.log('Navegando al dashboard...');
    this.router.navigate(['/dashboard']);
  }
}