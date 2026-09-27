import { useState } from 'react';
import { registrarUsuario } from '../api/authApi';
import '../styles/formStyle.css';

const Register = () => {
  // Manejará todos los campos requeridos por la base de datos 
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    preguntarc: '',
    respuestarc: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Función para actualizar cualquier campo del formulario
  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Envia el objeto con todos los datos a tu API
      const respuesta = await registrarUsuario(formData);
      
      if (respuesta.success) {
        setMensaje({ texto: '¡Registro exitoso! Ya puedes iniciar sesión.', tipo: 'exito' });
        // Limpiamos el formulario tras un registro exitoso
        setFormData({ nombre: '', correo: '', contrasena: '', preguntarc: '', respuestarc: '' });
      }
    } catch (error) {
      setMensaje({ texto: error.message || 'Error al registrar el usuario', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="form-container">
      <h2>Join the <strong>Bat-Family</strong></h2>
      
      {/* Alertas para éxito o error */}
      {mensaje.texto && (
        <div style={{ color: mensaje.tipo === 'error' ? '#ff4d4d' : '#4CAF50', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={manejarEnvio} noValidate>
        <label htmlFor="nombre">Alias (Nombre):</label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={manejarCambio} required />

        <label htmlFor="correo">Bat-Email (Correo):</label>
        <input type="email" id="correo" name="correo" value={formData.correo} onChange={manejarCambio} required />

        <label htmlFor="contrasena">Password:</label>
        <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={manejarCambio} required />

        <label htmlFor="preguntarc">Security Question:</label>
        <input type="text" id="preguntarc" name="preguntarc" value={formData.preguntarc} onChange={manejarCambio} required placeholder="Ej: Nombre de tu primera mascota" />

        <label htmlFor="respuestarc">Answer:</label>
        <input type="text" id="respuestarc" name="respuestarc" value={formData.respuestarc} onChange={manejarCambio} required />

        <div className="btnContainer">
          <button className="submit" type="submit" disabled={cargando}>
            {cargando ? 'Processing...' : 'Verify ID'}
          </button>
        </div>

        <div className="footer-links">
          <p><a href="/login" className="bat-link">Already have an account? Login here</a></p>
        </div>
      </form>
    </main>
  );
};

export default Register;