<<<<<<< HEAD
function Boton({ texto, url, onClick }) {
  return (
    <a href={url} className="link-btn" onClick={onClick}>
      {texto}
    </a>
=======
import { Link } from "react-router-dom";

function Boton({ texto, url, onClick }) {
  return (
    <Link to={url} className="link-btn" onClick={onClick}>
      {texto}
    </Link>
>>>>>>> origin/Scarlett
  );
}

export default Boton;
