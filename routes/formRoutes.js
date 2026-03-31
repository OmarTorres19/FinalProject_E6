/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { showLanding, showLogin, showForm, processLogin, showValidate } from "../controllers/formControllers.js";

const router = express.Router();

router.get("/", showLanding);                // Portada
router.get("/login", showLogin);             // Pag de login
router.get("/register", showForm);           // Pag de registro
router.post("/api/login", processLogin);
router.post("/", showValidate);              // Procesa el registro

export default router;