import Boton from './components/Boton.jsx';
import './styles/formStyle.css';

import Boton from "../components/Boton";

function Home() {
    return (
        <main className="wide-container">
            <header className="hero">

                <div className="hero-logo">
                    <svg
                        viewBox="0 0 100 45"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                    >
                        <path d="M50,8 C45,8 40,14 36,20 C28,20 16,14 0,22 C12,28 20,38 30,36 C36,34 40,28 44,25 C46,24 48,23 50,23 C52,23 54,24 56,25 C60,28 64,34 70,36 C80,38 88,28 100,22 C84,14 72,20 64,20 C60,14 55,8 50,8 Z" />
                    </svg>
                </div>

                <h1>BatFiles</h1>

                <p className="hero-subtitle">
                    Arkham Database — Restricted Access
                </p>

                <p>
                    Welcome. Verify your identity to access the BatFiles.
                </p>

                <div className="bottom-actions">

                    <Boton
                        texto="Join Bat-Family"
                        url="/register"
                    />

                    <Boton
                        texto="Verify ID"
                        url="/login"
                    />

                </div>

            </header>
        </main>
    );
}

export default Home;