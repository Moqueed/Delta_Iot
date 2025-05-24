import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Tag,
  Divider,
  Row,
  Col,
  Spin,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api";
import {
  cancelApprovalRequest,
  reviewCandidateStatus,
  updateApprovalById,
} from "../../api/approval";

const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [formStates, setFormStates] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/approvals/fetch");
      const data = response.data;

      setApprovals(data);

      const editableStates = {};
      data.forEach((item) => {
        editableStates[item.id] = { ...item };
      });
      setFormStates(editableStates);
    } catch (error) {
      message.error("Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (id, key, value) => {
    setFormStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleFileChange = (id, file) => {
    setFormStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        attachments: file,
      },
    }));
  };

  const handleReview = async (email, decision) => {
    try {
      await reviewCandidateStatus(email, { approval_status: decision });
      message.success(`Candidate ${decision}`);
      fetchApprovals();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelApprovalRequest(id);
      message.success("Approval cancelled");
      fetchApprovals();
    } catch (error) {
      message.error("Failed to cancel approval");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateApprovalById(id, formStates[id]);
      message.success("Approval updated successfully");
      fetchApprovals();
    } catch (error) {
      message.error("Failed to update approval");
    }
  };

  const getStatusTag = (status) => {
    const color =
      status === "Approved"
        ? "green"
        : status === "Rejected"
        ? "red"
        : "orange";
    return <Tag color={color}>{status}</Tag>;
  };

  const fields = [
    { label: "HR Name", key: "HR_name" },
    { label: "HR Mail", key: "HR_mail" },
    { label: "Entry Date", key: "entry_date" },
    { label: "Candidate Name", key: "candidate_name" },
    { label: "Candidate Email", key: "candidate_email_id" },
    { label: "Contact Number", key: "contact_number" },
    {
      label: "Position",
      key: "position",
      type: "dropdown",
      options: [
        "Python Developer",
        "EMD Developer",
        "Intern",
        "Trainee",
        "C++ Developer",
        "Accounts",
        "Developer",
      ],
    },
    {
      label: "Department",
      key: "department",
      type: "dropdown",
      options: ["IT", "EMDB", "Accounts", "Financial", "Python", "Engineering"],
    },
    {
      label: "Band",
      key: "band",
      type: "dropdown",
      options: ["L0", "L1", "L2", "L3"],
    },
    {
      label: "Progress Status",
      key: "progress_status",
      type: "dropdown",
      options: [
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
      ],
    },
    { label: "Status Date", key: "status_date" },
    {
      label: "Profile Stage",
      key: "profile_stage",
      type: "dropdown",
      options: ["Open", "closed"],
    },
    { label: "Current Company", key: "current_company" },
    { label: "Current Location", key: "current_location" },
    { label: "Permanent Location", key: "permanent_location" },
    { label: "Qualification", key: "qualification" },
    { label: "Experience (years)", key: "experience" },
    { label: "Current CTC", key: "current_ctc" },
    { label: "Expected CTC", key: "expected_ctc" },
    { label: "Notice Period", key: "notice_period" },
    { label: "Reference", key: "reference" },
    { label: "Attachments", key: "attachments", type: "upload" },
  ];

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Approval Requests</h1>
      {loading ? (
        <Spin />
      ) : approvals.length === 0 ? (
        <p>No approval requests.</p>
      ) : (
        approvals.map((approval) => {
          const formData = formStates[approval.id] || {};
          return (
            <Form
              key={approval.id}
              layout="vertical"
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: 24,
                marginBottom: 32,
                background: "#fafafa",
              }}
            >
              <Row gutter={16}>
                {fields.map((field) => (
                  <Col span={8} key={field.key}>
                    <Form.Item label={field.label}>
                      {field.type === "dropdown" ? (
                        <Select
                          value={formData[field.key]}
                          onChange={(value) =>
                            handleFieldChange(approval.id, field.key, value)
                          }
                        >
                          {field.options.map((opt) => (
                            <Select.Option key={opt} value={opt}>
                              {opt}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : field.type === "upload" ? (
                        <>
                          <Upload
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={({ file }) =>
                              handleFileChange(approval.id, file)
                            }
                          >
                            <Button icon={<UploadOutlined />}>
                              Upload File
                            </Button>
                          </Upload>
                          {formData.attachments && (
                            typeof formData.attachments === "string" ? (
                              <div style={{ marginTop: 8 }}>
                                <a
                                  href={formData.attachments}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  📄 {formData.attachments}
                                </a>
                              </div>
                            ) : (
                              <div style={{ marginTop: 8 }}>
                                📄 <strong>{formData.attachments.name}</strong>
                              </div>
                            )
                          )}
                        </>
                      ) : (
                        <Input
                          value={formData[field.key]}
                          onChange={(e) =>
                            handleFieldChange(
                              approval.id,
                              field.key,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                ))}

                <Col span={8}>
                  <Form.Item label="Approval Status">
                    {getStatusTag(formData.approval_status)}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Skills">
                    <Input.TextArea
                      value={formData.skills}
                      onChange={(e) =>
                        handleFieldChange(
                          approval.id,
                          "skills",
                          e.target.value
                        )
                      }
                      autoSize={{ minRows: 2 }}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Comments">
                    <Input.TextArea
                      value={formData.comments}
                      onChange={(e) =>
                        handleFieldChange(
                          approval.id,
                          "comments",
                          e.target.value
                        )
                      }
                      autoSize={{ minRows: 2 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {formData.approval_status === "Pending" && (
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() =>
                      handleReview(formData.candidate_email_id, "Approved")
                    }
                    style={{ marginRight: 8 }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    onClick={() =>
                      handleReview(formData.candidate_email_id, "Rejected")
                    }
                    style={{ marginRight: 8 }}
                  >
                    Reject
                  </Button>
                  <Popconfirm
                    title="Cancel this approval?"
                    onConfirm={() => handleCancel(approval.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="default" style={{ marginRight: 8 }}>
                      Cancel
                    </Button>
                  </Popconfirm>
                  <Button
                    onClick={() => handleUpdate(approval.id)}
                    type="default"
                  >
                    Update
                  </Button>
                </Form.Item>
              )}
              <Divider />
            </Form>
          );
        })
      )}
    </div>
  );
};

export default ApprovalsPage;
