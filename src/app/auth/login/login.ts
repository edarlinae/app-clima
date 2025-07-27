import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { ThemeService } from '../../services/theme'; 
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  texts: any = {};
  activeLang: string = 'es';
  currentTheme: string = 'light';
  private langSubscription!: Subscription;
  private themeSubscription!: Subscription;

  constructor(
    private router: Router, 
    private translationService: TranslationService,
    private themeService: ThemeService 
  ) {}

  ngOnInit(): void {
    // Suscripción al idioma
    this.langSubscription = this.translationService.language$.subscribe(lang => {
      this.activeLang = lang;
      this.texts = this.translationService.getTranslations();
    });

    // Suscripción al tema
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    // Limpiamos las suscripciones
    if (this.langSubscription) this.langSubscription.unsubscribe();
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
  }

  setLanguage(lang: 'es' | 'en') {
    this.translationService.setLanguage(lang);
  }
  
  // 5. Añade el método para cambiar el tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogin() {
    this.router.navigate(['/dashboard']);
  }
}