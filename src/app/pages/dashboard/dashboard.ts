import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../services/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  
  @HostBinding('style.backgroundImage')
  get backgroundImage(): string {
    return this.currentBackground;
  }
  private currentBackground: string = '';

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
        const iconCode = this.weatherData.weather[0].icon;
        this.currentBackground = this.getBackgroundPath(iconCode);
      },
      error: (err) => {
        console.error('Error al obtener los datos del tiempo:', err);
        this.errorMessage = `No se encontró la ciudad "${city}". Por favor, intenta de nuevo.`;
        // CAMBIO: Ya no borramos los datos anteriores
        // this.weatherData = null; 
        // this.hourlyForecast = [];
      }
    });
  }
  
  goToForecast(): void {
    if (this.weatherData) {
      this.router.navigate(['/forecast', this.weatherData.name]);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/']);
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

  private getBackgroundPath(iconCode: string): string {
    const backgroundMap: { [key: string]: string } = {
      '01d': 'clear_sky_day.png',
      '01n': 'clear_sky_n.png',
      '02d': 'few_clouds_day.png',
      '02n': 'few_clouds_n.png',
      '03d': 'scattered_clouds_day.png',
      '03n': 'scattered_clouds_n.png',
      '04d': 'broken_clouds_day.png',
      '04n': 'broken_clouds_day.png',
      '09d': 'shower_rain_day.png',
      '09n': 'shower_rain_day.png',
      '10d': 'rain_day.png',
      '10n': 'rain_day.png',
      '11d': 'thunderstorm_day.png',
      '11n': 'thunderstorm_day.png',
      '13d': 'snow_day.png',
      '13n': 'snow_n.png',
      '50d': 'mist_day.png',
      '50n': 'mist_day.png'
    };
    const backgroundFile = backgroundMap[iconCode] || 'clear_sky_day.jpg';
    return `url(assets/backgrounds/${backgroundFile})`;
  }

  private loadForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        this.hourlyForecast = data.list.slice(0, 5);
      },
      error: (err) => console.error('Error al obtener el pronóstico por horas:', err)
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