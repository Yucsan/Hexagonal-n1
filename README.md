# Weather App - Arquitectura Hexagonal

Aplicación del clima implementada con **Arquitectura Hexagonal** como proyecto de aprendizaje.

## Migración: Arquitectura Clásica → Hexagonal

### Repositorios de Referencia

**Versión Original (Arquitectura en Capas):**
- Backend: [Angular_tiempo_Almeria/backend](https://github.com/Yucsan/Angular_tiempo_Almeria/blob/main/backend/server.js)
- Frontend: [Angular_tiempo_Almeria/frontend](https://github.com/Yucsan/Angular_tiempo_Almeria/tree/main/frontend)

**Versión Hexagonal (este proyecto):**
- Backend: [Hexagonal-n1](https://github.com/Yucsan/Hexagonal-n1/blob/main/src/interfaces/controllers/WeatherController.js)
- Frontend: Estructura actual

## Estructura del Proyecto

```
src/
├── app/
│   ├── header/              # Componente header
│   ├── services/            # Servicios de Angular
│   ├── sidebar/             # Componente sidebar  
│   ├── weather/             # Módulo principal del clima
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.html
│   └── app.routes.ts
├── assets/                  # Recursos estáticos
├── index.html
└── main.ts
```

### Backend (Hexagonal-n1)
```
src/
├── domain/
│   ├── entities/
│   │   ├── Location.js
│   │   └── Weather.js
│   └── value-objects/
│       └── WindDirection.js
├── application/
│   └── use-cases/
├── infrastructure/
│   └── adapters/
│       └── WeatherApiAdapter.js
├── interfaces/
│   └── controllers/
│       └── WeatherController.js
└── ports/
    ├── WeatherRepository.js
    └── GetWeatherByCity.js
```

## Instalación y Ejecución

### Prerequisitos
- Node.js v18+
- npm o yarn
- API Key de OpenWeatherMap

### Clonar y ejecutar

```bash
# Clonar repositorio
git clone [URL_DEL_REPO]
cd [NOMBRE_DEL_REPO]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API_KEY de OpenWeatherMap

# Ejecutar en desarrollo
npm start

# Build para producción
npm run build
```

### Backend (ejecutar por separado)
```bash
# Clonar backend hexagonal
git clone https://github.com/Yucsan/Hexagonal-n1.git
cd Hexagonal-n1

# Instalar y ejecutar
npm install
npm start
```

## Diferencias: Clásica vs Hexagonal

| Aspecto | Arquitectura Clásica | Arquitectura Hexagonal |
|---------|---------------------|------------------------|
| **Estructura** | Capas horizontales (Controller → Service → Repository) | Núcleo + Puertos + Adaptadores |
| **Dependencias** | Capas superiores dependen de inferiores | Exterior depende del núcleo |
| **Lógica de negocio** | Mezclada en servicios y controladores | Aislada en el dominio |
| **Acceso a datos** | Repositorio como capa inferior | Adaptador secundario |
| **Testing** | Tests acoplados a infraestructura | Tests independientes del exterior |
| **Flexibilidad** | Cambio de DB afecta múltiples capas | Cambio de DB solo afecta adaptador |

### Ejemplo de Diferencia Práctica

**Clásica (server.js):**
```javascript
app.get('/weather/:city', async (req, res) => {
  const { city } = req.params;
  const apiResponse = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}`);
  const data = await apiResponse.json();
  res.json(data); // Lógica HTTP + API + respuesta mezcladas
});
```

**Hexagonal (WeatherController.js):**
```javascript
async getWeatherByCity(req, res) {
  const { city } = req.params;
  const weather = await this.getCurrentWeather.execute(city);
  res.json(weather.toJSON()); // Solo adaptación HTTP
}
```

## Tecnologías

- **Frontend**: Angular 17+, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **API**: OpenWeatherMap
- **Patrones**: Hexagonal Architecture, Repository Pattern

## Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run lint       # Linter
```

## API Endpoints

```
GET /weather/:city        # Obtener clima por ciudad
GET /weather/coords/:lat/:lon  # Obtener clima por coordenadas
```

## Estructura de Respuesta

```json
{
  "city": "Almería",
  "temperature": 22,
  "description": "Soleado",
  "humidity": 65,
  "windSpeed": 15,
  "windDirection": "NE"
}
```

## Siguiente Iteración

- [ ] Implementar casos de uso más complejos
- [ ] Añadir persistencia local
- [ ] Tests unitarios para el dominio
- [ ] Manejo de errores mejorado
