import { Navigate } from "react-router-dom";
import { message } from "antd";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (token && userRole === role) {
    return children;
  }

  // Show an error message and redirect to login
  message.error("Unauthorized access. Redirecting to login...");
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
