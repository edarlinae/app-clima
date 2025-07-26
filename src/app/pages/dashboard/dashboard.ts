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
  searchCity: string = '';
  // 1. Propiedad para guardar la lista de ciudades recientes
  recentCities: string[] = [];
  private readonly RECENT_CITIES_KEY = 'weatherApp_recentCities';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // 2. Al iniciar, cargamos las ciudades guardadas en el navegador
    this.loadRecentCitiesFromStorage();
    
    // Cargamos el tiempo para la ciudad más reciente o una por defecto
    const initialCity = this.recentCities[0] || 'Burriana';
    this.loadWeatherData(initialCity);
  }

  onSearch(): void {
    if (this.searchCity) {
      this.loadWeatherData(this.searchCity.trim());
    }
  }

  loadWeatherData(city: string): void {
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        // 3. Si la búsqueda es exitosa, actualizamos la lista de recientes
        this.updateRecentCities(data.name);
        console.log('Datos del tiempo actualizados:', this.weatherData);
      },
      error: (err) => {
        console.error('Error al obtener los datos del tiempo:', err);
        // Opcional: mostrar un error al usuario si la ciudad no existe
      }
    });
  }

  // 4. Nueva función para gestionar la lista de ciudades recientes
  private updateRecentCities(city: string): void {
    // Convertimos la ciudad a un formato consistente (Title Case)
    const formattedCity = city.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    
    // Eliminamos la ciudad si ya existe para volver a ponerla al principio
    this.recentCities = this.recentCities.filter(c => c !== formattedCity);

    // Añadimos la nueva ciudad al principio de la lista
    this.recentCities.unshift(formattedCity);

    // Nos aseguramos de que solo haya 3 ciudades en la lista
    if (this.recentCities.length > 3) {
      this.recentCities.pop(); // Elimina la última (la más antigua)
    }

    // Guardamos la lista actualizada en el almacenamiento del navegador
    localStorage.setItem(this.RECENT_CITIES_KEY, JSON.stringify(this.recentCities));
  }
  
  // 5. Nueva función para cargar las ciudades desde el almacenamiento
  private loadRecentCitiesFromStorage(): void {
    const storedCities = localStorage.getItem(this.RECENT_CITIES_KEY);
    if (storedCities) {
      this.recentCities = JSON.parse(storedCities);
    }
  }
}