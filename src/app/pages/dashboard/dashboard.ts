import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  
  weatherData: any;
  hourlyForecast: any[] = [];
  searchCity: string = '';
  recentCities: string[] = [];
  errorMessage: string | null = null;
  private readonly RECENT_CITIES_KEY = 'weatherApp_recentCities';

  constructor(
    private weatherService: WeatherService,
    private router: Router // Inyectamos el Router
  ) {}

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
    this.errorMessage = null;
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.updateRecentCities(data.name);
        this.loadForecast(data.name);
      },
      error: (err) => {
        console.error('Error al obtener los datos del tiempo:', err);
        this.errorMessage = `No se encontró la ciudad "${city}". Por favor, intenta de nuevo.`;
        this.weatherData = null;
        this.hourlyForecast = [];
      }
    });
  }
  
  // Nuevo método para navegar a la página de pronóstico
  goToForecast(): void {
    if (this.weatherData) {
      this.router.navigate(['/forecast', this.weatherData.name]);
    }
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        this.hourlyForecast = data.list.slice(0, 5);
      },
      error: (err) => console.error('Error al obtener el pronóstico:', err)
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