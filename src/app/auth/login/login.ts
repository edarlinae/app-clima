import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  texts: any = {};
  activeLang: string = 'es';

  constructor(private router: Router, private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.language$.subscribe(lang => {
      this.activeLang = lang;
      this.texts = this.translationService.getTranslations();
    });
  }

  setLanguage(lang: 'es' | 'en') {
    this.translationService.setLanguage(lang);
  }

  onLogin() {
    this.router.navigate(['/dashboard']);
  }
}