import {
  getAllCriminals,
  getCriminalById,
} from "../models/criminalRecordModel.js";

// Obtener todos
export const getCriminals = async (req, res) => {
  try {
    const criminals = await getAllCriminals();

    res.status(200).json(criminals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtener por ID
export const getCriminal = async (req, res) => {
  try {
    const criminal = await getCriminalById(req.params.id);

    if (!criminal) {
      return res.status(404).json({
        message: "Criminal no encontrado",
      });
    }

    res.status(200).json(criminal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
