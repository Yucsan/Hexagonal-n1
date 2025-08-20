// src/application/use-cases/GetCurrentWeather.js

/**
 * 📋 CASO DE USO - Lógica de aplicación
 * Orquesta el dominio para cumplir un objetivo específico
 */
class GetCurrentWeather {
  
  constructor(weatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  // Obtener clima por ciudad
  async byCity(cityName) {
    if (!cityName || cityName.trim() === '') {
      throw new Error('El nombre de la ciudad es requerido');
    }

    return await this.weatherRepository.getCurrentWeatherByCity(cityName.trim());
  }

  // Obtener clima por coordenadas
  async byCoordinates(latitude, longitude) {
    if (latitude === undefined || longitude === undefined) {
      throw new Error('Latitud y longitud son requeridas');
    }

    return await this.weatherRepository.getCurrentWeatherByCoordinates(latitude, longitude);
  }
}

module.exports = GetCurrentWeather;