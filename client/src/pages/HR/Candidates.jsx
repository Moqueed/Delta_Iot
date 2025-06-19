import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Spin,
  InputNumber,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  addCandidate,
  getCandidates,
  searchCandidateByEmail,
  updateCandidate,
} from "../../api/candidates";
import { addToActiveList, updateActiveList } from "../../api/activeList";
import { uploadResumeToAll } from "../../api/upload";
import "./Candidate.css";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";

const { Option } = Select;

const Candidate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
   const [searchError, setSearchError] = useState(null);
  const [searchForm] = Form.useForm();
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const allCandidates = await getCandidates();
        setCandidateList(allCandidates);

        if (id) {
          setIsEditing(true);
          const selectedCandidate = allCandidates.find((c) => c.id === id);
          console.log("Fetched candidates:", allCandidates);
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
        }
      } catch (error) {
        message.error("Failed to fetch candidate details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id, form, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      message.success(`Selected file: ${selectedFile.name}`);
    }
  };

  const handleCandidateSearchByEmail = async (emailToSearch) => {
    try {
      const email = emailToSearch || form.getFieldValue("candidate_email_id");
      if (!email) {
        message.warning("Please enter a candidate email first.");
        return;
      }
      const response = await searchCandidateByEmail(email);
      if (response.message === "Candidate is in Rejected list") {
        message.error("❌ Candidate is in the Rejected list");
      } else if (response.message === "Candidate is already joined") {
        message.warning("⚠️ Candidate is already joined");
      } else if (response.message === "Candidate is already in Active List") {
        message.warning("⚠️ Candidate is already in Active List");
      } else if (response.message === "Candidate not found, you can proceed") {
        message.success("✅ No duplicates found. You can proceed!");
      } else {
        message.info(response.message);
      }
      return response;
    } catch (error) {
      console.error("❌ Error searching candidate:", error);
      message.error("Error checking candidate email. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    window.location.href = "/login";
  };

   const handleSearch = async () => {
      const values = searchForm.getFieldsValue();
      const search_input = values.search_input?.toString().trim();
  
      if (!search_input) {
        console.log("Search input is empty or invalid");
        return;
      }
  
      console.log("Searching for:", search_input);
  
      const filters = {};
      if (/\S+@\S+\.\S+/.test(search_input)) {
        filters.candidate_email = search_input;
      } else {
        filters.contact_number = search_input;
      }
  
      try {
        const result = await searchAssignments(filters);
        if (result && result.length > 0) {
          setSearchError(
            "Candidate already exists. Please verify before proceeding."
          );
        } else {
          setSearchError(null);
          message.success("No duplicate found. You can continue.");
        }
      } catch (error) {
        console.error(error);
        setSearchError("search failed");
        message.error("Search failed");
      }
    };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let uploadedFilePath = attachmentUrl;
      if (file) {
        const email = values.candidate_email_id;
        const response = await uploadResumeToAll(email, file);
        uploadedFilePath = response.candidateResume;
      }
      const candidateData = {
        ...values,
        attachments: uploadedFilePath,
        entry_date: values.entry_date.format("YYYY-MM-DD"),
        status_date: values.status_date.format("YYYY-MM-DD"),
      };

      if (isEditing) {
        await updateCandidate(id, candidateData);
        await updateActiveList(candidateData);
        message.success("Candidate updated successfully!");
      } else {
        await addCandidate(candidateData);
        const result = await handleCandidateSearchByEmail(
          candidateData.candidate_email_id
        );
        if (!result?.candidate?.id) {
          throw new Error("candidate ID not found after adding candidate");
        }
        await addToActiveList({
          ...candidateData,
          candidate_id: result.candidate.id,
        });
        message.success("Candidate added successfully!");
      }
      navigate("/hr-dashboard/active-list");
    } catch (error) {
      message.error(
        `Failed to ${isEditing ? "update" : "add"} candidate: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <Spin size="large" className="candidate-spinner" />;
  }

  return (
    <div className="candidate-container">
      <div className="candidate-header">
        <div className="header-left">
          <img src="/logo.png" alt="logo" className="logo" />
          <Link to="/admin-dashboard">
            <HomeOutlined className="home-icon" />
          </Link>
        </div>

        <h2>Candidates</h2>

        <div className="header-right">
          <span className="welcome-text">Welcome: Moqueed Ahmed</span>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="primary"
            danger
            size="small"
            style={{ marginLeft: "15px" }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="candidate-body">
        <div className="candidate-sidebar">
          <h3>Candidate List</h3>
          <div className="candidate-list">
            {candidateList.length > 0 ? (
              candidateList.map((candidate) => (
                <div className="candidate-card" key={candidate.id}>
                  <p className="candidate-name">{candidate.candidate_name}</p>
                </div>
              ))
            ) : (
              <p>No candidates found.</p>
            )}
          </div>
        </div>

        <div className="candidate-content">
          <Form
            form={searchForm}
            layout="inline"
            className="search-form"
            onFinish={handleSearch}
          >
            <Form.Item name="search_input" label="Candidate Email / Contact">
              <Input placeholder="Enter candidate email or contact number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>

          {searchError && (
            <div className="search-error-message">{searchError}</div>
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              progress_status: "Application Received",
              experience: 0,
            }}
            className="candidate-form"
          >
            {/* 🔥 HR Details */}
            <Form.Item
              name="HR_name"
              label="HR Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter HR name" />
            </Form.Item>

            <Form.Item
              name="HR_mail"
              label="HR Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Enter HR email" />
            </Form.Item>

            {/* 🔥 Candidate Info */}
            <Form.Item
              name="candidate_name"
              label="Candidate Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter candidate name" />
            </Form.Item>

            <Form.Item
              name="candidate_email_id"
              label="Candidate Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="contact_number"
              label="Contact Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>

            <Form.Item
              name="profile_stage"
              label="Profile stage"
              rules={[
                { required: true, message: "Please select profile stage" },
              ]}
            >
              <Select placeholder="Select Profile Stage">
                <Option value="Open">Open</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="current_company" label="Current Company">
              <Input placeholder="Enter current company" />
            </Form.Item>

            <Form.Item name="current_location" label="Current Location">
              <Input placeholder="Enter current location" />
            </Form.Item>

            <Form.Item name="permanent_location" label="Permanent Location">
              <Input placeholder="Enter permanent location" />
            </Form.Item>

            <Form.Item name="qualification" label="Qualification">
              <Input placeholder="Enter qualification" />
            </Form.Item>

            <Form.Item name="reference" label="Reference">
              <Input placeholder="Enter reference(eg., LinkedIn, Internal" />
            </Form.Item>

            {/* 🔥 Position & Department */}
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select position">
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

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select department">
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

            {/* 🔥 Progress & Status */}
            <Form.Item
              name="progress_status"
              label="Progress Status"
              rules={[{ required: true }]}
            >
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
            <Form.Item
              name="entry_date"
              label="Entry Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="status_date"
              label="Status Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* 🔥 Other Details */}
            <Form.Item name="skills" label="Skills">
              <Input.TextArea placeholder="Enter skills" />
            </Form.Item>

            <Form.Item name="experience" label="Experience (Years)">
              <InputNumber
                min={0}
                placeholder="Enter years of experience"
                style={{ width: "100%" }}
              />
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
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {attachmentUrl && (
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: "10px" }}
                >
                  View Resume
                </a>
              )}
            </Form.Item>

            <Form.Item className="form-submit">
              <Button type="primary" htmlType="submit" block loading={loading}>
                {isEditing ? "Update Candidate" : "Add Candidate"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Candidate;
