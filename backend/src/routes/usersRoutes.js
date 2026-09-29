import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDeletedUsers,
  restoreUser,
  switchRoleDemo // <-- Lo importamos de tu controlador de backend
} from "../controllers/usersController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrOperativo } from "../middleware/roleMiddleware.js";

const router = Router();

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

// Cmabiar de rol
router.post('/switch-role', authMiddleware, switchRoleDemo);

export default router;