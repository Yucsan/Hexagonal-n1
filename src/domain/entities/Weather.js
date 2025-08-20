// src/domain/entities/Weather.js

class Weather {
  constructor({
    location,
    temperature,
    feelsLike,
    description,
    humidity,
    pressure,
    windSpeed,
    windDirection,
    windDegrees,
    windGust,
    visibility,
    icon
  }) {
    this.location = location;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.description = description;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.windDegrees = windDegrees;
    this.windGust = windGust;
    this.visibility = visibility;
    this.icon = icon;
  }

  toJSON() {
    return {
      location: this.location,
      temperature: this.temperature,
      feelsLike: this.feelsLike,
      description: this.description,
      humidity: this.humidity,
      pressure: this.pressure,
      windSpeed: this.windSpeed,
      windDirection: this.windDirection,
      windDegrees: this.windDegrees,
      windGust: this.windGust,
      visibility: this.visibility,
      icon: this.icon
    };
  }
}

module.exports = Weather;