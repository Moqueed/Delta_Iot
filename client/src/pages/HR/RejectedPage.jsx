// pages/RejectedDataPage.js
import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, Alert } from "antd";
import axios from "axios";

const { Title } = Typography;

const RejectedDataPage = () => {
  const [rejectedData, setRejectedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRejectedData = async () => {
      try {
        const response = await axios.get("/api/rejected/fetch");
        setRejectedData(response.data);
      } catch (err) {
        setError("Failed to fetch rejected data.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedData();
  }, []);

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "candidate_name",
      key: "candidate_name",
    },
    {
      title: "Email",
      dataIndex: "candidate_email_id",
      key: "candidate_email_id",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "progress_status",
      key: "progress_status",
      render: (status) => <Tag color="red">{status}</Tag>,
    },
    {
      title: "Rejection Reason",
      dataIndex: "rejection_reason",
      key: "rejection_reason",
    },
    {
      title: "Date",
      dataIndex: "status_date",
      key: "status_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Rejected Candidates</Title>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Table
          dataSource={rejectedData}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
        />
      )}
    </div>
  );
};

export default RejectedDataPage;
