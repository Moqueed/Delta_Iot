import { Navigate } from "react-router-dom";
import { message } from "antd";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    message.error("Please log in first!");
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    message.error("Unauthorized access!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
