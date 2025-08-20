// src/infrastructure/adapters/WeatherApiAdapter.js

const axios = require('axios');
const WeatherRepository = require('../../domain/ports/WeatherRepository');
const Weather = require('../../domain/entities/Weather');
const WindDirection = require('../../domain/value-objects/WindDirection');

/**
 * 🔌 ADAPTADOR - Implementa el puerto usando OpenWeatherMap API
 * Refactorizado para usar OpenWeatherMap en lugar de WeatherAPI
 */
class WeatherApiAdapter extends WeatherRepository {
  
  constructor(apiKey, baseUrl = 'https://api.openweathermap.org/data/2.5') {
    super();
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getCurrentWeatherByCity(cityName) {
    try {
      console.log(`🔍 Buscando clima para: "${cityName}"`);
      
      const url = `${this.baseUrl}/weather?q=${cityName}&appid=${this.apiKey}&units=metric&lang=es`;
      console.log(`📡 URL: ${url.replace(this.apiKey, 'API_KEY_HIDDEN')}`);
      
      const response = await axios.get(url);
      
      console.log(`✅ Respuesta exitosa para "${cityName}"`);
      console.log(`📍 Ubicación encontrada: ${response.data.name}, ${response.data.sys.country}`);
      
      return this.formatWeatherData(response.data);
      
    } catch (error) {
      console.error(`❌ Error fetching weather for "${cityName}":`, error.message);
      
      if (error.response) {
        console.error('📄 Status:', error.response.status);
        console.error('📄 Data:', error.response.data);
        
        if (error.response.status === 404) {
          throw new Error('Ciudad no encontrada. Verifica el nombre e intenta nuevamente.');
        } else if (error.response.status === 401) {
          throw new Error('API key inválida o sin permisos');
        } else if (error.response.status === 429) {
          throw new Error('Límite de requests excedido. Intenta de nuevo en unos minutos.');
        } else {
          throw new Error('Error interno del servidor al obtener el clima');
        }
      } else {
        console.error('🌐 Error de red:', error.code);
        throw new Error('Error de conexión con el servicio del clima');
      }
    }
  }

  formatWeatherData(data) {
    return new Weather({
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convertir de m/s a km/h
      windDirection: data.wind.deg ? this.getWindDirection(data.wind.deg) : 'N/A',
      windDegrees: data.wind.deg || 0,
      windGust: data.wind.gust ? Math.round(data.wind.gust * 3.6) : null,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null, // en km
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    });
  }

  async getCurrentWeatherByCoordinates(latitude, longitude) {
    try {
      console.log(`🗺️ Obteniendo clima por coordenadas: ${latitude}, ${longitude}`);
      
      const response = await axios.get(
        `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=es`
      );
      
      return this.formatWeatherData(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching weather by coordinates:', error.message);
      throw new Error('Error al obtener el clima por coordenadas');
    }
  }

  async getForecastByCity(cityName, days = 5) {
    try {
      console.log(`🔮 Obteniendo pronóstico para: "${cityName}"`);
      
      const response = await axios.get(
        `${this.baseUrl}/forecast?q=${cityName}&appid=${this.apiKey}&units=metric&lang=es`
      );
      
      return this.formatForecastData(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching forecast:', error.message);
      
      if (error.response && error.response.status === 404) {
        throw new Error('Ciudad no encontrada para el pronóstico. Verifica el nombre e intenta nuevamente.');
      } else {
        throw new Error('Error al obtener el pronóstico detallado');
      }
    }
  }

  async getForecastByCoordinates(latitude, longitude, days = 5) {
    try {
      console.log(`🗺️ Obteniendo pronóstico por coordenadas: ${latitude}, ${longitude}`);
      
      const response = await axios.get(
        `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=es`
      );
      
      return this.formatForecastData(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching forecast by coordinates:', error.message);
      throw new Error('Error al obtener el pronóstico por coordenadas');
    }
  }

  formatForecastData(data) {
    const hourlyForecast = data.list.map(item => this.formatHourlyForecastItem(item));
    
    // Agrupar por días para resumen diario
    const dailyForecast = {};
    hourlyForecast.forEach(item => {
      const date = item.dateTime.split(' ')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          date: date,
          temperatures: [],
          descriptions: [],
          windSpeeds: [],
          windGusts: [],
          humidity: [],
          items: []
        };
      }
      dailyForecast[date].temperatures.push(item.temperature);
      dailyForecast[date].descriptions.push(item.description);
      dailyForecast[date].windSpeeds.push(item.windSpeed);
      if (item.windGust) dailyForecast[date].windGusts.push(item.windGust);
      dailyForecast[date].humidity.push(item.humidity);
      dailyForecast[date].items.push(item);
    });
    
    // Crear resumen diario
    const dailySummary = Object.keys(dailyForecast).map(date => {
      const day = dailyForecast[date];
      return {
        date: date,
        tempMin: Math.min(...day.temperatures),
        tempMax: Math.max(...day.temperatures),
        avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        maxWindSpeed: Math.max(...day.windSpeeds),
        maxWindGust: day.windGusts.length > 0 ? Math.max(...day.windGusts) : null,
        dominantDescription: day.descriptions.sort((a,b) => 
          day.descriptions.filter(v => v === a).length - day.descriptions.filter(v => v === b).length
        ).pop(),
        hourlyData: day.items
      };
    });
    
    return {
      location: `${data.city.name}, ${data.city.country}`,
      coordinates: {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      timezone: data.city.timezone,
      totalHours: hourlyForecast.length,
      totalDays: Object.keys(dailyForecast).length,
      hourlyForecast: hourlyForecast,
      dailySummary: dailySummary
    };
  }

  formatHourlyForecastItem(item) {
    return {
      dateTime: item.dt_txt,
      timestamp: item.dt,
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      description: item.weather[0].description,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: Math.round(item.wind.speed * 3.6), // km/h
      windDirection: item.wind.deg ? this.getWindDirection(item.wind.deg) : 'N/A',
      windDegrees: item.wind.deg || 0,
      windGust: item.wind.gust ? Math.round(item.wind.gust * 3.6) : null, // km/h
      visibility: item.visibility ? Math.round(item.visibility / 1000) : null, // km
      cloudiness: item.clouds.all, // porcentaje
      precipitation: item.rain ? item.rain['3h'] || 0 : item.snow ? item.snow['3h'] || 0 : 0,
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
    };
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}

module.exports = WeatherApiAdapter;