import * as usersService from "../services/usersService.js";
import jwt from 'jsonwebtoken';

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
    // Si es Operativo, su ID debe coincidir con el ID que está buscando
    if (req.user.rol === 'OPERATIVO' && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Privacidad: No tienes permiso para ver los datos de otra persona." });
    }

    const user = await usersService.getUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    // Si es Operativo, su ID debe coincidir con el ID que intenta editar
    if (req.user.rol === 'OPERATIVO' && req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Intrusión: No tienes permiso para editar el perfil de otros usuarios." });
    }

    const user = await usersService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

export const switchRoleDemo = async (req, res) => {
  try {
    const currentUser = req.user;
    const newRole = currentUser.rol === 'ADMIN' ? 'OPERATIVO' : 'ADMIN';

    const newToken = jwt.sign(
      { id: currentUser.id, rol: newRole },
      process.env.JWT_SECRET,
      { expiresIn: '2h'}
    );

    res.status(200).json({
      message: "Modo simulador activado",
      token: newToken,
      newRole
    });
  } catch (error) {
    res.status(500).json({ message: "Error al forzar el cambio de rol"});
  }
};
