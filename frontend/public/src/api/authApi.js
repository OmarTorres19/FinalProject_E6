
import { apiClient } from './apiClient';

export const loginUsuario = async (correo, contrasena) => {
  // Apuntamos al endpoint POST
  return await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, contrasena }),
  });
};