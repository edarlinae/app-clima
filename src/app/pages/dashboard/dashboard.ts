import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  
  weatherData: any;
  // Propiedad para el pronóstico por horas
  hourlyForecast: any[] = [];
  searchCity: string = '';
  recentCities: string[] = [];
  // Propiedad para el mensaje de error
  errorMessage: string | null = null;
  private readonly RECENT_CITIES_KEY = 'weatherApp_recentCities';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadRecentCitiesFromStorage();
    const initialCity = this.recentCities[0] || 'Burriana';
    this.loadWeatherData(initialCity);
  }

  onSearch(): void {
    if (this.searchCity) {
      this.loadWeatherData(this.searchCity.trim());
    }
  }

  loadWeatherData(city: string): void {
    // Al empezar una búsqueda, limpiamos el error anterior
    this.errorMessage = null;

    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.updateRecentCities(data.name);
        
        // Si el tiempo actual se carga bien, pedimos el pronóstico
        this.loadForecast(data.name);
      },
      error: (err) => {
        console.error('Error al obtener los datos del tiempo:', err);
        // Si hay un error, mostramos un mensaje
        this.errorMessage = `No se encontró la ciudad "${city}". Por favor, intenta de nuevo.`;
        this.weatherData = null; // Limpiamos los datos viejos
        this.hourlyForecast = []; // Limpiamos el pronóstico viejo
      }
    });
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        // La API devuelve datos cada 3 horas, nos quedamos con los 5 primeros (15 horas)
        this.hourlyForecast = data.list.slice(0, 5);
      },
      error: (err) => {
        console.error('Error al obtener el pronóstico:', err);
      }
    });
  }

  private updateRecentCities(city: string): void {
    const formattedCity = city.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    this.recentCities = this.recentCities.filter(c => c !== formattedCity);
    this.recentCities.unshift(formattedCity);
    if (this.recentCities.length > 3) {
      this.recentCities.pop();
    }
    localStorage.setItem(this.RECENT_CITIES_KEY, JSON.stringify(this.recentCities));
  }
  
  private loadRecentCitiesFromStorage(): void {
    const storedCities = localStorage.getItem(this.RECENT_CITIES_KEY);
    if (storedCities) {
      this.recentCities = JSON.parse(storedCities);
    }
  }
}