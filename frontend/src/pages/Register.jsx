import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import { useToast } from "../components/toastcontext.js";

const initialForm = {
  nombre: "",
  correo: "",
  contrasena: "",
  contrasena_confirmacion: "",
  preguntarc: "",
  respuestarc: "",
};

function Register() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Evita envíos duplicados
    if (cargando || exito) return;

    // Confirmación de contraseña
    if (formData.contrasena !== formData.contrasena_confirmacion) {
      showToast("Las contraseñas no coinciden.", "error");
      return;
    }

      const tieneMayuscula =/[A-Z]/.test(formData.contrasena);
      const tieneMinuscula =/[a-z]/.test(formData.contrasena);
      const tieneNumero = /[0-9]/.test(formData.contrasena);

      if(!tieneMayuscula || !tieneMinuscula || !tieneNumero){
        showToast("La contraseña debe tener al menos una letra mayuscula, minuscula y un numero.","error");
        return;
      }

    setCargando(true);

    try {
      await registerUser(formData);
      setExito(true);
      showToast("Registro exitoso. Regresando a inicio de sesión...", "success");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (requestError) {
      showToast(requestError.message, "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="form-container">
      <h2>
        Únete a la <strong>Bat-Familia</strong>
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

        <label htmlFor="contrasena_confirmacion">Confirma la contraseña:</label>
        <input
          id="contrasena_confirmacion"
          name="contrasena_confirmacion"
          type="password"
          value={formData.contrasena_confirmacion}
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

        <div className="btnContainer">
          <button className="submit" type="submit" disabled={cargando || exito}>
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
