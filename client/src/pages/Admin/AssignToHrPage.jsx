import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { assignCandidateToHR } from "../../api/assignToHr";



const AssignToHrPage = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

const handleSubmit = async (values) => {
  const formData = new FormData();
  formData.append("HR_mail", values.hr_email); // ✅ backend expects HR email
  formData.append("HR_name", values.hr_name);  // ✅ backend expects HR name
  formData.append("candidate_name", values.candidate_name); // ✅
  formData.append("candidate_email_id", values.candidate_email); // ✅
  formData.append("position", values.position);
  formData.append("contact_number", values.contact_number || "");
  formData.append("comments", values.comments || "");

  if (file) {
    formData.append("attachments", file); // ✅ backend expects "attachments"
  }

  try {
    const res = await assignCandidateToHR(formData);
    message.success(res.message);
    form.resetFields();
    setFile(null);
  } catch (err) {
    console.error(err);
    message.error(err.message || "Failed to assign candidate");
  }
};

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="HR Email" name="hr_email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="HR Name" name="hr_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Candidate Name" name="candidate_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Candidate Email" name="candidate_email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

       <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Select placeholder="Select position">
            {["Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts", "Developer"].map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
        </Form.Item>

      <Form.Item label="Contact Number" name="contact_number">
        <Input />
      </Form.Item>

      <Form.Item label="Comments" name="comments">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Resume">
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false; // prevent auto upload
          }}
          onRemove={() => setFile(null)}
          fileList={file ? [file] : []}
        >
          <Button icon={<UploadOutlined />}>Select Resume</Button>
        </Upload>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        send
      </Button>
    </Form>
  );
};

export default AssignToHrPage;
