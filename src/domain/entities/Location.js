// src/domain/entities/Location.js
class Location {
  constructor({ name, country, latitude, longitude, timezone }) {
    this.validateCoordinates(latitude, longitude);
    
    this.name = name;
    this.country = country;
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.timezone = timezone;
  }

  // 🔥 LÓGICA DE DOMINIO - Validaciones geográficas
  validateCoordinates(lat, lon) {
    if (lat < -90 || lat > 90) {
      throw new Error('Latitud debe estar entre -90 y 90 grados');
    }
    
    if (lon < -180 || lon > 180) {
      throw new Error('Longitud debe estar entre -180 y 180 grados');
    }
  }

  // Métodos de dominio
  getFullName() {
    return `${this.name}, ${this.country}`;
  }

  getCoordinatesString() {
    return `${this.latitude},${this.longitude}`;
  }

  // Calcular distancia entre dos ubicaciones (fórmula de Haversine)
  distanceTo(otherLocation) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(otherLocation.latitude - this.latitude);
    const dLon = this.toRadians(otherLocation.longitude - this.longitude);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(this.latitude)) * 
              Math.cos(this.toRadians(otherLocation.latitude)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Determinar si está en el mismo país
  isInSameCountry(otherLocation) {
    return this.country.toLowerCase() === otherLocation.country.toLowerCase();
  }

  toJSON() {
    return {
      name: this.name,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude,
      timezone: this.timezone,
      fullName: this.getFullName(),
      coordinates: this.getCoordinatesString()
    };
  }
}

module.exports = Location;