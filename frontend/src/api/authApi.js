import { apiClient } from './apiClient';

export const loginUsuario = async (email, password) => {
  // Apunta al endpoint POST con el correo y la contraseña que el usuario ingresó en el formulario de login.
  return await apiClient('/api/auth/login', {
    method: 'POST',
    // Traduce las variables de React ('email', 'password')los nombres exactos que el authController exige ('correo', 'contrasena')
    body: JSON.stringify({ correo: email, contrasena: password }),
  });
};