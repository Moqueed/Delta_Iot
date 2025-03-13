import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginUser({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          New user? <a href="/" className="text-blue-500 hover:underline">Register here</a>
        </p>
      </form>
    </div>
  );
};


export default LoginPage;
