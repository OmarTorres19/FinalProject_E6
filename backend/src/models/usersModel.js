import { getConnection } from "../config/database.js";

//SQL Server
//FUNCION OBTENER TODOS LOS USUARIOS
// Se asume que la tabla de usuarios tiene una columna
// llamada "eliminado" para filtrar los usuarios eliminados.
// Eliminacion logica

export const getAllUsers = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
            SELECT *
            FROM users
            WHERE eliminado = 0
        `);

  return result.recordset;
};
// CREACION DE USUARIOS INCLUIMOS:
/*
    nombre
    correo
    contraseña
    preguntarc
    respuestarc
    rol

*/
export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc, rol } = user;

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("correo", correo)
    .input("contrasena", contrasena)
    .input("preguntarc", preguntarc)
    .input("respuestarc", respuestarc)
    .input("rol", rol || "OPERATIVO").query(`
    INSERT INTO users
    (
        nombre,
        correo,
        contrasena,
        preguntarc,
        respuestarc,
        rol
    )
    VALUES
    (
        @nombre,
        @correo,
        @contrasena,
        @preguntarc,
        @respuestarc,
        @rol
    );

    SELECT SCOPE_IDENTITY() AS id;
`);
  // Agregar 'OPERATIVO' al rol POR DEFECTO POR SI VIENE SN ROL

  return result.recordset[0].id;
};

// BUSCAR POR CORREO
export const getByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool.request().input("correo", email).query(`
        SELECT *
        FROM users
        WHERE correo = @correo
        AND eliminado = 0
`);
  return result.recordset[0];
  // Devuelve el usuario encontrado o undefined si no existe
};

// OBTENER USUARIO POR ID
export const getUserById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request().input("id", id).query(`
            SELECT *
            FROM users
            WHERE id = @id AND eliminado = 0
        `);
  return result.recordset[0]; // Devuelve el usuario encontrado o
  // undefined si no existe
};

// ACTUALIZAR USUARIO POR ID
export const updateUserById = async (id, user) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", id)
    .input("nombre", user.nombre)
    .input("correo", user.correo).query(`
        UPDATE users
        SET nombre = @nombre, correo = @correo
        WHERE id = @id AND eliminado = 0;   

        SELECT *
        FROM users
        WHERE id = @id;
    `);
  return result.recordset[0]; // Devuelve el usuario ya actualizado
};

// ELIMINACION LOGICA DE USUARIO POR ID
export const deleteUserById = async (id) => {
  const pool = await getConnection();
  await pool.request().input("id", id).query(`
      UPDATE users
        SET eliminado = 1
        WHERE id = @id
    `);
  return { message: "Usuario eliminado lógicamente" };
};
// VER USUARIO ELIMINADO
export const getDeletedUsers = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
            SELECT *
            FROM users
            WHERE eliminado = 1
        `);

  return result.recordset;
};
// RESTAURAR USUARIO ELIMINADO
export const restoreUserById = async (id) => {
  const pool = await getConnection();
  await pool.request().input("id", id).query(`
      UPDATE users
        SET eliminado = 0
        WHERE id = @id
    `);
  return { message: "Usuario restaurado lógicamente" };
};

//
