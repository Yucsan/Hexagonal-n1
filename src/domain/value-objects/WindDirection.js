// src/domain/value-objects/WindDirection.js

// 🎯 VALUE OBJECT - Inmutable, representa un concepto del dominio
class WindDirection {
  constructor(degrees) {
    this.validateDegrees(degrees);
    this.degrees = parseFloat(degrees);
    this.direction = this.calculateDirection(degrees);
    this.description = this.getDescription();
  }

  // 🔥 LÓGICA DE DOMINIO PURA
  validateDegrees(degrees) {
    if (degrees < 0 || degrees > 360) {
      throw new Error('Los grados del viento deben estar entre 0 y 360');
    }
  }

  calculateDirection(degrees) {
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 
      'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 
      'W', 'WNW', 'NW', 'NNW'
    ];
    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  getDescription() {
    const descriptions = {
      'N': 'Norte',
      'NNE': 'Norte-Noreste',
      'NE': 'Noreste',
      'ENE': 'Este-Noreste',
      'E': 'Este',
      'ESE': 'Este-Sureste',
      'SE': 'Sureste',
      'SSE': 'Sur-Sureste',
      'S': 'Sur',
      'SSW': 'Sur-Suroeste',
      'SW': 'Suroeste',
      'WSW': 'Oeste-Suroeste',
      'W': 'Oeste',
      'WNW': 'Oeste-Noroeste',
      'NW': 'Noroeste',
      'NNW': 'Norte-Noroeste'
    };
    
    return descriptions[this.direction] || 'Desconocido';
  }

  // Métodos de dominio
  isNortherly() {
    return ['N', 'NNE', 'NNW'].includes(this.direction);
  }

  isSoutherly() {
    return ['S', 'SSE', 'SSW'].includes(this.direction);
  }

  isEasterly() {
    return ['E', 'ENE', 'ESE'].includes(this.direction);
  }

  isWesterly() {
    return ['W', 'WNW', 'WSW'].includes(this.direction);
  }

  // Value Objects son inmutables e iguales por valor
  equals(other) {
    if (!(other instanceof WindDirection)) return false;
    return this.degrees === other.degrees;
  }

  toString() {
    return `${this.direction} (${this.degrees}°)`;
  }

  toJSON() {
    return {
      degrees: this.degrees,
      direction: this.direction,
      description: this.description
    };
  }
}

module.exports = WindDirection;