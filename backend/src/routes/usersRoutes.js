import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDeletedUsers,
  restoreUser,
} from "../controllers/usersController.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", getUsers);

// Obtener usuarios eliminados
router.get("/deleted", getDeletedUsers);

// Obtener usuario por ID
router.get("/:id", getUserById);

// Actualizar usuario
router.put("/:id", updateUser);

// Eliminación lógica
router.delete("/:id", deleteUser);

// Restaurar usuario
router.patch("/:id/restore", restoreUser);

export default router;
