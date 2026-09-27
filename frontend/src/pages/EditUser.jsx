import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getUserById, updateUser } from "../api/usersApi.js";

function EditUser({ currentUser, onCurrentUserUpdated }) {
  const { id } = useParams();
  const isAdmin = currentUser.rol === "ADMIN";
  const isOwnProfile = String(currentUser.id) === id;
  const returnPath = isAdmin ? "/users" : "/dashboard";
  const [formData, setFormData] = useState({ nombre: "", correo: "" });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updatedUser = await updateUser(id, formData);
      onCurrentUserUpdated(updatedUser);
      setSuccess("Usuario actualizado correctamente.");
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
