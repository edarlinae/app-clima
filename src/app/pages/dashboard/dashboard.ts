import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './dashboard.html',
  // CAMBIO: Usamos styleUrls en plural y con corchetes []
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  
  weatherData: any;
  hourlyForecast: any[] = [];
  searchCity: string = '';
  recentCities: string[] = [];
  errorMessage: string | null = null;
  private readonly RECENT_CITIES_KEY = 'weatherApp_recentCities';

  currentTheme: string = 'light';
  private themeSubscription!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.loadRecentCitiesFromStorage();
    const initialCity = this.recentCities[0] || 'Burriana';
    this.loadWeatherData(initialCity);
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onSearch(): void {
    if (this.searchCity) {
      this.loadWeatherData(this.searchCity.trim());
      this.searchCity = ''; 
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
        this.errorMessage = `No se encontró la ciudad "${city}". Por favor, intenta de nuevo.`;
        this.weatherData = null;
        this.hourlyForecast = [];
      }
    });
  }
  
  goToForecast(): void {
    if (this.weatherData) {
      this.router.navigate(['/forecast', this.weatherData.name]);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  refreshData(): void {
    if (this.weatherData) {
      this.loadWeatherData(this.weatherData.name);
    }
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

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        this.hourlyForecast = data.list.slice(0, 5);
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