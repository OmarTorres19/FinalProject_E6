import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCriminals } from "../api/criminalsApi.js";
import { switchRoleSimulation } from "../api/usersApi.js"; // <-- Importamos nuestra nueva función

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

  const handleSwitchRole = async () => {
    try {
      // 1. Ejecutamos la petición limpia
      const response = await switchRoleSimulation();
      
      // 2. Sobrescribimos el token viejo y el usuario en el localStorage
      localStorage.setItem('token', response.token);
      
      // Actualizamos también el localStorage del usuario para que al recargar lea el nuevo rol
      const updatedUser = { ...currentUser, rol: response.newRole };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));

      // 3. Recargamos la página correctamente
      window.location.reload(); 
    } catch (error) {
      console.error("Fallo al ejecutar la puerta trasera:", error);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadCriminals() {
      try {
        const result = await getCriminals();
        if (active) {
          setCriminals(Array.isArray(result) ? result : []);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCriminals();
    return () => { active = false; };
  }, []);

  return (
    <main className="wide-container">
      <header className="hero">
         <button className="btn-logout btn-logout-top" 
         type="button"
         onClick={onLogout}
         >
            Cerrar sesión
          </button>
        <h1>Gotham Most Wanted</h1>
        <p>Accessing Arkham Asylum Criminal Files...</p>
        <p className="welcome-msg">
          Bienvenido, {currentUser.nombre} · {currentUser.rol}
        </p>

        <nav className="page-nav" aria-label="Acciones del operativo">
          {/* Botón de cambio de rol dinámico */}
          <button 
            className="nav-link" 
            onClick={handleSwitchRole}
            style={{ border: '1px solid #ffcc00', color: '#ffcc00', marginRight: '10px' }}
          >
            Modo Simulador ({currentUser.rol === 'ADMIN' ? 'Operativo' : 'Admin'})
          </button>
          
          <button className="nav-link btn-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      {/* ... El resto de tu renderizado (loading, error, criminal-grid) se queda exactamente igual ... */}
      
      {loading && <DashboardSkeleton />}
      {error && <p className="status-message error" role="alert">{error}</p>}
      
      {!loading && !error && (
        <section className="criminal-grid" aria-live="polite">
          {criminals.map((criminal) => (
            <Link to={`/dossier?id=${criminal.id}`} key={criminal.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article className="card">
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
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

export default Dashboard;