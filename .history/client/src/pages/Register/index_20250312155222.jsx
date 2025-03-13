import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button, Input, Form, message } from "antd";
import { RegisterUser } from "../../api/users";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response) {
        message.success("Registration successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (err) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <Form.Item name="name" rules={[{ required: true, message: "Please enter your name" }]}> 
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}> 
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}> 
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Register</Button>
        </Form.Item>

        <p className="text-center">
          Already a user? <Link to="/login" className="text-blue-500">Go to Login</Link>
        </p>
      </Form>
    </div>
  );
};

export default RegisterPage;
