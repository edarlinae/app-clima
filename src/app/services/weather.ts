import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '39f6c94ee91287c021c88c8620a56aab';
  // URL para el tiempo actual
  private apiUrl_current = 'https://api.openweathermap.org/data/2.5/weather';
  // URL para el pronóstico
  private apiUrl_forecast = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl_current}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get(url);
  }

  // NUEVO MÉTODO para el pronóstico
  getForecast(city: string): Observable<any> {
    const url = `${this.apiUrl_forecast}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get(url);
  }
}