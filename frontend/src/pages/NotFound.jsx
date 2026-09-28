import { useNavigate } from "react-router-dom";
// Importamos la hoja de estilos que contiene los colores y formas de la batiseñal
import "../styles/errorStyle.css";

function NotFound() {
  // Botón de regreso)
  const navigate = useNavigate();

 
  const goBack = () => {
    // El número -1 le indica que navegue a la página anterior en el historial
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="bat-signal">
        <div className="batman"></div>
      </div>

      <h1 className="title">404</h1>
      <p className="message">
        This route is not available…<br />
        Gotham is still watching.
      </p>
      <button onClick={goBack}>Back home</button>
    </div>
  );
}

export default NotFound;