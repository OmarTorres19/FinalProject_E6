import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteUser, getUsers } from "../api/usersApi.js";
import UserCard from "../components/UserCard.jsx";

function Users({ currentUser, onLogout }) {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("gallery");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const result = await getUsers();
        if (active) setUsers(Array.isArray(result) ? result : []);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => { active = false; };
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Deseas eliminar lógicamente a ${user.nombre}?`)) return;

    setError("");
    setDeletingId(user.id);
    try {
      await deleteUser(user.id);
      setUsers((currentUsers) =>
        currentUsers.filter((current) => current.id !== user.id),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="wide-container">
      <header className="hero">
        <h1>Administración de usuarios</h1>
        <p className="welcome-msg">
          Administrador: {currentUser.nombre} · {currentUser.rol}
        </p>

        <nav className="page-nav" aria-label="Acciones de administración">
          <Link className="nav-link" to={`/users/${currentUser.id}/edit`}>
            Editar mi perfil
          </Link>
          <Link className="nav-link" to="/users/deleted">
            Usuarios eliminados
          </Link>
          <button className="nav-link btn-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </nav>

        <div className="view-toggle" aria-label="Presentación de usuarios">
          <button
            className={view === "gallery" ? "tab active" : "tab"}
            type="button"
            onClick={() => setView("gallery")}
          >
            Galería
          </button>
          <button
            className={view === "table" ? "tab active" : "tab"}
            type="button"
            onClick={() => setView("table")}
          >
            Tabla
          </button>
        </div>
      </header>

      {loading && <p className="status-message">Cargando usuarios...</p>}
      {error && <p className="status-message error" role="alert">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="status-message">No hay usuarios activos.</p>
      )}

      {!loading && users.length > 0 && view === "gallery" && (
        <section className="card-grid" aria-live="polite">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              deleting={deletingId === user.id}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}

      {!loading && users.length > 0 && view === "table" && (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td className="table-actions">
                    <Link className="link-btn compact" to={`/users/${user.id}/edit`}>
                      Editar
                    </Link>
                    <button
                      className="danger-button compact"
                      type="button"
                      disabled={deletingId === user.id || String(user.id) === String(currentUser.id)}
                      onClick={() => handleDelete(user)}
                    >
                      {deletingId === user.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Users;
