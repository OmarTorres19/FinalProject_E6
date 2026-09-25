import * as usersService from "../services/usersService.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await usersService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await usersService.getUser(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const result = await usersService.deleteUser(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Obtener usuarios eliminados
export const getDeletedUsers = async (req, res) => {
  try {
    const users = await usersService.getDeleted();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Restaurar usuario
export const restoreUser = async (req, res) => {
  try {
    const result = await usersService.restoreUser(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
