/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { showLanding, showLogin,showDossier, showForm, processLogin, showValidate, getCriminals, showDashboard, showUser, getSecurityQuestion, resetPassword, showForgotPassword } from "../controllers/formControllers.js"; 

const router = express.Router();

// HTML
router.get("/", showLanding);                // Portada
router.get("/login", showLogin);             // Pag de login
router.get("/register", showForm);           // Pag de registro
router.get("/dashboard", showDashboard);     // Carga dashb
router.get("/user", showUser);

router.get("/forgotPassword", showForgotPassword);

//ruta para mostrar el dossier de un criminal específico
router.get("/dossier", showDossier);


// APIs
// Aquí se intercambian datos. Se usa /api para saber que estas rutas NO devuelven HTML
router.post("/api/login", processLogin);     // Procesa el intento de entrada
router.post("/api/validate", showValidate);  // Procesa el registro del ususario
router.post("/api/recovery/step1", getSecurityQuestion);
router.post("/api/recovery/step2", resetPassword);
router.get("/api/criminals", getCriminals);  // Carga DATOS de los criminales
router.post("/login", (req, res) => {
   res.redirect("/login?error=js_failed");
});


export default router;