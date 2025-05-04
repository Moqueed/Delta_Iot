import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, message, Spin, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const CandidateForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const navigate = useNavigate();

  // 🎯 Fetch data if editing
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
            setAttachmentUrl(selectedCandidate.attachments);
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

  // 🎯 Handle file upload
  const handleFileUpload = async ({ file }) => {
    setLoading(true);
    try {
      const response = await uploadAttachment(file);
      setAttachmentUrl(response.filePath);
      message.success("Attachment uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Submit handler for Add/Update
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const candidateData = {
        ...values,
        entry_date: values.entry_date.format("YYYY-MM-DD"),
        status_date: values.status_date.format("YYYY-MM-DD"),
        attachments: attachmentUrl,
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
        initialValues={{ progress_status: "Application Received", experience: 0 }}
      >
        {/* 🔥 Candidate Name */}
        <Form.Item name="candidate_name" label="Candidate Name" rules={[{ required: true }]}>
          <Input placeholder="Enter candidate name" />
        </Form.Item>

        {/* 🔥 Email */}
        <Form.Item name="candidate_email_id" label="Candidate Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* 🔥 Position */}
        <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Select placeholder="Select position">
            {["Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts", "Developer"].map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 🔥 File Upload */}
        <Form.Item label="Resume / Attachment">
          <Upload showUploadList={false} customRequest={handleFileUpload} accept=".pdf,.doc,.docx">
            <Button icon={<UploadOutlined />} loading={loading}>
              {attachmentUrl ? "Re-upload" : "Upload Attachment"}
            </Button>
          </Upload>

          {attachmentUrl && (
            <a href={attachmentUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "10px" }}>
              View Attachment
            </a>
          )}
        </Form.Item>

        {/* 🔥 Submit */}
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
