import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importa provideHttpClient
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // Añádelo a la lista de providers
  providers: [provideRouter(routes), provideHttpClient()]
};