import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationService } from './translation';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '39f6c94ee91287c021c88c8620a56aab';
  private apiUrl_geocoding = 'https://api.openweathermap.org/geo/1.0/direct';
  private apiUrl_current = 'https://api.openweathermap.org/data/2.5/weather';
  private apiUrl_forecast = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient, private translationService: TranslationService) { }

  getCoordinates(city: string): Observable<any> {
    const url = `${this.apiUrl_geocoding}?q=${city}&limit=1&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getWeather(lat: number, lon: number): Observable<any> {
    const lang = this.translationService.getCurrentLang();
    const url = `${this.apiUrl_current}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${lang}`;
    return this.http.get(url);
  }

  getForecast(lat: number, lon: number): Observable<any> {
    const lang = this.translationService.getCurrentLang();
    const url = `${this.apiUrl_forecast}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${lang}`;
    return this.http.get(url);
  }
}