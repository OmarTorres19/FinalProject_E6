import { useEffect, useState } from "react";

import { getCriminals } from "../api/criminalsApi.js";

const dangerClasses = {
  Extreme: "chip-extreme",
  High: "chip-high",
  Moderate: "chip-moderate",
};

function Dashboard({ currentUser, onLogout }) {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCriminals() {
      try {
        const result = await getCriminals();
        if (active) {
          setCriminals(Array.isArray(result) ? result : []);
        }
      } catch {
        if (active) {
          setError(
            "El dashboard ya está en React, pero la API de expedientes todavía no está disponible en el backend actual.",
          );
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
        <p className="welcome-msg">
          Bienvenido, {currentUser.nombre} · {currentUser.rol}
        </p>

        <nav className="page-nav" aria-label="Acciones del operativo">

          <button className="nav-link btn-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      {loading && <p className="status-message">Cargando expedientes...</p>}
      {error && <p className="status-message error" role="alert">{error}</p>}

      {!loading && !error && criminals.length === 0 && (
        <p className="status-message">No hay expedientes disponibles.</p>
      )}

      <section className="criminal-grid" aria-live="polite">
        {criminals.map((criminal) => (
          <article className="card" key={criminal.id}>
            {criminal.image && (
              <div className="card-media">
                <img src={criminal.image} alt={criminal.alias || criminal.name} />
              </div>
            )}
            <div className="card-body">
              <span className={`chip ${dangerClasses[criminal.dangerLevel] || ""}`}>
                Peligro: {criminal.dangerLevel || "Sin clasificar"}
              </span>
              <h2>{criminal.alias || criminal.name}</h2>
              {criminal.alias && <p>Nombre real: {criminal.name}</p>}
              <p className="card-crime">Crimen: {criminal.crime}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
