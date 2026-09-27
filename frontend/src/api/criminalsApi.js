import { apiClient } from './apiClient.js';

// Función para obtener la lista de criminales mediante GET
export const getCriminals = async () => {
  try {
    // Apuntamos a la ruta de criminales en tu backend
    const response = await apiClient('/criminals', {
      method: 'GET'
    });
    return response; 
  } catch (error) {
    console.error("Error al obtener los expedientes:", error);
    throw error;
  }
};