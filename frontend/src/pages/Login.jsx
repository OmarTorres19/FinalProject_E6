// Importamos 'useState' de React para "variables inteligentes".
// Cuando una de variable cambia, React actualiza la pantalla automáticamente.
import { useState } from 'react';

// Importa  estilos 
import '../styles/formStyle.css'; 
import { loginUsuario } from '../api/authApi';
import '../styles/errorStyle.css';

// Definimos el componente Login. En React, un componente es simplemente una función que devuelve diseño (JSX).
const Login = () => {
  // 1.'email' guarda lo que el usuario escribe. 'setEmail' es la función para actualizarlo.
const [email, setEmail] = useState('');

  // 'password' guarda la contraseña. 'setPassword' es la función para actualizarla.
const [password, setPassword] = useState('');

//Estado para mostrar u ocultar la contraseña
const [mostrarPassword, setMostrarPassword] = useState(false);

const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault(); 
    setError(null);
    setCargando(true);

    try {
      // Enviamos los datos al backend usando los nombres de campo que espera la base de datos
      const respuesta = await loginUsuario(email, password);

      if (respuesta.success) {
        // Guardamos el token generado por el backend en el almacenamiento del navegador
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        
        console.log('Login exitoso:', respuesta.message);
        alert(`Bienvenido, ${respuesta.usuario.nombre}`);
        
        // Aquí posteriormente agregaremos la redirección al Dashboard
      }
    } catch (err) {
      // Capturamos el mensaje de error ("Usuario no encontrado", etc.)
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const alternarPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };
  //   DISEÑO 
return (
    // 'class' se convierte en 'className' en React
    <main className="form-container">

      {/* Contenedor del logo de Batman */}
<div className="form-bat-logo" aria-hidden="true">
    
        <svg viewBox="0 0 100 45" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
<path d="M50,8 C45,8 40,14 36,20 C28,20 16,14 0,22 C12,28 20,38 30,36 C36,34 40,28 44,25 C46,24 48,23 50,23 C52,23 54,24 56,25 C60,28 64,34 70,36 C80,38 88,28 100,22 C84,14 72,20 64,20 C60,14 55,8 50,8 Z"/>
        </svg>
</div>
    
    <h2>Access <strong>BatFiles</strong></h2>

      {/* Al formulario le conectamos la función 'manejarEnvio' en el evento onSubmit */}
    <form id="loginForm" onSubmit={manejarEnvio} noValidate>
        
        {/* 'for' se convierte en 'htmlFor' para evitar conflictos con el ciclo 'for' de JavaScript */}
        <label htmlFor="email">Email Address:</label>
        {/* Conectamos el 'value' a nuestra variable 'email' y actualizamos usando 'onChange' */}
        <input 
        type="email" 
        id="email" 
        name="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
        />

        <label htmlFor="password">Password:</label>
        <div className="input-wrapper">
          {/* Si mostrarPassword es true, el tipo es 'text'. Si es false, es 'password' */}
        <input 
            type={mostrarPassword ? "text" : "password"} 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
        />
          {/*  'onclick' (HTML) por 'onClick' (React) y llamamos a nuestra función alternarPassword */}
        <button 
            type="button" 
            className="toggle-password" 
            onClick={alternarPassword} 
            aria-label="Toggle password visibility"
        >
            👁
        </button>
        </div>

        <div className="btnContainer">
        <button className="submit" type="submit">Unlock</button>
        </div>

        <div className="footer-links">
        {/*  */}
        <p><a href="/forgotPassword" className="bat-link">Forgot password?</a></p>
        <p><a href="/register" className="bat-link">Create new account</a></p>
        </div>

    </form>
    </main>
);
};

// Exportamos el componente para que App.jsx lo pueda mostrar
export default Login;