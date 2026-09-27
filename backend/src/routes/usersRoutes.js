import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDeletedUsers,
  restoreUser,
} from "../controllers/usersController.js";

// 1. Importamos a tus guardias usando la sintaxis ES Modules
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrOperativo } from "../middleware/roleMiddleware.js";

const router = Router();

// 2. Colocamos a los guardias según las restricciones de rol dictadas en el proyecto

// Obtener todos los usuarios (ADMIN: Ver todos)
router.get("/", authMiddleware, isAdmin, getUsers);

// Obtener usuarios eliminados (ADMIN: Restaurar todos)
router.get("/deleted", authMiddleware, isAdmin, getDeletedUsers);

// Obtener usuario por ID (OPERATIVO: Ver sus datos / ADMIN: Ver todos)
router.get("/:id", authMiddleware, isAdminOrOperativo, getUserById);

// Actualizar usuario (OPERATIVO: Modificar sus datos / ADMIN: Editar todos)
router.put("/:id", authMiddleware, isAdminOrOperativo, updateUser);

// Eliminación lógica (ADMIN: Eliminar todos. Operativo no puede)
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

// Restaurar usuario (ADMIN: Restaurar todos. Operativo no puede)
router.patch("/:id/restore", authMiddleware, isAdmin, restoreUser);

export default router;