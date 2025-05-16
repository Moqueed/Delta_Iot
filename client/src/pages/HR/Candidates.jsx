import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, message, Spin, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addCandidate, getCandidates, searchCandidateByEmail, updateCandidate } from "../../api/candidates";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { uploadFile } from "../../api/upload";
import { addToActiveList, updateActiveList } from "../../api/activeList";


const { Option } = Select;

const CandidateForm = () => {
  const { id } = useParams(); // Check if editing
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
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
            setAttachmentUrl(selectedCandidate.attachments);

          } else {
            message.error("Candidate not found!");
            navigate("/hr-dashboard/activeList");
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

  // 🎯 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      message.success(`Selected file: ${selectedFile.name}`);
    }
  };

  // 🎯 Submit handler for Add/Update
  const handleSubmit = async (values) => {
    setLoading(true);
      try {
        //check duplicates first
        const emailCheck = await searchCandidateByEmail(values.candidate_email_id);
        if(emailCheck.message !== "Candidate not found, you can proceed"){
          message.warning(emailCheck.message);
          setLoading(false);
          return;
        }

        let uploadedFilePath = attachmentUrl;
  
        // 🎯 Upload file if one is selected
        if (file) {
          const email = values.candidate_email_id;
          const response = await uploadFile(email, file);
          uploadedFilePath = response.candidateResume; // Get the uploaded file path
        }

      const candidateData = {
        ...values,
        attachments: uploadedFilePath,
        entry_date: values.entry_date.format("YYYY-MM-DD"),
        status_date: values.status_date.format("YYYY-MM-DD"),
      };

//       const candidateData = {
//   "HR_name": "Moqueed Ahmed",
//   "HR_mail": "moqueed.pearl@gmail.com",
//   "candidate_name": "Alice Doe",
//   "candidate_email_id": "alice.doe@example.com",
//   "contact_number": "9876543210",
//   "current_company": "ABC Pvt Ltd",
//   "current_location": "Bangalore",
//   "permanent_location": "Hyderabad",
//   "qualification": "B.Tech",
//   "experience": "3",
//   "skills": "Django,flask",
//   "current_ctc": "7 LPA",
//   "expected_ctc": "9 LPA",
//   "band": "L0",
//   "reference": "Internal",
//   "position": "Python Developer",
//   "department": "Engineering",
//   "progress_status": "L1 Interview",
//   "status_date": "2025-05-02",
//   "entry_date": "2025-05-01"
// }


      if (isEditing) {
        await updateCandidate(id, candidateData);
        await updateActiveList(candidateData);
        message.success("Candidate updated successfully!");
      } else {
        await addCandidate(candidateData);
        // await addToActiveList(candidateData);
        // message.success("Candidate added successfully!");
      

      //Fetch the candidate_id using email
      const result = await searchCandidateByEmail(candidateData.candidate_email_id);
      if(!result || !result.candidate || !result.candidate.id){
        throw new Error("candidate ID not found after adding candidate");
      }

        const candidate_id = result.candidate.id;
        //add to activelist with candidate_id
        await addToActiveList({...candidateData, candidate_id});
        message.success("candidate added successfully")
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

      <Form.Item
  name="candidate_email_id"
  label="Candidate Email"
  rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
>
  <Input
    placeholder="Enter candidate email"
    addonAfter={
      <Button
        type="link"
        onClick={async () => {
          try {
            const email = form.getFieldValue("candidate_email_id");
            if (!email) {
              message.warning("Please enter an email before searching.");
              return;
            }

            const result = await searchCandidateByEmail(email);
            if (result.message === "Candidate not found, you can proceed") {
              message.success(result.message);
            } else {
              message.warning(result.message);
            }
          } catch (err) {
            message.error("Error checking candidate. Try again.");
          }
        }}
      >
        Search
      </Button>
    }
  />
</Form.Item>
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

        <Form.Item name="profile_stage" label="Profile stage" rules={[{required: true, message: "Please select profile stage"}]}>
          <Select placeholder="Select Profile Stage">
            <Option value="Open">Open</Option>
            <Option value="Closed">Closed</Option>
            </Select>
        </Form.Item>

        <Form.Item name="current_company" label="Current Company">
          <Input placeholder="Enter current company"/>
        </Form.Item>

        <Form.Item name="current_location" label="Current Location">
          <Input placeholder="Enter current location"/>
        </Form.Item>

        <Form.Item name="permanent_location" label="Permanent Location">
          <Input placeholder="Enter permanent location"/>
        </Form.Item>

        <Form.Item name="qualification" label="Qualification">
          <Input placeholder="Enter qualification"/>
        </Form.Item>

        <Form.Item name="reference" label="Reference">
          <Input placeholder="Enter reference(eg., LinkedIn, Internal"/>
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
            {["IT", "EMDB", "Accounts", "Financial", "Python","Engineering"].map((dept) => (
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
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
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
