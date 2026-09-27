import { useEffect, useState } from "react";
import { getCriminals } from "../api/criminalsApi.js";

// Modificado: Ahora mapea los valores en español de tu base de datos
const dangerClasses = {
  Extremo: "chip-extreme",
  Alto: "chip-high",
  Moderado: "chip-moderate",
};

function Dashboard({ currentUser, onLogout }) {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Esta es una excelente práctica de tu equipo para evitar errores si el usuario cambia de pantalla rápido
    let active = true;

    async function loadCriminals() {
      try {
        const result = await getCriminals();
        if (active) {
          // Nos aseguramos de leer los datos sin importar si el backend los envía directo o dentro de un objeto { data: [...] }
          setCriminals(Array.isArray(result) ? result : (result.data || []));
        }
      } catch {
        if (active) {
          // Modificado: Mensaje actualizado porque tu API ya existe
          setError("Error al conectar con la base de datos de Arkham. Por favor, intenta de nuevo.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCriminals();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="wide-container">
      <header className="hero">
        <h1>Gotham Most Wanted</h1>
        <p>Accessing Arkham Asylum Criminal Files...</p>
        
        {/* Validamos que currentUser exista para evitar que la página se rompa al leer .nombre */}
        {currentUser && (
          <p className="welcome-msg">
            Bienvenido, {currentUser.nombre} · {currentUser.rol}
          </p>
        )}

        <nav className="page-nav" aria-label="Acciones del operativo">
          <button className="nav-link btn-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      {loading && <p className="status-message">Cargando expedientes...</p>}
      {error && <p className="status-message error" role="alert">{error}</p>}

      {!loading && !error && criminals.length === 0 && (
        <p className="status-message">No hay expedientes disponibles en la base de datos.</p>
      )}

      <section className="criminal-grid" aria-live="polite">
        {criminals.map((criminal) => (
          <article className="card" key={criminal.id}>
            {/* Se conserva la lógica de imagen por si en el futuro decides agregar URL de fotos a tu base de datos */}
            {criminal.image && (
              <div className="card-media">
                <img src={criminal.image} alt={criminal.alias || criminal.nombre} />
              </div>
            )}
            <div className="card-body">
              {/* Modificado: criminal.nivel_peligro */}
              <span className={`chip ${dangerClasses[criminal.nivel_peligro] || ""}`}>
                Peligro: {criminal.nivel_peligro || "Sin clasificar"}
              </span>
              
              {/* Modificado: criminal.nombre en lugar de criminal.name */}
              <h2>{criminal.alias || criminal.nombre}</h2>
              {criminal.alias && <p>Nombre real: {criminal.nombre}</p>}
              
              {/* Modificado: criminal.estado en lugar de criminal.crime */}
              <p className="card-crime">Estado actual: {criminal.estado}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;