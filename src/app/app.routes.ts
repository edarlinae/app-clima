import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
// 1. Importa el nuevo componente
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    // 2. Añade la ruta para el dashboard
    { path: 'dashboard', component: DashboardComponent }
];