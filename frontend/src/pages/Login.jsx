import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi.js";
import { useToast } from "../components/toastcontext.js";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (cargando) return;

    setCargando(true);

    try {
      const result = await loginUser(correo, contrasena);
      showToast(`Bienvenido, ${result.usuario.nombre}.`, "success");
      onLogin(result.usuario);
      navigate(
        result.usuario.rol === "ADMIN" ? "/users" : "/dashboard",
        { replace: true },
      );
    } catch (requestError) {
      // apiClient.js decide qué mensaje mostrar
      showToast(requestError.message, "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="form-container">
      <h2>
        Accede a <strong>BatFiles</strong>
      </h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="correo">Correo electrónico:</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="contrasena">Contraseña:</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          value={contrasena}
          onChange={(event) => setContrasena(event.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="btnContainer">
          <button className="submit" type="submit" disabled={cargando}>
            {cargando ? "Verificando..." : "Iniciar sesión"}
          </button>
        </div>

        <p className="helper">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
