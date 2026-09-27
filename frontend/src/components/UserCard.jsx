import { Link } from "react-router-dom";

function UserCard({ user, currentUser, deleting, onDelete }) {
  const isCurrentUser = String(user.id) === String(currentUser.id);

  return (
    <article className="card">
      <div className="card-body">
        <span className="chip">{user.rol}</span>
        <h2>{user.nombre}</h2>
        <p>{user.correo}</p>

        <div className="card-actions">
          <Link className="link-btn" to={`/users/${user.id}/edit`}>
            Editar
          </Link>
          <button
            className="danger-button"
            type="button"
            disabled={deleting || isCurrentUser}
            title={isCurrentUser ? "No puedes eliminar tu propia sesión" : undefined}
            onClick={() => onDelete(user)}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default UserCard;
