import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, message, Spin } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const CandidateForm = () => {
  const { id } = useParams(); // Get candidate ID if editing
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 🎯 Pre-fill data if editing
  useEffect(() => {
    const fetchCandidate = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        try {
          const candidates = await getCandidates();
          const selectedCandidate = candidates.find((c) => c.id === parseInt(id));
          if (selectedCandidate) {
            form.setFieldsValue({
              ...selectedCandidate,
              entry_date: dayjs(selectedCandidate.entry_date),
              status_date: dayjs(selectedCandidate.status_date),
            });
          } else {
            message.error("Candidate not found!");
            navigate("/hr-dashboard/active-list");
          }
        } catch (error) {
          message.error("Failed to fetch candidate details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCandidate();
  }, [id, form, navigate]);

  // 🎯 Submit handler for Add/Update
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const candidateData = {
        ...values,
        entry_date: values.entry_date.format("YYYY-MM-DD"),
        status_date: values.status_date.format("YYYY-MM-DD"),
      };

      if (isEditing) {
        await updateCandidate(id, candidateData);
        message.success("Candidate updated successfully!");
      } else {
        await addCandidate(candidateData);
        message.success("Candidate added successfully!");
      }

      navigate("/hr-dashboard/active-list");
    } catch (error) {
      message.error(`Failed to ${isEditing ? "update" : "add"} candidate: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px" }}>
        {isEditing ? "Edit Candidate" : "Add New Candidate"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ progress_status: "Application Received" }}
      >
        <Form.Item name="candidate_name" label="Candidate Name" rules={[{ required: true }]}>
          <Input placeholder="Enter candidate name" />
        </Form.Item>

        <Form.Item name="candidate_email_id" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Select placeholder="Select position">
            <Option value="Python Developer">Python Developer</Option>
            <Option value="EMD Developer">EMD Developer</Option>
            <Option value="Intern">Intern</Option>
            <Option value="Trainee">Trainee</Option>
            <Option value="C++ Developer">C++ Developer</Option>
            <Option value="Accounts">Accounts</Option>
            <Option value="Developer">Developer</Option>
          </Select>
        </Form.Item>

        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Select placeholder="Select department">
            <Option value="IT">IT</Option>
            <Option value="EMDB">EMDB</Option>
            <Option value="HIGH">HIGH</Option>
            <Option value="Financial">Financial</Option>
            <Option value="Python">Python</Option>
          </Select>
        </Form.Item>

        <Form.Item name="progress_status" label="Progress Status" rules={[{ required: true }]}>
          <Select>
            <Option value="Application Received">Application Received</Option>
            <Option value="Phone Screening">Phone Screening</Option>
            <Option value="L1 Interview">L1 Interview</Option>
            <Option value="Yet to Share">Yet to Share</Option>
            <Option value="L2 Interview">L2 Interview</Option>
            <Option value="Shared with Client">Shared with Client</Option>
            <Option value="Final Discussion">Final Discussion</Option>
            <Option value="Offer Released">Offer Released</Option>
            <Option value="Joined">Joined</Option>
            <Option value="Declined Offer">Declined Offer</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Withdrawn">Withdrawn</Option>
            <Option value="No Show">No Show</Option>
            <Option value="Buffer">Buffer</Option>
            <Option value="Hold">Hold</Option>
          </Select>
        </Form.Item>

        <Form.Item name="entry_date" label="Entry Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status_date" label="Status Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {isEditing ? "Update Candidate" : "Add Candidate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CandidateForm;
