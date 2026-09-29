import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getUserById, updateUser } from "../api/usersApi.js";

const passwordsVacias = { contrasena: "", contrasena_confirmacion: "" };

function EditUser({ currentUser, onCurrentUserUpdated }) {
  const { id } = useParams();
  const isAdmin = currentUser.rol === "ADMIN";
  const isOwnProfile = String(currentUser.id) === id;
  const returnPath = isAdmin ? "/users" : "/dashboard";
  const [formData, setFormData] = useState({ nombre: "", correo: "" });
  const [passwords, setPasswords] = useState(passwordsVacias);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAdmin && !isOwnProfile) return undefined;

    let active = true;

    async function loadUser() {
      try {
        const user = await getUserById(id);
        if (active) {
          setFormData({ nombre: user.nombre || "", correo: user.correo || "" });
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();
    return () => { active = false; };
  }, [id, isAdmin, isOwnProfile]);

  if (!isAdmin && !isOwnProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // Campos de la nueva contraseña (se guardan aparte)
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    setError("");
    setSuccess("");

    const quiereCambiarContrasena =
      passwords.contrasena !== "" || passwords.contrasena_confirmacion !== "";

    // Solo se revisa la contraseña si el usuario escribió una nueva
    if (quiereCambiarContrasena) {
      if (passwords.contrasena !== passwords.contrasena_confirmacion) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      if (passwords.contrasena.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      const tieneMayuscula = /[A-Z]/.test(passwords.contrasena);
      const tieneMinuscula = /[a-z]/.test(passwords.contrasena);
      const tieneNumero = /[0-9]/.test(passwords.contrasena);

      if (!tieneMayuscula || !tieneMinuscula || !tieneNumero) {
        setError("La contraseña debe tener al menos una letra mayúscula,una minúscula y un numero");
        return;
      }
    }

    // Se envían nombre y correo; la contraseña solo si se escribió una nueva
    const datos = quiereCambiarContrasena
      ? { ...formData, contrasena: passwords.contrasena }
      : formData;

    setSaving(true);

    try {
      const updatedUser = await updateUser(id, datos);
      onCurrentUserUpdated(updatedUser);
      setPasswords(passwordsVacias);
      setSuccess(
        quiereCambiarContrasena
          ? "Usuario y contraseña actualizados correctamente."
          : "Usuario actualizado correctamente.",
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="form-container">
      <h2>Editar usuario</h2>

      {loading ? (
        <p className="status-message">Cargando usuario...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="correo">Correo electrónico:</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            required
          />

          <label htmlFor="contrasena">Nueva contraseña:</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={passwords.contrasena}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />

          <label htmlFor="contrasena_confirmacion">Confirma la nueva contraseña:</label>
          <input
            id="contrasena_confirmacion"
            name="contrasena_confirmacion"
            type="password"
            value={passwords.contrasena_confirmacion}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />

          <p className="hint">
            Déjala vacía si no quieres cambiarla. Debe tener al menos 6 caracteres,
            una mayúscula, una minúscula y un número.
          </p>

          {error && <p className="message" role="alert">{error}</p>}
          {success && <p className="success-message" role="status">{success}</p>}

          <div className="btnContainer">
            <button className="submit" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <Link className="link-btn" to={returnPath}>Cancelar</Link>
          </div>
        </form>
      )}
    </main>
  );
}

export default EditUser;
