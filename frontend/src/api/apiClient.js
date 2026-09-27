

// URL base del backend 
const BASE_URL = 'http://localhost:5000/api';

export const apiClient = async (endpoint, options = {}) => {
  // Configuración estándar para enviar datos en formato JSON
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // Si la petición falla (ej. contraseña incorrecta), lanzamos el mensaje del backend
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
};