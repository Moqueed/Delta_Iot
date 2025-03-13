import { Navigate, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HRDashboard from "./pages/HR/HRDashboard";

function App() {
  return (
    <div>
        <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><HRDashboard/></ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;
