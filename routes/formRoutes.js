/*
   rutas a acciones correspondientes a los 
   métodos HTTP POST y GET según correspondan 
   para las peticiones al servidor.

   En estas rutas se invocan a los controladores
   que son los encargados de procesar las 
   peticiones.
*/

import express from "express";
import { showLanding, showLogin, showForm, processLogin, showValidate, getCriminals, showDashboard, getSecurityQuestion, resetPassword, showForgotPassword, logout, getMe } from "../controllers/formControllers.js";

const router = express.Router();

// Middleware guardia: verifica que haya una sesión activa.
// Si no hay sesión, redirige al login en lugar de cargar la página.
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // Sesión válida → continúa hacia el controlador
    }
    res.redirect("/login"); // Sin sesión → regresa al login
};

// HTML
router.get("/", showLanding);                        // Portada
router.get("/login", showLogin);                     // Pag de login
router.get("/register", showForm);                   // Pag de registro
router.get("/dashboard", requireAuth, showDashboard);// Carga dashb (protegida)
router.get("/logout", logout);                       // Cierra sesión

router.get("/forgotPassword", showForgotPassword);

//ruta para mostrar el dossier de un criminal específico
router.get("/dossier", showDossier);


// APIs
// Aquí se intercambian datos. Se usa /api para saber que estas rutas NO devuelven HTML
router.post("/api/login", processLogin);     // Procesa el intento de entrada
router.post("/api/validate", showValidate);  // Procesa el registro del ususario
router.post("/api/recovery/step1", getSecurityQuestion);
router.post("/api/recovery/step2", resetPassword);
router.get("/api/criminals", requireAuth, getCriminals);  // Carga DATOS (protegida)
router.get("/api/me", requireAuth, getMe);                // Datos del usuario en sesión
router.post("/login", (req, res) => {
   res.redirect("/login?error=js_failed");
});


export default router;