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
import RejectedDataPage from "./pages/HR/RejectedPage";
import TotalMasterDataPage from "./pages/HR/TotalMasterDataPage";
import AboutToJoinPage from "./pages/HR/AboutToJoinPage";
import NewlyJoinedPage from "./pages/HR/NewlyJoinedPage";
import BufferDataPage from "./pages/HR/BufferDataPage";
import AssignToHrPage from "./pages/Admin/AssignToHrPage";
import HRPage from "./pages/Admin/HRPage";


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
        <Route path="/admin-dashboard/assign-to-hr" element={<AssignToHrPage/>}/>
        <Route path="/total-data/rejected-data" element={<RejectedDataPage/>}/>
        <Route path="/total-data/total-master-data" element={<TotalMasterDataPage/>}/>
        <Route path="/total-data/about-to-join" element={<AboutToJoinPage/>}/>
        <Route path="/total-data/newly-joined" element={<NewlyJoinedPage/>}/>
        <Route path="/total-data/buffer-data" element={<BufferDataPage/>}/>
        <Route path="/admin-dashboard/hr-list" element={<HRPage/>}/>
      </Routes>
    </>
  );
}

export default App;
