import { apiClient } from "./apiClient";

const limpiarTexto = (texto = "") => texto.trim().replace(/\s+/g, " ");
const limpiarCorreo = (correo = "") => correo.trim().toLowerCase();

export function registerUser(userData) {
  const datosLimpios ={
    ...userData,
    nombre: limpiarTexto(userData.nombre),
    correo: limpiarCorreo(userData.correo),
    respuestarc: limpiarTexto(userData.respuestarc),
  };

  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(datosLimpios),
  });
}

export async function loginUser(correo, contrasena) {
  const result = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo: limpiarCorreo(correo),
      contrasena,
    }),
  });

  localStorage.setItem("token", result.token);
  localStorage.setItem(
    "usuario",
    JSON.stringify(result.usuario),
  );

  return result;
}

export async function logoutUser() {
  await apiClient("/auth/logout", {
    method: "POST",
  });

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}