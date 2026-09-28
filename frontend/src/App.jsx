import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import EditUser from "./pages/EditUser.jsx";
import DeletedUsers from "./pages/DeletedUsers.jsx";
import Dossier from "./pages/Dossier.jsx"; // Componente del Dossier
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { logoutUser } from "./api/authApi.js";
import NotFound from "./pages/NotFound.jsx";

function clearStoredSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

function getDefaultRoute(user) {
  return user?.rol === "ADMIN" ? "/users" : "/dashboard";
}

function RoleRedirect({ user }) {
  return <Navigate to={getDefaultRoute(user)} replace />;
}

// La firma del JWT siempre se valida en el backend. Esta lectura del campo
// "exp" únicamente evita conservar visualmente una sesión que ya caducó.
function isTokenExpired(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const { exp } = JSON.parse(atob(normalizedPayload));

    return typeof exp !== "number" || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// Recupera la sesión guardada al recargar la aplicación.
// Si el almacenamiento quedó incompleto, corrupto o expirado, se limpia.
function readStoredUser() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("usuario");

  if (!token || !storedUser || isTokenExpired(token)) {
    clearStoredSession();
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearStoredSession();
    return null;
  }
}

function App() {
  // App adalah el único propietario del estado global de autenticación.
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  // apiClient emite este evento cuando el servidor rechaza el JWT.
  // Así el estado de React y localStorage permanecen sincronizados.
  useEffect(() => {
    const handleUnauthorized = () => setCurrentUser(null);

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleCurrentUserUpdated = (updatedUser) => {
    setCurrentUser((previousUser) => {
      if (!previousUser || String(previousUser.id) !== String(updatedUser.id)) {
        return previousUser;
      }

      // Conserva únicamente los datos de sesión que utiliza la interfaz.
      const sessionUser = {
        id: previousUser.id,
        nombre: updatedUser.nombre,
        correo: updatedUser.correo,
        rol: updatedUser.rol || previousUser.rol,
      };

      localStorage.setItem("usuario", JSON.stringify(sessionUser));
      return sessionUser;
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Si la API no responde, el cierre local todavía debe completarse.
    } finally {
      // La sesión local siempre se limpia, aunque el servidor no responda.
      clearStoredSession();
      setCurrentUser(null);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home currentUser={currentUser} onLogout={handleLogout} />
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <RoleRedirect user={currentUser} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? <RoleRedirect user={currentUser} /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={currentUser}>
              <Dashboard
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        
        {/* <-- 2. Agregamos la ruta protegida para el Dossier de Criminales --> */}
        <Route
          path="/dossier"
          element={
            <ProtectedRoute user={currentUser}>
              <Dossier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <AdminRoute user={currentUser}>
              <Users
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            </AdminRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute user={currentUser}>
              <EditUser
                currentUser={currentUser}
                onCurrentUserUpdated={handleCurrentUserUpdated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/deleted"
          element={
            <AdminRoute user={currentUser}>
              <DeletedUsers />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;