/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { showForm } from "../controllers/formControllers.js"
import { showValidate } from "../controllers/formControllers.js";

const router = express.Router();

router.get("/createaccount", formVIJS);
router.post("/createaccount", formVIJS);

router.get("/user", formUser);
router.post("/user", formUser);

export default router;