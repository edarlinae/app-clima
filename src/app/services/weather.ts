import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Guardamos la API key y la URL base en variables privadas
  private apiKey = '39f6c94ee91287c021c88c8620a56aab';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Inyectamos HttpClient para poder hacer las llamadas
  constructor(private http: HttpClient) { }

  /**
   * Obtiene el tiempo para una ciudad específica.
   * @param city El nombre de la ciudad.
   * @returns Un Observable con la respuesta de la API.
   */
  getWeather(city: string): Observable<any> {
    // Construimos la URL completa con los parámetros necesarios
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    // Hacemos la petición GET y devolvemos el resultado
    return this.http.get(url);
  }
}