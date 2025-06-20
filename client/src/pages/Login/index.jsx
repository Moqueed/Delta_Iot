import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Input, Select, Typography, Card, message } from "antd";
import { LoginUser } from "../../api/users";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;
const { Option } = Select;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  console.log("Navigate function:", navigate);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await LoginUser(values);
  
      if (response.token) {
        localStorage.setItem("token", response.token);
  
        const decoded = jwtDecode(response.token);
        console.log("✅ Decoded Token:", decoded);
        localStorage.setItem("role", values.role);
  
        message.success(`Welcome, ${values.role}!`);
  
        // Redirect based on role
        const userRole = values.role.toLowerCase();
        navigate(userRole === "admin" ? "/admin-dashboard" : "/hr-dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      message.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fff" }}>
      <Card style={{ width: 500, padding: 20, borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Login</Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Password</Text>}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            name="role"
            label={<Text strong>Role</Text>}
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              <Option value="HR">HR</Option>
              <Option value="Admin">Admin</Option>
            </Select>
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
