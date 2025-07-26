import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Forecast } from './pages/forecast/forecast';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: Dashboard },
    { path: 'forecast/:city', component: Forecast }
];