// src/domain/ports/WeatherRepository.js

/**
 * 🔌 PUERTO - Define QUÉ necesita el dominio (sin saber CÓMO)
 */
class WeatherRepository {
  
  async getCurrentWeatherByCity(cityName) {
    throw new Error('Método getCurrentWeatherByCity debe ser implementado');
  }

  async getCurrentWeatherByCoordinates(latitude, longitude) {
    throw new Error('Método getCurrentWeatherByCoordinates debe ser implementado');
  }

  async getForecastByCity(cityName, days = 5) {
    throw new Error('Método getForecastByCity debe ser implementado');
  }

  async getForecastByCoordinates(latitude, longitude, days = 5) {
    throw new Error('Método getForecastByCoordinates debe ser implementado');
  }
}

module.exports = WeatherRepository;