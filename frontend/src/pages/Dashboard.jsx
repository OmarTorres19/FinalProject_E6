import { useEffect, useState } from "react";

import { getCriminals } from "../api/criminalsApi.js";

const dangerClasses = {
  Extreme: "chip-extreme",
  High: "chip-high",
  Moderate: "chip-moderate",
};

function DashboardSkeleton() {
  return (
    <section className="criminal-grid" aria-label="Cargando expedientes">
      {[1, 2, 3].map((item) => (
        <article className="card skeleton-card" key={item}>
          <div className="skeleton-media" />
          <div className="card-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line long" />
            <div className="skeleton-line long" />
          </div>
        </article>
      ))}
    </section>
  );
}

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
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
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

      {loading && <DashboardSkeleton />}
      {error && <p className="status-message error" role="alert">{error}</p>}

      {!loading && !error && criminals.length === 0 && (
        <p className="status-message">No hay expedientes disponibles.</p>
      )}

      {!loading && !error && (
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
                  ◈ Danger: {criminal.dangerLevel || "Unclassified"}
                </span>
                <h3>{criminal.alias || criminal.name}</h3>
                {criminal.alias && <p><strong>Real Name:</strong> {criminal.name}</p>}
                <p className="card-crime">⚑ Crime: {criminal.crime}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Dashboard;
