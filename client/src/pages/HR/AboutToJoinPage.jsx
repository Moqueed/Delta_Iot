import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import { fetchAboutToJoin } from "../../api/totalData";


const AboutToJoinPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAboutToJoin();
        setData(response);
      } catch (error) {
        message.error("Failed to load About To Join");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const columns = [
    { title: "HR Name", dataIndex: "HR_name", key: "HR_name" },
    { title: "HR Email", dataIndex: "HR_mail", key: "HR_mail" },
    { title: "Candidate Name", dataIndex: "candidate_name", key: "candidate_name" },
    { title: "Email", dataIndex: "candidate_email_id", key: "candidate_email_id" },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Progress Status", dataIndex: "progress_status", key: "progress_status" },
    { title: "Entry Date", dataIndex: "entry_date", key: "entry_date" },
    { title: "Status Date", dataIndex: "status_date", key: "status_date" },
    
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center" }}>About To Join</h2>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="candidate_email_id" />
      )}
    </div>
  );
};

export default AboutToJoinPage;
