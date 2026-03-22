/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { mostrarFormulario } from "../controllers/formControllers.js"

const router = express.Router();

router.get("/", mostrarFormulario);

export default router;