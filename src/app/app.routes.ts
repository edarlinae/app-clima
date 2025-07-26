import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
// 1. Cambia el nombre de la clase importada aquí
import { Forecast } from './pages/forecast/forecast';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    // 2. Y usa el nuevo nombre aquí
    { path: 'forecast/:city', component: Forecast }
];