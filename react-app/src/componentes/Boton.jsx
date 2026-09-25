function Boton({ texto, url, onClick }) {
  return (
    <a href={url} className="link-btn" onClick={onClick}>
      {texto}
    </a>
  );
}

export default Boton;
