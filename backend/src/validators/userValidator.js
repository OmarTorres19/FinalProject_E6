export const validateUser = (user) => {
  // EL OBJETO USER DEBE TENER LOS CAMPOS:
  //  nombre, correo, contrasena, preguntarc, respuestarc, rol
  const { nombre, correo, contrasena, preguntarc, respuestarc, rol } = user;

  //VALIDACIONES DE LOS CAMPOS DEL OBJETO USER
  if (!nombre || nombre.trim().length < 2) {
    throw new Error("Nombre inválido");
  }

  if (!correo || !correo.includes("@")) {
    throw new Error("Correo inválido");
  }

  if (!contrasena || contrasena.length < 6) {
    throw new Error("Contraseña inválida");
  }

  if (!preguntarc) {
    throw new Error("Pregunta de recuperación requerida");
  }

  if (!respuestarc) {
    throw new Error("Respuesta de recuperación requerida");
  }

  if (rol && rol !== "ADMIN" && rol !== "OPERATIVO") {
    throw new Error("Rol inválido");
  }

  return true;
};

//VALIDACIÓN DE LOGIN
export const validateLogin = (user) => {
  const { correo, contrasena } = user;

  if (!correo || !correo.includes("@")) {
    throw new Error("Correo inválido");
  }

  if (!contrasena) {
    throw new Error("Contraseña requerida");
  }

  return true;
};
