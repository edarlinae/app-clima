import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss'
})
export class ForecastComponent implements OnInit {
  cityName: string | null = null;
  forecastData: any[] = [];

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
        this.forecastData = this.filterDailyForecast(data.list);
      },
      error: (err) => console.error('Error al obtener el pronóstico extendido:', err)
    });
  }

  private filterDailyForecast(list: any[]): any[] {
    const dailyData: any[] = [];
    const seenDays: string[] = [];

    for (const item of list) {
      const day = item.dt_txt.split(' ')[0];
      if (!seenDays.includes(day)) {
        seenDays.push(day);
        dailyData.push(item);
      }
    }
    return dailyData;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}