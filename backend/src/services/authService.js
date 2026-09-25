import bcrypt from "bcryptjs";

import { createUser, getByEmail } from "../models/usersModel.js";

import { validateUser, validateLogin } from "../validators/userValidator.js";

import { generateToken } from "../utils/jwt.js";

// REGISTRO DE USUARIOS
export const register = async (userData) => {
  validateUser(userData);

  const existingUser = await getByEmail(userData.correo);

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

  const id = await createUser({
    ...userData,
    contrasena: hashedPassword,
  });

  return {
    id,
    message: "Usuario registrado correctamente",
  };
};

// LOGIN DE USUARIOS
export const login = async (correo, contrasena) => {
  validateLogin({
    correo,
    contrasena,
  });

  const user = await getByEmail(correo);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const validPassword = await bcrypt.compare(contrasena, user.contrasena);

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = generateToken(user);

  return {
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    },
  };
};
