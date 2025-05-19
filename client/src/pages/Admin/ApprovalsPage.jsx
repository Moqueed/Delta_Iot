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
} from "antd";
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

  const handleFieldChange = (id, field, value) => {
    setFormStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleReview = async (email, decision) => {
    try {
      await reviewCandidateStatus(email, {
        approval_status: decision?.value || decision,
      });
      message.success(`Candidate ${decision?.value || decision}`);
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
      status === "Approved" ? "green" : status === "Rejected" ? "red" : "orange";
    return <Tag color={color}>{status}</Tag>;
  };

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
                {[
                  { label: "HR Name", key: "HR_name" },
                  { label: "HR Mail", key: "HR_mail" },
                  { label: "Entry Date", key: "entry_date" },
                  { label: "Candidate Name", key: "candidate_name" },
                  { label: "Candidate Email", key: "candidate_email_id" },
                  { label: "Contact Number", key: "contact_number" },
                  { label: "Position", key: "position" },
                  { label: "Department", key: "department" },
                  { label: "Band", key: "band" },
                  { label: "Progress Status", key: "progress_status" },
                  { label: "Status Date", key: "status_date" },
                  { label: "Profile Stage", key: "profile_stage" },
                  { label: "Current Company", key: "current_company" },
                  { label: "Current Location", key: "current_location" },
                  { label: "Permanent Location", key: "permanent_location" },
                  { label: "Qualification", key: "qualification" },
                  { label: "Experience (years)", key: "experience" },
                  { label: "Current CTC", key: "current_ctc" },
                  { label: "Expected CTC", key: "expected_ctc" },
                  { label: "Notice Period", key: "notice_period" },
                  { label: "Reference", key: "reference" },
                  { label: "Attachments", key: "attachments" },
                ].map(({ label, key }) => (
                  <Col span={8} key={key}>
                    <Form.Item label={label}>
                      <Input
                        value={formData[key]}
                        onChange={(e) =>
                          handleFieldChange(approval.id, key, e.target.value)
                        }
                      />
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
                        handleFieldChange(approval.id, "skills", e.target.value)
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
                        handleFieldChange(approval.id, "comments", e.target.value)
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
                      handleReview(
                        formData.candidate_email_id,
                        "Approved",
                      )
                    }
                    style={{ marginRight: 8 }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    onClick={() =>
                      handleReview(
                        formData.candidate_email_id,
                        "Rejected",
                      )
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
