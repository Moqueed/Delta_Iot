import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import {
  deleteActiveCandidate,
  requestReview,
  updateActiveList,
  UpdateTotalMasterData,
  UpdateAboutToJoin,
  updateNewlyJoined,
  updateBufferData,
} from "../../api/activeList";
import { updateRejectedCandidate } from "../../api/rejected";
import { uploadResumeToAll } from "../../api/upload"; // Make sure this exists
import "./CandidateForm.css";

const { Option } = Select;

const rejectedStatuses = ["rejected", "declined offer", "no show", "withdrawn"];

const CandidateForm = ({ candidate, onUpdate }) => {
  const [form] = Form.useForm();
  const [isRejected, setIsRejected] = useState(
    rejectedStatuses.includes(candidate.progress_status.toLowerCase())
  );
  const [resumeUrl, setResumeUrl] = useState(candidate.attachments || "");

  const handleFormChange = (_, allValues) => {
    setIsRejected(
      rejectedStatuses.includes((allValues.progress_status || "").toLowerCase())
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const email = form.getFieldValue("candidate_email_id");
      if (!email) {
        message.error("Please fill candidate email before uploading.");
        return;
      }

      const res = await uploadResumeToAll(email, file);
      if (res?.candidateResume) {
        setResumeUrl(res.candidateResume);

        await updateActiveList({
          ...form.getFieldsValue(),
          candidate_id: candidate.candidate_id,
          attachments: res.candidateResume,
        });

        message.success("Resume uploaded and synced with Active List");
        onUpdate();
      } else {
        message.error("Failed to upload resume");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Error uploading resume");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const status = values.progress_status.toLowerCase();

      if (rejectedStatuses.includes(status)) {
        await updateRejectedCandidate(
          candidate.id,
          values.progress_status,
          values.rejection_reason || "Moved to rejected from Active List"
        );
        await deleteActiveCandidate(candidate.candidate.id);
        message.success(
          "Candidate moved to rejected and removed from Active List"
        );
      } else if (
        [
          "application received",
          "phone screening",
          "l1 interview",
          "yet to share",
          "l2 interview",
          "shared with client",
        ].includes(status)
      ) {
        await UpdateTotalMasterData(candidate.id, status);
        message.success("Candidate moved to Total Master Data");
      } else if (
        ["offer released", "final discussion", "hr round cleared"].includes(
          status
        )
      ) {
        await UpdateAboutToJoin(candidate.id, status);
        message.success("Candidate moved to About To Join");
      } else if (["joined"].includes(status)) {
        await updateNewlyJoined(candidate.id, status);
        message.success("Candidate moved to Newly Joined");
      } else if (["hold", "buffer"].includes(status)) {
        await updateBufferData(candidate.id, status);
        message.success("Candidate moved to Buffer Data");
      } else {
        await updateActiveList({
          ...values,
          candidate_id: candidate.candidate_id,
          attachments: resumeUrl,
        });
        message.success("Candidate updated successfully");
      }

      onUpdate();
    } catch (error) {
      console.error("Error updating candidate:", error);
      message.error("Error updating candidate");
    }
  };

  const handleReview = async () => {
    try {
      await requestReview(
        candidate.candidate_email_id,
        candidate.HR_name,
        candidate.progress_status
      );
      message.success(`Review requested for ${candidate.candidate_name}`);
    } catch (error) {
      console.error("Review error:", error);
      message.error("Failed to request review");
    }
  };

  return (
    <Form
      className="candidate-form compact-candidate-form"
      form={form}
      layout="vertical"
      initialValues={{
        ...candidate,
        entry_date: dayjs(candidate.entry_date),
        status_date: dayjs(candidate.status_date),
      }}
      onValuesChange={handleFormChange}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="HR_name" label="HR Name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="HR_mail" label="HR Email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="entry_date" label="Entry Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="candidate_name" label="Candidate Name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="candidate_email_id" label="Candidate Email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contact_number" label="Contact Number">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="profile_stage" label="Profile Stage">
            <Select>
              <Option value="Open">Open</Option>
              <Option value="Closed">Closed</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="current_company" label="Current Company">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="current_location" label="Current Location">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="permanent_location" label="Permanent Location">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="qualification" label="Qualification">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="experience" label="Experience (Years)">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="skills" label="Skills">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="current_ctc" label="Current CTC">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="expected_ctc" label="Expected CTC">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="band" label="Band">
            <Select>
              {["L0", "L1", "L2", "L3", "L4"].map((b) => (
                <Option key={b} value={b}>
                  {b}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="reference" label="Reference">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="position" label="Position">
            <Select>
              {[
                "Python Developer",
                "EMD Developer",
                "Intern",
                "Trainee",
                "C++ Developer",
                "Accounts",
                "Developer",
              ].map((p) => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="department" label="Department">
            <Select>
              {[
                "IT",
                "EMDB",
                "Accounts",
                "Financial",
                "Python",
                "Engineering",
              ].map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="progress_status" label="Progress Status">
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
        </Col>
        <Col span={8}>
          <Form.Item name="status_date" label="Status Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Resume / Attachment">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
            {resumeUrl && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={`http://localhost:5000${resumeUrl.replace(
                    "/uploads",
                    "/api/uploads"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 View Resume
                </a>
              </div>
            )}
          </Form.Item>
        </Col>

        {isRejected && (
          <Col span={24}>
            <Form.Item
              name="rejection_reason"
              label="Rejection Reason"
              rules={[
                {
                  required: true,
                  message: "Please provide a rejection reason",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter reason for rejection"
                rows={3}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="update-btn"
              style={{ marginRight: 8 }}
            >
              Update
            </Button>
            <Button
              type="default"
              onClick={handleReview}
              className="review-btn"
            >
              Request Review
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CandidateForm;
