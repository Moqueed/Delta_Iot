import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";
import { Form, Button, Input } from "antd";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await LoginUser(values);
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
      <Form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onFinish={handleLogin}
      >
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </Button>

        <p className="mt-4 text-center">
          New user?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
