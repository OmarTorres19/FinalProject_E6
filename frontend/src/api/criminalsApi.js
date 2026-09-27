import { apiClient } from "./apiClient.js";

// Recupera los expedientes que utilizaba el dashboard HTML anterior.
export function getCriminals() {
  return apiClient("/criminals");
}
