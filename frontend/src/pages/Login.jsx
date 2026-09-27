import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

import { loginUser } from "../api/authApi.js";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  // ¡Aquí está la variable que faltaba para revivir tu pantalla!
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const result = await loginUser(correo, contrasena);
      onLogin(result.usuario);
      navigate(
        result.usuario.rol === "ADMIN" ? "/users" : "/dashboard",
        { replace: true },
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="form-container">
      <h2>
        Access <strong>BatFiles</strong>
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
        <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <input
            id="contrasena"
            name="contrasena"
            type={mostrarPassword ? "text" : "password"}
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
            autoComplete="current-password"
            required
            style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", margin: 0 }} 
          />
          <button 
            type="button" 
            onClick={() => setMostrarPassword(!mostrarPassword)}
            title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            style={{ 
              position: "absolute",
              right: "10px", 
              backgroundColor: "transparent", 
              border: "none", 
              outline: "none",
              boxShadow: "none",
              cursor: "pointer", 
              padding: 0,
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              height: "auto",
              color: "#f5a623"
            }}
          >
            {mostrarPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        {error && <p role="alert">{error}</p>}

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