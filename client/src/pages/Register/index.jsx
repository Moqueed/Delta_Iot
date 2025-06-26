import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Form, Select, message, Typography, Card } from "antd";
import { RegisterUser } from "../../api/users";

const { Option } = Select;
const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response) {
        message.success(`${values.role} registration successful! Redirecting to login...`);
        navigate("/login");
      }
    } catch (err) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff"
    }}>
      <Card
        style={{
          width: 400,
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Register
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
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

          <Button type="primary" htmlType="submit" block style={{ marginTop: 10 }}>
            Register
          </Button>
        </Form>

        <Text style={{ display: "block", textAlign: "center", marginTop: 15 }}>
          Already a user? <Link to="/login">Go to Login</Link>
        </Text>
      </Card>
    </div>
  );
};

export default RegisterPage;
