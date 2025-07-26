import { Routes } from '@angular/router';
// 1. Importa tu nuevo componente de login
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
    // 2. Configura la ruta raíz para que muestre el LoginComponent
    { path: '', component: LoginComponent },

    // Más adelante aquí añadiremos la ruta al panel principal, por ejemplo:
    // { path: 'dashboard', component: DashboardComponent }
];