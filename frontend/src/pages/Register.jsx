import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi.js";

const initialForm = {
  nombre: "",
  correo: "",
  contrasena: "",
  preguntarc: "",
  respuestarc: "",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      await registerUser(formData);
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="form-container">
      <h2>
        Join the <strong>Bat-Family</strong>
      </h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <label htmlFor="correo">Correo electrónico:</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="contrasena">Contraseña:</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          value={formData.contrasena}
          onChange={handleChange}
          autoComplete="new-password"
          minLength="6"
          required
        />

        <label htmlFor="preguntarc">Pregunta de recuperación:</label>
        <select
          id="preguntarc"
          name="preguntarc"
          value={formData.preguntarc}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una opción...</option>
          <option value="favColor">Color favorito</option>
          <option value="petName">Nombre de tu mascota</option>
          <option value="birthYear">Año de nacimiento</option>
        </select>

        <label htmlFor="respuestarc">Respuesta de recuperación:</label>
        <input
          type="text"
          id="respuestarc"
          name="respuestarc"
          value={formData.respuestarc}
          onChange={handleChange}
          required
        />

        {error && <p role="alert">{error}</p>}

        <div className="btnContainer">
          <button className="submit" type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>

        <p className="helper">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
