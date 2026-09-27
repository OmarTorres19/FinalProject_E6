import { apiClient } from "./apiClient";

export function registerUser(userData) {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(correo, contrasena) {
  const result = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo,
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 2749adb4b6272cafc71965a0fd4387dffa5edd93
