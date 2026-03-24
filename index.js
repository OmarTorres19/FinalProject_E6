/* 
   Archivo principal que inicia el servidor.
   Responsabilidades:
     1. Configurar Express
     2. Leer variables de entorno
     3. Registrar middlewares
     4. Registrar rutas
     5. Servir archivos estáticos (assets)


  Se requiere configurar el proyecto nodeJS
  
  1. Iniciarlizar proyecto
     npm init -y ------ asigna valores por defecto en 
                 ------ la configuración de package.json

   2. Instalar dependencias para el proyecto: en este caso
      Express para el servidor HTTP para procesar peticiones
      a través de envíos POST y GET.

      npm install express

      npm install --save-dev nodemon

*/

/*app.disable('x-powered-by');*/

import express from "express";
import path from "path"; //Maneja rutas de archivos (nativo de Node)
import { fileURLToPath } from "url"; //Convierte URL->ruta de archivo

import formRoutes from "./routes/formRoutes.js"; //Mis rutas personalizadas

// asigna puerto para atender peticiones
/**
 * | Rango       | Tipo        | Uso recomendado                                 |
| ----------- | ----------- | ----------------------------------------------- |
| 0-1023      | Well-known  | ❌ Reservados (HTTP=80, HTTPS=443, FTP=21, etc.) |
| 1024-49151  | Registrados | ✅ Desarrollo (3000, 4000, 5000, 8080)           |
| 49152-65535 | Dinámicos   | ✅ Temporales                                    |
 */

const port = 5000;

//convertimos a app en un objeto con métodos .use() .get() .listen()
const app = express() //Instancia de clase express -> Objeto app


//Transforma cuerpos JSON de tipo POST -> Objs JavaScript. Se ejecuta SIEMPRE en todos los requests
app.use(express.json()); //Función Middleware incorporada de Express

//Procesa formularios HTML.
app.use(express.urlencoded({ extended: true })); //extended:true - permite objetos anidados en formularios
//<form name="Juan&age=25> → req.body = {name: "Juan", age: "25"}


const __filename = fileURLToPath(import.meta.url); // toma toda la ruta y el nombre del archivo .../index.js
const __dirname = path.dirname(__filename);        // toma solo la ruta .../Torres_WebApp
//                path.join(__dirname, "public") → /ruta/al/proyecto/public


//asocia contenido estático. Se ejecuta ANTES que formRoutes
app.use("/", express.static(path.join(__dirname, "public")));


//Rutas
app.use("/", formRoutes); // ./routes/formRoutes.js


//Asociamos puerto con el servidor
app.listen(port, () => {
   console.log(`Servidor ejecutándose en http://localhost:${port}`);
})


//Flujo completo de una petición
/*
1. Navegador: GET http://localhost:3000/contacto
2. app.listen() recibe petición
3. Express ejecuta middlewares EN ORDEN:
   a) express.json() ✓ (no hay JSON)
   b) express.urlencoded() ✓ (no hay form)
   c) express.static("/") ❌ (no existe public/contacto.html)
   d) formRoutes("/") → formRoutes.get('/contacto') ✓
4. formRoutes responde → Navegador muestra página
*/


//Orden Visual
/*
app.use(express.json())     ← 1° SIEMPRE
app.use(express.urlencoded()) ← 2° SIEMPRE  
app.use("/", express.static()) ← 3° Archivos primero
app.use("/", formRoutes)     ← 4° Rutas personalizadas

*/