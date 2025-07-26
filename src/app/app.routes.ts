import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ForecastComponent } from './pages/forecast/forecast';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    // Nueva ruta con un parámetro dinámico ":city"
    { path: 'forecast/:city', component: ForecastComponent }
];