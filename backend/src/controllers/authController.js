import * as authService from "../services/authService.js";

// CONTROLADOR PARA EL REGISTRO
export const register = async (req, res) => {
  try {
    // Llama al servicio de registro pasando todo el cuerpo de la petición (req.body)
    const result = await authService.register(req.body);

    // Si todo sale bien, responde con un código HTTP 201 (Creado) y los datos
    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    // Si ocurre un error (correo duplicado, validación fallida), responde con un error 400
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CONTROLADOR PARA EL LOGIN
export const login = async (req, res) => {
  try {
    // Extrae el correo y la contraseña que mandó el cliente
    const { correo, contrasena } = req.body;

    // Ejecuta la función de login del servicio
    const result = await authService.login(correo, contrasena);

    // Si las credenciales son correctas, regresa un código 200 y el Token JWT
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      ...result, // Aquí va incluido el token
    });
  } catch (error) {
    // Si el correo no existe o la contraseña falla, responde con error 401 (No autorizado)
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// CONTROLADOR PARA EL LOGOUT
export const logout = async (req, res) => {
  try {
    // Como trabajamos con JWT almacenado en el cliente (localStorage/sessionStorage),
    // el backend simplemente confirma la orden de cierre de sesión exitosa.
    return res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
