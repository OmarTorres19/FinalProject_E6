import { Link } from "react-router-dom";

function Boton({ texto, url, onClick }) {
  return (
    <Link to={url} className="link-btn" onClick={onClick}>
      {texto}
    </Link>
  );
}

export default Boton;
