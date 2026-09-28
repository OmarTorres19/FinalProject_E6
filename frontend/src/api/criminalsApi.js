import { apiClient } from "./apiClient"; // Asegúrate de importar con llaves si se exportó nombrada

export const getCriminals = async () => {
  return await apiClient("/criminals");
};

export const getCriminalById = async (id) => {
  return await apiClient(`/criminals/${id}`);
};
