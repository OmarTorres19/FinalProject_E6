import { useState, useEffect } from 'react';
import Boton from './componentes/Boton.jsx';
import './formStyle.css';

const SERVIDOR = 'http://localhost:5000';

const paginas = [
  { id: 1, nombre: 'Register', texto: 'Join Bat‑Family', url: '/register' },
  { id: 2, nombre: 'Login', texto: 'Verify ID', url: '/login' }
];

function App() {
  const [seleccionada, setSeleccionada] = useState(null);
  useEffect(()=>{
    const limpiar = () => setSeleccionada(null);
    window.addEventListener ('pageshow', limpiar);
    return () => window.removeEventListener ('pageshow', limpiar);
  }, []);

  return (
    <>
      <main class="wide-container">

        <header class="hero">
            <div class="hero-logo" aria-hidden="true">
                <svg viewBox="0 0 100 45" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M50,8 C45,8 40,14 36,20 C28,20 16,14 0,22 C12,28 20,38 30,36 C36,34 40,28 44,25 C46,24 48,23 50,23 C52,23 54,24 56,25 C60,28 64,34 70,36 C80,38 88,28 100,22 C84,14 72,20 64,20 C60,14 55,8 50,8 Z"/>
                </svg>
            </div>
            <h1>BatFiles</h1>
            <p class="hero-subtitle">Arkham Database — Restricted Access</p>
            <p>Welcome. Verify your identity to access the most wanted dossiers of Gotham.</p>
            <p class="hero-quote">"The night is darkest just before the dawn."</p>

          <div className="bottom-actions" aria-label="Access options">
            {paginas.map((pagina) => (
              <Boton
                key={pagina.id}
                texto={pagina.texto}
                url={SERVIDOR + pagina.url}
                onClick={() => setSeleccionada(pagina.nombre)}
              />
            ))}
          </div>

          {seleccionada && <p className="hero-subtitle">Redirecting to {seleccionada}...</p>}
        </header>
      </main>

      <section className="gotham-strip" aria-hidden="true"></section>
    </>
  );
}

export default App;
