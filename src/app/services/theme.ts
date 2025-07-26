import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme = new BehaviorSubject<string>('light');
  currentTheme$ = this.currentTheme.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme() {
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    this.setTheme(storedTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string) {
    localStorage.setItem('app-theme', theme);
    this.currentTheme.next(theme);

    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}