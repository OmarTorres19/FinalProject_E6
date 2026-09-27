import { apiClient } from './apiClient.js';

// Conectamos directamente con el backend real en lugar de usar datos de prueba
export const getCriminals = async () => {
  try {
    const response = await apiClient('/criminals', {
      method: 'GET'
    });
    return response; 
  } catch (error) {
    console.error("Error al obtener los expedientes:", error);
    throw error;
  }
};


