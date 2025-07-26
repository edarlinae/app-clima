import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';

interface DailyForecastGroup {
  dateLabel: string;
  forecasts: any[];
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
        this.groupedForecastData = this.groupForecastByDay(data.list);
      }
    });
  }

  getCustomIconPath(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'dclear_sky.png', '01n': 'nclear_sky.png',
      '02d': 'dfew_clouds.png', '02n': 'nfew_clouds.png',
      '03d': 'dscattered_clouds_icon.png', '03n': 'dscattered_clouds_icon.png',
      '04d': 'dbroken_clouds.png', '04n': 'dbroken_clouds.png',
      '09d': 'drain.png', '09n': 'nrain.png',
      '10d': 'dshower_rain.png', '10n': 'dshower_rain.png',
      '11d': 'dthunderstorm.png', '11n': 'dthunderstorm.png',
      '13d': 'dsnow.png', '13n': 'dsnow.png',
      '50d': 'dmist.png', '50n': 'dmist.png'
    };
    const iconFileName = iconMap[iconCode] || 'dclear_sky.png';
    return `assets/Iconos_clima/${iconFileName}`;
  }

  private groupForecastByDay(list: any[]): DailyForecastGroup[] {
    const groups: { [key: string]: any[] } = {};
    for (const item of list) {
      const date = new Date(item.dt_txt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    }

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

      if (result.length === 5) break;
    }
    
    return result;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}