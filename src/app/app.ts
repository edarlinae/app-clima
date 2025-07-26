import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importante para el <router-outlet>

@Component({
  selector: 'app-root',
  standalone: true, // <-- La magia de los nuevos componentes
  imports: [RouterOutlet], // <-- Aquí se importan módulos o componentes hijos
  templateUrl: './app.html', // <-- Apunta a tu archivo de vista
  styleUrl: './app.scss' // <-- Apunta a tu archivo de estilos
})
export class App {
  title = 'App del Clima'; // Puedes cambiar este título
}