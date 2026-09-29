import bcrypt from "bcryptjs";

import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getDeletedUsers,
  restoreUserById,
} from "../models/usersModel.js";

// Obtener todos los usuarios
export const getUsers = async () => {
  return await getAllUsers();
};

// Obtener usuario por ID
export const getUser = async (id) => {
  const user = await getUserById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

// Actualizar usuario
export const updateUser = async (id, userData) => {
  const user = await getUserById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Se separa la contraseña del resto de los datos
  const { contrasena, ...datos } = userData;

  // Solo si se envió una contraseña nueva, se encripta igual que en el registro
  if (contrasena) {
    datos.contrasena = await bcrypt.hash(contrasena, 10);
  }

  return await updateUserById(id, datos);
};

// Eliminar usuario (eliminación lógica)
export const deleteUser = async (id) => {
  const user = await getUserById(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return await deleteUserById(id);
};

// Obtener usuarios eliminados
export const getDeleted = async () => {
  return await getDeletedUsers();
};

// Restaurar usuario eliminado
export const restoreUser = async (id) => {
  return await restoreUserById(id);
};
