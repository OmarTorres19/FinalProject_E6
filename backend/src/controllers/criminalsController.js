import criminals from "../data/criminals.js";

// Devuelve los expedientes necesarios para construir el dashboard.
export const getCriminals = (req, res) => {
  return res.status(200).json(criminals);
};
