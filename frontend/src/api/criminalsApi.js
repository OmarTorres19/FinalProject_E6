import { apiClient } from "./apiClient.js";

// Este endpoint conserva el contrato que utilizaba el dashboard HTML anterior.
// La interfaz muestra un mensaje claro mientras el backend nuevo no lo exponga.
export function getCriminals() {
  return apiClient("/criminals");
}
