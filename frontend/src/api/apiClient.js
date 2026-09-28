const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MENSAJES = {
  red: "No se pudo conectar con el servidor. Verifica que esté encendido e inténtalo de nuevo.",
  validacion: "Algunos datos no son válidos. Revísalos e inténtalo de nuevo.",
  sesion: "Tu sesión expiró o no es válida. Inicia sesión de nuevo.",
  permisos: "No tienes permiso para realizar esta acción.",
  noEncontrado: "No se encontró lo que buscabas.",
  conflicto: "Ese registro ya existe.",
  servidor: "Ocurrió un error en el servidor. Inténtalo más tarde.",
  desconocido: "Error al comunicarse con el servidor.",
};

export class ApiError extends Error {
  constructor(message, status, tipo) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.tipo = tipo;
  }
}

function tipoPorStatus(status) {
  if (status === 400 || status === 422) return "validacion";
  if (status === 401) return "sesion";
  if (status === 403) return "permisos";
  if (status === 404) return "noEncontrado";
  if (status === 409) return "conflicto";
  if (status >= 500) return "servidor";
  return "desconocido";
}

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(MENSAJES.red, 0, "red");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const tipo = tipoPorStatus(response.status);

    if (response.status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    if (tipo === "servidor") {
      throw new ApiError(MENSAJES.servidor, response.status, tipo);
    }

    throw new ApiError(
      data?.message || MENSAJES[tipo],
      response.status,
      tipo,
    );
  }

  return data;
}