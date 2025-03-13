import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Input, Typography, Card } from "antd";
import { LoginUser } from "../../api/users";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (values) => {
    setEmailError("");
    setPasswordError("");

    try {
      const response = await LoginUser(values);

      if (response.token) {
        localStorage.setItem("token", response.token);

        const decoded = jwtDecode(response.token);
        console.log("✅ Decoded Token:", decoded);
        localStorage.setItem("role", decoded.role);

        // Success message
        message.success(`Welcome, ${decoded.role}!`);

        // Redirect based on role
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
      const errorMsg = err.response?.data?.error;
      if (errorMsg === "Invalid email") {
        setEmailError("Invalid email. Please check and try again.");
      } else if (errorMsg === "Invalid password") {
        setPasswordError("Invalid password. Please try again.");
      } else {
        setEmailError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fff" }}>
      <Card style={{ width: 400, padding: 20, borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Login</Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[{ required: true, message: "Please enter your email" }]}
            validateStatus={emailError ? "error" : ""}
            help={emailError}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Password</Text>}
            rules={[{ required: true, message: "Please enter your password" }]}
            validateStatus={passwordError ? "error" : ""}
            help={passwordError}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 10 }}>Login</Button>
        </Form>

        <Text style={{ display: "block", textAlign: "center", marginTop: 15 }}>
          New user? <Link to="/register">Register here</Link>
        </Text>
      </Card>
    </div>
  );
};

export default LoginPage;
