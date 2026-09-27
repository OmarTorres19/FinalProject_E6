import dotenv from "dotenv";
dotenv.config();
// Primero cargamos las variables de entorno

import app from "./src/app.js";
//Después importamos la app (y todo lo que depende de ella)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
