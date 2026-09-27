import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDeletedUsers, restoreUser } from "../api/usersApi.js";

function DeletedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDeletedUsers() {
      try {
        const result = await getDeletedUsers();
        if (active) setUsers(Array.isArray(result) ? result : []);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDeletedUsers();
    return () => { active = false; };
  }, []);

  const handleRestore = async (user) => {
    setError("");
    setRestoringId(user.id);

    try {
      await restoreUser(user.id);
      setUsers((currentUsers) =>
        currentUsers.filter((current) => current.id !== user.id),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <main className="wide-container">
      <header className="hero">
        <h1>Usuarios eliminados</h1>
        <p>Restauración de cuentas eliminadas lógicamente.</p>
        <Link className="link-btn" to="/users">
          Volver a usuarios activos
        </Link>
      </header>

      {loading && <p className="status-message">Cargando usuarios eliminados...</p>}
      {error && <p className="status-message error" role="alert">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="status-message">No hay usuarios eliminados.</p>
      )}

      <section className="card-grid" aria-live="polite">
        {users.map((user) => (
          <article className="card" key={user.id}>
            <div className="card-body">
              <span className="chip">{user.rol}</span>
              <h2>{user.nombre}</h2>
              <p>{user.correo}</p>
              <div className="card-actions">
                <button
                  className="submit"
                  type="button"
                  disabled={restoringId === user.id}
                  onClick={() => handleRestore(user)}
                >
                  {restoringId === user.id ? "Restaurando..." : "Restaurar"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default DeletedUsers;
