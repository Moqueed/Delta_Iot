import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/Register";
import { LoginUser } from "./api/users";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
