import { Navigate, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HRDashboard from "./pages/HR/HRDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute role="hr">
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
