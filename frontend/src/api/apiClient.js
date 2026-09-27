const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw new Error(data?.message || "Error al comunicarse con el servidor");
  }

  return data;
}
