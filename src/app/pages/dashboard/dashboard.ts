import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';

// Se elimina la importación de IonicModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Se elimina IonicModule de la lista de imports
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeather('Burriana').subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log('Datos del tiempo recibidos:', this.weatherData);
      },
      error: (err) => {
        console.error('Error al obtener los datos del tiempo:', err);
      }
    });
  }
}