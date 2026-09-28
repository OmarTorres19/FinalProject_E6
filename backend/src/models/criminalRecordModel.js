import { getConnection } from "../config/database.js";

// Obtener todos los criminales
export const getAllCriminals = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT *
    FROM criminals
    ORDER BY id
  `);

  return result.recordset;
};

// Obtener criminal por ID
export const getCriminalById = async (id) => {
  const pool = await getConnection();

  const result = await pool.request().input("id", id).query(`
      SELECT *
      FROM criminals
      WHERE id = @id
    `);

  return result.recordset[0];
};
