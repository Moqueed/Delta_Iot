import { Navigate } from "react-router-dom";
import { message } from "antd";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    message.error("Please log in first!");
    return <Navigate to="/login" replace />;
  }

  const rolesArray = Array.isArray(role) ? role.map(r => r.toLowerCase()) : [role.toLowerCase()];

  if (!rolesArray.includes(userRole?.toLowerCase())) {
    message.error("Unauthorized access!");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
