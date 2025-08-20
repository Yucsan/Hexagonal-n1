// src/interfaces/controllers/WeatherController.js

/**
 * 🌐 CONTROLADOR - Maneja las peticiones HTTP
 * Conecta Express con nuestros casos de uso
 */
class WeatherController {
  
  constructor(getCurrentWeather, weatherRepository) {
    this.getCurrentWeather = getCurrentWeather;
    this.weatherRepository = weatherRepository;
  }

  // Tu ruta original: /api/weather/:city
  async getWeatherByCity(req, res) {
    try {
      const { city } = req.params;
      
      const weather = await this.getCurrentWeather.byCity(city);
      
      // Devuelve el JSON como antes
      res.json(weather.toJSON());
      
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      
      if (error.message.includes('Ciudad no encontrada')) {
        res.status(404).json({ 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al obtener el clima' 
        });
      }
    }
  }

  // Tu ruta original: /api/weather/coords/:lat/:lon
  async getWeatherByCoordinates(req, res) {
    try {
      const { lat, lon } = req.params;
      
      const weather = await this.getCurrentWeather.byCoordinates(
        parseFloat(lat), 
        parseFloat(lon)
      );
      
      res.json(weather.toJSON());
      
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error.message);
      res.status(500).json({ 
        error: 'Error al obtener el clima por coordenadas' 
      });
    }
  }

  async getForecastByCity(req, res) {
    try {
      const { city } = req.params;
      const forecast = await this.weatherRepository.getForecastByCity(city);
      res.json(forecast);
    } catch (error) {
      console.error('❌ Error fetching forecast:', error.message);
      
      if (error.message.includes('Ciudad no encontrada')) {
        res.status(404).json({ 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          error: 'Error al obtener el pronóstico detallado',
          debug: {
            city: req.params.city
          }
        });
      }
    }
  }

  async getForecastByCoordinates(req, res) {
    try {
      const { lat, lon } = req.params;
      const forecast = await this.weatherRepository.getForecastByCoordinates(
        parseFloat(lat), 
        parseFloat(lon)
      );
      res.json(forecast);
    } catch (error) {
      console.error('❌ Error fetching forecast by coordinates:', error.message);
      res.status(500).json({ 
        error: 'Error al obtener el pronóstico por coordenadas',
        debug: {
          coordinates: `${req.params.lat}, ${req.params.lon}`
        }
      });
    }
  }

  async testApi(req, res) {
    try {
      console.log('🧪 Probando conexión directa con OpenWeatherMap...');
      
      const testWeather = await this.weatherRepository.getCurrentWeatherByCity('London');
      
      res.json({
        success: true,
        message: '✅ OpenWeatherMap API funcionando correctamente',
        testLocation: testWeather.location,
        apiKeyStatus: 'Valid',
        temperature: testWeather.temperature,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Test de API falló:', error.message);
      
      let errorInfo = {
        success: false,
        message: '❌ OpenWeatherMap API con problemas',
        timestamp: new Date().toISOString()
      };
      
      if (error.message.includes('API key inválida')) {
        errorInfo.suggestion = 'Verifica tu API key en https://openweathermap.org/api';
      }
      
      res.status(500).json(errorInfo);
    }
  }

  getTest(req, res) {
    res.json({ 
      message: '✅ API del clima con OpenWeatherMap funcionando correctamente! 🌤️',
      service: 'OpenWeatherMap',
      timestamp: new Date().toISOString()
    });
  }

  getSaludo(req, res) {
    res.json({ 
      mensaje: 'Hola! Bienvenido a la aplicación del clima 🌞',
      service: 'OpenWeatherMap',
      status: 'online'
    });
  }
}

module.exports = WeatherController;