import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Input, message } from "antd";
import { LoginUser } from "../../api/users";
import jwtDecode from "jwt-decode"; 

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await LoginUser(values);

      if (response.token) {
        localStorage.setItem("token", response.token);

        // 🎯 Decode JWT to extract role
        const decoded = jwtDecode(response.token);
        localStorage.setItem("role", decoded.role);

        message.success(`Welcome, ${decoded.role}!`);

        // 🔥 Redirect based on role
        if (decoded.role === "Admin") {
          navigate("/admin-dashboard");
        } else if (decoded.role === "HR") {
          navigate("/hr-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      message.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onFinish={handleLogin}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
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
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
