const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Store user role in localStorage

  // Check if the user has a valid token and matches the required role
  if (token && userRole === role) {
    return children;
  }

  return null; // No redirection — just prevent rendering
};

export default ProtectedRoute;
