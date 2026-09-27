import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
