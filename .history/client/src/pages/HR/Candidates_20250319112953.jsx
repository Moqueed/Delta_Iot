import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, message, Spin, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addCandidate, getCandidates, updateCandidate } from "../../api/candidates";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;

const CandidateForm = () => {
  const { id } = useParams(); // Check if editing
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const[attachmentUrl, setAttachmentUrl] = useState(null);
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

      try {
        let uploadedFilePath = attachmentUrl;
  
        // 🎯 Upload file if one is selected
        if (file) {
          const email = values.candidate_email_id;
          const response = await uploadFile(email, file);
          uploadedFilePath = response.candidateResume; // Get the uploaded file path
        }

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
        initialValues={{ progress_status: "Application Received", experience: 0 }}
      >
        {/* 🔥 HR Details */}
        <Form.Item name="HR_name" label="HR Name" rules={[{ required: true }]}>
          <Input placeholder="Enter HR name" />
        </Form.Item>

        <Form.Item name="HR_mail" label="HR Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Enter HR email" />
        </Form.Item>

        {/* 🔥 Candidate Info */}
        <Form.Item name="candidate_name" label="Candidate Name" rules={[{ required: true }]}>
          <Input placeholder="Enter candidate name" />
        </Form.Item>

        <Form.Item name="candidate_email_id" label="Candidate Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true }]}>
          <Input placeholder="Enter contact number" />
        </Form.Item>

        {/* 🔥 Position & Department */}
        <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Select placeholder="Select position">
            {["Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts", "Developer"].map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Select placeholder="Select department">
            {["IT", "EMDB", "Accounts", "Financial", "Python"].map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 🔥 Progress & Status */}
        <Form.Item name="progress_status" label="Progress Status" rules={[{ required: true }]}>
          <Select>
            {[
              "Application Received",
              "Phone Screening",
              "L1 Interview",
              "Yet to Share",
              "L2 Interview",
              "Shared with Client",
              "Final Discussion",
              "Offer Released",
              "Joined",
              "Declined Offer",
              "Rejected",
              "Withdrawn",
              "No Show",
              "Buffer",
              "Hold",
            ].map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 🔥 Dates */}
        <Form.Item name="entry_date" label="Entry Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status_date" label="Status Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* 🔥 Other Details */}
        <Form.Item name="skills" label="Skills">
          <Input.TextArea placeholder="Enter skills" />
        </Form.Item>

        <Form.Item name="experience" label="Experience (Years)">
          <InputNumber min={0} placeholder="Enter years of experience" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="current_ctc" label="Current CTC">
          <Input placeholder="Enter current CTC" />
        </Form.Item>

        <Form.Item name="expected_ctc" label="Expected CTC">
          <Input placeholder="Enter expected CTC" />
        </Form.Item>

        <Form.Item name="Band" label="Band">
          <Select placeholder="Select Band">
            {["L0", "L1", "L2", "L3", "L4"].map((Band) => (
              <Option key={Band} value={Band}>
                {Band}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="notice_period" label="Notice Period">
          <Input placeholder="Enter notice period" />
        </Form.Item>

        <Form.Item name="comments" label="Comments">
          <Input.TextArea placeholder="Add any comments" />
        </Form.Item>

        <Form.Item label="Resume / Attachment">
          <Upload showUploadList={false} customRequest={handleFileUpload} accept=".pdf,.doc,.docx">
            <Button icon={<UploadOutlined />} loading={loading}>
              {attachmentUrl ? "Re-upload" : "Upload Attachment"}
            </Button>
          </Upload>

          {attachmentUrl && (
            <a href={attachmentUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "10px" }}>
              View Resume
            </a>
          )}
        </Form.Item>

        {/* 🔥 Submit Button */}
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
