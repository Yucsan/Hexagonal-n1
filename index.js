// index.js - Modificado para arquitectura hexagonal
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar nuestras capas hexagonales
const WeatherApiAdapter = require('./src/infrastructure/adapters/WeatherApiAdapter');
const GetCurrentWeather = require('./src/application/use-cases/GetCurrentWeather');
const WeatherController = require('./src/interfaces/controllers/WeatherController');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 🔧 INYECCIÓN DE DEPENDENCIAS
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Verificar API key al inicio
if (!API_KEY) {
  console.error('❌ OPENWEATHER_API_KEY no encontrada en variables de entorno');
  console.log('💡 Crea un archivo .env con: OPENWEATHER_API_KEY=tu_clave_aqui');
  console.log('📋 Obtén tu API key gratuita en: https://openweathermap.org/api');
} else {
  console.log('✅ API Key encontrada:', API_KEY.substring(0, 8) + '...');
}

const weatherRepository = new WeatherApiAdapter(API_KEY);
const getCurrentWeather = new GetCurrentWeather(weatherRepository);
const weatherController = new WeatherController(getCurrentWeather, weatherRepository);

// 🌐 RUTAS
app.get('/api/weather/:city', (req, res) => weatherController.getWeatherByCity(req, res));
app.get('/api/weather/coords/:lat/:lon', (req, res) => weatherController.getWeatherByCoordinates(req, res));
app.get('/api/forecast/:city', (req, res) => weatherController.getForecastByCity(req, res));
app.get('/api/forecast/coords/:lat/:lon', (req, res) => weatherController.getForecastByCoordinates(req, res));
app.get('/api/test', (req, res) => weatherController.getTest(req, res));
app.get('/api/debug/test-api', (req, res) => weatherController.testApi(req, res));
app.get('/api/saludo', (req, res) => weatherController.getSaludo(req, res));

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    availableEndpoints: [
      'GET /api/test',
      'GET /api/debug/test-api',
      'GET /api/weather/:city',
      'GET /api/weather/coords/:lat/:lon',
      'GET /api/forecast/:city',
      'GET /api/forecast/coords/:lat/:lon'
    ]
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📡 API del clima con OpenWeatherMap disponible`);
  console.log(`🌤️ Endpoints principales:`);
  console.log(`   • Clima actual: http://localhost:${port}/api/weather/:city`);
  console.log(`   • Pronóstico 5 días: http://localhost:${port}/api/forecast/:city`);
  console.log(`   • Test API: http://localhost:${port}/api/debug/test-api`);
  console.log('🎯 Arquitectura Hexagonal funcionando!');
  
  if (!API_KEY) {
    console.log('⚠️  IMPORTANTE: No se encontró OPENWEATHER_API_KEY en las variables de entorno');
    console.log('   1. Crea un archivo .env con: OPENWEATHER_API_KEY=tu_clave_aqui');
    console.log('   2. Obtén tu API key gratuita en: https://openweathermap.org/api');
  } else {
    console.log('✅ Todo configurado correctamente!');
  }
});