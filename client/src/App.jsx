import { Route, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HRDashboard from "./pages/HR/HRDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TotalDataPage from "./pages/HR/TotalDataPage";
import ActivePositions from "./pages/Admin/ActivePositions";
import HRVacancy from "./pages/HR/HRVacancy";
import CandidateForm from "./pages/HR/Candidates";
import ActiveListPage from "./pages/HR/ActiveListPage";
import ApprovalsPage from "./pages/Admin/ApprovalsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute role="HR">
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
        <Route path="/total-data" element={<TotalDataPage />} />
        <Route
          path="/admin-dashboard/active-positions"
          element={<ActivePositions />}
        />
        <Route path="/hr-dashboard/vacancies" element={<HRVacancy />} />
        <Route path="/hr-dashboard/add-candidate" element={<CandidateForm />} />
        <Route
          path="/admin-dashboard/add-candidate"
          element={
            <ProtectedRoute role="Admin">
              <CandidateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-dashboard/active-list"
          element={
            <ProtectedRoute role="HR">
              <ActiveListPage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin-dashboard/active-list"
          element={
            <ProtectedRoute role="Admin">
              <ActiveListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/approvals"
          element={
            <ProtectedRoute role="Admin">
              <ApprovalsPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
