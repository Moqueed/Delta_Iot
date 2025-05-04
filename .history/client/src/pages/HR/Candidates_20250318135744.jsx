import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { addCandidate } from "../api/candidateRoutes";

const AddCandidate = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await addCandidate(values);
      message.success("Candidate added successfully!");
      navigate("/active-list");
    } catch (error) {
      console.error("Error adding candidate:", error);
      message.error(error.response?.data?.message || "Failed to add candidate");
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="candidate_email_id" label="Email" rules={[{ required: true }]}>
        <Input placeholder="Enter candidate email" />
      </Form.Item>
      <Form.Item name="progress_status" label="Progress Status" rules={[{ required: true }]}>
        <Input placeholder="Enter progress status" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Add Candidate
      </Button>
    </Form>
  );
};

export default AddCandidate;
