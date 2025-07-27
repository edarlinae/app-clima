# 🌦️ AppClima - Aplicación del Tiempo con Angular

¡Bienvenido/a a **AppClima**! Esta es una aplicación web moderna desarrollada desde cero con **Angular 17+**, pensada para demostrar habilidades avanzadas en frontend: integración de APIs externas, gestión de estado, diseño responsive y una experiencia de usuario fluida e intuitiva.

---

## 📜 Descripción

**AppClima** permite consultar el clima actual y el pronóstico extendido de cualquier ciudad del mundo. La información meteorológica se obtiene en tiempo real desde **OpenWeatherMap**, y se presenta en una interfaz atractiva, dinámica y personalizable.

La aplicación está estructurada en tres interfaces principales:

- **Login:** Pantalla de bienvenida con selector de idioma y tema.
- **Dashboard Principal:** Muestra el clima actual, pronóstico por horas e información adicional.
- **Pronóstico Extendido:** Vista detallada de los próximos 5 días.

---

## ✨ Funcionalidades Principales

- 🛰️ **Datos en Tiempo Real:** Integración con la API de OpenWeatherMap para datos actualizados.
- 🏙️ **Búsqueda Inteligente de Ciudades:** Traducción automática del nombre según el idioma seleccionado.
- 💾 **Historial de Búsquedas:** Guarda las últimas 3 ciudades consultadas en el navegador.
- 🌍 **Soporte Multi-idioma:** Interfaz disponible en Español e Inglés, con preferencia guardada en `localStorage`.
- 🌗 **Modo Claro y Oscuro:** Interruptor para cambiar el tema, con persistencia automática.
- 🖼️ **Fondos Dinámicos:** El fondo cambia según el clima actual de la ciudad buscada.
- 📱 **Diseño 100% Responsive:** Compatible con todo tipo de dispositivos.
- 🎨 **Iconos Personalizados:** Visualización intuitiva con iconografía amigable.
- 🧭 **Navegación Fluida:** Routing simple entre vistas, con transición clara.

---

## 📂 Estructura de Interfaces

### 🔐 Login (`LoginComponent`)

- Selector de idioma (ES/EN)
- Selector de tema (claro/oscuro)
- Botón para iniciar sesión y navegar al dashboard

### 🌤️ Panel Principal (`DashboardComponent`)

- Búsqueda de ciudades
- Traducción automática del nombre de la ciudad
- Clima actual: temperatura, descripción, icono, sensación térmica
- Historial de ciudades recientes
- Pronóstico por horas (scroll horizontal)
- Datos adicionales: humedad, viento, presión
- Fondo dinámico según el clima
- Botones para cambiar tema, actualizar datos, navegar a pronóstico

### 📅 Pronóstico Extendido (`ForecastComponent`)

- Pronóstico de 5 días agrupado por jornada
- Scroll horizontal por horas dentro de cada día
- Fondo fijo
- Botones para volver al dashboard, refrescar y cambiar tema

---

## 🧠 Arquitectura Técnica

### 🧩 Componentes Standalone

- Cada componente es independiente, sin uso de `NgModule`.
- Las dependencias se declaran localmente, lo que simplifica la estructura.

### ⚙️ Servicios Clave

- **`WeatherService:`** Maneja las llamadas a OpenWeatherMap.
- **`ThemeService:`** Gestiona el tema claro/oscuro con `BehaviorSubject`.
- **`TranslationService:`** Controla el idioma actual y sincroniza los textos.

### 🗂️ Gestión de Estado

- Uso de `BehaviorSubject` para mantener el estado del tema e idioma en tiempo real.
- Persistencia en `localStorage`.

### 🧠 Traducción de Nombres de Ciudad

```ts
// dashboard.ts (fragmento)
this.weatherService.getCoordinates(cityInfo).subscribe({
  next: (geoData) => {
    const city = geoData[0];
    const lang = this.translationService.getCurrentLang();
    const translatedName = city.local_names?.[lang] || city.name;
    // ... luego se llama a getWeather() y getForecast() con esos datos
  }
});
```

---

## 🛠️ Tecnologías Utilizadas

| Categoría            | Tecnologías                                      |
|----------------------|--------------------------------------------------|
| Framework            | Angular (v17+)                                   |
| Lenguajes            | TypeScript, JavaScript (ES6+)                    |
| Estilos              | SCSS, CSS3, CSS Variables                        |
| APIs Externas        | OpenWeatherMap (Current, Forecast, Geocoding)    |
| Componentes UI       | Angular Standalone Components                    |
| Iconografía          | Ionicons + Iconos personalizados en PNG          |
| Gestión de estado    | RxJS (BehaviorSubject), localStorage             |
| Control de versiones | Git, GitHub                                      |

---

## 🔧 Cómo Ejecutar este Proyecto Localmente

### ✅ Requisitos Previos

- Node.js (v18 o superior)
- Angular CLI instalado globalmente

### 🚀 Instalación y Ejecución

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/app-clima.git

# 2. Entra al directorio del proyecto
cd app-clima

# 3. Instala las dependencias
npm install

# 4. (Importante) Configura tu API Key:
#    - Abre: src/app/services/weather.ts
#    - Sustituye la clave de ejemplo por la tuya:
#      private apiKey = 'TU_PROPIA_API_KEY';

# 5. Ejecuta el servidor de desarrollo
ng serve
```

Una vez en marcha, abre tu navegador en: [http://localhost:4200](http://localhost:4200)

---

## 👤 Contacto

¿Tienes ideas, dudas o quieres colaborar?

- 🌐 **Portfolio Web:** [mi-portfolio-blush.vercel.app](https://mi-portfolio-blush.vercel.app)
- 💼 **LinkedIn:** [alicia-caparros-masia](https://www.linkedin.com/in/alicia-caparros-masia-39aa6a357)
- 📧 **Email:** [caparrosmasiaalicia@gmail.com](mailto:caparrosmasiaalicia@gmail.com)
