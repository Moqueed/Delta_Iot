import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, message, Spin, Button } from "antd";
import dayjs from "dayjs";
import { requestReview, updateActiveList } from "../../api/activeList";
import axiosInstance from "../../api";

const { Option } = Select;

const ActiveList = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axiosInstance.get("/api/activelist/fetch");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      message.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values, candidate_id) => {
    try {
      await updateActiveList({ ...values, candidate_id });
      message.success("Candidate updated successfully");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleReview = async (candidate) => {
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

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Active Candidates List
      </h2>

      {candidates.map((candidate, index) => (
        <Form
          key={index}
          layout="vertical"
          initialValues={{
            ...candidate,
            entry_date: dayjs(candidate.entry_date),
            status_date: dayjs(candidate.status_date),
          }}
          onFinish={(values) => handleUpdate(values, candidate.candidate_id)}
          style={{
            padding: 24,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            marginBottom: 32,
          }}
        >
          {/* All form items same as before, editable now */}
          <Form.Item name="HR_name" label="HR Name">
            <Input />
          </Form.Item>
          <Form.Item name="HR_mail" label="HR Email">
            <Input />
          </Form.Item>
          <Form.Item name="candidate_name" label="Candidate Name">
            <Input />
          </Form.Item>
          <Form.Item name="candidate_email_id" label="Candidate Email">
            <Input />
          </Form.Item>
          <Form.Item name="contact_number" label="Contact Number">
            <Input />
          </Form.Item>
          <Form.Item
            name="profile_stage"
            label="Profile stage"
            rules={[{ required: true, message: "Please select profile stage" }]}
          >
            <Select placeholder="Select Profile Stage">
              <Option value="Open">Open</Option>
              <Option value="Closed">Closed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="current_company" label="Current Company">
            <Input />
          </Form.Item>
          <Form.Item name="current_location" label="Current Location">
            <Input />
          </Form.Item>
          <Form.Item name="permanent_location" label="Permanent Location">
            <Input />
          </Form.Item>
          <Form.Item name="qualification" label="Qualification">
            <Input />
          </Form.Item>
          <Form.Item name="experience" label="Experience (Years)">
            <Input />
          </Form.Item>
          <Form.Item name="skills" label="Skills">
            <Select mode="tags" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="current_ctc" label="Current CTC">
            <Input />
          </Form.Item>
          <Form.Item name="expected_ctc" label="Expected CTC">
            <Input />
          </Form.Item>
          <Form.Item name="band" label="Band">
            <Select>
              {["L0", "L1", "L2", "L3", "L4"].map((band) => (
                <Option key={band} value={band}>
                  {band}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="reference" label="Reference">
            <Input />
          </Form.Item>
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
              ].map((pos) => (
                <Option key={pos} value={pos}>
                  {pos}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Select>
              {[
                "IT",
                "EMDB",
                "Accounts",
                "Financial",
                "Python",
                "Engineering",
              ].map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>
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
          <Form.Item name="entry_date" label="Entry Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status_date" label="Status Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "10px" }}
            >
              Update
            </Button>
            <Button
              type="default"
              onClick={() => handleReview(candidate)}
              style={{ background: "#faad14", color: "#fff", border: "none" }}
            >
              Request Review
            </Button>
          </Form.Item>
        </Form>
      ))}
    </div>
  );
};

export default ActiveList;
