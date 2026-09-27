import { getConnection } from "../config/database.js";

export const getCriminals = async (req, res) => {
  try {
    // Conectamos a la base de datos usando tu archivo de configuración
    const pool = await getConnection();
    
    // Ejecuta la consulta real para traer a los villanos
    const result = await pool.request().query("SELECT * FROM criminals");
    
    // Envia los datos al frontend (la librería mssql guarda los datos en 'recordset')
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener criminales de la BD:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener los expedientes" });
  }
};