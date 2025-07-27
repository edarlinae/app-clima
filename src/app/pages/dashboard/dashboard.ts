import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../services/theme';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation';

interface RecentCity {
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  
  @HostBinding('style.backgroundImage')
  get backgroundImage(): string { return this.currentBackground; }
  private currentBackground: string = '';

  weatherData: any;
  hourlyForecast: any[] = [];
  searchCity: string = '';
  recentCities: RecentCity[] = [];
  errorMessage: string | null = null;
  private readonly RECENT_CITIES_KEY = 'weatherApp_recentCities';
  currentTheme: string = 'light';
  private themeSubscription!: Subscription;
  private langSubscription!: Subscription;
  texts: any = {};

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private themeService: ThemeService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.langSubscription = this.translationService.language$.subscribe(lang => {
      this.texts = this.translationService.getTranslations();
      if (this.weatherData) {
        this.refreshData();
      }
    });

    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.loadRecentCitiesFromStorage();
    const initialCity = this.recentCities.length > 0 ? this.recentCities[0] : { name: 'Burriana', lat: 39.8884, lon: -0.0827 };
    this.loadWeatherData(initialCity);
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
    if (this.langSubscription) this.langSubscription.unsubscribe();
  }

  onSearch(): void {
    if (this.searchCity) {
      this.loadWeatherData(this.searchCity.trim());
      this.searchCity = ''; 
    }
  }

  loadWeatherData(cityInfo: string | RecentCity): void {
    this.errorMessage = null;
    if (typeof cityInfo === 'string') {
      this.weatherService.getCoordinates(cityInfo).subscribe({
        next: (geoData) => {
          if (geoData && geoData.length > 0) {
            const city = geoData[0];
            
            // --- INICIO DE LA CORRECCIÓN ---
            // 1. Obtenemos el idioma actual del servicio de traducción ('es' o 'en')
            const lang = this.translationService.getCurrentLang();
            // 2. Usamos el idioma para buscar la traducción. Si no existe, usamos el nombre por defecto.
            const translatedName = city.local_names?.[lang] || city.name;
            // --- FIN DE LA CORRECCIÓN ---

            const recentCity: RecentCity = { name: translatedName, lat: city.lat, lon: city.lon };
            this.fetchWeatherAndForecast(recentCity);
            this.updateRecentCities(recentCity);
          } else {
            this.handleError(`No se encontró la ciudad "${cityInfo}".`);
          }
        },
        error: (err) => this.handleError('Error en la búsqueda.')
      });
    } else {
      this.fetchWeatherAndForecast(cityInfo);
    }
  }
  
  private fetchWeatherAndForecast(city: RecentCity): void {
    this.weatherService.getWeather(city.lat, city.lon).subscribe({
      next: (weatherData) => {
        this.weatherData = weatherData;
        this.weatherData.name = city.name;
        const iconCode = this.weatherData.weather[0].icon;
        this.currentBackground = this.getBackgroundPath(iconCode);
      },
      error: (err) => this.handleError('No se pudo cargar el tiempo actual.')
    });
    this.weatherService.getForecast(city.lat, city.lon).subscribe({
      next: (forecastData) => {
        this.hourlyForecast = forecastData.list.slice(0, 5);
      },
      error: (err) => console.error('Error al obtener el pronóstico por horas:', err)
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
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
      const currentCity: RecentCity = { name: this.weatherData.name, lat: this.weatherData.coord.lat, lon: this.weatherData.coord.lon };
      this.fetchWeatherAndForecast(currentCity);
    }
  }

  getCustomIconPath(iconCode: string): string {
    const iconMap: { [key: string]: string } = { '01d': 'dclear_sky.png', '01n': 'nclear_sky.png', '02d': 'dfew_clouds.png', '02n': 'nfew_clouds.png', '03d': 'dscattered_clouds_icon.png', '03n': 'dscattered_clouds_icon.png', '04d': 'dbroken_clouds.png', '04n': 'dbroken_clouds.png', '09d': 'drain.png', '09n': 'nrain.png', '10d': 'dshower_rain.png', '10n': 'dshower_rain.png', '11d': 'dthunderstorm.png', '11n': 'dthunderstorm.png', '13d': 'dsnow.png', '13n': 'dsnow.png', '50d': 'dmist.png', '50n': 'dmist.png' };
    const iconFileName = iconMap[iconCode] || 'dclear_sky.png';
    return `assets/Iconos_clima/${iconFileName}`;
  }

  private getBackgroundPath(iconCode: string): string {
    const backgroundMap: { [key: string]: string } = { '01d': 'clear_sky_day.png', '01n': 'clear_sky_n.png', '02d': 'few_clouds_day.png', '02n': 'few_clouds_n.png', '03d': 'scattered_clouds_day.png', '03n': 'scattered_clouds_n.png', '04d': 'broken_clouds_day.png', '04n': 'broken_clouds_day.png', '09d': 'shower_rain_day.png', '09n': 'shower_rain_day.png', '10d': 'rain_day.png', '10n': 'rain_day.png', '11d': 'thunderstorm_day.png', '11n': 'thunderstorm_day.png', '13d': 'snow_day.png', '13n': 'snow_n.png', '50d': 'mist_day.png', '50n': 'mist_day.png' };
    const backgroundFile = backgroundMap[iconCode] || 'clear_sky_day.jpg';
    return `url(assets/backgrounds/${backgroundFile})`;
  }

  private updateRecentCities(city: RecentCity): void {
    this.recentCities = this.recentCities.filter(c => c.name !== city.name);
    this.recentCities.unshift(city);
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