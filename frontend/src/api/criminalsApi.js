import { apiClient } from "./apiClient";

export const getCriminals = async () => {
  return await apiClient("/criminals");
};

export const getCriminalById = async (id) => {
  return await apiClient(`/criminals/${id}`);
};
