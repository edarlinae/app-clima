import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private language = new BehaviorSubject<string>('es');
  language$ = this.language.asObservable();

  private translations: any = {
    es: {
      greeting: 'Hola de nuevo!',
      langButton: 'Idioma',
      tagline: 'Accede para ver el pronóstico del tiempo al instante.',
      emailPlaceholder: 'Correo electrónico',
      passwordPlaceholder: 'Contraseña',
      loginButton: 'Iniciar Sesión',
      hourlyForecastTitle: 'Pronóstico por Horas',
      additionalInfoTitle: 'Información Adicional',
      humidity: 'Humedad',
      windSpeed: 'Velocidad Viento',
      pressure: 'Presión',
      fiveDayForecast: 'Pronóstico 5 Días',
      forecastFor: 'Pronóstico para',
      today: 'Hoy',
      tomorrow: 'Mañana',
      back: 'Volver'
    },
    en: {
      greeting: 'Welcome back!',
      langButton: 'Language',
      tagline: 'Log in to see the weather forecast instantly.',
      emailPlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      loginButton: 'Sign In',
      hourlyForecastTitle: 'Hourly Forecast',
      additionalInfoTitle: 'Additional Information',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      pressure: 'Pressure',
      fiveDayForecast: '5 Day Forecast',
      forecastFor: 'Forecast for',
      today: 'Today',
      tomorrow: 'Tomorrow',
      back: 'Back'
    }
  };

  constructor() {
    const storedLang = localStorage.getItem('app-lang');
    if (storedLang) {
      this.language.next(storedLang);
    }
  }

  setLanguage(lang: string) {
    this.language.next(lang);
    localStorage.setItem('app-lang', lang);
  }

  getTranslations(): any {
    return this.translations[this.language.value];
  }
  
  getCurrentLang(): string {
    return this.language.value;
  }
}