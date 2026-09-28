import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCriminals } from '../api/criminalsApi.js'; // <-- 1. Importamos la API de tu equipo

export default function Dossier() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [criminal, setCriminal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCriminal() {
      try {
        // 2. Usamos la función de tu equipo que ya incluye el token JWT y la ruta base
        const data = await getCriminals();
        
        // 3. Comparamos asegurando que ambos sean cadenas de texto
        const found = data.find(item => String(item.id) === String(id));
        
        if (found) {
          setCriminal(found);
        }
      } catch (error) {
        console.error("Error al cargar el dossier del criminal:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCriminal();
  }, [id]);

  return (
    <div className="error-page" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <main className="form-container" style={{ maxWidth: '900px', position: 'relative', width: '100%' }}>
        
        <Link to="/dashboard" className="link-btn btn-logout-top"
          style={{ position: 'absolute', top: '-50px', right: 0, fontSize: '0.7rem', padding: '5px 12px', borderColor: 'var(--danger)', color: 'var(--danger)', textDecoration: 'none' }}>
          Exit Cave
        </Link>

        <div className="dossier-card" style={{ background: '#1a1a1a', border: '2px solid var(--border)', padding: '40px', position: 'relative' }}>
          <div className="confidential-stamp">CLASSIFIED</div>

          <h1 style={{ color: 'var(--accent)', marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
            {loading ? 'LOADING...' : (criminal ? criminal.alias : 'DOSSIER NOT FOUND')}
          </h1>

          <div className="dossier-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', marginTop: '20px' }}>
            <div className="photo-side">
              {/* Solo renderiza la imagen si criminal existe, evitando el error de src="" en la consola */}
              {criminal?.image ? (
                <img src={criminal.image} alt={criminal.alias || 'Criminal'} className="photo-frame"
                  style={{ width: '100%', border: '8px solid #fff', filter: 'grayscale(0.2)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' }} />
              ) : (
                <div className="photo-frame" style={{ width: '100%', height: '300px', border: '8px solid #fff', backgroundColor: '#333' }}></div>
              )}
              <p style={{ fontSize: '0.6rem', textAlign: 'center', marginTop: '5px', color: '#888' }}>ARKHAM STATE HOSPITAL - DEPT OF PSYCHIATRY</p>
            </div>

            <div className="info-side">
              <div className="label" style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '15px' }}>Subject Name</div>
              <div className="value" style={{ color: '#fff', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>{criminal?.name || '---'}</div>

              <div className="label" style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '15px' }}>Threat Assessment</div>
              <div className="value" style={{ color: '#fff', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>{criminal?.dangerLevel || '---'}</div>

              <div className="label" style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '15px' }}>Psychological Profile / Notes</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.5', color: '#ccc', background: 'rgba(0,0,0,0.3)', padding: '10px', borderLeft: '3px solid var(--accent)' }}>
                {criminal?.description || 'No profile data available.'}
              </p>

              <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                <Link to="/dashboard" className="link-btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                  « Close Dossier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}