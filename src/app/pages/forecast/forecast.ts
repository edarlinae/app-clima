import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';

// Definimos una interfaz para la estructura de nuestros datos agrupados
interface DailyForecastGroup {
  dateLabel: string; // "Hoy", "Mañana", "Lunes, 28 de julio"
  forecasts: any[]; // Array de pronósticos por hora para ese día
}

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss'
})
export class Forecast implements OnInit {
  cityName: string | null = null;
  // La data ahora será un array de nuestros grupos diarios
  groupedForecastData: DailyForecastGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.cityName = params.get('city');
      if (this.cityName) {
        this.loadForecast(this.cityName);
      }
    });
  }

  loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        // Usamos la nueva función para agrupar los datos
        this.groupedForecastData = this.groupForecastByDay(data.list);
      },
      error: (err) => console.error('Error al obtener el pronóstico extendido:', err)
    });
  }

  // Nueva función para agrupar los 40 pronósticos en grupos por día
  private groupForecastByDay(list: any[]): DailyForecastGroup[] {
    const groups: { [key: string]: any[] } = {};

    // 1. Agrupamos todos los pronósticos por fecha en un objeto
    for (const item of list) {
      const date = new Date(item.dt_txt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    }

    // 2. Convertimos el objeto en un array con el formato que necesitamos
    const result: DailyForecastGroup[] = [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const tomorrowStr = tomorrow.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    for (const dateKey in groups) {
      let label = '';
      if (dateKey === todayStr) {
        label = 'Hoy';
      } else if (dateKey === tomorrowStr) {
        label = 'Mañana';
      } else {
        const date = new Date(groups[dateKey][0].dt * 1000);
        label = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      }

      result.push({
        dateLabel: label,
        forecasts: groups[dateKey]
      });

      // CAMBIO: Detenemos el bucle cuando tengamos 5 días
      if (result.length === 5) break;
    }
    
    return result;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}