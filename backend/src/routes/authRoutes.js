// Importamos el enrutador de Express para gestionar
// las rutas de forma modular
import { Router } from "express";

// Importamos las funciones lógicas desde el controlador
// de autenticación
import { register, login, logout } from "../controllers/authController.js";

// Creamos una instancia del enrutador de Express
const router = Router();

// RUTA DE REGISTRO
// Método: POST
// (ideal para enviar datos sensibles en el cuerpo de la petición)
// Cuando llegue una petición a "/register",
//  se ejecutará la función "register" del controlador.
router.post("/register", register);

// RUTA DE INICIO DE SESIÓN (LOGIN)
// Método: POST
// (recibe correo y contraseña para validarlos
//  y devolver un token JWT)
router.post("/login", login);

// RUTA DE CIERRE DE SESIÓN (LOGOUT)
// Método: POST (limpia la sesión del lado del cliente)
router.post("/logout", logout);

// Exportamos el enrutador para poder montarlo y usarlo en el archivo principal (app.js)
export default router;
