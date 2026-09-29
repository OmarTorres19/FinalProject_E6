import { apiClient } from "./apiClient.js";

export function getUsers() {
  return apiClient("/users");
}

export function getUserById(id) {
  return apiClient(`/users/${id}`);
}

export function updateUser(id, userData) {
  return apiClient(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export function deleteUser(id) {
  return apiClient(`/users/${id}`, {
    method: "DELETE",
  });
}

export function getDeletedUsers() {
  return apiClient("/users/deleted");
}

export function restoreUser(id) {
  return apiClient(`/users/${id}/restore`, {
    method: "PATCH",
  });
}
export function changeUserRole(id, rol) {
  return apiClient(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ rol }),
  });
}